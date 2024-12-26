import gql from "graphql-tag";

export const GET_CATEGORIES_LIST = gql`
  query admin_categories {
    admin_categories {
      categoryId
      categoryName
      screen
      isActive
      sequenceNo
      created_at
    }
  }
`;

export const GET_CATEGORY = gql`
  query admin_category($id: String!) {
    admin_category(id: $id) {
      categoryName
      categoryId
      screen
      image
      isActive
      sequenceNo
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation removeCategory($id: String!) {
    removeCategory(id: $id) {
      status
      error
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation createCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      status
      data {
        categoryId
      }
      error
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation updateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      status
      error
    }
  }
`;
