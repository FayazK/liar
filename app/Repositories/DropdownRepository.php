<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Facades\App;

class DropdownRepository
{
    public function get(string $type, array $params = []): array
    {
        $method = 'get'.ucfirst($type).'Data';

        if (method_exists($this, $method)) {
            return $this->{$method}($params);
        }

        return [];
    }

    private function getUsersData(array $params): array
    {
        return $this->buildQuery('App\\Models\\User', $params, 'name');
    }

    private function getLanguagesData(array $params): array
    {
        return $this->buildQuery('Nnjeim\World\Models\Language', $params, 'name');
    }

    private function getTimezonesData(array $params): array
    {
        return $this->buildQuery('Nnjeim\World\Models\Timezone', $params, 'name');
    }

    private function getCitiesData(array $params): array
    {
        return $this->buildQuery('Nnjeim\World\Models\City', $params, 'name');
    }

    private function getTaxonomiesData(array $params): array
    {
        $taxonomyType = $params['taxonomy_type'] ?? null;
        $search = isset($params['search']) ? trim((string) $params['search']) : '';
        $id = $params['id'] ?? null;

        // Parse comma-separated IDs for multi-select
        $ids = [];
        if ($id !== null) {
            $ids = is_string($id) ? array_map('intval', explode(',', $id)) : [(int) $id];
        }

        $query = \App\Models\Taxonomy::query();

        // Filter by taxonomy type if specified
        if ($taxonomyType) {
            $query->where('type', $taxonomyType);
        }

        // Search logic
        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        // Include specific IDs
        if (! empty($ids)) {
            $query->orWhereIn('id', $ids);
        }

        return $query->limit(25)->get(['id', 'name'])->toArray();
    }

    private function buildQuery(string $model, array $params, string $searchField): array
    {
        $search = isset($params['search']) ? trim((string) $params['search']) : '';
        $id = $params['id'] ?? null;

        // Parse comma-separated IDs for multi-select
        $ids = [];
        if ($id !== null) {
            $ids = is_string($id) ? array_map('intval', explode(',', $id)) : [(int) $id];
        }

        // If search is empty and IDs are provided, return the ID records
        // along with the first 24 results from the base query.
        if ($search === '' && ! empty($ids)) {
            $baseQuery = App::make($model)->query();

            // Fetch the requested ID records (if they exist)
            $idRecords = App::make($model)->query()->whereIn('id', $ids)->get();

            // Fetch the first 24 base results
            $baseResults = $baseQuery->limit(24)->get();

            // Combine with de-duplication by id and cap at 25
            $combined = collect([]);
            foreach ($idRecords as $record) {
                $combined->push($record);
            }
            foreach ($baseResults as $row) {
                if ($idRecords->contains('id', $row->id)) {
                    continue; // skip duplicate
                }
                $combined->push($row);
                if ($combined->count() >= 25) {
                    break;
                }
            }

            $results = $combined->values()->toArray();

            return $this->appendTimezoneUtcIfNeeded($model, $results);
        }

        // Otherwise, apply search (if any) and include the id records via OR.
        $query = App::make($model)->query();
        if ($search !== '') {
            $query->where($searchField, 'like', "%{$search}%");
        }
        if (! empty($ids)) {
            $query->orWhereIn('id', $ids);
        }

        $results = $query->limit(25)->get()->toArray();

        return $this->appendTimezoneUtcIfNeeded($model, $results);
    }

    /**
     * Append synthetic UTC option for timezone dropdowns, capped to 25 items.
     */
    private function appendTimezoneUtcIfNeeded(string $model, array $results): array
    {
        if ($model === 'Nnjeim\\World\\Models\\Timezone') {
            array_unshift($results, [
                'id' => 0,
                'name' => 'UTC',
            ]);
            if (count($results) > 25) {
                $results = array_slice($results, 0, 25);
            }
        }

        return $results;
    }
}
