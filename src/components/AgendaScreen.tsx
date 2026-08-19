import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Phone, MessageSquare, AlertCircle, Wrench } from 'lucide-react';
import { Appointment } from '../types';

interface AgendaScreenProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onNewService: () => void;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  appointments,
  onCancelAppointment,
  onNewService
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#241822] tracking-tight">
            Agenda de Serviços
          </h1>
          <p className="text-xs text-[#867083]">Acompanhe visitas técnicas e agendamentos</p>
        </div>

        <button
          onClick={onNewService}
          className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer"
        >
          + Novo agendamento
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#f2dceb] text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#fee8f7] flex items-center justify-center text-[#a200ac]">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#241822]">Nenhum serviço agendado</h3>
          <p className="text-xs text-[#544151] max-w-xs">
            Quando você contratar um profissional ou agendar uma vistoria, os detalhes aparecerão aqui.
          </p>
          <button
            onClick={onNewService}
            className="mt-2 bg-[#a200ac] hover:bg-[#8e0097] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors"
          >
            Encontrar Profissional
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 border border-[#d9bfd3] shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
            >
              {/* Header Status */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f2dceb]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-extrabold text-[#006c49] uppercase tracking-wider">
                    {apt.status === 'confirmado' ? 'Visita Confirmada' : apt.status}
                  </span>
                </div>
                <span className="text-sm font-extrabold text-[#a200ac]">
                  R$ {apt.totalCost}
                </span>
              </div>

              {/* Service info */}
              <div>
                <h3 className="text-base font-bold text-[#241822]">{apt.serviceTitle}</h3>
                <p className="text-xs text-[#867083] mt-0.5">Cômodo: {apt.room}</p>
              </div>

              {/* Professional row */}
              <div className="flex items-center justify-between bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
                <div className="flex items-center gap-3">
                  <img
                    src={apt.professionalAvatar}
                    alt={apt.professionalName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#241822]">{apt.professionalName}</h4>
                    <p className="text-xs text-[#544151]">{apt.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:1199999999"
                    className="w-8 h-8 rounded-full bg-white border border-[#d9bfd3] flex items-center justify-center text-[#544151] hover:text-[#a200ac] transition-colors"
                    title="Ligar para o técnico"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => alert(`Iniciando chat seguro com ${apt.professionalName}...`)}
                    className="w-8 h-8 rounded-full bg-[#fee8f7] flex items-center justify-center text-[#a200ac] hover:bg-[#cb00d8] hover:text-white transition-colors"
                    title="Mensagem"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#544151]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#a200ac]" />
                  <span>{apt.date} • {apt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#a200ac]" />
                  <span className="truncate">{apt.address}</span>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#f2dceb]">
                <button
                  onClick={() => onCancelAppointment(apt.id)}
                  className="text-xs text-[#ba1a1a] hover:underline font-semibold py-1.5 px-3"
                >
                  Cancelar visita
                </button>
                <button
                  onClick={() => alert('Visita remarcada com sucesso para a próxima data disponível.')}
                  className="text-xs text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white font-bold py-1.5 px-4 rounded-full transition-colors"
                >
                  Reagendar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
