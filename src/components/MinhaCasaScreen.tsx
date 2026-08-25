import React, { useState } from 'react';
import {
  AlertTriangle,
  Armchair,
  UtensilsCrossed,
  Bed,
  WashingMachine,
  Bath,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Droplet,
  Tv,
  Wind,
  Lightbulb,
  Refrigerator,
  Flame,
  Fan,
  Blinds,
  ShowerHead,
  Sparkles,
  BarChart3,
  Layers,
  Wrench
} from 'lucide-react';
import { Room, DeviceItem } from '../types';

interface MinhaCasaScreenProps {
  rooms: Room[];
  activeRoomId?: string | null;
  onOpenRoomDetail?: (roomId: string) => void;
  onBackToOverview?: () => void;
  onReportProblemInRoom: (roomId: string, deviceName?: string) => void;
  onOpenAddRoom: () => void;
  onOpenAddDevice: (roomId: string) => void;
}

export const MinhaCasaScreen: React.FC<MinhaCasaScreenProps> = ({
  rooms,
  activeRoomId,
  onOpenRoomDetail,
  onBackToOverview,
  onReportProblemInRoom,
  onOpenAddRoom,
  onOpenAddDevice
}) => {
  const [internalActiveRoomId, setInternalActiveRoomId] = useState<string | null>(activeRoomId || null);
  const [subView, setSubView] = useState<'comodos' | 'raiox'>('comodos');

  const selectedRoom = rooms.find((r) => r.id === (activeRoomId || internalActiveRoomId));

  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Armchair':
        return Armchair;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'Bed':
        return Bed;
      case 'WashingMachine':
        return WashingMachine;
      case 'Bath':
        return Bath;
      default:
        return Armchair;
    }
  };

  const getDeviceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Refrigerator':
        return Refrigerator;
      case 'Flame':
        return Flame;
      case 'Droplet':
        return Droplet;
      case 'Fan':
        return Fan;
      case 'Tv':
        return Tv;
      case 'Wind':
        return Wind;
      case 'Lightbulb':
        return Lightbulb;
      case 'Blinds':
        return Blinds;
      case 'WashingMachine':
        return WashingMachine;
      case 'ShowerHead':
        return ShowerHead;
      default:
        return Wrench;
    }
  };

  const totalIssues = rooms.reduce((acc, r) => acc + r.problemCount, 0);

  // If a room is selected, render Room Detail View
  if (selectedRoom) {
    const RoomIcon = getRoomIcon(selectedRoom.icon);

    return (
      <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-16 animate-fadeIn overflow-hidden">
        {/* Header with Back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onBackToOverview) onBackToOverview();
                setInternalActiveRoomId(null);
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-[#fff7ed] text-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Voltar aos cômodos"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-[#fed7aa]/60">
                <RoomIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedRoom.name}</h2>
            </div>
          </div>

          <button
            onClick={() => onOpenAddDevice(selectedRoom.id)}
            className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-[#fed7aa] shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar item
          </button>
        </div>

        {/* Room Status Banner */}
        {selectedRoom.status === 'problema' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-800">Atenção requerida</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Existe 1 equipamento com falha registrada nesta área.
                </p>
              </div>
            </div>
            <button
              onClick={() => onReportProblemInRoom(selectedRoom.id, 'Torneira')}
              className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Ver Solução
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm text-emerald-900 font-semibold">
              Todos os {selectedRoom.items.length} itens deste cômodo estão operando normalmente.
            </p>
          </div>
        )}

        {/* Devices / Items List */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Aparelhos & Instalações</h3>

          {selectedRoom.items.map((item) => {
            const ItemIcon = getDeviceIcon(item.iconName);
            const isProblem = item.status === 'problema';
            const isAttention = item.status === 'atencao';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 flex items-center justify-between border transition-all shadow-xs relative overflow-hidden ${
                  isProblem
                    ? 'border-rose-200 bg-rose-50/20'
                    : isAttention
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 pl-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isProblem
                        ? 'bg-rose-100 text-rose-600'
                        : isAttention
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]/50'
                    }`}
                  >
                    <ItemIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.brand} • Últ. rev: {item.lastReview}
                    </p>
                    {item.issueDescription && (
                      <p className="text-xs text-rose-600 mt-0.5 font-bold">
                        {item.issueDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {isProblem ? (
                    <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  ) : isAttention ? (
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  )}

                  {isProblem && (
                    <button
                      onClick={() => onReportProblemInRoom(selectedRoom.id, item.name)}
                      className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
                    >
                      Chamar técnico
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA: Relatar novo problema */}
        <button
          onClick={() => onReportProblemInRoom(selectedRoom.id)}
          className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl py-3.5 font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          Relatar novo problema neste cômodo
        </button>
      </div>
    );
  }

  // Otherwise, render Minha Casa Overview / Raio-X
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-16 overflow-hidden animate-fadeIn">
      {/* Sub-view Switcher Pills */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Minha Casa
          </h1>
          <p className="text-xs text-slate-500 font-medium">Gestão preventiva e histórico de instalações</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setSubView('comodos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subView === 'comodos'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Cômodos
          </button>
          <button
            onClick={() => setSubView('raiox')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subView === 'raiox'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Raio-X
          </button>
        </div>
      </div>

      {subView === 'comodos' ? (
        <>
          {/* Status Summary Banner */}
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 shadow-xs border border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Diagnóstico Geral da Propriedade
            </p>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-base font-extrabold text-slate-900">
                {totalIssues > 0 ? `${totalIssues} ponto de atenção detectado` : 'Todos os sistemas operando normalmente'}
              </p>
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {rooms.map((room) => {
              const RoomIcon = getRoomIcon(room.icon);
              const isProblem = room.status === 'problema';
              const isAttention = room.status === 'atencao';

              return (
                <button
                  key={room.id}
                  id={`room-card-${room.id}`}
                  onClick={() => {
                    if (onOpenRoomDetail) onOpenRoomDetail(room.id);
                    setInternalActiveRoomId(room.id);
                  }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2.5 shadow-xs border transition-all active:scale-98 cursor-pointer text-center group ${
                    isProblem
                      ? 'bg-rose-50/20 border-rose-200 hover:border-rose-400'
                      : isAttention
                      ? 'border-amber-200 hover:border-amber-400'
                      : 'border-slate-200 hover:border-[#ea580c]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isProblem
                        ? 'bg-rose-100 text-rose-600'
                        : isAttention
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#fff7ed] text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white border border-[#fed7aa]/50'
                    }`}
                  >
                    <RoomIcon className="w-6 h-6" />
                  </div>

                  <span className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {room.name}
                  </span>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isProblem
                          ? 'bg-rose-600'
                          : isAttention
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-semibold ${
                        isProblem
                          ? 'text-rose-600'
                          : isAttention
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {room.statusText}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add Room CTA */}
          <button
            id="btn-add-room"
            onClick={onOpenAddRoom}
            className="w-full border-2 border-dashed border-slate-300 hover:border-[#ea580c] text-[#ea580c] bg-white/70 hover:bg-[#fff7ed]/50 rounded-2xl py-3.5 font-bold text-sm flex justify-center items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Adicionar novo cômodo
          </button>
        </>
      ) : (
        /* Raio-X da Casa (Dashboard spec) */
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm h-32 bg-slate-900 border border-slate-800 p-5 flex flex-col justify-end text-white">
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#ea580c] text-white px-2.5 py-0.5 rounded-md inline-block mb-1">
                Resolva Já Intelligence
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Raio-X da Residência</h2>
              <p className="text-xs text-slate-300">Saúde e histórico preventivo dos seus aparelhos</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3.5 border border-emerald-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-emerald-600">8</span>
              <span className="text-xs font-bold text-emerald-800">Em ordem</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-amber-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-amber-600">2</span>
              <span className="text-xs font-bold text-amber-800">Atenção</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-rose-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-rose-600">1</span>
              <span className="text-xs font-bold text-rose-800">Problema</span>
            </div>
          </div>

          {/* Attention Needed Items */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">O que precisa de atenção?</h3>

            <div className="bg-white rounded-2xl p-4 border border-rose-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900">Torneira da cozinha</h4>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">
                    Urgente
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Problema registrado há 3 dias. Risco de umidade no gabinete.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900">Máquina de lavar (Lavanderia)</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                    Preventiva
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manutenção recomendada em 15 dias para filtros e bomba de drenagem.
                </p>
              </div>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Gastos de Manutenção (Últ. 3 meses)
              </h3>
              <span className="text-xs font-extrabold text-[#ea580c]">Total: R$ 680</span>
            </div>

            {/* Simple Elegant CSS Bar Chart */}
            <div className="flex items-end justify-around h-32 border-b border-slate-100 pb-2 pt-2 px-2">
              <div className="flex flex-col items-center gap-1 w-14">
                <span className="text-[11px] font-bold text-slate-400">R$ 150</span>
                <div className="w-8 bg-[#fed7aa] rounded-t-lg h-14 transition-all hover:bg-[#fdba74]"></div>
                <span className="text-xs font-semibold text-slate-600">Jan</span>
              </div>

              <div className="flex flex-col items-center gap-1 w-14">
                <span className="text-[11px] font-bold text-slate-400">R$ 320</span>
                <div className="w-8 bg-[#fb923c] rounded-t-lg h-24 transition-all hover:bg-[#ea580c]"></div>
                <span className="text-xs font-semibold text-slate-600">Fev</span>
              </div>

              <div className="flex flex-col items-center gap-1 w-14">
                <span className="text-[11px] font-bold text-[#ea580c]">R$ 210</span>
                <div className="w-8 bg-[#ea580c] rounded-t-lg h-20 transition-all shadow-xs"></div>
                <span className="text-xs font-bold text-[#ea580c]">Mar</span>
              </div>
            </div>

            <div className="mt-3 flex gap-4 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-[#ea580c]"></div>
                <span className="text-xs font-medium text-slate-600">Hidráulica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-[#fed7aa]"></div>
                <span className="text-xs font-medium text-slate-600">Elétrica</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
