<?php

declare(strict_types=1);

use App\Models\Taxonomy;
use App\Models\User;

describe('Taxonomy Dropdown API', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());

        Taxonomy::factory()->create([
            'name' => 'Technology',
            'type' => 'categories',
        ]);
        Taxonomy::factory()->create([
            'name' => 'Business',
            'type' => 'categories',
        ]);
        Taxonomy::factory()->create([
            'name' => 'Featured',
            'type' => 'tags',
        ]);
    });

    it('returns taxonomies for dropdown', function () {
        $response = $this->get('/dropdown?type=taxonomies&taxonomy_type=categories');

        $response->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['name' => 'Technology'])
            ->assertJsonFragment(['name' => 'Business']);
    });

    it('searches taxonomies', function () {
        $response = $this->get('/dropdown?type=taxonomies&taxonomy_type=categories&search=Tech');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Technology']);
    });

    it('filters by taxonomy type', function () {
        $response = $this->get('/dropdown?type=taxonomies&taxonomy_type=tags');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Featured']);
    });

    it('supports multiple initial IDs', function () {
        $tech = Taxonomy::where('name', 'Technology')->first();
        $biz = Taxonomy::where('name', 'Business')->first();

        $response = $this->get("/dropdown?type=taxonomies&id={$tech->id},{$biz->id}");

        $response->assertOk()
            ->assertJsonCount(2);
    });

    it('returns all taxonomies when no type filter is provided', function () {
        $response = $this->get('/dropdown?type=taxonomies');

        $response->assertOk()
            ->assertJsonCount(3); // All 3 taxonomies
    });
});
