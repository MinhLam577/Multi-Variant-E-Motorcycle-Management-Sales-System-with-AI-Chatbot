import { useState } from "react";
import StatisticCard from "../../components/statistic/StatisticCard";
import StatisticChart from "../../components/statistic/StatisticChart";
import StatisticSearch from "../../components/statistic/StatisticSearch";

function Statistic() {
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });

  return (
    <>
      <StatisticSearch setFilters={setGlobalFilters} />
      <StatisticCard data={[]} />
      <div className="font-bold mt-4 text-lg">Thống kê đơn hàng</div>
      {<StatisticChart name="order" data={[]} />}
      <div className="font-bold mt-4 text-lg">Thống kê sales</div>
      {<StatisticChart name="sales" data={[]} />}
    </>
  );
}

export default Statistic;
