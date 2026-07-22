<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::orderBy('sort')->get();

        return Inertia::render('Products', [
            'products' => $products,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $related = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->orderBy('sort')
            ->take(3)
            ->get();

        if ($related->isEmpty()) {
            $related = Product::where('id', '!=', $product->id)
                ->orderBy('sort')
                ->take(3)
                ->get();
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
