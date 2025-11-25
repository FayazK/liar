<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Base DataTable request with common validation rules.
 *
 * Extend this class and override getSortableColumns() and getFilterRules()
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
     * Get the columns that are allowed for sorting.
     *
     * @return array<int, string>
     */
    abstract protected function getSortableColumns(): array;

    /**
     * Get additional filter validation rules specific to this DataTable.
     *
     * Override this method to add custom filter validations.
     *
     * @return array<string, ValidationRule|array|string>
     */
    protected function getFilterRules(): array
    {
        return [];
    }

    public function authorize(): bool
    {
        return true;
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
            'search' => ['nullable', 'string', 'max:'.$this->maxSearchLength],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.$this->maxPerPage],
            'page' => ['nullable', 'integer', 'min:1'],
            'sort_by' => ['nullable', 'string', Rule::in($this->getSortableColumns())],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return array_merge(
            $this->getBaseMessages(),
            $this->getFilterMessages()
        );
    }

    /**
     * Get base validation messages.
     *
     * @return array<string, string>
     */
    protected function getBaseMessages(): array
    {
        return [
            'sort_by.in' => 'The selected sort column is not allowed.',
            'sort_direction.in' => 'Sort direction must be either "asc" or "desc".',
            'per_page.max' => 'Maximum items per page is '.$this->maxPerPage.'.',
            'per_page.min' => 'Minimum items per page is 1.',
            'search.max' => 'Search term cannot exceed '.$this->maxSearchLength.' characters.',
        ];
    }

    /**
     * Get custom filter validation messages.
     *
     * Override this method to add custom filter error messages.
     *
     * @return array<string, string>
     */
    protected function getFilterMessages(): array
    {
        return [];
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
     * Get the validated sort column.
     */
    public function getSortBy(): ?string
    {
        return $this->validated('sort_by');
    }

    /**
     * Get the validated sort direction.
     */
    public function getSortDirection(): string
    {
        return $this->validated('sort_direction') ?? 'desc';
    }

    /**
     * Get the validated page number.
     */
    public function getPage(): int
    {
        return (int) ($this->validated('page') ?? 1);
    }
}
