const Page = (props) => {
  //const { data: session, status } = useSession();
  return <h1>home</h1>;
};

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: "/panel",
    },
    props: {},
  };
}

export default Page;
