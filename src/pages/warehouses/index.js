import { Button, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/global";
import CategoriesTable from "../../businessComponents/categories/CategoriesTable";
import { fetchCategories } from "../../api/cars";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";

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
      <CategoriesTable
        handleEditCategories={handleEditCategories}
        handleViewCategories={handleViewCategories}
        handleDeleteCategories={handleDeleteCategories}
        data={data}
      />
    </>
  );
};

export default WareHouses;
