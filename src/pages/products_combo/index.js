import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import ProductsComboSearch from "../../businessComponents/products_combo/ProductsComboSearch";
import ProductsComboTable from "../../businessComponents/products_combo/ProductsComboTable";

const ProductsCombo = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddProducts = () => {
    navigate('/combo_product/add', { replace: true });
  };

  const handleEditProducts = (productsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: productsData.name
    });
    navigate(`/combo_product/${productsData.productComboId}/edit`, { replace: true });
  };

  const handleViewProducts = (productsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: productsData.name
    });
    navigate(`/combo_product/${productsData.productComboId}`, { replace: true });
  };

  return (
    <>
      <div className="w-full">
        <ProductsComboSearch setFilters={setFilterValue}/>
      </div>
      <div className="flex justify-end mb-2">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProducts}>Tạo mới</Button>
      </div>
      <ProductsComboTable
        filterValue={filterValue}
        handleEditProducts={handleEditProducts}
        handleViewProducts={handleViewProducts}
      />
    </>
  );
};

export default ProductsCombo;