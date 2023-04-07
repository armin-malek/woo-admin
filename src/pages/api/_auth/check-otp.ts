import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { currentIranTimeDB } from "../../../server/common/time";
import { generate as passGen } from "generate-password";
import { prisma } from "../../../server/db/client";

const otpCheckSchema = z.object({
  mobile: z.string().regex(/^09[0-9]{9}$/gm),
  otp: z.string().regex(/^[0-9]{5}$/gm),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res.send({ status: false, msg: "only post request are " });
      return;
    }

    if (!otpCheckSchema.safeParse(req.body)) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { mobile: req.body.mobile },
      select: { otp: true },
    });
    if (user.otp !== req.body.otp) {
      return res.send({
        status: false,
        msg: "کد تایید وارد شده صحیح نیست",
      });
    }
    res.send({ status: true, data: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
