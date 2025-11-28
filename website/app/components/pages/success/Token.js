"use client";
import { useStore } from "@/context/store.context";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { message } from "antd";
// const Token = observer(() => {
//     const router = useRouter();
//     const [user, setUser] = useState(null);
//     const store = useStore();
//     const AccountStore = store.loginObservable;

//     const handleToken = async (token) => {
//         setUser(token); // Gán thông tin user
//         if (token) {
//             try {
//                 await AccountStore.getProfile_ByGoogle(token);
//                 if (AccountStore.status == "loginSuccess") {
//                     message.success(AccountStore.successMsg);
//                     router.push("/");
//                 } else {
//                     message.error("Đăng nhập thất bại");
//                     router.push("/login");
//                 }
//             } catch (err) {
//                 console.error("Lỗi khi gọi API", err);
//             }
//         }
//     };
//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const token = urlParams.get("token");
//         handleToken(token);
//     }, []);

//     return <div></div>;
// });

// export default Token;
