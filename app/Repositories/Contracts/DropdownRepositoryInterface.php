<?php

namespace App\Repositories\Contracts;

interface DropdownRepositoryInterface
{
    public function get(string $type, array $params = []);
}
