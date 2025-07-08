<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants\Agent;

use App\Actions\LeadSource\StoreLeadSourceAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadSourceResource;
use App\Models\LeadSource;
use Illuminate\Http\Request;

final class LeadSourceController extends Controller
{
    use InertiaRoute;

    public function index(Request $request)
    {
        $query = LeadSource::with(['creator'])->withTrashed();
        // Keyword filter
        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where('name', 'like', "%{$keyword}%");
        }
        // Ordering
        $orderBy = $request->input('orderBy');
        if (in_array($orderBy, ['created_at', 'updated_at', 'is_active'])) {
            $query->orderBy($orderBy, $orderBy === 'is_active' ? 'desc' : 'desc');
        } else {
            $query->orderBy('name');
        }
        $leadSources = $query->paginate(10)->withQueryString();

        return $this->factory->render('agents/lead-sources/index', [
            'leadSources' => LeadSourceResource::collection($leadSources),
        ]);
    }

    public function edit(LeadSource $leadSource)
    {
        return $this->factory->render('agents/lead-sources/edit', [
            'leadSource' => $leadSource,
        ]);
    }

    public function update(Request $request, LeadSource $leadSource)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);
        $leadSource->update($data);

        return to_route('agents:lead-sources:index')->with('success', 'Lead Source updated successfully!');
    }

    public function destroy(LeadSource $leadSource)
    {
        $leadSource->delete();

        return back()->with('success', 'Lead Source deleted.');
    }

    public function restore($id)
    {
        $leadSource = LeadSource::withTrashed()->findOrFail($id);
        $leadSource->restore();

        return back()->with('success', 'Lead Source restored.');
    }

    public function create()
    {
        return $this->factory->render('agents/lead-sources/create');
    }

    public function store(Request $request, StoreLeadSourceAction $action)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);
        $userId = $request->user()->id;
        $action->execute($data, $userId);

        return to_route('agents:lead-sources:index')->with('success', 'Lead Source created successfully!');
    }

    public function toggleStatus(LeadSource $leadSource)
    {
        $leadSource->is_active = ! $leadSource->is_active;
        $leadSource->save();

        return back()->with('success', 'Lead Source status updated.');
    }
}
