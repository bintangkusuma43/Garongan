'use strict';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const [isOffline, setIsOffline] = useState(false);

  React.useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setIsOffline(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const inputEmail = email.trim().toLowerCase();

    // 1. Direct validation for registered Dusun Admin role accounts
    const validAccounts = [
      { email: 'admin@garongan.id', pass: 'admin123' },
      { email: 'rt@garongan.id', pass: 'GaronganRT01#2026' },
      { email: 'pemuda@garongan.id', pass: 'PemudaGarongan#2026' },
      { email: 'sekretaris@garongan.id', pass: 'SekretarisGarongan#2026' },
    ];

    const match = validAccounts.find(
      acc => acc.email.toLowerCase() === inputEmail && acc.pass === password
    );

    if (match) {
      document.cookie = "mock-session=true; path=/; max-age=86400";
      router.push('/admin/dashboard');
      router.refresh();
      return;
    }

    const isOfflineMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (isOfflineMode) {
      setErrorMsg('Email atau password salah! Silakan periksa kembali email dan password admin Anda.');
      setLoading(false);
      return;
    }

    // 2. Supabase Auth Fallback
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Login gagal. Periksa kembali email dan password Anda.');
      } else if (data.user) {
        document.cookie = "mock-session=true; path=/; max-age=86400";
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan jaringan. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-hover to-primary-light flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoratives */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary-soft/15 rounded-full blur-3xl" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary text-white p-3 rounded-2xl shadow-md mb-2">
            <Leaf className="h-6 w-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Admin RT 01 Garongan</h1>
          <p className="text-xs text-muted font-medium">Masuk untuk mengelola data website profil dusun</p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start space-x-2 text-xs text-red-800 font-semibold leading-relaxed">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block" htmlFor="email">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@garongan.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Credentials hints */}
        <div className="pt-4 border-t border-border text-center space-y-1">
          <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-xl text-[10px] text-[#14532D] font-semibold leading-relaxed text-left space-y-1">
            <span className="block font-bold flex items-center space-x-1">
              <span>💡 Akun Login Admin Pengurus Dusun:</span>
            </span>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100 font-mono text-[9.5px] mt-1 space-y-1 text-slate-800">
              <div>1. Pak RT: <span className="font-bold text-[#14532D]">rt@garongan.id</span> / <span className="font-bold text-[#14532D]">GaronganRT01#2026</span></div>
              <div>2. Pemuda: <span className="font-bold text-[#14532D]">pemuda@garongan.id</span> / <span className="font-bold text-[#14532D]">PemudaGarongan#2026</span></div>
              <div>3. Sekretaris: <span className="font-bold text-[#14532D]">sekretaris@garongan.id</span> / <span className="font-bold text-[#14532D]">SekretarisGarongan#2026</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
