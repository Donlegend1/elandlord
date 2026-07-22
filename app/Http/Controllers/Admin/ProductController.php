<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::latest()->get();
        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:sale,rental,land,off-plan'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'price' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:100'],
            'bedrooms' => ['nullable', 'integer'],
            'bathrooms' => ['nullable', 'integer'],
            'area' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'max:100'],
            'amenities' => ['nullable', 'array'],
        ]);

        $slug = $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($request->input('name'));
        
        // Ensure slug uniqueness
        $count = Product::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-" . time();
        }

        $specs = [
            'price' => $request->input('price'),
            'location' => $request->input('location'),
            'type' => $request->input('type'),
            'bedrooms' => (int) $request->input('bedrooms', 0),
            'bathrooms' => (int) $request->input('bathrooms', 0),
            'area' => $request->input('area', ''),
            'status' => $request->input('status'),
            'amenities' => $request->input('amenities', []),
            'images' => $request->input('images', []),
        ];

        Product::create([
            'name' => $request->input('name'),
            'slug' => $slug,
            'category' => $request->input('category'),
            'tagline' => $request->input('tagline'),
            'description' => $request->input('description'),
            'image' => $request->input('image') ?: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'specs' => $specs,
            'sort' => Product::max('sort') + 1,
        ]);

        return redirect()->route('admin.properties.index')->with('success', 'Property listing created successfully.');
    }

    public function edit(int $id): Response
    {
        $product = Product::findOrFail($id);
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:sale,rental,land,off-plan'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'price' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:100'],
            'bedrooms' => ['nullable', 'integer'],
            'bathrooms' => ['nullable', 'integer'],
            'area' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'max:100'],
            'amenities' => ['nullable', 'array'],
        ]);

        $slug = $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($request->input('name'));
        if ($slug !== $product->slug) {
            $count = Product::where('slug', 'like', "{$slug}%")->where('id', '!=', $id)->count();
            if ($count > 0) {
                $slug = "{$slug}-" . time();
            }
        } else {
            $slug = $product->slug;
        }

        $specs = [
            'price' => $request->input('price'),
            'location' => $request->input('location'),
            'type' => $request->input('type'),
            'bedrooms' => (int) $request->input('bedrooms', 0),
            'bathrooms' => (int) $request->input('bathrooms', 0),
            'area' => $request->input('area', ''),
            'status' => $request->input('status'),
            'amenities' => $request->input('amenities', []),
            'images' => $request->input('images', []),
        ];

        $product->update([
            'name' => $request->input('name'),
            'slug' => $slug,
            'category' => $request->input('category'),
            'tagline' => $request->input('tagline'),
            'description' => $request->input('description'),
            'image' => $request->input('image') ?: $product->image,
            'specs' => $specs,
        ]);

        return redirect()->route('admin.properties.index')->with('success', 'Property listing updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.properties.index')->with('success', 'Property listing deleted successfully.');
    }

    public function uploadImage(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'], // 10MB max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            
            // Ensure public/uploads exists
            $destinationPath = public_path('uploads');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $file->move($destinationPath, $filename);
            
            $url = '/uploads/' . $filename;
            
            return response()->json([
                'url' => $url,
            ]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
