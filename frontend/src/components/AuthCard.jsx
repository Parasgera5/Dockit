import { Shield } from 'lucide-react';

export default function AuthCard({
  email,
  setEmail,
  password,
  setPassword,
  isRegistering,
  setIsRegistering,
  authMessage,
  setAuthMessage,
  handleAuth
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Dokit Platform</h1>
            <p className="text-xs text-slate-400">Secure Asynchronous Document Engine</p>
          </div>
        </div>

        {authMessage && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-200 text-sm">
            {authMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="paras@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition cursor-pointer"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => { setIsRegistering(!isRegistering); setAuthMessage(''); }}
          className="mt-4 w-full text-center text-sm text-slate-400 hover:text-indigo-400 cursor-pointer"
        >
          {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register here'}
        </button>
      </div>
    </div>
  );
}