// import { Fragment, useState } from "react";
// import { Modal, Select as TypeSelect, Card, Button, Typography, Row, Col, Divider, Input, DatePicker, InputNumber, Flex, Form, Select } from "antd";
// import { NumberField, Show, useForm, useSelect } from "@refinedev/antd";
// import { DeleteOutlined, PlusCircleOutlined, FileTextOutlined, FileAddOutlined, FileDoneOutlined } from "@ant-design/icons";
// import type { Invoice, Service } from "@/types";
// import { useStyles } from "./create.styled";
// import { useNavigate, useLocation } from "react-router-dom";
//
// export const InvoicesPageCreate = () => {
//   const [tax, setTax] = useState<number>(0);
//   const [services, setServices] = useState<Service[]>([
//     {
//       title: "",
//       unitPrice: 0,
//       quantity: 0,
//       discount: 0,
//       totalPrice: 0,
//       description: "",
//     },
//   ]);
//   const [showTypeModal, setShowTypeModal] = useState(true);
//   const location = useLocation();
//   const initialType = location.state?.invoiceType || null;
//   const initialSubType = location.state?.invoiceSubType || null;
//   const [invoiceType, setInvoiceType] = useState<string | null>(initialType);
//   const [invoiceSubType, setInvoiceSubType] = useState<string | null>(initialSubType);
//   const [step, setStep] = useState(0);
//
//   const subtotal = services.reduce(
//     (acc, service) =>
//       acc +
//       (service.unitPrice * service.quantity * (100 - service.discount)) / 100,
//     0
//   );
//   const total = subtotal + (subtotal * tax) / 100;
//
//   const { styles } = useStyles();
//
//   const { formProps } = useForm<Invoice>();
//
//   const { selectProps: selectPropsAccounts } = useSelect({
//     resource: "accounts",
//     optionLabel: "account_name",
//     optionValue: "_id",
//   });
//
//   const { selectProps: selectPropsClients } = useSelect({
//     resource: "clients",
//     optionLabel: "client_name",
//     optionValue: "_id",
//   });
//
//   const currencyOptions = [
//     { value: "INR", label: "₹ INR" },
//     { value: "USD", label: "$ USD" },
//     { value: "EUR", label: "€ EUR" },
//     { value: "GBP", label: "£ GBP" },
//     { value: "JPY", label: "¥ JPY" },
//     { value: "SAR", label: "﷼ SAR" },
//   ];
//
//   const statusOptions = [
//     { value: "Draft", label: "Draft", color: "blue" },
//     { value: "NotPaid", label: "NotPaid", color: "red" },
//     { value: "Paid", label: "Paid", color: "green" },
//     { value: "Refunded", label: "Refunded", color: "orange" },
//   ];
//
//   const defaultCurrencySymbol = "₹";
//   const defaultCurrency = "INR";
//   const defaultStatus = "Draft";
//
//   const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
//
//   const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(
//     defaultCurrencySymbol
//   );
//
//   const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
//
//   const handleCurrencyChange = (value: React.SetStateAction<string>) => {
//     let symbol = "";
//
//     switch (value) {
//       case "INR":
//         symbol = "₹";
//         break;
//       case "USD":
//         symbol = "$";
//         break;
//       case "EUR":
//         symbol = "€";
//         break;
//       case "GBP":
//         symbol = "£";
//         break;
//       case "JPY":
//         symbol = "¥";
//         break;
//       case "SAR":
//         symbol = "﷼";
//         break;
//       default:
//         symbol = defaultCurrencySymbol;
//     }
//     setSelectedCurrencySymbol(symbol);
//     setSelectedCurrency(value);
//   };
//
//   const handleStatusChange = (value: React.SetStateAction<string>) => {
//     let status = "";
//
//     switch (value) {
//       case "Draft":
//         status = "Draft";
//         break;
//       case "NotPaid":
//         status = "NotPaid";
//         break;
//       case "Paid":
//         status = "Paid";
//         break;
//       case "Refunded":
//         status = "Refunded";
//         break;
//       default:
//         status = defaultStatus;
//     }
//     setSelectedStatus(status);
//   };
//
//   const handleServiceNumbersChange = (
//     index: number,
//     key: "quantity" | "discount" | "unitPrice",
//     value: number
//   ) => {
//     setServices((prev) => {
//       const currentService = { ...prev[index] };
//       currentService[key] = value;
//       currentService.totalPrice =
//         currentService.unitPrice *
//         currentService.quantity *
//         ((100 - currentService.discount) / 100);
//
//       return prev.map((item, i) => (i === index ? currentService : item));
//     });
//   };
//
//   const userData = localStorage.getItem("user");
//   let userId = "";
//   if (userData) {
//     const parsedUserData = JSON.parse(userData);
//     userId = parsedUserData.userId;
//   }
//
//   const onFinishHandler = (values: Invoice) => {
//     const valuesWithServices = {
//       ...values,
//       subtotal,
//       total,
//       tax,
//       userId: userId,
//       date: new Date().toISOString(),
//       services: services.filter((service) => service.title),
//     };
//
//     formProps?.onFinish?.(valuesWithServices);
//   };
//
//   const typeOptions = [
//     { label: "Standard", value: "standard", icon: <FileTextOutlined style={{ fontSize: 32, color: '#722ed1' }} /> },
//     { label: "Simplified", value: "simplified", icon: <FileAddOutlined style={{ fontSize: 32, color: '#52c41a' }} /> },
//   ];
//   const subTypeOptions = {
//     standard: [
//       { label: "Standard", value: "standard", desc: "Regular Standard Invoice", icon: <FileTextOutlined style={{ fontSize: 28, color: '#722ed1' }} /> },
//       { label: "Standard Debit Note", value: "standard_debit", desc: "Debit Note for Standard Invoice", icon: <FileAddOutlined style={{ fontSize: 28, color: '#faad14' }} /> },
//       { label: "Standard Credit Note", value: "standard_credit", desc: "Credit Note for Standard Invoice", icon: <FileDoneOutlined style={{ fontSize: 28, color: '#1890ff' }} /> },
//     ],
//     simplified: [
//       { label: "Simplified", value: "simplified", desc: "Regular Simplified Invoice", icon: <FileTextOutlined style={{ fontSize: 28, color: '#52c41a' }} /> },
//       { label: "Simplified Debit Note", value: "simplified_debit", desc: "Debit Note for Simplified Invoice", icon: <FileAddOutlined style={{ fontSize: 28, color: '#faad14' }} /> },
//       { label: "Simplified Credit Note", value: "simplified_credit", desc: "Credit Note for Simplified Invoice", icon: <FileDoneOutlined style={{ fontSize: 28, color: '#1890ff' }} /> },
//     ],
//   };
//
//   // Map sub-type to status
//   const subTypeStatusMap: Record<string, string> = {
//     standard: "Draft",
//     simplified: "Draft",
//     standard_debit: "Validation Pass",
//     simplified_debit: "Validation Pass",
//     standard_credit: "Submitted to ZATCA",
//     simplified_credit: "Submitted to ZATCA",
//   };
//
//   // Compute status based on selected sub-type
//   const lockedStatus = invoiceSubType ? subTypeStatusMap[invoiceSubType] : defaultStatus;
//
//   const navigate = useNavigate();
//
//   return (
//     <>
//       <Modal
//         open={showTypeModal}
//         title={null}
//         closable={false}
//         footer={null}
//         centered
//         bodyStyle={{ padding: 32, minHeight: 340 }}
//       >
//         <div style={{ marginBottom: 32, textAlign: "center" }}>
//           <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
//             <div style={{ fontWeight: 600, color: step === 0 ? "#722ed1" : "#aaa" }}>1. Type</div>
//             <div style={{ fontWeight: 600, color: step === 1 ? "#722ed1" : "#aaa" }}>2. Sub-Type</div>
//           </div>
//           <Typography.Title level={4} style={{ marginBottom: 0, color: "#722ed1" }}>
//             {step === 0 ? "Select Invoice Type" : "Select Invoice Sub-Type"}
//           </Typography.Title>
//         </div>
//         {step === 0 && (
//           <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 24 }}>
//             {typeOptions.map((opt) => (
//               <Card
//                 key={opt.value}
//                 hoverable
//                 onClick={() => { setInvoiceType(opt.value); setStep(1); }}
//                 style={{
//                   width: 180,
//                   textAlign: "center",
//                   border: invoiceType === opt.value ? "2px solid #722ed1" : "1px solid #eee",
//                   boxShadow: invoiceType === opt.value ? "0 4px 16px #e0c3fc55" : "none",
//                   cursor: "pointer",
//                   transition: "box-shadow 0.2s, border 0.2s",
//                 }}
//               >
//                 <div style={{ marginBottom: 12 }}>{opt.icon}</div>
//                 <div style={{ fontWeight: 600, fontSize: 18 }}>{opt.label}</div>
//               </Card>
//             ))}
//           </div>
//         )}
//         {step === 1 && invoiceType && (
//           <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24 }}>
//             {subTypeOptions[invoiceType as "standard" | "simplified"].map((opt) => (
//               <Card
//                 key={opt.value}
//                 hoverable
//                 onClick={() => { setInvoiceSubType(opt.value); }}
//                 style={{
//                   width: 200,
//                   textAlign: "center",
//                   border: invoiceSubType === opt.value ? "2px solid #52c41a" : "1px solid #eee",
//                   boxShadow: invoiceSubType === opt.value ? "0 4px 16px #8ec5fc55" : "none",
//                   cursor: "pointer",
//                   transition: "box-shadow 0.2s, border 0.2s",
//                 }}
//               >
//                 <div style={{ marginBottom: 8 }}>{opt.icon}</div>
//                 <div style={{ fontWeight: 600, fontSize: 16 }}>{opt.label}</div>
//                 <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{opt.desc}</div>
//               </Card>
//             ))}
//           </div>
//         )}
//         <Button
//           type="primary"
//           block
//           disabled={step === 0 ? !invoiceType : !invoiceSubType}
//           style={{ marginTop: 16, fontWeight: 600, height: 44, fontSize: 16 }}
//           onClick={() => {
//             if (step === 0 && invoiceType) setStep(1);
//             else if (step === 1 && invoiceSubType) {
//               setShowTypeModal(false);
//             }
//           }}
//         >
//           {step === 0 ? "Next" : "Continue"}
//         </Button>
//         {step === 1 && (
//           <Button
//             block
//             style={{ marginTop: 8, background: "#eee" }}
//             onClick={() => { setStep(0); setInvoiceSubType(null); }}
//           >
//             Back
//           </Button>
//         )}
//       </Modal>
//       {!showTypeModal && (
//         <Show
//           title="Invoices"
//           headerButtons={() => false}
//           contentProps={{
//             styles: {
//               body: {
//                 padding: 0,
//               },
//             },
//             style: {
//               background: "transparent",
//               boxShadow: "none",
//             },
//           }}
//         >
//           <Form
//             {...formProps}
//             initialValues={{ status: defaultStatus, currency: defaultCurrency }}
//             onFinish={(values) => onFinishHandler(values as Invoice)}
//             layout="vertical"
//           >
//             <Flex vertical gap={32}>
//               <Typography.Title level={3}>New Invoice</Typography.Title>
//               <Card
//                 bordered={false}
//                 styles={{
//                   body: {
//                     padding: 0,
//                   },
//                 }}
//               >
//                 <Flex
//                   align="center"
//                   gap={40}
//                   wrap="wrap"
//                   style={{ padding: "32px" }}
//                 >
//                   <Form.Item
//                     label="Account"
//                     name="account"
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Select
//                       {...selectPropsAccounts}
//                       placeholder="Please select account"
//                     />
//                   </Form.Item>
//                   <Form.Item
//                     label="Client"
//                     name="client"
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Select
//                       {...selectPropsClients}
//                       placeholder="Please select client"
//                     />
//                   </Form.Item>
//
//                   <Form.Item
//                     label="Invoice Date"
//                     name="invoiceDate"
//                     rules={[
//                       {
//                         required: true,
//                       },
//                     ]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <DatePicker format="DD-MM-YYYY" />
//                   </Form.Item>
//                 </Flex>
//
//                 <Flex
//                   align="center"
//                   gap={40}
//                   wrap="wrap"
//                   style={{ padding: "32px", marginTop: "-75px" }}
//                 >
//                   <Form.Item
//                     label="Invoice Type"
//                     name="invoice_type"
//                     initialValue={invoiceSubType ? (
//                       subTypeOptions[invoiceType as keyof typeof subTypeOptions]?.find(opt => opt.value === invoiceSubType)?.label || invoiceSubType
//                     ) : ""}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Input disabled />
//                   </Form.Item>
//                   {/*
//                   <Form.Item
//                     label="Invoice Status"
//                     name="status"
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Select
//                       placeholder="Select Status"
//                       options={statusOptions}
//                       onChange={handleStatusChange}
//                       disabled={true}
//                     />
//                   </Form.Item>
//                   */}
//                   <Form.Item
//                     label="Invoice Status"
//                     name="status"
//                     initialValue={lockedStatus}
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Select
//                       options={[
//                         { value: "Draft", label: "Draft" },
//                         { value: "Validation Pass", label: "Validation Pass" },
//                         { value: "Submitted to ZATCA", label: "Submitted to ZATCA" }
//                       ]}
//                       placeholder="Select status"
//                       disabled
//                     />
//                   </Form.Item>
//
//                   <Form.Item
//                     label="Custom Id"
//                     name="custom_id"
//                     rules={[{ required: false }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Input />
//                   </Form.Item>
//
//                   <Form.Item
//                     label="Currency"
//                     name="currency"
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Select
//                       placeholder="Select Currency"
//                       options={currencyOptions}
//                       onChange={handleCurrencyChange}
//                       disabled
//                     />
//                   </Form.Item>
//                 </Flex>
//
//                 <Flex
//                   align="center"
//                   gap={40}
//                   wrap="wrap"
//                   style={{ padding: "32px", marginTop: "-75px" }}
//                 >
//                   <Form.Item
//                     label="Invoice Name"
//                     name="invoice_name"
//                     rules={[{ required: true }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Input />
//                   </Form.Item>
//                 </Flex>
//
//                 <Flex
//                   align="center"
//                   gap={40}
//                   wrap="wrap"
//                   style={{ padding: "32px", marginTop: "-75px" }}
//                 >
//                   <Form.Item
//                     label="Note"
//                     name="note"
//                     rules={[{ required: false }]}
//                     style={{ flex: 1, minWidth: "250px" }}
//                   >
//                     <Input.TextArea
//                       placeholder="Enter notes here"
//                       autoSize={{ minRows: 2, maxRows: 6 }}
//                     />
//                   </Form.Item>
//                 </Flex>
//
//                 <Divider style={{ margin: 0 }} />
//                 <div style={{ padding: "32px" }}>
//                   <Typography.Title
//                     level={4}
//                     style={{ marginBottom: "32px", fontWeight: 400 }}
//                   >
//                     Products / Services
//                   </Typography.Title>
//                   <div className={styles.serviceTableWrapper}>
//                     <div className={styles.serviceTableContainer}>
//                       <Row className={styles.serviceHeader}>
//                         <Col
//                           xs={{ span: 7 }}
//                           className={styles.serviceHeaderColumn}
//                         >
//                           Title
//                           <Divider
//                             type="vertical"
//                             className={styles.serviceHeaderDivider}
//                           />
//                         </Col>
//                         <Col
//                           xs={{ span: 5 }}
//                           className={styles.serviceHeaderColumn}
//                         >
//                           Unit Price
//                           <Divider
//                             type="vertical"
//                             className={styles.serviceHeaderDivider}
//                           />
//                         </Col>
//                         <Col
//                           xs={{ span: 4 }}
//                           className={styles.serviceHeaderColumn}
//                         >
//                           Quantity
//                           <Divider
//                             type="vertical"
//                             className={styles.serviceHeaderDivider}
//                           />
//                         </Col>
//                         <Col
//                           xs={{ span: 4 }}
//                           className={styles.serviceHeaderColumn}
//                         >
//                           Discount
//                           <Divider
//                             type="vertical"
//                             className={styles.serviceHeaderDivider}
//                           />
//                         </Col>
//                         <Col
//                           xs={{ span: 3 }}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "flex-end",
//                           }}
//                           className={styles.serviceHeaderColumn}
//                         >
//                           Total Price
//                         </Col>
//                         <Col xs={{ span: 1 }}> </Col>
//                       </Row>
//                       <Row>
//                         {services.map((service, index) => {
//                           return (
//                             <Fragment key={index}>
//                               <Col
//                                 xs={{ span: 7 }}
//                                 className={styles.serviceRowColumn}
//                               >
//                                 <Input
//                                   placeholder="Title"
//                                   value={service.name}
//                                   onChange={(e) => {
//                                     setServices((prev) =>
//                                       prev.map((item, i) =>
//                                         i === index
//                                           ? { ...item, title: e.target.value }
//                                           : item
//                                       )
//                                     );
//                                   }}
//                                 />
//                               </Col>
//                               <Col
//                                 xs={{ span: 5 }}
//                                 className={styles.serviceRowColumn}
//                               >
//                                 <InputNumber
//                                   addonBefore={selectedCurrencySymbol}
//                                   style={{ width: "100%" }}
//                                   placeholder="Unit Price"
//                                   min={0}
//                                   value={service.unitPrice}
//                                   onChange={(value) => {
//                                     handleServiceNumbersChange(
//                                       index,
//                                       "unitPrice",
//                                       value || 0
//                                     );
//                                   }}
//                                 />
//                               </Col>
//                               <Col
//                                 xs={{ span: 4 }}
//                                 className={styles.serviceRowColumn}
//                               >
//                                 <InputNumber
//                                   style={{ width: "100%" }}
//                                   placeholder="Quantity"
//                                   min={0}
//                                   value={service.quantity}
//                                   onChange={(value) => {
//                                     handleServiceNumbersChange(
//                                       index,
//                                       "quantity",
//                                       value || 0
//                                     );
//                                   }}
//                                 />
//                               </Col>
//                               <Col
//                                 xs={{ span: 4 }}
//                                 className={styles.serviceRowColumn}
//                               >
//                                 <InputNumber
//                                   addonAfter="%"
//                                   style={{ width: "100%" }}
//                                   placeholder="Discount"
//                                   min={0}
//                                   value={service.discount}
//                                   onChange={(value) => {
//                                     handleServiceNumbersChange(
//                                       index,
//                                       "discount",
//                                       value || 0
//                                     );
//                                   }}
//                                 />
//                               </Col>
//                               <Col
//                                 xs={{ span: 3 }}
//                                 className={styles.serviceRowColumn}
//                                 style={{
//                                   justifyContent: "flex-end",
//                                 }}
//                               >
//                                 <NumberField
//                                   value={service.totalPrice}
//                                   options={{
//                                     style: "currency",
//                                     currency: selectedCurrency,
//                                   }}
//                                 />
//                               </Col>
//                               <Col
//                                 xs={{ span: 1 }}
//                                 className={styles.serviceRowColumn}
//                                 style={{
//                                   paddingLeft: "0",
//                                   justifyContent: "flex-end",
//                                 }}
//                               >
//                                 <Button
//                                   danger
//                                   size="small"
//                                   icon={<DeleteOutlined />}
//                                   onClick={() => {
//                                     setServices((prev) =>
//                                       prev.filter((_, i) => i !== index)
//                                     );
//                                   }}
//                                 />
//                               </Col>
//                             </Fragment>
//                           );
//                         })}
//                       </Row>
//                       <Divider
//                         style={{
//                           margin: "0",
//                         }}
//                       />
//                       <div style={{ padding: "12px" }}>
//                         <Button
//                           icon={<PlusCircleOutlined />}
//                           type="text"
//                           className={styles.addNewServiceItemButton}
//                           onClick={() => {
//                             setServices((prev) => [
//                               ...prev,
//                               {
//                                 name: "",
//                                 unitPrice: 0,
//                                   unitCode:"",
//                                 quantity: 0,
//                                 discount: 0,
//                                 totalPrice: 0,
//                                 description: "",
//                               },
//                             ]);
//                           }}
//                         >
//                           Add new item
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                   <Flex
//                     gap={16}
//                     vertical
//                     style={{
//                       marginLeft: "auto",
//                       marginTop: "24px",
//                       width: "220px",
//                     }}
//                   >
//                     <Flex
//                       justify="space-between"
//                       style={{
//                         paddingLeft: 32,
//                       }}
//                     >
//                       <Typography.Text className={styles.labelTotal}>
//                         Subtotal:
//                       </Typography.Text>
//                       <NumberField
//                         value={subtotal}
//                         options={{ style: "currency", currency: selectedCurrency }}
//                       />
//                     </Flex>
//                     <Flex
//                       align="center"
//                       justify="space-between"
//                       style={{
//                         paddingLeft: 32,
//                       }}
//                     >
//                       <Typography.Text className={styles.labelTotal}>
//                         Tax:
//                       </Typography.Text>
//                       <InputNumber
//                         addonAfter="%"
//                         style={{ width: "96px" }}
//                         value={tax}
//                         min={0}
//                         onChange={(value) => {
//                           setTax(value || 0);
//                         }}
//                       />
//                     </Flex>
//                     <Divider
//                       style={{
//                         margin: "0",
//                       }}
//                     />
//                     <Flex
//                       justify="space-between"
//                       style={{
//                         paddingLeft: 16,
//                       }}
//                     >
//                       <Typography.Text
//                         className={styles.labelTotal}
//                         style={{
//                           fontWeight: 700,
//                         }}
//                       >
//                         Total value:
//                       </Typography.Text>
//                       <NumberField
//                         value={total}
//                         options={{ style: "currency", currency: selectedCurrency }}
//                       />
//                     </Flex>
//                   </Flex>
//                 </div>
//                 <Divider style={{ margin: 0 }} />
//                 <Flex justify="end" gap={8} style={{ padding: "32px" }}>
//                   <Button>Cancel</Button>
//                   <Button type="primary" htmlType="submit">
//                     Save
//                   </Button>
//                 </Flex>
//               </Card>
//             </Flex>
//           </Form>
//         </Show>
//       )}
//     </>
//   );
// };
