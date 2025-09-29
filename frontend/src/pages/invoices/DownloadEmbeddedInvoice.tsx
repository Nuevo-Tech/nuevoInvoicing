import React from "react";

export const DownloadEmbeddedInvoice: React.FC<{ pdfBlob: Blob; xmlBlob: Blob }> = ({ pdfBlob, xmlBlob }) => {
    const handleDownload = async () => {
        const formData = new FormData();
        formData.append("pdf", pdfBlob, "invoice.pdf");
        formData.append("xml", xmlBlob, "invoice.xml");

        const res = await fetch("http://localhost:3000/api/pdf/embed-xml", {
            method: "POST",
            body: formData,
        });

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice-embedded.pdf";
        a.click();
    };

    return (
        <button onClick={handleDownload}>
            Download ZATCA Compliant Invoice
        </button>
    );
};
