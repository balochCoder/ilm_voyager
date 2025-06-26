<?php

use App\Models\User;
use App\Models\Country;
use App\Models\RepCountry;
use App\Models\Status;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('RepCountry Feature', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->country = Country::factory()->create();
        $this->status = Status::factory()->create(['name' => 'Initial']);
        $this->actingAs($this->user);
    });

    it('can create a rep country', function () {
        $response = $this->post(route('agents:rep-countries:store'), [
            'country_id' => $this->country->id,
            'statuses' => [$this->status->id],
        ]);
        $response->assertRedirect(route('agents:rep-countries:index'));
        $this->assertDatabaseHas('rep_countries', [
            'country_id' => $this->country->id,
        ]);
    });

    it('can toggle status', function () {
        $repCountry = RepCountry::factory()->create(['country_id' => $this->country->id]);
        $response = $this->post(route('agents:rep-countries:toggle-status', $repCountry), [
            'status_name' => $this->status->name,
        ]);
        $response->assertRedirect(route('agents:rep-countries:index'));
    });

    it('can add notes to statuses', function () {
        $repCountry = RepCountry::factory()->create(['country_id' => $this->country->id]);
        $repCountry->repCountryStatuses()->create([
            'status_name' => $this->status->name,
            'order' => 1,
        ]);
        $response = $this->post(route('agents:rep-countries:store-notes', $repCountry), [
            'status_notes' => [
                $this->status->name => 'Test note',
            ],
        ]);
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('rep_country_status', [
            'status_name' => $this->status->name,
            'notes' => 'Test note',
        ]);
    });

    it('can reorder statuses', function () {
        $repCountry = RepCountry::factory()->create(['country_id' => $this->country->id]);
        $repCountry->repCountryStatuses()->create([
            'status_name' => $this->status->name,
            'order' => 1,
        ]);
        $response = $this->post(route('agents:rep-countries:save-status-order', $repCountry), [
            'status_order' => [
                ['status_name' => $this->status->name, 'order' => 2],
            ],
        ]);
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('rep_country_status', [
            'status_name' => $this->status->name,
            'order' => 2,
        ]);
    });

    it('can add a new status', function () {
        $repCountry = RepCountry::factory()->create(['country_id' => $this->country->id]);
        $response = $this->post(route('agents:rep-countries:add-status', $repCountry), [
            'name' => 'NewStatus',
        ]);
        $response->assertSessionHas('newStatus');
        $this->assertDatabaseHas('rep_country_status', [
            'status_name' => 'NewStatus',
            'rep_country_id' => $repCountry->id,
        ]);
    });
}); 