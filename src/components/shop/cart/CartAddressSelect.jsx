import {
  faCaretDown,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
import CartAddressItem from "./CartAddressItem";
import { useRouter } from "next/router";

const BoxMap = dynamic(() => import("./BoxMap"), { ssr: false });

const CartAddressSelect = ({
  initialAddresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [address, setAddress] = useState();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isLoadingAdds, setIsLoadingAdds] = useState(false);

  const [markerLocation, setMarkerLocation] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { marketID } = router.query;

  useEffect(() => {
    loadAddresses();
  }, []);
  async function loadAddresses() {
    try {
      setIsLoadingAdds(true);
      const { data } = await axios.get("/api/shop/get-addresses", {
        params: { marketID: marketID },
      });
      if (data.status != true) {
        toast("خطایی در دریافت آدرس ها رخ داد", { type: "error" });
        return;
      }
      setIsLoadingAdds(false);
      setAddresses(data.data);
    } catch (err) {
      console.log(err);
      toast("خطایی در دریافت آدرس ها رخ داد", { type: "error" });
    }
  }
  function handleClose() {
    setShowSelectModal(false);
    setShowMap(false);
  }
  function selectAddress(id) {
    setSelectedAddress(id);
    handleClose();
  }

  async function handleAddressSubmit() {
    try {
      setIsSubmitting(true);
      const { data } = await axios.post("/api/shop/add-address", {
        longitude: markerLocation.longitude.toString(),
        latitude: markerLocation.latitude.toString(),
        address,
      });
      setIsSubmitting(false);

      setShowMap(false);
      if (data.status != true) {
        toast("خطایی در افزودن آدرس رخ داد.", { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      setAddress("");
      setMarkerLocation(undefined);
      loadAddresses();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div onClick={() => setShowSelectModal(true)}>
        <span
          className="badge"
          style={{
            backgroundColor: selectedAddress ? "#15d256" : "#fbf4f4",
            color: selectedAddress ? "#ffffff" : "#dc3545",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {selectedAddress
            ? addresses
                ?.find((x) => x.id == selectedAddress)
                ?.address?.slice(0, 35) || "آدرس انتخاب شده"
            : "انتخاب آدرس"}
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{ padding: "0px 3px 0px 0px", height: "14px" }}
          ></FontAwesomeIcon>
        </span>
      </div>

      <Modal show={showSelectModal} onHide={handleClose}>
        <Modal.Body dir="rtl" className="font-fa pt-1">
          <div className="row w-100 justify-content-start ">
            <button
              className="btn"
              style={{ marginRight: "15px" }}
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </button>
          </div>

          <div style={{ margin: "10px 15px 10px 15px" }}>
            {showMap ? (
              <>
                <div className="d-flex w-100">
                  <p>موقعیت خود را در نقشه پیدا کرده و روی آن کلیک کنید</p>
                </div>
                <div className="d-flex w-100">
                  <textarea
                    className="form-control"
                    style={{ width: "100%" }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                <div className="d-flex w-100 mt-2">
                  <BoxMap
                    setAddress={setAddress}
                    markerLocation={markerLocation}
                    setMarkerLocation={setMarkerLocation}
                    mapLoaded={mapLoaded}
                    setMapLoaded={setMapLoaded}
                  />
                </div>
                {mapLoaded ? (
                  <div className="d-flex w-100 mt-2">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        backgroundColor: "#5d3ebd",
                        borderColor: "#5d3ebd",
                      }}
                      disabled={mapLoaded ? false : true}
                      onClick={handleAddressSubmit}
                    >
                      {isSubmitting ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <> ثبت آدرس</>
                      )}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
                <div className="d-flex w-100">
                  <p>آدرس خود را جهت دریافت سفارشتان انتخاب کنید</p>
                </div>
                <div className="d-flex w-100 mt-2">
                  <span
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setShowMap(true)}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      style={{ padding: "0px 5px 0px 5px" }}
                    ></FontAwesomeIcon>
                    جستجو در نقشه
                  </span>
                </div>
                <div className="row w-100 mt-2 mr-0">
                  {isLoadingAdds ? (
                    <div className="row w-100 my-2 mr-0 justify-content-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {addresses?.map((item, index) => (
                        <CartAddressItem
                          item={item}
                          selectedAddress={selectedAddress}
                          selectAddress={selectAddress}
                          loadAddresses={loadAddresses}
                          key={index}
                        ></CartAddressItem>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CartAddressSelect;
