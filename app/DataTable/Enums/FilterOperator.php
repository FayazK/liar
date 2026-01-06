<?php

declare(strict_types=1);

namespace App\DataTable\Enums;

/**
 * Filter operators supported by the DataTable system.
 */
enum FilterOperator: string
{
    case Equals = 'eq';
    case NotEquals = 'neq';
    case Contains = 'contains';
    case StartsWith = 'starts_with';
    case EndsWith = 'ends_with';
    case GreaterThan = 'gt';
    case GreaterThanOrEquals = 'gte';
    case LessThan = 'lt';
    case LessThanOrEquals = 'lte';
    case Between = 'between';
    case In = 'in';
    case NotIn = 'not_in';
    case IsNull = 'is_null';
    case IsNotNull = 'is_not_null';

    /**
     * Get the SQL operator equivalent.
     */
    public function getSqlOperator(): string
    {
        return match ($this) {
            self::Equals => '=',
            self::NotEquals => '!=',
            self::Contains, self::StartsWith, self::EndsWith => 'LIKE',
            self::GreaterThan => '>',
            self::GreaterThanOrEquals => '>=',
            self::LessThan => '<',
            self::LessThanOrEquals => '<=',
            self::Between => 'BETWEEN',
            self::In => 'IN',
            self::NotIn => 'NOT IN',
            self::IsNull => 'IS NULL',
            self::IsNotNull => 'IS NOT NULL',
        };
    }

    /**
     * Check if this operator requires a value.
     */
    public function requiresValue(): bool
    {
        return match ($this) {
            self::IsNull, self::IsNotNull => false,
            default => true,
        };
    }

    /**
     * Check if this operator requires an array value.
     */
    public function requiresArrayValue(): bool
    {
        return match ($this) {
            self::Between, self::In, self::NotIn => true,
            default => false,
        };
    }
}
