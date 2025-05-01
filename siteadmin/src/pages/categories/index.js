import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CategoriesTable from "../../components/categories/CategoriesTable";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { GlobalContext } from "../../contexts/global";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

const Categories = () => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await apiClient.get(endpoints.category.list);
      setData(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []); // Thêm [] để chỉ gọi 1 lần khi component mount
  const handleAddCategories = () => {
    navigate("/categories/add", { replace: true });
  };

  const handleEditCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.categoryName,
    });
    navigate(`/categories/${categoriesData.id}/edit`, {
      replace: true,
    });
  };

  const handleViewCategories = (categoriesData) => {
    globalDispatch({
      type: "breadcrum",
      data: categoriesData.name,
    });
    navigate(`/categories/${categoriesData.id}`, { replace: true });
  };

  const handleDeleteCategories = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa danh mục này?"
    )(() => removeCategory(id));
  };

  const removeCategory = async (id) => {
    try {
      console.log("Xóa danh mục với ID:", id);

      const response = await apiClient.delete(endpoints.category.delete(id));

      message.success(response.data.message || "Xóa danh mục thành công!");

      fetchCategories(); // Cập nhật lại danh sách danh mục sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      message.error("Không thể xóa danh mục. Vui lòng thử lại!");
    }
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
