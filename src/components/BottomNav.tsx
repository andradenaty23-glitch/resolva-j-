import React from 'react';
import { Home, Wrench, Calendar, LayoutGrid, User, Briefcase, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { TabType, UserRole } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingProblemsCount: number;
  providerPendingCount?: number;
  currentRole: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingProblemsCount,
  providerPendingCount = 0,
  currentRole
}) => {
  const clientTabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: Home },
    { id: 'problemas' as TabType, label: 'Problemas', icon: Wrench, badge: pendingProblemsCount },
    { id: 'pagamentos' as TabType, label: 'Pagamentos', icon: CreditCard },
    { id: 'agenda' as TabType, label: 'Agenda', icon: Calendar },
    { id: 'minhacasa' as TabType, label: 'Minha Casa', icon: LayoutGrid },
    { id: 'perfil' as TabType, label: 'Perfil', icon: User }
  ];

  const providerTabs = [
    { id: 'inicio' as TabType, label: 'Painel', fullLabel: 'Painel & Gráficos', icon: BarChart3 },
    { id: 'problemas' as TabType, label: 'Orçamentos', fullLabel: 'Orçamentos', icon: FileText, badge: providerPendingCount },
    { id: 'agenda' as TabType, label: 'Agenda', fullLabel: 'Agenda', icon: Calendar },
    { id: 'minhacasa' as TabType, label: 'Serviços', fullLabel: 'Serviços', icon: Briefcase },
    { id: 'perfil' as TabType, label: 'Perfil PRO', fullLabel: 'Perfil PRO', icon: User }
  ];

  const tabs = currentRole === 'cliente' ? clientTabs : providerTabs;

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="fixed bottom-0 left-0 w-full max-w-full flex justify-around items-stretch pt-1.5 pb-2 px-1 bg-white/95 backdrop-blur-lg shadow-[0_-4px_25px_rgba(0,0,0,0.06)] border-t border-slate-200/90 z-50 md:hidden overflow-hidden safe-bottom select-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const displayLabel = tab.label;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              aria-label={`${displayLabel}${tab.badge && tab.badge > 0 ? `, ${tab.badge} pendente(s)` : ''}`}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center transition-all active:scale-95 duration-150 flex-1 min-w-0 min-h-[48px] group relative cursor-pointer px-0.5 py-1 focus-visible:outline-hidden"
            >
              <div
                className={`flex items-center justify-center rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-slate-900 text-[#ea580c] px-2.5 sm:px-3 py-1 shadow-xs'
                    : 'text-slate-500 p-1 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 truncate max-w-full text-center leading-tight tracking-tight px-0.5 ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-medium'
                }`}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Side Bar */}
      <aside
        aria-label="Navegação Principal Desktop"
        className="hidden md:flex fixed top-0 left-0 h-full w-24 bg-white border-r border-slate-200/80 z-40 flex-col items-center py-6 gap-6 shadow-xs"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#ea580c] font-black text-base tracking-tight shadow-md mb-2 border border-slate-800">
          RJ
        </div>

        <div className="flex flex-col gap-2.5 w-full px-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const labelText = (tab as any).fullLabel || tab.label;

            return (
              <button
                key={tab.id}
                id={`desktop-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                aria-label={`${labelText}${tab.badge && tab.badge > 0 ? `, ${tab.badge} pendente(s)` : ''}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 w-full min-h-[52px] relative cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-[#ea580c] shadow-sm scale-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={labelText}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                <span className="text-[11px] font-bold mt-1 text-center leading-tight">
                  {labelText}
                </span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
