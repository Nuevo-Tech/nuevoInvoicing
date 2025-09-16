import {NumberField, useForm, useSelect} from "@refinedev/antd";
import {
    DeleteOutlined,
    FilePdfOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Skeleton,
    Spin,
    Table, Tag,
    Typography,
} from "antd";
import {Edit} from "@refinedev/antd";
import {API_URL} from "@/utils/constants";
import {getRandomColorFromString} from "@/utils/get-random-color";
import type {Invoice, Service} from "@/types";
import {useStyles} from "./create.styled";
import {Fragment, useEffect, useState} from "react";
import dayjs from "dayjs";
import {useOne} from "@refinedev/core";

export const InvoicesPageEdit = () => {
    const {styles} = useStyles();

    const {
        formProps,
        query: queryResult,
        saveButtonProps,
    } = useForm<Invoice>({
        meta: {
            populate: ["client", "account.logo", "services"],
        },
    });

    const invoice = queryResult?.data?.data;

    const loading = queryResult?.isLoading;
    const logoUrl = invoice?.account?.logo
        ? `${API_URL}${invoice?.account?.logo}`
        : undefined;

    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        if (queryResult?.data?.data?.services) {
            setServices(queryResult?.data?.data?.services);
        }
    }, [queryResult]);

    const {selectProps: selectPropsClients} = useSelect({
        resource: "clients",
        optionLabel: "partyLegalEntityRegistrationName",
        optionValue: "_id",
    });

    const {selectProps: selectPropsAccounts} = useSelect({
        resource: "accounts",
        optionLabel: "account_name",
        optionValue: "_id",
    });

    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    const currencyOptions = [
        {value: "INR", label: "₹ INR"},
        {value: "USD", label: "$ USD"},
        {value: "EUR", label: "€ EUR"},
        {value: "GBP", label: "£ GBP"},
        {value: "JPY", label: "¥ JPY"},
        {value: "SAR", label: "﷼ SAR"},
    ];

    const statusOptions = [
        {value: "Draft", label: "Draft", color: "blue"},
        {value: "NotPaid", label: "NotPaid", color: "red"},
        {value: "Paid", label: "Paid", color: "green"},
        {value: "Refunded", label: "Refunded", color: "orange"},
    ];

    const defaultCurrencySymbol = "SAR ﷼";
    const defaultCurrency = "SAR";
    const defaultStatus = "Draft";

    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(
        defaultCurrencySymbol
    );

    const [selectedStatus, setSelectedStatus] = useState(defaultStatus);

    const handleCurrencyChange = (value: React.SetStateAction<string>) => {
        let symbol = "";

        switch (value) {
            case "INR":
                symbol = "₹";
                break;
            case "USD":
                symbol = "$";
                break;
            case "EUR":
                symbol = "€";
                break;
            case "GBP":
                symbol = "£";
                break;
            case "JPY":
                symbol = "¥";
                break;
            case "SAR":
                symbol = "SAR ﷼";
                break;
            default:
                symbol = defaultCurrencySymbol;
        }
        setSelectedCurrencySymbol(symbol);
        setSelectedCurrency(value);
    };

    const handleStatusChange = (value: React.SetStateAction<string>) => {
        let status = "";

        switch (value) {
            case "Draft":
                status = "Draft";
                break;
            case "NotPaid":
                status = "NotPaid";
                break;
            case "Paid":
                status = "Paid";
                break;
            case "Refunded":
                status = "Refunded";
                break;
            default:
                status = defaultStatus;
        }
        setSelectedStatus(status);
    };

    const defaultInvoiceType = "StandardInvoice";
    const [selectInvoiceType, setSelectedInvoiceType] = useState(defaultInvoiceType);
    const invoiceTypeOptions = [
        {value: "StandardInvoice", label: "Standard Invoice", color: "purple"},
        {value: "StandardInvoiceCreditNote", label: "Standard Credit Note", color: "cyan"},
        {value: "StandardInvoiceDebitNote", label: "Standard Debit Note", color: "magenta"},

        {value: "SimplifiedInvoice", label: "Simplified Invoice", color: "blue"},
        {value: "SimplifiedInvoiceCreditNote", label: "Simplified Credit Note", color: "green"},
        {value: "SimplifiedInvoiceDebitNote", label: "Simplified Debit Note", color: "orange"},
    ];

    const handleInvoiceTypeChange = (value: React.SetStateAction<string>) => {
        let invoiceType = "";

        switch (value) {
            case "Simplified Invoice":
                invoiceType = "SimplifiedInvoice";
                break;
            case "Simplified Invoice CreditNote":
                invoiceType = "SimplifiedInvoiceCreditNote";
                break;
            case "Simplified Invoice DebitNote":
                invoiceType = "SimplifiedInvoiceDebitNote";
                break;

            case "Standard Invoice":
                invoiceType = "StandardInvoice";
                break;
            case "Standard Invoice CreditNote":
                invoiceType = "StandardInvoiceCreditNote";
                break;
            case "Standard Invoice DebitNote":
                invoiceType = "StandardInvoiceDebitNote";
                break;

            default:
                invoiceType = defaultInvoiceType; // fallback
        }

        setSelectedInvoiceType(invoiceType);
    };


    const defaultTaxCategory = "S";
    const [selectTaxCategory, setSelectedTaxCategory] = useState(defaultTaxCategory);
    const taxCategoryOptions = [
        {value: "S", label: "Standard Rated Supply"},
        {value: "Z", label: "Zero Rated Supply"},
        {value: "E", label: "Exempt Supply"},
        {value: "O", label: "Out of Scope"},
    ];

    const handleTaxCategoryChange = (value: React.SetStateAction<string>) => {
        let taxCategory = "";
        switch (value) {
            case "S":
                taxCategory = "S";
                break;
            case "Z":
                taxCategory = "Z";
                break;
            case "E":
                taxCategory = "E";
                break;

            case "O":
                taxCategory = "O";
                break;

            default:
                taxCategory = defaultTaxCategory; // fallback
        }
        setSelectedTaxCategory(taxCategory);
    };


    const defaultPaymentMeans = "10";
    const [selectPaymentMeans, setSelectedPaymentMeans] = useState(defaultTaxCategory);
    const paymentMeansOptions = [
        {value: "10", label: "Cash", color: "green"},
        {value: "20", label: "Cheque", color: "purple"},
        {value: "30", label: "Credit Transfer (Bank Transfer)", color: "blue"},
        {value: "31", label: "Debit Transfer", color: "cyan"},
        {value: "42", label: "Payment to Bank Account", color: "volcano"},
        {value: "48", label: "Bank Card (POS/Credit/Debit)", color: "gold"},
        {value: "49", label: "Direct Debit", color: "magenta"},
        {value: "57", label: "Standing Order", color: "orange"},
        {value: "97", label: "Other (Not Defined)", color: "red"},
        {value: "ZZZ", label: "Mutually Defined", color: "geekblue"},
    ];

    const handlePaymentMeansChange = (value: React.SetStateAction<string>) => {
        let paymentMeans = "";

        switch (value) {
            case "10":
                paymentMeans = "10"; // Cash
                break;
            case "20":
                paymentMeans = "20"; // Cheque
                break;
            case "30":
                paymentMeans = "30"; // Credit Transfer
                break;
            case "31":
                paymentMeans = "31"; // Debit Transfer
                break;
            case "42":
                paymentMeans = "42"; // Payment to Bank Account
                break;
            case "48":
                paymentMeans = "48"; // Bank Card
                break;
            case "49":
                paymentMeans = "49"; // Direct Debit
                break;
            case "57":
                paymentMeans = "57"; // Standing Order
                break;
            case "97":
                paymentMeans = "97"; // Other
                break;
            case "ZZZ":
                paymentMeans = "ZZZ"; // Mutually Defined
                break;
            default:
                paymentMeans = defaultPaymentMeans; // fallback
        }

        setSelectedPaymentMeans(paymentMeans);
    };


    const [tax, setTax] = useState<number>(queryResult?.data?.data?.tax || 0);

    const subtotal = services.reduce(
        (acc, service) =>
            acc +
            (service.unitPrice * service.quantity * (100 - service.discount)) / 100,
        0
    );
    const total = subtotal + (subtotal * tax) / 100;

    const handleServiceNumbersChange = (
        index: number,
        key: "quantity" | "discount" | "unitPrice",
        value: number
    ) => {
        setServices((prev) => {
            const currentService = {...prev[index]};
            currentService[key] = value;
            currentService.totalPrice =
                currentService.unitPrice *
                currentService.quantity *
                ((100 - currentService.discount) / 100);

            return prev.map((item, i) => (i === index ? currentService : item));
        });
    };

    if (queryResult?.isLoading) return <Spin/>;

    const record = queryResult?.data?.data;
    return (
        <Edit
            title="Edit Invoice"
            saveButtonProps={saveButtonProps}
            contentProps={{
                styles: {
                    body: {
                        padding: 0,
                    },
                },
                style: {
                    background: "transparent",
                },
            }}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={async (values) => {
                    userId;

                    return formProps.onFinish?.({
                        ...values,
                        userId: userId,
                        services: services,
                        subtotal: subtotal,
                        total: total,
                        tax: tax,
                    });
                }}
            >
                <Card
                    bordered={false}
                    title={
                        <Typography.Text style={{fontWeight: 400}}>
                            {loading ? (
                                <Skeleton.Button style={{width: 100, height: 22}}/>
                            ) : (
                                `Invoice ID #${invoice?.id}`
                            )}
                        </Typography.Text>
                    }
                >

                    <Row gutter={16}>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Account"
                                name={["account", "_id"]}
                                rules={[{required: true}]}

                            >
                                <Select
                                    {...selectPropsAccounts}
                                    placeholder="Please select account"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Client"
                                name={["client", "_id"]}
                                rules={[{required: true}]}

                            >
                                <Select
                                    {...selectPropsClients}
                                    placeholder="Please select client"
                                />
                            </Form.Item>
                        </Col>


                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{required: true}]}

                            >
                                <Select
                                    placeholder="Select Status"
                                    onChange={handleStatusChange}
                                    options={statusOptions.map((opt) => ({
                                        value: opt.value,
                                        label: (
                                            <Tag color={opt.color} style={{marginRight: 0}}>
                                                {opt.label}
                                            </Tag>
                                        ),
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Invoice Date"
                                name="invoiceDate"
                                getValueProps={(value) => ({value: dayjs(value)})}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}

                            >
                                <DatePicker format="DD-MM-YYYY"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Invoice Type"
                                name="invoice_type"
                                rules={[{required: true}]}

                            >
                                <Select
                                    placeholder="Select Invoice Type"
                                    onChange={handleInvoiceTypeChange}
                                    options={invoiceTypeOptions.map((opt) => ({
                                        value: opt.value,
                                        label: (
                                            <Tag color={opt.color} style={{marginRight: 0}}>
                                                {opt.label}
                                            </Tag>
                                        ),
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Currency"
                                name="currency"
                                rules={[{required: true}]}

                            >
                                <Select
                                    placeholder="Select Currency"
                                    onChange={handleCurrencyChange}
                                    options={currencyOptions}
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Tax Category"
                                name="tax_category"
                                rules={[{required: true}]}

                            >
                                <Select
                                    placeholder="Select Tax Category"
                                    onChange={handleTaxCategoryChange}
                                    options={taxCategoryOptions}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Delivery Date"
                                name="deliveryDate"
                                getValueProps={(value) => ({value: dayjs(value)})}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker format="DD-MM-YYYY"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                label="Payment Means"
                                name="payment_means"
                                rules={[{required: true}]}

                            >
                                <Select
                                    placeholder="Select Payment Means"
                                    onChange={handlePaymentMeansChange}
                                    options={paymentMeansOptions.map((opt) => ({
                                        value: opt.value,
                                        label: (
                                            <Tag color={opt.color} style={{marginRight: 0}}>
                                                {opt.label}
                                            </Tag>
                                        ),
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Note"
                        name="note"
                        rules={[{required: true}]}
                    >
                        <Input.TextArea
                            placeholder="Enter notes here"
                            autoSize={{minRows: 2, maxRows: 6}}/>
                    </Form.Item>


                    <Divider style={{margin: 0}}/>
                    <div style={{padding: "32px"}}>
                        <Typography.Title
                            level={4}
                            style={{marginBottom: "32px", fontWeight: 400}}
                        >
                            Products / Services
                        </Typography.Title>
                        <div className={styles.serviceTableWrapper}>
                            <div className={styles.serviceTableContainer}>
                                <Row className={styles.serviceHeader}>
                                    <Col
                                        xs={{span: 7}}
                                        className={styles.serviceHeaderColumn}
                                    >
                                        Title
                                        <Divider
                                            type="vertical"
                                            className={styles.serviceHeaderDivider}
                                        />
                                    </Col>
                                    <Col
                                        xs={{span: 5}}
                                        className={styles.serviceHeaderColumn}
                                    >
                                        Unit Price
                                        <Divider
                                            type="vertical"
                                            className={styles.serviceHeaderDivider}
                                        />
                                    </Col>
                                    <Col
                                        xs={{span: 4}}
                                        className={styles.serviceHeaderColumn}
                                    >
                                        Quantity
                                        <Divider
                                            type="vertical"
                                            className={styles.serviceHeaderDivider}
                                        />
                                    </Col>
                                    <Col
                                        xs={{span: 4}}
                                        className={styles.serviceHeaderColumn}
                                    >
                                        Discount
                                        <Divider
                                            type="vertical"
                                            className={styles.serviceHeaderDivider}
                                        />
                                    </Col>
                                    <Col
                                        xs={{span: 3}}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                        }}
                                        className={styles.serviceHeaderColumn}
                                    >
                                        Total Price
                                    </Col>
                                    <Col xs={{span: 1}}> </Col>
                                </Row>


                                <Form.List name="services">
                                    {(fields, {add, remove}) => (
                                        <>
                                            <Row>
                                                {services.map((service, index) => {
                                                    return (
                                                        <Fragment key={index}>
                                                            <Col
                                                                xs={{span: 7}}
                                                                className={styles.serviceRowColumn}
                                                            >
                                                                <Input
                                                                    placeholder="Title"
                                                                    value={service.title}
                                                                    onChange={(e) => {
                                                                        setServices((prev) =>
                                                                            prev.map((item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                        ...item,
                                                                                        title: e.target.value
                                                                                    }
                                                                                    : item
                                                                            )
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xs={{span: 5}}
                                                                className={styles.serviceRowColumn}
                                                            >
                                                                <InputNumber
                                                                    addonBefore={selectedCurrencySymbol}
                                                                    style={{width: "100%"}}
                                                                    placeholder="Unit Price"
                                                                    min={0}
                                                                    value={service.unitPrice}
                                                                    onChange={(value) => {
                                                                        handleServiceNumbersChange(
                                                                            index,
                                                                            "unitPrice",
                                                                            value || 0
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xs={{span: 4}}
                                                                className={styles.serviceRowColumn}
                                                            >
                                                                <InputNumber
                                                                    style={{width: "100%"}}
                                                                    placeholder="Quantity"
                                                                    min={0}
                                                                    value={service.quantity}
                                                                    onChange={(value) => {
                                                                        handleServiceNumbersChange(
                                                                            index,
                                                                            "quantity",
                                                                            value || 0
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xs={{span: 4}}
                                                                className={styles.serviceRowColumn}
                                                            >
                                                                <InputNumber
                                                                    addonAfter="%"
                                                                    style={{width: "100%"}}
                                                                    placeholder="Discount"
                                                                    min={0}
                                                                    value={service.discount}
                                                                    onChange={(value) => {
                                                                        handleServiceNumbersChange(
                                                                            index,
                                                                            "discount",
                                                                            value || 0
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xs={{span: 3}}
                                                                className={styles.serviceRowColumn}
                                                                style={{
                                                                    justifyContent: "flex-end",
                                                                }}
                                                            >
                                                                <NumberField
                                                                    value={service.totalPrice}
                                                                    options={{
                                                                        style: "currency",
                                                                        currency: selectedCurrency,
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xs={{span: 1}}
                                                                className={styles.serviceRowColumn}
                                                                style={{
                                                                    paddingLeft: "0",
                                                                    justifyContent: "flex-end",
                                                                }}
                                                            >
                                                                <Button
                                                                    danger
                                                                    size="small"
                                                                    icon={<DeleteOutlined/>}
                                                                    onClick={() => {
                                                                        setServices((prev) =>
                                                                            prev.filter((_, i) => i !== index)
                                                                        );
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Fragment>
                                                    );
                                                })}
                                            </Row>
                                        </>
                                    )}
                                </Form.List>
                                <Divider
                                    style={{
                                        margin: "0",
                                    }}
                                />
                                <div style={{padding: "12px"}}>
                                    <Button
                                        icon={<PlusCircleOutlined/>}
                                        type="text"
                                        className={styles.addNewServiceItemButton}
                                        onClick={() => {
                                            setServices((prev) => [
                                                ...prev,
                                                {
                                                    title: "",
                                                    unitPrice: 0,
                                                    quantity: 0,
                                                    discount: 0,
                                                    totalPrice: 0,
                                                    description: "",
                                                },
                                            ]);
                                        }}
                                    >
                                        Add new item
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Flex
                            gap={16}
                            vertical
                            style={{
                                marginLeft: "auto",
                                marginTop: "24px",
                                width: "220px",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                style={{
                                    paddingLeft: 32,
                                }}
                            >
                                <Typography.Text className={styles.labelTotal}>
                                    Subtotal:
                                </Typography.Text>
                                <NumberField
                                    value={subtotal}
                                    options={{style: "currency", currency: selectedCurrency}}
                                />
                            </Flex>
                            <Flex
                                align="center"
                                justify="space-between"
                                style={{
                                    paddingLeft: 32,
                                }}
                            >
                                <Typography.Text className={styles.labelTotal}>
                                    Tax:
                                </Typography.Text>
                                <InputNumber
                                    addonAfter="%"
                                    style={{width: "96px"}}
                                    value={tax}
                                    min={0}
                                    onChange={(value) => {
                                        setTax(value || 0);
                                    }}
                                />
                            </Flex>
                            <Divider
                                style={{
                                    margin: "0",
                                }}
                            />
                            <Flex
                                justify="space-between"
                                style={{
                                    paddingLeft: 16,
                                }}
                            >
                                <Typography.Text
                                    className={styles.labelTotal}
                                    style={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Total value:
                                </Typography.Text>
                                <NumberField
                                    value={total}
                                    options={{style: "currency", currency: selectedCurrency}}
                                />
                            </Flex>
                        </Flex>
                    </div>
                </Card>
            </Form>
        </Edit>
    );
};
