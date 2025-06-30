<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Institution extends Model implements HasMedia
{
    use SoftDeletes, HasUlids, InteractsWithMedia;

    protected $fillable = [
        'rep_country_id',
        'institution_name',
        'campus',
        'website',
        'monthly_living_cost',
        'funds_required_for_visa',
        'application_fee',
        'currency_id',
        'contract_terms',
        'institute_type',
        'quality_of_desired_application',
        'contract_expiry_date',
        'is_language_mandatory',
        'language_requirements',
        'institutional_benefits',
        'part_time_work_details',
        'scholarship_policy',
        'institution_status_notes',
        'contact_person_name',
        'contact_person_email',
        'contact_person_mobile',
        'contact_person_designation',
        'is_active',
    ];

    public function repCountry(): BelongsTo
    {
        return $this->belongsTo(RepCountry::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('contract_copy')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']);

        $this->addMediaCollection('logo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']);

        $this->addMediaCollection('prospectus')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf']);

        $this->addMediaCollection('additional_files')
            ->acceptsMimeTypes([
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]);
    }

    public function getAdditionalFilesWithTitles()
    {
        return $this->getMedia('additional_files')->map(function ($media) {
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
}
