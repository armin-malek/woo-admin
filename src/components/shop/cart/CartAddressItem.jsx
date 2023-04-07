import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { useState } from "react";

const CartAddressItem = ({
  item,
  selectedAddress,
  selectAddress,
  loadAddresses,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  async function handleRemove() {
    try {
      setIsRemoving(true);
      const { data } = await axios.post("/api/shop/remove-address", {
        AddressID: item.id,
      });
      setIsRemoving(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      toast(data.msg, { type: "success" });
      loadAddresses();
    } catch (err) {
      console.log(err);
      setIsRemoving(false);
      toast("خطایی در حذف آدرس رخ داد.", { type: "error" });
    }
  }
  return (
    <>
      {isRemoving ? (
        <div
          className="col-12 mb-1"
          style={{
            border: "1px solid gray",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="col-12 mb-1"
          style={{
            border: "1px solid gray",
            borderRadius: "5px",
            padding: "10px",
            backgroundColor: !item.inRange && "#5e5e5e33",
          }}
        >
          <div className="d-flex">
            {item.inRange ? (
              <>
                <div
                  style={{
                    paddingRight: "0px",
                    flexGrow: 1,
                    minWidth: "40px",
                  }}
                  onClick={() => selectAddress(item.id)}
                >
                  <Image
                    src={
                      selectedAddress == item.id
                        ? "/icons/circle-checked.png"
                        : "/icons/circle-empty.png"
                    }
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                </div>
                <div
                  style={{ flexGrow: 8 }}
                  onClick={() => selectAddress(item.id)}
                >
                  <span style={{ fontSize: "14px" }}>{item.address}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    paddingRight: "0px",
                    flexGrow: 1,
                    minWidth: "40px",
                  }}
                  onClick={() =>
                    toast(
                      "به دلیل فاصله زیاد امکان ارسال به این آدرس وجود ندارد.",
                      { type: "warning" }
                    )
                  }
                >
                  <Image
                    src={
                      selectedAddress == item.id
                        ? "/icons/circle-checked.png"
                        : "/icons/circle-minus-red.png"
                    }
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                </div>
                <div
                  style={{ flexGrow: 8 }}
                  onClick={() =>
                    toast(
                      "به دلیل فاصله زیاد امکان ارسال به این آدرس وجود ندارد.",
                      { type: "warning" }
                    )
                  }
                >
                  <span style={{ fontSize: "14px" }}>{item.address}</span>
                </div>
              </>
            )}

            <div
              className=""
              style={{
                textAlign: "center",
                flexGrow: 1,
                writingMode: "vertical-lr",
                cursor: "pointer",
              }}
              onClick={() => handleRemove()}
            >
              <FontAwesomeIcon icon={faXmark} color="#f20a30"></FontAwesomeIcon>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CartAddressItem;
