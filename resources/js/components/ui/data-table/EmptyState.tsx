import { Empty, Button, Flex, Typography, theme } from 'antd';
import { SearchOutlined, InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { useToken } = theme;
const { Text, Paragraph } = Typography;

type EmptyStateType = 'no-data' | 'no-results' | 'error';

interface EmptyStateProps {
    type: EmptyStateType;
    searchTerm?: string;
    hasFilters?: boolean;
    onClearFilters?: () => void;
    onRetry?: () => void;
    errorMessage?: string;
    emptyMessage?: string;
    emptyFilterMessage?: string;
}

export function EmptyState({
    type,
    searchTerm,
    hasFilters,
    onClearFilters,
    onRetry,
    errorMessage,
    emptyMessage = 'No data available yet.',
    emptyFilterMessage = 'No results match your search criteria.',
}: EmptyStateProps) {
    const { token } = useToken();

    if (type === 'error') {
        return (
            <Flex
                vertical
                align="center"
                justify="center"
                style={{
                    padding: token.paddingXL,
                    minHeight: 200,
                }}
            >
                <ExclamationCircleOutlined
                    style={{
                        fontSize: 48,
                        color: token.colorError,
                        marginBottom: token.marginMD,
                    }}
                    aria-hidden="true"
                />
                <Text strong style={{ fontSize: 16, marginBottom: token.marginXS }}>
                    Unable to Load Data
                </Text>
                <Paragraph
                    type="secondary"
                    style={{
                        textAlign: 'center',
                        marginBottom: token.marginMD,
                        maxWidth: 400,
                    }}
                >
                    {errorMessage || 'Something went wrong while loading the data. Please try again.'}
                </Paragraph>
                {onRetry && (
                    <Button type="primary" onClick={onRetry}>
                        Try Again
                    </Button>
                )}
            </Flex>
        );
    }

    if (type === 'no-results') {
        return (
            <Flex
                vertical
                align="center"
                justify="center"
                style={{
                    padding: token.paddingXL,
                    minHeight: 200,
                }}
            >
                <SearchOutlined
                    style={{
                        fontSize: 48,
                        color: token.colorTextQuaternary,
                        marginBottom: token.marginMD,
                    }}
                    aria-hidden="true"
                />
                <Text strong style={{ fontSize: 16, marginBottom: token.marginXS }}>
                    No Results Found
                </Text>
                <Paragraph
                    type="secondary"
                    style={{
                        textAlign: 'center',
                        marginBottom: token.marginMD,
                        maxWidth: 400,
                    }}
                >
                    {searchTerm
                        ? `No results found for "${searchTerm}".`
                        : emptyFilterMessage}
                    {hasFilters && ' Try adjusting your filters.'}
                </Paragraph>
                {onClearFilters && (hasFilters || searchTerm) && (
                    <Button onClick={onClearFilters}>Clear All Filters</Button>
                )}
            </Flex>
        );
    }

    // Default: no-data
    return (
        <Empty
            image={<InboxOutlined style={{ fontSize: 48, color: token.colorTextQuaternary }} />}
            description={
                <Flex vertical align="center" gap={token.marginXS}>
                    <Text strong style={{ fontSize: 16 }}>
                        No Data Yet
                    </Text>
                    <Text type="secondary">{emptyMessage}</Text>
                </Flex>
            }
            style={{
                padding: token.paddingXL,
                minHeight: 200,
            }}
        />
    );
}

export default EmptyState;
