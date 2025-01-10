import {
  DeleteOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Button, message, Space, Tag, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/cars";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { GlobalContext } from "../../contexts/global";

const WareHouses = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setData(data);
    };
    getCategories();
  }, []);

  const handleAddCategories = () => {
    navigate("/warehouse/add", { replace: true });
  };

  const handleEditCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.categoryName,
    });
    navigate(`/warehouse/${categoriesData.categoryId}/edit`, {
      replace: true,
    });
  };

  const handleViewCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.categoryName,
    });
    navigate(`/warehouse/${categoriesData.categoryId}`, { replace: true });
  };

  const handleDeleteCategories = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa danh mục này?"
    )(() => removeCategory(id));
  };

  const removeCategory = (id) => {
    message.success("Xóa danh mục thành công!", id);
  };

  const getColumnsConfig = ({
    handleEditProducts,
    handleViewProducts,
    handleStatusProducts,
    handleDeleteProducts,
  }) => {
    return [
      {
        title: "Địa điểm",
        dataIndex: "location",
        key: "location",
        render: (value, item) => {
          return (
            <div className="flex items-center gap-4">
              <span>
                <Button
                  type="link"
                  className="items-center justify-start p-0"
                  onClick={() => handleViewProducts(item)}
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
        title: "Tỉnh/ Thành Phố",
        dataIndex: "province",
        key: "province",
        render: (value) => {
          return <div className="break-words">{value}</div>;
        },
        ellipsis: false,
        width: "120px",
      },
      {
        title: "Quận/ Huyện",
        dataIndex: "district",
        key: "district",
        render: (value) => {
          if (!value) return "-";
          return <div className="break-words">{value}</div>;
        },
        ellipsis: false,
        width: "100px",
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
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={null}
        loadData={() => {}}
        data={[
          {
            location: "Kho 1",
            address: "123 ABC Street",
            province: "Hanoi",
            district: "Hoan Kiem",
            isDefault: true,
          },
          {
            location: "Kho 2",
            address: "456 DEF Avenue",
            province: "Ho Chi Minh",
            district: "District 1",
          },
          {
            location: "Kho 3",
            address: "789 GHI Boulevard",
            province: "Da Nang",
            district: "Hai Chau",
          },
        ]}
      />
    </>
  );
};

export default WareHouses;
