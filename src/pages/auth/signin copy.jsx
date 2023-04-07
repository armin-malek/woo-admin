import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const { error } = router.query;
  return (
    <>
      <form action="/api/auth/callback/credentials" method="POST">
        {error ? <h1>Wrong Credentials</h1> : ""}
        <div className="row justify-content-center">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label htmlFor="">mobile</label>
          <input
            type="text"
            name="mobileNumber"
            className="form-control"
            required
          />
          <br />
          <label htmlFor="">code</label>
          <input type="password" name="otp" required />
          <br />
          <button type="submit">login</button>
        </div>
      </form>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
