<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Permissions Configuration
    |--------------------------------------------------------------------------
    |
    | Define all application permissions grouped by module.
    | Structure: 'module' => ['key' => ['title' => '...', 'description' => '...']]
    |
    */

    'users' => [
        'users.view' => [
            'title' => 'View Users',
            'description' => 'View user list and details',
        ],
        'users.create' => [
            'title' => 'Create Users',
            'description' => 'Create new users',
        ],
        'users.update' => [
            'title' => 'Update Users',
            'description' => 'Edit existing users',
        ],
        'users.delete' => [
            'title' => 'Delete Users',
            'description' => 'Delete users from the system',
        ],
    ],

    'roles' => [
        'roles.view' => [
            'title' => 'View Roles',
            'description' => 'View role list and details',
        ],
        'roles.create' => [
            'title' => 'Create Roles',
            'description' => 'Create new roles',
        ],
        'roles.update' => [
            'title' => 'Update Roles',
            'description' => 'Edit existing roles',
        ],
        'roles.delete' => [
            'title' => 'Delete Roles',
            'description' => 'Delete roles from the system',
        ],
        'roles.assign_permissions' => [
            'title' => 'Assign Permissions',
            'description' => 'Assign permissions to roles',
        ],
    ],

    'libraries' => [
        'libraries.view' => [
            'title' => 'View Libraries',
            'description' => 'View library list and details',
        ],
        'libraries.create' => [
            'title' => 'Create Libraries',
            'description' => 'Create new libraries',
        ],
        'libraries.update' => [
            'title' => 'Update Libraries',
            'description' => 'Edit existing libraries',
        ],
        'libraries.delete' => [
            'title' => 'Delete Libraries',
            'description' => 'Delete libraries from the system',
        ],
    ],

    'settings' => [
        'settings.view' => [
            'title' => 'View Settings',
            'description' => 'View application settings',
        ],
        'settings.update' => [
            'title' => 'Update Settings',
            'description' => 'Modify application settings',
        ],
    ],
];
