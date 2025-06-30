<?php

declare(strict_types=1);

namespace App\Actions;

use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Models\Institution;
use Illuminate\Http\UploadedFile;

class StoreInstitutionAction
{
    public function execute(StoreInstitutionRequest $request): Institution
    {
        $data = $request->validated();
        // Remove media fields
        unset($data['contract_copy'], $data['logo'], $data['prospectus'], $data['additional_files']);
        $institution = Institution::create($data);

        // Handle single file uploads
        $this->handleSingleFile($request, $institution, 'contract_copy');
        $this->handleSingleFile($request, $institution, 'logo');
        $this->handleSingleFile($request, $institution, 'prospectus');

        // Handle multiple files - with debugging
        if ($request->hasFile('additional_files')) {
            \Log::info('Additional files found in request');
            $files = $request->file('additional_files');
            \Log::info('Files received:', ['count' => is_array($files) ? count($files) : 1]);

            // Always treat as array
            if (!is_array($files)) {
                $files = [$files];
            }

            foreach ($files as $index => $file) {
                \Log::info("Processing file {$index}:", [
                    'name' => $file ? $file->getClientOriginalName() : 'null',
                    'size' => $file ? $file->getSize() : 'null',
                    'valid' => $file ? $file->isValid() : 'null',
                    'error' => $file ? $file->getError() : 'null'
                ]);

                if ($file instanceof UploadedFile && $file->isValid()) {
                    try {
                        $institution->addMedia($file)->toMediaCollection('additional_files');
                        \Log::info("Successfully uploaded file: " . $file->getClientOriginalName());
                    } catch (\Exception $e) {
                        \Log::error("File upload failed for additional_files[{$index}]: " . $e->getMessage());
                    }
                } else {
                    \Log::warning("File {$index} is invalid or null");
                }
            }
        } else {
            \Log::info('No additional files found in request');
        }

        return $institution->load(['repCountry', 'currency']);
    }

    private function handleSingleFile($request, Institution $institution, string $field): void
    {
        if ($request->hasFile($field) && $request->file($field)->isValid()) {
            try {
                $institution->addMediaFromRequest($field)->toMediaCollection($field);
            } catch (\Exception $e) {
                \Log::error("Failed to upload {$field}: " . $e->getMessage());
            }
        }
    }
}
