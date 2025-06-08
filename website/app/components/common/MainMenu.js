"use client";
//import menuItems from "@/data/menuItems";
// import { isParentActive } from "@/utils/isMenuActive";
import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CategoryResponseTypeEnum } from "@/src/stores/categories"; // sửa path theo dự án bạn
const MainMenu = observer(() => {
  const { categoryObservable } = useStore();
  const pathname = usePathname();
  // const path = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      await categoryObservable.getListOrder({ responseType: "Tree" });
    };
    console.log(categoryObservable?.data?.categories);
    fetchCategories();
  }, []);
  const router = useRouter();
  const staticItems = [
    { id: "s1", name: "GIỚI THIỆU", href: "/about-us" },
    { id: "s2", name: "KHUYẾN MÃI", href: "/khuyen-mai" },
    { id: "s3", name: "CỬA HÀNG", href: "/cua-hang" },
    { id: "s4", name: "TIN TỨC", href: "/blog-list" },

    { id: "s6", name: "LIÊN HỆ", href: "/lien-he" },
  ];

  return (
    //       {menuItems.map((menuItem, index) => (
    //         <li className="dropitem" key={index}>
    //           <a
    //             className={isParentActive(menuItem.subMenu, path) ? "active" : ""}
    //             href={menuItem.path}
    //           >
    //             <span className="title">{menuItem.label}</span>
    //             {menuItem.subMenu?.length > 0 && <span className="arrow" />}
    //           </a>
    //           <ul className="sub-menu">
    //             {menuItem.subMenu.map((subItem, subIndex) => (
    //               <li key={subIndex} className="dropitem">
    //                 {subItem.subMenu ? (
    //                   <>
    //                     <a
    //                       className={
    //                         isParentActive(subItem.subMenu, path) ? "active" : ""
    //                       }
    //                       href={path}
    //                     >
    //                       {subItem.label}
    //                     </a>
    //                     <span className="arrow"></span>
    //                     <ul className="sub-menu">
    //                       {subItem.subMenu.map((nestedSubItem, nestedSubIndex) => (
    //                         <li key={nestedSubIndex}>
    //                           <Link
    //                             className={
    //                               path === nestedSubItem.path ? "active" : ""
    //                             }
    //                             href={nestedSubItem.path}
    //                           >
    //                             {nestedSubItem.label}
    //                           </Link>
    //                         </li>
    //                       ))}
    //                     </ul>
    //                   </>
    //                 ) : (
    //                   <Link
    //                     href={subItem.path}
    //                     className={path === subItem.path ? "active" : ""}
    //                   >
    //                     {subItem.label}
    //                   </Link>
    //                 )}
    //               </li>
    //             ))}
    //           </ul>
    //         </li>
    //       ))}
    //       {/* Menu bên phải */}

    <div className="">
      {categoryObservable?.data?.categories?.data?.map((parent) => {
        console.log(parent);
        const isActive = pathname === "/" || pathname === "/home-motorbike";
        const redirectedSlug =
          parent.slug === "xe-may-dien" ? "home-motorbike" : "/";

        return (
          <div key={parent.id} className="relative group inline-block">
            <button
              onClick={() => router.push(`/${redirectedSlug}`)}
              className={`relative px-3 py-2 mb-2 text-black rounded flex items-center space-x-2 
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400  uppercase
                after:w-0 group-hover:after:w-full after:transition-all after:duration-500 after:ease-in-out  ${
                  isActive
                    ? "text-white hover:text-yellow-400 hover:after:w-full"
                    : "text-black "
                }`}
            >
              {parent.name}
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded shadow-md z-10 min-w-[150px]">
              {parent.children.map((child) => {
                // Chuyển đổi slug nếu là 'xe-may-dien'
                // const redirectedSlug =
                //   child.slug === "xe-may-dien" ? "home-motorbike" : "/"
                const redirectedSlug =
                  parent.slug === "xe-may-dien"
                    ? "listing-v1?type=motorbike"
                    : "listing-v1?type=car";

                return (
                  <div key={child.id} className="relative group/submenu">
                    <Link
                      href={`/${redirectedSlug}&&categoryID=${child.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer rounded "
                    >
                      {child.name}
                    </Link>

                    {child?.children.length > 0 && (
                      <div className="absolute left-full top-0 hidden group-hover/submenu:block bg-white border rounded shadow-md min-w-[150px]">
                        {child.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/${redirectedSlug}&&categoryID=${sub.id}`}
                            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {staticItems.map((item) => {
        const isActive = pathname === "/" || pathname === "/home-motorbike";
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`relative px-3 py-2 mb-2 font-medium 
        after:content-[''] after:absolute after:left-0 after:bottom-0 
        after:h-[2px] after:bg-yellow-400 after:w-0 
        after:transition-all after:duration-300 after:ease-in-out
        hover:after:w-full
        ${isActive ? "text-white" : "text-black"}
      `}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
});

export default MainMenu;
// const data = [
//     {
//       id: "1",
//       slug: "xe-o-to",
//       name: "XE Ô TÔ",
//       children: [
//         {
//           id: "2",
//           slug: "sedan",
//           name: "Sedan",
//           children: [
//             { id: "5", slug: "toyota-camry", name: "Toyota Camry" },
//             { id: "6", slug: "honda-accord", name: "Honda Accord" },
//             {
//               id: "7",
//               slug: "mercedes-benz-c-class",
//               name: "Mercedes-Benz C-Class",
//             },
//           ],
//         },
//         {
//           id: "3",
//           slug: "suv",
//           name: "SUV",
//           children: [
//             { id: "8", slug: "toyota-rav4", name: "Toyota RAV4" },
//             { id: "9", slug: "bmw-x5", name: "BMW X5" },
//             {
//               id: "10",
//               slug: "tesla-model-x",
//               name: "Tesla Model X",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "2",
//       slug: "xe-may-dien",
//       name: "XE MÁY ĐIỆN",
//       children: [
//         {
//           id: "11",
//           slug: "sedan-dien",
//           name: "Sedan",
//           children: [
//             // { id: "12", slug: "vinfast-e34", name: "VinFast VF e34" },
//             // { id: "13", slug: "hyundai-ioniq", name: "Hyundai Ioniq 5" },
//           ],
//         },
//         {
//           id: "14",
//           slug: "suv-dien",
//           name: "SUV",
//           children: [
//             {
//               id: "15",
//               slug: "tesla-model-y",
//               name: "Tesla Model Y",
//             },
//             { id: "16", slug: "vinfast-vf8", name: "VinFast VF8" },
//           ],
//         },
//       ],
//     },
//   ];
