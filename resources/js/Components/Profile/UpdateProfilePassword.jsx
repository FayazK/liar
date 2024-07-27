import React, { useState } from "react";
import { Button, Row, Col, Form, message } from "antd";
import { ProForm, ProFormText } from "@ant-design/pro-form";
import { updateUserPassword } from "@/Helpers/api/user";
import { handleApiError, handleApiSuccess } from "@/Helpers/CONSTANT";

const UpdateProfilePassword = ({ credentials, visible, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await updateUserPassword(credentials.id, values);
            handleApiSuccess(response);
        } catch (error) {

            handleApiError(error);
            console.error("Error:", error);
        } finally {
            setLoading(false);
            form.resetFields();
            onCancel();
        }
    };

    return (
        <ProForm
            form={form}
            onFinish={handleSubmit}
            submitter={false}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText.Password
                        name="password"
                        label="New Password"
                        placeholder="Enter new password"
                        rules={[
                            { required: true, message: "Please enter your new password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    />
                </Col>

                <Col span={24}>
                    <ProFormText.Password
                        name="password_confirmation"
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match'));
                                },
                            }),
                        ]}
                    />
                </Col>
            </Row>
            <Form.Item>
                <Row justify="end">
                    <Col>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Update Password
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </ProForm>
    );
};

export default UpdateProfilePassword;
