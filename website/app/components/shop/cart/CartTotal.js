"use client";
import { toJS } from "mobx";
import { formatCurrency } from "@/utils";
import { useRouter } from "next/navigation";
const CartTotal = ({ cartList, cartObservable }) => {
  const router = useRouter();
  // Lấy danh sách ID đã chọn, đảm bảo là mảng thường
  const selectedIds = cartObservable.selectedItems;
  const subtotal = cartList?.reduce((sum, item) => {
    if (selectedIds?.includes(item.id)) {
      return sum + item.skus.price_sold * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="order_sidebar_widget style2">
      <h4 className="title">Cart Totals</h4>
      <ul className="mb15">
        <li className="subtitle">
          <p>
            Subtotal{" "}
            <span className="float-end">${formatCurrency(subtotal)}</span>
          </p>
        </li>
        <li className="subtitle">
          <p>
            Total{" "}
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
              ? "cursor-not-allowed "
              : "cursor-pointer"
          }`}
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartTotal;
