<?php

declare(strict_types=1);

namespace App\DataTable\Definitions;

use Closure;

/**
 * Defines a sortable column configuration for DataTable.
 */
final readonly class SortDefinition
{
    /**
     * @param  string  $name  Sort key name (used in request)
     * @param  string|null  $column  Actual database column (if different from name)
     * @param  string|null  $relationship  Relationship name if sorting through a relation
     * @param  string|null  $aggregate  Aggregate function (count, sum, avg, min, max)
     * @param  Closure|null  $customSort  Custom sort callback
     */
    public function __construct(
        public string $name,
        public ?string $column = null,
        public ?string $relationship = null,
        public ?string $aggregate = null,
        public ?Closure $customSort = null,
    ) {}

    /**
     * Get the actual database column.
     */
    public function getColumn(): string
    {
        return $this->column ?? $this->name;
    }

    /**
     * Check if this sort definition uses a relationship.
     */
    public function hasRelationship(): bool
    {
        return $this->relationship !== null;
    }

    /**
     * Check if this sort uses an aggregate function.
     */
    public function hasAggregate(): bool
    {
        return $this->aggregate !== null;
    }

    /**
     * Check if this sort has a custom sort callback.
     */
    public function hasCustomSort(): bool
    {
        return $this->customSort !== null;
    }

    /**
     * Convert to array for metadata.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'column' => $this->getColumn(),
            'relationship' => $this->relationship,
            'aggregate' => $this->aggregate,
        ];
    }
}
