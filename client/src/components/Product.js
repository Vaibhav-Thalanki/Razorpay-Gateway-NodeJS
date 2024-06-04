import React from "react";

function Product() {
  const amount = 150;
  const currency = "INR";
  const receipt = "order_rcptid_12";

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const paymentHandler = async (e) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();

    const handleVerification = async ({
      razorpay_payment_id,
      razorpay_signature,
    }) => {
      const response = await fetch("http://localhost:5000/order/verify", {
        method: "POST",
        body: JSON.stringify({
          razorpay_payment_id: razorpay_payment_id,
          order_id: order.id,
          razorpay_signature: razorpay_signature,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const verification_result = await response.text()
      console.log(verification_result);
    };

    var options = {
      key: "rzp_test_m2KIGA4TqUKHI8",
      amount: "5000",
      currency: "INR",
      name: "Zummit Labs",
      description: "Test Transaction",
      image: "",
      order_id: order.id,
      handler: function (response) {
        handleVerification(response);
      },
      prefill: {
        name: "Vaibhav Thalanki",
        email: "",
        contact: "9000090000",
      },
      notes: {
        address: "India",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };
  return (
    <div className="product">
      <h2>Therapist 1hr session</h2>
      <p>Tue 3rd March 2024</p>
      <button onClick={paymentHandler}>Pay</button>
      <div>{}</div>
    </div>
  );
}

export default Product;
