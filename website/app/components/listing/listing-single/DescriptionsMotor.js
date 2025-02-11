const DescriptionsMotor = () => {
  const paragraphs = [
    {
      className: "first-para",
      content:
        "Xe máy điện mới là một phương tiện giao thông sạch và hiệu quả. Nó đã được thiết kế lại hoàn toàn cho năm 2022 và có các cải thiện trên toàn diện. Những thay đổi này đã đẩy xe lên từ vị trí trung bình trước đó; giờ đây nó đang cạnh tranh với một số trong những chiếc xe tốt nhất trong lớp. Một số cải thiện đáng chú ý nhất bao gồm hệ thống phanh tiên tiến, không gian chứa đồ cho người ngồi sau và các lựa chọn động cơ mạnh mẽ.",
    },
    {
      className: "mt10 mb20",
      content:
        "Vinfast là một trong những hãng sản xuất xe điện hàng đầu Việt Nam, cam kết mang lại cho người dùng những trải nghiệm di chuyển sạch và hiệu quả. Với đội ngũ kỹ sư trẻ và tài năng, Vinfast đã và đang phát triển các công nghệ mới, mang lại cho thị trường xe máy điện những sản phẩm chất lượng cao.",
    },
  ];

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p className={paragraph.className} key={index}>
          {paragraph.content}
        </p>
      ))}
    </>
  );
};

export default DescriptionsMotor;
