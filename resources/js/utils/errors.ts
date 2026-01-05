/**
 * Type definitions and type guards for API errors
 */

export interface ApiError {
    response?: {
        status: number;
        data: {
            errors?: Record<string, string[]>;
            message?: string;
        };
    };
}

/**
 * Type guard to check if an unknown error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'response' in error && typeof (error as ApiError).response === 'object';
}

/**
 * Extract error message from an unknown error
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An error occurred'): string {
    if (isApiError(error)) {
        return error.response?.data?.message || defaultMessage;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return defaultMessage;
}
