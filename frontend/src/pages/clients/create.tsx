import { useGo, useOne } from "@refinedev/core";
import { useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Modal, Select } from "antd";
import InputMask from "react-input-mask";
import type { Client } from "@/types";

export const ClientsPageCreate = () => {
  const go = useGo();

  const { formProps } = useForm<Client>();

  const getAccountData = async (accountId: string) => {
    return await useOne({
      resource: "accounts",
      id: accountId,
    });
  };

  const { selectProps: selectPropsAccount } = useSelect({
    resource: "accounts",
    optionLabel: "company_name",
    optionValue: "_id",
  });

  const userData = localStorage.getItem("user");
  let userId = "";
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    userId = parsedUserData.userId;
  }

  return (
    <Modal
      okButtonProps={{ form: "create-client-form", htmlType: "submit" }}
      title="Add new client"
      open
      onCancel={() => {
        go({
          to: { resource: "accounts", action: "list" },
          options: { keepQuery: true },
        });
      }}
    >
      <Form
        layout="vertical"
        id="create-client-form"
        {...formProps}
        onFinish={async (values) => {
          userId;
          console.log(values);

          return formProps.onFinish?.({
            ...values,
            userId: userId,
          });
        }}
      >
        <Flex
          vertical
          style={{
            margin: "0 auto",
            width: "420px",
          }}
        >
          <Form.Item
            name="account"
            label="Account"
            rules={[{ required: true }]}
          >
            <Select
              {...selectPropsAccount}
              placeholder="Please select an account"
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Client title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Please enter client title" />
          </Form.Item>
          <Form.Item
            name="owner_name"
            label="Owner name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Please enter owner name" />
          </Form.Item>
          <Form.Item
            name="owner_email"
            label="Owner email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Please enter owner email" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Please enter address" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <InputMask mask="(999) 999-9999">
              {/* @ts-expect-error  <InputMask /> expects JSX.Element but we are using React.ReactNode */}
              {(props: InputProps) => (
                <Input {...props} placeholder="Please enter phone number" />
              )}
            </InputMask>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};
