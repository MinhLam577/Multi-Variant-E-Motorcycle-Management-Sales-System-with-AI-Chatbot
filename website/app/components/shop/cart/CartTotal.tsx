"use client";
import { useStore } from "@/context/store.context";
import { formatCurrency } from "@/utils";
import { useRouter } from "next/navigation";
const CartTotal = ({ cartList }) => {
    const cartObservable = useStore().cartObservable;
    const router = useRouter();
    // Lấy danh sách ID đã chọn, đảm bảo là mảng thường
    const selectedIds = cartObservable.selectedItems;
    const subtotal = cartList?.reduce((sum, item) => {
        if (selectedIds?.includes(item.id)) {
            return sum + item.skus.price_sold * item.quantity;
        }
        return sum;
    }, 0);
    const handleCheckout = async () => {
        router.push("/checkout");
    };

    return (
        <div className="order_sidebar_widget style2">
            <h4 className="title">Tổng giỏ hàng</h4>
            <ul className="mb15">
                <li className="subtitle">
                    <p>
                        Tạm tính{" "}
                        <span className="float-end">
                            ${formatCurrency(subtotal)}
                        </span>
                    </p>
                </li>
                <li className="subtitle">
                    <p>
                        Tổng tiền{" "}
                        <span className="float-end totals color-orose">
                            ${formatCurrency(subtotal)}
                        </span>
                    </p>
                </li>
            </ul>
            <div className="ui_kit_button payment_widget_btn">
                <button
                    type="button"
                    disabled={!cartObservable.selectedItems?.length}
                    className={`btn btn-thm btn-block ${
                        !cartObservable.selectedItems?.length
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                    }`}
                    onClick={() => handleCheckout()}
                >
                    Chuyển Đến Thanh Toán
                </button>
            </div>
        </div>
    );
};

export default CartTotal;
