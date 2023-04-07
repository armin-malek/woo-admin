import LayoutSeller from "../../../../components/LayoutSeller";
import CategoryItem from "../../../../components/shop/CategoryItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css";
import CategoryItemSkeleton from "../../../../components/shop/CategoryItemSkeleton";
import ProductItemSkeleton from "../../../../components/shop/ProductItemSkeleton";
import { toast } from "react-toastify";
import SellerProductItem from "../../../../components/cp/seller/products/SellerProductItem";
import SellerProductEditModal from "../../../../components/cp/seller/products/SellerProductEditModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SellerProductAddModal from "../../../../components/cp/seller/products/SellerProductAddModal";
import Link from "next/link";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinnerCustom from "../../../../components/SpinnerCustom";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(undefined);
  const [catProductReloader, setCatProductReloader] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProducts, setActiveProducts] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);

  async function getCategories() {
    try {
      setCategoriesLoading(true);
      const resp = await fetch("/api/shop/get-categories");
      const json = await resp.json();
      setCategories(json.data);
      setCategoriesLoading(false);
      //if (json.data.length > 0) setSelectedCat(json.data[0].slug);
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد", { type: "error" });
    }
  }

  async function LoadProducts(reset) {
    try {
      if (products.length == 0 || reset) setProductsLoading(true);
      const { data } = await axios.get(`/api/cp/seller/products/get`, {
        params: {
          cat: selectedCat,
          query: searchTerm,
          cursor: reset
            ? ""
            : products?.length > 0
            ? products[products.length - 1].id
            : "",
        },
      });
      if (reset) setProducts(data.products);
      else setProducts(products.concat(data.products));
      setHasMore(data.hasMore);
      setProductsLoading(false);
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد", { type: "error" });
    }
  }
  function handleShowEditModal(product) {
    setActiveProducts(product);
    setShowEditModal(true);
  }
  function handleCloseEditModal() {
    setActiveProducts();
    setShowEditModal(false);
  }
  function handleShowAddModal() {
    setShowAddModal(!showAddModal);
  }

  useEffect(() => {
    LoadProducts();
    getCategories();
  }, []);

  useEffect(() => {
    LoadProducts();
  }, [selectedCat, catProductReloader]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => LoadProducts(), 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <>
      <LayoutSeller>
        <input
          type="text"
          className="form-control form-control-lg search "
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
          <Link href="/cp/seller/products/add">
            <span
              className="badge badge-info mr-2"
              style={{ cursor: "pointer" }}
              //onClick={() => handleShowAddModal()}
            >
              <FontAwesomeIcon icon={faPlus} style={{ height: "18px" }} />{" "}
              افزودن محصول
            </span>
          </Link>
        </h1>
        <div className="row" id="scrollableDiv">
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
              next={() => LoadProducts()}
              hasMore={hasMore}
              loader={
                <div className="row justify-content-center w-100 mb-3">
                  <SpinnerCustom type="primary" />
                </div>
              }
              //scrollableTarget="scrollableDiv"
            >
              {products?.map((item, index) => (
                <SellerProductItem
                  marketProduct={item}
                  key={index}
                  handleShowModal={handleShowEditModal}
                  handleCloseModal={handleCloseEditModal}
                ></SellerProductItem>
              ))}
            </InfiniteScroll>
          )}
        </div>
        <SellerProductEditModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          product={activeProducts}
          LoadProducts={LoadProducts}
        ></SellerProductEditModal>
        <SellerProductAddModal
          show={showAddModal}
          handleClose={handleShowAddModal}
          LoadProducts={LoadProducts}
        ></SellerProductAddModal>
      </LayoutSeller>
    </>
  );
};

Shop.protect = true;

export default Shop;
