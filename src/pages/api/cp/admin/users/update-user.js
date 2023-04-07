import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  mobile: z.string().regex(/^09[0-9]{9}$/gm),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { userId, fullName, mobile } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { mobile: mobile },
    });
    if (existingUser && existingUser.id != userId) {
      return res.send({
        status: false,
        msg: "حسابی با این شماره وجود دارد!",
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: fullName,
        mobile: mobile,
      },
    });

    res.send({ status: true, msg: "کاربر با موفقیت ویرایش داده شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
