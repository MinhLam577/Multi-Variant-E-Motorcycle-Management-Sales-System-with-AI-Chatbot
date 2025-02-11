import Link from "next/link";

const Navigation = () => {
  const links = [
    { label: "Ô tô", path: "/" },
    { label: "Về chúng tôi", path: "/about-us" },
    { label: "Danh sách ", path: "/listing-v1" },
    { label: "Tin tức", path: "/blog" },
    { label: "Thông tin", path: "/user-profile" },
    { label: "Dịch vụ", path: "/service" },
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
