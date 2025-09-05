export default function TestSimplePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p>If you can see this page, the basic routing is working.</p>
      <p className="mt-2">Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}