import apiClient from "./apiClient";
import endpoints from "./endpoints.ts";

const SkusAPI = {
    getDetailImportsById: async (id) => {
        try {
            const response = await apiClient.get(endpoints.import.details(id));
            return response.data;
        } catch (error) {
            return error;
        }
    },
};
