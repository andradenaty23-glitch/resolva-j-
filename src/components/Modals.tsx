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
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-5 border border-[#d9bfd3] text-center animate-scaleUp">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-bold text-[#867083] uppercase tracking-wider">
            Reconhecimento de Voz SOLVI
          </span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Animated Mic Wave */}
        <div className="relative flex items-center justify-center my-2">
          {isRecording && (
            <>
              <div className="absolute w-24 h-24 bg-[#cb00d8]/20 rounded-full animate-ping"></div>
              <div className="absolute w-20 h-20 bg-[#cb00d8]/30 rounded-full animate-pulse"></div>
            </>
          )}
          <div className="w-16 h-16 rounded-full bg-[#cb00d8] text-white flex items-center justify-center shadow-lg relative z-10">
            {isRecording ? <Mic className="w-8 h-8 animate-bounce" /> : <Check className="w-8 h-8" />}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-[#241822]">
            {isRecording ? 'Ouvindo o seu relato...' : 'Relato gravado com sucesso!'}
          </h3>
          <p className="text-xs text-[#867083] mt-1">
            {isRecording ? `Fale pausadamente (${seconds}s)` : 'A IA interpretou a sua fala:'}
          </p>
        </div>

        <div className="w-full bg-[#fff7fa] p-3.5 rounded-2xl border border-[#f2dceb] text-xs text-[#241822] min-h-[64px] flex items-center justify-center italic">
          {transcript || 'Detectando ondas sonoras...'}
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#d9bfd3] text-xs font-bold text-[#544151]"
          >
            Cancelar
          </button>
          <button
            disabled={!transcript}
            onClick={() => {
              onTranscriptComplete(transcript);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold shadow-xs disabled:opacity-50"
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
  onPhotoSelected: (photoUrl: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const samplePhotos = [
    {
      title: 'Torneira gotejando',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Quadro elétrico / Disjuntor',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Ar condicionado vazando',
      url: 'https://images.unsplash.com/photo-1614633833026-062002521c7d?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] animate-scaleUp">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#a200ac]" />
            <h3 className="text-base font-bold text-[#241822]">Mostrar por Foto</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-xs text-[#544151]">
          A IA analisa visualmente fiações, vazamentos, tubulações e rachaduras para gerar o diagnóstico.
        </p>

        {preview ? (
          <div className="relative rounded-2xl overflow-hidden border border-[#d9bfd3] h-48 bg-black/5 flex items-center justify-center">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[#d9bfd3] hover:border-[#a200ac] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#fff7fa] cursor-pointer transition-colors text-center">
            <Upload className="w-8 h-8 text-[#a200ac]" />
            <span className="text-xs font-bold text-[#241822]">Tirar foto ou carregar arquivo</span>
            <span className="text-[11px] text-[#867083]">PNG, JPG até 10MB</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[11px] font-bold text-[#867083] uppercase tracking-wider">
            Ou escolha uma foto de exemplo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {samplePhotos.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setPreview(s.url)}
                className="rounded-xl overflow-hidden border border-[#d9bfd3] hover:border-[#a200ac] relative group text-left"
              >
                <img src={s.url} alt={s.title} className="w-full h-16 object-cover" />
                <span className="block text-[9px] font-semibold text-[#241822] p-1 truncate bg-white">
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-[#f2dceb]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#d9bfd3] text-xs font-bold text-[#544151]"
          >
            Cancelar
          </button>
          <button
            disabled={!preview}
            onClick={() => {
              if (preview) {
                onPhotoSelected(preview);
                onClose();
              }
            }}
            className="flex-1 py-2.5 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
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
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] animate-scaleUp">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#a200ac]" />
            <h3 className="text-base font-bold text-[#241822]">Assistente Guiado de Sintomas</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1.5">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#a200ac]' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#a200ac]' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-[#a200ac]' : 'bg-gray-200'}`} />
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#241822]">1. Qual é o principal sinal estranho?</h4>
            {[
              { id: 'agua', title: 'Água pingando, poça ou pressão fraca', icon: '💧' },
              { id: 'eletricidade', title: 'Luz piscando, faíscas ou disjuntor caindo', icon: '⚡' },
              { id: 'cheiro', title: 'Cheiro de gás, queimado ou esgoto', icon: '⚠️' },
              { id: 'temperatura', title: 'Aparelho não gela ou chuveiro não esquenta', icon: '❄️' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSymptomType(opt.title);
                  setStep(2);
                }}
                className="p-3 rounded-xl border border-[#d9bfd3] hover:border-[#a200ac] hover:bg-[#fee8f7] text-left text-xs font-semibold text-[#241822] flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.title}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#241822]">2. Onde isso acontece?</h4>
            {['Cozinha / Bancada', 'Banheiro / Chuveiro', 'Lavanderia / Tanque', 'Sala / Geral'].map(
              (loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setStep(3);
                  }}
                  className="p-3 rounded-xl border border-[#d9bfd3] hover:border-[#a200ac] hover:bg-[#fee8f7] text-left text-xs font-semibold text-[#241822] transition-colors"
                >
                  {loc}
                </button>
              )
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#241822]">3. Com que frequência ocorre?</h4>
            {[
              'Contínuo e urgente (não para)',
              'Apenas quando ligo o equipamento',
              'Começou de repente hoje',
              'Ocorre de forma intermitente há alguns dias'
            ].map((freq) => (
              <button
                key={freq}
                onClick={() => {
                  setFrequency(freq);
                  handleFinish();
                }}
                className="p-3 rounded-xl border border-[#d9bfd3] hover:border-[#a200ac] hover:bg-[#fee8f7] text-left text-xs font-semibold text-[#241822] transition-colors"
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
  onConfirmBooking: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  professional,
  onConfirmBooking
}) => {
  const [selectedDate, setSelectedDate] = useState('Hoje, 18 de Agosto');
  const [selectedSlot, setSelectedSlot] = useState('16:00 - 17:30');
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
      professionalName: professional.name,
      professionalAvatar: professional.avatar,
      role: professional.role,
      date: selectedDate,
      time: selectedSlot,
      serviceTitle: 'Reparo hidráulico e substituição de conexões',
      room: 'Cozinha',
      totalCost: professional.totalCost,
      status: 'confirmado',
      address: 'Rua das Palmeiras, 450 - Apto 82'
    };

    setTimeout(() => {
      onConfirmBooking(newApt);
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] animate-scaleUp">
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#241822]">Visita Confirmada!</h3>
            <p className="text-xs text-[#544151] max-w-xs">
              {professional.name} foi notificado e comparecerá no horário agendado.
            </p>
            <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb] text-xs font-semibold text-[#a200ac] mt-2">
              {selectedDate} • {selectedSlot}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#241822]">Confirmar Contratação</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Professional Summary */}
            <div className="flex items-center gap-3 bg-[#fff7fa] p-3.5 rounded-2xl border border-[#f2dceb]">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#241822]">{professional.name}</h4>
                <p className="text-xs text-[#544151]">{professional.role}</p>
                <p className="text-xs font-extrabold text-[#a200ac] mt-0.5">
                  Valor Estimado: R$ {professional.totalCost}
                </p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#241822]">Escolha a data:</label>
              <div className="grid grid-cols-2 gap-2">
                {['Hoje, 18 de Agosto', 'Amanhã, 19 de Agosto'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedDate === d
                        ? 'bg-[#a200ac] text-white border-[#a200ac]'
                        : 'bg-white text-[#544151] border-[#d9bfd3]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#241822]">Horário de preferência:</label>
              <div className="grid grid-cols-3 gap-2">
                {['10:00 - 11:30', '14:00 - 15:30', '16:00 - 17:30'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                      selectedSlot === slot
                        ? 'bg-[#a200ac] text-white border-[#a200ac]'
                        : 'bg-white text-[#544151] border-[#d9bfd3]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Review */}
            <div className="bg-[#dee8ff]/50 p-3 rounded-xl border border-[#d8e3fb] text-xs text-[#111c2d] flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Endereço da visita:</span>
                <p>Rua das Palmeiras, 450 - Apto 82, Pinheiros - SP</p>
              </div>
            </div>

            {/* Payment info */}
            <div className="flex items-center justify-between text-xs text-[#544151] pt-1">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#a200ac]" /> Pagamento seguro no app após serviço
              </span>
              <span className="font-extrabold text-sm text-[#241822]">
                R$ {professional.totalCost}
              </span>
            </div>

            {/* CTA */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-[#d9bfd3] text-xs font-bold text-[#544151]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold shadow-md active:scale-98 transition-all"
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
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#867083] uppercase tracking-wider">
            Perfil Verificado Solvi
          </span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={professional.avatar}
            alt={professional.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#a200ac]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-[#241822]">{professional.name}</h3>
              <CheckCircle className="w-4 h-4 text-[#006c49]" />
            </div>
            <p className="text-xs text-[#544151]">{professional.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> {professional.rating}
              </span>
              <span className="text-xs text-[#867083]">({professional.reviewsCount} avaliações)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 bg-[#fff7fa] p-3 rounded-2xl border border-[#f2dceb] text-center">
          <div>
            <span className="text-xs font-extrabold text-[#a200ac]">{professional.completedJobs}+</span>
            <p className="text-[10px] text-[#867083]">Serviços Feitos</p>
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#006c49]">{professional.trustIndex}/100</span>
            <p className="text-[10px] text-[#867083]">Índice Confiança</p>
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#241822]">100%</span>
            <p className="text-[10px] text-[#867083]">Garantia 90d</p>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-xs font-bold text-[#241822] uppercase tracking-wider mb-2">
            Especialidades
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {professional.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-[11px] bg-[#fee8f7] text-[#a200ac] font-semibold px-2.5 py-1 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Client Reviews */}
        <div>
          <h4 className="text-xs font-bold text-[#241822] uppercase tracking-wider mb-2">
            Últimas Avaliações
          </h4>
          <div className="space-y-2 text-xs text-[#544151]">
            <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
              <div className="flex justify-between font-semibold text-[#241822] mb-0.5">
                <span>Mariana F.</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="text-[11px]">"Chegou no horário, resolveu o vazamento sem sujeira e explicou tudo direitinho."</p>
            </div>
            <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
              <div className="flex justify-between font-semibold text-[#241822] mb-0.5">
                <span>Eduardo T.</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="text-[11px]">"Excelente atendimento e preço justo. Recomendo com certeza!"</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onHire(professional);
          }}
          className="w-full py-3 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white font-bold text-sm shadow-md transition-all mt-2"
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
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3]">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#241822]">Novo Cômodo</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-[#241822] block mb-1">Nome do cômodo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Varanda Gourmet, Escritório"
            className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-sm focus:border-[#a200ac] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#241822] block mb-1">Ícone</label>
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
                className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                  icon === ic.id ? 'bg-[#a200ac] text-white border-[#a200ac]' : 'bg-[#fff7fa] border-[#d9bfd3]'
                }`}
              >
                {ic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#d9bfd3] text-xs font-bold text-[#544151]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-full bg-[#a200ac] text-white text-xs font-bold shadow-xs"
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
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#241822]">Notificações do Sistema</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-[#867083]">{notifications.length} avisos</span>
          <button onClick={onMarkAllAsRead} className="text-[#a200ac] font-bold hover:underline">
            Marcar todas como lidas
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.read ? 'bg-[#fff7fa] border-[#f2dceb]' : 'bg-white border-[#cb00d8] shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs font-bold text-[#241822]">{n.title}</h4>
                <span className="text-[10px] text-[#867083]">{n.time}</span>
              </div>
              <p className="text-xs text-[#544151] mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
