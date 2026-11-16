export default function TextPreview({ selectedDoc }) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
        <h2 className="text-base font-semibold mb-4">Apache Tika Extracted Text</h2>
        {selectedDoc ? (
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-y-auto max-h-96">
            {selectedDoc.status === 'COMPLETED'
              ? selectedDoc.extractedText || '(No text content detected in file)'
              : `Document is currently ${selectedDoc.status}. Text will appear automatically once the worker finishes.`}
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-500 p-8">
            Click any document on the left to inspect its extracted text.
          </div>
        )}
      </div>
    );
  }