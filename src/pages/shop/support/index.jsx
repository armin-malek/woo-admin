import LayoutShop from "../../../components/LayoutShop";
import SupportPersonel from "../../../components/shop/support/SupportPersonel";
const Page = () => {
  return (
    <>
      <div className="row">
        <h3 className="mt-3 w-100  text-center">
          <strong>ارتباط با ما</strong>
        </h3>
      </div>
      <div className="row justify-content-center mt-2">
        {/*Profile Card 3*/}

        <SupportPersonel
          info={{
            img: "/img/profiles/fanid.jpg",
            name: "محمد حسین حیدری فانید",
            mobile: "09142539326",
            whatsapp: "09142539326",
            telegram: "Mhfanid",
            email: "fanid@befersto.com",
          }}
        ></SupportPersonel>
      </div>
    </>
  );
};
Page.PageLayout = LayoutShop;
export default Page;
