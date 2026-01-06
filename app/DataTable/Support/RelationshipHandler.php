<?php

declare(strict_types=1);

namespace App\DataTable\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Handles relationship resolution and join operations for DataTable queries.
 */
final class RelationshipHandler
{
    /**
     * Track applied joins to prevent duplicates.
     *
     * @var array<string, string>
     */
    private array $appliedJoins = [];

    /**
     * Parse a column string that may contain relationship notation.
     */
    public function parseColumn(string $column): ParsedColumn
    {
        return ParsedColumn::parse($column);
    }

    /**
     * Apply a join for the given relationship and return the qualified column.
     */
    public function applyJoinAndGetColumn(Builder $query, string $column, ?string $relationship): string
    {
        if ($relationship === null) {
            return $column;
        }

        $parsed = ParsedColumn::parse("{$relationship}.{$column}");

        if (! $parsed->hasRelationship()) {
            return $column;
        }

        $this->applyJoin($query, $parsed->relationship);

        return $this->getQualifiedColumn($query, $parsed);
    }

    /**
     * Apply a join for the given relationship.
     */
    public function applyJoin(Builder $query, string $relationship): void
    {
        // Handle nested relationships
        $parts = explode('.', $relationship);
        $currentModel = $query->getModel();

        foreach ($parts as $relationName) {
            $joinKey = get_class($currentModel).':'.$relationName;

            // Skip if already joined
            if (isset($this->appliedJoins[$joinKey])) {
                $currentModel = $this->appliedJoins[$joinKey];

                continue;
            }

            if (! method_exists($currentModel, $relationName)) {
                throw new \InvalidArgumentException(
                    "Relationship '{$relationName}' does not exist on ".get_class($currentModel)
                );
            }

            /** @var Relation $relation */
            $relation = $currentModel->{$relationName}();
            $relatedTable = $relation->getRelated()->getTable();
            $relatedModel = $relation->getRelated();

            $this->applyJoinForRelation($query, $relation, $relatedTable);

            $this->appliedJoins[$joinKey] = $relatedModel;
            $currentModel = $relatedModel;
        }
    }

    /**
     * Apply the appropriate join based on relationship type.
     */
    private function applyJoinForRelation(Builder $query, Relation $relation, string $relatedTable): void
    {
        match (true) {
            $relation instanceof BelongsTo => $query->leftJoin(
                $relatedTable,
                $relation->getQualifiedForeignKeyName(),
                '=',
                $relation->getQualifiedOwnerKeyName()
            ),
            $relation instanceof HasOne, $relation instanceof HasMany => $query->leftJoin(
                $relatedTable,
                $relation->getQualifiedParentKeyName(),
                '=',
                $relation->getQualifiedForeignKeyName()
            ),
            default => throw new \InvalidArgumentException(
                'Unsupported relationship type: '.get_class($relation)
            ),
        };
    }

    /**
     * Get the fully qualified column name with table prefix.
     */
    public function getQualifiedColumn(Builder $query, ParsedColumn $parsed): string
    {
        if (! $parsed->hasRelationship()) {
            return $query->getModel()->getTable().'.'.$parsed->column;
        }

        // Get the table name for the relationship
        $parts = explode('.', $parsed->relationship);
        $currentModel = $query->getModel();

        foreach ($parts as $relationName) {
            if (method_exists($currentModel, $relationName)) {
                $currentModel = $currentModel->{$relationName}()->getRelated();
            }
        }

        return $currentModel->getTable().'.'.$parsed->column;
    }

    /**
     * Reset the applied joins tracker (useful for testing).
     */
    public function reset(): void
    {
        $this->appliedJoins = [];
    }
}
