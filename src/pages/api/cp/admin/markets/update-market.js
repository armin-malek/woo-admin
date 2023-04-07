import { z } from "zod";
import { putObject } from "../../../../../server/common/s3";
import sharp from "sharp";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import {
  base64TOBuffer,
  parseBool,
} from "../../../../../server/common/functions";

const postSchema = z.object({
  marketId: z.number(),
  ownerName: z.string(),
  ownerMobile: z.string().regex(/^09[0-9]{9}$/gm),
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
    const parse = postSchema.safeParse(req.body);
    if (!parse.success) {
      console.log(parse.error);
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const market = await prisma.market.findUnique({
      where: { id: parseInt(req.body.marketId) },
      select: {
        User: { select: { mobile: true } },
        id: true,
        Image: {
          select: { id: true, File: { select: { id: true, name: true } } },
        },
        logo: {
          select: { id: true, File: { select: { id: true, name: true } } },
        },
      },
    });

    if (req.body.ownerMobile != market.User.mobile) {
      const exists = await prisma.user.findUnique({
        where: { mobile: req.body.ownerMobile },
      });
      if (exists) {
        return res.send({ status: false, msg: "حسابی با این شماره وجود دارد" });
      }
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

    await prisma.market.update({
      where: { id: market.id },
      data: {
        User: {
          update: {
            fullName: req.body.ownerName,
            mobile: req.body.ownerMobile,
          },
        },
        name: req.body.marketName.trim(),
        marketAddress: {
          update: {
            address: req.body.address,
            Province: { connect: { id: parseInt(req.body.province) } },
            City: { connect: { id: parseInt(req.body.city) } },
            Region: { connect: { id: parseInt(req.body.region) } },
            gpsLat: req.body.gpsCordinates?.split(",")[0],
            gpsLong: req.body.gpsCordinates?.split(",")[1],
          },
        },
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
      },
    });

    // remove old image
    /*
    if (product.ProductImage) {
      await prisma.media.delete({ where: { id: product.ProductImage.id } });
      await prisma.file.delete({ where: { id: product.ProductImage.File.id } });
    }
    */

    res.send({ status: true, msg: "محصول با موفقیت ویرایش داده شد." });
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
