<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\Status\AddStatusAction;
use App\Actions\Status\EditStatusAction;
use App\Actions\Status\SaveStatusOrderAction;
use App\Actions\Status\ToggleStatusAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\RepCountry\AddRepCountryStatusRequest;
use App\Http\Requests\RepCountry\EditRepCountryStatusRequest;
use App\Http\Requests\RepCountry\SaveRepCountryStatusOrderRequest;
use App\Http\Requests\RepCountry\ToggleRepCountryStatusRequest;
use App\Http\Resources\RepCountryResource;
use App\Models\RepCountry;
use App\Models\RepCountryStatus;

final class StatusController extends Controller
{
    use InertiaRoute;
    public function reorderStatuses(RepCountry $repCountry)
    {
        $repCountry->load(['country', 'repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc')->with(['subStatuses' => function ($subQuery) {
                $subQuery->orderBy('order', 'asc');
            }]);
        }]);

        return $this->factory->render('agents/rep-countries/reorder-statuses', [
            'repCountry' => RepCountryResource::make($repCountry)->resolve(),
        ]);
    }

    public function saveStatusOrder(SaveRepCountryStatusOrderRequest $request, RepCountry $repCountry, SaveStatusOrderAction $action)
    {
        $action->execute($request, $repCountry);

        return back()->with('success', 'Status order updated successfully.');
    }

    public function addStatus(AddRepCountryStatusRequest $request, RepCountry $repCountry, AddStatusAction $action)
    {
        $action->execute($request, $repCountry);
        $newStatus = $repCountry->repCountryStatuses()->where('status_name', $request->name)->first();

        return back()->with('newStatus', $newStatus);
    }

    public function toggleRepCountryStatus(ToggleRepCountryStatusRequest $request, RepCountryStatus $repCountryStatus, ToggleStatusAction $action)
    {
        $action->execute($repCountryStatus, $request);

        return back()
            ->with('success', 'Process Status updated successfully.');
    }

    public function editRepCountryStatus(EditRepCountryStatusRequest $request, RepCountryStatus $repCountryStatus, EditStatusAction $action)
    {
        $action->execute($repCountryStatus, $request);

        return back()
            ->with('success', 'Status name updated successfully.');
    }
}
