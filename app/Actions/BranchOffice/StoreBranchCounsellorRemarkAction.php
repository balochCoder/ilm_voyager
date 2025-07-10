<?php

namespace App\Actions\BranchOffice;

use App\Models\Counsellor;
use App\Models\CounsellorRemark;
use Illuminate\Support\Facades\Auth;

class StoreBranchCounsellorRemarkAction
{
    public function execute(Counsellor $counsellor, array $data): CounsellorRemark
    {
        $remark = $counsellor->remarks()->create([
            'remark' => $data['remark'],
            'remark_date' => $data['remark_date'],
            'added_by_user_id' => Auth::id(),
        ]);
        $remark->load('addedByUser');

        return $remark;
    }
}
