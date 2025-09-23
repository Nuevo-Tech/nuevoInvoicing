import React, { useEffect, useState } from "react";
import { Table, Typography, Card, Flex, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ListClients: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<any[]>([]);
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchBusinessType, setSearchBusinessType] = useState("");
    const [filteredClients, setFilteredClients] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/zatca/onboardClient`)
            .then((res) => res.json())
            .then((data) => setClients(data));
    }, []);

    useEffect(() => {
        let data = [...clients];
        // Filter by ID
        if (searchId) {
            data = data.filter((c) => c._id?.toLowerCase().includes(searchId.toLowerCase()));
        }
        // Filter by Name
        if (searchName) {
            data = data.filter((c) => c.egs_client_name?.toLowerCase().includes(searchName.toLowerCase()));
        }
        // Filter by Business Type
        if (searchBusinessType) {
            data = data.filter((c) => c.business_type === searchBusinessType);
        }
        // Sort
        if (sortField) {
            data.sort((a, b) => {
                if (sortField === "_id") {
                    return sortOrder === "ascend"
                        ? a._id.localeCompare(b._id)
                        : b._id.localeCompare(a._id);
                }
                if (sortField === "egs_client_name") {
                    return sortOrder === "ascend"
                        ? a.egs_client_name.localeCompare(b.egs_client_name)
                        : b.egs_client_name.localeCompare(a.egs_client_name);
                }
                if (sortField === "business_type") {
                    return sortOrder === "ascend"
                        ? a.business_type.localeCompare(b.business_type)
                        : b.business_type.localeCompare(a.business_type);
                }
                return 0;
            });
        }
        setFilteredClients(data);
    }, [clients, searchId, searchName, searchBusinessType, sortOrder, sortField]);

    return (
        <Card style={{ margin: 32 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                EGS Clients
            </Title>
            <Table
                dataSource={filteredClients}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: "960px" }}
                onChange={(pagination, filters, sorter: any) => {
                    setSortOrder(sorter.order || null);
                    setSortField(sorter.field || null);
                }}
            >
                <Table.Column
                    title="ID"
                    dataIndex="_id"
                    key="_id"
                    width={80}
                    sorter={{ compare: (a, b) => a._id.localeCompare(b._id) }}
                    sortOrder={sortField === "_id" ? (sortOrder as "ascend" | "descend" | undefined) : undefined}
                    filterIcon={<SearchOutlined />}
                    filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                placeholder="Search ID"
                                value={selectedKeys[0] ? String(selectedKeys[0]) : ""}
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setSearchId(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: "block" }}
                            />
                            <Flex gap={8}>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        setSearchId(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                        confirm();
                                    }}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        clearFilters && clearFilters();
                                        setSearchId("");
                                    }}
                                >
                                    Reset
                                </button>
                            </Flex>
                        </div>
                    )}
                />
                <Table.Column
                    title="Client Name"
                    dataIndex="egs_client_name"
                    key="egs_client_name"
                    sorter={{ compare: (a, b) => a.egs_client_name.localeCompare(b.egs_client_name) }}
                    sortOrder={sortField === "egs_client_name" ? (sortOrder as "ascend" | "descend" | undefined) : undefined}
                    filterIcon={<SearchOutlined />}
                    filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                placeholder="Search Name"
                                value={selectedKeys[0] ? String(selectedKeys[0]) : ""}
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setSearchName(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: "block" }}
                            />
                            <Flex gap={8}>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        setSearchName(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                        confirm();
                                    }}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        clearFilters && clearFilters();
                                        setSearchName("");
                                    }}
                                >
                                    Reset
                                </button>
                            </Flex>
                        </div>
                    )}
                />
                <Table.Column
                    title="Business Type"
                    dataIndex="business_type"
                    key="business_type"
                    sorter={{ compare: (a, b) => a.business_type.localeCompare(b.business_type) }}
                    sortOrder={sortField === "business_type" ? (sortOrder as "ascend" | "descend" | undefined) : undefined}
                    filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                placeholder="Search Business Type"
                                value={selectedKeys[0] ? String(selectedKeys[0]) : ""}
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setSearchBusinessType(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: "block" }}
                            />
                            <Flex gap={8}>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        setSearchBusinessType(selectedKeys[0] ? String(selectedKeys[0]) : "");
                                        confirm();
                                    }}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    style={{ width: 90 }}
                                    onClick={() => {
                                        clearFilters && clearFilters();
                                        setSearchBusinessType("");
                                    }}
                                >
                                    Reset
                                </button>
                            </Flex>
                        </div>
                    )}
                />
                <Table.Column title="Industry Type" dataIndex="industry_type" key="industry_type" />
                <Table.Column
                    title="Actions"
                    key="actions"
                    fixed="right"
                    align="end"
                    width={106}
                    render={(_, record: any) => (
                        <Flex align="center" gap={8}>
                            {/* Edit Button */}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                                onClick={() => navigate(`/admin/editClient/${record._id}`)}
                            >
                                <EditOutlined style={{ fontSize: 18, color: "#722ed1" }} />
                            </button>
                            {/* Delete Button */}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Are you sure you want to delete this client?",
                                        onOk: async () => {
                                            await fetch(`/api/zatca/onboardClient/${record._id}`, { method: "DELETE" });
                                            fetch(`/api/zatca/onboardClient`)
                                                .then((res) => res.json())
                                                .then((data) => setClients(data));
                                        },
                                    });
                                }}
                            >
                                <DeleteOutlined style={{ fontSize: 18, color: "#ff4d4f" }} />
                            </button>
                        </Flex>
                    )}
                />
            </Table>
        </Card>
    );
};

export default ListClients;
