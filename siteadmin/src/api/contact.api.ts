import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
import { CreateContactDto, UpdateContactDto } from "@/types/contact.type";
const contactEndPoint = endpoints.contact;

type ContactAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
    update: (
        id: string,
        data: Omit<UpdateContactDto, "id">
    ) => Promise<ResponsePromise>;
    delete: (id: string) => Promise<ResponsePromise>;
    create: (data: CreateContactDto) => Promise<ResponsePromise>;
};

const ContactAPI: ContactAPIType = {
    list: async (query: string) => {
        return await apiClient.get(contactEndPoint.list(query));
    },
    update: async (id: string, data: Omit<UpdateContactDto, "id">) => {
        return await apiClient.patch(
            contactEndPoint.update(id),
            JSON.stringify(data)
        );
    },
    create: async (data: CreateContactDto) => {
        return await apiClient.post(
            contactEndPoint.create(),
            JSON.stringify(data)
        );
    },
    delete: async (id: string) => {
        return await apiClient.delete(contactEndPoint.delete(id));
    },
};

export default ContactAPI;
