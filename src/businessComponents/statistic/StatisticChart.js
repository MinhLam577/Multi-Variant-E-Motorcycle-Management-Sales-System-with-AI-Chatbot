import PropTypes from "prop-types";
import { Column } from "@ant-design/charts";

function StatisticChart({ data, name }) {
  const dataNew =
    name === "order"
      ? data?.flatMap((item) => [
          { name: "Tổng đơn", dateStr: item.dateStr, number: item.numOrder },
          {
            name: "Tổng đơn > 100k",
            dateStr: item.dateStr,
            number: item.numOrderGreaterThan100k,
          },
        ])
      : data?.flatMap((item) => [
          {
            name: "Tổng doanh thu",
            dateStr: item.salesName,
            number: item.totalRevenue,
          },
        ]);

  const config = {
    data: dataNew,
    xField: "dateStr",
    yField: "number",
    colorField: "name",
    group: true,
    style: {
      inset: 5,
    },
  };
  return <Column {...config} />;
}

StatisticChart.propTypes = {
  data: PropTypes.array,
  name: PropTypes.string,
};

export default StatisticChart;
