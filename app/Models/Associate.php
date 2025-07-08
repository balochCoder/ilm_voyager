<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Associate extends Model implements HasMedia
{
    use HasUlids;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function country()
    {
        return $this->belongsTo(\App\Models\Country::class, 'country_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('contract_file')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    }

    public function getContractFile()
    {
        $media = $this->getFirstMedia('contract_file');
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
}
