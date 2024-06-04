const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const Sha256 = require("js-sha256")
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order/verify", async (req, res) => {
  try {
    const {order_id, razorpay_payment_id,razorpay_signature} = req.body;
    generated_signature = Sha256.sha256.hmac(process.env.RAZORPAY_SECRET,order_id + "|" + razorpay_payment_id);

    if (generated_signature == razorpay_signature) {
      res.send("verification suceess")
    }
    else{
      res.status(500).send("Error: Verification Failed");
    }

  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
});

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error");
    }
    res.json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
});

app.listen(PORT, () => {
  console.log("listening on", PORT);
});
