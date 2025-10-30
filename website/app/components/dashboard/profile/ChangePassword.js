"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { observer } from "mobx-react-lite";
import { message } from "antd";
import { useStore } from "@/context/store.context";

const schema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
        .required("Mật khẩu mới là bắt buộc")
        .min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
        .required("Vui lòng xác thực mật khẩu mới")
        .oneOf([Yup.ref("newPassword")], "Mật khẩu mới không khớp với nhau "),
});

const ChangePassword = observer(() => {
    const store = useStore();
    const customerStore = store.userObservable;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, // 👈 thêm hàm reset từ useForm  reset, // 👈 thêm hàm reset từ useForm
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        // Gọi API đổi mật khẩu ở đây
        await customerStore.changePassword_Profile(data);
        if (customerStore.status == 200) {
            message.success(customerStore.message);
            reset(); // 👈 xóa dữ liệu trong form sau khi thành công
        } else {
            message.error(customerStore.errorMsg);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-sm-6 col-lg-7">
                <div className="mb20">
                    <input
                        type="password"
                        placeholder="Mậu khẩu cũ"
                        className="form-control form_control"
                        {...register("oldPassword")}
                    />
                    {errors.oldPassword && (
                        <p className="text-danger">
                            {errors.oldPassword.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-sm-6 col-lg-7">
                <div className="mb20">
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="form-control form_control"
                        {...register("newPassword")}
                    />
                    {errors.newPassword && (
                        <p className="text-danger">
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-sm-6 col-lg-7">
                <div className="mb20">
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        className="form-control form_control mb20"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-danger">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                    <button type="submit" className="btn btn-thm ad_flor_btn">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
});

export default ChangePassword;
