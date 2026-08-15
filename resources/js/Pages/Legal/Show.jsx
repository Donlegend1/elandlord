import LegalDocument from '@/Components/LegalDocument';

export default function Show({ page }) {
    return (
        <LegalDocument
            title={page.title}
            description={page.description}
            updated={page.updated}
            html={page.html}
        />
    );
}
