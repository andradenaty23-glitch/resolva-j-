import React from 'react';
import { Home, Wrench, Calendar, LayoutGrid, User, Radar, Briefcase, FileText } from 'lucide-react';
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
    { id: 'agenda' as TabType, label: 'Agenda', icon: Calendar },
    { id: 'minhacasa' as TabType, label: 'Minha Casa', icon: LayoutGrid },
    { id: 'perfil' as TabType, label: 'Perfil', icon: User }
  ];

  const providerTabs = [
    { id: 'inicio' as TabType, label: 'Radar', icon: Radar },
    { id: 'problemas' as TabType, label: 'Orçamentos', icon: FileText, badge: 3 },
    { id: 'agenda' as TabType, label: 'Agenda', icon: Calendar },
    { id: 'minhacasa' as TabType, label: 'Serviços', icon: Briefcase },
    { id: 'perfil' as TabType, label: 'Perfil PRO', icon: User }
  ];

  const tabs = currentRole === 'cliente' ? clientTabs : providerTabs;

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-2 pb-5 px-2 bg-[#fff7fa]/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-[#f2dceb]/70 z-50 md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center transition-all active:scale-90 duration-150 w-16 group relative cursor-pointer"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#a200ac] text-white px-5 py-1.5 shadow-sm'
                    : 'text-[#544151] hover:bg-[#fee8f7] p-1.5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-0 right-3 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 truncate ${
                  isActive ? 'text-[#a200ac] font-bold' : 'text-[#867083]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Side Bar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-24 bg-[#fff7fa] border-r border-[#f2dceb] z-40 flex-col items-center py-6 gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a200ac] to-[#cb00d8] flex items-center justify-center text-white font-extrabold text-sm tracking-tighter shadow-md mb-4">
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
                    ? 'bg-[#a200ac] text-white shadow-md'
                    : 'text-[#544151] hover:bg-[#fee8f7]'
                }`}
                title={tab.label}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] font-semibold mt-1 text-center leading-tight">
                  {tab.label}
                </span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
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
