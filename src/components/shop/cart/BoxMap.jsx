import Map, { Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const BoxMap = ({
  setAddress,
  markerLocation,
  setMarkerLocation,
  mapLoaded,
  setMapLoaded,
}) => {
  const [gpsLoaded, setGpsLoaded] = useState(false);
  const [mapState, setMapState] = useState({
    longitude: 46.251993,
    latitude: 38.073825,
    zoom: 11,
  });
  function successCallback(position) {
    let pos = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      zoom: 11,
    };
    if (!markerLocation) setMarkerLocation(pos);
    setMapState(pos);
    setTimeout(() => {
      setGpsLoaded(true);
    }, 2000);
    console.log("position", position);
  }
  function errorCallback(err) {
    setGpsLoaded(true);
    console.log("err", err);
  }
  useEffect(() => {
    console.log("navigator");
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
      };

      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    } else {
      setGpsLoaded(true);
    }
  }, []);

  function handleMapClick(e) {
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_MAPIR_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setAddress(data.address_compact.replace(data.province + "،", ""));
      });

    setMarkerLocation({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
    });
  }
  return (
    <>
      {gpsLoaded ? (
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
          onClick={handleMapClick}
          onLoad={() => setMapLoaded(true)}
        >
          {mapLoaded && markerLocation ? (
            <Marker
              longitude={markerLocation.longitude}
              latitude={markerLocation.latitude}
              anchor="center"
              scale={3}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ color: "#5d3ebd", scale: "2" }}
              ></FontAwesomeIcon>
            </Marker>
          ) : (
            ""
          )}
        </Map>
      ) : (
        <div className="d-flex w-100 justify-content-center my-2">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">درحال بارگذاری</span>
          </div>
        </div>
      )}
    </>
  );
};
export default BoxMap;
