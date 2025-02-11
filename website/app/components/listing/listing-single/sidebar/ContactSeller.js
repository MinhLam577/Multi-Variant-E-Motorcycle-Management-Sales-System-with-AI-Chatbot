const ContactSeller = () => {
  return (
    <form>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <input
              className="form-control form_control"
              type="text"
              placeholder="Họ tên"
              
            />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-lg-12">
          <div className="mb-3">
            <input
              className="form-control form_control"
              type="text"
              placeholder="Số điện thoại"
              
            />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-lg-12">
          <div className="mb-3">
            <input
              className="form-control form_control"
              type="email"
              placeholder="Email"
              
            />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-md-12">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={6}
              defaultValue="Nhập..."
              required
            />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-md-12">
          <button  className="btn btn-block btn-thm mt10 mb20">
            Gửi tin nhắn
          </button>
          <button className="btn btn-block btn-whatsapp mb0">
            <span className="flaticon-whatsapp mr10 text-white" />
           
            <a href="zalo://oa/show?oid=0973470778" className="text-white"> Gọi ngay 0973470778</a>

          </button>
        </div>
        {/* End .col-12 */}
      </div>
      {/* End .row */}
    </form>
  );
};

export default ContactSeller;
