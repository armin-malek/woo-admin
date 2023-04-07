import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import axios from "axios";
import AdminMarketEditForm from "./AdminMarketEditForm";
import ImageSelector from "../../../ImageSelector";
import { Base64encodeClient } from "../../../../server/common/functions";

export default function AdminMarketEditModal({
  show,
  handleClose,
  market,
  provinces,
  doRerender,
}) {
  const [isPosting, setIsPosting] = useState(false);
  const [marketImage, setMarketImage] = useState();
  const [marketLogo, setMarketLogo] = useState();

  useEffect(() => {
    //if (market?.Image) setMarketImage(market?.Image);
  }, [market]);

  async function formSubmit(values) {
    try {
      setIsPosting(true);
      /*
      var bodyFormData = new FormData();
      Object.keys(values).forEach((key) => {
        bodyFormData.append(key, values[key]);
      });
      bodyFormData.append("image", MarketImage);
      bodyFormData.append("marketId", market.id);
      */
      values.province = parseInt(values.province);
      values.city = parseInt(values.city);
      values.region = parseInt(values.region);
      let response = await axios({
        method: "post",
        url: "/api/cp/admin/markets/update-market",
        //data: bodyFormData,
        //headers: { "Content-Type": "multipart/form-data" },
        data: {
          marketId: market.id,
          ...values,
          image: marketImage,
          logo: marketLogo,
        },
      });
      response = response.data;
      setIsPosting(false);
      if (response.status != true) {
        toast(response.msg, { type: "error" });
        return;
      }
      toast(response.msg, { type: "success" });
      CleanUp();
    } catch (err) {
      toast("خطایی رخ داد", { type: "error" });
      setIsPosting(false);
      console.log(err);
    }
  }

  function CleanUp() {
    setMarketImage(null);
    setMarketLogo(null);
    handleClose();
    doRerender();
  }
  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "15px" }}
            onClick={() => handleClose()}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />
        </div>
        <div className="row w-100 justify-content-center ">
          <div className="col-6 text-center">
            <span>تصویر سوپر مارکت</span>
            <ImageSelector
              orgImage={market?.Image}
              image={marketImage}
              setImage={setMarketImage}
            ></ImageSelector>
          </div>
          <div className="col-6 text-center">
            <span>لوگو سوپر مارکت</span>

            <ImageSelector
              orgImage={market?.logo}
              image={marketLogo}
              setImage={setMarketLogo}
            ></ImageSelector>
          </div>
        </div>
        <Formik
          initialValues={{
            ownerName: market?.User?.fullName || "",
            ownerMobile: market?.User?.mobile || "",
            marketName: market?.name || "",
            province: market?.marketAddress?.Province?.id || "",
            city: market?.marketAddress?.City?.id || "",
            region: market?.marketAddress?.Region?.id || "",
            gpsCordinates: `${market?.marketAddress?.gpsLat},${market?.marketAddress?.gpsLong}`,
            address: market?.marketAddress?.address || "",
          }}
          onSubmit={formSubmit}
        >
          <AdminMarketEditForm
            doRerender={doRerender}
            isPosting={isPosting}
            setIsPosting={setIsPosting}
            provinces={provinces}
          ></AdminMarketEditForm>
        </Formik>
      </Modal.Body>
      <style jsx>{`
        select > option {
          background-color: blue !important;
        }
      `}</style>
    </Modal>
  );
}
