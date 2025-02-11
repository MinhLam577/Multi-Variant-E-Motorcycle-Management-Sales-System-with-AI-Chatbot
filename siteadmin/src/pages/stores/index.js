import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import StoresSearch from "../../components/stores/StoresSearch";
import StoresTable from "../../components/stores/StoresTable";
import { GlobalContext } from "../../contexts/global";

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
