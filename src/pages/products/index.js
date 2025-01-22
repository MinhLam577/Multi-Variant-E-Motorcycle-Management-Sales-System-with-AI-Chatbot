import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteProduct, getCars, updateCar } from "../../api/cars";
import ProductsSearch from "../../components/products/ProductsSearch";
import ProductsTable from "../../components/products/ProductsTable";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { GlobalContext } from "../../contexts/global";
import { update } from "lodash";

const Products = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const data = await getCars({ page: 1, size: 5 });
      setData(data);
    };
    fetchCars();
  }, []);

  const handleAddProducts = () => {
    navigate("/products/add", { replace: true });
  };

  const handleEditProducts = (productsData) => {
    // globalDispatch({
    //   type: "breadcrum",
    //   data: productsData.name,
    // });
    // navigate(`/products/${productsData.id}/edit`, { replace: true });
  };

  const handleViewProducts = (productsData) => {
    globalDispatch({
      type: "breadcrum",
      data: productsData.name,
    });
    navigate(`/products/${productsData.id}`, { replace: true });
  };

  const handleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa sản phẩm này?"
    )(() => {
      console.log("remote id", id);
      deleteProduct(id).then((res) => {
        console.log("remote id", res);
      });
    });
  };

  const handleStatusProducts = (item, statusProduct) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      statusProduct
        ? "Bạn chắc chắn muốn hiển thị sản phẩm này?"
        : "Bạn chắc chắn muốn ẩn sản phẩm này?"
    )(() => {
      updateCar({ id: item.id, status: statusProduct });
    });
  };
  return (
    <>
      <div className="w-full">
        <ProductsSearch setFilters={setFilterValue} />
      </div>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProducts}
        >
          Tạo mới
        </Button>
      </div>
      <ProductsTable
        data={data}
        filterValue={filterValue}
        handleEditProducts={handleEditProducts}
        handleViewProducts={handleViewProducts}
        handleDeleteProducts={handleDeleteProducts}
        handleStatusProducts={handleStatusProducts}
      />
    </>
  );
};

export default Products;
