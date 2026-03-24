import { useState, useMemo } from 'react';
import { Search, User, MapPin } from 'lucide-react';
import { guests } from './data';

const EQUIVALENCES = [
  ['mike', 'michael'],
  ['nick', 'nicholas'],
  ['matt', 'matthew'],
  ['ben', 'benjamin'],
  ['alex', 'alexander', 'alexandra'],
  ['josh', 'joshua'],
  ['gabe', 'gabriel'],
  ['katie', 'katherine'],
  ['becca', 'rebecca', 'beccy'],
  ['tom', 'thomas'],
  ['will', 'william', 'willie'],
  ['lexi', 'alexis'],
  ['maddie', 'madison'],
  ['greg', 'gregg', 'gregory'],
  ['joe', 'joseph'],
  ['sam', 'samuel'],
  ['chris', 'christopher'],
  ['jon', 'jonathan'],
  ['dan', 'daniel'],
  ['zach', 'zachary'],
  ['eli', 'elijah', 'elias'],
  ['angie', 'agustina', 'angelina'],
  ['jake', 'jacob'],
  ['fred', 'freddie', "frederick"],
  ['mitch', 'mitchell'],
  ['andy', 'andrew'],
  ['cam', 'cameron'],
  ['dave', 'david'],
  ['charlie', 'charles'],
  ['al', 'alvaro', 'albert'],
  ['leo', 'leonardo'],
  ['maggie', 'magdalena', 'margarita']
];

const NICKNAME_MAP: Record<string, Set<string>> = {};

EQUIVALENCES.forEach(group => {
  group.forEach(name => {
    if (!NICKNAME_MAP[name]) NICKNAME_MAP[name] = new Set();
    group.forEach(n => NICKNAME_MAP[name].add(n));
  });
});

function getEquivalentTokens(token: string): string[] {
  if (NICKNAME_MAP[token]) {
    return Array.from(NICKNAME_MAP[token]);
  }
  return [token];
}

function normalizeAndTokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 0 && t !== 'jr' && t !== 'sr');
}

export default function App() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];

    const queryTokens = normalizeAndTokenize(query);
    if (queryTokens.length === 0) return [];

    return guests.filter((guest) => {
      const guestFullName = `${guest.firstName} ${guest.lastName}`;
      const guestTokens = normalizeAndTokenize(guestFullName);

      // Check if every token in the query matches at least one token in the guest name (using equivalence)
      return queryTokens.every(qToken => {
        const equivalentQTokens = getEquivalentTokens(qToken);
        return guestTokens.some(gToken => 
          equivalentQTokens.some(eq => gToken.startsWith(eq) || eq.startsWith(gToken))
        );
      });
    });
  }, [query]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Find Your Seat</h1>
        <p>Welcome to our wedding! Please enter your name to find your table.</p>
      </header>

      <main className="main-content">
        <div className="search-box">
          <div className="input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Enter first or last name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            {query.length > 0 && (
              <button className="clear-button" onClick={() => setQuery('')}>
                Clear
              </button>
            )}
          </div>
          <div className="help-text">
            You can search for your name, or search for someone else to help them find their seat!
          </div>
        </div>

        <div className="results-container">
          {query.trim().length >= 2 ? (
            results.length > 0 ? (
              <ul className="results-list">
                {results.map((guest, index) => (
                  <li key={index} className="result-card">
                    <div className="result-header">
                      <User className="user-icon" size={24} />
                      <h2 className="guest-name">
                        {guest.firstName} {guest.lastName}
                      </h2>
                    </div>
                    <div className="table-info">
                      <div className="table-number-badge">
                        <MapPin size={16} />
                        <span>{guest.tableName}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-results">
                <p>No guests found matching "{query}".</p>
                <p>Try searching by just your first or last name, or check for typos.</p>
              </div>
            )
          ) : (
             query.trim().length > 0 ? (
                <div className="prompt-text">Keep typing to search...</div>
             ) : null
          )}
        </div>
      </main>
    </div>
  );
}
