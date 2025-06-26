<?php

use App\Models\RepCountry;
use App\Actions\RepCountry\StoreRepCountryNotesAction;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('StoreRepCountryNotesAction', function () {
    it('updates notes for statuses', function () {
        $repCountry = RepCountry::factory()->create();
        $repCountry->repCountryStatuses()->create([
            'status_name' => 'Initial',
            'order' => 1,
        ]);
        $action = new StoreRepCountryNotesAction();
        $request = new Request([
            'status_notes' => [
                'Initial' => 'Test note',
            ],
        ]);
        $action->execute($request, $repCountry);
        $this->assertDatabaseHas('rep_country_status', [
            'rep_country_id' => $repCountry->id,
            'status_name' => 'Initial',
            'notes' => 'Test note',
        ]);
    });
}); 