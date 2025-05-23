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
import { formatVNDMoney } from "../../utils";
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
            width: "200px",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "140px",
            ellipsis: true,
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
        },
        {
            title: "SL Đơn hàng",
            dataIndex: "total_order",
            key: "total_order",
            ellipsis: true,
        },
        {
            title: "Tổng chi tiêu",
            dataIndex: "total_spending",
            key: "total_spending",
            ellipsis: true,
            render: (totalSpending) => {
                return <span>{formatVNDMoney(totalSpending)}</span>;
            },
        },
        {
            title: "Action",
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
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
                                    <DeleteTwoTone twoToneColor="#ff4d4f" />
                                </span>
                            </Access>
                        </Popconfirm>
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

    const handleResetPassword = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?"
        )(() => {});
    };

    const handleDeleteUser = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn có chắc chắn ngưng hoạt động của người dùng này?"
        )(async () => {
            const res = await apiClient.delete(endpoints.customers.delete(id));
            if (res && res.data) {
                message.success(res.message);
                setOpenModalCreate(false);
                await fetchCustomer();
            } else {
                notification.error({
                    message: "You can only have max 3 receive address",
                    description: res.message,
                });
            }
        });
    };
    const hanleAddressUser = (item) => {
        navigate(`/users/${item}/address`, { replace: true });
    };

    const hanleActivateUser = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn active lại người dùng này ?"
        )(() => {});
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
                hanleAddressUser={hanleAddressUser}
                setOpenModalUpdate={setOpenModalUpdate}
                setDataUpdate={setDataUpdate}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
CustomerTable.propTypes = {
    globalFilters: PropTypes.object,
    handleUpdateUser: PropTypes.func,
    handleViewUser: PropTypes.func,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    fetchCustomer: PropTypes.func,
};
export default CustomerTable;
