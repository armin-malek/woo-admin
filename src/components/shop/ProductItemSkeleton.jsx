import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductItemSkeleton() {
  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <button className="btn btn-sm btn-link p-0"></button>
          <Skeleton
            className="badge float-left"
            style={{ width: "50px" }}
          ></Skeleton>
          <figure className="product-image">
            <Skeleton
              style={{
                //position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "100%",
                height: "75px",
              }}
            />
          </figure>
          <a
            href="product-details.html"
            className="text-dark mb-1 mt-2 h6 d-block"
          >
            <Skeleton></Skeleton>
          </a>
          <p className="text-secondary small mb-2">
            <Skeleton></Skeleton>
          </p>
          <h5 className="text-success font-weight-normal mb-0">
            <Skeleton></Skeleton>
          </h5>
          <p className="text-secondary small text-mute mb-5">
            <Skeleton></Skeleton>
          </p>
        </div>
      </div>
    </div>
  );
}
