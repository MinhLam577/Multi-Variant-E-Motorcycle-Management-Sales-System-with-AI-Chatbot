"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
import { useEffect, useState } from "react";

const PaymentWidget = observer(() => {
  // const [selectedPayment, setSelectedPayment] = useState("");

  const store = useStore();
  const storePayment = store.paymentMethodObservable;
  // Set mặc định là COD nếu có
  useEffect(() => {
    console.log("re - render ");
    if (storePayment?.data?.payments?.length) {
      const cod = storePayment.data.payments.find(
        (item) => item.name.toLowerCase() === "cod"
      );
      console.log(cod);
      if (cod) {
        storePayment.setSelectedPayment(cod.id);
      }
    }
  }, [storePayment?.data?.payments]);

  const handleChange = (id) => {
    storePayment.setSelectedPayment(id);
  };
  console.log(storePayment?.data?.selectedPayment);
  return (
    <div className="payment_widget">
      <div className="wrapper">
        <div className="form-check mb20">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Direct bank transfer
          </label>
        </div>
        {/* End form-check */}

        <div className="bt_details">
          <p data-placeholder="Enter your payment reference">
            Make your payment directly into our bank account. Please use your
            Order ID as the payment reference. Your order will not be shipped
            until the funds have.
          </p>
        </div>
        {storePayment?.data.payments?.map((element, index) => (
          <div className="form-check mb-4" key={index}>
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id={`payment-${index}`}
              value={element.id}
              checked={storePayment?.data?.selectedPayment === element.id}
              onChange={() => handleChange(element.id)}
            />
            <label className="form-check-label" htmlFor={`payment-${index}`}>
              {element.name}
            </label>
          </div>
        ))}

        {/* End form-check */}

        {/* End form-check */}
      </div>
    </div>
  );
});

export default PaymentWidget;
