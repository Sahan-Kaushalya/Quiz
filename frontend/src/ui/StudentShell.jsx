import { Link } from 'react-router-dom';
import { Flame, LogOut, Menu, Trophy } from 'lucide-react';
import logoicon from '../assets/icons/logo.png';

function Glyph({ icon: Icon, className = '', size = 20, strokeWidth = 2.25 }) {
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}

export function StudentSidebar({ items, open, onClose, rankLabel = '#42' }) {
  return (
    <>
      {open ? <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} /> : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-surface-container-highest bg-surface-container-low py-6 transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-10 px-6">
          <div className="flex items-center gap-3">
            <img src={logoicon} alt="Quiz Master" className="h-8 w-8 rounded-lg" />
            <h3 className="font-headline-md text-headline-md font-extrabold tracking-tight text-[#4a39e2]">Quiz Master</h3>
          </div>
        </div>

        <nav className="grow space-y-1">
          {items.map((item) => {
            const isActive = Boolean(item.active);

            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                onClick={onClose}
                className={`mx-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive ? 'translate-x-1 bg-primary-container text-white shadow-sm' : 'text-[#4b5563] hover:bg-surface-container-highest'
                }`}
              >
                <Glyph icon={item.icon} size={18} strokeWidth={isActive ? 2.5 : 2.25} className={isActive ? 'text-white' : 'text-[#4b5563]'} />
                <span className="font-label-lg text-label-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 mb-4 mt-auto rounded-lg border border-outline-variant bg-surface-container-low p-4">
          <h3 className="mb-3 flex items-center gap-2 font-label-lg text-label-lg text-[#4a39e2]">
            <Trophy size={18} strokeWidth={2.25} />
            Global Rank
          </h3>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-[#6b7280]">Your Position</span>
            <span className="font-bold text-[#d27d00]">{rankLabel}</span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-white">1</span>
              <span>Leo The Brave</span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-white">2</span>
              <span>MathsWhiz2024</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function StudentHeader({ onMenuClick, avatarSrc, logoutLabel = 'Logout' }) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-surface px-4 py-3 shadow-sm md:px-margin-desktop md:py-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="rounded-lg p-2 transition-colors hover:bg-surface-container-low md:hidden" aria-label="Open menu">
          <Menu size={24} className="text-on-surface" strokeWidth={2.25} />
        </button>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden items-center gap-2 rounded-full border border-tertiary-container/20 bg-tertiary-container/10 px-3 py-1 sm:flex">
          <Flame size={16} className="text-tertiary-container" strokeWidth={2.25} />
          <span className="font-bold text-tertiary">450 XP</span>
        </div>
        <div className="flex items-center gap-2 px-3 md:gap-3 md:px-6">
          <img alt="Student Avatar" className="h-8 w-8 rounded-full border-2 border-primary object-cover md:h-10 md:w-10" src={avatarSrc} />
          <button className="chunky-button-primary flex w-full items-center justify-center gap-2 rounded-full bg-error px-6 py-2.5 text-sm font-bold text-white shadow-[0px_4px_0px_0px_#600e0e] transition-all active:translate-y-1 active:shadow-none sm:w-auto md:px-8 md:py-3 md:text-base">
            {logoutLabel}
            <LogOut size={22} className="text-white" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </header>
  );
}