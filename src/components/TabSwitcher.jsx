export default function TabSwitcher({ mode, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {['image', 'cover'].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-6 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
            mode === m
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
