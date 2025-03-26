import {
  DeleteOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Button, message, Space, Tag, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { GlobalContext } from "../../contexts/global";
import { useStore } from "../../stores";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";

const WareHouses = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gọi API khi component mount
  useEffect(() => {
    console.log("useEffect running on mount");
    setLoading(true);
    const getWarehouse = async () => {
      const data = await apiClient.get(endpoints.warehouse.list());
      setLoading(false);
      setData(data.data); // Đồng bộ dữ liệu
    };
    getWarehouse();
  }, []);
  console.log(data);
  const handleAddCategories = () => {
    navigate("/warehouse/add", { replace: true });
  };

  const handleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa danh mục này?"
    )(() => removeCategory(id));
  };

  const removeCategory = async (id) => {
    const data = await apiClient.delete(endpoints.warehouse.delete(id));
    if (data) {
      console.log(data);
      message.success("Xóa kho thành công!");
      const data1 = await apiClient.get(endpoints.warehouse.list());
      setData(data1.data); // Đồng bộ dữ liệu
    }
  };

  const getColumnsConfig = ({ handleStatusProducts }) => {
    const handleViewWareHouse = (item) => {
      globalDispatch({
        type: "breadcrum",
        data: item.name,
      });
      if (item?.id) {
        navigate(`/warehouse/${item.id}`); // Điều hướng đến trang chi tiết
      } else {
        console.error("Item không có id:", item);
      }
    };

    const handleEditWarehouse = (categoriesData) => {
      globalDispatch({
        type: "breadcrum",
        data: categoriesData.name,
      });
      navigate(`/warehouse/${categoriesData.id}/edit`, {
        replace: true,
      });
    };

    return [
      {
        title: "Tên kho",
        dataIndex: "name",
        key: "name",

        render: (value, item) => {
          return (
            <div className="flex items-center gap-4">
              <span>
                <Button
                  type="link"
                  className="items-center justify-start p-0"
                  onClick={() => handleViewWareHouse(item)}
                >
                  {value}
                </Button>
              </span>
              {item?.isDefault && (
                <span>
                  <Tag color="blue">Địa chỉ mặc định</Tag>
                </span>
              )}
            </div>
          );
        },
        ellipsis: false,
        width: "30%",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (value) => {
          return <span>{value}</span>;
        },
        ellipsis: false,
        width: "120px",
      },

      {
        title: "Ngày Tạo",
        dataIndex: "created_at",
        key: "created_at",
        render: (value) => {
          return <div className="break-words">{value}</div>;
        },
        ellipsis: false,
        width: "120px",
      },

      // Action
      {
        title: "Thao tác",
        dataIndex: "action",
        key: "action",
        render: (_value, item) => {
          return (
            <div className="flex gap-x-4 ">
              <Tooltip title="Đặt làm mặc định">
                <Button
                  icon={<PushpinOutlined />}
                  onClick={() => handleStatusProducts(item, !item.status)}
                />
              </Tooltip>
              <Tooltip title="Xoá địa chỉ">
                <Button
                  variant="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteProducts(item.id)}
                />
              </Tooltip>
            </div>
          );
        },
        width: 60,
      },
    ];
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <Space className="my-4 flex flex-row justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCategories}
          >
            Tạo mới
          </Button>
        </Space>
      </div>
      <TableComponent
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={null}
        loadData={() => {}}
        data={data}
      />
    </>
  );
};

export default WareHouses;
