import { ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import StoresSearch from "../../components/stores/StoresSearch";
import StoresTable from "../../components/stores/StoresTable";
import { GlobalContext } from "../../contexts/global";
import { getListBranch } from "../../api/branch";
import { CSVLink, CSVDownload } from "react-csv";
const Stores = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const [branchs, setBranchs] = useState([]); // Lưu danh sách người dùng
  const [filteredBranchs, setFilteredUsers] = useState([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleAddStores = () => {
    navigate("/stores/add", { replace: true });
  };

  const handleEditStores = (storesData) => {
    globalDispatch({
      type: "breadcrum",
      data: storesData.storesName,
    });
    navigate(`/stores/${storesData.id}/edit`, { replace: true });
  };

  const handleViewStores = (storesData) => {
    globalDispatch({
      type: "breadcrum",
      data: storesData.storesName,
    });
    navigate(`/stores/${storesData.id}`, { replace: true });
  };

  // Gọi API danh sách chi nhánh  khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getListBranch({ pageSize: 1, current: 2 });
        if (response.data) {
          console.log(response);
          setBranchs(response.data); // Cập nhật dữ liệu vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Lọc danh sách người dùng khi globalFilters thay đổi
  useEffect(() => {
    if (!globalFilters) return;

    setFilteredUsers(() => {
      let data = branchs;

      if (globalFilters.name) {
        const keyword = globalFilters.name.toLowerCase();
        data = data.filter((user) => user.name.toLowerCase().includes(keyword));
      }

      if (globalFilters.active !== null && globalFilters.active !== undefined) {
        // Kiểm tra cả `true` và `false`
        const status = globalFilters.active;
        console.log("Lọc theo trạng thái:", status);
        data = data.filter((user) => user.active === status);
      }

      return data;
    });
  }, [globalFilters, branchs]); // Chỉ chạy khi bộ lọc hoặc danh sách người dùng thay đổi
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];
  return (
    <>
      <div className="w-full">
        <StoresSearch setFilters={setGlobalFilters} />
      </div>
      <div className="flex justify-end mb-4">
        <CSVLink data={filteredBranchs} filename={"danh-sach.csv"}>
          <Button className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            <ExportOutlined />
            Export
          </Button>
        </CSVLink>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddStores}
        >
          Tạo mới 1
        </Button>
      </div>

      <StoresTable
        data={filteredBranchs}
        loading={loading}
        globalFilters={globalFilters}
        handleUpdateStores={handleEditStores}
        handleViewStores={handleViewStores}
        handleEditStores={handleEditStores}
      />
    </>
  );
};

export default Stores;
