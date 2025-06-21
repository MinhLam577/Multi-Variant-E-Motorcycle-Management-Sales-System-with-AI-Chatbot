import { Button, Col, Form, FormListFieldData, Input, Row, Select } from "antd";
import { SelectType } from "./ModalCreateProduct/ModalCreateProduct";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib";
import { useStore } from "src/stores";
import debounce from "lodash.debounce";

const DEFAULT_MAX_VALUES_EACH_ROW = 1;

interface IFormListRowProps {
    rowField: FormListFieldData;
    removeRow: (index: number | number[]) => void;
    fieldValue: string;
    initialOptions: SelectType[];
    formItemLabel?: string;
    placeholderSelect?: string;
    maxFormListInputValue?: number;
    showAddValue?: boolean;
    isSelect?: boolean;
}

interface IFormListSelectOrInputProps {
    form: FormInstance;
    formListName: string | number | (string | number)[];
    fieldValue: string;
    initialOptions?: SelectType[];
    formItemLabel: string;
    placeholderSelect: string;
    renderComponent?: React.ComponentType<any>;
    maxFormListInputValue?: number;
    showAddValue?: boolean;
    isSelect?: boolean;
    [key: string]: any;
}

interface IFormListValueColProps {
    rowField: FormListFieldData;
    fieldValue: string;
    maxFormListInputValue: number;
    formItemLabel?: string;
    showAddValue?: boolean;
}

interface IFormListValueColRenderProps {
    rowField: FormListFieldData;
    fieldValue: string;
    formListName?: string | number | (string | number)[];
    formItemName?: string;
    callback?: (...args: any[]) => void;
    component?: React.ComponentType<any>;
    showAddValue?: boolean;
}

const FormListSelectOrInput: React.FC<IFormListSelectOrInputProps> = ({
    form,
    formListName,
    fieldValue,
    initialOptions,
    formItemLabel,
    placeholderSelect,
    renderComponent,
    maxFormListInputValue = DEFAULT_MAX_VALUES_EACH_ROW,
    showAddValue,
    isSelect,
    ...rest
}) => {
    const store = useStore();
    // Hàm thêm giá trị thông số kỹ thuật vào ref
    const addSpecValueRefs = useRef<Map<number, (value?: any) => void>>(
        new Map()
    );
    // Callback để cật nhật lại hàm thêm giá trị thông số kỹ thuật vào ref
    const setAddSpecValueRef = useCallback(
        (fieldName: number, addValue: (value?: any) => void) => {
            addSpecValueRefs.current.set(fieldName, addValue);
        },
        []
    );
    const handleAddFormListRow = useCallback(
        (
            add: (value?: any) => void,
            initialOptions: SelectType[] = [],
            fieldValue: string,
            formItemLabel: string,
            isSelect: boolean = true
        ) => {
            if (!isSelect) {
                add({
                    name: "",
                    values: [
                        {
                            value: "",
                        },
                    ],
                });
                return;
            }
            const formFieldValues = form.getFieldValue(fieldValue) || [];
            const selectedNames = formFieldValues
                .map((item: { name: string }) => item?.name)
                .filter((name: string) => name);
            const availableOptions = initialOptions.filter(
                (option) => !selectedNames.includes(option.value)
            );
            const defaultName = availableOptions[0]?.value || "";
            if (defaultName === "") {
                store.setStatusMessage(
                    400,
                    `Đã đạt giới hạn ${formItemLabel} cho phép`,
                    "",
                    false
                );
                return;
            }
            add({
                name: defaultName,
                values: [
                    {
                        value: "",
                    },
                ],
            });
        },
        [form]
    );
    // Hàm thêm giá trị thông số kỹ thuật
    const handleAddFormListValue = useCallback(
        (
            fieldName: number,
            fieldValue: string,
            maxFormListInputValue: number = DEFAULT_MAX_VALUES_EACH_ROW,
            formItemLabel?: string
        ) => {
            const formFieldValues = form.getFieldValue(fieldValue) || [];
            const currentValues = formFieldValues[fieldName]?.values || [];
            if (currentValues.length >= maxFormListInputValue) {
                store.setStatusMessage(
                    400,
                    `Chỉ nhập tối đa ${maxFormListInputValue} giá trị cho mỗi ${formItemLabel || fieldValue}`,
                    "",
                    false
                );
                return;
            }
            addSpecValueRefs.current.get(fieldName)?.({ value: "" });
        },
        [form]
    );
    const getAvailableSpecSelectOptions = (
        currentFieldName: number,
        fieldValueName: string,
        initialOptions: SelectType[]
    ) => {
        const fieldValues = form.getFieldValue(fieldValueName) || [];
        const selectedNames = fieldValues
            .map((item: { name: string }, index: number) => ({
                name: item?.name,
                index,
            }))
            .filter(
                (item: { name: string; index: number }) =>
                    item.name && item.index !== currentFieldName
            )
            .map((item: { name: string }) => item.name);
        return initialOptions.filter(
            (option) => !selectedNames.includes(option.value)
        );
    };
    // Hàm render ra form list input
    const ValueColRender: React.FC<IFormListValueColRenderProps> = ({
        callback,
        formListName,
        formItemName,
        rowField,
        component,
        fieldValue,
        showAddValue,
    }) => {
        const [isDuplicateCleared, setIsDuplicateCleared] = useState(false);
        const debouncedResetVariantValueFields: (
            fieldPath: (string | number)[]
        ) => void = useCallback(
            debounce((fieldPath: (string | number)[]) => {
                form.setFields([
                    {
                        name: fieldPath,
                        value: "",
                        errors: [],
                    },
                ]);
                if (rest?.setFormValue) {
                    rest.setFormValue();
                }
                setIsDuplicateCleared(true);
            }, 500),
            [form]
        );

        const getExistingValues = (valueFieldName: number) => {
            const rootFieldPathFormItem = [fieldValue, formListName].flat();
            const existingValues =
                form.getFieldValue(rootFieldPathFormItem) || [];
            return (
                existingValues
                    .map((item: { value: string }) => item.value.trim())
                    .filter((_, index: number) => index !== valueFieldName) ||
                []
            );
        };
        return (
            <Form.List name={formListName}>
                {(valueFields, { add: addValue, remove: removeValue }) => {
                    if (callback && rowField && showAddValue) {
                        callback(rowField.name, addValue);
                    }
                    return (
                        <div className="flex flex-col gap-4 w-full">
                            {valueFields &&
                                Array.isArray(valueFields) &&
                                valueFields.map((valueField) => {
                                    const fieldPathFormItem = [
                                        valueField.name,
                                        formItemName || "value",
                                    ];
                                    const rootFieldPathFormItem = [
                                        fieldValue,
                                        formListName,
                                    ].flat();
                                    return (
                                        <div
                                            key={valueField.key}
                                            className="flex items-start justify-between gap-1 w-full"
                                        >
                                            <Form.Item
                                                name={fieldPathFormItem}
                                                rules={[
                                                    {
                                                        required:
                                                            !isDuplicateCleared,
                                                        message:
                                                            "Vui lòng nhập giá trị thuộc tính",
                                                    },
                                                    {
                                                        validator: (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (!value) {
                                                                return Promise.resolve();
                                                            }
                                                            const existingValues =
                                                                getExistingValues(
                                                                    valueField.name
                                                                );
                                                            if (
                                                                existingValues.includes(
                                                                    value.trim()
                                                                )
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        "Giá trị đã tồn tại"
                                                                    )
                                                                );
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                                className="w-full mb-0"
                                            >
                                                <Input
                                                    placeholder="Nhập giá trị"
                                                    className="w-full p-[0.625rem] h-10"
                                                    autoComplete="off"
                                                    disabled={rest?.isUpdate}
                                                    onBlur={(e) => {
                                                        const value =
                                                            e.target.value.trim();
                                                        const existingValues =
                                                            getExistingValues(
                                                                valueField.name
                                                            );
                                                        const rootFieldPathFormValue =
                                                            [
                                                                ...rootFieldPathFormItem,
                                                                valueField.name,
                                                                formItemName ||
                                                                    "value",
                                                            ].flat();
                                                        if (
                                                            !existingValues.includes(
                                                                value
                                                            )
                                                        ) {
                                                            if (
                                                                rest?.setFormValue
                                                            ) {
                                                                rest.setFormValue();
                                                            }
                                                            setIsDuplicateCleared(
                                                                false
                                                            );
                                                        } else {
                                                            debouncedResetVariantValueFields(
                                                                rootFieldPathFormValue
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Form.Item>

                                            {component &&
                                                React.createElement(component, {
                                                    onClick: () => {
                                                        removeValue(
                                                            valueField.name
                                                        );
                                                        if (
                                                            rest?.setFormValue
                                                        ) {
                                                            rest.setFormValue();
                                                        }
                                                    },
                                                    style: {
                                                        visibility:
                                                            valueFields.length >
                                                            1
                                                                ? "visible"
                                                                : "hidden",
                                                    },
                                                })}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                }}
            </Form.List>
        );
    };
    const ValueCol: React.FC<IFormListValueColProps> = ({
        rowField,
        fieldValue,
        maxFormListInputValue,
        formItemLabel,
        showAddValue = true,
    }) => {
        return (
            <Col xs={24} md={13} lg={13} xl={13}>
                <div className="flex flex-col items-center justify-between w-full relative">
                    {showAddValue && !rest.isUpdate && (
                        <Button
                            type="primary"
                            shape="circle"
                            size="small"
                            onClick={() =>
                                handleAddFormListValue(
                                    rowField.name,
                                    fieldValue,
                                    maxFormListInputValue,
                                    formItemLabel
                                )
                            }
                            className="absolute -top-1 left-14 border-none outline-none text-lg cursor-pointer flex items-center justify-center z-50"
                        >
                            <PlusOutlined className="text-[var(--primary-color)]" />
                        </Button>
                    )}
                    <Form.Item label="Giá trị" className="w-full ">
                        <ValueColRender
                            formListName={[rowField.name, "values"]}
                            formItemName={"value"}
                            callback={setAddSpecValueRef}
                            rowField={rowField as FormListFieldData}
                            component={({ onClick, style }) =>
                                !rest.isUpdate && (
                                    <button
                                        className="flex items-center justify-center text-[black] w-10 h-10 border-none outline-none cursor-pointer bg-transparent text-lg"
                                        onClick={onClick}
                                        style={style}
                                    >
                                        <CloseOutlined />
                                    </button>
                                )
                            }
                            fieldValue={fieldValue}
                            showAddValue={showAddValue}
                        />
                    </Form.Item>
                </div>
            </Col>
        );
    };
    const SelectCol: React.FC<IFormListRowProps> = ({
        rowField,
        removeRow,
        formItemLabel,
        placeholderSelect,
        fieldValue,
        initialOptions = [],
        isSelect = true,
    }) => {
        const availableOptions = useMemo(
            () =>
                getAvailableSpecSelectOptions(
                    rowField.name,
                    fieldValue,
                    initialOptions
                ),
            [form.getFieldValue(fieldValue), rowField.name]
        );
        return (
            <Col xs={24} md={10} lg={10} xl={10}>
                <div className="flex items-center justify-between gap-4 w-full">
                    <Form.Item
                        label={formItemLabel || "Default title"}
                        name={[rowField.name, "name"]}
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá trị",
                            },
                        ]}
                    >
                        {isSelect ? (
                            <Select
                                options={availableOptions || []}
                                showSearch
                                placeholder={
                                    placeholderSelect || "Chọn dữ liệu"
                                }
                                className="h-10"
                                disabled={rest?.isUpdate}
                            />
                        ) : (
                            <Input
                                placeholder="Nhập thông số"
                                className="w-full h-10"
                                autoComplete="off"
                            />
                        )}
                    </Form.Item>
                    {!rest.isUpdate && (
                        <button
                            className="flex items-center justify-center text-[red] w-10 h-10 border-none outline-none hover:bg-[rgb(255,0,0,0.2)] cursor-pointer bg-transparent text-lg"
                            onClick={() => {
                                removeRow(rowField.name);
                                if (rest?.setFormValue) {
                                    rest.setFormValue();
                                }
                            }}
                        >
                            <DeleteOutlined />
                        </button>
                    )}
                </div>
            </Col>
        );
    };

    const FormListRow: React.FC<IFormListRowProps> = ({
        rowField,
        removeRow,
        fieldValue,
        initialOptions,
        formItemLabel,
        placeholderSelect,
        maxFormListInputValue,
        showAddValue,
        isSelect,
    }) => {
        return (
            <div
                className="py-4"
                style={{
                    borderBottom: "1px solid #d9d9d9",
                }}
            >
                <Row gutter={24} justify="space-between">
                    <SelectCol
                        rowField={rowField}
                        removeRow={removeRow}
                        formItemLabel={formItemLabel}
                        placeholderSelect={placeholderSelect}
                        fieldValue={fieldValue}
                        initialOptions={initialOptions}
                        isSelect={isSelect}
                    />

                    <ValueCol
                        rowField={rowField as FormListFieldData}
                        fieldValue={fieldValue}
                        maxFormListInputValue={maxFormListInputValue}
                        formItemLabel={formItemLabel}
                        showAddValue={showAddValue}
                    />
                </Row>
            </div>
        );
    };
    return (
        <Form.List name={formListName}>
            {(rowFields, { add: addRow, remove: removeRow }) => (
                <div className="flex flex-col">
                    {rowFields.map((rowField) => (
                        <FormListRow
                            key={rowField.key}
                            rowField={rowField}
                            removeRow={removeRow}
                            fieldValue={fieldValue}
                            initialOptions={initialOptions}
                            formItemLabel={formItemLabel}
                            placeholderSelect={placeholderSelect}
                            maxFormListInputValue={maxFormListInputValue}
                            showAddValue={showAddValue}
                            isSelect={isSelect}
                        />
                    ))}
                    {renderComponent &&
                        React.createElement(renderComponent, {
                            onClick: () =>
                                handleAddFormListRow(
                                    addRow,
                                    initialOptions,
                                    fieldValue,
                                    formItemLabel,
                                    isSelect
                                ),
                        })}
                </div>
            )}
        </Form.List>
    );
};

export default FormListSelectOrInput;
