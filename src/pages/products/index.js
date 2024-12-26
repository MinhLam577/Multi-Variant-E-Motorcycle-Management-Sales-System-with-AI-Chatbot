import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import ProductsTable from "../../businessComponents/products/ProductsTable";
import ProductsSearch from "../../businessComponents/products/ProductsSearch";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { deleteProduct, getCars } from "../../api/cars";

const Products = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await getCars({ page: 1, size: 5 });
      setData(data);
    };
    fetchCars();
  }, []);


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

  const handleDeleteProducts=(id)=>{

        processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa sản phẩm này?"
    )(() => {
      console.log("remote id",id)
      deleteProduct(id).then((res)=>{
        console.log("remote id",res)

      })
      
    });

    
  }
  return (
    <>
      <div className="w-full">
        <ProductsSearch setFilters={setFilterValue}/>
      </div>
      <div className="flex justify-end mb-2">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProducts}>Tạo mới</Button>
      </div>
      <ProductsTable
      data={data}
        filterValue={filterValue}
        handleEditProducts={handleEditProducts}
        handleViewProducts={handleViewProducts}
        handleDeleteProducts={handleDeleteProducts}
        
      />
    </>
  );
};

export default Products;