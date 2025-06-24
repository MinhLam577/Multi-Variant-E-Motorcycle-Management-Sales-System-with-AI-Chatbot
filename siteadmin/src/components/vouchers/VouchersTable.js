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
import { Send } from "iconsax-react";
import { useStore } from "../../stores";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
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
                    <div className="flex justify-start flex-wrap items-center">
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
                );
            },
            ellipsis: true,
            width: "100px",
            responsive: ["md"],
        },
        {
            title: "Tên voucher",
            dataIndex: "voucher_name",
            key: "voucher_name",
            ellipsis: true,
            width: "140px",
        },
        {
            title: "Loại",
            dataIndex: "fixed",
            key: "fixed",
            ellipsis: true,
            width: "100px",
            render: (fixed) => {
                return <div className="flex">{fixed ? "%" : "Tiền"}</div>;
            },
            responsive: ["lg"],
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusName = status === "active" ? "Active" : "Inactive";
                const statusColor = status === "active" ? "#1677ff" : "#ff4d4f";
                return (
                    <Tag className="text-base !rounded-md" color={statusColor}>
                        {statusName}
                    </Tag>
                );
            },
            ellipsis: true,
            width: "120px",
            responsive: ["xl"],
        },
        {
            title: "Đã sử dụng",
            dataIndex: "uses",
            key: "uses",
            ellipsis: true,
            width: "100px",
            
            render: (inputValue, record) => {
                const limit = record.limit ?? 0; // fallback nếu limit null
                return (
                    <div>
                        <span className="flex justify-end">
                            {inputValue}/ {limit}
                        </span>
                        <Slider
                            className="m-0"
                            min={0}
                            value={
                                typeof inputValue === "number" ? inputValue : 0
                            }
                            handle={null}
                        />
                    </div>
                );
            },
            responsive: ["sm"],
        },
         {
            title: "Khách đã nhận",
            dataIndex: "count_user_get",
            key: "count_user_get",
            ellipsis: true,
            width: "100px",

             align: "center", // ✅ Căn giữa toàn cột
            render: (count_user_get) => {
                
                return (
                    
                        <div className="flex justify-center">
                           <span>
                            {count_user_get}
                            </span> 
                        </div>

                
                );
            },
            responsive: ["sm"],
        },{
  title: "Áp dụng",
  key: "period",
  dataIndex: "start_date", // hoặc để null cũng được vì dùng record
  ellipsis: true,
  width: "140px",
  align: "center",
  render: (_, record) => {
    const start = record.start_date
      ? new Date(record.start_date).toLocaleDateString("vi-VN")
      : "Chưa có";
    const end = record.end_date
      ? new Date(record.end_date).toLocaleDateString("vi-VN")
      : "Chưa có";

    return (
      <div className="">
        {start} - {end}
      </div>
    );
  },
  responsive: ["sm"],
},

        {
            title: "Action",
            dataIndex: "",
            key: "x",
            render: (value, item) => (
                <div className="text-center">
                    <Space className="flex justify-start items-center">
                        <Access
                            permission={ALL_PERMISSIONS.VOURCHERS.UPDATE}
                            hideChildren
                        >
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
                        </Access>

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa voucher"}
                            description={
                                "Bạn có chắc chắn muốn xóa voucher này ?"
                            }
                            onConfirm={() => hanleDeleteVouchers(item.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Access
                                permission={ALL_PERMISSIONS.VOURCHERS.DELETE}
                                hideChildren
                            >
                                <span
                                    style={{
                                        cursor: "pointer",
                                        margin: "0 10px",
                                    }}
                                >
                                    <DeleteOutlined
                                        style={{
                                            fontSize: 20,
                                            color: "#ff4d4f",
                                        }}
                                    />
                                </span>
                            </Access>
                        </Popconfirm>

                        <Access
                            permission={
                                ALL_PERMISSIONS.VOURCHERS.CREATE_FOR_CUSTOMER
                            }
                            hideChildren
                        >
                            <span className="cursor-pointer flex items-center">
                                <Send
                                    size="20"
                                    color="blue"
                                    onClick={() => handlegetIDVoucher(item.id)}
                                />
                            </span>
                        </Access>
                    </Space>
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
        setOpen(false);
    };

    const showModal = () => {
        setOpen(true);
    };

    const handlegetIDVoucher = async (id) => {
        // có id thì mình sẽ gọi hàm setID trong store á
        await voucherStore.setID_ListCustomer_no_voucher(id);
        showModal();
    };

    const hanleDeleteVouchers = async (id) => {
        await voucherStore.deleteVoucherByID(id);
        if (voucherStore.status === 200 || voucherStore.status === 201) {
            message.success(voucherStore.successMsg || "Xóa thành công");
        } else {
            message.error(voucherStore.errorMsg || "Lỗi xóa voucher");
        }
    };

    return (
        <>
            <TableComponent
                loading={voucherStore.loading}
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
                scroll={{ y: "220px" }}
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
