import sharp from "sharp";
import { z } from "zod";
import { base64TOBuffer } from "../../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { putObject } from "../../../../../server/common/s3";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  mobile: z.string().regex(/^09[0-9]{9}$/gm),
  fullName: z.string(),
  marketName: z.string(),
  province: z.number(),
  city: z.number(),
  region: z.number(),
  gpsCordinates: z.string(),
  address: z.string(),
  image: z.string().nullish(),
  logo: z.string().nullish(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const {
      mobile,
      fullName,
      marketName,
      province,
      city,
      region,
      gpsCordinates,
      address,
    } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { mobile: mobile },
    });
    if (existing) {
      return res.send({
        status: false,
        msg: "کاربری با این شماره موبایل وجود دارد",
      });
    }

    let uploadedImage;
    if (req.body.image) {
      let buffer = await sharp(base64TOBuffer(req.body.image))
        .resize(250)
        .webp()
        .toBuffer();
      uploadedImage = await putObject(buffer, "image/webp");
    }

    let uploadedLogo;
    if (req.body.logo) {
      let buffer = await sharp(base64TOBuffer(req.body.logo))
        .resize(250)
        .webp()
        .toBuffer();
      uploadedLogo = await putObject(buffer, "image/webp");
    }

    await prisma.user.create({
      data: {
        mobile: mobile,
        fullName: fullName,
        dateRegister: currentIranTimeDB(),
        role: "Market",
        MarketOwned: {
          create: {
            name: marketName,
            Image: uploadedImage
              ? {
                  create: {
                    File: {
                      create: {
                        dateAdded: currentIranTimeDB(),
                        fileType: "Image",
                        name: uploadedImage.fileName,
                      },
                    },
                  },
                }
              : undefined,
            logo: uploadedLogo
              ? {
                  create: {
                    File: {
                      create: {
                        dateAdded: currentIranTimeDB(),
                        fileType: "Image",
                        name: uploadedLogo.fileName,
                      },
                    },
                  },
                }
              : undefined,
            marketAddress: {
              create: {
                gpsLat: gpsCordinates?.split(",")[0],
                gpsLong: gpsCordinates?.split(",")[1],
                address: address,
                Province: { connect: { id: province } },
                City: { connect: { id: city } },
                Region: { connect: { id: region } },
              },
            },
          },
        },
      },
    });

    res.send({ status: true, msg: "کاربر با موفقیت ایجاد شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
export default handler;
