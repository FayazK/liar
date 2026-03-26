<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BrandProfile;

interface BrandProfileRepositoryInterface
{
    public function getActive(): ?BrandProfile;

    public function createOrUpdate(array $data): BrandProfile;
}
