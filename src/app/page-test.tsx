export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          Test Page
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280'
        }}>
          If you can see this, the basic setup is working.
        </p>
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.5rem',
          display: 'inline-block'
        }}>
          <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> Page loaded successfully
        </div>
      </div>
    </div>
  )
}