<?php

declare(strict_types=1);

namespace App\Actions\Institution;

use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Models\Institution;
use Illuminate\Support\Facades\Log;

class StoreInstitutionAction
{
    public function execute(StoreInstitutionRequest $request, ?Institution $institution = null): Institution
    {
        $data = $request->validated();
        $isUpdate = $institution !== null;
        if (!$isUpdate) {
            $institution = new Institution();
        }
        unset($data['contract_copy'], $data['logo'], $data['prospectus'], $data['additional_files'], $data['additional_file_titles']);
        $institution->fill($data);
        $institution->save();
        // Handle files (logo, contract_copy, prospectus, additional_files)
        $this->handleSingleFile($request, $institution, 'logo');
        $this->handleSingleFile($request, $institution, 'contract_copy');
        $this->handleSingleFile($request, $institution, 'prospectus');
        if ($request->hasFile('additional_files') && is_array($request->file('additional_files'))) {
            $additionalFiles = $request->file('additional_files');
            $titles = $request->input('additional_file_titles', []);
            if ($isUpdate) {
                $institution->clearMediaCollection('additional_files');
            }
            foreach ($additionalFiles as $idx => $file) {
                $institution->addMedia($file)
                    ->withCustomProperties(['title' => $titles[$idx] ?? $file->getClientOriginalName()])
                    ->toMediaCollection('additional_files');
            }
        }
        return $institution;
    }

    private function handleSingleFile($request, Institution $institution, string $field): void
    {
        if ($request->hasFile($field) && $request->file($field)->isValid()) {
            try {
                $institution->addMediaFromRequest($field)->toMediaCollection($field);
            } catch (\Exception $e) {
                Log::error("Failed to upload {$field}: " . $e->getMessage());
            }
        }
    }
}
