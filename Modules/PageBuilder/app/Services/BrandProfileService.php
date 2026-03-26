<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Modules\PageBuilder\Models\BrandProfile;
use Modules\PageBuilder\Repositories\BrandProfileRepositoryInterface;

class BrandProfileService
{
    public function __construct(
        private readonly BrandProfileRepositoryInterface $brandProfileRepository,
    ) {}

    public function getActive(): ?BrandProfile
    {
        return $this->brandProfileRepository->getActive();
    }

    public function save(array $data): BrandProfile
    {
        return $this->brandProfileRepository->createOrUpdate($data);
    }
}
