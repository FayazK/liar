import GuestLayout from '@/Layouts/GuestLayout';
import {Head, Link, router, useForm} from '@inertiajs/react';
import {Alert, Button, Checkbox, Flex, Form, Input} from "antd";
import {useState} from "react";

export default function Login({status, canResetPassword}) {


    const [remember, setRemember] = useState(false);

    const submit = (values) => {
        values.remember = remember;

        router.post(route('login'), values, {
            onError: () => {
                console.log('error')
            },
        })
    };

    const handleRememberMe = () => {
        setRemember(!remember);
    };

    return (<GuestLayout>
        <Head title="Log in"/>

        {status && <Alert message={status} type="success" showIcon closable/>}

        <Form onFinish={submit}>
            <Form.Item
                label="Email"
                name="email"
                rules={[{required: true, message: 'Please input your email!',}, {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input your password!',}, {
                    min: 6,
                    message: 'The input is not valid E-mail!',
                }]}
            >
                <Input.Password/>
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
