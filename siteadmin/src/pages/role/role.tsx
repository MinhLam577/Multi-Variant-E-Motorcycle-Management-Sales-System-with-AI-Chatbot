import DataTable from "src/components/data-table";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IRole } from "src/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
// import { callDeleteRole } from "@/config/api";
import queryString from "query-string";
// import { fetchRole, fetchRoleById } from "@/redux/slice/roleSlide";
import ModalRole from "src/components/setting/role/modal.role";
import { useStore } from "src/stores";

import { observer } from "mobx-react-lite";
// import { ALL_PERMISSIONS } from "@/config/permissions";
// import Access from "@/components/share/access";

const RolePage = observer(() => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const tableRef = useRef<ActionType | null>(null);

  //   const isFetching = useAppSelector((state) => state.role.isFetching);
  //   const meta = useAppSelector((state) => state.role.meta);
  //   const roles = useAppSelector((state) => state.role.result);
  //   const dispatch = useAppDispatch();

  const Store = useStore();
  const roleStore = Store.settingObservable;
  const meta = roleStore.meta ;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    roleStore.getListRole();
  };
  const handleDeleteRole = async (_id: string | undefined) => {
    console.log(_id);
    if (_id) {
      await roleStore.deleteRoleByID(_id); // ✅ await là bắt buộc
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
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
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
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt+
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <div>
      <DataTable<IRole>
        actionRef={tableRef}
        headerTitle="Danh sách Roles (Vai Trò)"
        rowKey="_id"
        loading={roleStore.loading}
        columns={columns}
        dataSource={roleStore.dataRole}
        request={async (params, sort, filter): Promise<any> => {
          const query = buildQuery(params, sort, filter);
          //  dispatch(fetchRole({ query }));
        }}
        // pagination={{
        //   current: 1,
        //   pageSize: 2,
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
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        scroll={{ x: true }}
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
      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
      />
    </div>
  );
});

export default RolePage;
