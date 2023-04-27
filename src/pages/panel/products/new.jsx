import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import woo from "../../../server/common/woocommerce";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import ProductCategorySelect from "../../../components/panel/products/ProductCategorySelect";
import ImageSelector from "../../../components/ImageSelector";
// import dynamic from "next/dynamic";

const Page = ({ cats }) => {
  const [productImage, setProductImage] = useState();
  const [isPosting, setIsPosting] = useState(false);
  // const [barCode, setBarCode] = useState();
  // const shortDesc = useRef("");
  const selectedCats = useRef([]);
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

      const { data } = await axios.post("/api/panel/products/new", {
        img: productImage,
        ...values,
        cats: selectedCats.current,
      });
      setIsPosting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      router.push("/panel/products");
      console.log("sel", selectedCats.current);
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
  }

  return (
    <>
      <div className="row mt-3 justify-content-center">
        <div className="col-12 col-sm-11 col-md-10 col-lg-6">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Formik
                    initialValues={{
                      name: "",
                      regular_price: "",
                      sale_price: "",
                      manage_stock: false,
                      stock_quantity: 1,
                      stock_status: "instock",
                      weight: "",
                      // barCode: atob(router.query.barCode),
                      barCode: "",
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
                              //orgImage={product?.images[0]?.src}
                              image={productImage}
                              setImage={setProductImage}
                            ></ImageSelector>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>بارکد (13 رقم) :</label>
                              <Field
                                className="form-control"
                                name="barCode"
                                required="true"
                                minLength="13"
                              />
                            </div>
                            <div className="form-group">
                              <label>نام محصول:</label>
                              <Field className="form-control" name="name" />
                            </div>
                            <div className="form-group">
                              <label>قیمت:</label>
                              <Field
                                className="form-control"
                                name="regular_price"
                                type="text"
                                inputmode="numeric"
                              />
                            </div>
                            <div className="form-group">
                              <label>قیمت تخفیف:</label>
                              <Field
                                className="form-control"
                                name="sale_price"
                                type="text"
                                inputmode="numeric"
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
                            <label>توضیحات کوتاه</label>
                            <ProductQuill refValue={shortDesc} />

                             */}
                            <div className="row justify-content-center mt-1">
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
                                    className="btn btn-primary mt-3"
                                    type="submit"
                                    disabled={isPosting ? true : false}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSave}
                                      style={{ height: "20px" }}
                                    ></FontAwesomeIcon>
                                    <span className="pr-1">ایجاد محصول</span>
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
    const catsRes = await woo.get(`products/categories`, { hide_empty: true });

    return {
      props: { status: true, cats: catsRes.data },
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
