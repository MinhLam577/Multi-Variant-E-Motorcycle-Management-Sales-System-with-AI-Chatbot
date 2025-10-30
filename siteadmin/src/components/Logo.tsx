import anhtest from "./Logo.jpg";
const Logo = ({ handleClick, collapsed }) => {
    return (
        <div className="w-full h-full flex justify-center p-[14px]">
            <button
                onClick={handleClick}
                className={`w-full border-0 bg-transparent flex items-center gap-4`}
            >
                {collapsed ? (
                    <img
                        alt="logo"
                        className="max-w-10 max-h-10 object-cover"
                        src={anhtest}
                    />
                ) : (
                    <>
                        <img
                            alt="logo"
                            className="h-auto w-12 object-cover rounded"
                            src={anhtest}
                        />
                    </>
                )}
                <span
                    className={`text-xl text-white font-semibold ${collapsed ? "hidden" : ""}`}
                >
                    minhdeptrai.site
                </span>
            </button>
        </div>
    );
};

export default Logo;
