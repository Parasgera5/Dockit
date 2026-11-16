import { useState, useEffect, useCallback } from 'react';
import AuthCard from './components/AuthCard';
import DashboardHeader from './components/DashboardHeader';
import UploadBox from './components/UploadBox';
import JobQueue from './components/JobQueue';
import DocumentList from './components/DocumentList';
import TextPreview from './components/TextPreview';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState(localStorage.getItem('dokit_auth') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('dokit_email') || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const [documents, setDocuments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = useCallback(async (token) => {
    if (!token) return;
    try {
      const [docsRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE}/documents`, { headers: { Authorization: token } }),
        fetch(`${API_BASE}/jobs`, { headers: { Authorization: token } })
      ]);

      if (docsRes.status === 401 || jobsRes.status === 401) {
        handleLogout();
        setAuthMessage('Invalid credentials. Please log in again.');
        return;
      }

      if (docsRes.ok && jobsRes.ok) {
        const docsData = await docsRes.json();
        const jobsData = await jobsRes.json();
        setDocuments(docsData);
        setJobs(jobsData);
      }
    } catch (err) {
      setErrorMsg('Cannot reach backend server.');
    }
  }, []);

  useEffect(() => {
    if (!authHeader) return;
    fetchDashboardData(authHeader);
    const interval = setInterval(() => {
      fetchDashboardData(authHeader);
    }, 2000);
    return () => clearInterval(interval);
  }, [authHeader, fetchDashboardData]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    setErrorMsg('');

    if (isRegistering) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const text = await res.text();
        if (res.ok) {
          setIsRegistering(false);
          setAuthMessage('Registration successful! You can now sign in.');
        } else {
          setAuthMessage(text || 'Registration failed.');
        }
      } catch (err) {
        setAuthMessage('Server connection failed.');
      }
    } else {
      const token = 'Basic ' + btoa(`${email}:${password}`);
      const res = await fetch(`${API_BASE}/documents`, {
        headers: { Authorization: token }
      });

      if (res.ok) {
        localStorage.setItem('dokit_auth', token);
        localStorage.setItem('dokit_email', email);
        setAuthHeader(token);
        setUserEmail(email);
        setPassword('');
      } else {
        setAuthMessage('Invalid email or password.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dokit_auth');
    localStorage.removeItem('dokit_email');
    setAuthHeader('');
    setUserEmail('');
    setDocuments([]);
    setJobs([]);
    setSelectedDoc(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: formData
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setSelectedFile(null);
      e.target.reset();
      fetchDashboardData(authHeader);
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (jobId) => {
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/jobs/${jobId}/retry`, {
        method: 'POST',
        headers: { Authorization: authHeader }
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      fetchDashboardData(authHeader);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!authHeader) {
    return (
      <AuthCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        authMessage={authMessage}
        setAuthMessage={setAuthMessage}
        handleAuth={handleAuth}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader userEmail={userEmail} handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-xs underline cursor-pointer">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UploadBox
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            loading={loading}
            handleUpload={handleUpload}
          />
          <JobQueue jobs={jobs} handleRetry={handleRetry} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentList
            documents={documents}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
          <TextPreview selectedDoc={selectedDoc} />
        </div>
      </main>
    </div>
  );
}