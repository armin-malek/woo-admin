import { z } from "zod";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { currentIranTimeDB } from "../../../server/common/time";
import { decodeInt } from "../../../server/common/functions";
import { prisma } from "../../../server/db/client";
import { fileUrl } from "../../../server/common/s3";
import { LimitHttpMethode } from "../../../server/common/requests";
import { startPayment } from "../../../server/common/payment";
import requestIp from "request-ip";

const postSchema = z.object({
  products: z.array(z.object({ id: z.string(), quantity: z.number().min(1) })),
  paymentMethode: z.enum(["Online", "Offline"]),
  marketID: z.string(),
  AddressID: z.number(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.send({
        status: false,
        msg: "برای دریافت اطلاعات باید وارد حساب خود شده باشید",
      });
      return;
    }

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    req.body.marketID = decodeInt(req.body.marketID);
    req.body.products.map((product) => {
      product.id = decodeInt(product.id);
    });
    const dbProducts = await prisma.marketProducts.findMany({
      where: {
        id: { in: req.body.products.map((item) => item.id) },
        isVisible: true,
        Market: { id: req.body.marketID },
      },
      include: {
        Product: {
          include: {
            ProductInfo: true,
            Image: { select: { File: { select: { name: true } } } },
          },
        },
      },
    });

    let totalAmount = 0;
    let items = [];
    dbProducts.map((dbProduct) => {
      //off
      dbProduct.Product.ProductInfo.basePrice =
        dbProduct.Product.ProductInfo.basePrice;
      req.body.products.map((cartProdut) => {
        if (dbProduct.id == cartProdut.id) {
          totalAmount +=
            dbProduct.Product.ProductInfo.basePrice * cartProdut.quantity;
          items.push({
            id: dbProduct.id,
            name: dbProduct.Product.ProductInfo.name,
            price: dbProduct.Product.ProductInfo.basePrice,
            quantity: cartProdut.quantity,
            Image: fileUrl(dbProduct.Product.Image?.File?.name),
          });
        }
      });
    });

    totalAmount = Math.round(totalAmount);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        mobile: true,
        Customer: { select: { id: true } },
      },
    });
    let startedPayment;
    if (req.body.paymentMethode == "Online") {
      startedPayment = await startPayment(totalAmount * 10, user.mobile);
    }
    await prisma.order.create({
      data: {
        Customer: { connect: { id: user.Customer.id } },
        amount: totalAmount,
        date: currentIranTimeDB(),
        status: startedPayment ? "Unpaid" : "WaitingMarket",
        Payment: {
          create: {
            PaymentMethode: req.body.paymentMethode,
            status: "INPROGRESS",
            userIP: requestIp.getClientIp(req),
            dateCreated: currentIranTimeDB(),
            gateWay: startedPayment?.gateWay,
            transActionCode: startedPayment?.trackId.toString(),
          },
        },
        items: items,
        Market: { connect: { id: req.body.marketID } },
        CustomerAddress: { connect: { id: req.body.AddressID } },
      },
    });

    // console.log("products", products);

    //await prisma.marketOrder.create({data:{Market:}})
    if (startedPayment)
      return res.send({
        status: true,
        redirect: startedPayment.paymentUrl,
      });
    res.send({
      status: true,
      msg: "سفارش شما با موفقیت ثبت شد",
    });

    //res.send({ status: true, data: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
