import { Button, Popconfirm, Table, message } from "antd";
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
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

const getColumnsConfig = ({ handleDeleteAddress, handleEditAddress }) => {
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
        console.log(item);
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={() => handleDeleteAddress(item._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>

            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // setOpenModalUpdate(true);
                // setDataUpdate(record);
                handleEditAddress(item);
              }}
            />
          </>
        );
      },
    },
  ];
};

const AddressCustomerTable = () => {
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
      <div>
        <Button>Tạo mới</Button>
      </div>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        className="table-fixed"
        columns={getColumnsConfig}
        handleEditAddress={handleEditAddress}
        handleDeleteAddress={handleDeleteAddress}
        loading={loading}
        key={0}
        dataSource={[]}
        rowKey={"categoryId"}
        scroll={{ x: 400 }}
      />
    </>
  );
};

export default AddressCustomerTable;
