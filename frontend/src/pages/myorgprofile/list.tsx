import {type HttpError, useNavigation} from "@refinedev/core";
import {DeleteButton, Edit, Show, useForm} from "@refinedev/antd";
import {Card, Col, Divider, Flex, Form, Row, Space, Typography, Modal, Button, Alert, Input, Spin} from "antd";
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
import {useState, useEffect} from "react";
import {BASE_URL_API_V1, ZATCA_URLS} from "@/utils/urls";

import {UseToastHelpers} from "@/components/toastHelper/UseToastHelpers";

const plan_type = import.meta.env.VITE_APP_PLAN_TYPE;

const {Text} = Typography;

export const MyOrgProfilePageEdit = () => {

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

        const [loading, setLoading] = useState(false);
        const {showSuccess, showError} = UseToastHelpers();
        const isTrialAccount = plan_type === "trial";

        const [showModal, setShowModal] = useState(false);
        const [onboardingComplete, setOnboardingComplete] = useState(myOrgProfile?.onboarding_complete || false);
        const [otp, setOtp] = useState("");

        useEffect(() => {
                if (!myOrgProfile?.onboarding_complete) {
                    setShowModal(true);
                    setOnboardingComplete(false);
                } else {
                    setShowModal(false);
                    setOnboardingComplete(true);
                }
            }, [myOrgProfile]
        );

        const handleCompleteOnboarding = async () => {
            if (!myOrgProfile) return; // safety check
            setLoading(true);

            const response = await fetch(ZATCA_URLS.ONBOARD_CLIENT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otp: otp,
                }),
            });
            setLoading(false);
            setShowModal(false);
            if (response.status == 200 || response.status == 201) {
                showSuccess("status:" + response.status, "Successfully Onboarded Client on Zatca");
                setOnboardingComplete(true);
            } else {
                showError("status:" + response.status, "Client onboarding on Zatca Failed!!");
                setOnboardingComplete(false);
            }
        };


        return (
            <>
                <Spin spinning={loading} tip="Processing...">
                    <Edit
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

                        <Form disabled={onboardingComplete}
                              {...formProps}
                              onFinish={async (values) => {
                                  return fetch(`${BASE_URL_API_V1}/myorgprofile/1`, {
                                      method: "PATCH",
                                      headers: {"Content-Type": "application/json"},
                                      body: JSON.stringify({...values, userId}),
                                  });
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

                                {isTrialAccount && (
                                    <Col xs={24} xl={12}>
                                        <Card
                                            bordered={false}
                                            styles={{body: {padding: "2rem 1rem"}}}
                                            title={
                                                <Flex gap={12} align="center">
                                                    <Typography.Text strong>Click below to Complete
                                                        Onboarding</Typography.Text>
                                                </Flex>
                                            }
                                        >
                                            <Space
                                                direction="vertical"
                                                size="large"
                                                style={{
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Button
                                                    size="large"
                                                    type="primary"
                                                    onClick={handleCompleteOnboarding}
                                                    disabled={onboardingComplete}
                                                    style={{
                                                        width: 220,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {onboardingComplete ? "Onboarding Completed" : "Complete Onboarding"}
                                                </Button>
                                            </Space>
                                        </Card>
                                    </Col>)}

                                {/* RIGHT SIDE — ZATCA OTP Section */}
                                {!isTrialAccount && (
                                    <Col xs={24} xl={12}>
                                        <Card
                                            bordered={false}
                                            styles={{body: {padding: "2rem 1rem"}}}
                                            title={
                                                <Flex gap={12} align="center">
                                                    <Typography.Text strong>ZATCA OTP Verification</Typography.Text>
                                                </Flex>
                                            }
                                        >
                                            <Space
                                                direction="vertical"
                                                size="large"
                                                style={{
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Text strong style={{fontSize: 16}}>
                                                    Enter your 5-digit ZATCA OTP to complete onboarding
                                                </Text>

                                                <Input.OTP
                                                    length={5}
                                                    value={otp}
                                                    size="large"
                                                    onChange={(value) => setOtp(value)}
                                                    disabled={onboardingComplete}
                                                    style={{
                                                        justifyContent: "center",
                                                        gap: 10,
                                                    }}
                                                    type="number"
                                                />

                                                <Button
                                                    size="large"
                                                    type="primary"
                                                    onClick={handleCompleteOnboarding}
                                                    disabled={otp.length !== 5 || onboardingComplete}
                                                    style={{
                                                        width: 220,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {onboardingComplete ? "Onboarding Completed" : "Complete Onboarding"}
                                                </Button>

                                                <Alert
                                                    type="info"
                                                    showIcon
                                                    message="🔐 How to Generate Your ZATCA OTP"
                                                    description={
                                                        <Space direction="vertical" size={"large"}
                                                               style={{display: "flex"}}>
                                                            <Text>
                                                                1. Go to ZATCA Fatoora Portal:{" "} <br/>
                                                                Link:{" "}
                                                                <a
                                                                    href="https://fatoora.zatca.gov.sa"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    https://fatoora.zatca.gov.sa
                                                                </a>
                                                            </Text>
                                                            <Text>2. Log in using your VAT/TIN credentials or Nafath.</Text>
                                                            <Text>3. Open “E-Invoicing (Fatoora)” → “Compliance / Device
                                                                Onboarding”.</Text>
                                                            <Text>4. Click “Generate OTP” — a 5-digit code will appear
                                                                (valid
                                                                for 1 hour).</Text>
                                                            <Text>5. Enter the OTP in this application to complete
                                                                onboarding.</Text>
                                                        </Space>
                                                    }/>


                                            </Space>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </Form>
                    </Edit>
                </Spin>

                {!queryResult?.isLoading && showModal && (
                    <Modal
                        open={showModal}
                        onCancel={() => setShowModal(false)}
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
                        <Divider/>

                        <Alert
                            type="warning"
                            showIcon
                            message="After onboarding is completed:"
                            description={
                                <>
                                    <p>Your organization details will be locked and cannot be edited directly.</p>
                                    <p>These details will be used as your official seller information on all invoices.</p>
                                    <p>To make future changes, please contact your service provider/vendor.</p>
                                </>
                            }
                        />
                    </Modal>
                )}
            </>
        );
    }
;
