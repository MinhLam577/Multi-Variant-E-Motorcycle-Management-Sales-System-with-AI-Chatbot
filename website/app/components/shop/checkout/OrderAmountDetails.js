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
import { formatCurrency } from "@/utils"; // Hàm định dạng tiền nếu có

const OrderAmountDetails = ({ listDataSelected }) => {
  // Tính tổng phụ (subtotal)
  const subtotal = listDataSelected.reduce(
    (sum, item) => sum + item.skus.price_sold * item.quantity,
    0
  );

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
          <span>Tạm tính</span>
          <span className="text-orange-600">{formatCurrency(subtotal)}</span>
        </p>
      </li>
      <li className="pt-2 font-bold text-lg border-t border-dashed mt-2 pt-4">
        <p className="flex justify-between">
          <span>Tổng cộng</span>
          <span className="text-orange-600">{formatCurrency(subtotal)}</span>
        </p>
      </li>
    </ul>
  );
};

export default OrderAmountDetails;
