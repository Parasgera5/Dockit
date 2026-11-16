import { FileText } from 'lucide-react';

export default function DocumentList({ documents, selectedDoc, setSelectedDoc }) {
  const renderStatusBadge = (status) => {
    const styles = {
      QUEUED: 'bg-amber-100 text-amber-800 border-amber-200',
      PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
      COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      FAILED: 'bg-orange-100 text-orange-800 border-orange-200',
      FATAL_ERROR: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-indigo-400" /> My Documents ({documents.length})
      </h2>
      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">Upload a document above to extract its text.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-3.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                selectedDoc?.id === doc.id
                  ? 'bg-indigo-950/40 border-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-medium text-sm text-slate-200">{doc.originalFilename}</p>
                <p className="text-xs text-slate-400">
                  {(doc.sizeBytes / 1024).toFixed(1)} KB • {doc.contentType}
                </p>
              </div>
              {renderStatusBadge(doc.status)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}