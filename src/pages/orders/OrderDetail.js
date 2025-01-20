import { Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import OrderPrint from "../../businessComponents/orders/detail/OrderPrint";
import OrderProductsComboTable from "../../businessComponents/orders/detail/OrderProductsComboTable";
import OrderProductsTable from "../../businessComponents/orders/detail/OrderProductsTable";
import {
  DateTimeFormat,
  EnumOrderColorStatuses,
  EnumOrderStatuses,
} from "../../constants";
import { formatVNDMoney } from "../../utils";

export const OrderDetailMode = {
  View: 1,
  Edit: 2,
};

const orderStatusBtn = {
  NEW: ["CONFIRMED", "PACKAGED", "DELIVERING", "CANCELED"],
  CONFIRMED: ["DELIVERING", "DELIVERED", "CANCELED"],
  DELIVERING: ["DELIVERED", "FAILED", "CANCELED"],
  DELIVERED: [],
  FAILED: [],
  COMPLETED: [],
  CANCELED: [],
};

const OrderDetail = ({ refreshOrders, orderNo }) => {
  const [orderDetail, setOrderDetail] = useState();

  const elementPrintOrder = useRef();

  const updateStatusOrder = (status) => {};

  //  In bill
  const onPrint = useReactToPrint({
    content: () => elementPrintOrder.current,
  });

  console.log(orderDetail);
  return (
    <>
      <div className="flex justify-between border-slate-100 bg-slate-50	p-4 my-4 rounded">
        <div>
          <div className="flex items-center">
            <span className="font-bold">Đơn hàng:</span>{" "}
            <span className="font-bold text-sky-600	text-base ml-1">
              #{orderDetail?.orderNo}
            </span>
          </div>
          <div className="mt-5">
            <span className="font-semibold">Tổng tiền chưa khuyến mãi:</span>{" "}
            <span className="text-base font-bold">
              {formatVNDMoney(
                orderDetail?.totalPrice +
                  orderDetail?.totalDiscount -
                  orderDetail?.shipmentFee
              )}
              đ
            </span>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Tổng khuyễn mãi:</span>{" "}
            <span className="text-base font-bold">
              {formatVNDMoney(orderDetail?.totalDiscount)}đ
            </span>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Phí ship:</span>{" "}
            <span className="text-base font-bold">
              {formatVNDMoney(orderDetail?.shipmentFee)}đ
            </span>
          </div>
          <div className="mt-2 mb-5">
            <span className="font-semibold">Tổng tiền:</span>{" "}
            <span className="text-base font-bold">
              {formatVNDMoney(orderDetail?.totalPrice)}đ
            </span>
          </div>

          {orderDetail?.orderVouchers?.map((voucher) => {
            return (
              <div key={voucher?.discountCode}>
                <div className="mt-2">
                  <span className="font-semibold">
                    Mã giảm giá: {voucher?.discountCode} -{" "}
                    {voucher?.discountType} -{" "}
                    {formatVNDMoney(voucher?.discountValue)} VND
                  </span>
                </div>
              </div>
            );
          })}

          <div className="mt-2">
            <span className="font-semibold">Thời gian đặt hàng:</span>{" "}
            <span className="text-base">
              {moment(orderDetail?.created_at).format(DateTimeFormat.TimeStamp)}
            </span>
          </div>
          <div className="mt-2">
            <span className="font-semibold">
              Thời gian mong muống nhận hàng:
            </span>{" "}
            <span className="text-base">
              {moment(orderDetail?.expectedDeliveryTime)
                .subtract(7, "hour")
                .format(DateTimeFormat.TimeStamp)}
            </span>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Ghi chú:</span>{" "}
            <span className="text-base">{orderDetail?.note}</span>
          </div>
        </div>
        <div>
          <Tag color={EnumOrderColorStatuses[orderDetail?.status]}>
            {EnumOrderStatuses[orderDetail?.status]}
          </Tag>
        </div>
      </div>
      <div className="flex justify-between my-4">
        <div className="border-2	border-slate-200	border-solid rounded-md w-3/12">
          <div className="font-bold mb-4 border-2	border-slate-200 bg-slate-100 p-4">
            KHÁCH HÀNG
          </div>
          <div className="p-4">
            <div>{orderDetail?.createdBy?.fullname}</div>
            <div className="text-gray-400	">{orderDetail?.createdBy.phone}</div>
          </div>
        </div>
        <div className="border-2	border-slate-200	border-solid rounded-md w-8/12">
          <div className="font-bold mb-4 border-2	border-slate-200 bg-slate-100 p-4">
            NGƯỜI NHẬN
          </div>
          <div className="p-4">
            <div>{orderDetail?.orderAddress?.receiverPhone}</div>
            <div className="text-gray-400">
              {orderDetail?.orderAddress?.receiverPhone}
            </div>
            <div className="text-gray-400">
              {orderDetail?.orderAddress?.province ? (
                <div>
                  {""}{" "}
                  {orderDetail?.orderAddress?.street +
                    ", " +
                    orderDetail?.orderAddress?.ward +
                    ", " +
                    orderDetail?.orderAddress?.district +
                    ", " +
                    orderDetail?.orderAddress?.province}{" "}
                </div>
              ) : (
                <div>Nhận tại cửa hàng</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrderProductsTable
        orderType={orderDetail?.orderType}
        data={orderDetail?.orderProducts}
      />

      <OrderProductsComboTable
        orderType={orderDetail?.orderType}
        data={orderDetail?.orderProductCombos}
      />

      <div className="flex justify-center">
        {orderStatusBtn[orderDetail?.status]?.map((status) => {
          return (
            <>
              <button
                className="p-2 mx-2 my-4 border-0 rounded-md cursor-pointer"
                style={{ backgroundColor: EnumOrderColorStatuses[status] }}
                onClick={() => {
                  updateStatusOrder(status);
                }}
              >
                <span className="font-bold text-white">
                  {EnumOrderStatuses[status]}
                </span>
              </button>
            </>
          );
        })}
      </div>

      <div className="hidden">
        <OrderPrint ref={elementPrintOrder} data={orderDetail} />
      </div>
    </>
  );
};

OrderDetail.propTypes = {
  refreshOrders: PropTypes.func,
  orderNo: PropTypes.string,
};

export default OrderDetail;
