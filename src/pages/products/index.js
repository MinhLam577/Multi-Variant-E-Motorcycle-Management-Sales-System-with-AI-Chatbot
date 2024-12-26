import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import ProductsTable from "../../businessComponents/products/ProductsTable";
import ProductsSearch from "../../businessComponents/products/ProductsSearch";

const Products = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddProducts = () => {
    navigate('/products/add', { replace: true });
  };

  const handleEditProducts = (productsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: productsData.productName
    });
    navigate(`/products/${productsData.productId}/edit`, { replace: true });
  };

  const handleViewProducts = (productsData) => {
    console.log(productsData)
    globalDispatch({
      type: 'breadcrum',
      data: productsData.productName
    });
    navigate(`/products/${productsData.productId}`, { replace: true });
  };

  return (
    <>
      <div className="w-full">
        <ProductsSearch setFilters={setFilterValue}/>
      </div>
      <div className="flex justify-end mb-2">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProducts}>Tạo mới</Button>
      </div>
      <ProductsTable
        filterValue={filterValue}
        handleEditProducts={handleEditProducts}
        handleViewProducts={handleViewProducts}
      />
    </>
  );
};

export default Products;