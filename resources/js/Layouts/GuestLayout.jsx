import ApplicationLogo from '@/Components/ApplicationLogo';
import {Link} from '@inertiajs/react';
import {Card, Flex, Space} from "antd";

export default function Guest({children}) {
    return (<Flex justify="center" align="center" style={{height: '100vh'}}>
        <Space direction={'vertical'} align={"center"} size={'large'}>
            <ApplicationLogo style={{width: '80px'}}/>
            <Card style={{width: '400px'}}>
                {children}
            </Card>
        </Space>
    </Flex>);
}
