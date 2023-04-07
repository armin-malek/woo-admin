import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ShopsListSkeleton() {
  return (
    <div className="col-12 mb-2">
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
            <div className="col-12">
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
