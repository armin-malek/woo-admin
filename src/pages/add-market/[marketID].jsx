import {
  decodeInt,
  encodeInt,
  showNoImage,
} from "../../server/common/functions";
import { prisma } from "../../server/db/client";
import { useEffect } from "react";
import MarketListItem from "../../components/shop/MarketListItem";
import LayoutBase from "../../components/LayoutBase";
import { fileUrl } from "../../server/common/s3";
import cookie from "cookie";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { currentIranTimeDB } from "../../server/common/time";
const Page = ({ status, market, msg }) => {
  useEffect(() => {
    console.log("market", market);
  }, [market]);
  return (
    <>
      {status ? (
        <>
          <div className="container">
            <div className="row">
              <MarketListItem market={market}></MarketListItem>
            </div>
          </div>
        </>
      ) : (
        <>{msg}</>
      )}
    </>
  );
};

Page.PageLayout = LayoutBase;

export async function getServerSideProps(context) {
  let { marketID } = context.query;
  marketID = decodeInt(marketID);

  if (!marketID) {
    return {
      // redirect: {
      //   permanent: false,
      //   destination: "/errors/404",
      // },
      props: { status: false, msg: "404 - page not found" },
    };
  }

  let market = await prisma.market.findUnique({
    where: { id: marketID },
    select: {
      name: true,
      id: true,
      Image: { select: { File: { select: { name: true } } } },
      logo: { select: { File: { select: { name: true } } } },
      marketAddress: {
        select: {
          City: { select: { name: true } },
          Region: { select: { name: true } },
        },
      },
    },
  });
  if (!market) {
    return {
      redirect: {
        permanent: false,
        destination: "/errors/404",
      },
    };
  }

  //market.id = encodeInt(market.id);
  market.logo = fileUrl(market.logo?.File?.name) || showNoImage();
  market.Image = fileUrl(market.Image?.File?.name) || showNoImage();

  context.res.setHeader(
    "set-cookie",
    cookie.serialize("marketID", encodeInt(market.id), {
      httpOnly: false,
      secure: false,
      maxAge: 34560000,
      sameSite: "strict",
      path: "/",
    })
  );

  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (!session) {
    return {
      props: { status: true, market },
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  }

  if (session.user.role != "Customer") {
    return {
      props: { status: false, msg: "شما امکان این کار را ندارید." },
    };
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { Customer: { select: { id: true } } },
  });
  // add market to the customer

  await prisma.customerMarkets.upsert({
    where: {
      customerId_marketId: {
        customerId: user.Customer.id,
        marketId: market.id,
      },
    },
    update: {},
    create: {
      Customer: { connect: { id: user.Customer.id } },
      dateCreated: currentIranTimeDB(),
      Market: { connect: { id: market.id } },
    },
  });

  return {
    props: { status: true, market },
    redirect: {
      permanent: false,
      destination: "/shop",
    },
  };
}
export default Page;
