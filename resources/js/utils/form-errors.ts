import type { FormInstance } from 'antd';
import { message } from 'antd';
import { isApiError } from './errors';

/**
 * Handle API validation errors and set them on an Ant Design form
 *
 * @param error - The caught error (unknown type)
 * @param form - The Ant Design form instance
 * @param defaultMessage - Default message to show if no specific error is found
 */
export function handleFormError(
    error: unknown,
    form: FormInstance,
    defaultMessage = 'An error occurred',
): void {
    if (isApiError(error)) {
        const errors = error.response?.data?.errors;

        if (errors) {
            const fields = Object.entries(errors).map(([name, messages]) => ({
                name,
                errors: messages,
            }));
            form.setFields(fields);
            return;
        }

        message.error(error.response?.data?.message || defaultMessage);
    } else {
        message.error(defaultMessage);
    }
}

/**
 * Handle API validation errors and return them in Inertia form format
 *
 * @param error - The caught error (unknown type)
 * @returns Record of field errors or null if not a validation error
 */
export function extractValidationErrors(error: unknown): Record<string, string> | null {
    if (isApiError(error) && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const result: Record<string, string> = {};

        for (const [field, messages] of Object.entries(errors)) {
            result[field] = messages[0] || '';
        }

        return result;
    }

    return null;
}
