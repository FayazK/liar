import { ProCard } from '@ant-design/pro-components'
import { useState } from 'react'
import ProfileEditTab from '@/Components/Profile/ProfileEditTab'
import { Modal } from 'antd'
import UpdateProfilePassword from './UpdateProfilePassword'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/Helpers/atom.js'

const ProfileModal = ({ visible, onCancel }) => {
  const me = useRecoilValue(userAtom)
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <Modal
      title="Profile"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <ProCard
        bodyStyle={{ padding: 0 }}
        tabs={{
          tabPosition: 'left',
          activeKey: activeTab,
          items: [
            {
              label: 'Account Info',
              key: 'profile',
              children:
                <ProfileEditTab
                  credentials={me}
                  onCancel={onCancel}
                />,
            },

            {
              label: 'Password',
              key: 'password',
              children:
                <UpdateProfilePassword
                  credentials={me}
                  onCancel={onCancel}
                />,
            },
          ],
          onChange: (key) => setActiveTab(key),
        }}
      />
    </Modal>
  )
}

export default ProfileModal
