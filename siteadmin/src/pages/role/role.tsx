import DataTable from "src/components/data-table";
import { IRole } from "src/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import ModalRole from "src/components/setting/role/modal.role";
import { useStore } from "src/stores";

import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import UserSearch from "src/components/users/UserSearch";
import CustomizeTab from "src/components/common/CustomizeTab";

const RolePage = observer(() => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const tableRef = useRef<ActionType | null>(null);

    const Store = useStore();
    const roleStore = Store.settingObservable;
    const meta = roleStore.meta;
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        roleStore.getListRole();
    };
    const handleDeleteRole = async (_id: string | undefined) => {
        if (_id) {
            await roleStore.deleteRoleByID(_id);
            if (roleStore.status == 200) {
                message.success("Xóa Role thành công");
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: roleStore.errorMsg,
                });
            }
        }
    };

    const reloadTable = () => {
        fetchData();
        tableRef?.current?.reload();
    };

    const columns: ProColumns<IRole>[] = [
        {
            title: "Id",
            dataIndex: "id",
            width: 250,
            render: (text, record, index, action) => {
                return <span>{record.id}</span>;
            },
            hideInSearch: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <Tag color={entity.isActive ? "lime" : "red"}>
                            {entity.isActive ? "ACTIVE" : "INACTIVE"}
                        </Tag>
                    </>
                );
            },
            hideInSearch: true,
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Actions",
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: "#ffa500",
                        }}
                        type=""
                        onClick={() => {
                            roleStore.fetchRoleById(entity.id);
                            //   dispatch(fetchRoleById(entity._id as string));
                            setOpenModal(true);
                        }}
                    />

                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa role"}
                        description={"Bạn có chắc chắn muốn xóa role này ?"}
                        onConfirm={() => handleDeleteRole(entity.id)}
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
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
        }
        if (sort && sort.createdAt) {
            sortBy =
                sort.createdAt === "ascend"
                    ? "sort=createdAt"
                    : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy =
                sort.updatedAt === "ascend"
                    ? "sort=updatedAt"
                    : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt+
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    const handleSearchFormRender = (form: any) => {
        return (
            <div className="flex gap-4">
                <form.Item name="name" label="Tên vai trò">
                    <input
                        type="text"
                        placeholder="Nhập tên vai trò"
                        className="ant-input"
                    />
                </form.Item>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách các role"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
            </div>
            <div className="w-full my-6 animate-slideUp">
                <DataTable<IRole>
                    actionRef={tableRef}
                    headerTitle="Danh sách Roles (Vai Trò)"
                    rowKey="_id"
                    loading={roleStore.loading}
                    columns={columns}
                    dataSource={roleStore.dataRole}
                    search={false}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                    }}
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        onChange: (page, pageSize) => {
                            roleStore.setMeta(page, pageSize);
                        },
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    scroll={{ x: true, y: 300 }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </div>
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
            />
        </div>
    );
});

export default RolePage;
