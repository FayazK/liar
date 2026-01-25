<?php

declare(strict_types=1);

namespace App\Http\Requests\Library;

use App\Repositories\LibraryRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LibraryMoveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(['file', 'folder'])],
            'item_id' => ['required', 'integer'],
            'target_id' => [
                'required',
                'integer',
                'exists:libraries,id',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    // Only validate for folder moves
                    if ($this->input('type') === 'folder') {
                        $itemId = $this->input('item_id');

                        // Prevent moving into itself
                        if ((int) $value === (int) $itemId) {
                            $fail('Cannot move a folder into itself.');

                            return;
                        }

                        // Prevent moving into descendants using centralized repository method
                        $repository = app(LibraryRepository::class);
                        if ($repository->isDescendantOf((int) $value, (int) $itemId)) {
                            $fail('Cannot move a folder into its own descendant.');
                        }
                    }

                    // Validate ownership of target folder
                    if (! \App\Models\Library::where('id', $value)
                        ->where('user_id', auth()->id())
                        ->exists()) {
                        $fail('The target folder does not belong to you.');
                    }
                },
            ],
        ];
    }
}
