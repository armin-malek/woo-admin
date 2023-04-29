import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const Page = () => {
  return <></>;
};

export async function getServerSideProps(context) {
  try {
    console.log("server auth");
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    //console.log("session", session);
    if (!session) {
      console.log("no session");
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signin",
        },
        props: {},
      };
    }

    //console.log("session", session);

    console.log("to panel");
    return {
      redirect: {
        permanent: false,
        destination: "/panel",
      },
      props: {},
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
      props: {},
    };
  }
}

export default Page;
