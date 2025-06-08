import { action, makeObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import apiClient from "../api/apiClient";
import { keyStorageAccount } from "../constants";

class UploadImageObservable {
    roles = null;
    urlResource = null;
    constructor() {
        makeObservable(this, {
            updateImageGetUrl: action.bound,
            urlResource: observable,
        });
    }

    async updateImageGetUrl(file, uploadUrl) {
        this.status = "submitting";
        try {
            const formData = new FormData();
            formData.append("file", file);

            const { data, status } = await apiClient.post(uploadUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (status !== 201) {
                this.status = "fetchFailed";
                this.errorMsg = "Failed to upload image";
                return null; // Trả về null nếu lỗi
            }
            this.status = "uploadSuccess";
            return data;
        } catch (error) {
            this.status = "uploadFailed";
            this.errorMsg = error?.message;
        }
    }

    clearAccount() {
        secureLocalStorage.removeItem(keyStorageAccount);
        this.account = null;
    }
}

export default UploadImageObservable;
