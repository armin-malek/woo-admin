import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { CalcOrderPoints } from "../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { fileUrl } from "../../../../server/common/s3";
import { prisma } from "../../../../server/db/client";
import { authOptions } from "../../auth/[...nextauth]";

const postSchema = z.object({
  items: z.array(z.object({ id: z.number(), quantity: z.number().min(1) })), // array of Items
  orderId: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { orderId, items } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        status: false,
        msg: "برای دریافت اطلاعات باید وارد حساب خود شده باشید",
      });
      return;
    }

    if (!postSchema.safeParse(req.body)) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let order = await prisma.marketOrder.findUnique({
      where: {
        id: orderId,
      },
      include: { Market: { include: { User: true } } },
    });

    if (order.Market.User.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این فاکتور متعلق به شما نیست",
      });
    }

    if (order.status != "Submitted") {
      return res.send({
        status: false,
        msg: "فاکتور موردنظر در حال پردازش یا تکمیل شده است و نمی توان آن را ویراش کرد.",
      });
    }

    let products = await prisma.product.findMany({
      where: { id: { in: items.map((x) => parseInt(x.id)) } },
      include: {
        ProductImage: { select: { File: { select: { name: true } } } },
      },
    });
    //let availableItems = [];
    let newItems = [];
    let newTotalPrice = 0;
    items.forEach((item) => {
      let product = products.find((product) => product.id == item.id);
      if (product) {
        newItems.push({
          id: product.id,
          name: product.name,
          price: product.basePrice,
          quantity: item.quantity,
          Image: fileUrl(product.ProductImage?.File?.name),
        });

        newTotalPrice += product.basePrice * item.quantity;
      }
      //availableItems.push(item);
    });

    newTotalPrice = Math.round(newTotalPrice);
    // update items

    await prisma.marketOrder.update({
      where: { id: order.id },
      data: {
        items: newItems,
        amount: newTotalPrice,
        points: CalcOrderPoints(newTotalPrice, newItems.length),
      },
      select: { Market: { select: { id: true } } },
    });

    res.send({ status: true, msg: "فاکتور با موفقیت ویرایش شد" });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
