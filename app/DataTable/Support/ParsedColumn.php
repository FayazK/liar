<?php

declare(strict_types=1);

namespace App\DataTable\Support;

/**
 * Value object representing a parsed column with potential relationship.
 */
final readonly class ParsedColumn
{
    public function __construct(
        public string $column,
        public ?string $relationship = null,
        public ?string $table = null,
    ) {}

    /**
     * Check if this column uses a relationship.
     */
    public function hasRelationship(): bool
    {
        return $this->relationship !== null;
    }

    /**
     * Get the qualified column name (table.column format).
     */
    public function getQualifiedColumn(): string
    {
        if ($this->table !== null) {
            return "{$this->table}.{$this->column}";
        }

        return $this->column;
    }

    /**
     * Parse a column string that may contain relationship notation.
     *
     * @param  string  $columnString  Column string (e.g., 'email' or 'category.name')
     */
    public static function parse(string $columnString): self
    {
        if (! str_contains($columnString, '.')) {
            return new self($columnString);
        }

        $parts = explode('.', $columnString);
        $column = array_pop($parts);
        $relationship = implode('.', $parts);

        return new self($column, $relationship);
    }
}
