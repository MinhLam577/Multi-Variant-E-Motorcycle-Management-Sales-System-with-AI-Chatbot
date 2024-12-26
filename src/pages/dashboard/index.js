import InventoryInfo from "../../businessComponents/dashboard/InventoryInfo";
import SalesChart from "../../businessComponents/dashboard/SalesChart";
import TopSellingCars from "../../businessComponents/dashboard/TopSellingCars";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-row">
            <div className="bg-white shadow rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold">Tổng quan</h3>
              <div className="flex flex-row">
                <div className="mb-4 flex-1">
                  <h4 className="text-md font-semibold">
                    Doanh thu hôm nay/tháng/năm:
                  </h4>
                </div>
                <div className="mb-4 flex-1">
                  <h4 className="text-md font-semibold">Số lượng xe bán ra:</h4>
                  <p>Hiển thị số xe đã bán (hôm nay/tháng/năm).</p>
                </div>
                <div className="mb-4 flex-1">
                  <h4 className="text-md font-semibold">
                    Top dòng xe bán chạy nhất:
                  </h4>
                  <TopSellingCars />
                </div>
              </div>
            </div>
          </div>

          <div className="grid flex-row grid-cols-2 gap-3">
            <div className="grid-cols-1">
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-semibold">Doanh số</h3>
                <p>Biểu đồ doanh số của salon ô tô.</p>
                <div className="flex">
                  <SalesChart />
                </div>
              </div>
            </div>
            <div className="grid-cols-1">
              <div className="bg-white shadow rounded-lg p-4 flex flex-col">
                <h3 className="text-lg font-semibold">Tồn Kho</h3>
                <div className="flex">
                  <InventoryInfo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
