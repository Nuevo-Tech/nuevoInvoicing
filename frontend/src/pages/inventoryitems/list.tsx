import type { PropsWithChildren } from "react";
import { getDefaultFilter, useGo } from "@refinedev/core";
import {
    CreateButton,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    NumberField,
    getDefaultSortOrder,
    useSelect,
    useTable, DateField, TagField,
} from "@refinedev/antd";
import {EyeOutlined, MailOutlined, SearchOutlined} from "@ant-design/icons";
import { Avatar, Flex, Input, Select, Table, Typography } from "antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type {InventoryItem, Invoice} from "@/types";

export const InventoryItemsPageList = ({ children }: PropsWithChildren) => {
    const go = useGo();

    const { tableProps, filters, sorters } = useTable<InventoryItem>({
        sorters: {
            initial: [{ field: "updatedAt", order: "desc" }],
        },
        filters: {
            initial: [
                {
                    field: "inventoryItem_name",
                    operator: "contains",
                    value: "",
                },
            ],
        },
        // meta: {
        //     populate: ["logo", "invoices"],
        // },
    });

    const { selectProps: inventoryItemNameSelectProps } = useSelect({
        resource: "inventoryitems",
        optionLabel: "item_name",
        optionValue: "item_name",
    });

    const { selectProps: inventoryItemStatusSelectProps } = useSelect({
        resource: "inventoryitems",
        optionLabel: "status",
        optionValue: "status",
    });

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "done":
                return "green";
            case "new":
                return "purple";
            case "cancelled":
                return "red";
            default:
                return "default"; // fallback color
        }
    };


    return (
        <>
            <List
                title="Inventory"
                headerButtons={() => {
                    return (
                        <CreateButton
                            size="large"
                            onClick={() =>
                                go({
                                    to: { resource: "inventoryitems", action: "create" },
                                    options: { keepQuery: true },
                                })
                            }
                        >
                            Add new inventoryItem
                        </CreateButton>
                    );
                }}
            >
                <Table
                    {...tableProps}
                    rowKey={"id"}
                    pagination={{
                        ...tableProps.pagination,
                        showSizeChanger: true,
                    }}
                    scroll={{ x: "960px" }}
                >
                    <Table.Column
                        title="ID"
                        dataIndex="id"
                        key="id"
                        width={80}
                        defaultFilteredValue={getDefaultFilter("id", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => {
                            return (
                                <FilterDropdown {...props}>
                                    <Input placeholder="Search ID" />
                                </FilterDropdown>
                            );
                        }}
                    />
                    <Table.Column
                        title="InventoryItem Name"
                        dataIndex="inventoryItem_name"
                        key="inventoryItem_name"
                        sorter
                        defaultSortOrder={getDefaultSortOrder("inventoryItem_name", sorters)}
                        defaultFilteredValue={getDefaultFilter(
                            "inventoryItem_name",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search InventoryItem Name"
                                    style={{ width: 220 }}
                                    {...inventoryItemNameSelectProps}
                                />
                            </FilterDropdown>
                        )}
                        render={(name: string, record: InventoryItem) => {
                            const src = null;

                            return (
                                <Flex align="center" gap={8}>
                                    <Avatar
                                        alt={name}
                                        src={src}
                                        shape="square"
                                        style={{
                                            backgroundColor: src
                                                ? "none"
                                                : getRandomColorFromString(name),
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
                        title="Phone"
                        dataIndex="phone"
                        key="phone"
                        width={154}
                        defaultFilteredValue={getDefaultFilter(
                            "phone",
                            filters,
                            "contains"
                        )}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => {
                            return (
                                <FilterDropdown {...props}>
                                    <Input placeholder="Search Phone" />
                                </FilterDropdown>
                            );
                        }}
                    />
                    {/*<Table.Column*/}
                    {/*    title="Date"*/}
                    {/*    dataIndex="date"*/}
                    {/*    key="date"*/}
                    {/*    width={120}*/}
                    {/*    sorter*/}
                    {/*    defaultSortOrder={getDefaultSortOrder(*/}
                    {/*        "date",*/}
                    {/*        sorters*/}
                    {/*    )}*/}
                    {/*    render={(_, record: InventoryItem) => {*/}
                    {/*        return (*/}
                    {/*            <DateField value={record.date}*/}
                    {/*                       format="D MMM YYYY hh:mm A" />*/}
                    {/*        );*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Table.Column
                        title="Status"
                        dataIndex="status"
                        key="status"
                        width={106}
                        sorter
                        defaultSortOrder={getDefaultSortOrder("status", sorters)}
                        defaultFilteredValue={getDefaultFilter(
                            "status",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search status"
                                    style={{ width: 220 }}
                                    {...inventoryItemStatusSelectProps}
                                />
                            </FilterDropdown>
                        )}
                        render={(status: string) => (
                            <TagField value={status} color={getStatusColor(status)} />
                        )}
                    />
                    <Table.Column
                        title="Actions"
                        key="actions"
                        fixed="right"
                        align="end"
                        width={106}
                        render={(_, record: InventoryItem) => {
                            return (
                                <Flex align="center" gap={8}>
                                    <EditButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                        icon={<EyeOutlined />}
                                    />
                                    <DeleteButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                    />
                                </Flex>
                            );
                        }}
                    />
                </Table>
            </List>
            {children}
        </>
    );
};
