import {type HttpError, useNavigation} from "@refinedev/core";
import {DeleteButton, Edit, Show, useForm} from "@refinedev/antd";
import {Card, Col, Divider, Flex, Form, Row, Space, Typography, Modal, Button} from "antd";
import {
    BankOutlined,
    EnvironmentOutlined,
    MailOutlined,
    NumberOutlined,
    PhoneOutlined,
    PieChartOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {FormItemEditableInputText, FormItemEditableText, FormItemUploadLogo,} from "@/components/form";
import type {MyOrgProfile} from "@/types";
import {useAuth0} from "@auth0/auth0-react";
import {useState, useEffect} from "react";

const {Text} = Typography;


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

    const {user, getAccessTokenSilently} = useAuth0();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const metadata = user?.["https://jawad-crm/user_metadata"];
        if (metadata && !metadata.onboarding_complete) {
            setShowModal(true);
        }
    }, [user]);

    const handleCompleteOnboarding = async () => {
        if (!user) return; // safety check

        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: "https://jawad-crm.us.auth0.com/api/v2/",
                scope: "update:users",
            },
        });

        await fetch(`https://jawad-crm.us.auth0.com/api/v2/users/${user.sub}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_metadata: {
                    ...(user["https://jawad-crm/user_metadata"] || {}),
                    onboarding_complete: true,
                },
            }),
        });

        setShowModal(false);
    };


    return (
        <>
            <Edit>
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
                        <Row gutter={16} align="middle">
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
                                <Button size="large" key="complete" type="primary" onClick={handleCompleteOnboarding}>
                                    Complete Onboarding
                                </Button>
                            </Flex>
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
                                        icon={<BankOutlined/>}
                                        placeholder="Business Type"
                                        formItemProps={{
                                            name: "business_type",
                                            label: "Business Type",
                                            rules: [{required: true}],
                                        }}
                                    />

                                    <Divider style={{margin: 0}}/>
                                    <FormItemEditableInputText
                                        loading={isLoading}
                                        icon={<BankOutlined/>}
                                        placeholder="Organization Unit"
                                        formItemProps={{
                                            name: "organization_unit",
                                            label: "Organization Unit",
                                            rules: [{required: true}],
                                        }}
                                    />

                                    <Divider style={{margin: 0}}/>
                                    <FormItemEditableInputText
                                        loading={isLoading}
                                        icon={<BankOutlined/>}
                                        placeholder="Industry Type"
                                        formItemProps={{
                                            name: "industry_type",
                                            label: "Industry Type",
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
                                        placeholder="Saudi National address"
                                        formItemProps={{
                                            name: "saudi_national_address",
                                            label: "Saudi National Address (Short code preferred)",
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
                            </Col>
                        </Row>
                    </Form>
                </Show>
            </Edit>

            <Modal
                open={showModal}
                title={
                    <Space>
                        <ExclamationCircleOutlined style={{color: "red", fontSize: 20}}/>
                        <span>Onboarding Required</span>
                    </Space>
                }
                footer={[
                    <Button key="close" onClick={() => setShowModal(false)}>
                        Close
                    </Button>,
                ]}
            >
                <Text strong style={{fontSize: "16px"}}>
                    Please review your organization details carefully before continuing.
                </Text>
                <br/>
                <Text style={{fontSize: "16px"}}>
                    These details will be submitted to <b>ZATCA (Saudi Government)</b>.
                </Text>
                <br/>
                <br/>
                <Text style={{fontSize: "16px"}}>
                    Once Done, Click on <b>'Complete Onboarding'</b> Button to continue.
                </Text>
            </Modal>
        </>
    );
};
