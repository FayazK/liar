<?php

declare(strict_types=1);

namespace App\Models;

use Aliziodev\LaravelTaxonomy\Models\Taxonomy as BaseTaxonomy;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Taxonomy extends BaseTaxonomy
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'type', 'description', 'parent_id'];
}
