import { Icon, type IconName } from '@/components/ui/Icon';
import type { QuickAccessCategory } from '@/types/library';
import { Menu, theme, Typography } from 'antd';

const { useToken } = theme;
const { Text } = Typography;

interface QuickAccessItem {
    key: QuickAccessCategory;
    label: string;
    icon: IconName;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
    { key: 'recent', label: 'Recent', icon: 'clock' },
    { key: 'favorites', label: 'Favorites', icon: 'star' },
    { key: 'documents', label: 'Documents', icon: 'file-text' },
    { key: 'images', label: 'Images', icon: 'photo' },
    { key: 'videos', label: 'Videos', icon: 'video' },
    { key: 'audio', label: 'Audio', icon: 'music' },
    { key: 'archives', label: 'Archives', icon: 'file-zip' },
];

interface QuickAccessProps {
    selectedCategory: QuickAccessCategory | null;
    onCategorySelect: (category: QuickAccessCategory) => void;
}

export default function QuickAccess({ selectedCategory, onCategorySelect }: QuickAccessProps) {
    const { token } = useToken();

    const menuItems = QUICK_ACCESS_ITEMS.map((item) => ({
        key: item.key,
        icon: <Icon name={item.icon} size={16} />,
        label: item.label,
        onClick: () => onCategorySelect(item.key),
    }));

    return (
        <div style={{ padding: `${token.paddingSM}px 0` }}>
            <Text
                type="secondary"
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: `0 ${token.paddingMD}px ${token.paddingXS}px`,
                    display: 'block',
                }}
            >
                Quick Access
            </Text>
            <Menu
                mode="inline"
                selectedKeys={selectedCategory ? [selectedCategory] : []}
                items={menuItems}
                style={{
                    border: 'none',
                    background: 'transparent',
                }}
            />
        </div>
    );
}
