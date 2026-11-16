import { Upload } from 'lucide-react';

export default function UploadBox({ selectedFile, setSelectedFile, loading, handleUpload }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
        <Upload className="w-4 h-4 text-indigo-400" /> Upload Document
      </h2>
      <p className="text-xs text-slate-400 mb-4">PDF, DOCX, or TXT up to 50MB. Queued asynchronously.</p>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900 cursor-pointer"
        />
        <button
          type="submit"
          disabled={!selectedFile || loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
        >
          {loading ? 'Uploading...' : 'Submit to Worker Queue'}
        </button>
      </form>
    </div>
  );
}