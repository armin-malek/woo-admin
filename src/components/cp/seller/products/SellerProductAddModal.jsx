import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import axios from "axios";

export default function SellerProductAddModal({
  show,
  product,
  ToggleAddModal,
  LoadProducts,
}) {
  const [isPosting, setIsPosting] = useState(false);

  async function formSubmit(values) {
    try {
      setIsPosting(true);

      let { data } = await axios({
        method: "post",
        url: "/api/cp/seller/products/add",
        data: { productID: product.id, ...values },
      });
      setIsPosting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      CleanUp();
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
  }

  function CleanUp() {
    ToggleAddModal();
    LoadProducts(true);
  }

  return (
    <Modal show={show} onHide={() => ToggleAddModal()}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "15px" }}
            onClick={ToggleAddModal}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />
        </div>

        <div className="d-flex justify-content-center">
          <Image src={product?.Image} alt="" width={100} height={100}></Image>
        </div>
        <Formik
          initialValues={{
            name: product?.ProductInfo.name || "",
            inStock: 1,
            basePrice: product?.ProductInfo.basePrice || null,
            specialPrice: product?.ProductInfo.specialPrice || null,
            isVisible: true,
          }}
          onSubmit={(e) => formSubmit(e)}
        >
          <Form>
            <div
              className="row justify-content-center"
              style={{ textAlign: "right" }}
            >
              <div className="col-12">
                <div className="form-group">
                  <label>شماره بارکد :</label>
                  <input
                    className="form-control en-font"
                    type="text"
                    disabled
                    value={product?.barcode}
                  />
                </div>
                <div className="form-group">
                  <label>عنوان محصول :</label>
                  <Field className="form-control" name="name" />
                </div>
                <div className="form-group">
                  <label>موجود در انبار :</label>
                  <Field
                    className="form-control"
                    name="inStock"
                    type="number"
                  />
                </div>

                <div className="form-group">
                  <label>قیمت (تومان) :</label>
                  <Field
                    className="form-control"
                    name="basePrice"
                    type="number"
                  />
                </div>
                <div className="form-group">
                  <label>قیمت تخفیف (تومان) :</label>
                  <Field
                    className="form-control"
                    name="specialPrice"
                    type="number"
                  />
                </div>

                <div className="form-group mb-0">
                  <label>نمایش در فروشگاه :</label>
                  <Field type="checkbox" name="isVisible" />
                </div>

                <div className="row justify-content-center mt-1">
                  {isPosting ? (
                    <>
                      <div className="spinner-border text-primary">
                        <span className="sr-only">در حال انجام ...</span>
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
                          icon={faPlus}
                          style={{ height: "20px" }}
                        ></FontAwesomeIcon>
                        <span className="pr-1">افزودن محصول</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal.Body>
      <style jsx>{`
        select > option {
          background-color: blue !important;
        }
      `}</style>
    </Modal>
  );
}
