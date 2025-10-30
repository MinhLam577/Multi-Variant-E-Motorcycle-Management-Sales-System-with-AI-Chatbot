"use client";
import { useEffect, useState } from "react";
import { message } from "antd";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import ModalReactive from "../../modal/modal.reactive";
import ModalChangePassword from "../../modal/modal.changePassword";

import { useRouter } from "next/navigation";
import { LoginStatusProps } from "@/types/auth-validate.type";
const Form = observer(() => {
    const [reactivate, setReactivate] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const { loginObservable } = useStore();
    const router = useRouter();
    const validateEmail = (email) => {
        // Regex cơ bản để kiểm tra định dạng email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setUserEmail("");
        if (!email || !password) {
            message.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (!validateEmail(email)) {
            message.error("Email không hợp lệ.");
            return;
        }

        if (password.length < 6) {
            message.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        await loginObservable.login({ email, password });

        if (loginObservable.status === LoginStatusProps.LOGIN_SUCCESS) {
            message.success(loginObservable.successMsg);
            router.push("/");
        } else {
            message.error(loginObservable.errorMsg);
            // cần kích hoạt
            if (!loginObservable.data?.user?.isActice) {
                setReactivate(true);
                setUserEmail(email);
                return;
            }
        }
        loginObservable.status = LoginStatusProps.INITIAL;
    };
    const onCloseReactivate = () => {
        setReactivate(false);
        setUserEmail("");
    };
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-2 mr-sm-2">
                <label className="form-label">
                    Username or email address *
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group mb5">
                <label className="form-label">Password *</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="custom-control custom-checkbox">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    id="exampleCheck3"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="custom-control-label" htmlFor="exampleCheck3">
                    Remember me
                </label>
                <a
                    className="btn-fpswd float-end"
                    href="#"
                    onClick={() => setChangePassword(true)}
                >
                    Lost your password?
                </a>
            </div>
            <button type="submit" className="btn btn-log btn-thm mt5">
                Sign in
            </button>
            <ModalReactive
                isModalOpen={reactivate}
                setIsModalOpen={setReactivate}
                userEmail={userEmail}
                onCloseReactivate={onCloseReactivate}
            />
            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
                onCloseModal={() => setEmail("")}
            />
        </form>
    );
});

export default Form;
