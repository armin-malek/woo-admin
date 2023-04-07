import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const Page = () => {
  return <></>;
};

export async function getServerSideProps(context) {
  console.log("server auth");
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  console.log("session", session);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
      props: {},
    };
  }

  console.log("session", session);

  return {
    redirect: {
      permanent: false,
      destination: "/panel",
    },
    props: {},
  };
}

export default Page;
