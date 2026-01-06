<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DataTable\Definitions\FilterDefinition;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Base DataTable request with common validation rules.
 *
 * Extend this class and override getSortableColumns() and getFilterDefinitions()
 * to customize validation for specific DataTable endpoints.
 */
abstract class DataTableRequest extends FormRequest
{
    /**
     * Maximum items per page allowed.
     */
    protected int $maxPerPage = 100;

    /**
     * Default items per page.
     */
    protected int $defaultPerPage = 15;

    /**
     * Maximum search string length.
     */
    protected int $maxSearchLength = 255;

    /**
     * Maximum number of filters allowed.
     */
    protected int $maxFilters = 10;

    /**
     * Maximum number of sorts allowed.
     */
    protected int $maxSorts = 3;

    /**
     * Get the columns that are allowed for sorting.
     *
     * @return array<int, string>
     */
    abstract protected function getSortableColumns(): array;

    /**
     * Get filter definitions for validation.
     *
     * @return array<FilterDefinition>
     */
    protected function getFilterDefinitions(): array
    {
        return [];
    }

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     * Handle JSON-encoded filters and sorts from query string.
     */
    protected function prepareForValidation(): void
    {
        // Parse JSON filters if passed as string
        if ($this->has('filters') && is_string($this->input('filters'))) {
            $filters = json_decode($this->input('filters'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['filters' => $filters]);
            }
        }

        // Parse JSON sorts if passed as string
        if ($this->has('sorts') && is_string($this->input('sorts'))) {
            $sorts = json_decode($this->input('sorts'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['sorts' => $sorts]);
            }
        }
    }

    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return array_merge(
            $this->getBaseRules(),
            $this->getFilterRules()
        );
    }

    /**
     * Get the base validation rules common to all DataTable requests.
     *
     * @return array<string, ValidationRule|array|string>
     */
    protected function getBaseRules(): array
    {
        return [
            // Search
            'search' => ['nullable', 'string', 'max:'.$this->maxSearchLength],

            // Pagination
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.$this->maxPerPage],
            'page' => ['nullable', 'integer', 'min:1'],

            // New format: filters object
            'filters' => ['nullable', 'array', 'max:'.$this->maxFilters],
            'filters.*' => ['nullable'],
            'filters.*.operator' => ['nullable', 'string'],
            'filters.*.value' => ['nullable'],

            // New format: sorts array
            'sorts' => ['nullable', 'array', 'max:'.$this->maxSorts],
            'sorts.*.column' => ['required_with:sorts', 'string'],
            'sorts.*.direction' => ['required_with:sorts', 'string', Rule::in(['asc', 'desc'])],

            // Legacy format support (single sort)
            'sort_by' => ['nullable', 'string', Rule::in($this->getSortableColumns())],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
        ];
    }

    /**
     * Get filter validation rules from definitions.
     *
     * @return array<string, ValidationRule|array|string>
     */
    protected function getFilterRules(): array
    {
        $rules = [];

        foreach ($this->getFilterDefinitions() as $definition) {
            // Validate the filter object structure
            $rules["filters.{$definition->name}"] = ['nullable', 'array'];
            $rules["filters.{$definition->name}.operator"] = ['nullable', 'string'];

            // Validate the filter value based on type
            $valueRules = $definition->getValidationRules();
            $rules["filters.{$definition->name}.value"] = $valueRules;
        }

        return $rules;
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'sort_by.in' => 'The selected sort column is not allowed.',
            'sort_direction.in' => 'Sort direction must be either "asc" or "desc".',
            'sorts.*.column.in' => 'The selected sort column is not allowed.',
            'sorts.*.direction.in' => 'Sort direction must be either "asc" or "desc".',
            'per_page.max' => 'Maximum items per page is '.$this->maxPerPage.'.',
            'per_page.min' => 'Minimum items per page is 1.',
            'search.max' => 'Search term cannot exceed '.$this->maxSearchLength.' characters.',
            'filters.max' => 'Maximum number of filters is '.$this->maxFilters.'.',
            'sorts.max' => 'Maximum number of sorts is '.$this->maxSorts.'.',
        ];
    }

    /**
     * Get the maximum per page value.
     */
    public function getMaxPerPage(): int
    {
        return $this->maxPerPage;
    }

    /**
     * Get the default per page value.
     */
    public function getDefaultPerPage(): int
    {
        return $this->defaultPerPage;
    }

    /**
     * Get the validated per_page value with defaults applied.
     */
    public function getPerPage(): int
    {
        $perPage = $this->validated('per_page');

        return $perPage !== null ? (int) $perPage : $this->defaultPerPage;
    }

    /**
     * Get the validated search term.
     */
    public function getSearch(): ?string
    {
        return $this->validated('search');
    }

    /**
     * Get the validated filters.
     *
     * @return array<string, mixed>
     */
    public function getFilters(): array
    {
        return $this->validated('filters') ?? [];
    }

    /**
     * Get the validated sorts.
     *
     * @return array<array{column: string, direction: string}>
     */
    public function getSorts(): array
    {
        $sorts = $this->validated('sorts');

        if (is_array($sorts) && ! empty($sorts)) {
            return $sorts;
        }

        // Fall back to legacy format
        $sortBy = $this->validated('sort_by');
        $sortDirection = $this->validated('sort_direction') ?? 'asc';

        if ($sortBy !== null) {
            return [['column' => $sortBy, 'direction' => $sortDirection]];
        }

        return [];
    }

    /**
     * Get the validated page number.
     */
    public function getPage(): int
    {
        return (int) ($this->validated('page') ?? 1);
    }
}
