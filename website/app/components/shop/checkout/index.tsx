"use client";
import { useStore } from "@/src/stores";
import AddressDefault from "./addressDefault";
import BillingDetails from "./BillingDetails";
import OrderAmountDetails from "./OrderAmountDetails";
import PaymentWidget from "./PaymentWidget";
import { useEffect } from "react";
import Delivery from "./delivery";
import VoucherSection from "./voucher";
import { useRouter } from "next/navigation"; // nếu dùng App Router: 'next/navigation'
import { notification } from "antd";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

const BillingMain = () => {
    const router = useRouter();
    const store = useStore();
    const storeAccount = store.accountObservable;
    const storeAddress = store.addressObservable;
    const storeDelivery = store.deliveryObservable;
    const storePayment = store.paymentMethodObservable;
    const storeVoucher = store.voucherObservable;
    const storeCart = store.cartObservable;

    useEffect(() => {
        const fetchData = async () => {
            await storeAccount.getAccount();
            await storeDelivery.getDeliveryDefault();
            await storeDelivery.getListDelivery();
            await storePayment.getListPaymentMethod();
            await storeVoucher.getListVoucher_of_User();
            setTimeout(async () => {
                const idCustomer = storeAccount.account?.userId;
                if (idCustomer) {
                    await storeAddress.getAddressDefault(idCustomer);
                    await storeAddress.getListAddress(idCustomer);
                }
            }, 0);
        };

        fetchData();
    }, []);

    const handlePlaceOrder = async () => {
        let addressDefault = "";
        const customer_id = storeAccount.account?.userId;
        const subtotal = storeCart?.listDataSelected.reduce(
            (sum, item) =>
                sum + Number(item.skus.price_sold || 0) * item.quantity,
            0
        );
        function getDiscountAmount(itemTotal) {
            const voucher = storeVoucher.dataDetail?.voucher;
            if (!voucher) return 0;
            const amount = Number(voucher.discount_amount);
            return voucher.fixed ? (amount / 100) * itemTotal : amount;
        }

        const total = storeCart?.listDataSelected.reduce((sum, item) => {
            const itemTotal = Number(item.skus.price_sold || 0) * item.quantity;
            const fee = storeDelivery.data.detailDelivery?.fee ?? 0;
            const discountAmount = getDiscountAmount(itemTotal);
            return sum + itemTotal + fee - discountAmount;
        }, 0);

        if (storeAddress?.data?.listAddress.length == 0) {
            notification.error({
                message: "Lỗi chưa có địa chỉ",
            });
        } else {
            const orderData = {
                customer_id,
                receive_address_id:
                    storeAddress?.data?.addressDefault.id ||
                    storeAddress?.data?.listAddress?.[0]?.id,
                delivery_method_id: storeDelivery?.data?.detailDelivery.id,
                payment_method_id: storePayment?.data?.selectedPayment,
                cart_item_ids: storeCart?.selectedItems,
                total_price: total,
                discount_price: subtotal,
            };
            await storeCart.checkoutBycart(orderData);
            if (
                storeCart?.dataOrder?.orderId &&
                storeCart?.dataOrder?.payment_method == "COD" &&
                storeCart?.successMsg ==
                    "Order has been successfully created" &&
                storeCart?.status == 201
            ) {
                notification.success({
                    message: "Thông báo",
                    description: "Bạn đã đặt hàng thành công.",
                });

                router.push("/purchase"); // chuyển đến trang mua hàng đã thanh toán
            } else if (
                storeCart?.dataOrder.orderId &&
                storeCart?.dataOrder?.payment_method == "ZALOPAY" &&
                storeCart?.successMsg ==
                    "Order has been successfully created" &&
                storeCart?.status == 201
            ) {
                await storeCart.checkoutByZaloPay({
                    orderId: storeCart.dataOrder.orderId,
                    description: `Thanh toán đơn`,
                    ...(storeVoucher?.dataDetail?.voucher?.id && {
                        voucherIds: [storeVoucher.dataDetail.voucher.id],
                    }),
                });
                router.push(storeCart?.dataOrder?.order_url);
            } else if (
                storeCart?.dataOrder.orderId &&
                storeCart?.dataOrder?.payment_method == "PAYOS" &&
                storeCart?.successMsg ==
                    "Order has been successfully created" &&
                storeCart?.status == 201
            ) {
                await storeCart.checkoutByPayos({
                    orderId: storeCart.dataOrder.orderId,
                    description: `Thanh toán Đơn`,
                    ...(storeVoucher?.dataDetail?.voucher?.id && {
                        voucherIds: [storeVoucher.dataDetail.voucher.id],
                    }),
                });
                await storeVoucher.getListVoucher_of_User();
                router.push(storeCart?.dataOrder?.checkoutUrl);
            }
        }
        // gọi api checkoutByZaloPay
    };
    return (
        <>
            <div className="col-lg-8">
                <div className="checkout_form style2">
                    {/*  <h4 className="title mb30">Billing details</h4> */}

                    <AddressDefault />
                    <Delivery />
                    <VoucherSection storeVoucher={storeVoucher} />
                </div>
            </div>
            {/* End billing content */}

            <div className="col-lg-4">
                <div className="order_sidebar_widget mb30">
                    <h4 className="title">Your Order</h4>
                    <OrderAmountDetails
                        listDataSelected={storeCart.listDataSelected}
                    />
                </div>
                {/* End your order */}

                <PaymentWidget />
                <div className="ui_kit_button payment_widget_btn">
                    <button
                        type="button"
                        className={`ml-auto px-4 py-2 rounded font-semibold flex items-center justify-center gap-1 w-full ${
                            storeCart?.selectedItems?.length > 0
                                ? "bg-[#ee4d2d] text-white cursor-pointer"
                                : "bg-[#ee4d2d] text-white cursor-not-allowed"
                        }`}
                        onClick={handlePlaceOrder}
                        disabled={!storeCart?.selectedItems?.length}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </>
    );
};

export default observer(BillingMain);
// <BillingDetails />
