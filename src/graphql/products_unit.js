import gql from 'graphql-tag';

export const GET_PRODUCT_UNITS = gql`
query admin_productUnits{
	admin_productUnits{
			productUnitId
			name		
			description
			createdById
			total
			createdBy {
				fullname
			}
		
		total
	}
}
`;

export const GET_PRODUCT_UNIT = gql`
	query productUnit($id: String!){
		productUnit(id: $id){
			productUnitId
			name
			description
			createdById
			total
			createdBy {
				fullname
			}
		}
	}
`;

export const REMOVE_PRODUCT_UNIT = gql`
	mutation removeProductUnit($id: String!){
		removeProductUnit(id: $id){
			status
			error
		}
	}
`;

export const INACTIVE_PRODUCTUnit = gql`
	mutation deactivateProductUnit($id: String!){
		deactivateProductUnit(id: $id){
			status
			error
		}
	}
`;
export const ACTIVE_PRODUCTUnit = gql`
	mutation activateProductUnit($id: String!){
		activateProductUnit(id: $id){
			status
			error
		}
	}
`;

export const CREATE_PRODUCT_UNIT = gql`
	mutation createProductUnit($createProductUnitInput: CreateProductUnitInput!){
		createProductUnit(createProductUnitInput: $createProductUnitInput){
			status
      data {
        name
      }
			error
		}
	}
`;

export const UPDATE_PRODUCT_UNIT = gql`
	mutation updateProductUnit($updateProductUnitInput: UpdateProductUnitInput!){
		updateProductUnit(updateProductUnitInput: $updateProductUnitInput){
			status
			error
		}
	}
`;
