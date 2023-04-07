import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default function GetOtp({ mobile, setMobile, otpRequest, isPosting }) {
  function handleSubmit(event) {
    event.preventDefault();
    otpRequest(mobile);
  }

  return (
    <form
      action=""
      method="POST"
      className="form-signin shadow"
      onSubmit={handleSubmit}
    >
      <div className="form-group float-label">
        <input
          type="text"
          inputMode="numeric"
          className="form-control"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <label htmlFor="inputTel" className="form-control-label">
          شماره موبایل
        </label>
      </div>
      <div className="row justify-content-center">
        {isPosting ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">در حال انجام ...</span>
          </div>
        ) : (
          <div className="col-auto">
            <button className="btn btn-lg btn-default btn-rounded shadow">
              <span>دریافت کد تایید </span>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ height: "20px" }}
              ></FontAwesomeIcon>
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
