<?php

declare(strict_types=1);

namespace App\DataTable\Enums;

/**
 * Types of filters supported by the DataTable system.
 */
enum FilterType: string
{
    case Text = 'text';
    case Number = 'number';
    case Date = 'date';
    case DateTime = 'datetime';
    case Boolean = 'boolean';
    case Select = 'select';
    case MultiSelect = 'multi_select';
    case DateRange = 'date_range';

    /**
     * Get the default operators for this filter type.
     *
     * @return array<FilterOperator>
     */
    public function getDefaultOperators(): array
    {
        return match ($this) {
            self::Text => [
                FilterOperator::Equals,
                FilterOperator::NotEquals,
                FilterOperator::Contains,
                FilterOperator::StartsWith,
                FilterOperator::EndsWith,
            ],
            self::Number => [
                FilterOperator::Equals,
                FilterOperator::NotEquals,
                FilterOperator::GreaterThan,
                FilterOperator::GreaterThanOrEquals,
                FilterOperator::LessThan,
                FilterOperator::LessThanOrEquals,
                FilterOperator::Between,
            ],
            self::Date, self::DateTime => [
                FilterOperator::Equals,
                FilterOperator::NotEquals,
                FilterOperator::GreaterThan,
                FilterOperator::LessThan,
                FilterOperator::Between,
            ],
            self::Boolean => [
                FilterOperator::Equals,
            ],
            self::Select => [
                FilterOperator::Equals,
                FilterOperator::NotEquals,
            ],
            self::MultiSelect => [
                FilterOperator::In,
                FilterOperator::NotIn,
            ],
            self::DateRange => [
                FilterOperator::Between,
            ],
        };
    }
}
