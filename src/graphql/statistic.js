import gql from "graphql-tag";

export const GET_STATISTIC_LIST = gql`
  query statistics($filterOrderInput: FilterOrderInput!) {
    statistics: statistics(filterOrderInput: $filterOrderInput) {
      totalCustomers
      totalOrderGreaterThan100k
      totalOrders
      totalPrice
      totalCustomer100KAnd7d
      detailOrder {
        dateStr
        numOrder
        numOrderGreaterThan100k
      }
      salesReport {
        salesName
        salesPhone
        totalRevenue
      }
    }
  }
`;