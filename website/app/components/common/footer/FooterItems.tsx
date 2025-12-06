import { addressList } from "@/data/address";

const FooterItems = () => {
    const AddressItem = ({ item }) => {
        return (
            <div className="col-md-12">
                <p>{item.address}</p>
                <p>{item.phone}</p>
            </div>
        );
    };

    return (
        <div className="row">
            {/* Address List */}
            {addressList?.map((item, index) => (
                <div
                    key={index}
                    className="col-sm-6 col-md-4 col-lg-3 col-xl-3"
                >
                    <div className="footer_about_widget">
                        <h5 className="title">{item.title}</h5>
                        {item?.children?.map((address, index) => (
                            <AddressItem key={index} item={address} />
                        ))}
                    </div>
                </div>
            ))}
            {/* End Address List */}

            {/* Contact */}
            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="footer_contact_widget">
                    <h5 className="title">LIÊN HỆ HỖ TRỢ</h5>
                    <div className="footer_phone">+84 986 344 233</div>
                    <p>otominhdeptrai.sitestar@gmail.com</p>
                </div>
            </div>
            {/* End .col */}

            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="footer_contact_widget">
                    <h5 className="title">GIỜ MỞ CỬA</h5>
                    <p>
                        Thứ 2 – Thứ 6: 09:00AM – 09:00PM
                        <br />
                        Thứ 7: 09:00AM – 07:00PM
                        <br />
                        Chủ nhật: Đóng cửa
                    </p>
                </div>
            </div>
            {/* End .col */}

            <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="footer_contact_widget">
                    <h5 className="title">Nhận thông tin</h5>
                    <form className="footer_mailchimp_form">
                        <div className="wrapper">
                            <div className="col-auto">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập email..."
                                    required
                                />
                                <button type="submit">Gửi</button>
                            </div>
                        </div>
                    </form>
                    <p>Nhận cập nhật ưu đãi mới nhất.</p>
                </div>
            </div>
            {/* End .col */}
        </div>
    );
};

export default FooterItems;
