/* eslint-disable @typescript-eslint/no-var-requires */
//import { PrismaClient } from "@prisma/client";

//import moment from "moment-timezone";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment-timezone");

function currentIranTimeDB() {
  return moment().tz("Asia/Tehran").toISOString();
}

async function main() {
  // create province
  const province = await prisma.province.create({
    data: {
      name: "آذربایجان شرقی",
      Cities: {
        create: {
          name: "تبریز",
          Regions: {
            createMany: {
              data: [{ name: "اشکان" }, { name: "پرواز" }, { name: "ولیعصر" }],
            },
          },
        },
      },
    },
    include: { Cities: { include: { Regions: true } } },
  });

  // users
  await prisma.user.create({
    data: {
      mobile: "09142552193",
      dateRegister: currentIranTimeDB(),
      fullName: "آرمین ادمین",
      role: "Admin",
    },
  });
  const market = await prisma.user.create({
    data: {
      mobile: "09202552193",
      dateRegister: currentIranTimeDB(),
      fullName: "آرمین فروشنده",
      role: "Market",
      MarketOwned: {
        create: {
          name: "سوپر استار",
          marketAddress: {
            create: {
              Province: { connect: { id: province.id } },
              City: { connect: { id: province.Cities[0].id } },
              Region: { connect: { id: province.Cities[0].Regions[0].id } },
              gpsLat: "5.45456",
              gpsLong: "24.35955",
              address: "جای خوبی تبریز",
            },
          },
        },
      },
    },
    include: { MarketOwned: true },
  });

  await prisma.user.create({
    data: {
      mobile: "09308151477",
      dateRegister: currentIranTimeDB(),
      fullName: "آرمین مشتری",
      role: "Customer",
      Customer: {
        create: {
          CustomerMarkets: {
            create: {
              Market: { connect: { id: market.MarketOwned.id } },
              dateCreated: currentIranTimeDB(),
            },
          },
        },
      },
    },
  });

  // products

  //await prisma.productCategories.createMany

  let product = await prisma.product.create({
    data: {
      dateCreated: currentIranTimeDB(),
      ProductCategory: {
        connectOrCreate: {
          where: { name: "روغن" },
          create: { name: "روغن", viewOrder: 1 },
        },
      },
      ProductInfo: { create: { name: "روغن جامد لادن", basePrice: 400000 } },
    },
  });
  await prisma.marketProducts.create({
    data: {
      Market: { connect: { id: market.MarketOwned.id } },
      Product: { connect: { id: product.id } },
      ProductInfo: { connect: { id: product.id } },
    },
  });

  product = await prisma.product.create({
    data: {
      dateCreated: currentIranTimeDB(),
      ProductCategory: {
        connectOrCreate: {
          where: { name: "روغن" },
          create: { name: "روغن", viewOrder: 1 },
        },
      },
      ProductInfo: { create: { name: "روغن زیتون", basePrice: 260000 } },
    },
  });
  await prisma.marketProducts.create({
    data: {
      Market: { connect: { id: market.MarketOwned.id } },
      Product: { connect: { id: product.id } },
      ProductInfo: { connect: { id: product.id } },
    },
  });

  product = await prisma.product.create({
    data: {
      dateCreated: currentIranTimeDB(),
      ProductCategory: {
        connectOrCreate: {
          where: { name: "نوشیدنی" },
          create: { name: "نوشیدنی", viewOrder: 2 },
        },
      },
      ProductInfo: { create: { name: "کوکاکولا فلزی", basePrice: 12000 } },
    },
  });
  await prisma.marketProducts.create({
    data: {
      Market: { connect: { id: market.MarketOwned.id } },
      Product: { connect: { id: product.id } },
      ProductInfo: { connect: { id: product.productInfoId } },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
