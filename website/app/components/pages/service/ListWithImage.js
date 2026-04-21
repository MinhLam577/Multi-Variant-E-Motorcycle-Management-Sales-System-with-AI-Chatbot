import Image from "next/image";

const ListWithImage = () => {
    const serviceItems = [
        { text: "Sửa chữa ô tô tổng quát", link: "#" },
        { text: "Bảo dưỡng xe định kỳ", link: "#" },
        { text: "Dịch vụ điều hòa & hệ thống sưởi", link: "#" },
        { text: "Sửa chữa hệ thống làm mát & két nước", link: "#" },
        { text: "Thay dầu động cơ tổng hợp", link: "#" },
        { text: "Thay lọc dầu", link: "#" },
        { text: "Sửa chữa & bảo dưỡng phanh", link: "#" },
        { text: "Chẩn đoán lỗi động cơ", link: "#" },
        { text: "Kiểm tra ống dẫn & dung dịch", link: "#" },
        { text: "Dịch vụ hộp số", link: "#" },
    ];

    return (
        <div className="row">
            <div className="col-lg-6 col-xl-6">
                <div className="service_include !mt-[100px]">
                    <h3 className="title">Dịch Vụ Của Chúng Tôi</h3>
                    <p className="para">
                        Đội ngũ kỹ thuật viên giàu kinh nghiệm của chúng tôi
                        tiến hành kiểm tra xe kỹ lưỡng với hơn 200 hạng mục,
                        giúp bạn hoàn toàn yên tâm về tình trạng xe trước và sau
                        khi sử dụng dịch vụ.
                    </p>
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="si_list">
                                <ul className="mb0 order_list list-style-check-circle check_theme_color">
                                    {serviceItems
                                        .slice(0, 5)
                                        .map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.link}
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="si_list">
                                <ul className="mb0 order_list list-style-check-circle check_theme_color">
                                    {serviceItems
                                        .slice(5, 10)
                                        .map((item, index) => (
                                            <li key={index}>
                                                <a href={item.link}>
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-xl-5 offset-xl-1">
                <div className="service_thumb">
                    <Image
                        width={636}
                        height={667}
                        layout="responsive"
                        src="/images/service/sua-xe.jpg"
                        alt="sua-xe"
                    />
                </div>
            </div>
        </div>
    );
};

export default ListWithImage;
