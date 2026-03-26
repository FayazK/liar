<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BrandProfile;

class BrandProfileRepository implements BrandProfileRepositoryInterface
{
    public function getActive(): ?BrandProfile
    {
        return BrandProfile::query()->first();
    }

    public function createOrUpdate(array $data): BrandProfile
    {
        return BrandProfile::updateOrCreate([], $data);
    }
}
