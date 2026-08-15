<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class LocationController extends Controller
{
    public function states(Request $request): JsonResponse
    {
        $request->validate([
            'country_id' => 'required|integer',
        ]);

        if (! Schema::hasTable('states')) {
            return response()->json(['states' => []]);
        }

        $states = State::query()
            ->where('country_id', $request->country_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'states' => $states,
        ]);
    }
}
