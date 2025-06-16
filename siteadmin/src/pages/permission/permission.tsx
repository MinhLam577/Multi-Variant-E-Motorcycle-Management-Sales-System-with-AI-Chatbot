import { ActionType, ProColumns } from "@ant-design/pro-components";
import {
    Button,
    Popconfirm,
    Space,
    message,
    notification,
    ConfigProvider,
} from "antd";
import viVN from "antd/lib/locale/vi_VN";
import { useState, useRef, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { colorMethod } from "src/constants/until";
import queryString from "query-string";
import DataTable from "src/components/data-table";
import apiClient from "src/api/apiClient";
import endpoints from "src/api/endpoints";
import ModalPermission from "src/components/setting/permission/modal.permission";
import ViewDetailPermission from "src/components/setting/permission/view.permission";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import Access from "src/access/access";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import { toJS } from "mobx";
import { PermissionResponseType } from "src/stores/permission.store";

const PermissionPage = observer(() => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<PermissionResponseType | null>(
        null
    );
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const tableRef = useRef<ActionType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // const [permissions, setPermission] = useState([]);
    const handleDeletePermission = async (_id: string | undefined) => {
        if (_id) {
            const res = await apiClient.delete(
                endpoints.permission.delete(_id)
            );
            if (res && res.data) {
                message.success("Xóa Permission thành công");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                });
            }
        }
    };
    const Store = useStore();
    const roleStore = Store.settingObservable;
    const permissionStore = Store.permissionObservable;
    const meta = roleStore.meta;
    useEffect(() => {
        fetchPermissions({
            ...permissionStore.pagination,
        });
    }, []);
    const fetchPermissions = async (query: object) => {
        try {
            setLoading(true);
            await permissionStore.getListPermission({
                ...permissionStore.pagination,
                ...query,
            });
            setLoading(false);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu permission");
        }
    };
    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const columns: ProColumns<PermissionResponseType>[] = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
            search: {
                transform: (value) => ({ search: value }),
            },
        },
        {
            title: "API",
            dataIndex: "path",
            sorter: true,

            search: {
                transform: (value) => ({ search: value }),
            },
        },
        {
            title: "Method",
            dataIndex: "method",
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <p
                        style={{
                            paddingLeft: 10,
                            fontWeight: "bold",
                            marginBottom: 0,
                            color: colorMethod(entity?.method as string),
                        }}
                    >
                        {entity?.method || ""}
                    </p>
                );
            },
        },
        {
            title: "Module",
            dataIndex: "module",
            sorter: true,
            search: true,
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
                            setOpenModal(true);
                            setDataInit(entity);
                        }}
                    />

                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa permission"}
                        description={
                            "Bạn có chắc chắn muốn xóa permission này ?"
                        }
                        onConfirm={() => {
                            handleDeletePermission(entity.id);
                            reloadTable();
                        }}
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
        if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
        if (clone.method) clone.method = `/${clone.method}/i`;
        if (clone.module) clone.module = `/${clone.module}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
        }
        if (sort && sort.path) {
            sortBy = sort.path === "ascend" ? "sort=path" : "sort=-path";
        }
        if (sort && sort.method) {
            sortBy = sort.method === "ascend" ? "sort=method" : "sort=-method";
        }
        if (sort && sort.module) {
            sortBy = sort.module === "ascend" ? "sort=module" : "sort=-module";
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

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    const fetchPermissionsQuery = async (params) => {
        const { current = 1, pageSize = 10, ...filters } = params;
        await fetchPermissions({
            current,
            pageSize,
            ...filters,
        });
        return {
            data: toJS(permissionStore.data),
            success: true,
            total: meta.total,
            current: meta.current,
            pageSize: meta.pageSize,
        };
    };

    return (
        <section className="w-full">
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách các permission"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
            </div>
            <div className="w-full animate-slideUp my-6">
                <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
                    <div className="PermissionTable">
                        <ConfigProvider locale={viVN}>
                            <DataTable<PermissionResponseType>
                                actionRef={tableRef}
                                headerTitle="Danh sách Permissions (Quyền Hạn)"
                                rowKey="id"
                                loading={loading}
                                columns={columns}
                                dataSource={permissionStore.data}
                                scroll={{ x: true, y: 300 }}
                                rowSelection={false}
                                request={fetchPermissionsQuery}
                                search={{
                                    labelWidth: "auto",
                                    span: 24,
                                    filterType: "light",
                                    defaultCollapsed: false,
                                }}
                                pagination={{
                                    current: meta.current,
                                    pageSize: meta.pageSize,
                                    showSizeChanger: true,
                                    total: meta.total,
                                    onChange: (page, pageSize) => {
                                        roleStore.setMeta(page, pageSize);
                                        permissionStore.setPagination({
                                            current: page,
                                            pageSize: pageSize,
                                        });
                                    },
                                    showTotal: (total, range) => {
                                        return (
                                            <div>
                                                {" "}
                                                {range[0]}-{range[1]} trên{" "}
                                                {total} rows
                                            </div>
                                        );
                                    },
                                }}
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
                        </ConfigProvider>
                    </div>
                </Access>
            </div>

            <ModalPermission
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
                fetchPermissions={fetchPermissions}
            />

            <ViewDetailPermission
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                fetchPermissions={fetchPermissions}
            />
        </section>
    );
});

export default PermissionPage;
