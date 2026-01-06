<?php

declare(strict_types=1);

namespace App\DataTable\Definitions;

use App\DataTable\Enums\SearchType;

/**
 * Defines a searchable column configuration for DataTable.
 */
final readonly class SearchDefinition
{
    /**
     * @param  string  $column  Database column to search
     * @param  int  $weight  Search weight (higher = more important in results)
     * @param  string|null  $relationship  Relationship name if searching through a relation
     * @param  SearchType  $type  Type of search (LIKE or FULLTEXT)
     */
    public function __construct(
        public string $column,
        public int $weight = 1,
        public ?string $relationship = null,
        public SearchType $type = SearchType::Like,
    ) {}

    /**
     * Check if this search definition uses a relationship.
     */
    public function hasRelationship(): bool
    {
        return $this->relationship !== null;
    }

    /**
     * Get the qualified column name for queries.
     */
    public function getQualifiedColumn(string $tableAlias = ''): string
    {
        if ($tableAlias !== '') {
            return "{$tableAlias}.{$this->column}";
        }

        return $this->column;
    }

    /**
     * Convert to array for metadata.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'column' => $this->column,
            'weight' => $this->weight,
            'relationship' => $this->relationship,
            'type' => $this->type->value,
        ];
    }
}
