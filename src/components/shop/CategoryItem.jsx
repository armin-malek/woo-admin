import Image from "next/image";

export default function CategoryItem({ cat, setSelectedCat }) {
  return (
    <>
      <div
        className={`card shadow-sm border-0 mx-auto hover-pp `}
        style={{
          maxWidth: "165px",
          minWidth: "165px",
        }}
        onClick={() => setSelectedCat(cat.slug)}
      >
        <div className="card-body ">
          <div className="row no-gutters h-100 ">
            <Image
              src={cat.Image ? cat.Image : "/img/product-no-image.webp"}
              alt=""
              className="small-slide-right"
              width={80}
              height={80}
              style={{ position: "absolute", top: 0, bottom: 0, left: 0 }}
            ></Image>
            <div className="col-8">
              <span className="text-dark mb-1 mt-2 h6 d-block hover-cc">
                {cat.name}
              </span>
              <br />
              <p className="text-secondary small"></p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hover-pp:hover {
          background-color: #791ed3 !important;
        }
        .hover-pp:hover .hover-cc {
          color: white !important;
        }
        .is-active {
          background-color: #791ed3 !important;
        }
        .is-active .hover-cc {
          color: white !important;
        }
      `}</style>
    </>
  );
}
