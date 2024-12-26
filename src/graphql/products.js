import gql from 'graphql-tag';

export const GET_PRODUCTS_LIST = gql`
query admin_getProductList($filters: FilterProductInput!){
	admin_getProductList: admin_getProductList(filters: $filters){
		data {
			name
			productId
			prices {
				name
				price
				oneUnit
			}
			categories {
				categoryName
			}
			stores{
				storeName
				storeId
			}
			status
			created_at
		}
		total
	}
}
`;

export const GET_PRODUCT = gql`
	query getProduct($id: String!){
		getProduct(id: $id){
			name
			productId
			brief
			status
			description
			listImgUrl
			minQuantity
			categories{
				categoryName
				categoryId
			}
			prices{
				name
				price
				oneUnit
			}
			stores{
				storeName
				storeId
			}
			status
			created_at
			unit
		}
	}
`;

export const REMOVE_PRODUCT = gql`
	mutation removeProduct($id: String!){
		removeProduct(id: $id){
			status
			error
		}
	}
`;

export const INACTIVE_PRODUCT = gql`
	mutation deactivateProduct($id: String!){
		deactivateProduct(id: $id){
			status
			error
		}
	}
`;
export const ACTIVE_PRODUCT = gql`
	mutation activateProduct($id: String!){
		activateProduct(id: $id){
			status
			error
		}
	}
`;

export const CREATE_PRODUCT = gql`
	mutation createProduct($createProductInput: CreateProductInput!){
		createProduct(createProductInput: $createProductInput){
			status
      data {
        productId
      }
			error
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation updateProduct($updateProductInput: UpdateProductInput!){
		updateProduct(updateProductInput: $updateProductInput){
			status
			error
		}
	}
`;

export const GET_PRODUCTNAME_LIST = gql`
query admin_products($filters: FilterProductInput!){
	admin_products: admin_products(filters: $filters){
		data {
			productId
			productName
			created_at
			brief
			sku
			description
			agencyPrice
			retailPrice
			listImgUrl
			productCategories{
				category {
					categoryName
					categoryId
				}
			}
		}
	}
}
`;

export const GET_PRODUCTCATEGORIES_LIST = gql`
query admin_products($filters: FilterProductInput!){
	admin_products: admin_products(filters: $filters){
		data {
			productId
			productName
			created_at
			brief
			sku
			description
			agencyPrice
			retailPrice
			listImgUrl
			productCategories{
				category {
					categoryName
					categoryId
				}
			}
		}
	}
}
`;

export const TOP_PRODUCT_OF_MONTH = gql`
	query topProductOfMonth ($month: Float!, $year: Float!) {
		topProductOfMonth (month: $month, year: $year ){
			product {
				productName
			}
			quantity
			productId
		}
	}
`;
