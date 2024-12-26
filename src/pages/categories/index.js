import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/global";
import CategoriesTable from "../../businessComponents/categories/CategoriesTable";

const Categories = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddCategories = () => {
    navigate('/categories/add', { replace: true });
  };

  const handleEditCategories = (categoriesData) => {
    globalDispatch({
      type: 'breadcrum',
      data: categoriesData.categoryName
    });
    navigate(`/categories/${categoriesData.categoryId}/edit`, { replace: true });
  };

  const handleViewCategories = (categoriesData) => {
    globalDispatch({
      type: 'breadcrum',
      data: categoriesData.categoryName
    });
    navigate(`/categories/${categoriesData.categoryId}`, { replace: true });
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <Space className="my-4 flex flex-row justify-end">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategories}>Tạo mới</Button>
        </Space>
      </div>
      <CategoriesTable
        handleEditCategories={handleEditCategories}
        handleViewCategories={handleViewCategories}
      />
    </>
  );
};

export default Categories;