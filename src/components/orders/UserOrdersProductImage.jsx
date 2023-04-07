import Image from "next/image";

const UserOrdersProductImage = ({ image, quantity }) => {
  return (
    <div style={{ maxWidth: "fit-content", display: "inline-block" }}>
      <Image
        src={image}
        alt="product image"
        width={40}
        height={40}
        style={{
          border: "2px solid rgb(237 237 237 / 90%)",
          borderRadius: "3px",
          marginLeft: "0px",
        }}
      ></Image>
      <span
        className="badge badge-secondary"
        style={{
          position: "relative",
          right: "-48px",
          bottom: "-13px",
          backgroundColor: "white",
          color: "gray",
          border: "2px solid rgb(237 237 237 / 90%)",
          fontSize: "11px",
          padding: "3px 5px 3px 5px",
        }}
      >
        {quantity}
      </span>
    </div>
  );
};
export default UserOrdersProductImage;
