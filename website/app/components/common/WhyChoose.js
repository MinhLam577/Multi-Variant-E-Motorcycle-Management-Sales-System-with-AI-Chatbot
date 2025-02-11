const WhyChoose = () => {
  const reasons = [
    {
      iconClass: "flaticon-price-tag",
      title: "Giá Tốt Nhất",
      description:
        "Chúng tôi sở hữu đội ngũ tư vấn tài chính chuyên nghiệp, giúp bạn tìm ra giải pháp tài chính tối ưu, tiết kiệm tối đa chi phí khi mua xe.",
      delay: 100,
      style: "style1",
    },
    {
      iconClass: "flaticon-car",
      title: "Sự Tin Tưởng Từ Hàng Ngàn Khách Hàng",
      description:
        "Salon Ô Tô Hồng Sơn đã và đang nhận được sự tin yêu của hàng ngàn khách hàng nhờ chất lượng dịch vụ vượt trội, đảm bảo sự hài lòng ở mọi bước giao dịch.",
      delay: 200,
      style: "style2",
    },
    {
      iconClass: "flaticon-trust",
      title: "Đa Dạng Thương Hiệu Xe",
      description:
        "Chúng tôi cung cấp nhiều dòng xe từ các thương hiệu hàng đầu, đáp ứng đầy đủ nhu cầu và phong cách của từng khách hàng.",
      delay: 300,
      style: "style3",
    },
  ];

  return (
    <>
      {reasons.map((reason, index) => (
        <div
          className="col-sm-6 col-lg-4"
          data-aos="fade-up"
          data-aos-delay={reason.delay}
          key={index}
        >
          <div className="why_chose_us home7_style">
            <div className={`icon ${reason.style}`}>
              <span className={reason.iconClass} />
            </div>
            <div className="details">
              <h5 className="title">{reason.title}</h5>
              <p>{reason.description}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WhyChoose;
