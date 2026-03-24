import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

interface PageBuilderIndexProps {
    message: string;
}

export default function PageBuilderIndex({ message }: PageBuilderIndexProps) {
    return (
        <AdminLayout>
            <Head title="Page Builder" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Page Builder</h1>
                <p className="mt-2 text-gray-600">{message}</p>
            </div>
        </AdminLayout>
    );
}
