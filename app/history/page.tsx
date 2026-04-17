import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function HistoryPage() {
  const { data: validations } = await supabase
    .from('idea_validations')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container">
      <div className="card">
        <h1>📚 Validation History</h1>
        <a href="/" style={{ color: '#667eea' }}>← Back to Validator</a>
        
        <div style={{ marginTop: '30px' }}>
          {validations?.map((item) => (
            <div key={item.id} className="history-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>{new Date(item.created_at).toLocaleString()}</strong>
                {item.is_mock && <span style={{ color: '#f59e0b' }}>⚡ Mock Response</span>}
              </div>
              <p><strong>💡 Idea:</strong> {item.idea}</p>
              <div style={{ marginTop: '15px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {item.ai_response}
                </pre>
              </div>
            </div>
          ))}
          
          {validations?.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666' }}>
              No validations yet. <a href="/">Validate your first idea!</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}