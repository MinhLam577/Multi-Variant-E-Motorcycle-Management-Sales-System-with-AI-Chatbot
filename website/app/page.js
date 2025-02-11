import Home from "./(home)/home";
import Wrapper from "./layout/wrapper";
export const metadata = {
  title: "Ô Tô Hồng Sơn || Chuyên mua bán và trao đổi xe ô tô uy tín",
  description: `Ô Tô Hồng Sơn cung cấp đa dạng dòng xe với giá tốt nhất, hỗ trợ tài chính linh hoạt và được tin cậy bởi hàng ngàn khách hàng.`,
};

export default function MainRoot() {
  return (
    <Wrapper>
      <Home />
    </Wrapper>
  );
}
