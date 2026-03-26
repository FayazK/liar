import { Drawer, Tabs } from 'antd';
import type { Editor } from 'grapesjs';
import AiContentRewriter from './AiContentRewriter';
import AiImageGenerator from './AiImageGenerator';
import AiPageGenerator from './AiPageGenerator';
import AiSectionGenerator from './AiSectionGenerator';
import AiStyleSuggestions from './AiStyleSuggestions';

interface AiDrawerProps {
    open: boolean;
    onClose: () => void;
    editor: Editor | null;
}

export default function AiDrawer({ open, onClose, editor }: AiDrawerProps): React.ReactElement {
    const items = [
        {
            key: 'section',
            label: 'Section',
            children: <AiSectionGenerator editor={editor} />,
        },
        {
            key: 'page',
            label: 'Full Page',
            children: <AiPageGenerator editor={editor} />,
        },
        {
            key: 'rewrite',
            label: 'Rewrite',
            children: <AiContentRewriter editor={editor} />,
        },
        {
            key: 'style',
            label: 'Style',
            children: <AiStyleSuggestions editor={editor} />,
        },
        {
            key: 'images',
            label: 'Images',
            children: <AiImageGenerator editor={editor} />,
        },
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            placement="right"
            width={340}
            mask={false}
            styles={{ body: { padding: '0 16px' }, header: { display: 'none' } }}
            style={{ boxShadow: 'none', borderLeft: '1px solid #e5e7eb' }}
        >
            <Tabs items={items} size="small" style={{ marginTop: 8 }} />
        </Drawer>
    );
}
