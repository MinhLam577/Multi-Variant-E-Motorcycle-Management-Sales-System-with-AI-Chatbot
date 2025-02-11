const Descriptions = () => {
  const paragraphs = [
    {
      className: "first-para",
      content:
        "Volvo XC60 mới hoàn toàn là một SUV compact sang trọng tuyệt vời. Nó đã được thiết kế lại hoàn toàn cho năm 2017 và có các cải thiện trên toàn diện. Những thay đổi này đã đẩy xe lên từ vị trí trung bình trước đó; giờ đây nó đang cạnh tranh với một số trong những chiếc xe tốt nhất trong lớp. Một số cải thiện đáng chú ý nhất bao gồm hệ thống giải trí tiên tiến, không gian chân sau cho hành khách ngồi sau và các lựa chọn động cơ mạnh mẽ.",
    },
    {
      className: "mb25",
      content:
        "Chiếm hơn 8,000 feet vuông, được đặt trên 1,100 feet trong không khí với tầm nhìn toàn cảnh 360 độ tuyệt vời của toàn bộ Thành phố New York và khu vực tam bang xung quanh, Tầng 82 tại 432 Park Avenue đã được tái tưởng tượng hoàn toàn bởi một trong những công ty thiết kế được săn đón nhất ở London và đại diện cho một cơ hội duy nhất để sở hữu một tài sản có ý nghĩa toàn cầu.",
    },
    {
      className: "mt10 mb20",
      content:
        "The Amrutha Lounge có nghĩa là cảng trong tiếng Thổ Nhĩ Kỳ, tuy nhiên nhà hàng mở cửa đón tất cả các khía cạnh của bếp Địa Trung Hải. Bếp sẽ chủ yếu tập trung vào thực phẩm Địa Trung Hải; các chủ sở hữu nhà hàng là các đầu bếp chuyên nghiệp trẻ có thể mang lại những hương vị mới, thú vị đến Angel, Islington sẽ thể hiện qua chất lượng của thực phẩm họ chuẩn bị.",
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

export default Descriptions;
