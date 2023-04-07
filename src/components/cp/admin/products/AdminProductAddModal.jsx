import { faSave, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import axios from "axios";

export default function AdminProductAddModal({
  show,
  handleClose,
  cats,
  doRerender,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [productImage, setProductImage] = useState();
  const [isPosting, setIsPosting] = useState(false);
  const refFileInput = useRef();

  async function formSubmit(values) {
    try {
      setIsPosting(true);
      var bodyFormData = new FormData();
      Object.keys(values).forEach((key) => {
        bodyFormData.append(key, values[key]);
      });
      bodyFormData.append("image", selectedFile);
      let response = await axios({
        method: "post",
        url: "/api/cp/admin/products/add-product",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
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
    setSelectedFile(null);
    setProductImage();
    handleClose();
    doRerender();
  }

  function ChooseFile() {
    refFileInput.current.click();
  }

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (ev) {
        setProductImage(ev.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }
  function handleImageDeselect() {
    setSelectedFile(null);
    setProductImage();
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
            name: "",
            basePrice: "",
            unitPrice: "",
            boxCount: "",
            category: cats[0]?.id ? cats[0].id : "",
            //specialPrice: "",
          }}
          onSubmit={formSubmit}
        >
          <Form>
            <div
              className="row justify-content-center"
              style={{ textAlign: "right" }}
            >
              <div className="col-12">
                <div className="row justify-content-center">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt="product image"
                      width={100}
                      height={100}
                    ></Image>
                  ) : (
                    <div className="alert alert-warning">
                      تصویری انتخاب نشده!
                    </div>
                  )}
                </div>
                <div className="row justify-content-center mt-2">
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={ChooseFile}
                  >
                    <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                  </button>
                  {selectedFile ? (
                    <button
                      type="button"
                      className="btn btn-danger mr-1"
                      onClick={handleImageDeselect}
                    >
                      <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>عنوان محصول:</label>
                  <Field className="form-control" name="name" />
                </div>
                <div className="form-group">
                  <label>دسته:</label>
                  <Field className="form-control" name="category" as="select">
                    {cats?.map((cat, index) => (
                      <option value={cat.id} key={index}>
                        {cat.name}
                      </option>
                    ))}
                  </Field>
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
                  <label>قیمت هر واحد:</label>
                  <Field
                    className="form-control"
                    name="unitPrice"
                    type="number"
                  />
                </div>
                <div className="form-group">
                  <label>تعداد در جعبه:</label>
                  <Field
                    className="form-control"
                    name="boxCount"
                    type="number"
                  />
                </div>
                <div className="row justify-content-center">
                  {isPosting ? (
                    <>
                      <div className="spinner-border text-primary">
                        <span className="sr-only">در حال ذخیره ...</span>
                      </div>
                    </>
                  ) : (
                    <button
                      className="btn btn-success mt-1"
                      type="submit"
                      disabled={isPosting ? true : false}
                    >
                      {isPosting ? (
                        <>
                          <div className="spinner-border text-light">
                            <span className="sr-only">در حال انجام ...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                          <span className="pr-1">ذخیره</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Formik>
        <input
          type="file"
          className="d-none"
          ref={refFileInput}
          onChange={handleFileChange}
        />
      </Modal.Body>
      <style jsx>{`
        select > option {
          background-color: blue !important;
        }
      `}</style>
    </Modal>
  );
}
