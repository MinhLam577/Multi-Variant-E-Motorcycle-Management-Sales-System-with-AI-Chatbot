const SignupForm = () => {
    return (
        <form>
            <div className="row">
                <div className="col-lg-12">
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên"
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="form-group mb20">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="form-group mb20">
                        <label className="form-label">Xác nhận Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Xác nhận Mật khẩu"
                            required
                        />
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-signup btn-thm mb0">
                Đăng ký
            </button>
        </form>
    );
};

export default SignupForm;
