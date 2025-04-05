import { CopyTwoTone, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Slider, Space, Switch, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { DateTimeFormat } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import ModalVouchers from "./modal.vouchers";
import { useEffect, useState } from "react";
import VoucherforCustomer from "./modal_table_user_vourcher";
const getColumnsConfig = ({
  handleViewVouchers,
  hanleDeleteVouchers,
  setOpenModal,
  setDataInit,
  showModal,
  handleEditVouchers,
  handlegetIDVoucher,
}) => {
  return [
    {
      title: "Khuyến mãi",
      dataIndex: "voucher_code",
      key: "voucher_code",
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
      title: "Tên voucher",
      dataIndex: "voucher_name",
      key: "voucher_name",
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
      dataIndex: "uses",
      key: "uses",
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
      dataIndex: "start_date",
      key: "start_date",
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
      dataIndex: "end_date",
      key: "end_date",
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
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value, item) => (
        <div className="text-center">
          <Space>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                handleEditVouchers(item);
              }}
            />

            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa voucher"}
              description={"Bạn có chắc chắn muốn xóa voucher này ?"}
              onConfirm={() => hanleDeleteVouchers(item.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: 20,
                    color: "#ff4d4f",
                  }}
                />
              </span>
            </Popconfirm>
          </Space>
          <Button
            type="primary"
            className="w-[100px]"
            onClick={() => handlegetIDVoucher(item.id)}
          >
            Tặng voucher
          </Button>
        </div>
      ),
      width: "120px",
    },
  ];
};
//start component table modal

///end

const VouchersTable = ({
  handleEditVouchers,
  handleViewVouchers,
  data,
  voucherStore,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [ID, setID] = useState("");
  const [resetDataSource, setResetDataSource] = useState(false);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true, // Thêm ellipsis để cắt ngắn văn bản dài
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      ellipsis: true, // Thêm ellipsis để cắt ngắn văn bản dài
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true, // Thêm ellipsis để cắt ngắn văn bản dài
    },
  ];

  const dataSource = resetDataSource
    ? voucherStore.dataListCustomer_no_voucher?.map((element, i) => ({
        key: element.id,
        name: ` ${element.username}`,
        phoneNumber: `${element.phoneNumber}`,
        email: `${element.email}`,
      }))
    : voucherStore.dataListCustomer_no_voucher?.map((element, i) => ({
        key: element.id,
        name: ` ${element.username}`,
        phoneNumber: `${element.phoneNumber}`,
        email: `${element.email}`,
      }));

  // Reset lại trạng thái khi component render lại
  useEffect(() => {
    if (resetDataSource) {
      setResetDataSource(false); // Reset lại sau khi đã refresh
    }
  }, [resetDataSource]);

  // tao modal table user voucher
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  //end
  const handleOk = async () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    console.log(selectedRowKeys);
    const id = voucherStore.idVoucher;

    // Tạo dữ liệu cần gửi lên BE
    const dataToSend = {
      customer_ids: selectedRowKeys,
    };
    // goi api gửi mảng customer chưa có voucher lên
    await voucherStore.createVoucher_give_Customer(id, dataToSend);
    if (voucherStore.status == 200 || voucherStore.status == 201) {
      message.success(voucherStore.successMsg);
      setOpen(false);
      setSelectedRowKeys([]);
    } else {
      message.error(voucherStore.errorMsg);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handlegetIDVoucher = async (id) => {
    // có id thì mình sẽ gọi hàm setID trong store á
    console.log(voucherStore.idVoucher);
    await voucherStore.setID_ListCustomer_no_voucher(id);
    // setID(id);
    showModal();
  };

  const hanleDeleteVouchers = async (id) => {
    await voucherStore.deleteVoucherByID(id);
    if (voucherStore.status === 200 || voucherStore.status === 201) {
      message.success(voucherStore.successMsg || "Xóa thành công");
      // fetchData();
    } else {
      message.error(voucherStore.errorMsg || "Lỗi xóa voucher");
    }
  };

  return (
    <>
      <TableComponent
        loading={false}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        loadData={() => {}}
        data={data}
        filterValue={null}
        handleEditVouchers={handleEditVouchers}
        handleViewVouchers={handleViewVouchers}
        hanleDeleteVouchers={hanleDeleteVouchers}
        showModal={showModal}
        handlegetIDVoucher={handlegetIDVoucher}
      />
      <ModalVouchers
        setOpen={setOpen}
        open={open}
        handleOk={handleOk}
        handleCancel={handleCancel}
        VoucherComponent={
          <VoucherforCustomer
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
          />
        }
      />
    </>
  );
};

VouchersTable.propTypes = {
  handleEditVouchers: PropTypes.func,
  handleViewVouchers: PropTypes.func,
};

export default VouchersTable;
// [
//   {
//     discount: "1",
//     discountCode: "MAJSJk",
//     description: "Mã giảm giá cho khách hàng mới",
//     discountName: "CTKM",
//     discountType: "Giảm giá",
//     status: "Chưa kích hoạt",
//     usedCount: 8,
//     fromDate: "2022-01-01 00:00:00",
//     end: "2022-12-31 23:59:59",
//   },
//   {
//     discountId: "1",
//     discountCode: "SJJSSS",
//     description: "Mã giảm giá cho khách hàng mới",
//     discountName: "CTKM",
//     discountType: "Giảm giá",
//     status: "Chưa kích hoạt",
//     usedCount: 2,
//     fromDate: "2022-01-01 00:00:00",
//     end: "2022-12-31 23:59:59",
//   },
// ]
// dataSource={dataSource}
//             columns={columns}
//             rowSelection={rowSelection}
