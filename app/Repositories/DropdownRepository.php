<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

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

    private function buildQuery(string $model, array $params, string $searchField): array
    {
        $search = isset($params['search']) ? trim((string) $params['search']) : '';
        $id     = $params['id'] ?? null;

        // If search is empty and ID is provided, return the ID record
        // along with the first 24 results from the base query.
        if ($search === '' && $id !== null) {
            $baseQuery = App::make($model)->query();

            // Fetch the requested ID record (if it exists)
            $idRecord = App::make($model)->query()->where('id', $id)->first();

            // Fetch the first 24 base results
            $baseResults = $baseQuery->limit(24)->get();

            // Combine with de-duplication by id and cap at 25
            $combined = collect([]);
            if ($idRecord) {
                $combined = $combined->push($idRecord);
            }
            foreach ($baseResults as $row) {
                if ($idRecord && $row->id === $idRecord->id) {
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

        // Otherwise, apply search (if any) and include the id record via OR.
        $query = App::make($model)->query();
        if ($search !== '') {
            $query->where($searchField, 'like', "%{$search}%");
        }
        if ($id !== null) {
            $query->orWhere('id', $id);
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
