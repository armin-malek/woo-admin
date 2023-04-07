import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import axios from "axios";

export default function SellerWithdrawReqModal({
  show,
  handleClose,
  Loadwithdrawals,
  balance,
}) {
  const [isPosting, setIsPosting] = useState(false);
  async function formSubmit(values) {
    try {
      setIsPosting(true);

      let { data } = await axios({
        method: "post",
        url: "/api/cp/seller/withdraw/req",
        data: { ...values },
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
    handleClose();
    Loadwithdrawals();
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "5px" }}
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
            amount: parseInt(balance),
          }}
          onSubmit={formSubmit}
        >
          <Form>
            <div
              className="row justify-content-center"
              style={{ textAlign: "right" }}
            >
              <div className="col-12 mt-1">
                <p className="text-center">
                  مبلغ مورد نظر را جهت تسویه وارد کنید
                </p>
                <div
                  className="input-group-append mb-3 mx-auto"
                  style={{ maxWidth: "240px" }}
                >
                  <Field
                    type="number"
                    name="amount"
                    inputMode="numeric"
                    className="form-control"
                    style={{
                      margin: "0px",
                      borderTopLeftRadius: "0px",
                      borderBottomLeftRadius: "0px",
                    }}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      id="basic-addon2"
                      style={{
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      تومان
                    </span>
                  </div>
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
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        <span className="pr-1">ثبت درخواست</span>
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
