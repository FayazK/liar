import {Link, router} from '@inertiajs/react'
import {Alert, Button, Flex, Form, Input, Typography} from 'antd'
import {IconAt} from '@tabler/icons-react'
import {useState} from 'react'
import Guest from "@/Layouts/GuestLayout.jsx";

export default function ForgotPassword() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)

    const submit = (values) => {
        setLoading(true)
        router.post(route('password.email'), values, {
            onSuccess: (props) => {
                setStatus(props.props.status)
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    form.setFields([{name: key, errors: [errors[key]]}])
                })
            },
            onFinish: () => {
                setLoading(false)
                form.setFieldValue('email', '')
            },
        })
    }// submit

    return (
            <Guest title={'Forgot Password'}>
                {status && <Alert style={{marginBottom: '1rem'}} message={status} type={'success'} showIcon={true}
                                  closable={true}/>}

                <Typography.Paragraph>
                    Forgot your password? No problem. Just let us know your email address
                    and we will email you a password
                    reset link that will allow you to choose a new one.
                </Typography.Paragraph>

                <Form form={form} onFinish={submit}>
                    <Form.Item name={'email'} rules={[
                        {required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'The input is not valid E-mail!'},
                    ]}>
                        <Input placeholder={'abc@xyz'} prefix={<IconAt size={18}/>}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'} block={true}
                                loading={loading}>
                            Email Password Reset Link
                        </Button>
                    </Form.Item>
                    <Flex justify={'space-around'}>
                        <Link href={route('login')}>Back to Login</Link>
                    </Flex>
                </Form>
            </Guest>
    )
}
