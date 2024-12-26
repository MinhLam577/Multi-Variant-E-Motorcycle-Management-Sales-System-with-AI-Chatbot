import PropTypes from "prop-types";

const Logo = ({ handleClick, bgColor, collapsed }) => {
  return (
    <div className="w-full flex justify-center p-2">
      <button
        onClick={handleClick}
        className={`w-full border-0 ${collapsed ? "" : "p-4"}`}
        style={{ backgroundColor: bgColor }}
      >
        {bgColor === "#FFFFFF" && (
          <div>
            <img alt="logo" width={120} src="/logo192.png" />
          </div>
        )}
        {collapsed ? (
          <div>
            <img alt="logo" width={40} src="/logo192.png" />
          </div>
        ) : (
          <div>
            <span className="text-[#006400] font-serif font-bold text-4xl">
              Ô tô hồng sơn
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

Logo.propTypes = {
  handleClick: PropTypes.func,
  bgColor: PropTypes.string,
  collapsed: PropTypes.bool,
};

Logo.defaultProps = {
  bgColor: "#111111",
};

export default Logo;
