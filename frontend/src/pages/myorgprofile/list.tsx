import {type HttpError, useNavigation} from "@refinedev/core";
import {DeleteButton, Show, useForm} from "@refinedev/antd";
import {Card, Col, Divider, Flex, Form, Row, Typography} from "antd";
import {
    BankOutlined,
    EnvironmentOutlined,
    MailOutlined,
    NumberOutlined,
    PhoneOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {FormItemEditableInputText, FormItemEditableText, FormItemUploadLogo,} from "@/components/form";
import type {MyOrgProfile} from "@/types";


export const MyOrgProfilePageEdit = () => {
    const {listUrl} = useNavigation();

    const {formProps, query: queryResult} = useForm<
        MyOrgProfile,
        HttpError,
        MyOrgProfile
    >({
        resource: "myorgprofile",
        redirect: false,
        id: "1",
        meta: {
            populate: ["logo", "myorgprofile"],
        },
        queryOptions: {
            enabled: true, // always try to fetch
            onSuccess: (data) => {
                // if no data is returned, initialize empty form
                if (!data?.data) {
                    formProps.form?.resetFields();
                }
            },
        },
    });
    const myOrgProfile = queryResult?.data?.data;
    const isLoading = queryResult?.isLoading;

    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    return (
        <Show
            title="MyOrgProfile"
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
                        // logo: base64Logo,
                    } as MyOrgProfile);
                }}
                layout="vertical"
            >
                <Row>
                    <Col span={24}>
                        <Flex gap={16}>
                            <FormItemUploadLogo
                                isLoading={isLoading}
                                label={myOrgProfile?.partyLegalEntityRegistrationName || " "}
                                onUpload={() => {
                                    formProps.form?.submit();
                                }}
                            />
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
                                    <BankOutlined/>
                                    <Typography.Text>MyOrgProfile info</Typography.Text>
                                </Flex>
                            }
                        >
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<UserOutlined/>}
                                placeholder="Add Registration name"
                                formItemProps={{
                                    name: "partyLegalEntityRegistrationName",
                                    label: "Organization Registration Name",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<NumberOutlined/>}
                                placeholder="Add CRN"
                                formItemProps={{
                                    name: "partyId",
                                    label: "Commercial Registration Number",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
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
                                placeholder="Add VAT number"
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
                                    rules: [{required: false}],
                                }}
                            />
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add Building No"
                                formItemProps={{
                                    name: "buildingNumber",
                                    label: "Building Number",
                                    rules: [{required: false}],
                                }}
                            />
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
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<MailOutlined/>}
                                placeholder="Add Email"
                                formItemProps={{
                                    name: "email",
                                    label: "Email",
                                    rules: [{required: false}],
                                }}
                            />
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<PhoneOutlined/>}
                                placeholder="Add Phone Number"
                                formItemProps={{
                                    name: "phoneNumber",
                                    label: "Add Phone Number",
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
                                window.location.href = listUrl("myorgprofile");
                            }}
                        >
                            Delete myOrgProfile
                        </DeleteButton>
                    </Col>
                </Row>
            </Form>
        </Show>
    );
};
