<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function terms(): Response
    {
        return $this->show('terms');
    }

    public function privacy(): Response
    {
        return $this->show('privacy');
    }

    protected function show(string $slug): Response
    {
        $page = LegalPage::where('slug', $slug)->firstOrFail();

        return Inertia::render('Legal/Show', [
            'page' => [
                'slug' => $page->slug,
                'title' => $page->title,
                'description' => $page->description ?? '',
                'updated' => $page->updated_at?->format('F j, Y'),
                'html' => $page->renderedHtml(),
            ],
        ]);
    }
}
