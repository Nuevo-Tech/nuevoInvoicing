import {
    StyleSheet,
} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    viewer: {
        paddingTop: 32,
        width: "100%",
        height: "80vh",
        border: "none",
    },
    page: {
        padding: 20,
        fontSize: 10,
        color: "#333",
        backgroundColor: "#f9f9f9", // Light background for a polished look
        fontFamily: "Helvetica",
    },
    headerSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        // alignItems: "center",
        // marginBottom: 20,
    },
    companyInfo: {
        flex: 1,
        marginTop: "40px",
        alignItems: "center", // center logo + text
        maxWidth: 150,        // cap width so text wraps
    },

    logo: {
        width: 60,
        height: 60,
        marginBottom: 4,
    },

    companyName: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        flexWrap: "wrap",
        fontFamily: "Helvetica-Bold",
    },
    qrCode: {
        width: 140,
        height: 140,
        marginTop: 4,
        marginLeft: 60,
    },


    infoTable: {
        marginTop: 10,
        border: "1px solid #000",
    },


    row: {flexDirection: "row",},
    row1: {flexDirection: "row", borderTopWidth: 1,},
    cell: {
        flex: 1,
        borderStyle: "solid",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        padding: 4,
        fontSize: 10,
    },

    leftCell: {borderLeftWidth: 1,},
    rightCell: {borderRightWidth: 1,},
    cellArabic: { fontFamily: "Amiri", textAlign: "right", padding: 1},
    partyDetails: {flexDirection: "row", marginTop: 5,},
    partyBox: {flex: 1, padding: 1},
    partyTitle: {
        fontWeight: "bold",
        fontFamily: "Amiri-Bold",
        textAlign: "center",
        borderBottom: "1px solid black",
        fontSize: 12,
        padding: 1,
        borderTopWidth: 1,
        bordrLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    partyText: {fontSize: 10, marginBottom: 2, fontFamily: "Amiri"},

    bolded: {fontFamily: "Helvetica-Bold"},

    headerDetails: {
        textAlign: "right",
    },
    headerText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    inoviceTextNumberContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    inoviceText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
    inoviceId: {
        fontSize: 10,
        color: "#555",
    },
    inoviceForFromContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    inoviceForFromTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
    },
    inoviceForFromText: {
        fontFamily: "Amiri",
        fontSize: 10,
        color: "#555",
        marginBottom: 2,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
    },
    table: {
        marginTop: 20,
        border: "1px solid #000",
        borderRadius: 3,
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#b9b9b9",
        paddingVertical: 5,
        // borderBottom: "1px solid #ddd",
    },
    tableHeaderItem: {
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        padding: 5,
        flex: 1,
    },
    tableRow: {
        flexDirection: "row",
        // borderBottom: "1px solid #ddd",
    },
    tableCol: {
        fontSize: 10,
        textAlign: "center",
        padding: 5,
        flex: 1,
    },
    alternateRow: {
        backgroundColor: "#d9d9d9",
    },
    signatureTotalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    signatureContainer: {
        flex: 1,
    },
    totalContainer: {
        flex: 1,
        textAlign: "right",
    },
    signatureText: {
        fontSize: 10,
        color: "#333",
        marginBottom: 5,
    },
    totalText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    footer: {
        borderTop: "1px solid #ddd",
        marginTop: 30,
        paddingTop: 10,
        textAlign: "center",
    },
    footerText: {
        fontSize: 10,
        color: "#777",
    },
});
