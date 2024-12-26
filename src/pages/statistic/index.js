import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_STATISTIC_LIST } from "../../graphql/statistic";
import StatisticCard from "../../businessComponents/statistic/StatisticCard";
import StatisticSearch from "../../businessComponents/statistic/StatisticSearch";
import StatisticChart from "../../businessComponents/statistic/StatisticChart";

function Statistic() {
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { data } = useQuery(GET_STATISTIC_LIST,  {
    variables: {
      filterOrderInput: {
        filters: globalFilters,
        paging: {
          page: 1,
          pageSize: 10
        },
        sorters: null,
      }
    }
  });

  return (
    <>
      <StatisticSearch setFilters={setGlobalFilters} />
      <StatisticCard data={data?.statistics} />
      <div className="font-bold mt-4 text-lg">Thống kê đơn hàng</div>
      {data?.statistics?.detailOrder?.length > 0 ? <StatisticChart name='order' data={data?.statistics?.detailOrder}/> : 'Không có đơn hàng'}
      <div className="font-bold mt-4 text-lg">Thống kê sales</div>
      {data?.statistics?.salesReport?.length > 0 ? <StatisticChart name='sales' data={data?.statistics?.salesReport}/> : 'Không có sales'}
    </>
  );
}

export default Statistic