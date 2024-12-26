import gql from 'graphql-tag';

export const CREATE_RESOURCE = gql`
  mutation createResource($file: Upload!, $category: String!) {
    createResource: resources_createResource(file: $file, category: $category) {
      fileName
      url
      mimetype
      encoding
    }
  }
`;

export const CREATE_RESOURCE_PUBLIC = gql`
  mutation createResource($file: Upload!) {
    createResource: resources_createResource_public(file: $file) {
      fileName
      url
      mimetype
      encoding
    }
  }
`;
