import { Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AntdTableLocale } from "../../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../../containers/processWithModals";
import apiClient from "../../../api/apiClient";
import endpoints from "../../../api/endpoints";
import GroupActionButton from "../../GroupActionButton";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import UserModalUpdate from "../UserModalUpdate";

const getColumnsConfig = ({
  hanleDeleteAddress,

  setOpenModalUpdate,
  setDataUpdate,
}) => {
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
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={() => hanleDeleteAddress(record._id)}
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
                setOpenModalUpdate(true);
                setDataUpdate(record);
              }}
            />
          </>
        );
      },
      width: 140,
    },
  ];
};

const AddressUserTable = () => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);
  const fetchUser = async () => {
    try {
      const data = await apiClient.get(endpoints.customers.details(id));
      console.log(data.data);
      setUserInfo(data.data.receive_address);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    }
  };
  const [loading] = useState(false);
  const hanleDeleteAddress = async (id) => {
    console.log("Xóa thành công ");
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
          setOpenModalUpdate,
          setDataUpdate,
        })}
        loading={loading}
        key={0}
        dataSource={userInfo}
        rowKey={"categoryId"}
        scroll={{ x: 400 }}
      />
      <UserModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default AddressUserTable;
