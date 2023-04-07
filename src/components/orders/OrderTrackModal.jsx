import { faXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import Map, { Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import React, { useState, useEffect } from "react";

export default function OrderTrackModal({ show, handleClose, order }) {
  const [mapState, setMapState] = useState({
    longitude: 46.251993,
    latitude: 38.073825,
    zoom: 11,
  });
  const statusList = ["WaitingMarket", "PreparedByMarket", "OnDelivery"];
  const [mapLoaded, setMapLoaded] = useState(false);

  function BarStatus(barNum) {
    if (!order) return "";
    let idx = statusList.indexOf(order.status);
    if (idx == -1) return "";
    let diff = barNum - 1 - idx;
    if (diff < 0) return "done";
    if (diff == 0) return "active";
    if (diff > 0 && barNum == statusList.length) return "";
    else if (diff > 0) return "";
    return "";
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="py-0">
          <div className="row w-100 justify-content-start ">
            <button
              className="btn"
              style={{ margin: "5px 5px 0px 0px" }}
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body dir="rtl" className=" font-fa">
          <div className="d-flex w-100">
            <Map
              reuseMaps={true}
              mapLib={maplibregl}
              initialViewState={mapState}
              //latitude={mapState.latitude}
              //longitude={mapState.longitude}
              RTLTextPlugin="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js"
              style={{ width: 600, height: 400 }}
              hash={true}
              mapStyle={`https://map.ir/vector/styles/main/mapir-xyz-style.json?x-api-key=${process.env.NEXT_PUBLIC_MAPIR_KEY}`}
              transformRequest={(url, resourceType) => {
                return {
                  url: url,
                  headers: { "x-api-key": process.env.NEXT_PUBLIC_MAPIR_KEY },
                  //credentials: "include", // Include cookies for cross-origin requests
                };
              }}
              //onClick={handleMapClick}
              onLoad={() => setMapLoaded(true)}
            >
              {order ? (
                <>
                  <Marker
                    longitude={order?.Market.marketAddress.gpsLong}
                    latitude={order?.Market.marketAddress.gpsLat}
                    anchor="center"
                    scale={3}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "#5d3ebd", scale: "2" }}
                    ></FontAwesomeIcon>
                  </Marker>
                  <Marker
                    longitude={order?.CustomerAddress.gpsLong}
                    latitude={order?.CustomerAddress.gpsLat}
                    anchor="center"
                    scale={3}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "#28c720", scale: "2" }}
                    ></FontAwesomeIcon>
                  </Marker>
                </>
              ) : (
                ""
              )}
            </Map>
          </div>
          <div className="d-flex w-100 mt-2 ">
            <div
              className="progress justify-content-center pb-4 px-3"
              dir="rtl"
            >
              <div className={`circle ${BarStatus(1)}`}>
                <span className="label">1</span>
                <div
                  className="row"
                  style={{ width: "250px", marginRight: "-18px" }}
                >
                  <span className="title">در انتظار تایید</span>
                </div>
              </div>
              <span className={`bar ${BarStatus(1)}`} />
              <div className={`circle ${BarStatus(2)}`}>
                <span className="label">2</span>
                <div
                  className="row"
                  style={{ width: "250px", marginRight: "-30px" }}
                >
                  <span className="title">در حال آماده سازی</span>
                </div>
              </div>
              <span className={`bar ${BarStatus(2)}`} />
              <div className={`circle ${BarStatus(3)}`}>
                <span className="label">3</span>
                <div
                  className="row"
                  style={{ width: "250px", marginRight: "-18px" }}
                >
                  <span className="title">در حال ارسال</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <style jsx>{`
        *,
        *:after,
        *:before {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Open Sans";
        }

        /* Form Progress */
        .progress {
          width: 1000px;
          margin: 20px auto;
          text-align: center;
          height: fit-content;
          background-color: white !important;
        }
        .progress .circle,
        .progress .bar {
          display: inline-block;
          background: #fff;
          width: 40px;
          height: 40px;
          border-radius: 40px;
          border: 1px solid #d5d5da;
        }
        .progress .bar {
          position: relative;
          width: 80px;
          height: 6px;
          top: 16px;
          margin-left: -1px;
          margin-right: -1px;
          border-left: none;
          border-right: none;
          border-radius: 0;
        }
        .progress .circle .label {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          border-radius: 32px;
          margin-top: 3px;
          color: #b5b5ba;
          font-size: 17px;
        }
        .progress .circle .title {
          color: #b5b5ba;
          font-size: 13px;
          line-height: 30px;
          margin-left: -5px;
        }

        /* Done / Active */
        .progress .bar.done,
        .progress .circle.done,
        .progress .bar.active {
          /*background: #74a7f3;*/
          background: #5d3ebd;
        }
        .progress .bar.active {
          background: linear-gradient(to right, #eee 40%, #fff 60%);
        }
        .progress .circle.done .label {
          color: #fff;
          background: #5d3ebd;
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
        }
        .progress .circle.done .title {
          color: #5d3ebd;
        }
        .progress .circle.active .label {
          color: #fff;
          background: #0c95be;
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
        }
        .progress .circle.active .title {
          color: #0c95be;
        }
      `}</style>
    </>
  );
}
