import Verify from "@/app/components/pages/verify/Verify";
import React from "react";
export default function VerifyPage({ params }) {
    const { id } = params;
    return (
        <>
            <Verify id={id} />;
        </>
    );
}
