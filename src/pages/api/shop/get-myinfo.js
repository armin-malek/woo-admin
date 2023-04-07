import { getSession } from "next-auth/react";
import { LimitHttpMethode } from "../../../server/common/requests";
import { prisma } from "../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await getSession({ req });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { fullName: true },
    });

    res.send({ status: true, data: user });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
