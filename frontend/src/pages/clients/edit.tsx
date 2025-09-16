import {useNavigation} from "@refinedev/core";
import {
    DateField,
    DeleteButton,
    NumberField,
    Show,
    ShowButton,
    useForm,
    useSelect,
} from "@refinedev/antd";
import {Card, Divider, Flex, Form, Table, Typography} from "antd";
import {
    ShopOutlined,
    UserOutlined,
    PieChartOutlined,
    ExportOutlined,
    BankOutlined,
    MailOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ContainerOutlined, NumberOutlined,
} from "@ant-design/icons";
import {Col, Row} from "antd";
import {
    FormItemEditableInputText,
    FormItemEditableSelect,
    FormItemEditableText,
} from "@/components/form";
import type {Invoice} from "@/types";

export const ClientsPageEdit = () => {
    const {list} = useNavigation();

    const {formProps, query: queryResult} = useForm({
        redirect: false,
        meta: {
            populate: ["account", "invoices", "invoices.client"],
        },
    });

    const {selectProps: selectPropsAccount} = useSelect({
        resource: "accounts",
        optionLabel: "account_name",
        optionValue: "id",
    });

    const invoices = queryResult?.data?.data?.invoices || [];
    const client = invoices?.client;
    const isLoading = queryResult?.isLoading;

    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    return (
        <Show
            title="Clients"
            headerButtons={() => false}
            contentProps={{
                styles: {
                    body: {
                        padding: 0,
                    },
                },
                style: {
                    background: "transparent",
                    boxShadow: "none",
                },
            }}
        >
            <Form
                {...formProps}
                onFinish={async (values) => {
                    return formProps.onFinish?.({
                        ...values,
                        userId: userId,
                    });
                }}
                layout="vertical"
            >
                <Row>
                    <Col span={24}>
                        <Flex gap={16}>
                            <FormItemEditableText
                                loading={isLoading}
                                formItemProps={{
                                    name: "partyLegalEntityRegistrationName",
                                    rules: [{required: true}],
                                }}
                            />
                        </Flex>
                    </Col>
                </Row>
                <Row
                    gutter={32}
                    style={{
                        marginTop: "32px",
                    }}
                >
                    <Col xs={{span: 24}} xl={{span: 8}}>
                        <Card
                            bordered={false}
                            styles={{body: {padding: 0}}}
                            title={
                                <Flex gap={12} align="center">
                                    <ShopOutlined/>
                                    <Typography.Text>Client info</Typography.Text>
                                </Flex>
                            }
                        >
                            <FormItemEditableSelect
                                loading={isLoading}
                                icon={<BankOutlined/>}
                                editIcon={<ExportOutlined/>}
                                selectProps={{
                                    showSearch: true,
                                    placeholder: "Select account",
                                    ...selectPropsAccount,
                                }}
                                formItemProps={{
                                    name: "account",
                                    getValueProps: (value) => {
                                        return {
                                            value: value?.id,
                                            label: value?.account_name,
                                        };
                                    },
                                    label: "Account",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<PieChartOutlined/>}
                                placeholder="Add Tax Type"
                                formItemProps={{
                                    name: "partyTaxSchemeTaxSchemeId",
                                    label: "Tax Type",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<NumberOutlined/>}
                                placeholder="Add VAT No"
                                formItemProps={{
                                    name: "partyTaxSchemeCompanyID",
                                    label: "VAT number",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add street name"
                                formItemProps={{
                                    name: "streetName",
                                    label: "Street Name",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="dd Building No"
                                formItemProps={{
                                    name: "buildingNumber",
                                    label: "Building Number",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add city subdivision"
                                formItemProps={{
                                    name: "citySubdivisionName",
                                    label: "City Sub Division",
                                    rules: [{required: false}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add city name"
                                formItemProps={{
                                    name: "cityName",
                                    label: "City Name",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Postal Zone"
                                formItemProps={{
                                    name: "postalZone",
                                    label: "Postal Zone",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add Country Code"
                                formItemProps={{
                                    name: "countryIdentificationCode",
                                    label: "Country Code",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<MailOutlined/>}
                                placeholder="Add email"
                                formItemProps={{
                                    name: "client_email",
                                    label: "Client email",
                                    rules: [{required: false, type: "email"}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<PhoneOutlined/>}
                                placeholder="Add phone number"
                                formItemProps={{
                                    name: "phoneNumber",
                                    label: "Phone",
                                    rules: [{required: false}],
                                }}
                            />
                        </Card>
                        <DeleteButton
                            type="text"
                            style={{
                                marginTop: "16px",
                            }}
                            onSuccess={() => {
                                list("clients");
                            }}
                        >
                            Delete client
                        </DeleteButton>
                    </Col>

                    <Col xs={{span: 24}} xl={{span: 16}}>
                        <Card
                            bordered={false}
                            title={
                                <Flex gap={12} align="center">
                                    <ContainerOutlined/>
                                    <Typography.Text>Invoices</Typography.Text>
                                </Flex>
                            }
                            styles={{
                                header: {
                                    padding: "0 16px",
                                },
                                body: {
                                    padding: 0,
                                },
                            }}
                        >
                            <Table
                                dataSource={invoices}
                                pagination={false}
                                loading={isLoading}
                                rowKey={"id"}
                            >
                                <Table.Column title="ID" dataIndex="id" key="id" width={72}/>
                                <Table.Column
                                    title="Date"
                                    dataIndex="invoiceDate"
                                    key="invoiceDate"
                                    render={(date) => (
                                        <DateField value={date} format="D MMM YYYY"/>
                                    )}
                                />
                                <Table.Column
                                    title="Client"
                                    dataIndex="client"
                                    key="client"
                                    render={(client) => client?.client_name}
                                />
                                <Table.Column
                                    title="Amount"
                                    dataIndex="total"
                                    key="total"
                                    render={(total, record) => (
                                        <NumberField
                                            value={total}
                                            options={{style: "currency", currency: record.currency}}
                                        />
                                    )}
                                />
                                <Table.Column
                                    key="actions"
                                    width={64}
                                    render={(_, record: Invoice) => {
                                        return (
                                            <Flex align="center" gap={8}>
                                                <ShowButton
                                                    hideText
                                                    resource="invoices"
                                                    recordItemId={record.id}
                                                    icon={<ExportOutlined/>}
                                                />
                                            </Flex>
                                        );
                                    }}
                                />
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Show>
    );
};
