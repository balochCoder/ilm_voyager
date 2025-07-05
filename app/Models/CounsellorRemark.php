<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CounsellorRemark extends Model
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
        'remark',
        'remark_date',
        'added_by_user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'remark_date' => 'date',
    ];

    /**
     * Get the counsellor that owns the remark.
     */
    public function counsellor()
    {
        return $this->belongsTo(Counsellor::class);
    }

    /**
     * Get the user who added the remark.
     */
    public function addedByUser()
    {
        return $this->belongsTo(User::class, 'added_by_user_id');
    }
}
