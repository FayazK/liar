import { Icon } from '@/components/ui/Icon';
import { Button, Flex, theme } from 'antd';
import type { ContentHeaderRightProps } from './types';

const { useToken } = theme;

/**
 * Right section of ContentHeader containing:
 * - Save/Discard buttons (visible when isDirty is true)
 * - Record pagination with prev/next arrows
 */
export default function ContentHeaderRight({
    isDirty,
    isSaving,
    onSave,
    onDiscard,
    saveLabel = 'Save',
    discardLabel = 'Discard',
    recordNavigation,
    actionButtons,
}: ContentHeaderRightProps) {
    const { token } = useToken();

    const hasSaveDiscard = isDirty && onSave && onDiscard;
    const hasRecordNav = recordNavigation && recordNavigation.total > 0;
    const hasActionButtons = actionButtons && actionButtons.length > 0;
    const hasContent = hasSaveDiscard || hasRecordNav || hasActionButtons;

    if (!hasContent) {
        return null;
    }

    return (
        <Flex align="center" gap={token.marginSM} style={{ flexShrink: 0 }}>
            {/* Custom Action Buttons */}
            {hasActionButtons && (
                <Flex align="center" gap={token.marginXS}>
                    {actionButtons.map((action, index) => (
                        <Button
                            key={index}
                            type={action.type || 'default'}
                            size="small"
                            danger={action.danger}
                            onClick={action.onClick}
                            loading={action.loading}
                            disabled={action.disabled}
                            icon={action.icon ? <Icon name={action.icon} size={14} /> : undefined}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Flex>
            )}

            {/* Save/Discard Buttons - only show when form is dirty */}
            {hasSaveDiscard && (
                <Flex align="center" gap={token.marginXS}>
                    <Button size="small" onClick={onDiscard} disabled={isSaving}>
                        {discardLabel}
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={onSave}
                        loading={isSaving}
                        icon={<Icon name="check" size={14} />}
                    >
                        {saveLabel}
                    </Button>
                </Flex>
            )}

            {/* Record Pagination */}
            {hasRecordNav && (
                <Flex
                    align="center"
                    gap={4}
                    style={{
                        borderLeft: hasSaveDiscard ? `1px solid ${token.colorBorderSecondary}` : undefined,
                        paddingLeft: hasSaveDiscard ? token.marginSM : 0,
                    }}
                >
                    <Button
                        type="text"
                        size="small"
                        icon={<Icon name="chevron-left" size={14} />}
                        onClick={recordNavigation.onPrevious}
                        disabled={recordNavigation.current <= 1}
                        aria-label={`Previous ${recordNavigation.label || 'record'}`}
                    />
                    <span
                        style={{
                            fontSize: 12,
                            color: token.colorTextSecondary,
                            minWidth: 'fit-content',
                        }}
                    >
                        {recordNavigation.current} / {recordNavigation.total}
                    </span>
                    <Button
                        type="text"
                        size="small"
                        icon={<Icon name="chevron-right" size={14} />}
                        onClick={recordNavigation.onNext}
                        disabled={recordNavigation.current >= recordNavigation.total}
                        aria-label={`Next ${recordNavigation.label || 'record'}`}
                    />
                </Flex>
            )}
        </Flex>
    );
}
