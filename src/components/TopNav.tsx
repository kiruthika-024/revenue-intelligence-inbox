import React from 'react';
import { 
  Inbox, 
  BarChart3, 
  GitBranch, 
  RefreshCw
} from 'lucide-react';

export type NavTab = 
  | 'inbox' 
  | 'analytics' 
  | 'routing' 
  | 'imports';

interface TopNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  needsAttentionCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  needsAttentionCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-8 px-6">
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectTab('inbox')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm tracking-tighter shadow-sm group-hover:bg-indigo-500 transition-colors">
              RT
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Revenue Tracker
            </span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('inbox')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-slate-900 text-white shadow-inner border border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Inbox className="w-4 h-4 text-slate-400" />
            <span>Calls Inbox</span>
            {needsAttentionCount > 0 && (
              <span className="ml-1 text-[11px] font-mono text-amber-400">
                ({needsAttentionCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white shadow-inner border border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('routing')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'routing'
                ? 'bg-slate-900 text-white shadow-inner border border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <GitBranch className="w-4 h-4 text-slate-400" />
            <span>Assign Calls</span>
          </button>

          <button
            onClick={() => onSelectTab('imports')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'imports'
                ? 'bg-slate-900 text-white shadow-inner border border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Import & Duplicates</span>
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>

      </div>

      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-900 bg-slate-950 text-xs">
        <button 
          onClick={() => onSelectTab('inbox')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'inbox' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Inbox ({needsAttentionCount})
        </button>
        <button 
          onClick={() => onSelectTab('analytics')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'analytics' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => onSelectTab('routing')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'routing' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Assign Calls
        </button>
        <button 
          onClick={() => onSelectTab('imports')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'imports' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Duplicates
        </button>
      </div>
    </header>
  );
};
