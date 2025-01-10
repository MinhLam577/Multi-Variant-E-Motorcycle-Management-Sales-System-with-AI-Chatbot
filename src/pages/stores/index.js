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
    globalDispatch({
      type: "breadcrum",
      data: storesData.storesName,
    });
    navigate(`/stores/${storesData.storeId}`, { replace: true });
  };

  return (
    <>
      <div className="w-full">
        <StoresSearch setFilters={setGlobalFilters} />
      </div>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddStores}
        >
          Tạo mới
        </Button>
      </div>

      <StoresTable
        data={[]}
        globalFilters={globalFilters}
        handleUpdateStores={handleEditStores}
        handleViewStores={handleViewStores}
      />
    </>
  );
};

export default Stores;
