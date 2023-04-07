import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="main-wrapper font-fa" dir="rtl">
        <div className="row align-items-center" style={{ height: "100vh" }}>
          <div className="col-12 col-sm-12 col-md-6">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{}}
            >
              <Link href="/shop">
                <div className="card click-btn">
                  <div
                    className="card-body"
                    style={
                      {
                        //width: "49vw",
                        //height: "90vh",
                      }
                    }
                  >
                    <div className="d-flex">
                      <h1
                        style={{
                          paddingTop: "0.9rem",
                          paddingBottom: "0.9rem",
                        }}
                      >
                        ورود به بخش خرید عمده
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6">
            <div className="d-flex justify-content-center " style={{}}>
              <div className="card" style={{ backgroundColor: "#0fc25288" }}>
                <div
                  className="card-body"
                  style={
                    {
                      //width: "49vw",
                      //height: "90vh",
                    }
                  }
                >
                  <div className="d-flex font-fa">
                    <h1>ورود به بخش فروش آنلاین</h1>
                  </div>
                  <div className="d-flex font-fa justify-content-center">
                    <span style={{ color: "red" }}>
                      این بخش برای شما فعال نیست.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      <style jsx>{`
        .main-wrapper {
          background-color: rgb(235, 235, 235);
          height: 100vh;
        }
        h1 {
          color: white;
          font-size: 25px;
        }
        * {
          text-decoration: none !important;
        }
        *:hover {
          text-decoration: none !important;
        }
        .click-btn {
          background-color: #0fc252;
          transition: 0.3s;
        }
        .click-btn:hover {
          background-color: #0ca649;
        }
      `}</style>
    </>
  );
};

Page.protect = true;
export default Page;
