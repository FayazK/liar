import { Form, Button, Flex } from 'antd'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { handleApiError, handleApiSuccess } from '@/Helpers/CONSTANT'
import { updateUser, updateUserProfile } from '@/Helpers/api/user'
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function ProfileEditTab ({ credentials, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // Define initial values based on the credentials
  const initialValues = {
    first_name: credentials?.first_name || 'John',
    last_name: credentials?.last_name || 'Doe',
    email: credentials?.email || 'john.doe@xyz.com',
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const response = await updateUserProfile(credentials.id, values)
      handleApiSuccess(response)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
      form.resetFields()
      onCancel()
      router.reload()
    }
  }

  return (
    <ProForm
      form={form}
      initialValues={initialValues}
      submitter={false} // Remove default submitter
    >
      <ProForm.Group>
        <ProFormText
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'First name is required' }]}
        />
        <ProFormText
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Last name is required' }]}
        />
      </ProForm.Group>
      <ProFormText label="Email" name="email" disabled={true}/>
      <Form.Item>
        <Flex justify="end">
          <Button loading={loading} type="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Flex>
      </Form.Item>
    </ProForm>
  )
}
