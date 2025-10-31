import { Button, Popconfirm } from "antd";
import { useNavigate } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { RoleType, UserStaffResponseType } from "src/types/user-staff.type";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import { RoleEnumValue } from "src/constants";
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

interface IColumnsConfig {
    handleViewUser: (user: UserStaffResponseType) => void;
    handleDeleteUser?: (id: string) => void;
    handleUpdateUser?: (user: UserStaffResponseType) => void;
}

const getColumnsConfig = ({
    handleViewUser,
    handleDeleteUser,
    handleUpdateUser,
}: IColumnsConfig) => {
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
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            responsive: ["lg"],
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            ellipsis: true,
            responsive: ["lg"],
        },

        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
            ellipsis: true,
            render: (value) => {
                return value
                    ? new Date(value).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                      })
                    : "Chưa có ngày sinh";
            },
            responsive: ["xl"],
        },

        {
            title: "Vai trò",
            dataIndex: "roles",
            key: "roles",
            ellipsis: true,
            render: (Roles: RoleType[]) => {
                if (!Roles || Roles.length === 0) return "Chưa có vai trò";
                const roleName = Roles.map(
                    (role) => role?.name
                )[0]?.toUpperCase();
                return roleName ? RoleEnumValue[roleName] : "Chưa có vai trò";
            },
            responsive: ["sm"],
        },

        {
            title: "Action",
            render: (text, record, index) => {
                return (
                    <>
                        <Access
                            permission={ALL_PERMISSIONS.USER.DELETE}
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
                                            content: `Bạn có chắc chắn muốn xóa user #${record.id} không?`,
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
                            permission={ALL_PERMISSIONS.USER.UPDATE}
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

interface IUserTableProps {
    data: UserStaffResponseType[];
    handleDeleteUser: (id: string) => Promise<void>;
    handleUpdateUser: (user: UserStaffResponseType) => void;
    handleViewUser: (user: UserStaffResponseType) => void;
}

const UserTable: React.FC<IUserTableProps> = ({
    data,
    handleUpdateUser,
    handleViewUser,
    handleDeleteUser,
}) => {
    const navigate = useNavigate();
    const store = useStore();
    const userStore = store.userStaffObservable;
    const handleResetPassword = (id: string) => {
        processWithModals({
            modalName: ProcessModalName.ConfirmCustomContent,
            title: "Xác nhận",
            content:
                "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?",
        });
    };

    const hanleAddressUser = (item) => {
        navigate(`/users/${item}/address`, { replace: true });
    };

    const hanleActivateUser = (id) => {
        processWithModals({
            modalName: ProcessModalName.ConfirmCustomContent,
            title: "Xác nhận",
            content: "Bạn chắc chắn muốn active lại người dùng này ?",
        });
    };

    return (
        <>
            <TableComponent
                loading={userStore.loading}
                filtersInput="filters"
                getColumnsConfig={getColumnsConfig}
                loadData={() => {}}
                data={data}
                handleResetPassword={handleResetPassword}
                handleDeleteUser={handleDeleteUser}
                handleUpdateUser={handleUpdateUser}
                handleViewUser={handleViewUser}
                hanleActivateUser={hanleActivateUser}
                hanleAddressUser={hanleAddressUser}
                scroll={{ y: "200px" }}
                observableName={userStore.constructor.name}
            />
        </>
    );
};
export default observer(UserTable);
