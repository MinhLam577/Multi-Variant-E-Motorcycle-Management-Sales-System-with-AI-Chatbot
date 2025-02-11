const LoginForm = () => {
  return (
    <form>
      <div className="mb-2 mr-sm-2">
        <label className="form-label">Tên đăng nhập/email *</label>
        <input
          type="text"
          className="form-control"
          required
          placeholder="Tên đăng nhập hoặc Email"
        />
      </div>
      <div className="form-group mb5">
        <label className="form-label">Mật khẩu *</label>
        <input
          type="password"
          className="form-control"
          placeholder="Mật khẩu"
          required
        />
      </div>
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id="exampleCheck3"
          required
        />
        <label className="custom-control-label" htmlFor="exampleCheck3">
          Lưu lại
        </label>
        <a className="btn-fpswd float-end" href="#">
          Quên mật khẩu?
        </a>
      </div>
      <button type="submit" className="btn btn-log btn-thm mt5">
        Đăng ký
      </button>
    </form>
  );
};

export default LoginForm;
