<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Counsellor extends Model
{
    use HasUlids;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'branch_id',
        'as_processing_officer',
        'is_active',
        'assigned_institutions',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'as_processing_officer' => 'boolean',
        'is_active' => 'boolean',
        'assigned_institutions' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the remarks for the counsellor.
     */
    public function remarks()
    {
        return $this->hasMany(CounsellorRemark::class)->orderBy('remark_date', 'desc');
    }
}
