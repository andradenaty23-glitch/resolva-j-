import React from 'react';
import { Home, Wrench, Calendar, LayoutGrid, User, Radar, Briefcase, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { TabType, UserRole } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingProblemsCount: number;
  currentRole: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingProblemsCount,
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
    { id: 'inicio' as TabType, label: 'Painel & Gráficos', icon: BarChart3 },
    { id: 'problemas' as TabType, label: 'Orçamentos', icon: FileText, badge: 1 },
    { id: 'agenda' as TabType, label: 'Agenda', icon: Calendar },
    { id: 'minhacasa' as TabType, label: 'Serviços', icon: Briefcase },
    { id: 'perfil' as TabType, label: 'Perfil PRO', icon: User }
  ];

  const tabs = currentRole === 'cliente' ? clientTabs : providerTabs;

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-between items-center pt-1.5 pb-3 px-1 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-[#e4e4e7] z-50 md:hidden overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center transition-all active:scale-95 duration-150 flex-1 min-w-[50px] max-w-[70px] group relative cursor-pointer py-0.5"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#18181b] text-[#ea580c] px-3.5 py-1 shadow-xs'
                    : 'text-[#71717a] p-1 hover:bg-[#f4f4f5]'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[9.5px] sm:text-[10.5px] font-medium tracking-tighter mt-0.5 truncate max-w-full ${
                  isActive ? 'text-[#18181b] font-bold' : 'text-[#71717a]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Side Bar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-24 bg-white border-r border-[#e4e4e7] z-40 flex-col items-center py-6 gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#18181b] flex items-center justify-center text-[#ea580c] font-extrabold text-sm tracking-tighter shadow-md mb-4 border border-[#27272a]">
          RJ
        </div>

        <div className="flex flex-col gap-3 w-full px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`desktop-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 w-full relative cursor-pointer ${
                  isActive
                    ? 'bg-[#18181b] text-[#ea580c] shadow-md'
                    : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]'
                }`}
                title={tab.label}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] font-semibold mt-1 text-center leading-tight">
                  {tab.label}
                </span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
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
