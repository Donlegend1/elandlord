<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'location' => 'nullable|string|max:150',
            'quote' => 'required|string|min:10|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $validated['rating'] = $validated['rating'] ?? 5;
        $validated['is_approved'] = true;

        Testimonial::create($validated);

        return back()->with('success', 'Thank you! Your testimonial has been shared successfully.');
    }
}
