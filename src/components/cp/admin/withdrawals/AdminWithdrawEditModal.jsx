import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import SpinnerCustom from "../../../SpinnerCustom";
import Swal from "sweetalert2";

export default function AdminWithdrawEditModal({
  show,
  handleClose,
  withdrawID,
  Loadwithdrawals,
}) {
  const [isPosting, setIsPosting] = useState(false);
  async function formSubmit(values) {
    try {
      setIsPosting(true);
      const { data } = await axios({
        method: "post",
        url: "/api/cp/admin/withdrawals/submit",
        data: { withdrawID: withdrawID, ...values },
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
  async function submitReject() {
    try {
      const dialogResult = await Swal.fire({
        title: "آیا مطمئن هستید؟",
        customClass: "font-fa",
        //icon: "warning",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: "خیر",
        color: "red",
      });

      if (!dialogResult.isConfirmed) {
        handleClose();
        return;
      }

      setIsPosting(true);
      const { data } = await axios({
        method: "post",
        url: "/api/cp/admin/withdrawals/reject",
        data: { withdrawID: withdrawID },
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
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "15px" }}
            onClick={() => handleClose()}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />
        </div>

        <Formik
          initialValues={{
            transactionCode: "",
          }}
          onSubmit={formSubmit}
        >
          <Form>
            <div
              className="row justify-content-center"
              style={{ textAlign: "right" }}
            >
              <div className="col-12 mt-1">
                <p className="text-center">کد پیگیری بانکی را وارد کنید</p>
                <div
                  className="input-group-append mb-3 mx-auto"
                  style={{ maxWidth: "240px" }}
                >
                  <Field
                    type="string"
                    name="transactionCode"
                    className="form-control"
                    style={{
                      margin: "0px",
                      borderTopLeftRadius: "0px",
                      borderBottomLeftRadius: "0px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              {isPosting ? (
                <SpinnerCustom type="primary" />
              ) : (
                <>
                  <button className="btn btn-success mx-1">ثبت واریز</button>
                  <button className="btn btn-danger" onClick={submitReject}>
                    رد درخواست
                  </button>
                </>
              )}
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
