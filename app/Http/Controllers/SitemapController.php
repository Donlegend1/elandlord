<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'priority' => '1.0'],
            ['loc' => route('listings.index'), 'priority' => '0.9'],
            ['loc' => route('about'), 'priority' => '0.8'],
            ['loc' => route('faq'), 'priority' => '0.8'],
            ['loc' => route('contact'), 'priority' => '0.7'],
            ['loc' => route('terms'), 'priority' => '0.5'],
            ['loc' => route('privacy'), 'priority' => '0.5'],
            ['loc' => route('register'), 'priority' => '0.6'],
            ['loc' => route('login'), 'priority' => '0.6'],
        ]);

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
