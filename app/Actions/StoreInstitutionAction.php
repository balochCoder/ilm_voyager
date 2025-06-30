<?php

declare(strict_types=1);

namespace App\Actions;

use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Models\Institution;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class StoreInstitutionAction
{
    public function execute(StoreInstitutionRequest $request): Institution
    {
        $data = $request->validated();
        // Remove media fields
        unset($data['contract_copy'], $data['logo'], $data['prospectus'], $data['additional_files'], $data['additional_file_titles']);
        $institution = Institution::create($data);

        // Handle single file uploads
        $this->handleSingleFile($request, $institution, 'contract_copy');
        $this->handleSingleFile($request, $institution, 'logo');
        $this->handleSingleFile($request, $institution, 'prospectus');

        // Handle additional files with titles
        if ($request->hasFile('additional_files') && is_array($request->file('additional_files'))) {
            $additionalFiles = $request->file('additional_files');
            $additionalFileTitles = $request->input('additional_file_titles', []);

            Log::info('Processing additional files', [
                'count' => count($additionalFiles),
                'titles' => $additionalFileTitles
            ]);

            foreach ($additionalFiles as $index => $file) {
                try {
                    if ($file && $file->isValid()) {
                        $title = $additionalFileTitles[$index] ?? $file->getClientOriginalName();

                        Log::info('Adding additional file', [
                            'index' => $index,
                            'filename' => $file->getClientOriginalName(),
                            'title' => $title,
                            'size' => $file->getSize()
                        ]);

                        $institution->addMedia($file)
                            ->withCustomProperties(['title' => $title])
                            ->toMediaCollection('additional_files');
                    } else {
                        Log::warning('Invalid additional file at index', ['index' => $index]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to upload additional file', [
                        'index' => $index,
                        'filename' => $file ? $file->getClientOriginalName() : 'unknown',
                        'error' => $e->getMessage()
                    ]);
                }
            }
        }

        return $institution->load(['repCountry', 'currency']);
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
