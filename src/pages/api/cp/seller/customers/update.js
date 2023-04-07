import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  fullName: z.string().nullable(),
  mobile: z.string().regex(!/^09[0-9]{9}$/gm),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { fullName, mobile } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }
    const marketOwner = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { MarketOwned: { select: { id: true } } },
    });

    let user = await prisma.user.findUnique({
      where: {
        mobile: mobile,
      },
      select: {
        id: true,
        role: true,
        Customer: {
          select: {
            CustomerMarkets: {
              where: { Market: { id: marketOwner.MarketOwned.id } },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          dateRegister: currentIranTimeDB(),
          mobile: mobile,
          fullName: fullName || undefined,
          role: "Customer",

          Customer: {
            create: {
              CustomerMarkets: {
                create: {
                  dateCreated: currentIranTimeDB(),
                  Market: { connect: { id: marketOwner.MarketOwned.id } },
                },
              },
            },
          },
        },
      });
      return res.send({
        status: true,
        msg: "مشتری با موفقیت اضافه شد.",
      });
    }

    if (user.role != "Customer") {
      return res.send({
        status: false,
        msg: "این کاربر قابل افزودن نیست",
      });
    }

    if (user.Customer.CustomerMarkets) {
      return res.send({
        status: false,
        msg: "این کاربر از قبل مشتری شماست",
      });
    }
    /*
    let user = await prisma.user.upsert({
      where: {
        mobile: mobile,
      },
      create: {
        dateRegister: currentIranTimeDB(),
        mobile: mobile,
        fullName: fullName || undefined,
        role: "Market",

        Customer: {
          create: {
            CustomerMarkets: {
              create: {
                dateCreated: currentIranTimeDB(),
                Market: { connect: { id: marketOwner.MarketOwned.id } },
              },
            },
          },
        },
      },
      update: {Customer:{}},
      select: {
        Customer: {
          select: {
            id: true,
            CustomerMarkets: {
              where: { Market: { id: marketOwner.id } },
              select: { id: true },
            },
          },
        },
      },
    });

    if(!user.Customer.CustomerMarkets)
    */

    if (order.Market.User.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این فاکتور متعلق به شما نیست",
      });
    }

    if (order.status != "WaitingMarket") {
      return res.send({
        status: false,
        msg: "فاکتور قابل برگشت نیست.",
      });
    }

    // update order

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: status,
      },
    });

    // notify post man
    // if canceled notify the customer
    res.send({ status: true, msg: "فاکتور با موفقیت نهایی شد" });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
