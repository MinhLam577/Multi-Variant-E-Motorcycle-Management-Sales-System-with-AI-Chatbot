import { Row } from "antd";
import PropTypes from "prop-types";
import CardItem from "./CardItem";
import { formatVNDMoney } from "../../utils";
import { CarryOutFilled, DollarCircleFilled, UserOutlined } from "@ant-design/icons";

function StatisticCard({ data }) {
  return (
    <Row gutter={[16,16]}>
      <CardItem
        title="Tổng khách hàng"
        value={data?.totalCustomers || 0}
        color="#b7eb8f"
        prefix={
          <div className="p-1.5 flex rounded bg-[#b7eb8f50]">
            <UserOutlined className="w-5 h-5 text-[#07bc0c]" />
          </div>
        }
      />
      <CardItem
        title="Tổng người dùng đạt chuẩn"
        value={data?.totalCustomer100KAnd7d || 0}
        color="#ffccc7"
        prefix={
          <div className="p-1.5 flex rounded bg-[#ffccc750]">
            <CarryOutFilled className="w-5 h-5 text-[#e74c3c]" />
          </div>
        }
      />
      <CardItem
        title="Tổng đơn"
        value={data?.totalOrders || 0}
        color="#ffe58f"
        prefix={
          <div className="p-1.5 flex rounded bg-[#ffe58f50]">
            <CarryOutFilled className="w-5 h-5 text-[#f1c40f]" />
          </div>
        }
      />
      <CardItem
        title="Tổng tiền"
        value={formatVNDMoney(data?.totalPrice) || 0}
        color="#91caff"
        prefix={
          <div className="p-1.5 flex rounded bg-[#91caff50]">
            <DollarCircleFilled className="w-5 h-5 text-[#3498db]" />
          </div>
        }
      />
    </Row>
  );
}

StatisticCard.propTypes = {
  data: PropTypes.object,
};

export default StatisticCard;
