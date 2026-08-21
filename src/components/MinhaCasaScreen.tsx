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
      <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 animate-fadeIn">
        {/* Header with Back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onBackToOverview) onBackToOverview();
                setInternalActiveRoomId(null);
              }}
              className="p-2 rounded-full bg-white border border-[#e4e4e7] hover:bg-[#fff7ed] text-[#18181b] transition-colors cursor-pointer"
              title="Voltar aos cômodos"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c]">
                <RoomIcon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-[#18181b]">{selectedRoom.name}</h2>
            </div>
          </div>

          <button
            onClick={() => onOpenAddDevice(selectedRoom.id)}
            className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer border border-[#fed7aa]"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar item
          </button>
        </div>

        {/* Room Status Banner */}
        {selectedRoom.status === 'problema' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-700">Atenção requerida</h4>
                <p className="text-xs text-[#52525b]">
                  Existe 1 equipamento com falha registrada nesta área.
                </p>
              </div>
            </div>
            <button
              onClick={() => onReportProblemInRoom(selectedRoom.id, 'Torneira')}
              className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer"
            >
              Ver Solução
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 font-medium">
              Todos os {selectedRoom.items.length} itens deste cômodo estão operando normalmente.
            </p>
          </div>
        )}

        {/* Devices / Items List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-[#18181b]">Aparelhos & Instalações</h3>

          {selectedRoom.items.map((item) => {
            const ItemIcon = getDeviceIcon(item.iconName);
            const isProblem = item.status === 'problema';
            const isAttention = item.status === 'atencao';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 flex items-center justify-between border transition-all shadow-xs relative overflow-hidden ${
                  isProblem
                    ? 'border-rose-300 bg-rose-50/30'
                    : isAttention
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-[#e4e4e7] hover:border-[#d4d4d8]'
                }`}
              >
                {isProblem && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-600"></div>
                )}
                {isAttention && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                )}

                <div className="flex items-center gap-3.5 pl-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      isProblem
                        ? 'bg-rose-100 text-rose-600'
                        : isAttention
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#fff7ed] text-[#ea580c]'
                    }`}
                  >
                    <ItemIcon className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#18181b]">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#71717a]">
                      {item.brand} • Últ. rev: {item.lastReview}
                    </p>
                    {item.issueDescription && (
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium">
                        {item.issueDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isProblem ? (
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  ) : isAttention ? (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.statusText}
                    </span>
                  )}

                  {isProblem && (
                    <button
                      onClick={() => onReportProblemInRoom(selectedRoom.id, item.name)}
                      className="text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
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
          className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl py-3.5 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4" />
          Relatar novo problema neste cômodo
        </button>
      </div>
    );
  }

  // Otherwise, render Minha Casa Overview / Raio-X
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      {/* Sub-view Switcher Pills */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
            Minha Casa
          </h1>
          <p className="text-xs text-[#71717a]">Gestão inteligente de cômodos e aparelhos</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-[#e4e4e7] shadow-xs">
          <button
            onClick={() => setSubView('comodos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              subView === 'comodos'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#52525b] hover:bg-[#fff7ed] hover:text-[#ea580c]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Cômodos
          </button>
          <button
            onClick={() => setSubView('raiox')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              subView === 'raiox'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#52525b] hover:bg-[#fff7ed] hover:text-[#ea580c]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Raio-X
          </button>
        </div>
      </div>

      {subView === 'comodos' ? (
        <>
          {/* Status Summary Banner */}
          <div className="bg-[#fff7ed] rounded-2xl p-4 sm:p-5 flex flex-col gap-1 shadow-xs border border-[#fed7aa]">
            <p className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">
              Status da Casa
            </p>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <p className="text-lg sm:text-xl font-bold text-[#18181b]">
                {totalIssues > 0 ? `${totalIssues} Problema detectado` : 'Todos os sistemas normais'}
              </p>
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                  className={`bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2.5 shadow-xs border transition-all active:scale-95 cursor-pointer text-center group ${
                    isProblem
                      ? 'bg-rose-50/40 border-rose-300 hover:border-rose-500'
                      : isAttention
                      ? 'border-amber-300 hover:border-amber-500'
                      : 'border-[#e4e4e7] hover:border-[#ea580c]'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      isProblem
                        ? 'bg-rose-100 text-rose-600'
                        : isAttention
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#fff7ed] text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white'
                    }`}
                  >
                    <RoomIcon className="w-7 h-7" />
                  </div>

                  <span className="font-bold text-sm sm:text-base text-[#18181b]">
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
                          : 'text-[#71717a]'
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
            className="w-full border-2 border-dashed border-[#d4d4d8] hover:border-[#ea580c] text-[#ea580c] bg-white/50 hover:bg-[#fff7ed]/50 rounded-2xl py-4 font-bold text-sm flex justify-center items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-5 h-5" />
            Adicionar cômodo
          </button>
        </>
      ) : (
        /* Raio-X da Casa (Dashboard spec) */
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm h-36 bg-[#18181b] border border-[#27272a] p-5 flex flex-col justify-end text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ea580c]/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-[#ea580c] text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                Solvi Intelligence
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">Raio-X da Casa</h2>
              <p className="text-xs text-zinc-300">Saúde e histórico preventivo dos seus cômodos</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-emerald-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-emerald-600">8</span>
              <span className="text-xs font-bold text-emerald-700">OK</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-amber-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-amber-600">2</span>
              <span className="text-xs font-bold text-amber-700">Atenção</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-rose-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-extrabold text-rose-600">1</span>
              <span className="text-xs font-bold text-rose-700">Problema</span>
            </div>
          </div>

          {/* Attention Needed Items */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-[#18181b]">O que precisa de atenção?</h3>

            <div className="bg-white rounded-2xl p-4 border border-rose-200 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-[#18181b]">Torneira da cozinha</h4>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                    Urgente
                  </span>
                </div>
                <p className="text-xs text-[#52525b] mt-0.5">
                  Problema registrado há 3 dias. Risco de umidade nos móveis.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-[#18181b]">Máquina de lavar (Lavanderia)</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Preventiva
                  </span>
                </div>
                <p className="text-xs text-[#52525b] mt-0.5">
                  Manutenção recomendada em 15 dias para filtros e bomba de drenagem.
                </p>
              </div>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white rounded-2xl p-5 border border-[#e4e4e7] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#18181b]">
                Gastos de Manutenção (Últ. 3 meses)
              </h3>
              <span className="text-xs font-bold text-[#ea580c]">Total: R$ 680</span>
            </div>

            {/* Simple Elegant CSS Bar Chart */}
            <div className="flex items-end justify-around h-36 border-b border-[#e4e4e7] pb-2 pt-4 px-2">
              <div className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-[10px] font-bold text-[#71717a]">R$ 150</span>
                <div className="w-8 bg-[#fed7aa] rounded-t-lg h-16 transition-all hover:bg-[#fdba74]"></div>
                <span className="text-xs font-bold text-[#52525b]">Jan</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-[10px] font-bold text-[#71717a]">R$ 320</span>
                <div className="w-8 bg-[#fb923c] rounded-t-lg h-28 transition-all hover:bg-[#ea580c]"></div>
                <span className="text-xs font-bold text-[#52525b]">Fev</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-[10px] font-bold text-[#ea580c]">R$ 210</span>
                <div className="w-8 bg-[#ea580c] rounded-t-lg h-22 transition-all shadow-sm"></div>
                <span className="text-xs font-bold text-[#ea580c]">Mar</span>
              </div>
            </div>

            <div className="mt-4 flex gap-4 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#ea580c]"></div>
                <span className="text-xs font-medium text-[#52525b]">Hidráulica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#fed7aa]"></div>
                <span className="text-xs font-medium text-[#52525b]">Elétrica</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
