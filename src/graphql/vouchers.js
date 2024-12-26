import gql from 'graphql-tag';

export const GET_VOUCHERS_LIST = gql`
	query admin_discounts{
		admin_discounts{
			discountId
			discountCode
			discountName
			discountType
			discountValue
			fromDate
			created_at
            minOrderTotalPrice
            status
            timesInDate
            toDate
            total
		}
	}
`;

export const GET_VOUCHER = gql`
	query admin_discount($id: String!){
		admin_discount(id: $id){
			discountId
			discountCode
			discountName
			discountType
			discountValue
			fromDate
			created_at
            minOrderTotalPrice
            status
            timesInDate
            toDate
		}
	}
`;

export const REMOVE_VOUCHER = gql`
	mutation removeDiscount($id: String!){
		removeDiscount(id: $id){
			status
			error
		}
	}
`;

export const CREATE_VOUCHER = gql`
	mutation createDiscount($createDiscountInput: CreateDiscountInput!){
		createDiscount(createDiscountInput: $createDiscountInput){
			status
			error
		}
	}
`;

export const UPDATE_VOUCHER = gql`
	mutation updateDiscount($updateDiscountInput: UpdateDiscountInput!){
		updateDiscount(updateDiscountInput: $updateDiscountInput){
			status
			error
		}
	}
`;