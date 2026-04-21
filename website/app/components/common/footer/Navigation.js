import Link from "next/link";

const Navigation = () => {
    const links = [
        { label: "Về chúng tôi", path: "/about-us" },
        { label: "Dịch vụ", path: "/service" },
        { label: "Tin tức", path: "/blog" },
        { label: "Liên hệ", path: "/contact" },
    ];

    return (
        <>
            {links.map((link, index) => (
                <li className="list-inline-item" key={index}>
                    <Link href={link.path}>{link.label}</Link>
                </li>
            ))}
        </>
    );
};

export default Navigation;
