import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const userEndpoints = endpoints.user;

type UserAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
    getUserDetails: (id: string) => Promise<ResponsePromise>;
};

const UserAPI: UserAPIType = {
    list: async (query: string) =>
        await apiClient.get(userEndpoints.list(query)),
    getUserDetails: async (id: string) =>
        await apiClient.get(userEndpoints.details(id)),
};
export default UserAPI;

// export const getListUser = async (query: string) =>
//     await apiClient.get(endpoints.user.list(query));

// export const getUserDetails = async (id: string) => {
//     const response = await apiClient.get(endpoints.user.details(id));
//     return response.data;
// };

// export const createUser = async (carData) => {
//     const response = await apiClient.post(endpoints.user.create, carData);
//     return response.data;
// };

// export const callBulkCreateUser = async (data) => {
//     const response = await apiClient.post(
//         endpoints.user.callBulkCreateUser,
//         data
//     );
//     return response;
// };

// export const uploadUserImage = async (file) => {
//     try {
//         const formData = new FormData();
//         formData.append("file", file);
//         const response = await apiClient.post(
//             endpoints.user.uploadAvatar(),
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             }
//         );

//         return response?.data;
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         throw error;
//     }
// };
