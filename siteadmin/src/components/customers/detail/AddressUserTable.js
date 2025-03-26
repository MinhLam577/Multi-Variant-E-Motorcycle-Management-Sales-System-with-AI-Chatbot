import { Table, message } from "antd";
import { AntdTableLocale } from "../../../constants";
import { useEffect, useState } from "react";
import {
  ProcessModalName,
  processWithModals,
} from "../../../containers/processWithModals";
import { GET_ADDRESS_USER, REMOVE_ADDRESS } from "../../../graphql/users";
import { useNavigate, useParams } from "react-router";
import GroupActionButton from "../../GroupActionButton";
import apiClient from "../../../api/apiClient";
import endpoints from "../../../api/endpoints";

const getColumnsConfig = ({ handleDeleteAddress, handleEditAddress }) => {
  console.log(handleEditAddress);
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
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return (
          <GroupActionButton
            hanleDelete={handleDeleteAddress}
            handleUpdate={handleEditAddress}
            item={item}
          />
        );
      },
      width: 140,
    },
  ];
};

const AddressUserTable = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  const handleDeleteAddress = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa địa chỉ này?"
    )(async () => {
      // Thêm `async` ở đây
      try {
        await apiClient.delete(endpoints.receive_address.delete(id)); // Đảm bảo truyền `id`
        message.success("Xóa địa chỉ thành công!");
        // Gọi API cập nhật danh sách nếu cần
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        message.error("Xóa địa chỉ thất bại. Vui lòng thử lại!");
      }
    });
  };

  const handleEditAddress = (id) => {
    if (!id) {
      console.error("ID không hợp lệ:", id);
      return;
    }
    navigate(`/customer/receive_address/${id}/edit`);
  };

  return (
    <>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        className="table-fixed"
        columns={getColumnsConfig({
          handleEditAddress,
          handleDeleteAddress,
        })}
        handleEditAddress={handleEditAddress}
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
