import useMessage from "antd/es/message/useMessage";

export const handleErrorMessage = (error) => {
    switch (error?.statusCode) {
        case 503: {
            return "Kết nối bị gián đoạn, vui lòng thử lại sau!";
        }
        case 404: {
            return "Không tìm thấy trang";
        }
        default:
            return error?.message;
    }
};

export const handleResponse = (response, userMessage) => {
    const success_status = [200, 201, 204];
    if (!response) {
        return {
            status: 400,
            message: `Không tồn tại response hoặc response không hợp lệ`,
            data: null,
        };
    }
    if (!response?.status || typeof response.status !== "number") {
        return {
            status: 400,
            message: `Không tồn tại status hoặc status không hợp lệ`,
            data: null,
        };
    }
    if (!response?.data) {
        return {
            status: 400,
            message: `Không tồn tại data trong response`,
            data: null,
        };
    }
    const { status, message, data } = response;
    if (!data) {
        return {
            status: 400,
            message: `Không tồn tại data trong response`,
            data: null,
        };
    }

    if (success_status.includes(status)) {
        return {
            status,
            message: `${useMessage} thành công` || message,
            data,
        };
    }
    return {
        status,
        message: userMessage || message,
        data,
    };
};
