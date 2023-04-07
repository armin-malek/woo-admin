import { z } from "zod";
import nextConnect from "next-connect";
import multer from "multer";
import { putObject, s3 } from "../../../../../server/common/s3";
import sharp from "sharp";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
const router = nextConnect();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 10 * 1024 * 1024 },
});
const uploadMiddleware = upload.single("image");
router.use(uploadMiddleware);

const postSchema = z.object({
  name: z.string(),
  basePrice: z.string(),
  unitPrice: z.string().optional(),
  boxCount: z.string().optional(),
  category: z.string().optional(),
  image: z.any(),
});

router.post(async (req, res) => {
  try {
    console.log("body", req.body);
    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let uploadedFile;
    if (req.file) {
      let buffer = await sharp(req.file.buffer).resize(250).webp().toBuffer();
      uploadedFile = await putObject(buffer, "webp");
    }
    await prisma.product.create({
      data: {
        name: req.body.name,
        basePrice: parseInt(req.body.basePrice) || undefined,
        unitPrice: parseInt(req.body.unitPrice) || undefined,
        boxCount: parseInt(req.body.boxCount) || undefined,
        ProductCategory: { connect: { id: parseInt(req.body.category) } },
        ProductImage: uploadedFile
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

    res.send({ status: true, msg: "محصول با موفقیت افزوده شد." });
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
