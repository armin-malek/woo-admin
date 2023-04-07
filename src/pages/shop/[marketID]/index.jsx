import LayoutShop from "../../../components/LayoutShop";
import CategoryItem from "../../../components/shop/CategoryItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css";
import CategoryItemSkeleton from "../../../components/shop/CategoryItemSkeleton";
import ProductItem from "../../../components/shop/ProductItem";
import ProductItemSkeleton from "../../../components/shop/ProductItemSkeleton";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinnerCustom from "../../../components/SpinnerCustom";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const { marketID } = router.query;
  useEffect(() => {
    //
    async function getCategories() {
      try {
        setCategoriesLoading(true);
        const resp = await fetch("/api/shop/get-categories");
        const json = await resp.json();
        setCategories(json.data);
        setCategoriesLoading(false);
      } catch (err) {
        console.log(err);
        toast("خطایی رخ داد", { type: "error" });
      }
    }
    getProducts();
    getCategories();
  }, []);

  async function getProducts() {
    try {
      if (products.length == 0) setProductsLoading(true);
      const { data } = await axios.get("/api/shop/get-products", {
        params: {
          marketID,
          cat: selectedCat || "",
          query: searchTerm,
          cursor: products?.length > 0 ? products[products.length - 1].id : "",
        },
      });
      setProducts(products.concat(data.products));
      setHasMore(data.hasMore);
      setProductsLoading(false);
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد", { type: "error" });
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      getProducts();
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <>
      <LayoutShop>
        <input
          type="text"
          className="form-control form-control-lg search my-3"
          placeholder="جستجو کنید..."
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h1 style={{ fontSize: "21px" }}>دسته ها</h1>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={50}
          //onSwiper={setSwiper}
        >
          {categoriesLoading
            ? Array(7)
                .fill(0)
                .map((item, index) => (
                  <SwiperSlide key={index} className="custom-swip">
                    <CategoryItemSkeleton></CategoryItemSkeleton>
                  </SwiperSlide>
                ))
            : categories.map((category, index) => (
                <SwiperSlide key={index} className="custom-swip">
                  <CategoryItem
                    cat={category}
                    setSelectedCat={setSelectedCat}
                  ></CategoryItem>
                </SwiperSlide>
              ))}
        </Swiper>
        <h1 className="mt-4" style={{ fontSize: "21px" }}>
          محصولات
        </h1>
        <div className="row">
          {productsLoading ? (
            Array(6)
              .fill(0)
              .map((item, index) => (
                <ProductItemSkeleton key={index}></ProductItemSkeleton>
              ))
          ) : (
            <InfiniteScroll
              className="row"
              dataLength={products?.length}
              next={() => getProducts()}
              hasMore={hasMore}
              loader={
                <div className="row justify-content-center w-100 mb-3">
                  <SpinnerCustom type="primary" />
                </div>
              }
            >
              {products?.map((item, index) => (
                <ProductItem marketProduct={item} key={index}></ProductItem>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </LayoutShop>
    </>
  );
};

Shop.protect = true;

export default Shop;

/*
{status === "authenticated" ? (
        <h1> Logged in</h1>
      ) : (
        <Link href="/auth/signin">SignIn</Link>
      )}

*/
