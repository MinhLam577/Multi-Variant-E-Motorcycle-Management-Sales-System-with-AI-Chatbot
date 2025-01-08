import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import StoresSearch from "../../businessComponents/stores/StoresSearch";
import StoresTable from "../../businessComponents/stores/StoresTable";

const Stores = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddStores = () => {
    navigate("/stores/add", { replace: true });
  };

  const handleEditStores = (storesData) => {
    globalDispatch({
      type: "breadcrum",
      data: storesData.storesName,
    });
    navigate(`/stores/${storesData.storeId}/edit`, { replace: true });
  };

  const handleViewStores = (storesData) => {
    console.log(storesData);
    globalDispatch({
      type: "breadcrum",
      data: storesData.storesName,
    });
    navigate(`/stores/${storesData.storeId}`, { replace: true });
  };

  return (
    <>
      <StoresSearch setFilters={setGlobalFilters} />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStores}>
        Tạo mới
      </Button>
      <StoresTable
        globalFilters={globalFilters}
        handleUpdateStores={handleEditStores}
        handleViewStores={handleViewStores}
      />
    </>
  );
};

export default Stores;
