import { faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import Swal from "sweetalert2";

export default function SellerProductEditModal({
  show,
  handleClose,
  product,
  LoadProducts,
}) {
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // d
  }, [product]);

  async function formSubmit(values) {
    try {
      setIsPosting(true);
      /*
      var bodyFormData = new FormData();
      Object.keys(values).forEach((key) => {
        bodyFormData.append(key, values[key]);
      });
      bodyFormData.append("productID", product.id);
      */
      let { data } = await axios({
        method: "post",
        url: "/api/cp/seller/products/update",
        data: {
          productID: product.id,
          ...values,
        },
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

  async function submitRemove() {
    try {
      const dialogResult = await Swal.fire({
        title: "هشدار!",
        text: "آیا از حذف محصول مطمئن هستید؟",
        customClass: "font-fa",
        //icon: "warning",
        showDenyButton: true,
        confirmButtonText: "حذف محصول",
        confirmButtonColor: "#dc3545",
        denyButtonText: "لغو",
        denyButtonColor: "#6c757d",
        color: "red",
      });

      if (!dialogResult.isConfirmed) {
        return;
      }

      setIsPosting(true);

      const { data } = await axios({
        method: "post",
        url: "/api/cp/seller/products/remove",
        data: { productID: product.id },
      });

      setIsPosting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      CleanUp();
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
    }
  }
  function CleanUp() {
    handleClose();
    LoadProducts(true);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "15px" }}
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />
        </div>

        <Formik
          initialValues={{
            name: product ? product.ProductInfo.name : "",
            inStock: product ? product.inStock : "",
            basePrice: product ? product.ProductInfo.basePrice : undefined,
            specialPrice: product
              ? product.ProductInfo.specialPrice
              : undefined,
            isVisible: product ? product.isVisible : false,
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
                  <label>عنوان محصول:</label>
                  <Field className="form-control" name="name" />
                </div>
                <div className="form-group">
                  <label>موجودی:</label>
                  <Field
                    className="form-control"
                    name="inStock"
                    type="number"
                  />
                </div>

                <div className="form-group">
                  <label>قیمت:</label>
                  <Field
                    className="form-control"
                    name="basePrice"
                    type="number"
                  />
                </div>
                <div className="form-group">
                  <label>قیمت تخفیف:</label>
                  <Field
                    className="form-control"
                    name="specialPrice"
                    type="number"
                  />
                </div>

                <div className="form-group mb-0">
                  <label>نمایش داده شود؟</label>
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
