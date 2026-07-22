<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        $timeline = [
            ['year' => '2012', 'text' => 'Founded as a small regional gold trading operation.'],
            ['year' => '2016', 'text' => 'Added independent assay partnerships to certify every gold shipment.'],
            ['year' => '2019', 'text' => 'Began supplying Kimberley Process compliant rough and natural diamonds.'],
            ['year' => '2023', 'text' => 'Expanded logistics network to serve buyers across 30+ countries.'],
        ];

        $values = [
            [
                'title' => 'Documented, not just promised',
                'text' => 'Every shipment is backed by assay reports, certificates, or lab analysis — verifiable before final payment, not just described in an email.',
            ],
            [
                'title' => 'Transparent sourcing',
                'text' => 'We disclose purity estimates, grading, and compliance status up front, including where material is pre-refining or ungraded.',
            ],
            [
                'title' => 'Direct relationships',
                'text' => 'We work directly with buyers, refiners, and manufacturers rather than through unverified intermediaries.',
            ],
        ];

        return Inertia::render('About', [
            'timeline' => $timeline,
            'values' => $values,
        ]);
    }
}
