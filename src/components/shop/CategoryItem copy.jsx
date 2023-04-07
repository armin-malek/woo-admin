import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CategoryItem() {
  return (
    <div className="swiper-slide">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row no-gutters h-100">
            <img
              src="img/banana-small.png"
              alt=""
              className="small-slide-right"
            />
            <div className="col-8">
              <button className="btn btn-sm btn-link p-0">
                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
              </button>
              <a
                href="all-products.html"
                className="text-dark mb-1 mt-2 h6 d-block"
              >
                گرمسیری{" "}
              </a>
              <p className="text-secondary small">موز ، انبه</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
