import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
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
import GroupActionButton from "../../components/GroupActionButton";

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
        return <GroupActionButton item={item} />;
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
  const [removeStore] = useMutation(REMOVE_STORE, {});

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
            storeName: "Cửa hàng 1",
            address: "123 Phố Chính",
            phone: "123-456-7890",
            status: "Hoạt động",
          },
          {
            storeName: "Cửa hàng 2",
            address: "456 Phố Tùng",
            phone: "987-654-3210",
            status: "Không hoạt động",
          },
          {
            storeName: "Cửa hàng 3",
            address: "789 Phố Sồi",
            phone: "555-123-4567",
            status: "Hoạt động",
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
