const handler = async (req, res) => {
  try {
    res.send(process.env);
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
