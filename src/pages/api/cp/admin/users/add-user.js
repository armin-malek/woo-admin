import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  mobile: z.string().regex(/^09[0-9]{9}$/gm),
  fullName: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { mobile, fullName } = req.body;

    if (!postSchema.safeParse(req.body)) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let existing = await prisma.user.findUnique({ where: { mobile: mobile } });
    if (existing) {
      return res.send({
        status: false,
        msg: "کاربری با این شماره موبایل وجود دارد",
      });
    }

    await prisma.user.create({
      data: {
        mobile: mobile,
        fullName: fullName,
        dateRegister: currentIranTimeDB(),
        role: "Customer",
        Customer: { create: {} },
      },
    });

    res.send({ status: true, msg: "کاربر با موفقیت ایجاد شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
