import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
  Shield,
  Phone,
  AlertTriangle,
  HelpCircle,
  Check,
  Plus,
  Tv,
  Droplet,
  Zap,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Professional, Appointment, NotificationItem } from '../types';
import { SafeAvatar } from './SafeAvatar';

// 1. Voice Recognition Modal
interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (text: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setSeconds(0);
      return;
    }

    setIsRecording(true);
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Simulation of live speech transcript if Web Speech API isn't active
    const samplePhrases = [
      'Minha torneira da cozinha começou a vazar muita água pela base hoje cedo',
      'O chuveiro elétrico do banheiro principal está saindo apenas água fria',
      'O disjuntor principal da sala está desarmando quando ligo o ferro'
    ];
    const picked = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];

    const timeout = setTimeout(() => {
      setTranscript(picked);
      setIsRecording(false);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-5 border border-[#e4e4e7] text-center animate-scaleUp">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-black text-[#71717a] uppercase tracking-wider">
            Reconhecimento de Voz SOLVI
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Animated Mic Wave */}
        <div className="relative flex items-center justify-center my-2">
          {isRecording && (
            <>
              <div className="absolute w-24 h-24 bg-[#ea580c]/20 rounded-full animate-ping"></div>
              <div className="absolute w-20 h-20 bg-[#ea580c]/30 rounded-full animate-pulse"></div>
            </>
          )}
          <div className="w-16 h-16 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-lg relative z-10">
            {isRecording ? <Mic className="w-8 h-8 animate-bounce" /> : <Check className="w-8 h-8" />}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#18181b]">
            {isRecording ? 'Ouvindo o seu relato...' : 'Relato gravado com sucesso!'}
          </h3>
          <p className="text-sm text-[#71717a] mt-1">
            {isRecording ? `Fale pausadamente (${seconds}s)` : 'A IA interpretou a sua fala:'}
          </p>
        </div>

        <div className="w-full bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] text-sm text-[#18181b] font-medium min-h-[72px] flex items-center justify-center italic text-center">
          {transcript || 'Detectando ondas sonoras...'}
        </div>

        <div className="flex gap-2.5 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-[#e4e4e7] text-xs sm:text-sm font-bold text-[#52525b] hover:bg-[#fafafa] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            disabled={!transcript}
            onClick={() => {
              onTranscriptComplete(transcript);
              onClose();
            }}
            className="flex-1 py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Usar relato
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Photo Upload / Camera Modal
interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (photoUrl: string, description?: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('Problema identificado por foto');

  const samplePhotos = [
    {
      title: 'Montagem de Móvel / Guarda-Roupa',
      description: 'Montagem de móvel, alinhamento de portas e gavetas de guarda-roupa',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Torneira gotejando / Vazamento',
      description: 'Vazamento em torneira e tubulação hidráulica',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Quadro elétrico / Disjuntor',
      description: 'Disjuntor desarmando e sobrecarga em fiação elétrica',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Ar condicionado vazando / Não gela',
      description: 'Ar condicionado pingando água pelo dreno e sem gelar',
      url: 'https://images.unsplash.com/photo-1614633833026-062002521c7d?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Fechadura travada / Chave emperrada',
      description: 'Fechadura emperrada e maçaneta solta na porta',
      url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Pintura descascando / Umidade',
      description: 'Paredes descascando com manchas de umidade para repintura',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setSelectedTitle('Foto do reparo carregada pelo cliente');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#ea580c]" />
            <h3 className="text-lg font-bold text-[#18181b]">Mostrar por Foto</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <p className="text-sm text-[#52525b] leading-relaxed">
          A IA analisa visualmente montagens de móveis, tubulações, fios elétricos e vazamentos para gerar o diagnóstico e indicar o profissional correto.
        </p>

        {preview ? (
          <div className="relative rounded-2xl overflow-hidden border border-[#e4e4e7] h-48 bg-black/5 flex items-center justify-center">
            <img loading="lazy" decoding="async" src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => {
                setPreview(null);
                setSelectedTitle('Problema identificado por foto');
              }}
              className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[#e4e4e7] hover:border-[#ea580c] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#fafafa] cursor-pointer transition-colors text-center">
            <Upload className="w-8 h-8 text-[#ea580c]" />
            <span className="text-sm font-bold text-[#18181b]">Tirar foto ou carregar arquivo</span>
            <span className="text-xs text-[#71717a]">PNG, JPG até 10MB</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-xs font-black text-[#71717a] uppercase tracking-wider">
            Ou escolha uma foto de exemplo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {samplePhotos.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPreview(s.url);
                  setSelectedTitle(s.description);
                }}
                className="rounded-xl overflow-hidden border border-[#e4e4e7] hover:border-[#ea580c] relative group text-left cursor-pointer"
              >
                <img loading="lazy" decoding="async" src={s.url} alt={s.title} className="w-full h-14 object-cover" />
                <span className="block text-[11px] font-bold text-[#18181b] p-1.5 truncate bg-white">
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 pt-2 border-t border-[#e4e4e7]">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-[#e4e4e7] text-xs sm:text-sm font-bold text-[#52525b] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            disabled={!preview}
            onClick={() => {
              if (preview) {
                onPhotoSelected(preview, selectedTitle);
                onClose();
              }
            }}
            className="flex-1 py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Diagnosticar foto
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Guided Wizard Modal ("NÃO SEI O QUE É")
interface GuidedWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (symptomResult: string) => void;
}

export const GuidedWizardModal: React.FC<GuidedWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [symptomType, setSymptomType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');

  if (!isOpen) return null;

  const handleFinish = () => {
    const combined = `Sintoma identificado: ${symptomType} localizado em ${location}, ocorrendo ${frequency}.`;
    onComplete(combined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ea580c]" />
            <h3 className="text-lg font-bold text-[#18181b]">Assistente Guiado de Sintomas</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1.5">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#ea580c]' : 'bg-zinc-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#ea580c]' : 'bg-zinc-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-[#ea580c]' : 'bg-zinc-200'}`} />
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto">
            <h4 className="text-sm sm:text-base font-bold text-[#18181b]">1. Qual é a sua necessidade principal?</h4>
            {[
              { id: 'montador', title: 'Montagem ou desmontagem de móveis (guarda-roupa, cama, armário)', icon: '🪑' },
              { id: 'agua', title: 'Água pingando, vazamento de cano ou pressão fraca', icon: '💧' },
              { id: 'eletricidade', title: 'Luz piscando, tomada em curto ou disjuntor caindo', icon: '⚡' },
              { id: 'desentupimento', title: 'Ralo, pia ou vaso sanitário entupido', icon: '🚽' },
              { id: 'ar', title: 'Ar condicionado vazando água ou não gelando', icon: '❄️' },
              { id: 'chaveiro', title: 'Porta trancada, chave quebrada ou troca de fechadura', icon: '🔑' },
              { id: 'pintura', title: 'Paredes descascando, mofo ou necessidade de pintura', icon: '🎨' },
              { id: 'geral', title: 'Instalar suporte de TV, varal, espelho ou pequenos furos', icon: '🔨' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSymptomType(opt.title);
                  setStep(2);
                }}
                className="p-3.5 rounded-2xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] text-left text-xs sm:text-sm font-semibold text-[#18181b] flex items-center gap-3 transition-colors cursor-pointer"
              >
                <span className="text-xl shrink-0">{opt.icon}</span>
                <span className="leading-snug">{opt.title}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm sm:text-base font-bold text-[#18181b]">2. Onde isso acontece?</h4>
            {['Quarto / Dormitório', 'Sala de Estar / Jantar', 'Cozinha / Bancada', 'Banheiro / Suíte', 'Lavanderia / Área de Serviço'].map(
              (loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setStep(3);
                  }}
                  className="p-3.5 rounded-2xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] text-left text-xs sm:text-sm font-semibold text-[#18181b] transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              )
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm sm:text-base font-bold text-[#18181b]">3. Com que urgência precisa do atendimento?</h4>
            {[
              'Preciso de atendimento para hoje (urgente)',
              'Atendimento programado para esta semana',
              'Quero apenas um orçamento detalhado com garantia'
            ].map((freq) => (
              <button
                key={freq}
                onClick={() => {
                  setFrequency(freq);
                  handleFinish();
                }}
                className="p-3.5 rounded-2xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] text-left text-xs sm:text-sm font-semibold text-[#18181b] transition-colors cursor-pointer"
              >
                {freq}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Booking Modal with Confetti Celebration
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
  clientName?: string;
  clientPhone?: string;
  clientAvatar?: string;
  clientAddress?: string;
  serviceTitle?: string;
  roomName?: string;
  onConfirmBooking: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  professional,
  clientName = 'Cliente Resolva Já',
  clientPhone = '(11) 98765-4321',
  clientAvatar,
  clientAddress = 'Endereço cadastrado no perfil',
  serviceTitle = 'Reparo e manutenção técnica',
  roomName = 'Residência',
  onConfirmBooking
}) => {
  const todayStr = 'Hoje';
  const tomorrowStr = 'Amanhã';

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 15:30');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !professional) return null;

  const handleConfirm = () => {
    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName,
      clientPhone,
      clientAvatar,
      professionalName: professional.name,
      professionalAvatar: professional.avatar,
      role: professional.role,
      date: selectedDate,
      time: selectedSlot,
      serviceTitle,
      room: roomName,
      totalCost: professional.totalCost,
      status: 'confirmado',
      address: clientAddress
    };

    setTimeout(() => {
      onConfirmBooking(newApt);
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp">
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#18181b]">Visita Confirmada!</h3>
            <p className="text-xs text-[#52525b] max-w-xs">
              {professional.name} foi notificado e comparecerá no horário agendado.
            </p>
            <div className="bg-[#fff7ed] p-3 rounded-xl border border-[#fed7aa] text-xs font-semibold text-[#ea580c] mt-2">
              {selectedDate} • {selectedSlot}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#18181b]">Confirmar Contratação</h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Professional Summary */}
            <div className="flex items-center gap-3.5 bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7]">
              <SafeAvatar
                src={professional.avatar}
                name={professional.name}
                size="md"
                className="w-14 h-14 rounded-2xl shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-base font-bold text-[#18181b]">{professional.name}</h4>
                <p className="text-xs sm:text-sm text-[#52525b]">{professional.role}</p>
                <p className="text-sm font-extrabold text-[#ea580c] mt-0.5">
                  Valor Estimado: R$ {professional.totalCost}
                </p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#18181b]">Escolha a data:</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[todayStr, tomorrowStr].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                      selectedDate === d
                        ? 'bg-[#ea580c] text-white border-[#ea580c]'
                        : 'bg-white text-[#52525b] border-[#e4e4e7] hover:bg-[#fff7ed]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#18181b]">Horário de preferência:</label>
              <div className="grid grid-cols-3 gap-2">
                {['10:00 - 11:30', '14:00 - 15:30', '16:00 - 17:30'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-1 text-center rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-[#ea580c] text-white border-[#ea580c]'
                        : 'bg-white text-[#52525b] border-[#e4e4e7] hover:bg-[#fff7ed]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Review */}
            <div className="bg-[#fff7ed] p-3.5 rounded-2xl border border-[#fed7aa] text-xs sm:text-sm text-[#9a3412] flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Endereço da visita:</span>
                <p className="mt-0.5">{clientAddress}</p>
              </div>
            </div>

            {/* Payment info */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#52525b] pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-4 h-4 text-[#ea580c] shrink-0" /> Pagamento seguro no app após serviço
              </span>
              <span className="font-extrabold text-base text-[#18181b]">
                R$ {professional.totalCost}
              </span>
            </div>

            {/* CTA */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-full border border-[#e4e4e7] text-xs sm:text-sm font-bold text-[#52525b] hover:bg-[#fafafa] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-md active:scale-98 transition-all cursor-pointer"
              >
                Confirmar Agendamento
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 5. Professional Profile Modal
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
  onHire: (prof: Professional) => void;
}

export const ProfessionalProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  professional,
  onHire
}) => {
  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#71717a] uppercase tracking-wider">
            Perfil Verificado Resolva Já
          </span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <SafeAvatar
            src={professional.avatar}
            name={professional.name}
            size="md"
            className="w-16 h-16 rounded-2xl border-2 border-[#ea580c] shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-[#18181b]">{professional.name}</h3>
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#52525b]">{professional.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1">
                <Shield className="w-4 h-4" /> Credenciado & Verificado
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] text-center">
          <div>
            <span className="text-sm sm:text-base font-extrabold text-[#ea580c]">{professional.completedJobs}+</span>
            <p className="text-xs text-[#71717a]">Serviços Concluídos</p>
          </div>
          <div>
            <span className="text-sm sm:text-base font-extrabold text-emerald-600">{professional.trustIndex}/100</span>
            <p className="text-xs text-[#71717a]">Índice de Confiança</p>
          </div>
          <div>
            <span className="text-sm sm:text-base font-extrabold text-[#18181b]">90 Dias</span>
            <p className="text-xs text-[#71717a]">Garantia Oficial</p>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-xs font-bold text-[#18181b] uppercase tracking-wider mb-2">
            Especialidades e Habilidades
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {professional.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-xs bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] font-bold px-3 py-1 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Platform Protections and Guarantees */}
        <div>
          <h4 className="text-xs font-bold text-[#18181b] uppercase tracking-wider mb-2">
            Proteção e Garantia Resolva Já
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-[#52525b]">
            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#18181b]">Pagamento em Custódia Segura</span>
                <p className="text-xs text-[#52525b] mt-0.5">O valor só é liberado para o prestador após a sua confirmação e aprovação final da conclusão do serviço.</p>
              </div>
            </div>
            <div className="bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#18181b]">Garantia Contratual de 90 Dias</span>
                <p className="text-xs text-[#52525b] mt-0.5">Qualquer ajuste necessário é feito sem custos adicionais pelo técnico credenciado.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onHire(professional);
          }}
          className="w-full py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm sm:text-base shadow-md transition-all mt-2 cursor-pointer"
        >
          Contratar {professional.name} (R$ {professional.totalCost})
        </button>
      </div>
    </div>
  );
};

// 6. Add Room Modal
interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (name: string, icon: string) => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onAddRoom
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Armchair');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddRoom(name.trim(), icon);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#18181b]">Novo Cômodo</h3>
          <button type="button" onClick={onClose} aria-label="Fechar modal de novo cômodo" className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-bold text-[#18181b] block mb-1.5">Nome do cômodo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Varanda Gourmet, Quarto de Hóspedes"
            className="w-full p-3 rounded-xl border border-[#e4e4e7] text-sm sm:text-base focus:border-[#ea580c] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-bold text-[#18181b] block mb-1.5">Ícone</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'Armchair', label: 'Estar' },
              { id: 'Bed', label: 'Quarto' },
              { id: 'UtensilsCrossed', label: 'Cozinha' },
              { id: 'Bath', label: 'Banho' }
            ].map((ic) => (
              <button
                type="button"
                key={ic.id}
                onClick={() => setIcon(ic.id)}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-center cursor-pointer transition-colors ${
                  icon === ic.id ? 'bg-[#ea580c] text-white border-[#ea580c]' : 'bg-[#fafafa] border-[#e4e4e7] hover:bg-[#fff7ed]'
                }`}
              >
                {ic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-[#e4e4e7] text-xs sm:text-sm font-bold text-[#52525b] hover:bg-[#fafafa] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
          >
            Salvar Cômodo
          </button>
        </div>
      </form>
    </div>
  );
};

// 7. Notifications Drawer / Modal
interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#18181b]">Notificações do Sistema</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-[#71717a] font-medium">{notifications.length} avisos</span>
          <button onClick={onMarkAllAsRead} className="text-[#ea580c] font-bold hover:underline cursor-pointer">
            Marcar todas como lidas
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.read ? 'bg-[#fafafa] border-[#e4e4e7]' : 'bg-white border-[#ea580c] shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-bold text-[#18181b]">{n.title}</h4>
                <span className="text-xs text-[#71717a] shrink-0">{n.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#52525b] mt-1.5 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
