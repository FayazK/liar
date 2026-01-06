<?php

declare(strict_types=1);

namespace App\DataTable\Definitions;

use App\DataTable\Enums\FilterOperator;
use App\DataTable\Enums\FilterType;

/**
 * Defines a filter configuration for a DataTable column.
 */
final readonly class FilterDefinition
{
    /**
     * @param  string  $name  Filter name/key (e.g., 'email', 'category.name' for relationships)
     * @param  FilterType  $type  Type of filter (determines available operators and validation)
     * @param  array<FilterOperator>|null  $operators  Allowed operators (null = use type defaults)
     * @param  string|null  $relationship  Relationship name if filtering through a relation
     * @param  string|null  $column  Actual database column (if different from name)
     * @param  array<array{value: mixed, label: string}>  $options  Options for select/multi-select filters
     * @param  string|null  $label  Human-readable label for the filter
     * @param  string|null  $placeholder  Placeholder text for the filter input
     */
    public function __construct(
        public string $name,
        public FilterType $type,
        public ?array $operators = null,
        public ?string $relationship = null,
        public ?string $column = null,
        public array $options = [],
        public ?string $label = null,
        public ?string $placeholder = null,
    ) {}

    /**
     * Get the allowed operators for this filter.
     *
     * @return array<FilterOperator>
     */
    public function getAllowedOperators(): array
    {
        return $this->operators ?? $this->type->getDefaultOperators();
    }

    /**
     * Get the actual database column name.
     */
    public function getColumn(): string
    {
        return $this->column ?? $this->getColumnFromName();
    }

    /**
     * Extract column name from the filter name (handles relationship.column format).
     */
    private function getColumnFromName(): string
    {
        if ($this->relationship !== null) {
            $parts = explode('.', $this->name);

            return end($parts);
        }

        return $this->name;
    }

    /**
     * Check if this filter uses a relationship.
     */
    public function hasRelationship(): bool
    {
        return $this->relationship !== null;
    }

    /**
     * Check if the given operator is allowed for this filter.
     */
    public function isOperatorAllowed(FilterOperator $operator): bool
    {
        return in_array($operator, $this->getAllowedOperators(), true);
    }

    /**
     * Generate validation rules for the filter value.
     *
     * @return array<int, string>
     */
    public function getValidationRules(): array
    {
        return match ($this->type) {
            FilterType::Text => ['nullable', 'string', 'max:255'],
            FilterType::Number => ['nullable', 'numeric'],
            FilterType::Date => ['nullable', 'date'],
            FilterType::DateTime => ['nullable', 'date'],
            FilterType::Boolean => ['nullable'],  // Allow any, we'll coerce to bool in filter
            FilterType::Select => ['nullable', 'string'],
            FilterType::MultiSelect => ['nullable', 'array'],
            FilterType::DateRange => ['nullable', 'array', 'size:2'],
        };
    }

    /**
     * Convert to array for frontend consumption (filter metadata).
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type->value,
            'operators' => array_map(
                fn (FilterOperator $op) => $op->value,
                $this->getAllowedOperators()
            ),
            'options' => $this->options,
            'label' => $this->label ?? $this->generateLabel(),
            'placeholder' => $this->placeholder,
        ];
    }

    /**
     * Generate a human-readable label from the filter name.
     */
    private function generateLabel(): string
    {
        $name = $this->column ?? $this->name;
        $name = str_replace(['_', '.'], ' ', $name);

        return ucwords($name);
    }
}
