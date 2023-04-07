import { faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function ImageSelector({ orgImage, image, setImage }) {
  //const [selectedImage, setSelectedImage] = useState();
  //const [currentImage, setCurrentImage] = useState(image);
  const [displayImage, setDisplayImage] = useState(orgImage);
  const refFileInput = useRef();
  /*
  useEffect(() => {
    setCurrentImage(image);
  }, [image]);
*/
  function ChooseFile() {
    refFileInput.current.click();
  }

  function handleFileChange(e) {
    //setSelectedImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (ev) {
        setImage(ev.target.result);
        setDisplayImage(ev.target.result);
        //setSelectedImage(ev.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }
  function handleImageDeselect() {
    //setSelectedImage(null);
    setImage(null);
    setDisplayImage(orgImage);
    // if (image)
  }

  return (
    <>
      <div className="row justify-content-center">
        {displayImage ? (
          <Image
            src={displayImage || orgImage}
            alt="product image"
            width={100}
            height={100}
          ></Image>
        ) : (
          <div className="alert alert-warning">بدون تصویر!</div>
        )}
      </div>
      <div className="row justify-content-center mt-2">
        <button className="btn btn-info" type="button" onClick={ChooseFile}>
          <FontAwesomeIcon
            icon={faUpload}
            style={{ height: "20px" }}
          ></FontAwesomeIcon>
        </button>
        {image && orgImage != image && (
          <button
            type="button"
            className="btn btn-danger mr-1"
            onClick={(e) => handleImageDeselect(e)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ height: "20px" }}
            ></FontAwesomeIcon>
          </button>
        )}
      </div>
      <input
        type="file"
        className="d-none"
        ref={refFileInput}
        onChange={(e) => handleFileChange(e)}
      />
    </>
  );
}
