import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import axios from "axios";
import AdminMarketAddForm from "./AdminMarketAddForm";
import ImageSelector from "../../../ImageSelector";

export default function AdminMarketAddModal({
  show,
  handleClose,
  provinces,
  doRerender,
}) {
  const [isPosting, setIsPosting] = useState(false);
  const [marketImage, setMarketImage] = useState();
  const [marketLogo, setMarketLogo] = useState();
  async function formSubmit(values) {
    try {
      setIsPosting(true);

      /*
      let body = { ...values };

      body.province = parseInt(body.province);
      body.city = parseInt(body.city);
      body.region = parseInt(body.region);
      console.log("body", body);
      */
      values.province = parseInt(values.province);
      values.city = parseInt(values.city);
      values.region = parseInt(values.region);

      let response = await axios({
        method: "post",
        url: "/api/cp/admin/markets/add-market",
        data: {
          ...values,
          image: marketImage,
          logo: marketLogo,
        },
        //headers: { "Content-Type": "multipart/form-data" },
      });
      response = response.data;
      setIsPosting(false);
      if (response.status != true) {
        toast(response.msg, { type: "error" });
        return;
      }
      toast(response.msg, { type: "success" });
      CleanUp();
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
  }

  function CleanUp() {
    handleClose();
    doRerender();
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
        <div className="row w-100 justify-content-center ">
          <div className="col-6 text-center">
            <span>تصویر سوپر مارکت</span>
            <ImageSelector
              image={marketImage}
              setImage={setMarketImage}
            ></ImageSelector>
          </div>
          <div className="col-6 text-center">
            <span>لوگو سوپر مارکت</span>

            <ImageSelector
              image={marketLogo}
              setImage={setMarketLogo}
            ></ImageSelector>
          </div>
        </div>
        <Formik
          initialValues={{
            mobile: "",
            fullName: "",
            marketName: "",
            province: "",
            city: "",
            region: "",
            gpsCordinates: "",
            address: "",
          }}
          onSubmit={formSubmit}
        >
          <AdminMarketAddForm
            doRerender={doRerender}
            isPosting={isPosting}
            provinces={provinces}
          ></AdminMarketAddForm>
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
