import { OpenMap } from "@/app/components/common/MainMenu/CategoryMenu/ParentMenuItem/RecursiveMenuItem";
import { useState } from "react";

export default function useOpenLevel() {
    const [openAtLevel, setOpenAtLevel] = useState<OpenMap>({});

    const setOpenForLevel = (level: number, id: string | null) => {
        setOpenAtLevel((prev) => {
            const next = { ...prev, [level]: id };

            // Đóng tất cả các level sâu hơn
            Object.keys(next).forEach((k) => {
                if (+k > level) delete next[k];
            });

            return next;
        });
    };

    const closeAll = () => setOpenAtLevel({});

    return { openAtLevel, setOpenForLevel, closeAll };
}
