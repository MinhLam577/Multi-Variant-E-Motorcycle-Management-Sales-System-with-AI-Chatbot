import ModalChatBox from "@/app/components/AIChatBot/ModalChatBot/ModalChatBox";

const data = [
  {
    id: "1",
    slug: "xe-o-to",
    name: "Xe ô tô",
    children: [
      {
        id: "2",
        slug: "sedan",
        name: "Sedan",
        children: [
          { id: "5", slug: "toyota-camry", name: "Toyota Camry" },
          { id: "6", slug: "honda-accord", name: "Honda Accord" },
          {
            id: "7",
            slug: "mercedes-benz-c-class",
            name: "Mercedes-Benz C-Class",
          },
        ],
      },
      {
        id: "3",
        slug: "suv",
        name: "SUV",
        children: [
          { id: "8", slug: "toyota-rav4", name: "Toyota RAV4" },
          { id: "9", slug: "bmw-x5", name: "BMW X5" },
          { id: "10", slug: "tesla-model-x", name: "Tesla Model X" },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "xe-dien",
    name: "Xe điện",
    children: [
      {
        id: "11",
        slug: "sedan-dien",
        name: "Sedan",
        children: [
          // { id: "12", slug: "vinfast-e34", name: "VinFast VF e34" },
          // { id: "13", slug: "hyundai-ioniq", name: "Hyundai Ioniq 5" },
        ],
      },
      {
        id: "14",
        slug: "suv-dien",
        name: "SUV",
        children: [
          { id: "15", slug: "tesla-model-y", name: "Tesla Model Y" },
          { id: "16", slug: "vinfast-vf8", name: "VinFast VF8" },
        ],
      },
    ],
  },
];
const Chatbot = () => {
  return (
    <div className="flex space-x-4">
      <ModalChatBox />
    </div>
  );
};

export default Chatbot;
//  {data.map((parent) => (
//       <div key={parent.id} className="relative group inline-block">
//         <button className="px-3 py-2 mb-2 text-black rounded flex items-center space-x-2 border-b-2 border-transparent hover:border-yellow-400 transition-all duration-300">
//           {/* Nếu bạn không cần icon nữa, hãy xóa phần này */}

//           {parent.name}
//         </button>

//         <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded shadow-md z-10 min-w-[150px]">
//           {parent.children.map((child) => (
//             <div key={child.id} className="relative group/submenu">
//               <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 {child.name}
//               </div>

//               {child?.children.length > 0 && (
//                 <div className="absolute left-full top-0 hidden group-hover/submenu:block bg-white border rounded shadow-md min-w-[150px]">
//                   {child.children.map((sub) => (
//                     <div
//                       key={sub.id}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {sub.name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     ))}
