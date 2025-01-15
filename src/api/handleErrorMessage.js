export const handleErrorMessage = (error) => {
  console.log("handleErrorMessage", error);

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
