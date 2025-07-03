<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\SubStatus\AddSubStatusAction;
use App\Actions\SubStatus\EditSubStatusAction;
use App\Actions\SubStatus\ToggleSubStatusAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\RepCountry\AddSubStatusRequest;
use App\Http\Requests\RepCountry\EditSubStatusRequest;
use App\Http\Requests\RepCountry\ToggleSubStatusRequest;
use App\Http\Resources\SubStatusResource;
use App\Models\RepCountryStatus;
use App\Models\SubStatus;

final class SubStatusController extends Controller
{
    public function addSubStatus(AddSubStatusRequest $request, RepCountryStatus $repCountryStatus, AddSubStatusAction $action)
    {
        $subStatus = $action->execute($request, $repCountryStatus);

        return back()
            ->with('success', 'Sub-step added successfully!')
            ->with('newSubStatus', SubStatusResource::make($subStatus));
    }

    public function toggleSubStatus(ToggleSubStatusRequest $request, SubStatus $subStatus, ToggleSubStatusAction $action)
    {
        $action->execute($request, $subStatus);

        return back()
            ->with('success', 'Sub-step status updated successfully.');
    }

    public function editSubStatus(EditSubStatusRequest $request, SubStatus $subStatus, EditSubStatusAction $action)
    {
        $action->execute($request, $subStatus);

        return back()
            ->with('success', 'Sub-step name updated successfully.');
    }
}
