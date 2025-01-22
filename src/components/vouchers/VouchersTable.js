import { CopyTwoTone } from "@ant-design/icons";
import { Button, Slider, Switch, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { DateTimeFormat } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({ handleViewVouchers }) => {
  return [
    {
      title: "Khuyến mãi",
      dataIndex: "discountCode",
      key: "discountCode",
      render: (value, item) => {
        return (
          <div className="flex flex-col">
            <div className="flex justify-center">
              <Button
                type="link"
                className="custom-antd-btn-ellipsis-content !p-0"
                onClick={() => handleViewVouchers(item)}
              >
                {value}
              </Button>
              <Button
                type="text"
                icon={<CopyTwoTone />}
                className="custom-antd-btn-ellipsis-content !p-0"
                onClick={() => navigator.clipboard.writeText(value)}
              ></Button>
            </div>
            <span
              className="text-xs text-gray-500 text-center"
              style={{ whiteSpace: "normal" }}
            >
              {item.description}
            </span>
          </div>
        );
      },
      ellipsis: true,
      width: "140px",
    },
    {
      title: "Hình thức",
      dataIndex: "discountName",
      key: "discountName",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Loại",
      dataIndex: "discountType",
      key: "discountType",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Hiển thị",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Switch
          checked={isActive}
          checkedChildren="Hiển thị"
          unCheckedChildren="Ẩn"
        />
      ),
      ellipsis: true,
      width: "90px",
      sorter: false,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className="uppercase"
          color={
            status === "ACTIVE"
              ? "#87d068"
              : status === "INACTIVE"
              ? "#ff4d4f"
              : "#108ee9"
          }
        >
          {status}
        </Tag>
      ),
      ellipsis: true,
      width: "120px",
    },
    {
      title: "Đã sử dụng",
      dataIndex: "usedCount",
      key: "usedCount",
      ellipsis: true,
      width: "100px",
      render: (inputValue) => {
        return (
          <div>
            <span className="flex justify-end">{inputValue}/10</span>
            <Slider
              className="m-0"
              min={0}
              max={10}
              value={typeof inputValue === "number" ? inputValue : 0}
              handle={null}
            />
          </div>
        );
      },
    },
    {
      title: "Bắt đầu",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (toDate) => {
        return (
          <div>
            <span>{moment(toDate).format(DateTimeFormat.Date)}</span>
            <br />
            <span>{moment(toDate).format("HH:mm:ss")}</span>
          </div>
        );
      },
      sorter: true,
      ellipsis: true,
      width: "120px",
    },
    {
      title: "Kết thúc",
      dataIndex: "toDate",
      key: "toDate",
      render: (toDate) => {
        return (
          <div>
            <span>{moment(toDate).format(DateTimeFormat.Date)}</span>
            <br />
            <span>{moment(toDate).format("HH:mm:ss")}</span>
          </div>
        );
      },
      sorter: true,
      ellipsis: true,
      width: "120px",
    },
  ];
};

const VouchersTable = ({ handleEditVouchers, handleViewVouchers }) => {
  const hanleDeleteVouchers = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa voucher này?"
    )(() => {});
  };

  return (
    <>
      <TableComponent
        loading={false}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        loadData={() => {}}
        data={[
          {
            discountId: "1",
            discountCode: "MAJSJS",
            description: "Mã giảm giá cho khách hàng mới",
            discountName: "CTKM",
            discountType: "Giảm giá",
            status: "Chưa kích hoạt",
            usedCount: 8,
            fromDate: "2022-01-01 00:00:00",
            end: "2022-12-31 23:59:59",
          },
          {
            discountId: "1",
            discountCode: "SJJSSS",
            description: "Mã giảm giá cho khách hàng mới",
            discountName: "CTKM",
            discountType: "Giảm giá",
            status: "Chưa kích hoạt",
            usedCount: 2,
            fromDate: "2022-01-01 00:00:00",
            end: "2022-12-31 23:59:59",
          },
        ]}
        filterValue={null}
        handleEditVouchers={handleEditVouchers}
        handleViewVouchers={handleViewVouchers}
        hanleDeleteVouchers={hanleDeleteVouchers}
      />
    </>
  );
};

VouchersTable.propTypes = {
  handleEditVouchers: PropTypes.func,
  handleViewVouchers: PropTypes.func,
};

export default VouchersTable;
