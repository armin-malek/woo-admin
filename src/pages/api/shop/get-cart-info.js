import { LimitHttpMethode } from "../../../server/common/requests";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { EngDayNameToFa, parseDate } from "../../../server/common/time";
import moment from "moment-jalaali";
import { prisma } from "../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const session = await unstable_getServerSession(req, res, authOptions);

    const Addresses = await prisma.customerAddress.findMany({
      where: { Customer: { User: { id: session.user.id } } },
    });
    res.send({
      status: true,
      data: {
        Addresses,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "خطایی رخ داد." });
  }
};

export default handler;
