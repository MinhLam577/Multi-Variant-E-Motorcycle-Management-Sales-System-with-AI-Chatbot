import { cn } from "@/lib/utils";
interface IImageModalStyle {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
    image?: React.CSSProperties;
    closeBtn?: React.CSSProperties;
}

interface IImageModal {
    isOpen: boolean;
    imageSrc: string;
    alt?: string;
    onClose?: () => void;
    styles?: IImageModalStyle;
}
const ImageModal = ({
    isOpen = false,
    imageSrc,
    alt = "Image",
    onClose,
    styles,
}: IImageModal) => {
    return (
        <div
            className={cn(
                `image-modal-overlay fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} transition-all origin-center duration-500`
            )}
            style={styles.overlay}
        >
            <div
                className={cn(
                    "image-modal-content w-[90vw] h-[90vh] bg-transparent flex justify-center items-center rounded overflow-hidden relative"
                )}
                style={styles.content}
            >
                <img
                    src={imageSrc}
                    alt={alt}
                    className={cn(
                        `image-modal-img max-w-full max-h-[70%] object-cover ${isOpen ? "scale-100" : "scale-0"} duration-500 transition-transform origin-top`
                    )}
                    style={styles.image}
                />
                <button
                    className={cn(
                        "image-modal-closeBtn absolute top-[1px] right-[1px] bg-none cursor-pointer text-[#fff] border-none hover:text-[#ccc] bg-transparent text-3xl"
                    )}
                    style={styles.closeBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    type="button"
                >
                    x
                </button>
            </div>
        </div>
    );
};

export default ImageModal;
