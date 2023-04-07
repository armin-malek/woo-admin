import { z } from "zod";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { currentIranTimeDB } from "../../../server/common/time";
import { CalcOrderPoints, decodeInt } from "../../../server/common/functions";
import jmoment from "moment-jalaali";
import { prisma } from "../../../server/db/client";
import { fileUrl } from "../../../server/common/s3";
import { LimitHttpMethode } from "../../../server/common/requests";

const postSchema = z.object({
  marketID: z.string(),
});

//const handler = async (req: NextApiRequest, res: NextApiResponse) => {
const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    if (session.user.role != "Customer") {
      return res.send({
        status: false,
        msg: "صرفا مشتریان اجازه افزودن فروشگاه را دارند.",
      });
    }
    let { marketID } = req.body;
    marketID = decodeInt(marketID);
    if (!marketID) {
      return res.send({ status: false, msg: "فروشگاه پیدا نشد." });
    }
    let market = await prisma.market.findUnique({ where: { id: marketID } });
    if (!market) {
      return res.send({ status: false, msg: "فروشگاه پیدا نشد." });
    }

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { Customer: { select: { id: true } } },
    });

    // check if user has the market
    // let existing
    // await prisma.customerMarkets.create({
    //   data: {
    //     Customer: { connect: { id: user.Customer.id } },
    //     dateCreated: currentIranTimeDB(),
    //     Market: { connect: { id: marketID } },
    //   },
    // });
    await prisma.customerMarkets.upsert({
      where: {
        customerId_marketId: {
          customerId: user.Customer.id,
          marketId: marketID,
        },
      },
      update: {},
      create: {
        Customer: { connect: { id: user.Customer.id } },
        dateCreated: currentIranTimeDB(),
        Market: { connect: { id: marketID } },
      },
    });
    res.send({ status: true, msg: "فروشگاه اضافه شد." });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
