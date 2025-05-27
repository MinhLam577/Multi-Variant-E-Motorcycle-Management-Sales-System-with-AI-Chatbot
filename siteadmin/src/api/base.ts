import { HeaderContentType, ResponseFailure, ResponseImage } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";

const BaseAPI: {
    login: (username: string, password: string) => Promise<any>;
    uploadImagesToServer: (
        files: File[],
        folder?: string
    ) => Promise<ResponseImage[] | ResponseFailure>;
    convertUrlToBase64: (url: string) => Promise<string>;
} = {
    login: (username, password) => {
        return apiClient
            .post(endpoints.authAdmin.login, {
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
            return (
                (response?.data as ResponseImage[]) ||
                (response as unknown as ResponseFailure)
            );
        } catch (error) {
            throw error;
        }
    },
    convertUrlToBase64: async (url: string) => {
        try {
            if (!url || !url.match(/^https?:\/\//)) {
                throw new Error("Invalid URL");
            }

            const response = await apiClient.get(
                endpoints.base.convertUrlToBase64(encodeURIComponent(url))
            );

            if (response.status !== 200) {
                throw new Error("Failed to convert URL to Base64");
            }

            return response.data as string;
        } catch (e) {
            console.error("Error converting URL to Base64:", e);
            throw new Error("Error converting URL to Base64");
        }
    },
};

export default BaseAPI;
