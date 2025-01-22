import { ConfigProvider, Table } from "antd";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import { formatVNDMoney } from "../../../utils";
import dayjs from "dayjs";

const OrderPrint = forwardRef((props, ref) => {
  const { data } = props;
  const dataArray = Array.isArray(data?.orderProducts)
    ? data.orderProducts
    : [];
  const emptyRows = Array(
    8 - dataArray.length > 0 ? 8 - dataArray.length : 0
  ).fill({});
  const combinedData = [...dataArray, ...emptyRows];

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      ellipsis: true,
      align: "right",
      width: 80,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      ellipsis: true,
      align: "right",
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      ellipsis: true,
      align: "right",
      width: 100,
    },
    {
      title: "Đơn giá",
      dataIndex: "agencyPrice",
      key: "agencyPrice",
      render: (value, item) => {
        if (data?.orderType === "agency") {
          return item.agencyPrice > 0
            ? formatVNDMoney(item.agencyPrice) + "đ"
            : "";
        } else {
          return item.retailPrice > 0
            ? formatVNDMoney(item.retailPrice) + "đ"
            : "";
        }
      },
      ellipsis: true,
      align: "right",
    },
    {
      title: "Thành tiền",
      dataIndex: "agencyPrice",
      key: "agencyPrice",
      render: (value, item) => {
        if (data?.orderType === "agency") {
          return item.agencyPrice > 0
            ? formatVNDMoney(item.agencyPrice * item.quantity) + " đ"
            : "";
        } else {
          return item.retailPrice > 0
            ? formatVNDMoney(item.retailPrice * item.quantity) + " đ"
            : "";
        }
      },
      ellipsis: true,
      align: "right",
    },
  ];

  return (
    <div ref={ref} className="px-16 pt-3">
      <div className="font-bold">CÔNG TY TNHH Ô tô hồng sơn</div>
      <div className="text-end">
        <strong>Đơn Hàng:</strong> #{data?.orderNo}
      </div>
      <div className="font-semibold text-xl my-1 text-center">
        HÓA ĐƠN BÁN LẺ
      </div>
      <div>
        <strong>Tên Khách Hàng:</strong> {data?.createdBy?.fullname}
      </div>
      <div className="mt-1">
        <strong>SĐT:</strong> {data?.createdBy?.phone}
      </div>
      <div className="mt-1 mb-2">
        <strong>Địa chỉ:</strong>
        {data?.orderAddress?.province ? (
          <div>
            {""}{" "}
            {data?.orderAddress?.street +
              ", " +
              data?.orderAddress?.ward +
              ", " +
              data?.orderAddress?.district +
              ", " +
              data?.orderAddress?.province}{" "}
          </div>
        ) : (
          <div>Nhận tại cửa hàng</div>
        )}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              cellPaddingBlockSM: 0,
            },
          },
        }}
      >
        <Table
          size="small"
          columns={columns}
          dataSource={combinedData}
          pagination={false}
          bordered
          footer={() => (
            <div className="flex justify-between">
              <div className="font-bold">Tổng cộng</div>
              <div className="font-bold">
                {formatVNDMoney(data?.totalPrice)} đ
              </div>
            </div>
          )}
        />
      </ConfigProvider>
      <div className="mt-3 text-end text-sm mr-12">
        {dayjs().format("DD/MM/YYYY HH:mm")}
      </div>
      <div className="text-end font-bold text-base mr-8">
        Người viết hóa đơn
      </div>
    </div>
  );
});

OrderPrint.displayName = "OrderPrint";
OrderPrint.propTypes = {
  data: PropTypes.object,
};

export default OrderPrint;
