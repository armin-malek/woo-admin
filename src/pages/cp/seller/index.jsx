import LayoutSeller from "../../../components/LayoutSeller";
import QRCode from "react-qr-code";
import { prisma } from "../../../server/db/client";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { encodeInt } from "../../../server/common/functions";
const SellerPage = ({ qrLink }) => {
  return (
    <>
      <div className="row justify-content-center mt-3">
        <div className="card">
          <div className="card-body px-5 pb-5">
            <div className="row justify-content-center">
              <h1 style={{ fontSize: "25px" }}>QR کد فروشگاه شما</h1>
            </div>
            {qrLink ? (
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 256,
                  width: "100%",
                  marginTop: "15px",
                }}
              >
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrLink}
                  viewBox={`0 0 256 256`}
                />
              </div>
            ) : (
              <span className="alert alert-danger">
                خطایی در ایجاد QR کد رخ داد
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
SellerPage.PageLayout = LayoutSeller;

export async function getServerSideProps(context) {
  try {
    const session = await getServerAuthSession(context);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { MarketOwned: { select: { id: true } } },
    });

    const qrLink = `https://befresto.ir/add-market/${encodeInt(
      user.MarketOwned.id
    )}`;
    return {
      props: { qrLink },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
}

export default SellerPage;
