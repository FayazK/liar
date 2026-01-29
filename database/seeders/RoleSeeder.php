<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating default roles...');

        // Admin role - all permissions (super admin)
        $adminRole = Role::firstOrCreate(
            ['name' => 'Admin'],
            ['description' => 'Administrator with full access to all features']
        );

        $allPermissions = Permission::all()->pluck('id')->toArray();
        $adminRole->permissions()->sync($allPermissions);

        // Editor role - limited permissions
        $editorRole = Role::firstOrCreate(
            ['name' => 'Editor'],
            ['description' => 'Editor with access to user and library management']
        );

        $editorPermissionKeys = [
            'users.view',
            'users.create',
            'users.update',
            'libraries.view',
            'libraries.create',
            'libraries.update',
            'libraries.delete',
        ];

        $editorPermissions = Permission::whereIn('key', $editorPermissionKeys)->pluck('id')->toArray();
        $editorRole->permissions()->sync($editorPermissions);

        // User role - read-only permissions
        $userRole = Role::firstOrCreate(
            ['name' => 'User'],
            ['description' => 'Standard user with limited access']
        );

        $userPermissionKeys = [
            'users.view',
            'libraries.view',
            'settings.view',
        ];

        $userPermissions = Permission::whereIn('key', $userPermissionKeys)->pluck('id')->toArray();
        $userRole->permissions()->sync($userPermissions);

        $this->command->info('Default roles created successfully!');
    }
}
