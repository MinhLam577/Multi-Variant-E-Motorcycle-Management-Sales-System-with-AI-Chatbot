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

      console.log("updateImageGetUrl", data);

      if (status !== 200) {
        this.status = "fetchFailed";
        this.errorMsg = "Failed to upload image";
        return;
      }

      this.status = "fetchSuccess";
    } catch (error) {
      this.status = "fetchFailed";
      this.errorMsg = error?.message;
    }

    // return new Promise((resolve, reject) => {
    //   apiClient
    //     .post(uploadUrl, formData)
    //     .then(({ data, status }) => {
    //       //   if (status !== 200) {
    //       //     this.status = "loginFailed";
    //       //     this.errorMsg = "Email hoặc mật khẩu không đúng!";
    //       //     reject(
    //       //       new Error(
    //       //         "Failed to upload image: Email hoặc mật khẩu không đúng!"
    //       //       )
    //       //     );
    //       //     return;
    //       //   }

    //       this.status = "loginSuccess";
    //       //   resolve(data);
    //     })
    //     .catch((error) => {
    //       console.log("errorerror", error);
    //       //   this.status = "loginFailed";
    //       //   this.errorMsg = error?.message;
    //       //   reject(new Error(`Failed to upload image: ${error?.message}`));
    //     });
    // });
  }

  clearAccount() {
    secureLocalStorage.removeItem(keyStorageAccount);
    this.account = null;
  }
}

export default UploadImageObservable;
