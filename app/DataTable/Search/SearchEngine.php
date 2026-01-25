<?php

declare(strict_types=1);

namespace App\DataTable\Search;

use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Enums\SearchType;
use App\DataTable\Support\RelationshipHandler;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles search operations across multiple columns with weighting.
 */
final class SearchEngine
{
    private const int MAX_SEARCH_LENGTH = 255;

    public function __construct(
        private readonly RelationshipHandler $relationshipHandler,
    ) {}

    /**
     * Apply search across defined searchable columns.
     *
     * @param  array<SearchDefinition>  $definitions
     */
    public function apply(Builder $query, string $searchTerm, array $definitions): void
    {
        $searchTerm = $this->sanitizeSearchTerm($searchTerm);

        if ($searchTerm === '' || empty($definitions)) {
            return;
        }

        $query->where(function (Builder $q) use ($searchTerm, $definitions): void {
            foreach ($definitions as $definition) {
                $this->applySearchDefinition($q, $searchTerm, $definition);
            }
        });
    }

    /**
     * Apply a single search definition to the query.
     */
    private function applySearchDefinition(Builder $query, string $searchTerm, SearchDefinition $definition): void
    {
        $column = $definition->column;

        // Handle relationship columns
        if ($definition->hasRelationship()) {
            $column = $this->relationshipHandler->applyJoinAndGetColumn(
                $query,
                $column,
                $definition->relationship
            );
        }

        match ($definition->type) {
            SearchType::Like => $this->applyLikeSearch($query, $column, $searchTerm),
            SearchType::FullText => $this->applyFullTextSearch($query, $column, $searchTerm),
        };
    }

    /**
     * Apply LIKE-based search.
     */
    private function applyLikeSearch(Builder $query, string $column, string $searchTerm): void
    {
        $query->orWhere($column, 'LIKE', '%'.$searchTerm.'%');
    }

    /**
     * Apply full-text search (MySQL FULLTEXT).
     */
    private function applyFullTextSearch(Builder $query, string $column, string $searchTerm): void
    {
        // Escape special characters for FULLTEXT search
        $escapedTerm = $this->escapeFullTextTerm($searchTerm);

        $query->orWhereRaw(
            "MATCH({$column}) AGAINST(? IN BOOLEAN MODE)",
            [$escapedTerm]
        );
    }

    /**
     * Sanitize and limit search term length.
     */
    private function sanitizeSearchTerm(string $term): string
    {
        $term = trim($term);

        return mb_substr($term, 0, self::MAX_SEARCH_LENGTH);
    }

    /**
     * Escape special characters for MySQL FULLTEXT search.
     */
    private function escapeFullTextTerm(string $term): string
    {
        // Add + prefix to require each word
        $words = preg_split('/\s+/', $term);
        $escapedWords = array_map(function (string $word): string {
            // Remove special characters that have meaning in boolean mode
            $word = preg_replace('/[+\-><()~*"@]+/', '', $word);

            return $word !== '' && $word !== '0' ? '+'.$word.'*' : '';
        }, $words);

        return implode(' ', array_filter($escapedWords));
    }
}
