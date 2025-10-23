import { Button, message, notification, Popconfirm } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { useState } from "react";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import UserStaffObservable from "../../stores/user.store";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
import { formatVNDMoney, getErrorMessage } from "../../utils";
const getColumnsConfig = ({
    handleUpdateUser,
    handleViewUser,
    handleDeleteUser,
}) => {
    return [
        {
            title: "Họ tên",
            dataIndex: "username",
            key: "username",
            render: (value, item) => {
                return (
                    <Button
                        className="!p-0"
                        type="link"
                        onClick={() => handleViewUser(item)}
                    >
                        {value}
                    </Button>
                );
            },
            width: "150px",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "140px",
            ellipsis: true,
            responsive: ["lg"],
        },
        {
            title: "Địa chỉ nhận hàng",
            dataIndex: "receive_address",
            key: "receive_address",
            width: "250px",
            ellipsis: true,
            render: (address) => {
                if (
                    !address ||
                    !address?.street ||
                    !address?.ward ||
                    !address?.district ||
                    !address?.province
                ) {
                    return "Chưa có địa chỉ nhận hàng";
                }
                return [
                    address?.street,
                    address?.ward,
                    address?.district,
                    address?.province,
                ].join(", ");
            },
            responsive: ["xl"],
        },
        {
            title: "SL Đơn hàng",
            dataIndex: "total_order",
            key: "total_order",
            ellipsis: true,
            responsive: ["sm"],
        },
        {
            title: "Tổng chi tiêu",
            dataIndex: "total_spending",
            key: "total_spending",
            ellipsis: true,
            render: (totalSpending) => {
                return <span>{formatVNDMoney(totalSpending)}</span>;
            },
            responsive: ["sm"],
        },
        {
            title: "Action",
            render: (text, record) => {
                return (
                    <>
                        <Access
                            permission={ALL_PERMISSIONS.CUSTOMERS.DELETE}
                            hideChildren
                        >
                            <span
                                style={{
                                    cursor: "pointer",
                                    margin: "0 20px",
                                }}
                            >
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    onClick={() =>
                                        processWithModals({
                                            modalName:
                                                ProcessModalName.ConfirmCustomContent,
                                            title: "Xác nhận",
                                            content: `Bạn có chắc chắn muốn xóa khách hàng #${record.id} không?`,
                                            onOk: () => {
                                                if (handleDeleteUser)
                                                    handleDeleteUser(record.id);
                                            },
                                        })
                                    }
                                />
                            </span>
                        </Access>
                        <Access
                            permission={ALL_PERMISSIONS.CUSTOMERS.UPDATE}
                            hideChildren
                        >
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleUpdateUser(record);
                                }}
                            />
                        </Access>
                    </>
                );
            },
        },
    ];
};

const CustomerTable = ({
    globalFilters,
    handleUpdateUser,
    handleViewUser,
    data,
    loading,
    fetchCustomer,
}) => {
    const navigate = useNavigate();
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);

    const [openModalImport, setOpenModalImport] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const handleResetPassword = () => {
        processWithModals({
            modalName: ProcessModalName.ConfirmCustomContent,
            title: "Xác nhận",
            content:
                "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?",
        });
    };

    const handleDeleteUser = async (id) => {
        try {
            const res = await apiClient.delete(endpoints.customers.delete(id));
            if (res && res.data) {
                message.success("Xóa khách hàng thành công");
                setOpenModalCreate(false);
                await fetchCustomer();
            } else {
                const errorMessage = getErrorMessage(
                    res,
                    "Lỗi xảy ra khi xóa khách hàng, vui lòng thử lại sau."
                );
                message.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(
                error,
                "Lỗi xảy ra khi xóa khách hàng, vui lòng thử lại sau."
            );
            message.error(errorMessage);
        }
    };
    const handleAddressUser = (item) => {
        navigate(`/users/${item}/address`, { replace: true });
    };

    const hanleActivateUser = () => {
        processWithModals({
            modalName: ProcessModalName.ConfirmCustomContent,
            title: "Xác nhận",
            content: "Bạn chắc chắn muốn active lại người dùng này ?",
        });
    };

    return (
        <>
            <TableComponent
                loading={loading}
                filtersInput="filters"
                getColumnsConfig={getColumnsConfig}
                filterValue={globalFilters}
                loadData={() => {}}
                data={data}
                observableName={UserStaffObservable.name}
                handleResetPassword={handleResetPassword}
                handleDeleteUser={handleDeleteUser}
                handleUpdateUser={handleUpdateUser}
                handleViewUser={handleViewUser}
                hanleActivateUser={hanleActivateUser}
                handleAddressUser={handleAddressUser}
                setOpenModalUpdate={setOpenModalUpdate}
                setDataUpdate={setDataUpdate}
                scroll={{ y: "200px" }}
            />
        </>
    );
};

export default CustomerTable;
