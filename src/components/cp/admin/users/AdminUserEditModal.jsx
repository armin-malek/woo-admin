import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import axios from "axios";
import EditForm from "./EditForm";

export default function AdminUserEditModal({
  show,
  handleClose,
  user,
  LoadProducts,
}) {
  const [isPosting, setIsPosting] = useState(false);
  async function formSubmit(values) {
    try {
      setIsPosting(true);

      let { data } = await axios({
        method: "post",
        url: "/api/cp/admin/users/update-user",
        data: { userId: user.id, ...values },
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
    LoadProducts();
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
            fullName: user?.fullName || "",
            mobile: user?.mobile || "",
          }}
          onSubmit={formSubmit}
        >
          <EditForm LoadProducts isPosting={isPosting}></EditForm>
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
