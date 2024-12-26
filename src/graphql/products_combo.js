import gql from "graphql-tag";

export const GET_PRODUCTCOMBO_LIST = gql`
  query admin_getProductComboList($filters: FilterProductComboInput!) {
    admin_getProductComboList: admin_getProductComboList(filters: $filters) {
      data {
        name
        productComboId
        brief
        description
        stores {
          storeId
          storeName
        }
        status
        created_at
      }
      total
    }
  }
`;

export const GET_PRODUCTCOMBO = gql`
  query getProductCombo($id: String!) {
    getProductCombo(id: $id) {
      name
      productComboId
      brief
      status
      description
      listImgUrl
      stores {
        storeName
        storeId
      }
      categories {
        categoryId
      }
      productComboItems {
        productId
        defaultQuantity
      }
      status
      created_at
    }
  }
`;

export const REMOVE_PRODUCTCOMBO = gql`
  mutation removeProductCombo($id: String!) {
    removeProductCombo(id: $id) {
      status
      error
    }
  }
`;

export const INACTIVE_PRODUCTCOMBO = gql`
  mutation deactivateProductCombo($id: String!) {
    deactivateProductCombo(id: $id) {
      status
      error
    }
  }
`;
export const ACTIVE_PRODUCTCOMBO = gql`
  mutation activateProductCombo($id: String!) {
    activateProductCombo(id: $id) {
      status
      error
    }
  }
`;

export const CREATE_PRODUCTCOMBO = gql`
  mutation createProductCombo(
    $createProductComboInput: CreateProductComboInput!
  ) {
    createProductCombo(createProductComboInput: $createProductComboInput) {
      status
      data {
        productComboId
      }
      error
    }
  }
`;

export const UPDATE_PRODUCTCOMBO = gql`
  mutation updateProductCombo(
    $updateProductInput: UpdateProductComboInput!
  ) {
    updateProductCombo(updateProductInput: $updateProductInput) {
      status
      error
    }
  }
`;

