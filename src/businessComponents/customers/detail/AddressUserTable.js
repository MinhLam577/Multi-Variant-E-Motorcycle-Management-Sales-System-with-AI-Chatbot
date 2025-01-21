import { Table, message } from "antd";
import { AntdTableLocale } from "../../../constants";
import { useEffect, useState } from "react";
import {
  ProcessModalName,
  processWithModals,
} from "../../../containers/processWithModals";
import { GET_ADDRESS_USER, REMOVE_ADDRESS } from "../../../graphql/users";
import { useParams } from "react-router";

const getColumnsConfig = () => {
  return [
    {
      title: "No",
      key: "index",
      render: (_value, _item, index) => index + 1,
      width: 80,
    },
    {
      title: "Số nhà",
      dataIndex: "street",
      key: "street",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Phường/xã",
      dataIndex: "ward",
      key: "ward",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Quận/huyện",
      dataIndex: "district",
      key: "district",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Tỉnh/TP",
      dataIndex: "province",
      key: "province",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Người nhận",
      dataIndex: "receiverName",
      key: "receiverName",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Số ĐT người nhận",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
      ellipsis: true,
      width: 140,
    },
  ];
};

const AddressUserTable = () => {
  const { id } = useParams();
  const [loading] = useState(false);
  const hanleDeleteAddress = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa địa chỉ này?"
    )(() => {});
  };

  return (
    <>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        className="table-fixed"
        columns={getColumnsConfig({
          hanleDeleteAddress,
        })}
        loading={loading}
        key={0}
        dataSource={[]}
        rowKey={"categoryId"}
        scroll={{ x: 400 }}
      />
    </>
  );
};

export default AddressUserTable;
