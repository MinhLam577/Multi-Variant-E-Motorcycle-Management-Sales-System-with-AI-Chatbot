"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/store.context";
import { useEffect } from "react";

const PaymentWidget = observer(() => {
    const store = useStore();
    const storePayment = store.paymentMethodObservable;
    // Set mặc định là COD nếu có
    useEffect(() => {
        if (storePayment?.data?.payments?.length) {
            const cod = storePayment.data.payments.find(
                (item) => item.name.toLowerCase() === "cod"
            );
            if (cod) {
                storePayment.setSelectedPayment(cod.id);
            }
        }
    }, [storePayment?.data?.payments]);

    const handleChange = (id) => {
        storePayment.setSelectedPayment(id);
    };
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
                    <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                    >
                        Phương thức thanh toán
                    </label>
                </div>
                {/* End form-check */}

                <div className="bt_details">
                    <p data-placeholder="Enter your payment reference">
                        Quý khách có thể thanh toán bằng *chuyển khoản ngân
                        hàng* hoặc *tiền mặt khi nhận hàng*.
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
                            checked={
                                storePayment?.data?.selectedPayment ===
                                element.id
                            }
                            onChange={() => handleChange(element.id)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`payment-${index}`}
                        >
                            {element.name}
                        </label>
                    </div>
                ))}

                {/* End form-check */}
            </div>
        </div>
    );
});

export default PaymentWidget;
