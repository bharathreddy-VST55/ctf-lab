
'use client';
import { useSearchParams } from 'next/navigation';

export default function WantedSearch() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h1 className="page-title">Wanted Poster Search</h1>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <p>Find a pirate's wanted poster.</p>
                <form method="GET">
                    <input name="q" placeholder="e.g. Straw Hat Luffy" defaultValue={q || ''} />
                    <button type="submit" className="btn">Search</button>
                </form>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <h3>Search Results:</h3>
                {q ? (
                    /* VULNERABILITY: Unsafe HTML rendering of query parameter */
                    <div dangerouslySetInnerHTML={{ __html: `No bounties found for <b>${q}</b>` }} />
                ) : (
                    <p>Enter a name to search.</p>
                )}
            </div>

            <div className="flag">
                {'OPS{REFLECTED_XSS_GOMU_GOMU_NO_ALERT}'}
            </div>
        </div>
    );
}
