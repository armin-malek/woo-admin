import { useState, useEffect, useRef } from "react";
import {
  faBarcode,
  faList,
  faShop,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import QrScanner from "qr-scanner";
import axios from "axios";
import { toast } from "react-toastify";

export default function SellerQrScanner({ setActiveView }) {
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const videoRef = useRef(null);
  const qrRef = useRef(null);

  async function openQrScanner() {
    qrRef.current.start();
    setShowQrScanner(true);
  }
  async function closeQrScanner() {
    qrRef.current.stop();
    setShowQrScanner(false);
  }
  useEffect(() => {
    if (showQrScanner == false) return;
    async function scanQr() {
      setQrValue(null);
      if (!videoRef) return;
    }
    scanQr();
  }, [showQrScanner]);

  useEffect(() => {
    if (videoRef) {
      qrRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            console.log("result", result.data);
            if (qrValue != result.data) {
              setQrValue(result.data);
              closeQrScanner();
              let { data } = await axios.post("/api/shop/add-market", {
                marketID: result.data.split("/").pop(),
              });
              if (data.status != true) {
                toast(data.msg, { type: "error" });
                return;
              }
              toast(data.msg, { type: "success" });
              getMarkets();
              //reload();
            }
          } catch (err) {
            console.log(err);
            toast("خطایی رخ داد.", { type: "error" });
          }
        },
        { highlightScanRegion: true, maxScansPerSecond: 30 }
      );
    }
  }, [videoRef]);

  return (
    <>
      <button
        className="btn btn-info"
        onClick={() => {
          setActiveView("barcode");
          openQrScanner();
        }}
      >
        <FontAwesomeIcon icon={faBarcode} className="pl-2" />
        اسکن بارکد
      </button>
      <div className={`${showQrScanner ? "" : "d-none"} qr-scanner`}>
        <span
          style={{
            position: "absolute",
            top: "5px",
            right: "10px",
            zIndex: "99",
          }}
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="2x"
            style={{ cursor: "pointer" }}
            onClick={() => closeQrScanner()}
          />
        </span>

        <video
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          ref={videoRef}
        ></video>
      </div>
      <style jsx>{`
        .qr-scanner {
          position: fixed;
          z-index: 98;
          width: 100vw;
          height: 100vh;
          top: 0px;
          right: 0px;
          background: black;
          transition-duration: 0.3s;
        }
      `}</style>
    </>
  );
}
