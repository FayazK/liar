import type { Editor } from 'grapesjs';

export interface SectionTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    html_template: string;
    css_template: string | null;
    thumbnail: string | null;
}

export function registerSectionBlocks(
    editor: Editor,
    templates: Record<string, SectionTemplate[]>,
): void {
    const blockManager = editor.BlockManager;

    Object.entries(templates).forEach(([category, sections]) => {
        sections.forEach((template) => {
            blockManager.add(`section-${template.slug}`, {
                label: template.name,
                category: category.charAt(0).toUpperCase() + category.slice(1),
                content: {
                    type: 'wrapper',
                    components: template.html_template,
                    styles: template.css_template || '',
                },
                media: template.thumbnail
                    ? `<img src="${template.thumbnail}" alt="${template.name}" />`
                    : `<div style="padding:1rem;text-align:center;font-size:0.75rem;color:#999;">${template.name}</div>`,
            });
        });
    });
}
