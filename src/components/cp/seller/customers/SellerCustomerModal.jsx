import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import axios from "axios";
import SellerCustomerAddForm from "./SellerCustomerAddForm";

export default function SellerCustomerModal({
  show,
  handleClose,
  customer,
  LoadCustomers,
}) {
  const [isPosting, setIsPosting] = useState(false);
  async function formSubmit(values) {
    try {
      setIsPosting(true);

      let body = { ...values };
      body.province = parseInt(body.province);
      body.city = parseInt(body.city);
      body.region = parseInt(body.region);
      console.log("body", body);

      body.userId = customer.id;
      let response = await axios({
        method: "post",
        url: "/api/cp/seller/cutomers/update",
        data: body,
        //headers: { "Content-Type": "multipart/form-data" },
      });
      response = response.data;
      setIsPosting(false);
      if (response.status != true) {
        toast(response.msg, { type: "error" });
        return;
      }
      toast(response.msg, { type: "success" });

      handleClose();
      LoadCustomers();
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
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
            fullName: "",
            mobile: "",
          }}
          onSubmit={formSubmit}
        >
          <SellerCustomerAddForm
            isPosting={isPosting}
            setIsPosting={setIsPosting}
          ></SellerCustomerAddForm>
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
