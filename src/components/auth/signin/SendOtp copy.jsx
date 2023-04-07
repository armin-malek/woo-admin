import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function SendOtp({ mobile, setSendOTP, csrfToken }) {
  const regexOTP = /^[0-9]{6}$/gm;

  const [OTP, setOTP] = useState("");
  const handleSubmit = async (event) => {
    if (!regexOTP.test(OTP)) {
      alert("enter the OTP proprerly");
      event.preventDefault();
      return;
    } /*
    fetch(event.target.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber: mobile, otp: OTP, csrfToken }),
    }).then((resp) => {
      console.log("resp", resp);
      setSendOTP(true);
    });
    */
  };

  return (
    <form
      action="/api/auth/callback/credentials"
      method="POST"
      className="form-signin shadow"
      onSubmit={handleSubmit}
    >
      <div className="form-group float-label">
        <input type="hidden" name="mobileNumber" value={mobile} />
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input
          type="text"
          name="otp"
          className="form-control"
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
        />
        <label className="form-control-label">کد تایید</label>
      </div>
      <div className="row justify-content-center">
        <div className="col-auto">
          <button
            className="btn btn-lg btn-default btn-rounded shadow"
            //onClick="myFunction()"
          >
            <span>ثبت نام/ ورود</span>
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          </button>
        </div>
      </div>
    </form>
  );
}
