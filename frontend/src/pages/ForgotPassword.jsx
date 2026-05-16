import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../config';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email
      });

      if (response.data.success) {
        toast.success('Password reset link sent to your email');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f4ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-3xl">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-200/70 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-24 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl" />

        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_30px_90px_rgba(45,108,255,0.12)] backdrop-blur-xl sm:px-10 sm:py-12">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
              Account Help
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Forgot Your Password?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Enter your email and we'll send a secure link so you can reset your password and continue shopping.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-3 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200/50 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-600 hover:text-blue-700"
              >
                Back to Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Tip: use the same email you registered with so the reset link reaches you instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 