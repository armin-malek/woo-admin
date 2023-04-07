import { z } from "zod";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import { LimitHttpMethode } from "../../../server/common/requests";

const postSchema = z.object({
  AddressID: z.number().min(0),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");
    const { AddressID } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!postSchema.safeParse(req.body).success) {
      res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
      return;
    }

    const dbAddress = await prisma.customerAddress.findUnique({
      where: { id: AddressID },
      select: {
        Customer: { select: { User: { select: { id: true } } } },
        Order: { select: { id: true } },
      },
    });
    if (!dbAddress) {
      return res.send({ status: false, msg: "آدرس مورد نظر وجود ندارد." });
    }
    if (dbAddress.Customer.User.id !== session.user.id) {
      return res.send({ status: false, msg: "آین آدرس متعلق به شما نیست" });
    }

    if (dbAddress.Order.length > 0) {
      await prisma.customerAddress.update({
        where: { id: AddressID },
        data: {
          isRemoved: true,
        },
      });
    } else {
      await prisma.customerAddress.delete({
        where: { id: AddressID },
      });
    }
    setTimeout(() => {
      res.send({ status: true, msg: "آدرس با موفقیت حذف شد." });
    }, 1000);
    //res.send({ status: true, data: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
