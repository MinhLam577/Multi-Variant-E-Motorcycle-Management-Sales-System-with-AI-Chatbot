// const OrderAmountDetails = ({ listDataSelected }) => {
//   console.log(listDataSelected);

//   return (
//     <ul>
//       <li className="subtitle">
//         <p>
//           Product <span className="float-end">Subtotal</span>
//         </p>
//       </li>
//       <li>
//         <p className="product_name_qnt">
//           Hoodie x2 <span className="float-end">$259.00</span>
//         </p>
//       </li>
//       <li>
//         <p className="product_name_qnt">
//           Seo Books x 1 <span className="float-end">$259.00</span>
//         </p>
//       </li>
//       <li className="subtitle">
//         <p>
//           Subtotal <span className="float-end totals">$907.00</span>
//         </p>
//       </li>
//       <li className="subtitle">
//         <p>
//           Subtotal <span className="float-end totals">$907.00</span>
//         </p>
//       </li>
//       <li className="subtitle">
//         <p>
//           Total <span className="float-end totals">$9,218.00</span>
//         </p>
//       </li>
//     </ul>
//   );
// };

// export default OrderAmountDetails;
import { useStore } from "@/src/stores";
import { formatCurrency } from "@/utils"; // Hàm định dạng tiền nếu có
import { observer } from "mobx-react-lite";

const OrderAmountDetails = observer(({ listDataSelected }) => {
  // Tính tổng phụ (subtotal)
  const store = useStore();
  const storeDelivery = store.deliveryObservable;
  const storeVoucher = store.voucherObservable;
  console.log(storeVoucher?.dataDetail?.voucher?.discount_amount);
  const subtotal = listDataSelected.reduce(
    (sum, item) => sum + item.skus.price_sold * item.quantity,
    0
  );
  function getDiscountAmount(itemTotal) {
    const voucher = storeVoucher.dataDetail?.voucher;
    if (!voucher) return 0;

    const amount = Number(voucher.discount_amount);
    return voucher.fixed ? (amount / 100) * itemTotal : amount;
  }

  const total = listDataSelected.reduce((sum, item) => {
    const itemTotal = item.skus.price_sold * item.quantity;
    const fee = storeDelivery.data.detailDelivery?.fee ?? 0;
    const discountAmount = getDiscountAmount(itemTotal);
    return sum + itemTotal + fee - discountAmount;
  }, 0);

  // tiền giảm voucher
  const calculatePercentDiscount = (percent, total) =>
    formatCurrency((percent / 100) * total);

  return (
    <ul className="divide-y divide-gray-200 text-sm text-gray-700">
      <li className="font-semibold text-base pb-2">
        <p className="flex justify-between">
          <span>Sản phẩm</span>
          <span>Tạm tính</span>
        </p>
      </li>

      {listDataSelected.map((item) => (
        <li key={item.id} className="py-3">
          <p className="font-medium text-gray-900">{item.skus.product.title}</p>
          <div className="flex justify-between  text-gray-600">
            <span>
              {item.skus.name} × {item.quantity}
            </span>
            <span>{formatCurrency(item.skus.price_sold * item.quantity)}</span>
          </div>
        </li>
      ))}

      <li className="pt-4 font-semibold">
        <p className="flex justify-between">
          <span>Tổng tiền hàng</span>
          <span className="text-black">{formatCurrency(subtotal)}</span>
        </p>
        <p className="flex justify-between mt-2 ">
          <span>Tổng tiền phí vận chuyển</span>
          <span className="text-black">
            {formatCurrency(storeDelivery.data.detailDelivery?.fee)}
          </span>
        </p>

        <p className="flex justify-between mt-2">
          <span>Tổng cộng Voucher giảm giá</span>
          {storeVoucher.dataDetail ? (
            <span className="text-orange-600">
              -{" "}
              {storeVoucher?.dataDetail?.voucher?.fixed
                ? calculatePercentDiscount(
                    storeVoucher?.dataDetail?.voucher?.discount_amount || 0,
                    subtotal
                  )
                : formatCurrency(
                    storeVoucher?.dataDetail?.voucher?.discount_amount || 0
                  )}
            </span>
          ) : (
            0
          )}
        </p>
      </li>
      <li className="pt-2 font-bold text-lg border-t border-dashed mt-2 pt-4">
        <p className="flex justify-between">
          <span>Tổng cộng</span>
          <span className="text-orange-600">{formatCurrency(total)}</span>
        </p>
      </li>
    </ul>
  );
});

export default OrderAmountDetails;
