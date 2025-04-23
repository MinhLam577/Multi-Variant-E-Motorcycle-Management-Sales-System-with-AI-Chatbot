import endpoints from "./endpoints";
import { HeaderContentType, ResponseImage, ResponsePromise } from ".";
import apiClient from "./apiClient";
const productEndpoints = endpoints.product;

const ProductAPI: {
    getListProduct: (query: string) => Promise<ResponsePromise>;
    uploadImagesToServer: (files: File[]) => Promise<ResponseImage[]>;
} = {
    getListProduct: async (query: string) =>
        await apiClient.get(productEndpoints.getListProduct(query)),
    uploadImagesToServer: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await apiClient.post(
                productEndpoints.uploadImagesToServer,
                formData,
                {
                    headers: {
                        "Content-Type": HeaderContentType.FORM_DATA,
                    },
                }
            );
            return (
                response?.data?.data ||
                response?.data ||
                ([] as ResponseImage[])
            );
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    },
};

export default ProductAPI;
