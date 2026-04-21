"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/store.context";
import apiClient from "@/src/api/apiClient";
import endpoints from "@/src/api/endpoints";
import { toJS } from "mobx";
export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rootStore = useStore();

    useEffect(() => {
        const handleLogin = async () => {
            const token = searchParams.get("token");
            const refresh_token = searchParams.get("refresh_token");

            if (!token || !refresh_token) {
                router.push("/login");
                return;
            }

            try {
                // 1. set account TRƯỚC (để interceptor đọc được)
                await rootStore.accountObservable.setAccount(
                    {
                        access_token: token,
                        refresh_token: refresh_token,
                        user: null as any,
                    },
                    true
                );

                // 2. gọi /me
                const response = await apiClient.get(endpoints.auth.me, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const data = response?.data || null;

                // 3. update lại user
                await rootStore.accountObservable.setAccount(
                    {
                        access_token: token,
                        refresh_token: refresh_token,
                        user: data,
                    },
                    true
                );
                console.log("account: ", rootStore.accountObservable.account);

                router.push("/");
            } catch (error) {
                console.error("Login Google failed:", error);
                router.push("/login");
            }
        };

        handleLogin();
    }, [searchParams]);
    const styles: any = {
        container: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
        },
        text: {
            fontSize: "16px",
            color: "#555",
        },
    };
    return (
        <div style={styles.container}>
            <p style={styles.text}>
                Đang đăng nhập, vui lòng chờ trong giây lát...
            </p>
        </div>
    );
}
