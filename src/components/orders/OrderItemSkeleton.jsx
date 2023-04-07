import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderItemSkeleton() {
  return (
    <div className="row mb-2 justify-content-center">
      <div className="col-10 col-xs-9 col-sm-9 col-md-8 col-lg-6">
        <div className="card">
          <div className="card-body pb-0">
            <div className="row">
              <div
                className="col-6 col-xs-6 col-md-6 col-lg-6"
                style={{ width: "100%", maxWidth: "fit-content" }}
              >
                <Skeleton
                  style={{
                    border: "1px solid rgb(237 237 237 / 15%)",
                    borderRadius: "4px",
                    width: "70px",
                    height: "70px",
                  }}
                ></Skeleton>
              </div>
              <div
                className="col-6 col-xs-6 col-md-6 col-lg-6"
                style={{
                  fontWeight: "bold",
                  padding: "10px 5px 0px 0px",
                }}
              >
                <h2 style={{ fontSize: "15px", marginBottom: "3px" }}>
                  <Skeleton></Skeleton>
                </h2>
                <h2 style={{ fontSize: "12px", marginBottom: "3px" }}>
                  <Skeleton></Skeleton>
                </h2>
                <h2
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    display: "block",
                    textOverflow: "ellipsis",
                    width: "250px",
                    maxWidth: "80%",
                  }}
                >
                  <Skeleton></Skeleton>
                </h2>
              </div>
            </div>
            <div className="row mr-0 mt-2">
              <div style={{ flexGrow: 6 }}>
                {Array(3)
                  .fill(0)
                  .map((item, index) => (
                    <div
                      key={index}
                      style={{
                        maxWidth: "fit-content",
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      <Skeleton
                        style={{
                          border: "2px solid rgb(237 237 237 / 90%)",
                          borderRadius: "3px",
                          marginLeft: "0px",
                          width: "40px",
                          height: "40px",
                        }}
                      ></Skeleton>
                    </div>
                  ))}
              </div>
              <div
                style={{
                  flexGrow: 6,
                  textAlign: "end",
                  paddingLeft: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <Skeleton></Skeleton>
              </div>
            </div>
            <div className="row mx-0 mt-4">
              <div className="col-6">
                <Skeleton
                  className="btn w-100"
                  style={{ height: "35px" }}
                ></Skeleton>
              </div>
              <div className="col-6">
                <Skeleton
                  className="btn w-100"
                  style={{ height: "35px" }}
                ></Skeleton>
              </div>
            </div>
            <Skeleton
              className="badge"
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                width: "40px",
              }}
            ></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
