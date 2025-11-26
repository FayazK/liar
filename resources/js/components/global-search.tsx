import { dashboard } from '@/routes';
import { DashboardOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { Empty, Flex, Input, List, Modal, Typography, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface SearchResult {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: React.ReactNode;
    category: 'pages' | 'settings' | 'actions';
}

// Define searchable items
const searchableItems: SearchResult[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'View your dashboard',
        url: dashboard().url,
        icon: <DashboardOutlined />,
        category: 'pages',
    },
    {
        id: 'account',
        title: 'Account',
        description: 'Manage your account settings',
        url: '/settings/account',
        icon: <SettingOutlined />,
        category: 'settings',
    },
    {
        id: 'profile',
        title: 'Profile',
        description: 'Edit your profile information',
        url: '/settings/account#profile',
        icon: <UserOutlined />,
        category: 'settings',
    },
    {
        id: 'password',
        title: 'Password',
        description: 'Change your password',
        url: '/settings/account#password',
        icon: <SettingOutlined />,
        category: 'settings',
    },
    {
        id: 'appearance',
        title: 'Appearance',
        description: 'Customize theme and appearance',
        url: '/settings/account#appearance',
        icon: <SettingOutlined />,
        category: 'settings',
    },
];

interface GlobalSearchProps {
    open: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { token } = useToken();

    // Filter results based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredResults(searchableItems);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = searchableItems.filter(
                (item) => item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
            );
            setFilteredResults(filtered);
        }
        setSelectedIndex(0); // Reset selection when results change
    }, [searchQuery]);

    // Navigate to selected result
    const navigateToResult = useCallback(
        (result: SearchResult) => {
            router.visit(result.url);
            onClose();
            setSearchQuery('');
        },
        [onClose],
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (filteredResults.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredResults[selectedIndex]) {
                        navigateToResult(filteredResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        },
        [filteredResults, selectedIndex, navigateToResult, onClose],
    );

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [open]);

    const getCategoryLabel = (category: SearchResult['category']) => {
        switch (category) {
            case 'pages':
                return 'Pages';
            case 'settings':
                return 'Settings';
            case 'actions':
                return 'Actions';
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={600}
            styles={{
                body: { padding: 0 },
            }}
        >
            <Flex vertical>
                {/* Search Input */}
                <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}` }}>
                    <Input
                        autoFocus
                        size="large"
                        placeholder="Search pages, settings, and actions..."
                        prefix={<SearchOutlined />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ border: 'none' }}
                    />
                </div>

                {/* Results List */}
                <div
                    style={{
                        maxHeight: '400px',
                        overflow: 'auto',
                    }}
                >
                    {filteredResults.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No results found" style={{ padding: '32px' }} />
                    ) : (
                        <List
                            dataSource={filteredResults}
                            renderItem={(item, index) => (
                                <List.Item
                                    key={item.id}
                                    onClick={() => navigateToResult(item)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        backgroundColor: index === selectedIndex ? token.colorPrimaryBg : 'transparent',
                                        borderLeft: index === selectedIndex ? `3px solid ${token.colorPrimary}` : '3px solid transparent',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <Flex align="center" gap="middle" style={{ width: '100%' }}>
                                        <div
                                            style={{
                                                fontSize: '20px',
                                                color: token.colorPrimary,
                                            }}
                                        >
                                            {item.icon}
                                        </div>
                                        <Flex vertical style={{ flex: 1 }}>
                                            <Text strong>{item.title}</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {item.description}
                                            </Text>
                                        </Flex>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {getCategoryLabel(item.category)}
                                        </Text>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    )}
                </div>

                {/* Footer Hint */}
                <div
                    style={{
                        padding: '8px 16px',
                        borderTop: `1px solid ${token.colorBorder}`,
                        backgroundColor: token.colorBgLayout,
                    }}
                >
                    <Flex justify="space-between" align="center">
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            <kbd
                                style={{
                                    padding: '2px 6px',
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                }}
                            >
                                ↑
                            </kbd>
                            <kbd
                                style={{
                                    padding: '2px 6px',
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '4px',
                                    marginRight: '8px',
                                }}
                            >
                                ↓
                            </kbd>
                            to navigate
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            <kbd
                                style={{
                                    padding: '2px 6px',
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                }}
                            >
                                ↵
                            </kbd>
                            to select
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            <kbd
                                style={{
                                    padding: '2px 6px',
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                }}
                            >
                                ESC
                            </kbd>
                            to close
                        </Text>
                    </Flex>
                </div>
            </Flex>
        </Modal>
    );
}

/**
 * Hook to manage global search state and keyboard shortcut
 */
export function useGlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }

            // Forward slash (/) - common search shortcut
            if (e.key === '/' && !isInputFocused()) {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return { isOpen, openSearch: () => setIsOpen(true), closeSearch: () => setIsOpen(false) };
}

// Helper to check if an input/textarea is currently focused
function isInputFocused() {
    const activeElement = document.activeElement;
    return (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute('contenteditable') === 'true'
    );
}
