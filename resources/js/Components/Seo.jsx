import { Head, usePage } from '@inertiajs/react';

/**
 * Per-page SEO tags. Every page passes its own title/description so search
 * engines get distinct, relevant metadata instead of one generic tag set.
 */
export default function Seo({ title, description, path, image, schema }) {
    const { url: pageUrl } = usePage();
    const resolvedPath = path !== undefined ? path : pageUrl;
    
    // Ensure we don't double slash if the env variable ends with /
    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const url = `${baseUrl}${resolvedPath}`;
    const siteName = "E-Landlord Property Hub";

    const defaultImage = `${baseUrl}/images/og-cover.jpg`;
    const ogImage = image 
        ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : '/images/products/' + image}`) 
        : defaultImage;

    return (
        <Head title={title}>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:title" content={`${title} — ${siteName}`} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={ogImage} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${title} — ${siteName}`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Head>
    );
}
