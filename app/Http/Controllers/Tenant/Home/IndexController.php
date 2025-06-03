<?php

namespace App\Http\Controllers\Tenant\Home;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    use InertiaRoute;
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return $this->factory->render('tenants/home/index');
    }
}
