import { z } from "zod";
import woo from "../../../../server/common/woocommerce";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { v4 as uuid } from "uuid";
import { base64TOBuffer } from "../../../../server/common/functions";
import * as ftp from "basic-ftp";
import fs from "fs";
import mime from "mime-types";
import { prisma } from "../../../../server/db/client";

const postSchema = z.object({
  productID: z.number(),
  img: z.string().nullish(),
  cats: z.array(z.number()),
  name: z.string(),
  barCode: z.string(),
  regular_price: z.string(),
  sale_price: z.string().nullish(),
  weight: z.string().nullish(),
  manage_stock: z.boolean(),
  stock_quantity: z.number().nullish(),
  stock_status: z.enum(["instock", "outofstock", "onbackorder"]).nullish(),
  description: z.string().nullish(),
  short_description: z.string().nullish(),
});

export default async function handler(req, res) {
  try {
    LimitHttpMethode(req, res, "POST");
    if (!postSchema.safeParse(req.body).success) {
      return res.send({ status: false, msg: "اطلاعات ارسالی نا صحیح" });
    }
    const {
      productID,
      img,
      cats,
      name,
      barCode,
      regular_price,
      sale_price,
      manage_stock,
      stock_quantity,
      stock_status,
      weight,
      description,
      short_description,
    } = req.body;

    let existing = await prisma.product.findUnique({
      where: { barcode: barCode.trim() },
    });
    if (existing && existing.wp_id != productID) {
      return res.send({
        status: false,
        msg: "محصول دیگری با این بارکد وجود دارد",
      });
    }

    let fileName = uuid() + ".jpg";
    // console.log("mime", mime.extension(img));
    if (img) {
      await fs.promises.writeFile(
        `./uploads/${fileName}`,
        base64TOBuffer(img),
        "base64"
      );
      console.log("save to disk");

      const client = new ftp.Client();
      //client.ftp.verbose = true;
      await client.access({
        host: process.env.FTP_SERVER,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        secure: false,
      });
      //console.log(await client.list());
      await client.ensureDir(process.env.FTP_UPLOAD_DIR);
      await client.uploadFrom(
        `./uploads/${fileName}`,
        `${process.env.FTP_UPLOAD_DIR}${fileName}`
      );
      client.close();
      console.log("upload done");
      await fs.promises.unlink(`./uploads/${fileName}`);
    }

    const response = await woo.put(`products/${productID}`, {
      name,
      regular_price,
      sale_price,
      categories: cats.map((x) => ({ id: x })),
      // media_attachment: base64TOBuffer(img),
      //media_attachment: img,
      // media_path: "/api",

      images: img
        ? [
            {
              src: `${process.env.NEXT_PUBLIC_WOO_SITE}${process.env.FTP_BASE_URL}${fileName}`,
            },
          ]
        : undefined,

      manage_stock: manage_stock,
      stock_quantity: manage_stock ? stock_quantity : undefined,
      stock_status: !manage_stock ? stock_status : undefined,
      weight,
      description,
      short_description,
    });

    await prisma.product.update({
      where: { wp_id: productID },
      data: { barcode: barCode.trim() },
    });

    if (response.status != 200) {
      console.log(response.data);
      return res.send({ status: false, msg: "خطای در سرور" });
    }
    res.send({
      status: true,
      msg: "ویرایش موفق",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
