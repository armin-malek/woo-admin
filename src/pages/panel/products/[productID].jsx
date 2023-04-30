import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import woo from "../../../server/common/woocommerce";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import ProductCategorySelect from "../../../components/panel/products/ProductCategorySelect";
import ImageSelector from "../../../components/ImageSelector";
import Swal from "sweetalert2";
import { prisma } from "../../../server/db/client";
// import dynamic from "next/dynamic";

const Page = ({ status, msg, product, cats, barCode }) => {
  const [productImage, setProductImage] = useState();
  const [isPosting, setIsPosting] = useState(false);
  //const [description, setDescription] = useState("");
  // const description = useRef(product.description);
  // const shortDesc = useRef(product?.short_description);
  const selectedCats = useRef(product?.categories?.map((x) => x.id));
  const router = useRouter();
  /*
  const ProductQuill = dynamic(
    () => import("../../../components/panel/products/ProductQuill"),
    { ssr: false }
  );
  */

  async function formSubmit(values) {
    try {
      setIsPosting(true);

      const { data } = await axios.post("/api/panel/products/update", {
        productID: product.id,
        img: productImage,
        ...values,
        cats: selectedCats.current,
        //description: description.current,
        // short_description: shortDesc.current,
      });
      setIsPosting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      // console.log("sel", selectedCats.current);
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
  }

  async function submitRemove() {
    try {
      let force = false;
      const dialogResult = await Swal.fire({
        title: "توجه",
        text: "نوع حذف را انتخاب کنید",
        customClass: "font-fa",
        //icon: "warning",
        showDenyButton: true,
        confirmButtonText: "انتقال به زباله دان",
        denyButtonText: "حذف کامل",
        color: "red",
      });

      if (!dialogResult.isConfirmed) {
        force = true;
      }
      setIsPosting(true);

      const { data } = await axios.post("/api/panel/products/remove", {
        productID: product.id,
        force,
      });

      setIsPosting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      router.push("/panel/products");
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
    }
  }

  if (status == false) {
    return (
      <>
        <div className="row justify-content-center">
          <span className="alert alert-danger">{msg}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row mt-3 justify-content-center">
        <div className="col-12 col-sm-11 col-md-10 col-lg-6">
          <div className="card">
            <div className="card-body">
              <a
                className="btn btn-info ml-1"
                href={product?.permalink}
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                مشاهده در فروشگاه
              </a>
              <a
                className="btn btn-primary"
                href={`${process.env.NEXT_PUBLIC_WOO_SITE}/wp-admin/post.php?post=${product.id}&action=edit`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                مشاهده در مدیریت
              </a>
              <div className="row mt-2">
                <div className="col-12">
                  <Formik
                    initialValues={{
                      name: product.name || "",
                      regular_price: product.regular_price || "",
                      sale_price: product.sale_price || "",
                      manage_stock: product.manage_stock || false,
                      stock_quantity: product.stock_quantity || null,
                      stock_status: product.stock_status || null,
                      weight: product.weight || null,
                      barCode: barCode,
                    }}
                    onSubmit={(e) => formSubmit(e)}
                  >
                    {({ values }) => (
                      <Form>
                        <div
                          className="row justify-content-center"
                          style={{ textAlign: "right" }}
                        >
                          <div className="col-12">
                            <ImageSelector
                              orgImage={product?.images[0]?.src}
                              image={productImage}
                              setImage={setProductImage}
                            ></ImageSelector>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>بارکد :</label>
                              <Field
                                className="form-control"
                                name="barCode"
                                required="true"
                              />
                            </div>
                            <div className="form-group">
                              <label>نام محصول:</label>
                              <Field
                                className="form-control"
                                name="name"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>قیمت:</label>
                              <Field
                                className="form-control"
                                name="regular_price"
                                type="text"
                                inputMode="numeric"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>قیمت تخفیف:</label>
                              <Field
                                className="form-control"
                                name="sale_price"
                                type="text"
                                inputMode="numeric"
                              />
                            </div>
                            <div className="form-group">
                              <label>دسته:</label>

                              <ProductCategorySelect
                                cats={cats}
                                selectedCats={selectedCats}
                                checkedList={selectedCats.current}
                              />
                            </div>
                            <div className="form-group">
                              <label>مدیریت انبار</label>
                              <Field
                                type="checkbox"
                                name="manage_stock"
                                style={{ minWidth: "30px" }}
                              />
                            </div>
                            <div
                              className={`form-group ${
                                !values.manage_stock && "d-none"
                              }`}
                            >
                              <label>تعداد موجودی:</label>
                              <Field
                                type="number"
                                name="stock_quantity"
                                style={{ minWidth: "30px" }}
                              />
                            </div>
                            <div
                              className={`form-group ${
                                values.manage_stock && "d-none"
                              }`}
                            >
                              <label>وضعیت موجودی انبار</label>
                              <Field
                                className="form-control"
                                name="stock_status"
                                as="select"
                              >
                                <option value="instock">موجود در انبار</option>
                                <option value="outofstock">ناموجود</option>
                                <option value="onbackorder">
                                  قابل پیش خرید
                                </option>
                              </Field>
                            </div>

                            <div className="form-group">
                              <label>وزن (کیلوگرم) :</label>
                              <Field
                                className="form-control"
                                name="weight"
                                type="text"
                                inputMode="numeric"
                              />
                            </div>

                            {/*
                            <label>توضیحات کامل</label>
                            <ProductQuill refValue={description} />
                            <hr />
                            <label>توضیحات کوتاه</label>
                            <ProductQuill refValue={shortDesc} />
                          */}

                            <div className="row justify-content-center mt-4">
                              {isPosting ? (
                                <>
                                  <div className="spinner-border text-primary">
                                    <span className="sr-only">
                                      در حال انجام ...
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isPosting ? true : false}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSave}
                                      style={{ height: "20px" }}
                                    ></FontAwesomeIcon>
                                    <span className="pr-1">ذخیره</span>
                                  </button>
                                  <button
                                    className="btn btn-danger mr-1"
                                    type="button"
                                    disabled={isPosting ? true : false}
                                    onClick={submitRemove}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      style={{ height: "20px" }}
                                    ></FontAwesomeIcon>
                                    <span className="pr-1">حذف محصول</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  {/* 
                  <input
                    type="file"
                    className="d-none"
                    ref={refFileInput}
                    onChange={(e) => handleFileChange(e)}
                  />
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const { productID } = context.query;
    const productsReq = woo.get(`products/${productID}`);
    const catsReq = woo.get("products/categories", { per_page: 100 });
    const barCodeGet = prisma.product.findUnique({
      where: { wp_id: parseInt(productID) },
    });

    const [productsRes, catsRes, barCode] = await Promise.all([
      productsReq,
      catsReq,
      barCodeGet,
    ]);

    // console.log(barCode);

    return {
      props: {
        status: true,
        product: productsRes.data,
        cats: catsRes.data,
        barCode: barCode?.barcode || "",
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { status: false, msg: "خطایی رخ داد" },
    };
  }
}
Page.PageLayout = LayoutAdmin;
export default Page;
