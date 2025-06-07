"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import authAPI from "../../../../src/api/authAPI";

import { useRouter } from "next/navigation";
import { message } from "antd";
const schema = Yup.object().shape({
    firstName: Yup.string().required("Vui lòng nhập tên"),
    lastName: Yup.string().required("Vui lòng nhập họ"),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
});
const Form = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const router = useRouter();
    const onSubmit = async (data) => {
        const dataRegister = {
            password: data.password,
            email: data.email,
            username: data.firstName + " " + data.lastname,
        };

        const response = await authAPI.register(dataRegister); // ✅ Đổi tên thành response
        if (response?.Iduser) {
            router.push(`/verify/${response.Iduser}`);
        } else {
            message.error(response.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-lg-6">
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-danger">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-danger">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-danger">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="form-group mb20">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-danger">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="form-group mb20">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-danger">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-log btn-thm mt5">
                Sign Up
            </button>
        </form>
    );
};

export default Form;
