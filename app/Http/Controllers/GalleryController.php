<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $images = collect(range(1, 9))->map(fn ($i) => [
            'src' => "/images/gallery/gallery-{$i}.jpg",
            'alt' => "Afrik Minerals site and product photo {$i}",
        ]);

        return Inertia::render('Gallery', [
            'images' => $images,
        ]);
    }
}
