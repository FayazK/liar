import type { Permission } from '@/types';
import { groupPermissionsByModule } from '@/utils/permissions';
import { Checkbox, Collapse, theme } from 'antd';
import { useMemo } from 'react';

interface PermissionSelectorProps {
    permissions: Permission[];
    value?: number[];
    onChange?: (value: number[]) => void;
    disabled?: boolean;
}

export function PermissionSelector({ permissions, value = [], onChange, disabled = false }: PermissionSelectorProps) {
    const { token } = theme.useToken();

    const groupedPermissions = useMemo(() => groupPermissionsByModule(permissions), [permissions]);

    const modules = Object.keys(groupedPermissions).sort();

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (!onChange) return;

        if (checked) {
            onChange([...value, permissionId]);
        } else {
            onChange(value.filter((id) => id !== permissionId));
        }
    };

    const handleModuleSelectAll = (modulePermissions: Permission[], checked: boolean) => {
        if (!onChange) return;

        const modulePermissionIds = modulePermissions.map((p) => p.id);

        if (checked) {
            const newValue = [...new Set([...value, ...modulePermissionIds])];
            onChange(newValue);
        } else {
            onChange(value.filter((id) => !modulePermissionIds.includes(id)));
        }
    };

    const getModuleCheckState = (modulePermissions: Permission[]): { checked: boolean; indeterminate: boolean } => {
        const modulePermissionIds = modulePermissions.map((p) => p.id);
        const selectedCount = modulePermissionIds.filter((id) => value.includes(id)).length;

        return {
            checked: selectedCount === modulePermissionIds.length,
            indeterminate: selectedCount > 0 && selectedCount < modulePermissionIds.length,
        };
    };

    const items = modules.map((module) => {
        const modulePermissions = groupedPermissions[module];
        const { checked, indeterminate } = getModuleCheckState(modulePermissions);

        return {
            key: module,
            label: (
                <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{module}</span>
                    <Checkbox
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={(e) => handleModuleSelectAll(modulePermissions, e.target.checked)}
                        disabled={disabled}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Select All
                    </Checkbox>
                </div>
            ),
            children: (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {modulePermissions.map((permission) => {
                        const isChecked = value.includes(permission.id);

                        return (
                            <div
                                key={permission.id}
                                className="rounded-md border p-3 transition-colors"
                                style={{
                                    borderColor: isChecked ? token.colorPrimary : token.colorBorder,
                                    backgroundColor: isChecked ? token.colorPrimaryBg : 'transparent',
                                }}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                    disabled={disabled}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{permission.title}</span>
                                        {permission.description && (
                                            <span className="text-sm" style={{ color: token.colorTextSecondary }}>
                                                {permission.description}
                                            </span>
                                        )}
                                        <code
                                            className="text-xs"
                                            style={{
                                                color: token.colorTextTertiary,
                                                fontFamily: 'ui-monospace, monospace',
                                            }}
                                        >
                                            {permission.key}
                                        </code>
                                    </div>
                                </Checkbox>
                            </div>
                        );
                    })}
                </div>
            ),
        };
    });

    return <Collapse items={items} defaultActiveKey={modules} className="bg-transparent" style={{ borderColor: token.colorBorder }} />;
}
