<?php

declare(strict_types=1);

namespace App\Http\Traits;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

trait HandlesApiErrors
{
    /**
     * Handle exceptions and convert to JSON:API format.
     */
    protected function handleException(Throwable $e): JsonResponse
    {
        return match (true) {
            $e instanceof ValidationException => $this->validationError($e->errors()),
            $e instanceof AuthenticationException => $this->unauthorized($e->getMessage() ?: 'Unauthenticated'),
            $e instanceof AuthorizationException => $this->forbidden($e->getMessage() ?: 'This action is unauthorized'),
            $e instanceof ModelNotFoundException, $e instanceof NotFoundHttpException => $this->notFound('Resource not found'),
            $e instanceof HttpException => $this->error(
                $this->getHttpExceptionTitle($e->getStatusCode()),
                $e->getMessage(),
                $e->getStatusCode()
            ),
            default => $this->serverError($e),
        };
    }

    /**
     * Handle server errors (500).
     */
    protected function serverError(Throwable $e): JsonResponse
    {
        $detail = config('app.debug')
            ? $e->getMessage().' in '.$e->getFile().' on line '.$e->getLine()
            : 'An unexpected error occurred';

        return $this->error('Internal Server Error', $detail, 500);
    }

    /**
     * Get HTTP exception title based on status code.
     */
    protected function getHttpExceptionTitle(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            503 => 'Service Unavailable',
            default => 'Error',
        };
    }
}
