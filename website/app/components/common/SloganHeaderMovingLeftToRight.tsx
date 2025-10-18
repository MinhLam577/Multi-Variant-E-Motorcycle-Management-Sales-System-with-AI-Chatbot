import { cn } from "@/src/lib/utils";
import React from "react";

interface IMovingSloganLeftToRight extends React.ComponentProps<"div"> {
    description?: string;
}

const MovingSloganLeftToRight = ({
    description,
    className,
}: IMovingSloganLeftToRight) => {
    return (
        <p className={cn("slogan-header", className)}>
            <span className="animate-scrollTextStart">{description}</span>
            <span className="animate-scrollTextEnd">{description}</span>
        </p>
    );
};

export default MovingSloganLeftToRight;
