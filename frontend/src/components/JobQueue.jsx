import { Clock, RefreshCw } from 'lucide-react';

export default function JobQueue({ jobs, handleRetry }) {
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
    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Asynchronous Job Queue
          </h2>
          <p className="text-xs text-slate-400">Auto-polling every 2 seconds • Max 3 attempts per job</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-slate-400 border-b border-slate-800">
            <tr>
              <th className="pb-2">Job ID</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Attempts</th>
              <th className="pb-2">Error Details</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500 text-xs">No background jobs queued yet.</td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-xs text-slate-400">{job.id.slice(0, 8)}...</td>
                  <td className="py-3">{renderStatusBadge(job.status)}</td>
                  <td className="py-3 text-xs">{job.attemptCount} / {job.maxAttempts}</td>
                  <td className="py-3 text-xs text-red-400 max-w-xs truncate" title={job.errorMessage || ''}>
                    {job.errorMessage || '—'}
                  </td>
                  <td className="py-3 text-right">
                    {job.status === 'FAILED' && (
                      <button
                        onClick={() => handleRetry(job.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-md transition cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}