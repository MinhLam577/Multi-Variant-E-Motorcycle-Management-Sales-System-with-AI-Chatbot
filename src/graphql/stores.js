import gql from 'graphql-tag';

export const GET_STORES_LIST = gql`
	query storesList($filters: FilterStoreInput!){
		storesList: admin_getStoreList(filters: $filters){
			data {
				storeId
				storeName
				storeCode
				address
				status
				timeToDeliveryAfterHours
				created_at
			}
			total
		}
	}
`;

export const GET_STORE = gql`
	query getStore($id: String!){
		getStore(id: $id){
            storeId
            storeName
            storeCode
            address
						timeToDeliveryAfterHours
            createdBy {
                fullname
            }
            status
            created_at
		}
	}
`;

export const REMOVE_STORE = gql`
	mutation removeStore($id: String!){
		removeStore(id: $id){
			status
			error
		}
	}
`;

export const CREATE_STORE = gql`
	mutation createStore($createStoreInput: CreateStoreInput!){
		createStore(createStoreInput: $createStoreInput){
			status
            data {
                storeId
            }
			error
		}
	}
`;

export const UPDATE_STORE = gql`
	mutation updateStore($updateStoreInput: UpdateStoreInput!){
		updateStore(updateStoreInput: $updateStoreInput){
			status
			error
		}
	}
`;
