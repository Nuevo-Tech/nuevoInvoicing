// generatePdfBlob.ts
import { pdf, Document, Page } from "@react-pdf/renderer";
import { PdfLayout } from "../pdf/pdfLayout";
import { Invoice } from "../../types";

export async function generatePdfBlob(record: Invoice): Promise<Blob> {
    // Use PdfLayout but without PDFViewer
    const doc = (
        <Document>
            <PdfLayout record={record} />
        </Document>
    );

    const asPdf = pdf();
    asPdf.updateContainer(doc);

    const blob = await asPdf.toBlob();
    return blob;
}
