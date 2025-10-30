"use client";
import { useStore } from "@/context/store.context";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

const SearchWidget = () => {
    const store = useStore();
    const blogStore = store.blogsObservable;
    const debounceInputChange: (value: string) => void = useCallback(
        debounce((value: string) => {
            blogStore.setGlobalFilter({
                ...blogStore.globalFilter,
                search: value,
            });
        }, 400), // Adjust the debounce time as needed
        []
    );

    return (
        <div className="blog_search_widget">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Keyword"
                    aria-label="Recipient's username"
                    onChange={(e) => {
                        debounceInputChange(e.target.value);
                    }}
                />
            </div>
        </div>
    );
};

export default observer(SearchWidget);
