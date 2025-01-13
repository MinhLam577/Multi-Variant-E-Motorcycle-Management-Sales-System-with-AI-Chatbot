import PropTypes from "prop-types";

const Logo = ({ handleClick, bgColor, collapsed }) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={handleClick}
        className={`w-full border-0 rounded-2xl ${collapsed ? "" : "p-2"}`}
        style={{ backgroundColor: "white" }}
      >
        {bgColor === "#FFFFFF" && (
          <div>
            <img alt="logo" className="w-2/3 md:w-120" src="/logo192.png" />
          </div>
        )}
        {collapsed ? (
          <div>
            <img alt="logo" className="w-30 md:w-20" src="/logo192.png" />
          </div>
        ) : (
          <div>
            <img alt="logo" className="w-15 md:w-20" src="/logo2048.png" />
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
