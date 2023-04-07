import { z } from "zod";
import nextConnect from "next-connect";
import multer from "multer";
import { putObject } from "../../../../../server/common/s3";
import sharp from "sharp";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import { parseBool } from "../../../../../server/common/functions";
const router = nextConnect();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 10 * 1024 * 1024 },
});
const uploadMiddleware = upload.single("image");
router.use(uploadMiddleware);

const postSchema = z.object({
  marketId: z.string(),
  marketName: z.string(),
  province: z.string(),
  city: z.string(),
  region: z.string(),
  gpsCordinates: z.string(),
  address: z.string(),
  image: z.any(),
});

router.post(async (req, res) => {
  try {
    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let uploadedFile;
    if (req.file) {
      console.log("has file");
      let buffer = await sharp(req.file.buffer).resize(250).webp().toBuffer();
      uploadedFile = await putObject(buffer, "image/webp");
    } else console.log("no file");
    console.log("uploadedFile", uploadedFile);
    const market = await prisma.market.findUnique({
      where: { id: parseInt(req.body.marketId) },
      select: {
        id: true,
        Image: {
          select: { id: true, File: { select: { id: true, name: true } } },
        },
        logo: {
          select: { id: true, File: { select: { id: true, name: true } } },
        },
      },
    });
    await prisma.market.update({
      where: { id: market.id },
      data: {
        name: req.body.marketName.trim(),
        marketAddress: {
          update: {
            address: req.body.address,
            Province: { connect: { id: parseInt(req.body.province) } },
            City: { connect: { id: parseInt(req.body.city) } },
            Region: { connect: { id: parseInt(req.body.region) } },
            gpsLat: req.body.gpsLat?.split(",")[0],
            gpsLong: req.body.gpsLat?.split(",")[1],
          },
        },
        Image: uploadedFile
          ? {
              create: {
                File: {
                  create: {
                    dateAdded: currentIranTimeDB(),
                    fileType: "Image",
                    name: uploadedFile.fileName,
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
});

export default router;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
