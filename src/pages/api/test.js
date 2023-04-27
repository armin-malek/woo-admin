import woo from "../../server/common/woocommerce";

const handler = async (req, res) => {
  try {
    const { data } = await woo.get("products/attributes");
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
