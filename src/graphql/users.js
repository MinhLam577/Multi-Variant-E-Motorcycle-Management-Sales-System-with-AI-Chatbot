import gql from 'graphql-tag';


export const LOGIN = gql`
mutation authenticate(
		$input: AuthenticateInput!
	) {
		authenticate: auth_authenticate(
			input: $input
		) {
			data {
				email
				fullname
				userId
				accessToken
				role
				avatar
			}
			status
		}
	}
`;

export const RESET_PASSWORD = gql`
	mutation resetPassword($id: String!) {
		resetPassword(id: $id)
	}
`;


export const GET_PROFILE = gql`
	query users_getProfile {
		getProfile: users_getProfile{
			userId
			email
			fullname
			role
			avatar
		}
	}
`;

export const UPDATE_USER_PROFILE = gql`
	mutation updateUserProfile($updateUserProfileInput: UpdateUserProfileInput!){
		updateUserProfile(updateUserProfileInput: $updateUserProfileInput){
			fullname
			avatar
			status
		}
	}
`;

export const FORGOT_PASSWORD = gql`
	mutation forgotPassword($email: String!){
		forgotPassword: auth_forgotPassword(email: $email)
	}
`;


export const UPDATE_PASSWORD = gql`
	mutation changePasswordInput($changePasswordInput: ChangePasswordInput!){
		changePassword: auth_changePassword(changePasswordInput: $changePasswordInput)
	}
`;

export const GET_USERS = gql`
	query users($filters: FilterUserInput!){
		users(filters: $filters){
			data {
				userId
				email
				fullname
				role
				avatar
				phone
				birthDate
				address
				created_at
				status
			}
			total
		}
	}
`;

export const GET_USER = gql`
	query user($id: String!){
		user(id: $id){
			userId
			email
			fullname
			role
			avatar
			phone
			birthDate
			refPhone
			address
			created_at
		}
	}
`;


export const REMOVE_USER = gql`
	mutation removeUser($id: String!){
		removeUser(id: $id)
	}
`;

export const CREATE_USER = gql`
	mutation createUser($createUserInput: CreateUserInput!){
		createUser(createUserInput: $createUserInput){
			data {
				email
				fullname
				userId
				role
				avatar
			}
			status
			error
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($updateUserInput: UpdateUserInput!){
		updateUser(updateUserInput: $updateUserInput){
			status
			error
		}
	}
`;

export const REGISTER_USER = gql`
	mutation registerUser($registerUserInput: RegisterUserInput!){
		result: registerUser(registerUserInput: $registerUserInput){
			status
			data {
				accessToken
				userId
			}
			msg
		}
	}
`;

export const GET_DATA_CARD = gql`
	query getDataCard($accessToken: String!){
		data: getDataCard(accessToken: $accessToken){
			qrData
			fullName
			phone
			email
			avatar
		}
	}
`;

export const GET_DATA_CARD_BY_ID = gql`
	query getDataCardByUserId($userId: String!){
		data: getDataCardByUserId(userId: $userId){
			qrData
			fullName
			phone
			email
			avatar
		}
	}
`;

export const SEARCH_USER = gql`
	query searchUser($searchText: String, $includedUserIds: [String!], $excludedUserIds: [String!]){
		data: searchUser(searchText: $searchText, includedUserIds: $includedUserIds, excludedUserIds: $excludedUserIds){
			userId
			fullname
			userCode
		}
	}
`;

// moderator api -- begin
export const GET_MODERATORS = gql`
	query moderators($filters: FilterUserInput){
		moderators(filters: $filters){
			data {
				userId
				email
				fullname
				role
				avatar
				phone
				uid
				birthDate
				address
				created_at
			}
			total
		}
	}
`;

export const REMOVE_MODERATORS = gql`
	mutation removeModerators($removeModeratorsInput: AddModeratorsInput!){
		removeModerators(removeModeratorsInput: $removeModeratorsInput){
			status
			error
		}
	}
`;

export const ADD_MODERATORS = gql`
	mutation addModerators($addModeratorsInput: AddModeratorsInput!){
		addModerators(addModeratorsInput: $addModeratorsInput){
			status
			error
		}
	}
`;

export const SEARCH_USER_FOR_ADDING_MODERATORS = gql`
	query searchUserForAddingModerators($searchText: String, $includedUserIds: [String!]){
		data: searchUserForAddingModerators(searchText: $searchText, includedUserIds: $includedUserIds){
			userId
			fullname
		}
	}
`;
// moderator api -- end

export const GET_ADDRESS_USER = gql`
	query admin_getUserAddresses($id: String!){
		admin_getUserAddresses(id: $id){
			country
			created_at
			district
			province
			receiverName
			receiverPhone
			street
			userAddressId
			userId
			ward
			user{
				fullname
				email
				phone
			}
		}
	}
`;

export const REMOVE_ADDRESS = gql`
	mutation removeAddress($userAddressId: String!){
		removeAddress(id: $userAddressId){
			status
			error
		}
	}
`;

export const IMPORT_USERS = gql`
  mutation importUsers($file: Upload!, $createDataImportInput: CreateDataImportInput!) {
    importUsers: importData(file: $file, createDataImportInput: $createDataImportInput) {
	fileResultName
      fileResultUrl
      status
    }
  }
`;

export const ACTIVATE_USER = gql`
	mutation activateUser($id: String!){
		activateUser(id: $id)
	}
`;

export const GET_USER_MONTHLY_INCOME = gql`
	query admin_userMonthlyIncome($userCode: String!, $month: Float!, $year: Float!){
		admin_userMonthlyIncome(userCode: $userCode, month: $month, year: $year){
			buildingBrandRecognitionBonus
			collaboratorSalary
			leadershipBonus
			retailProfit
			salary
			systemBuildingBonus
			systemDevelopmentBonus
			systemEstablishmentBonus
			needToApproveBuildingBrandRecognitionBonus
			userMonthlyIncomeId
		}
	}
`;

export const APPROVE_BUILDING_BRAND_RECOGNITION_BONUS = gql`
	mutation approveBuildingBrandRecognitionBonus($userCodes: [String!]!, $month: Float!, $year: Float!){
		approveBuildingBrandRecognitionBonus(userCodes: $userCodes, month: $month, year: $year){
			data {
				buildingBrandRecognitionBonus
			}
			status
			error
		}
	}
`;

export const UPDATE_PARENT = gql`
	mutation admin_updateParent($parentUserCode: String!, $userCode: String!){
		admin_updateParent(parentUserCode: $parentUserCode, userCode: $userCode){
			status
			error
		}
	}
`;

export const EXPORT_USER_MONTHLY_INCOMES = gql`
	query exportUserMonthlyIncomes ($month: Float!, $year: Float!) {
		exportUserMonthlyIncomes (month: $month, year: $year ){
			fileResultUrl
		}
	}
`;

export const TOP_USER_INCOME_OF_MONTH = gql`
	query topUserIncomeOfMonth ($month: Float!, $year: Float!) {
		topUserIncomeOfMonth (month: $month, year: $year ){
			buildingBrandRecognitionBonus
			collaboratorSalary
			leadershipBonus
			retailProfit
			salary
			systemBuildingBonus
			systemDevelopmentBonus
			systemEstablishmentBonus
			needToApproveBuildingBrandRecognitionBonus
			userMonthlyIncomeId
			user {
				userCode
				fullname
			}
		}
	}
`;


export const GET_USER_YEAR_INCOMES = gql`
	query admin_userAnnuallyIncomes ($userCode: String!) {
		admin_userAnnuallyIncomes (userCode: $userCode ){
			personalGrowthBonus
			shareHolderCommission
			systemGrowthBonus
			year
		}
	}
`;

export const SEND_NOTIFICATION = gql`
	mutation sendNotification ($userCode: String!, $title: String!, $body: String!, $sendAll: Boolean) {
		sendNotification(
			sendAll: $sendAll, 
			sendNotificationInput:{
				title:$title,
				body:$body
			},
			userIds: [$userCode]
		) {
			status
		}
	}
`;