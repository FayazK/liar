<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class MakeDataTableQueryServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:datatable-query {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new DataTable query service class';

    /**
     * @var Filesystem
     */
    protected $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $className = mb_ucfirst($name) . 'DataTableQueryService';
        $path = app_path('Queries/' . $className . '.php');

        if ($this->files->exists($path)) {
            $this->error('File already exists!');
            return 1;
        }

        $stub = $this->getStub();
        $stub = str_replace('{{className}}', $className, $stub);

        $this->files->ensureDirectoryExists(app_path('Queries'));
        $this->files->put($path, $stub);

        $this->info($className . ' created successfully.');
        return 0;
    }

    protected function getStub(): string
    {
        return <<<EOT
<?php

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;

class {{className}} extends DataTableQueryService
{
    /**
     * The columns that can be searched globally.
     *
     * @var array
     */
    protected array $searchableColumns = [
        // 'name',
    ];

    /**
     * The columns that can be filtered.
     *
     * @var array
     */
    protected array $filterableColumns = [
        // 'is_active',
        // 'created_at' => 'applyDateRangeFilter',
    ];

    /*
    |--------------------------------------------------------------------------
    | Optional: Custom Filter Methods
    |--------------------------------------------------------------------------
    |
    | You can define custom methods to handle specific filter logic.
    | The method name should match the value in the filterableColumns array.
    |
    */

    /**
     * Example custom filter for a date range.
     *
     * @param Builder \$query
     * @param mixed \$value
     * @return void
     */
    /*
    protected function applyDateRangeFilter(Builder \$query, \$value): void
    {
        \$dates = is_string(\$value) ? json_decode(\$value, true) : \$value;

        if (is_array(\$dates) && count(\$dates) === 2) {
            if (!empty(\$dates[0]) && !empty(\$dates[1])) {
                \$query->whereBetween('created_at', [\$dates[0], \$dates[1]]);
            }
        }
    }
    */
}
EOT;
    }
}
