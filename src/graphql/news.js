import gql from 'graphql-tag';

export const GET_NEWS_LIST = gql`
	query newsList($filters: FilterNewsInput!){
		newsList: admin_getNewsList(filters: $filters){
			data {
				newsId
				title
				brief
				cover
        status
				updated_at
				created_at
			}
			total
		}
	}
`;

export const GET_NEWS = gql`
	query getNews($id: String!){
		getNews(id: $id){
      newsId
      title
	  brief
      description
      cover
      status
      updated_at
      created_at
		}
	}
`;

export const REMOVE_NEWS = gql`
	mutation removeNews($id: String!){
		removeNews(id: $id){
			status
			error
		}
	}
`;

export const CREATE_NEWS = gql`
	mutation createNews($createNewsInput: CreateNewsInput!){
		createNews(createNewsInput: $createNewsInput){
			status
      data {
        newsId
      }
			error
		}
	}
`;

export const UPDATE_NEWS = gql`
	mutation updateNews($updateNewsInput: UpdateNewsInput!){
		updateNews(updateNewsInput: $updateNewsInput){
			status
			error
		}
	}
`;

export const ACTIVATE_NEWS = gql`
	mutation activateNews($id: String!){
		activateNews(id: $id){
			status
			error
		}
	}
`;

export const DEACTIVATE_NEWS = gql`
	mutation deactivateNews($id: String!){
		deactivateNews(id: $id){
			status
			error
		}
	}
`;