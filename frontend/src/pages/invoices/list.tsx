import {getDefaultFilter, useGo, useModal} from "@refinedev/core";
import {
    CreateButton,
    SaveButton,
    DateField,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    NumberField,
    ShowButton,
    TagField,
    getDefaultSortOrder,
    useSelect,
    useTable,
} from "@refinedev/antd";
import {
    Avatar,
    Flex,
    Input,
    Modal,
    Select,
    Table,
    Typography,
    Space,
    Button,
    Spin,
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    FilePdfOutlined,
    SearchOutlined,
    SafetyOutlined,
    FileDoneOutlined,
    InfoCircleOutlined

} from "@ant-design/icons";
import {API_URL} from "@/utils/constants";
import {BASE_URL_API_V1} from "@/utils/urls";
import {getRandomColorFromString} from "@/utils/get-random-color";
import type {Invoice} from "@/types";
import {PdfLayout} from "../pdf";
import {useState} from "react";
import JsonModalLayout from "@/pages/actions/JsonModalLayout";

export const InvoicePageList = () => {
    const [record, setRecord] = useState<Invoice>();
    const go = useGo();

    const {tableProps, filters, sorters} = useTable<Invoice>({
        meta: {
            populate: ["client", "account.logo", "account", "services"],
        },
        sorters: {
            initial: [{field: "updatedAt", order: "desc"}],
        },
    });

    const {selectProps: selectPropsAccounts} = useSelect({
        resource: "accounts",
        optionLabel: "account_name",
        optionValue: "account_name",
    });

    const {selectProps: selectPropsClients} = useSelect({
        resource: "clients",
        optionLabel: "partyLegalEntityRegistrationName",
        optionValue: "partyLegalEntityRegistrationName",
    });

    const {selectProps: selectPropsInvoices} = useSelect({
        resource: "invoices",
        optionLabel: "invoice_name",
        optionValue: "invoice_name",
    });

    const statusOptions = [
        {value: "Draft", label: "Draft", color: "orange"},
        {value: "Validated W", label: "Valiadted W", color: "cyan"},
        {value: "Validated", label: "Validated", color: "green"},
        {value: "ValidationFailed", label: "ValidationFailed", color: "red"},
        {value: "Paid", label: "Paid", color: "green"},
        {value: "ZatcaReported W", label: "ZatcaReported W", color: "cyan"},
        {value: "ZatcaReported", label: "ZatcaReported", color: "green"},
        {value: "ZatcaReportingFailed", label: "ZatcaReportingFailed", color: "red"},
    ];

    //row selection code
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // selected row IDs

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };
    const [loading, setLoading] = useState(false);
    const handleSendSelectedCompliance = async () => {
        if (selectedRowKeys.length === 0) return;
        const payload = {
            invoices: selectedRowKeys.map((id) => ({
                invoiceId: id,
            })),
        };
        try {
            setLoading(true); // 🔹 Start loading
            const response = await fetch("http://localhost:8081/api/v1/zatca/checkInvoicesCompliance", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error sending selected invoices:", error);
        }
    };

    const handleSendSelectedReporting = async () => {
        if (selectedRowKeys.length === 0) return;
        const payload = {
            invoices: selectedRowKeys.map((id) => ({
                invoiceId: id,
            })),
        };
        try {
            setLoading(true); // 🔹 Start loading
            const response = await fetch("http://localhost:8081/api/v1/zatca/reportInvoice", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error sending selected invoices:", error);
        }
    };

    const allowedStatusesForZatcaReporting = ["Validated W", "Validated"];

// Check if all selected invoices are valid
//     const isSelectionValid =
//         selectedRowKeys.length > 0 &&
//         selectedRowKeys.every((invoice) => allowedStatusesForZatcaReporting.includes(invoice.status));

    const {show, visible, close} = useModal();
    const [visibleJsonModal, setVisibleJsonModal] = useState(false);

    return (
        <>
            <Spin spinning={loading} tip="Processing...">
            <List
                title="Invoices"
                headerButtons={() => {
                    return (
                        <Space>
                            <SaveButton
                                size="large"
                                onClick={handleSendSelectedReporting}
                                icon={<FileDoneOutlined/>}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Report To Zatca
                            </SaveButton>
                            <SaveButton
                                size="large"
                                onClick={handleSendSelectedCompliance}
                                icon={<SafetyOutlined/>}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Validate Compliance
                            </SaveButton>

                            <CreateButton
                                size="large"
                                onClick={() =>
                                    go({
                                        to: {resource: "invoices", action: "create"},
                                        options: {keepQuery: true},
                                    })
                                }
                            >
                                Add new invoice
                            </CreateButton>
                        </Space>

                    );
                }}
            >
                <Table
                    {...tableProps}
                    rowKey={"id"}
                    rowSelection={rowSelection}
                    onRow={(record) => ({
                        onClick: (event) => {
                            if (!(event.target as HTMLElement).closest("button")) {
                                go({
                                    to: {
                                        resource: "invoices",
                                        action: "edit",
                                        id: record.id,
                                    },
                                });
                            }
                        },
                        onMouseEnter: (event) => {
                            (event.target as HTMLElement).style.cursor = "pointer";
                        },
                    })}
                    pagination={{
                        ...tableProps.pagination,
                        showSizeChanger: true,
                    }}
                    scroll={{x: "960px"}}
                >
                    <Table.Column
                        title="ID"
                        dataIndex="id"
                        key="id"
                        width={80}
                        defaultFilteredValue={getDefaultFilter("id", filters)}
                        filterIcon={<SearchOutlined/>}
                        filterDropdown={(props) => {
                            return (
                                <FilterDropdown {...props}>
                                    <Input placeholder="Search ID"/>
                                </FilterDropdown>
                            );
                        }}
                    />
                    <Table.Column
                        title="Account"
                        dataIndex="account.account_name"
                        key="account.account_name"
                        defaultFilteredValue={getDefaultFilter(
                            "account.account_name",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search Account"
                                    style={{width: 220}}
                                    {...selectPropsAccounts}
                                />
                            </FilterDropdown>
                        )}
                        render={(_, record: Invoice) => {
                            const logoUrl = record?.account?.logo;
                            const src = logoUrl ? `${API_URL}${logoUrl}` : undefined;
                            const name = record?.account?.account_name;

                            return (
                                <Flex align="center" gap={8}>
                                    <Avatar
                                        alt={name}
                                        src={src}
                                        shape="square"
                                        style={{
                                            backgroundColor: src
                                                ? "none"
                                                : getRandomColorFromString(name || ""),
                                        }}
                                    >
                                        <Typography.Text>
                                            {name?.[0]?.toUpperCase()}
                                        </Typography.Text>
                                    </Avatar>
                                    <Typography.Text>{name}</Typography.Text>
                                </Flex>
                            );
                        }}
                    />
                    <Table.Column
                        title="Client"
                        dataIndex="client.partyLegalEntityRegistrationName"
                        key="client.partyLegalEntityRegistrationName"
                        render={(_, record: Invoice) => {
                            return (
                                <Typography.Text>{record.client?.partyLegalEntityRegistrationName}</Typography.Text>
                            );
                        }}
                        defaultFilteredValue={getDefaultFilter(
                            "partyLegalEntityRegistrationName",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search Client Name"
                                    style={{width: 220}}
                                    {...selectPropsClients}
                                />
                            </FilterDropdown>
                        )}
                    />
                    <Table.Column
                        title="Invoice"
                        dataIndex="invoice.invoice_name"
                        key="invoice.invoice_name"
                        render={(_, record: Invoice) => {
                            return <Typography.Text>{record?.invoice_name}</Typography.Text>;
                        }}
                        defaultFilteredValue={getDefaultFilter(
                            "invoice_name",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search Invoice Name"
                                    style={{width: 220}}
                                    {...selectPropsInvoices}
                                />
                            </FilterDropdown>
                        )}
                    />

                    <Table.Column
                        title="Date"
                        dataIndex="invoice.invoiceDate"
                        key="invoice.invoiceDate"
                        width={120}
                        sorter
                        defaultSortOrder={getDefaultSortOrder(
                            "invoice.invoiceDate",
                            sorters
                        )}
                        render={(_, record: Invoice) => {
                            return (
                                <DateField value={record.invoiceDate} format="D MMM YYYY"/>
                            );
                        }}
                    />
                    <Table.Column
                        title="Total"
                        dataIndex="total"
                        key="total"
                        width={132}
                        align="end"
                        sorter
                        defaultSortOrder={getDefaultSortOrder("total", sorters)}
                        render={(_, record: Invoice) => {
                            return (
                                <TagField value={`${record.currency} ${record.total}`} color="green"/>
                            );
                        }}
                    />
                    <Table.Column
                        title="Invoice Status"
                        dataIndex="status"
                        key="status"
                        width={160}
                        render={(status) => {
                            const option = statusOptions.find((o) => o.value === status);
                            const color = option?.color || "default"; // fallback if status not found
                            const label = option?.label || status;
                            return <TagField value={label} color={color}/>;
                        }}
                    />
                    <Table.Column
                        title="Actions"
                        key="actions"
                        fixed="right"
                        align="end"
                        width={120}
                        render={(_, record: Invoice) => {
                            return (
                                <Flex align="center" gap={8}>
                                    <ShowButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                        icon={<EyeOutlined/>}
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevent row click event
                                            console.log("Navigating to show page for ID:", record.id);
                                            go({
                                                to: {
                                                    resource: "invoices",
                                                    action: "show",
                                                    id: record.id,
                                                },
                                            });
                                        }}
                                    />

                                    <DeleteButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        icon={<FilePdfOutlined/>}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setRecord(record);
                                            show();
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        icon={<InfoCircleOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRecord(record);
                                            setVisibleJsonModal(true);
                                        }}
                                    />
                                </Flex>
                            );
                        }}
                    />
                </Table>
            </List>
            </Spin>
            <Modal visible={visible} onCancel={close} width="80%" footer={null}>
                <PdfLayout record={record}/>
            </Modal>
            <Modal
                visible={visibleJsonModal}
                onCancel={() => setVisibleJsonModal(false)}
                width="80%"
                footer={null}
                title="Invoice ZATCA Response"
            >
                {record && <JsonModalLayout record={record} />}
            </Modal>
        </>
    );
};
