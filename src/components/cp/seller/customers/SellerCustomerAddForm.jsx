import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SellerCustomerAddForm = ({ isPosting }) => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    //console.log("value effect");
  }, [values]);
  function handleSubmit(e) {
    console.log("values", values);
    if (!values.mobile) {
      toast("فیلد موبایل اجباری است!", { type: "warning" });
      e.preventDefault();
    } else if (!/^09[0-9]{9}$/gm.test(values.mobile)) {
      toast("شماره موبایل به درستی وارد نشده", { type: "warning" });
      e.preventDefault();
    }
  }
  return (
    <Form>
      <div
        className="row justify-content-center"
        style={{ textAlign: "right" }}
      >
        <div className="col-12">
          <div className="form-group">
            <label>نام و نام خانوادگی (اختیاری):</label>
            <Field className="form-control" name="fullName" />
          </div>
          <div className="form-group">
            <label>موبایل</label>
            <Field className="form-control" name="mobile" />
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
                  onClick={handleSubmit}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ height: "20px" }}
                  ></FontAwesomeIcon>
                  <span className="pr-1">ایجاد</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};
export default SellerCustomerAddForm;
