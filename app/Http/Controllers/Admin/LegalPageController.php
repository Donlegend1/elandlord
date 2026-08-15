<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        return Inertia::render('Admin/LegalPages/Index', [
            'pages' => LegalPage::query()
                ->orderBy('title')
                ->get()
                ->map(fn (LegalPage $page) => [
                    'id' => $page->id,
                    'slug' => $page->slug,
                    'title' => $page->title,
                    'description' => $page->description,
                    'updated_at' => $page->updated_at?->toIso8601String(),
                    'public_url' => $page->slug === 'privacy' ? route('privacy') : route('terms'),
                ]),
        ]);
    }

    public function edit(Request $request, LegalPage $legalPage): Response
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        return Inertia::render('Admin/LegalPages/Edit', [
            'page' => [
                'id' => $legalPage->id,
                'slug' => $legalPage->slug,
                'title' => $legalPage->title,
                'description' => $legalPage->description,
                'content' => $legalPage->content,
                'public_url' => $legalPage->slug === 'privacy' ? route('privacy') : route('terms'),
            ],
        ]);
    }

    public function update(Request $request, LegalPage $legalPage): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'nullable|string|max:255',
            'content' => 'required|string|min:20',
        ]);

        $legalPage->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('legal-pages.edit', $legalPage)
            ->with('success', $legalPage->title.' has been updated and is now live on the public site.');
    }
}
