import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LayoutShop from "../../../components/LayoutShop";

import TableRowSkeleton from "../../../components/TableRowSkeleton";
import RankingTableItem from "../../../components/shop/ranking/RankingTableItem";
const Page = () => {
  const [markets, setMarket] = useState();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getRanks() {
      try {
        setIsLoading(true);
        const fetchResp = await fetch("/api/shop/ranking/get-ranking");
        const resp = await fetchResp.json();
        setIsLoading(false);
        if (resp.status != true) {
          toast(resp.msg, { type: "error" });
          return;
        }

        setMarket(resp.data);
      } catch (err) {
        setIsLoading(false);
        toast("خطایی رخ داد", { type: "error" });
        console.log(err);
      }
    }
    getRanks();
  }, []);

  return (
    <>
      <div className="row ">
        <div className="col-12">
          <div className="row justify-content-center mt-4">
            <div className="col-auto">
              <h1 style={{ fontSize: "25px" }}>برترین فروشگاه ها</h1>
            </div>
          </div>
          <div className="row justify-content-center mt-1 mx-1">
            <div className="table-responsive" style={{ maxWidth: "500px" }}>
              <table className="table text-center">
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">رتبه</th>
                    <th className="align-middle">فروشگاه</th>
                    <th className="align-middle">امتیاز</th>
                  </tr>
                </thead>
                <tbody
                //className={styles.customtable}
                >
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={3} />
                  ) : (
                    markets?.map((market, index) => (
                      <RankingTableItem
                        key={index}
                        market={market}
                      ></RankingTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
/*
export async function getServerSideProps(context) {
  try {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        Market: {
          select: {
            marketAddress: { select: { Region: { select: { id: true } } } },
          },
        },
        role: true,
      },
    });

    let markets = await prisma.market.findMany({
      where: {
        marketAddress: { Region: { id: user.Market.marketAddress.Region.id } },
      },
      select: { name: true, totalPoints: true },
      orderBy: { totalPoints: "asc" },
    });
    console.log("markets", markets);
    return {
      props: { status: true, markets },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { status: false, markets: [] },
    };
  }
}
*/

Page.PageLayout = LayoutShop;
export default Page;
