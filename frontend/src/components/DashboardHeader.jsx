import { Shield, LogOut } from 'lucide-react';

export default function DashboardHeader({ userEmail, handleLogout }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-indigo-400" />
        <span className="font-bold text-lg tracking-tight">Dokit</span>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Worker Pool Active</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </header>
  );
}