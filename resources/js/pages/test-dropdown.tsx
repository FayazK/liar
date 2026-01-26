import AdvancedSelect from '@/components/advanced-select';
import { Button, Card, Form, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function TestDropdownPage() {
    const [form] = Form.useForm();

    const onFinish = (values: unknown) => {
        console.log('Form values:', values);
        alert(JSON.stringify(values, null, 2));
    };

    return (
        <div className="mx-auto max-w-4xl p-8">
            <Title level={2}>Dropdown Component Tests</Title>
            <Paragraph>
                This page demonstrates all the enhanced dropdown capabilities including taxonomy integration, multi-select, and backward compatibility
                with existing dropdown types.
            </Paragraph>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Backward Compatibility Tests */}
                    <Card title="1. Backward Compatibility - Existing Dropdowns" size="small">
                        <Form.Item label="Timezone (Single Select)" name="timezone_id">
                            <AdvancedSelect type="timezones" placeholder="Select a timezone" />
                        </Form.Item>

                        <Form.Item label="Language (Single Select)" name="language_id">
                            <AdvancedSelect type="languages" placeholder="Select a language" />
                        </Form.Item>

                        <Form.Item label="User (Single Select)" name="user_id">
                            <AdvancedSelect type="users" placeholder="Select a user" />
                        </Form.Item>
                    </Card>

                    {/* Taxonomy Single Select */}
                    <Card title="2. Taxonomy - Single Select" size="small">
                        <Form.Item label="Post Category" name="category_id">
                            <AdvancedSelect type="taxonomies" params={{ taxonomy_type: 'post_categories' }} placeholder="Select a category" />
                        </Form.Item>

                        <Form.Item label="Region" name="region_id">
                            <AdvancedSelect type="taxonomies" params={{ taxonomy_type: 'regions' }} placeholder="Select a region" />
                        </Form.Item>
                    </Card>

                    {/* Multi-Select Tests */}
                    <Card title="3. Multi-Select Mode" size="small">
                        <Form.Item label="Product Tags (Multi-select)" name="tag_ids">
                            <AdvancedSelect
                                type="taxonomies"
                                params={{ taxonomy_type: 'product_tags' }}
                                mode="multiple"
                                placeholder="Select multiple tags"
                            />
                        </Form.Item>

                        <Form.Item label="Users (Multi-select)" name="user_ids">
                            <AdvancedSelect type="users" mode="multiple" placeholder="Select multiple users" />
                        </Form.Item>

                        <Form.Item label="Categories (Multi-select)" name="category_ids">
                            <AdvancedSelect
                                type="taxonomies"
                                params={{ taxonomy_type: 'post_categories' }}
                                mode="multiple"
                                placeholder="Select multiple categories"
                            />
                        </Form.Item>
                    </Card>

                    {/* Tags Mode (Creatable) */}
                    <Card title="4. Tags Mode - Type to Create New Items" size="small">
                        <Paragraph type="secondary">
                            Note: Tags mode allows typing custom values. The onCreate callback would normally save new items to the database.
                        </Paragraph>
                        <Form.Item label="Custom Tags" name="custom_tags">
                            <AdvancedSelect
                                type="taxonomies"
                                params={{ taxonomy_type: 'product_tags' }}
                                mode="tags"
                                placeholder="Type to add custom tags"
                            />
                        </Form.Item>
                    </Card>

                    {/* Initial Values Test */}
                    <Card title="5. Initial Values - Pre-selected Options" size="small">
                        <Paragraph type="secondary">The dropdowns below should have pre-selected values on page load (if IDs exist).</Paragraph>
                        <Form.Item label="Timezone (with initial ID)" name="timezone_with_initial" initialValue={1}>
                            <AdvancedSelect type="timezones" initialId={1} placeholder="Should be pre-selected" />
                        </Form.Item>

                        <Form.Item label="Tags (with multiple initial IDs)" name="tags_with_initial" initialValue={[1, 2]}>
                            <AdvancedSelect
                                type="taxonomies"
                                params={{ taxonomy_type: 'product_tags' }}
                                mode="multiple"
                                initialId={[1, 2]}
                                placeholder="Should have 2 pre-selected tags"
                            />
                        </Form.Item>
                    </Card>

                    {/* Search Functionality */}
                    <Card title="6. Search - Type to Filter Results" size="small">
                        <Paragraph type="secondary">Start typing to search and filter options.</Paragraph>
                        <Form.Item label="Search Categories" name="search_category">
                            <AdvancedSelect type="taxonomies" params={{ taxonomy_type: 'post_categories' }} placeholder="Start typing to search..." />
                        </Form.Item>

                        <Form.Item label="Search Users" name="search_user">
                            <AdvancedSelect type="users" placeholder="Start typing to search users..." />
                        </Form.Item>
                    </Card>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Test Form Submit (Check Console/Alert)
                        </Button>
                    </Form.Item>
                </Space>
            </Form>
        </div>
    );
}
