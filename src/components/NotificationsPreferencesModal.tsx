import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  Trash2,
  Smartphone,
  MessageSquare,
  Shield,
  CreditCard,
  Wrench,
  Sparkles,
  Check
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onAddTestNotification?: (notification: NotificationItem) => void;
}

export const NotificationsPreferencesModal: React.FC<NotificationsPreferencesModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onAddTestNotification
}) => {
  const [activeTab, setActiveTab] = useState<'avisos' | 'preferencias'>('avisos');

  // Interactive Preference Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [preventiveAlerts, setPreventiveAlerts] = useState(true);
  const [financialAlerts, setFinancialAlerts] = useState(true);
  const [warrantyAlerts, setWarrantyAlerts] = useState(true);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPushEnabled(true);
          new Notification('Resolva Já', {
            body: 'Notificações ativadas com sucesso! Você receberá alertas em tempo real.',
            icon: '/icon.png'
          });
        }
      } catch {
        setPushEnabled(true);
      }
    } else {
      setPushEnabled(!pushEnabled);
    }
  };

  const handleSendTest = () => {
    const testItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Alerta Preventivo Residencial 🏠',
      message: 'Sua inspeção hidráulica preventiva semestral está em dia com garantia 90 dias ativa.',
      time: 'Agora',
      read: false,
      type: 'info'
    };

    if (onAddTestNotification) {
      onAddTestNotification(testItem);
    }
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center shadow-2xs">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#18181b]">
                Alertas & Notificações
              </h3>
              <p className="text-xs text-[#71717a]">
                Avisos preventivos da casa, status de agendamentos e preferências
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-[#e4e4e7] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('avisos')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'avisos'
                ? 'bg-[#18181b] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Feed de Avisos ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferencias')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'preferencias'
                ? 'bg-[#ea580c] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Canais & Preferências
          </button>
        </div>

        {/* TAB 1: FEED DE AVISOS */}
        {activeTab === 'avisos' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#71717a] font-medium">
                {notifications.length} avisos registrados
              </span>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && onMarkAllAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="text-[#ea580c] font-bold hover:underline cursor-pointer"
                  >
                    Marcar lidas
                  </button>
                )}
                {notifications.length > 0 && onClearAll && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-[#71717a] hover:text-rose-600 font-medium cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-[#e4e4e7] bg-[#fafafa] text-center space-y-2">
                <Bell className="w-8 h-8 text-[#a1a1aa] mx-auto opacity-50" />
                <p className="text-xs font-bold text-[#18181b]">Nenhum alerta recente</p>
                <p className="text-[11px] text-[#71717a] max-w-xs mx-auto">
                  Você receberá notificações automáticas quando houver propostas de prestadores, lembretes de visitas e avisos de manutenção da sua casa.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      n.read ? 'bg-[#fafafa] border-[#e4e4e7]' : 'bg-white border-[#fed7aa] ring-1 ring-[#ea580c]/10 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
                        <h4 className="text-xs font-bold text-[#18181b]">{n.title}</h4>
                      </div>
                      <span className="text-[10px] text-[#71717a] font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#52525b] mt-1.5 pl-4">{n.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Test Trigger Button */}
            <div className="pt-2 border-t border-[#e4e4e7] flex items-center justify-between">
              <span className="text-[11px] text-[#71717a]">Deseja testar os alertas no seu aparelho?</span>
              <button
                type="button"
                onClick={handleSendTest}
                className="text-xs font-bold text-[#ea580c] hover:bg-[#fff7ed] px-3 py-1.5 rounded-full transition-all border border-[#fed7aa] cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {testNotificationSent ? 'Alerta Enviado!' : 'Gerar Alerta Teste'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CANAIS E PREFERÊNCIAS */}
        {activeTab === 'preferencias' && (
          <div className="space-y-3.5 text-xs text-[#18181b]">
            <p className="text-[#71717a] text-xs">
              Escolha quais canais e tipos de notificações você deseja receber:
            </p>

            <div className="bg-[#fafafa] rounded-2xl border border-[#e4e4e7] divide-y divide-[#e4e4e7]">
              {/* Push Browser */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">Notificações Push no Celular / Web</h4>
                    <p className="text-[11px] text-[#71717a]">Avisos instantâneos mesmo com o app fechado</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPush}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    pushEnabled ? 'bg-[#ea580c]' : 'bg-[#d4d4d8]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      pushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Alerts */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">Mensagens no WhatsApp</h4>
                    <p className="text-[11px] text-[#71717a]">Confirmação de visita, chegada do técnico e relatórios</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    whatsappEnabled ? 'bg-[#ea580c]' : 'bg-[#d4d4d8]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Preventive House Maintenance */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">Avisos Preventivos da Casa</h4>
                    <p className="text-[11px] text-[#71717a]">Limpeza de ar-condicionado, caixa d'água e quadro elétrico</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreventiveAlerts(!preventiveAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    preventiveAlerts ? 'bg-[#ea580c]' : 'bg-[#d4d4d8]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      preventiveAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Financial & Custody */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">Financeiro & Custódia Pix</h4>
                    <p className="text-[11px] text-[#71717a]">Recibos emitidos, liberação de pagamento e faturas</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFinancialAlerts(!financialAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    financialAlerts ? 'bg-[#ea580c]' : 'bg-[#d4d4d8]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      financialAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Warranty Expiry */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">Lembrete de Vencimento de Garantia</h4>
                    <p className="text-[11px] text-[#71717a]">Aviso 7 dias antes do término dos 90 dias cobertos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWarrantyAlerts(!warrantyAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    warrantyAlerts ? 'bg-[#ea580c]' : 'bg-[#d4d4d8]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      warrantyAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Salvar Preferências
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
