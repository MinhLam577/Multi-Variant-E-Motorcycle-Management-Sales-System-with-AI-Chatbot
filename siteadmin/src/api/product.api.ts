import endpoints from "./endpoints";
import { HeaderContentType, ResponseImage, ResponsePromise } from ".";
import apiClient from "./apiClient";
import { CreateProductDto, CreateSkusDto } from "src/stores/product.store";
const productEndpoints = endpoints.product;

const ProductAPI: {
    getListProduct: (query: string) => Promise<ResponsePromise>;
    detailProduct: (id: string) => Promise<ResponsePromise>;
    uploadImagesToServer: (files: File[]) => Promise<ResponseImage[]>;
    createProduct: (data: CreateProductDto) => Promise<ResponsePromise>;
    updateProduct: (
        id: string,
        data: CreateProductDto
    ) => Promise<ResponsePromise>;
    softDeleteProduct: (id: string) => Promise<ResponsePromise>;
    restoreDeleteProduct: (id: string) => Promise<ResponsePromise>;
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
    createProduct: async (data: CreateProductDto) =>
        await apiClient.post(productEndpoints.create, JSON.stringify(data)),
    updateProduct: async (id: string, data: CreateProductDto) =>
        await apiClient.put(productEndpoints.update(id), JSON.stringify(data)),
    softDeleteProduct: async (id: string) =>
        await apiClient.delete(productEndpoints.softDelete(id)),
    restoreDeleteProduct: async (id: string) =>
        await apiClient.patch(productEndpoints.restoreDelete(id)),
    detailProduct: async (id: string) =>
        await apiClient.get(productEndpoints.detail(id)),
};

export default ProductAPI;
