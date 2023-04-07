import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { currentIranTimeDB } from "../../../server/common/time";
import { generate as passGen } from "generate-password";
import { SendSMS } from "../../../server/common/sms";
import { LimitHttpMethode } from "../../../server/common/requests";
import moment from "moment-timezone";
import { prisma } from "../../../server/db/client";
import { decodeInt } from "../../../server/common/functions";
const SMSWaitTime = process.env.NODE_ENV == "production" ? 120 : 10;

const otpReqSchema = z.object({
  mobile: z.string().regex(/^09[0-9]{9}$/gm),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    LimitHttpMethode(req, res, "POST");
    if (!otpReqSchema.safeParse(req.body)) {
      return res.send({ status: false, msg: "شکل شماره موبایل صحیح نیست" });
    }

    const user = await prisma.user.findUnique({
      where: { mobile: req.body.mobile },
      select: {
        id: true,
        lastSMSDate: true,
        Customer: { select: { id: true } },
      },
    });
    const time = currentIranTimeDB();

    if (user && user.lastSMSDate) {
      if (moment(user.lastSMSDate).add(SMSWaitTime, "seconds").isAfter(time)) {
        // in sms limit
        return res.send({
          status: false,
          msg: `تا ${Math.abs(
            moment().diff(moment(user.lastSMSDate), "seconds") - SMSWaitTime
          )} ثانیه بعد نمی توانید کد جدیدی دریافت کنید`,
        });
      }
    }

    const otpCode = passGen({
      length: 5,
      numbers: true,
      symbols: false,
      lowercase: false,
      uppercase: false,
    });
    const newUser = await prisma.user.upsert({
      where: { mobile: req.body.mobile },
      create: {
        mobile: req.body.mobile,
        role: "Customer",
        dateRegister: time,
        otp: otpCode,
        lastSMSDate: time,
        Customer: { create: {} },
      },
      update: { otp: otpCode, lastSMSDate: time },
      select: { id: true, Customer: { select: { id: true } } },
    });

    let { marketID } = req.cookies;
    marketID = decodeInt(marketID).toString();
    if (marketID) {
      const market = await prisma.market.findUnique({
        where: { id: parseInt(marketID) },
      });
      if (market) {
        await prisma.customerMarkets.upsert({
          where: {
            customerId_marketId: {
              customerId: newUser.Customer.id,
              marketId: parseInt(marketID),
            },
          },
          update: {},
          create: {
            Customer: { connect: { id: newUser.Customer.id } },
            dateCreated: currentIranTimeDB(),
            Market: { connect: { id: parseInt(marketID) } },
          },
        });
      }
    }

    await SendSMS(req.body.mobile, "AuthCode", { otpcode: otpCode });

    res.send({
      status: true,
      data: {
        msg: "کد تایید ارسال شد.",
        countDown: SMSWaitTime,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
