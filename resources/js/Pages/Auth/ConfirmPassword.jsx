import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button, Form, Input, Typography } from 'antd'
import { IconPasswordUser } from '@tabler/icons-react'
import Guest from "@/Layouts/GuestLayout.jsx";

export default function ConfirmPassword () {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const submit = (values) => {
        setLoading(true)
        router.post(route('password.confirm'), values, {
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    form.setFields([{ name: key, errors: [errors[key]] }])
                })
            },
            onFinish: () => {
                setLoading(false)
            },
        })
    }// submit

    return (
            <Guest title={'Confirm Password'}>

                <Typography.Paragraph>
                    This is a secure area of the application. Please confirm your password
                    before continuing.
                </Typography.Paragraph>

                <Form onFinish={submit} form={form}>
                    <Form.Item name={'password'} rules={[
                        { required: true, message: 'Please input your password!' },
                    ]}>
                        <Input.Password prefix={<IconPasswordUser size={18}/>}/>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} htmlType={'submit'} type={'primary'}
                                loading={loading}>
                            Confirm
                        </Button>
                    </Form.Item>
                </Form>
            </Guest>
    )
}
