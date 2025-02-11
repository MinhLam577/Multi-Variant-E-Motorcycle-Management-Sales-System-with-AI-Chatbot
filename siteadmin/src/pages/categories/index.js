import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Space } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import CategoriesTable from "../../components/categories/CategoriesTable";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { GlobalContext } from "../../contexts/global";

const Categories = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);

  const handleAddCategories = () => {
    navigate("/categories/add", { replace: true });
  };

  const handleEditCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.categoryName,
    });
    navigate(`/categories/${categoriesData.categoryId}/edit`, {
      replace: true,
    });
  };

  const handleViewCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.categoryName,
    });
    navigate(`/categories/${categoriesData.categoryId}`, { replace: true });
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
        <Space className="mb-4 flex flex-row justify-end">
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

export default Categories;
