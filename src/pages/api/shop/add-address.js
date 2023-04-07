import { z } from "zod";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { currentIranTimeDB } from "../../../server/common/time";
import { prisma } from "../../../server/db/client";
import { LimitHttpMethode } from "../../../server/common/requests";

const postSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  address: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");
    const { latitude, longitude, address } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { Customer: { select: { id: true } } },
    });
    await prisma.customerAddress.create({
      data: {
        DateCreated: currentIranTimeDB(),
        gpsLong: longitude,
        gpsLat: latitude,
        address: address,
        Customer: { connect: { id: user.Customer.id } },
      },
    });
    res.send({ status: true, msg: "آدرس جدید اضافه شد." });

    //res.send({ status: true, data: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
