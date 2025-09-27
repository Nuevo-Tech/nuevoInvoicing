import {
    Document,
    Image,
    Page,
    StyleSheet,
    View,
    Text,
    PDFViewer,
} from "@react-pdf/renderer";

import {Invoice} from "../../types/index";
import QRCode from "qrcode";
import React from "react";
import {Font} from "@react-pdf/renderer";
import {styles} from "./stylesheet";

Font.register({
    family: "Amiri",
    src: "/fonts/Amiri-Regular.ttf", // path in your project
});

// Optional: register bold/italic if needed
Font.register({
    family: "Amiri-Bold",
    src: "/fonts/Amiri-Bold.ttf",
    fontWeight: "bold",
});

const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

type PdfProps = {
    record: Invoice | undefined;
};

export const PdfLayout: React.FC<PdfProps> = ({record}) => {
    const logoUrl = record?.account?.logo
        ? `${API_URL}${record?.account?.logo}`
        : undefined;

    const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (record?.zatca_qr_code) {
            QRCode.toDataURL(record.zatca_qr_code, {errorCorrectionLevel: "H"})
                .then(setQrCodeDataUrl)
                .catch(console.error);
        }
    }, [record?.zatca_qr_code]);

    return (
        <PDFViewer style={styles.viewer}>
            <Document>
                <Page style={styles.page} size="A3">
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.companyInfo}>
                            {record?.account?.logo && (
                                <Image src={record.account.logo} style={styles.logo}/>
                            )}
                            <Text style={styles.companyName}>{"SyncShire Enterprises"}</Text>
                        </View>

                        <View style={{flex: 2, justifyContent: "center"}}>
                            {qrCodeDataUrl && (
                                <Image src={qrCodeDataUrl} style={styles.qrCode}/>
                            )}
                        </View>


                        {/* Row 1 */}
                        <View style={{flex: 3}}>
                            <View style={[styles.row1, {justifyContent: "flex-end"}]}>
                                <Text style={[styles.cell, styles.leftCell, styles.bolded]}>Invoice Id</Text>
                                <Text style={styles.cell}>{record?.invoice_id}</Text>
                                <Text style={[styles.cell, styles.rightCell, styles.cellArabic]}>رقم الفاتورة</Text>
                            </View>


                            {[
                                {label: "Invoice Id", value: record?.invoice_id, arabic: "رقم الفاتورة"},
                                {label: "Invoice Name", value: record?.invoice_name, arabic: "رقم الفاتورة"},
                                {
                                    label: "Date & Time",
                                    value: record?.invoiceDate ? new Date(record.invoiceDate).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : "",
                                    arabic: "التاريخ والوقت"
                                },
                                {
                                    label: "Delivery Date",
                                    value: record?.deliveryDate ? new Date(record.deliveryDate).toLocaleDateString("en-GB") : "",
                                    arabic: "تاريخ التسليم"
                                },
                                {label: "Tax Category", value: record?.tax_category, arabic: "فئة الضريبة"},
                                {label: "Payment Means", value: record?.payment_means, arabic: "طريقة الدفع"}
                            ].map((row, index) => (
                                <View key={index} style={[styles.row,]}>
                                    <Text style={[styles.cell, styles.leftCell, styles.bolded]}>{row.label}</Text>
                                    <Text style={[styles.cell]}>{row.value}</Text>
                                    <Text style={[styles.cell, styles.rightCell, styles.cellArabic]}>{row.arabic}</Text>
                                </View>
                            ))}
                            {/* Add more rows here */}
                        </View>
                    </View>

                    {/* Seller Details */}
                    <View style={styles.partyDetails}>
                        {/* Seller Box */}
                        <View style={styles.partyBox}>
                            <Text style={styles.partyTitle}>Seller Details | بيانات المورد</Text>
                            {[
                                {label: "Name", value: record?.myOrgProfile?.partyLegalEntityRegistrationName, arabic: "الاسم"},
                                {label: "VAT Number", value: record?.myOrgProfile?.partyTaxSchemeCompanyID, arabic: "الرقم الضريبي"},
                                {label: "Building No.", value: record?.myOrgProfile?.buildingNumber, arabic: "رقم المبنى"},
                                {label: "Street Name", value: record?.myOrgProfile?.streetName, arabic: "اسم الشارع"},
                                {label: "City", value: record?.myOrgProfile?.cityName, arabic: "المدينة"},
                                {label: "City Subdivision", value: record?.myOrgProfile?.citySubdivisionName, arabic: "الحي"},
                                {label: "Postal Code", value: record?.myOrgProfile?.postalZone, arabic: "الرمز البريدي"},
                                {label: "Country", value: record?.myOrgProfile?.countryIdentificationCode, arabic: "رمز الدولة"},
                                {label: "Commercial Registration (CRN)", value: record?.myOrgProfile?.partyId, arabic: "نوع الهوية"},
                            ].map((row, i) => (
                                <View style={styles.row} key={i}>
                                    <Text style={[styles.cell, styles.leftCell, styles.bolded]}>{row.label}</Text>
                                    <Text style={[styles.cell, styles.cellArabic]}>{row.value}</Text>
                                    <Text style={[styles.cell, styles.rightCell, styles.cellArabic]}>{row.arabic}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Buyer Box */}
                        <View style={styles.partyBox}>
                            <Text style={styles.partyTitle}>Buyer Details | بيانات العميل</Text>
                            {[
                                {
                                    label: "Name",
                                    value: record?.client?.partyLegalEntityRegistrationName,
                                    arabic: "الاسم"
                                },
                                {label: "VAT Number", value: record?.client?.partyTaxSchemeCompanyID, arabic: "الرقم الضريبي"},
                                {label: "Building No.", value: record?.client?.buildingNumber, arabic: "رقم المبنى"},
                                {label: "Street Name", value: record?.client?.streetName, arabic: "اسم الشارع"},
                                {label: "City", value: record?.client?.cityName, arabic: "المدينة"},
                                {label: "City Subdivision", value: record?.client?.citySubdivisionName, arabic: "الحي"},
                                {label: "Postal Code", value: record?.client?.postalZone, arabic: "الرمز البريدي"},
                                {label: "Country", value: record?.client?.countryIdentificationCode, arabic: "رمز الدولة"},
                                {label: "Commercial Registration Number (CRN)", value: "", arabic: ""},
                            ].map((row, i) => (
                                <View style={styles.row} key={i}>
                                    <Text style={[styles.cell, styles.leftCell, styles.bolded]}>{row.label}</Text>
                                    <Text style={[styles.cell, styles.cellArabic]}>{row.value}</Text>
                                    <Text style={[styles.cell, styles.rightCell, styles.cellArabic]}>{row.arabic}</Text>
                                </View>
                            ))}
                        </View>
                    </View>


                    <View style={styles.divider}/>

                    {/*<View style={styles.inoviceForFromContainer}>*/}
                    {/*    <View>*/}
                    {/*        <Text style={styles.inoviceForFromTitle}>From:</Text>*/}
                    {/*        <View>*/}
                    {/*            <Text style={styles.inoviceForFromText}>*/}
                    {/*                {record?.account?.account_name}*/}
                    {/*            </Text>*/}
                    {/*            <Text style={styles.inoviceForFromText}>*/}
                    {/*                {record?.account?.address}, {record?.account?.country}*/}
                    {/*            </Text>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}

                    {/*<View>*/}
                    {/*    <Text style={styles.inoviceForFromTitle}>Inovice For:</Text>*/}
                    {/*    <View>*/}
                    {/*        <Text style={styles.inoviceForFromText}>*/}
                    {/*            {record?.client?.partyLegalEntityRegistrationName}*/}
                    {/*        </Text>*/}
                    {/*                /!* <Text style={styles.inoviceForFromText}>*/}
                    {/*  {record?.client?.first_name}*/}
                    {/*</Text>*/}
                    {/*<Text style={styles.inoviceForFromText}>*/}
                    {/*  {record?.client?.last_name}*/}
                    {/*</Text> *!/*/}
                    {/*                <Text style={styles.inoviceForFromText}>*/}
                    {/*                    {record?.client?.cityName}*/}
                    {/*                </Text>*/}
                    {/*            </View>*/}
                    {/*            <View>*/}
                    {/*                <Text*/}
                    {/*                    style={styles.inoviceForFromText}*/}
                    {/*                >{`Invoice ID: ${record?.id}`}</Text>*/}
                    {/*                /!*<Text*!/*/}
                    {/*                /!*  style={styles.inoviceForFromText}*!/*/}
                    {/*                /!*>{`Invoice Custom ID: ${record?.custom_id}`}</Text>*!/*/}
                    {/*                <Text*/}
                    {/*                    style={styles.inoviceForFromText}*/}
                    {/*                >{`Invoice Date: ${*/}
                    {/*                    record?.invoiceDate*/}
                    {/*                        ? new Date(record.invoiceDate).toLocaleDateString("en-GB", {*/}
                    {/*                            day: "2-digit",*/}
                    {/*                            month: "short",*/}
                    {/*                            year: "numeric",*/}
                    {/*                            hour: "2-digit",*/}
                    {/*                            minute: "2-digit",*/}
                    {/*                        })*/}
                    {/*                        : ""*/}
                    {/*                }`}</Text>*/}
                    {/*            </View>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderItem, {width: "20%"}]}>
                                Services/Product
                            </Text>
                            <Text style={[styles.tableHeaderItem, {width: "20%"}]}>
                                Quantity
                            </Text>
                            <Text style={[styles.tableHeaderItem, {width: "20%"}]}>
                                Price PerItem
                            </Text>
                            <Text style={[styles.tableHeaderItem, {width: "20%"}]}>
                                Discount
                            </Text>
                            <Text style={[styles.tableHeaderItem, {width: "20%"}]}>
                                Total
                            </Text>
                        </View>
                        {record?.services.map((item, index) => {
                            return (
                                <View
                                    key={item.name}
                                    style={[
                                        styles.tableRow,
                                        ...(index % 2 === 1 ? [styles.alternateRow] : []),
                                    ]}
                                >
                                    <Text style={[styles.tableCol, {width: "20%"}]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.tableCol, {width: "20%"}]}>
                                        {item?.unitPrice}
                                    </Text>
                                    <Text style={[styles.tableCol, {width: "20%"}]}>
                                        {item?.quantity}
                                    </Text>
                                    <Text style={[styles.tableCol, {width: "20%"}]}>
                                        {item?.item_discount_percentage}
                                    </Text>
                                    <Text style={[styles.tableCol, {width: "20%"}]}>
                                        {item?.totalPrice}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.signatureTotalContainer}>
                        <View style={styles.signatureContainer}>
                            <Text style={styles.signatureText}>
                                Signature: ________________
                            </Text>
                            <Text style={styles.signatureText}>
                                Date: {record?.invoiceDate.toString()}
                            </Text>
                        </View>

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>SUBTOTAL: {record?.subtotal}</Text>
                            <Text style={styles.totalText}>
                                Discount(%): {record?.discount_percentage}
                            </Text>
                            <Text style={styles.totalText}>Tax(%): {record?.tax_percentage}</Text>
                            <Text style={styles.totalText}>Total($): {record?.total}</Text>
                        </View>
                    </View>
                    <View>
                        {qrCodeDataUrl && (
                            <Image src={qrCodeDataUrl} style={{width: 100, height: 100}}/>
                        )}
                    </View>
                    <View style={styles.footer}>
                        {/* <Text style={styles.footerText}>{record?.account?.city}</Text> */}
                        <Text style={styles.footerText}>
                            {record?.account.address}, {record?.account.country}
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};