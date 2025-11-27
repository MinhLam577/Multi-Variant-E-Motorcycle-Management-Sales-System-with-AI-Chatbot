import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Loading from "@/containers/Loading";
import { useStore } from "@/stores";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"; // icon đẹp
export interface VerifyCodeProps {}
const VerifyCodeStatus = {
    LOADING: "loading",
    FAILED: "failed",
    SUCCESS: "success",
    INVALID: "invalid",
} as const;
type VerifyCodeStatus =
    (typeof VerifyCodeStatus)[keyof typeof VerifyCodeStatus];
const VerifyCode = (props: VerifyCodeProps = {}) => {
    const store = useStore();
    const loginStore = store.loginObservable;
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<VerifyCodeStatus>(
        VerifyCodeStatus.LOADING
    );

    useEffect(() => {
        const verify = async () => {
            try {
                const id = searchParams.get("id");
                const codeId = searchParams.get("codeId");
                if (!id || !codeId) {
                    setStatus(VerifyCodeStatus.INVALID);
                    return;
                }

                await loginStore.verifyCode({ id, codeId });

                if (loginStore.errorMsg) {
                    setStatus(VerifyCodeStatus.FAILED);
                } else {
                    setStatus(VerifyCodeStatus.SUCCESS);
                }
            } catch (error) {
                console.error("Lỗi trong xác thực mã code:", error);
                setStatus(VerifyCodeStatus.FAILED);
            }
        };
        verify();
    }, []);

    const renderContent = () => {
        switch (status) {
            case VerifyCodeStatus.LOADING:
                return (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-600 text-lg">
                            Đang xác thực mã kích hoạt...
                        </p>
                    </>
                );
            case VerifyCodeStatus.SUCCESS:
                return (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">
                            Kích hoạt thành công!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Tài khoản của bạn đã được kích hoạt. Giờ bạn có thể
                            đăng nhập.
                        </p>
                        <a
                            href="/login"
                            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                        >
                            Đăng nhập ngay
                        </a>
                    </>
                );
            case VerifyCodeStatus.FAILED:
                return (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">
                            Mã kích hoạt không hợp lệ!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Mã đã hết hạn hoặc không tồn tại. Vui lòng đăng ký
                            lại tài khoản.
                        </p>
                        <a
                            href="/login"
                            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        >
                            Đăng ký lại
                        </a>
                    </>
                );
            case VerifyCodeStatus.INVALID:
                return (
                    <>
                        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-yellow-600 mb-2">
                            Đường dẫn không hợp lệ
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Liên kết kích hoạt không chứa thông tin cần thiết.
                        </p>
                        <a
                            href="/login"
                            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                        >
                            Về trang đăng nhập
                        </a>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyCode;
