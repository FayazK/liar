import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Empty, theme, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { useToken } = theme;

export default function AdminDashboard() {
    const { token } = useToken();

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <PageCard>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        padding: token.paddingLG,
                    }}
                >
                    <Empty description={false}>
                        <Title level={3} style={{ marginBottom: token.marginXS }}>
                            Admin Dashboard
                        </Title>
                        <Paragraph type="secondary">This page is under construction.</Paragraph>
                    </Empty>
                </div>
            </PageCard>
        </AdminLayout>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => page;
