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
                          fontSize: "25px",
                          fontWeight: "bold",
                          textDecoration: "none",
                          textDecorationLine: "none",
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
              <div
                className="card"
                style={{ backgroundColor: "rgba(210, 210, 210, 0.68)" }}
              >
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
                    <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                      ورود به بخش فروش آنلاین
                    </h1>
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
          background-color: #291d89;
          height: 100vh;
        }
        h1 {
          color: white;
          font-size: 25px;
        }
        * {
          /*text-decoration: none !important;*/
          color: #291d89 !important;
        }
        *:hover {
          text-decoration: none !important;
          text-decoration-line: none !important;
        }
        .click-btn {
          background-color: #ffffff;
          transition: 0.3s;
        }
        .click-btn:hover {
          -webkit-box-shadow: 0px 0px 20px 0px rgba(207, 207, 207, 1);
          -moz-box-shadow: 0px 0px 20px 0px rgba(207, 207, 207, 1);
          box-shadow: 0px 0px 20px 0px rgba(207, 207, 207, 1);
        }
      `}</style>
    </>
  );
};

Page.protect = true;
export default Page;
