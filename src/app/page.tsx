'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === 'true') {

      window.location.href = '/people';
    }
  }, []);

  const handleLogin = () => {
    login();
  };
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Background blur effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[469px] h-[469px] rounded-full opacity-80"
          style={{
            background: '#870000',
            filter: 'blur(200px)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="flex flex-col items-center gap-10 max-w-sm w-full">
          {/* TEDx Logo */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-normal mb-2">
              <span className="text-red-500 font-bold">TED</span>
              <span className="text-red-500 font-bold">x</span>
              <span className="text-white">BITSGoa</span>
            </h1>
            <p className="text-white text-base font-normal">#welovetedxfamily</p>
          </div>

          {/* Sign in button */}
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 border border-zinc-600 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-white text-base font-normal">
              {isLoading ? 'Loading...' : 'Sign in with Google'}
            </span>
          </button>
        </div>
      </div>


    </div>
  );
}
