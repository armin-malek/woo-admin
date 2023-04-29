import Image from "next/image";
import SigninForm from "../../components/auth/signin/SigninForm";

import { getCsrfToken } from "next-auth/react";
import LayoutBase from "../../components/LayoutBase";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function SignIn({ csrfToken }) {
  return (
    <>
      <LayoutBase>
        <div className="row no-gutters vh-100 proh bg-template">
          <div className="col align-self-center px-3 text-center">
            <Image
              src="/img/logo.png"
              alt="لوگو بفرستو"
              width={130}
              height={80}
            ></Image>
            <SigninForm csrfToken={csrfToken}></SigninForm>
          </div>
        </div>
      </LayoutBase>
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
