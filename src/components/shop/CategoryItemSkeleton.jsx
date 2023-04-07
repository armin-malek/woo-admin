import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategoryItemSkeleton() {
  return (
    <div
      className="swiper-slide"
      style={{
        maxWidth: "165px",
        minWidth: "165px",
        paddingBottom: "10px",
        paddingLeft: "15px",
      }}
    >
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row no-gutters h-100">
            <Skeleton
              className="small-slide-right"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></Skeleton>
            <div className="col-8">
              <a
                href="all-products.html"
                className="text-dark mb-1 mt-2 h6 d-block"
              >
                <Skeleton></Skeleton>
              </a>
              <p className="text-secondary small mb-1">
                <Skeleton></Skeleton>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
