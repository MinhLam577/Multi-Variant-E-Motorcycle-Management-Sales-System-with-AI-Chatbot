import React, { useEffect, useState } from "react";

// Kiểu dữ liệu của từng lựa chọn trong một nhóm
type OptionValue = [string, string[]];

// Nhóm thuộc tính (VD: màu sắc, kích thước)
interface OptionGroup {
    name: string;
    values: OptionValue[];
}

// Props truyền vào component
interface Props {
    optionValues?: OptionGroup[]; // Dữ liệu các nhóm thuộc tính
    onSelectChange?: (payload: { option_value_ids: string[] }[]) => void; // Hàm callback khi chọn đủ
}

const OptionSelector: React.FC<Props> = ({
    optionValues = [], // Mặc định là mảng rỗng nếu không có
    onSelectChange,
}) => {
    // Mảng lưu index lựa chọn của từng nhóm (null nếu chưa chọn)
    const [selectedIndexes, setSelectedIndexes] = useState<(number | null)[]>(
        []
    );

    // Khi optionValues thay đổi (từ props) → reset mảng selectedIndexes
    useEffect(() => {
        if (optionValues?.length) {
            setSelectedIndexes(optionValues.map(() => null)); // Mỗi nhóm khởi tạo là null
        }
    }, [optionValues]);

    // Xử lý khi người dùng chọn / bỏ chọn 1 option
    const handleSelect = (groupIdx: number, valueIdx: number) => {
        const updated = [...selectedIndexes];

        // Nếu đã chọn rồi và bấm lại → bỏ chọn
        if (updated[groupIdx] === valueIdx) {
            updated[groupIdx] = null;
        } else {
            updated[groupIdx] = valueIdx;
        }

        setSelectedIndexes(updated); // Cập nhật state

        // Kiểm tra nếu đã chọn đầy đủ tất cả các nhóm
        const allSelected = updated.every((idx) => idx !== null);

        // Nếu đầy đủ thì format dữ liệu và gọi callback
        if (allSelected && onSelectChange) {
            const formattedPayload = optionValues.map((group, idx) => {
                const selectedIdx = updated[idx]!; // Dấu ! để chắc chắn không null
                const ids = group.values[selectedIdx][1]; // Lấy mảng id
                return { option_value_ids: ids };
            });
            onSelectChange(formattedPayload);
        }
    };

    return (
        <div className="space-y-6">
            {optionValues?.map((group, groupIdx) => (
                <div key={groupIdx}>
                    <h3 className="text-base font-semibold mb-2 uppercase">
                        {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {group.values.map(([label], valueIdx) => {
                            const isSelected =
                                selectedIndexes[groupIdx] === valueIdx; // Kiểm tra có đang chọn không

                            return (
                                <button
                                    key={valueIdx}
                                    onClick={() =>
                                        handleSelect(groupIdx, valueIdx)
                                    }
                                    className={`px-4 py-2 border rounded ${
                                        isSelected
                                            ? "bg-black text-white"
                                            : "bg-white text-black"
                                    } hover:shadow transition`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OptionSelector;
