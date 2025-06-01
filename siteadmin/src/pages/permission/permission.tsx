// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { IPermission } from "@/types/backend";
// import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { IPermission } from "src/types/backend";
import { colorMethod } from "src/constants/until";

// import { callDeletePermission } from "@/config/api";
import queryString from "query-string";
import DataTable from "src/components/data-table";
import apiClient from "src/api/apiClient";
import endpoints from "src/api/endpoints";
import ModalPermission from "src/components/setting/permission/modal.permission";
import ViewDetailPermission from "src/components/setting/permission/view.permission";
import { set } from "mobx";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import Access from "src/access/access";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
// import { fetchPermission } from "@/redux/slice/permissionSlide";
// import ViewDetailPermission from "@/components/admin/permission/view.permission";
// import ModalPermission from "@/components/admin/permission/modal.permission";
// import { colorMethod } from "@/config/utils";
// import Access from "@/components/share/access";
// import { ALL_PERMISSIONS } from "@/config/permissions";

const PermissionPage = observer(() => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const tableRef = useRef<ActionType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [permissions, setPermission] = useState([]);
    const handleDeletePermission = async (_id: string | undefined) => {
        if (_id) {
            const res = await apiClient.delete(
                endpoints.permission.delete(_id)
            );
            //  const res = await callDeletePermission(_id);
            if (res && res.data) {
                message.success("Xóa Permission thành công");
                // reloadTable();
                fetchPermissions();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    // description: res.message,
                });
            }
        }
    };
    const Store = useStore();
    const roleStore = Store.settingObservable;
    const meta = roleStore.meta;
    useEffect(() => {
        fetchPermissions();
    }, []);
    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get(
                endpoints.permission.list("", "")
            );
            setLoading(false);
            if (data) {
                setPermission(data);
            } else {
                message.error("Lỗi khi không lấy dữ liệu permission được");
            }
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu permission");
        }
    };
    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const columns: ProColumns<IPermission>[] = [
        {
            title: "Id",
            dataIndex: "id",
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}
                    >
                        {record.id}
                    </a>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "API",
            dataIndex: "path",
            sorter: true,
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
                        onConfirm={() => handleDeletePermission(entity.id)}
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
        console.log(params);
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
                    <div className="test">
                        <DataTable<IPermission>
                            actionRef={tableRef}
                            headerTitle="Danh sách Permissions (Quyền Hạn)"
                            rowKey="_id"
                            loading={loading}
                            columns={columns}
                            dataSource={permissions}
                            scroll={{ x: true, y: 300 }}
                            rowSelection={false}
                            search={false}
                            // goi api
                            // request={async (params, sort, filter): Promise<any> => {
                            //   const query = buildQuery(params, sort, filter);
                            //   console.log(params);
                            //   console.log(params.current, params.pageSize);
                            //   roleStore.setMeta(params.current, params.pageSize);
                            //   console.log(query);
                            // }}
                            pagination={{
                                current: meta.current,
                                pageSize: meta.pageSize,
                                showSizeChanger: true,
                                total: meta.total,
                                onChange: (page, pageSize) => {
                                    roleStore.setMeta(page, pageSize); // cập nhật MobX store
                                },
                                showTotal: (total, range) => {
                                    return (
                                        <div>
                                            {" "}
                                            {range[0]}-{range[1]} trên {total}{" "}
                                            rows
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
// lấy data sau khi gọi api
// pagination={{
//   current: 1,
//   pageSize: 10,
//   showSizeChanger: true,
//   total: 10,
//   showTotal: (total, range) => {
//     return (
//       <div>
//         {" "}
//         {range[0]}-{range[1]} trên {total} rows
//       </div>
//     );
//   },
// }}
