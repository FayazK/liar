import { Button, Dropdown, Flex, Typography } from 'antd'
import {
  IconHome,
  IconLogout,
  IconUserCog,
  IconSettings,
  IconUser,
  IconBook,
  IconStar, IconBuilding, IconForms,
} from '@tabler/icons-react'

import { PageContainer, ProLayout } from '@ant-design/pro-components'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { AdminMenu } from '@/Components/Layout/AdminMenu.jsx'
import { Toaster } from 'react-hot-toast'
import ApplicationLogo from '@/Components/ApplicationLogo.jsx'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { permissionsAtom, userAtom } from '@/Helpers/atom.js'
import ProfileModal from '@/Components/Profile/ProfileModal'
import useCustomScrollbars from '@/Components/Hooks/UseCustomScrollBars.jsx'


const icons = [IconHome, IconSettings, IconUser, IconBook, IconStar]

const AppLayout = ({
  children,
  title,
  subtitle,
  actions,
  loading,
  breadcrumbTitle,
  subBreadcrumbTitle,
}) => {
  const [visible, setVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [taxonomySetting, setTaxonomySetting] = useState(null)
  const setUser = useSetRecoilState(userAtom)
  useCustomScrollbars()

  const { auth: user } = usePage().props
  const userData = user?.user

  const setPermission = useSetRecoilState(permissionsAtom)

  useEffect(() => {
    setPermission(user.permissions)
  }, [user.permissions])

  useEffect(() => {
    if (user?.taxonomies) {
      setTaxonomySetting(user?.taxonomies)
    }
    setUser(user)
  }, [])

  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * icons.length)
    return icons[randomIndex]
  }

  const changeTaxonomyData = () => {
    if (!taxonomySetting) {
      return []
    }
    let parseData = taxonomySetting
    return Object.keys(parseData).map(key => {
      const IconComponent = getRandomIcon()

      return {
        key: key,
        path: '/' + key,
        name: <Link href={route('taxonomies.listing',
          key)}>{parseData[key].plural}</Link>,
        icon: <IconComponent size={20}/>,
      }
    })
  }

  const handleModalClose = () => {
    setRefreshKey(prevKey => prevKey + 1)
    setVisible(false)
  }

  const handleProfileClick = () => {
    setVisible(true)
  }

  const taxonomyMenuItem = changeTaxonomyData()
  const menuItems = AdminMenu(taxonomyMenuItem)

  return (
    <ProLayout
      title={'Spark CRM'}
      fixedHeader={true}
      siderWidth={240}
      fixSiderbar={true}
      menu={{
        loading: false,
      }}
      actionsRender={props => {
        if (props.isMobile) return []
        if (typeof window === 'undefined') return []
        return [
          <Button type={'text'} icon={<IconForms />} onClick={() => router.visit(route('custom-fields.index'))}/>,
          <Button type={'text'} icon={<IconSettings/>} onClick={ ()=>router.visit(route('settings.index')) } />,
        ]
      }}
      headerTitleRender={(logo, title, _) => {
        const defaultDom = (
          <a>
            {logo}
            {title}
          </a>
        )
        if (typeof window === 'undefined') return defaultDom
        if (document.body.clientWidth < 1400) {
          return defaultDom
        }
        if (_.isMobile) return defaultDom
        return <>{defaultDom}</>
      }}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'large',
        title: <span>{userData?.first_name + ' ' + userData?.last_name}</span>,
        render: (props, dom) => {
          return (
            <Dropdown
              overlayStyle={{ maxWidth: '180px', width: '100%' }}
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <IconUserCog size={18}/>,
                    label: 'Profile',
                    onClick: handleProfileClick,
                  },
                  {
                    key: 'logout',
                    icon: <IconLogout size={18}/>,
                    label: 'Logout',
                    danger: true,
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          )
        },
      }}
      menuFooterRender={props => {
        if (props?.collapsed) return ''
        return (
          <Flex align={'center'} justify={'space-between'} vertical={true}>
            <Typography.Text>&copy; {new Date().getFullYear()} Spark
              CRM</Typography.Text>
          </Flex>
        )
      }}
      logo={<ApplicationLogo width={'25px'}/>}
      route={{
        path: '/',
        routes: menuItems,
      }}
      onMenuHeaderClick={e => console.log(e)}
      layout={'mix'}
    >
      <Head title={title}/>
      <PageContainer
        loading={loading}
        title={title}
        extra={actions}
        subTitle={subtitle}
      >
        {children}
      </PageContainer>
      <Toaster/>
      <ProfileModal visible={visible} onCancel={handleModalClose}
                    key={refreshKey}/>
    </ProLayout>
  )
}
export default AppLayout
