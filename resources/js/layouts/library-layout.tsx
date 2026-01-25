import { useLibraryState } from '@/hooks/use-library-state';
import { Layout, theme } from 'antd';
import { type ReactNode } from 'react';
import AppLayout from './app-layout';

const { Sider, Content } = Layout;
const { useToken } = theme;

interface LibraryLayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
    preview?: ReactNode;
}

/**
 * Library-specific layout that wraps AppLayout and adds:
 * - Library sidebar (quick access + folder tree) on the left
 * - Preview panel on the right
 *
 * Layout structure:
 * +-------+------------+----------------------------------+------------------+
 * |  App  |  Library   |        Main Content Area         |   Preview Panel  |
 * | Side  |  Sidebar   |   (passed as children)           |   (Toggleable)   |
 * | bar   |   240px    |          Flex: 1                 |      320px       |
 * +-------+------------+----------------------------------+------------------+
 */
export default function LibraryLayout({ children, sidebar, preview }: LibraryLayoutProps) {
    const { token } = useToken();
    const { librarySidebarCollapsed, previewPanelVisible } = useLibraryState();

    const LIBRARY_SIDEBAR_WIDTH = 240;
    const PREVIEW_PANEL_WIDTH = 320;

    return (
        <AppLayout>
            <Layout
                style={{
                    minHeight: 'calc(100vh - 40px - 32px)', // Account for header and padding
                    margin: -token.paddingMD,
                    marginTop: -token.paddingMD,
                }}
            >
                {/* Library Sidebar */}
                {sidebar && (
                    <Sider
                        width={LIBRARY_SIDEBAR_WIDTH}
                        collapsedWidth={0}
                        collapsed={librarySidebarCollapsed}
                        collapsible
                        trigger={null}
                        style={{
                            background: token.colorBgContainer,
                            borderRight: `1px solid ${token.colorBorderSecondary}`,
                            borderTopLeftRadius: token.borderRadiusLG,
                            borderTopRightRadius: token.borderRadiusLG,
                            height: 'calc(100vh - 40px)',
                            position: 'sticky',
                            top: 40,
                            overflow: 'auto',
                        }}
                    >
                        {sidebar}
                    </Sider>
                )}

                {/* Main Content Area */}
                <Content
                    style={{
                        padding: token.paddingMD,
                        background: token.colorBgLayout,
                        minHeight: 'calc(100vh - 40px)',
                        overflow: 'auto',
                    }}
                >
                    {children}
                </Content>

                {/* Preview Panel */}
                {preview && previewPanelVisible && (
                    <Sider
                        width={PREVIEW_PANEL_WIDTH}
                        collapsedWidth={0}
                        collapsed={!previewPanelVisible}
                        collapsible
                        trigger={null}
                        style={{
                            background: token.colorBgContainer,
                            borderLeft: `1px solid ${token.colorBorderSecondary}`,
                            borderTopLeftRadius: token.borderRadiusLG,
                            height: 'calc(100vh - 40px)',
                            position: 'sticky',
                            top: 40,
                            overflow: 'auto',
                        }}
                    >
                        {preview}
                    </Sider>
                )}
            </Layout>
        </AppLayout>
    );
}
