<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CounsellorTarget extends Model
{
    use HasUlids;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'counsellor_id',
        'number_of_applications',
        'year',
        'description',
        'added_by_user_id',
        'is_edited',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'year' => 'integer',
        'number_of_applications' => 'integer',
    ];

    /**
     * Get the counsellor that owns the target.
     */
    public function counsellor()
    {
        return $this->belongsTo(Counsellor::class);
    }

    /**
     * Get the user who added the target.
     */
    public function addedByUser()
    {
        return $this->belongsTo(User::class, 'added_by_user_id');
    }
}
