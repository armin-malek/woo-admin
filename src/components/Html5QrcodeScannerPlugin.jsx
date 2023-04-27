// file = Html5QrcodePlugin.jsx
import { faBarcode, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Html5QrcodeScanner,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { useEffect, useState, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
/*
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};
*/
const Html5QrcodeScannerPlugin = ({ fps = 10, SubmitBarcode }) => {
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const CustomeHtml5QrCode = useRef();

  useEffect(() => {
    console.log("showQrScanner", showQrScanner);
  }, [showQrScanner]);

  function openQrScanner() {
    console.log("openQrScanner");

    //setShowQrScanner(true);
    //const qr = new Html5Qrcode();
    //qr.clear()
    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          //var cameraId = devices[0].id;
          CustomeHtml5QrCode.current = new Html5Qrcode(
            qrcodeRegionId

            //,{ formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ] }
          );

          CustomeHtml5QrCode.current
            .start(
              { facingMode: "environment" },

              {
                fps, // Optional, frame per seconds for qr code scanning
                //qrbox: { width: 450, height: 250 }, // Optional, if you want bounded box UI
                formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
              },
              (decodedText, decodedResult) => {
                // do something when code is read
                console.log("decodedText", decodedText);
                console.log("decodedResult", decodedResult);
                if (scanResult != decodedText) {
                  setScanResult(decodedText);
                  SubmitBarcode(decodedText);
                  closeQrScanner();
                }
              },
              (errorMessage) => {
                console.log("decode err", errorMessage);
                // parse error, ignore it.
              }
            )
            .catch((err) => {
              console.log("start error", err);
            });
        }
      })
      .catch((err) => {
        // handle err
        console.log("cam error", err);
      });
  }

  async function closeQrScanner() {
    //qrRef.current.stop();
    if (CustomeHtml5QrCode?.current) {
      console.log("try stop");
      CustomeHtml5QrCode.current.stop().then(() => {
        console.log("stop");

        // CustomeHtml5QrCode.current.clear().then(() => {
        //   console.log("clear");
        // });
      });
    }
    //CustomeHtml5QrCode?.current?.stop();
    //CustomeHtml5QrCode?.current?.clear();
    setScanResult();
    setShowQrScanner(false);
  }
  return (
    <>
      <button
        className="btn btn-info"
        onClick={() => {
          setShowQrScanner(true);
          openQrScanner();
        }}
      >
        <FontAwesomeIcon icon={faBarcode} className="pl-2" />
        اسکن بارکد
      </button>
      <div className={`${showQrScanner ? "" : "d-none"} qr-scanner`}>
        <div id={qrcodeRegionId}></div>
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
            style={{ cursor: "pointer", height: "40px" }}
            onClick={() => closeQrScanner()}
          />
        </span>
      </div>
      <style jsx>{`
        .qr-scanner {
          position: fixed !important;
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
};

export default Html5QrcodeScannerPlugin;
