import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form } from "formik";

const EditForm = ({ isPosting }) => {
  return (
    <Form>
      <div
        className="row justify-content-center"
        style={{ textAlign: "right" }}
      >
        <div className="col-12">
          <div className="form-group">
            <label>نام و نام خانوادگی:</label>
            <Field className="form-control" name="fullName" />
          </div>
          <div className="form-group">
            <label>موبایل:</label>
            <Field
              className="form-control"
              name="mobile"
              type="text"
              inputMode="numeric"
            />
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
                  <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                  <span className="pr-1">ذخیره</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};
export default EditForm;
