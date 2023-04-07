import { z } from "zod";
import nextConnect from "next-connect";
import multer from "multer";
import { putObject, s3 } from "../../../../../server/common/s3";
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
  productId: z.string(),
  name: z.string(),
  barcode: z.string(),
  basePrice: z.string(),
  category: z.string().optional(),
  image: z.any(),
  isVisible: z.string(),
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
      let buffer = await sharp(req.file.buffer).resize(250).webp().toBuffer();
      uploadedFile = await putObject(buffer, "image/webp");
    }
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.body.productId) },
      select: {
        id: true,
        Image: {
          select: { id: true, File: { select: { id: true, name: true } } },
        },
      },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        ProductInfo: {
          update: {
            name: req.body.name.trim(),
            basePrice: parseInt(req.body.basePrice) || undefined,
          },
        },
        barcode: req.body.barcode || undefined,
        isVisible: parseBool(req.body.isVisible),
        ProductCategory: { connect: { id: parseInt(req.body.category) } },
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
