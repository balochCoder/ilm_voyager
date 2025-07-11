<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Institution extends Model implements HasMedia
{
    use HasUlids, InteractsWithMedia, SoftDeletes;

    protected $appends = ['logo_url'];

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
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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

    public function getLogoUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('logo') ?: null;
    }

    public function getContractCopyFile()
    {
        $media = $this->getFirstMedia('contract_copy');
        if (! $media) {
            return null;
        }

        return [
            'id' => $media->id,
            'name' => $media->name,
            'url' => $media->getUrl(),
            'size' => $media->size,
            'mime_type' => $media->mime_type,
        ];
    }

    protected function casts()
    {
        return [
            'is_language_mandatory' => 'boolean',
            'monthly_living_cost' => 'integer',
            'funds_required_for_visa' => 'integer',
            'application_fee' => 'integer',
        ];
    }

    public function getProspectusFile()
    {
        $media = $this->getFirstMedia('prospectus');
        if (! $media) {
            return null;
        }

        return [
            'id' => $media->id,
            'name' => $media->name,
            'url' => $media->getUrl(),
            'size' => $media->size,
            'mime_type' => $media->mime_type,
        ];
    }

    public function courses()
    {
        return $this->hasMany(\App\Models\Course::class);
    }

    protected function monthlyLivingCost(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100
        );
    }

    protected function fundsRequiredForVisa(): Attribute
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
