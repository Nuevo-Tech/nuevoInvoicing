import { Invoice } from "@/types"; // adjust import
import React from "react";

interface JsonModalLayoutProps {
    record: Invoice;
}

const JsonModalLayout: React.FC<JsonModalLayoutProps> = ({ record }) => {
    let prettyJson = "";

    try {
        // If zatca_response is already an object, just stringify directly
        prettyJson = JSON.stringify(record.zatca_response, null, 2);
    } catch (error) {
        prettyJson = "Invalid JSON";
    }

    return (
        <pre
            style={{
                maxHeight: "70vh",
                overflowY: "auto",
                // backgroundColor: "#f5f5f5",
                padding: 16,
                borderRadius: 4,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
            }}
        >
            {prettyJson}
        </pre>
    );
};

export default JsonModalLayout;
