import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

interface SkeletonIndexProps {
    message: string;
}

export default function SkeletonIndex({ message }: SkeletonIndexProps) {
    return (
        <AdminLayout>
            <Head title="Skeleton Module" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Skeleton Module</h1>
                <p className="mt-2 text-gray-600">{message}</p>
            </div>
        </AdminLayout>
    );
}
