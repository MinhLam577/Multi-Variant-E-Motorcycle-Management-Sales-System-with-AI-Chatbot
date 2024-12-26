import gql from 'graphql-tag';

export const DAILY_REVENUE = gql`
	query dailyRevenue($filter: FilterOneRevenueInput!){
		dailyRevenue(filter: $filter){
			childrenRevenue
      personalRevenue
      retailRevenue
		}
	}
`;

export const MONTHLY_REVENUE = gql`
	query monthlyRevenue($filter: FilterOneRevenueInput!){
		monthlyRevenue(filter: $filter) {
			retailRevenueFromReferences
			agencyRevenueFromReferences
			personalRevenue
			childrenRevenue
			children {
				retailRevenueFromReferences
				agencyRevenueFromReferences
				personalRevenue
				childrenRevenue
				user {
					fullname
					userCode
				}
			}
		}
	}
`;

export const ANNUAL_REVENUE = gql`
	query annualRevenue($filter: FilterOneRevenueInput!){
		annualRevenue(filter: $filter){
			childrenRevenue
      personalRevenue
      retailRevenue
		}
	}
`;