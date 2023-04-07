import { getSession } from "next-auth/react";
import { encodeInt, showNoImage } from "../../../server/common/functions";
import { LimitHttpMethode } from "../../../server/common/requests";
import { fileUrl } from "../../../server/common/s3";
import { prisma } from "../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await getSession({ req });
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: {
        Customer: {
          select: {
            CustomerMarkets: {
              select: {
                Market: {
                  select: {
                    id: true,
                    name: true,
                    marketAddress: {
                      select: {
                        City: { select: { name: true } },
                        Region: { select: { name: true } },
                      },
                    },
                    Image: { select: { File: { select: { name: true } } } },
                    logo: { select: { File: { select: { name: true } } } },
                  },
                },
              },
              orderBy: { dateCreated: "desc" },
            },
          },
        },
      },
    });
    user?.Customer?.CustomerMarkets?.map((item) => {
      item.Market.id = encodeInt(item.Market.id);
      item.Market.logo = fileUrl(item.Market.logo?.File?.name) || showNoImage();
      item.Market.Image =
        fileUrl(item.Market.Image?.File?.name) || showNoImage();
    });
    res.send({
      status: true,
      markets: user?.Customer?.CustomerMarkets,
    });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
