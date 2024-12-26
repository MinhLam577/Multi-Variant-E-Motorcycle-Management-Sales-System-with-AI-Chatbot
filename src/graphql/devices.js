import gql from 'graphql-tag';

export const GET_CROSS_CHECK_USER_DEVICES = gql`
	query crossCheckUserDevices($filters: FilterCrossCheckUserDeviceInput!){
		crossCheckUserDevices(filters: $filters){
			data {
				crossCheckUserDeviceId
				deviceId
				login_at
				user {
          fullname
        }
				month
				year
			}
			total
		}
	}
`;