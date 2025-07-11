<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Course extends Model implements HasMedia
{
    use HasFactory;
    use HasUlids;
    use InteractsWithMedia;
    use SoftDeletes;

    protected function casts()
    {
        return [
            'language_requirements' => 'array',
            'course_categories' => 'array',
            'documents' => 'array',
            'is_language_mandatory' => 'boolean',
            'modules' => 'array',
            'intake_month' => 'array',
            'is_active' => 'boolean',
            'course_fee' => 'integer',
            'application_fee' => 'integer',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('documents')
            ->acceptsMimeTypes([
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ])
            ->onlyKeepLatest(5);
    }

    public function getDocumentsWithTitles()
    {
        return $this->getMedia('documents')->map(function ($media) {
            return [
                'id' => $media->id,
                'name' => $media->name,
                'title' => $media->getCustomProperty('title', $media->name),
                'url' => $media->getUrl(),
                'size' => $media->size,
                'mime_type' => $media->mime_type,
            ];
        });
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function courseLevel()
    {
        return $this->belongsTo(\App\Models\CourseLevel::class, 'course_level_id');
    }

    public function currency()
    {
        return $this->belongsTo(\App\Models\Currency::class, 'currency_id');
    }

    // use attribute casting for currency_fee and application_fee
    protected function courseFee(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100
        );
    }

    protected function applicationFee(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100
        );
    }
}
