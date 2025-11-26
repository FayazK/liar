<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Library;
use App\Models\User;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class LibraryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Library $library): bool
    {
        return $library->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Library $library): bool
    {
        return $library->user_id === $user->id && ! $library->is_root;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Library $library): bool
    {
        return $library->user_id === $user->id && ! $library->is_root;
    }

    /**
     * Determine whether the user can upload files to the library.
     */
    public function uploadFiles(User $user, Library $library): bool
    {
        return $library->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete a file.
     */
    public function deleteFile(User $user, Media $media): bool
    {
        $library = $media->model;

        return $library instanceof Library && $library->user_id === $user->id;
    }
}
