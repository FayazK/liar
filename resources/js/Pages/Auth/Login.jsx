import GuestLayout from '@/Layouts/GuestLayout';
import {Head, Link, router} from '@inertiajs/react';
import {Alert, Button, Checkbox, Flex, Form, Input} from "antd";
import {useState} from "react";
import {IconAt, IconPasswordUser} from "@tabler/icons-react";

export default function Login({status, canResetPassword}) {
    const [form] =Form.useForm();
    const [remember, setRemember] = useState(false);
    const [processing, setProcessing] = useState(false);

    const submit = (values) => {
        values.remember = remember;
        setProcessing(true);

        router.post(route('login'), values, {
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    form.setFields([
                        {
                            name: key,
                            errors: [errors[key]],
                        },
                    ]);
                });
            },
            onFinish: () => {
                setProcessing(false);
            },
        })
    };

    const handleRememberMe = () => {
        setRemember(!remember);
    };

    return (<GuestLayout>
        <Head title="Log in"/>

        {status && <Alert message={status} type="success" showIcon closable/>}

        <Form onFinish={submit} form={form}>
            <Form.Item
                name="email"
                rules={[{required: true, message: 'Please input your email!',}, {
                    type: 'email', message: 'The input is not valid E-mail!',
                }]}
            >
                <Input prefix={<IconAt size={16} />}/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{required: true, message: 'Please input your password!',}, {
                    min: 6, message: 'The input is not valid password!',
                }]}
            >
                <Input.Password prefix={<IconPasswordUser size={16} />}/>
            </Form.Item>
            <Form.Item>
                <Flex justify={'space-between'}>
                    <Checkbox checked={remember} onChange={handleRememberMe}>Remember me</Checkbox>
                    {canResetPassword && (<Link
                        href={route('password.request')}
                    >
                        Forgot your password?
                    </Link>)}
                </Flex>
            </Form.Item>
            <Form.Item>
                <Button type="primary" block={true} htmlType="submit" loading={processing}>
                    Log in
                </Button>
            </Form.Item>
        </Form>
    </GuestLayout>);
}
