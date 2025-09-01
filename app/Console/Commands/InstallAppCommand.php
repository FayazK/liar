<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class InstallAppCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install/refresh the App Database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('migrate:reset');
        $this->call('world:install');
        $this->call('migrate');
        $this->call('db:seed');
    }
}
