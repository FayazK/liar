import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import axios from '@/lib/axios';
import type { FolderTreeNode, FolderTreeResponse } from '@/types/library';
import { folderTree } from '@/routes/library/api';
import { Spin, theme, Tree, Typography } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useCallback, useEffect, useState } from 'react';

const { useToken } = theme;
const { Text } = Typography;

interface FolderTreeProps {
    currentFolderId: number | null;
    onFolderSelect: (folderId: number) => void;
}

export default function FolderTree({ currentFolderId, onFolderSelect }: FolderTreeProps) {
    const { token } = useToken();
    const { expandedFolders, toggleFolderExpanded } = useLibraryState();
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [loading, setLoading] = useState(true);

    // Convert folder tree nodes to Ant Design tree data nodes
    const convertToTreeData = useCallback((nodes: FolderTreeNode[]): DataNode[] => {
        return nodes.map((node) => ({
            key: node.id.toString(),
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="folder" size={14} color={node.color || token.colorTextSecondary} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
                    {node.is_favorite && <Icon name="star-filled" size={12} color={token.colorWarning} />}
                </span>
            ),
            isLeaf: !node.has_children,
            children: node.children ? convertToTreeData(node.children) : undefined,
        }));
    }, [token]);

    // Fetch folder tree on mount
    useEffect(() => {
        const fetchTree = async () => {
            try {
                const response = await axios.get<FolderTreeResponse>(folderTree.url());
                setTreeData(convertToTreeData(response.data.tree));
            } catch (error) {
                console.error('Failed to fetch folder tree:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, [convertToTreeData]);

    const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
        if (selectedKeys.length > 0) {
            const folderId = Number(selectedKeys[0]);
            onFolderSelect(folderId);
        }
    };

    const handleExpand: TreeProps['onExpand'] = (expandedKeys) => {
        // Update expanded folders in store
        const newExpandedIds = expandedKeys.map((key) => Number(key));
        // Only toggle if there's a difference
        const currentExpandedSet = new Set(expandedFolders);
        const newExpandedSet = new Set(newExpandedIds);

        // Find the toggled folder
        for (const id of newExpandedIds) {
            if (!currentExpandedSet.has(id)) {
                toggleFolderExpanded(id);
                return;
            }
        }
        for (const id of expandedFolders) {
            if (!newExpandedSet.has(id)) {
                toggleFolderExpanded(id);
                return;
            }
        }
    };

    if (loading) {
        return (
            <div style={{ padding: token.paddingMD, textAlign: 'center' }}>
                <Spin size="small" />
            </div>
        );
    }

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
                Folders
            </Text>
            {treeData.length > 0 ? (
                <Tree
                    showLine={{ showLeafIcon: false }}
                    showIcon={false}
                    treeData={treeData}
                    selectedKeys={currentFolderId ? [currentFolderId.toString()] : []}
                    expandedKeys={expandedFolders.map((id) => id.toString())}
                    onSelect={handleSelect}
                    onExpand={handleExpand}
                    style={{
                        background: 'transparent',
                        padding: `0 ${token.paddingXS}px`,
                    }}
                />
            ) : (
                <Text type="secondary" style={{ padding: token.paddingMD, display: 'block' }}>
                    No folders yet
                </Text>
            )}
        </div>
    );
}
