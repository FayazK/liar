<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class TestHorizonJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $message = 'Test message'
    ) {}

    public function handle(): void
    {
        Log::info('TestHorizonJob executed', ['message' => $this->message]);
    }
}
