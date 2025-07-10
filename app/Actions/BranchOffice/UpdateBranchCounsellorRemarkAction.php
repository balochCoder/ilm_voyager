<?php

namespace App\Actions\BranchOffice;

use App\Models\CounsellorRemark;

class UpdateBranchCounsellorRemarkAction
{
    public function execute(CounsellorRemark $remark, array $data): CounsellorRemark
    {
        $remark->update($data);
        $remark->load('addedByUser');

        return $remark;
    }
}
