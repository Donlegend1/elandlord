<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'priority' => '1.0'],
            ['loc' => route('about'), 'priority' => '0.8'],
            ['loc' => route('products.index'), 'priority' => '0.9'],
            ['loc' => route('gallery'), 'priority' => '0.5'],
            ['loc' => route('contact'), 'priority' => '0.7'],
        ]);

        Product::orderBy('sort')->get(['slug', 'updated_at'])->each(function ($product) use ($urls) {
            $urls->push([
                'loc' => route('products.show', $product->slug),
                'priority' => '0.8',
                'lastmod' => $product->updated_at->toAtomString(),
            ]);
        });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
