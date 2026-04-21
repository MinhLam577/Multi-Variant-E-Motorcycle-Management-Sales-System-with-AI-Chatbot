import { Breadcrumb } from "antd";
import { cn } from "@/src/lib/utils"; 

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  bgWrapper?: string;
  className?: string;        
  separator?: React.ReactNode;
}

const BreadCrumb = ({
  items,
  className = "",
  bgWrapper= "bg-[#f9f9f9]",
  separator = ">",
}: BreadcrumbProps) => {
  return (
    <div className={bgWrapper}>
      <div className="container">
        <div className="row">
          <div className={cn("breadcrumb_content style2 my-4", className)}>
            <Breadcrumb
              separator={separator}
              className="text-base"
              items={items.map((item) => ({
                title: item.href ? (
                  <a 
                    href={item.href}
                    className={cn(
                      "!text-black" 
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={cn("font-semibold")}> 
                    {item.label}
                  </span>
                ),
              }
            ))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;