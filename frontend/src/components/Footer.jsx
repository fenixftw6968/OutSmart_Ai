import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-mono font-medium text-slate-400">
            Powered by NVIDIA Nemotron Ultra AI Engine
          </span>
        </div>
        <div className="flex items-center space-x-4 font-mono">
          <span className="flex items-center text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1" />
            Server-Authoritative Anti-Cheat Active
          </span>
          <span>© 2026 Can You Outsmart AI</span>
        </div>
      </div>
    </footer>
  );
}
