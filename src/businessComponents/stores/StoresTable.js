import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Tag, message } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import { DateTimeFormat } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { GET_STORES_LIST, REMOVE_STORE } from "../../graphql/stores";

const getColumnsConfig = ({
  handleUpdateStores,
  handleViewStores,
  hanleDeleteStore,
}) => {
  return [
    {
      title: "Tên cửa hàng",
      dataIndex: "storeName",
      key: "storeName",
      render: (value, item) => {
        return (
          <Button
            type="link"
            className="custom-antd-btn-ellipsis-content !p-0"
            onClick={() => handleViewStores(item)}
          >
            {value}
          </Button>
        );
      },
      sorter: true,
      ellipsis: true,
      width: "140px",
    },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: "200px",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className="uppercase"
          color={
            status === "active"
              ? "#87d068"
              : status === "inactive"
              ? "#ff4d4f"
              : "#108ee9"
          }
        >
          {status}
        </Tag>
      ),
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      ellipsis: true,
      width: "140px",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return (
          <>
            <EditOutlined
              className="ml-1"
              title="Chỉnh sửa"
              onClick={() => handleUpdateStores(item)}
            />
            <DeleteOutlined
              className="ml-1"
              title="Xóa"
              onClick={() => hanleDeleteStore(item.storeId)}
            />
          </>
        );
      },
      width: 100,
    },
  ];
};

const StoresTable = ({
  globalFilters,
  handleUpdateStores,
  handleViewStores,
}) => {
  const loading = false;
  const [removeStore] = useMutation(REMOVE_STORE, {
    // onCompleted: (res) => {
    //   if (res?.removeStore?.status) {
    //     message.success("Xóa cửa hàng thành công!");
    //   }
    // },
  });

  const hanleDeleteStore = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa cửa hàng này?"
    )(() => removeStore({ variables: { id } }));
  };

  return (
    <>
      <TableComponent
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={() => {}}
        data={[
          {
            storeName: "Store 1",
            address: "123 Main St",
            phone: "123-456-7890",
            status: "Active",
          },
          {
            storeName: "Store 2",
            address: "456 Elm St",
            phone: "987-654-3210",
            status: "Inactive",
          },
          {
            storeName: "Store 3",
            address: "789 Oak St",
            phone: "555-123-4567",
            status: "Active",
          },
        ]}
        handleUpdateStores={handleUpdateStores}
        handleViewStores={handleViewStores}
        hanleDeleteStore={hanleDeleteStore}
      />
    </>
  );
};

StoresTable.propTypes = {
  globalFilters: PropTypes.object,
  handleUpdateStores: PropTypes.func,
  handleViewStores: PropTypes.func,
};

export default StoresTable;
