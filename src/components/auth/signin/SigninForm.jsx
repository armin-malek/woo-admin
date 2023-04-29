import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SigninForm({ csrfToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setIsPosting(true);
      e.preventDefault();
      signIn("custom-credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: `/auth/handle-auth-state/`,
      });
    } catch (err) {
      console.log(err);
      setIsPosting(false);
    }
  };

  return (
    <>
      <form
        className="form-signin shadow"
        action="/api/auth/callback/credentials"
        method="POST"
        onSubmit={handleSubmit}
      >
        <p className="label">نام کاربری و کلمه عبور خود را وارد کنید</p>
        {/* float-label */}
        <input type="hidden" name="csrf" value={csrfToken} />
        <div className="form-group">
          <label style={{ marginBottom: "0px" }}>نام کاربری</label>
          <input
            type="text"
            className="form-control"
            dir="ltr"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label style={{ marginBottom: "0px" }}>کلمه عبور</label>
          <input
            type="password"
            className="form-control"
            dir="ltr"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="row mt-2">
          <div className="col-12">
            {isPosting ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">در حال انجام ...</span>
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-lg btn-default btn-rounded shadow"
              >
                <span>ورود </span>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{ height: "20px" }}
                ></FontAwesomeIcon>
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
