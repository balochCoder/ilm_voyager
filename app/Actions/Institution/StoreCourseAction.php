<?php

declare(strict_types=1);

namespace App\Actions\Institution;

use App\Models\Course;
use Illuminate\Http\Request;

class StoreCourseAction
{
    public function execute(Request $request, Course $course = null): Course
    {
        $data = $request->validated();
        $isUpdate = $course !== null;
        if (!$isUpdate) {
            $course = new Course();
        }
        unset($data['documents'], $data['document_titles']);
        $course->fill($data);
        $course->institution_id = $request->route('institution')->id ?? $data['institution_id'];
        $course->save();

        // Handle up to 5 document uploads using Spatie MediaLibrary
        if ($request->hasFile('documents') && is_array($request->file('documents'))) {
            if ($isUpdate) {
                $course->clearMediaCollection('documents');
            }
            $documents = $request->file('documents');
            $titles = $request->input('document_titles', []);
            foreach (array_slice($documents, 0, 5) as $idx => $file) {
                $course->addMedia($file)
                    ->withCustomProperties(['title' => $titles[$idx] ?? $file->getClientOriginalName()])
                    ->toMediaCollection('documents');
            }
        }
        return $course;
    }
} 