import { HeaderContentType, ResponseFailure, ResponseImage } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";

const BaseAPI: {
    login: (username: string, password: string) => Promise<any>;
    uploadImagesToServer: (
        files: File[],
        folder?: string
    ) => Promise<ResponseImage[] | ResponseFailure>;
} = {
    login: (username, password) => {
        return apiClient
            .post(endpoints.auth.login, {
                username,
                password,
            })
            .catch((e) => e);
    },
    uploadImagesToServer: async (files: File[], folder?: string) => {
        const formData = new FormData();
        if (!files || files.length === 0) {
            throw new Error("No files to upload");
        }
        files.forEach((file) => {
            formData.append("files", file);
        });

        if (folder) {
            formData.append("folder", folder);
        }

        try {
            const response = await apiClient.post(
                endpoints.base.uploadImagesToServer,
                formData,
                {
                    headers: {
                        "Content-Type": HeaderContentType.FORM_DATA,
                    },
                }
            );
            return response?.data as ResponseImage[] || response as unknown as ResponseFailure;
        } catch (error) {
            throw error;
        }
    },
};

export default BaseAPI;
