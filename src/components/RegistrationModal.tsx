import React, { useState } from 'react';
import {
  X,
  User,
  Wrench,
  CheckCircle2,
  MapPin,
  Shield,
  CreditCard,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientProfile, ProviderProfile, UserRole } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onRegisterClient: (client: ClientProfile) => void;
  onRegisterProvider: (provider: ProviderProfile) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'cliente',
  onRegisterClient,
  onRegisterProvider
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Client form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [residenceType, setResidenceType] = useState<'apartamento' | 'casa' | 'comercial'>('apartamento');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [cep, setCep] = useState('');

  // Provider form state
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [providerDocument, setProviderDocument] = useState('');
  const [category, setCategory] = useState('Encanamento / Hidráulica');
  const [experienceYears, setExperienceYears] = useState(5);
  const [laborBaseRate, setLaborBaseRate] = useState(100);
  const [operatingRadius, setOperatingRadius] = useState(15);
  const [pixKey, setPixKey] = useState('');
  const [bio, setBio] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: ClientProfile = {
      id: `client-${Date.now()}`,
      name: clientName || 'Novo Cliente',
      email: clientEmail || 'cliente@exemplo.com',
      phone: clientPhone || '(11) 99999-9999',
      cpf: clientCpf || '000.000.000-00',
      residenceType,
      address: {
        street: street || 'Rua das Flores',
        number: number || '100',
        complement,
        neighborhood: neighborhood || 'Centro',
        city: city || 'São Paulo',
        state: 'SP',
        cep: cep || '01001-000'
      },
      plan: 'Solvi Free',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      registeredAt: 'Agora'
    };

    setIsSuccess(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => {
      onRegisterClient(newClient);
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProvider: ProviderProfile = {
      id: `provider-${Date.now()}`,
      name: providerName || 'Novo Profissional',
      email: providerEmail || 'prestador@exemplo.com',
      phone: providerPhone || '(11) 98888-8888',
      document: providerDocument || '00.000.000/0001-00',
      category,
      specialties: [category, 'Manutenção Residencial', 'Atendimento de Emergência'],
      experienceYears: Number(experienceYears) || 3,
      laborBaseRate: Number(laborBaseRate) || 100,
      operatingRadiusKm: Number(operatingRadius) || 10,
      availability: 'Disponível Agora',
      verified: true,
      trustIndex: 90,
      rating: 5.0,
      reviewsCount: 0,
      completedJobsCount: 0,
      bio: bio || 'Profissional parceiro credenciado Resolva Já.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      bankAccount: {
        bank: 'Banco Digital',
        pixKey: pixKey || providerEmail
      },
      totalEarningsMonth: 0,
      registeredAt: 'Agora'
    };

    setIsSuccess(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => {
      onRegisterProvider(newProvider);
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#d9bfd3] max-h-[90vh] overflow-y-auto animate-scaleUp">
        {isSuccess ? (
          <div className="py-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#241822]">
              Cadastro Concluído com Sucesso!
            </h3>
            <p className="text-xs text-[#544151] max-w-xs">
              Bem-vindo ao ecossistema RESOLVA JÁ. Carregando o seu painel personalizado...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-[#a200ac] bg-[#fee8f7] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  RESOLVA JÁ ID & Credenciamento
                </span>
                <h2 className="text-xl font-bold text-[#241822] mt-1">
                  Criar Novo Cadastro
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#fff7fa] p-1.5 rounded-2xl border border-[#f2dceb]">
              <button
                type="button"
                id="tab-cad-cliente"
                onClick={() => setSelectedRole('cliente')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'cliente'
                    ? 'bg-[#a200ac] text-white shadow-sm'
                    : 'text-[#544151] hover:bg-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sou Cliente</span>
              </button>

              <button
                type="button"
                id="tab-cad-prestador"
                onClick={() => setSelectedRole('prestador')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'prestador'
                    ? 'bg-[#a200ac] text-white shadow-sm'
                    : 'text-[#544151] hover:bg-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Sou Prestador</span>
              </button>
            </div>

            {/* FORM CLIENTE */}
            {selectedRole === 'cliente' ? (
              <form onSubmit={handleClientSubmit} className="flex flex-col gap-3.5 mt-1">
                <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb] text-xs text-[#544151] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#a200ac] shrink-0" />
                  <span>Cadastre sua casa para receber diagnósticos com IA e chamar profissionais verificados.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Natália Andrade"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">CPF</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={clientCpf}
                      onChange={(e) => setClientCpf(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">WhatsApp / Telefone</label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241822] block mb-1">Tipo de Imóvel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'apartamento', label: 'Apartamento' },
                      { id: 'casa', label: 'Casa' },
                      { id: 'comercial', label: 'Comercial' }
                    ].map((rt) => (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => setResidenceType(rt.id as any)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                          residenceType === rt.id
                            ? 'bg-[#cb00d8] text-white border-[#cb00d8]'
                            : 'bg-white text-[#544151] border-[#d9bfd3]'
                        }`}
                      >
                        {rt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 pt-1 border-t border-[#f2dceb]">
                  <label className="text-xs font-bold text-[#241822] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#a200ac]" /> Endereço Residencial
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Rua / Avenida"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Número"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Compl. (Apto, Bloco)"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-cliente"
                  className="w-full py-3.5 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer"
                >
                  Concluir Cadastro de Cliente
                </button>
              </form>
            ) : (
              /* FORM PRESTADOR */
              <form onSubmit={handleProviderSubmit} className="flex flex-col gap-3.5 mt-1">
                <div className="bg-[#dee8ff]/60 p-3 rounded-xl border border-[#d8e3fb] text-xs text-[#111c2d] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#004ac6] shrink-0" />
                  <span>Cadastre-se para receber chamados na sua região, enviar orçamentos e receber com taxa zero.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">Nome Completo / Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ricardo Silva Reparos"
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">CPF ou CNPJ</label>
                    <input
                      type="text"
                      required
                      placeholder="00.000.000/0001-00"
                      value={providerDocument}
                      onChange={(e) => setProviderDocument(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">E-mail Profissional</label>
                    <input
                      type="email"
                      required
                      placeholder="profissional@exemplo.com"
                      value={providerEmail}
                      onChange={(e) => setProviderEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241822] block mb-1">WhatsApp de Atendimento</label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={providerPhone}
                      onChange={(e) => setProviderPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Category & Rates */}
                <div>
                  <label className="text-xs font-bold text-[#241822] block mb-1">Especialidade Principal</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden bg-white"
                  >
                    <option value="Encanamento / Hidráulica">Encanamento / Hidráulica</option>
                    <option value="Elétrica Residencial">Elétrica Residencial</option>
                    <option value="Climatização / Ar Condicionado">Climatização / Ar Condicionado</option>
                    <option value="Reparos Gerais / Marido de Aluguel">Reparos Gerais / Marido de Aluguel</option>
                    <option value="Pintura e Acabamento">Pintura e Acabamento</option>
                    <option value="Chaveiro e Fechaduras">Chaveiro e Fechaduras</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#241822] block mb-1">Exp. (Anos)</label>
                    <input
                      type="number"
                      min="1"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#241822] block mb-1">Mão de Obra (R$)</label>
                    <input
                      type="number"
                      min="50"
                      value={laborBaseRate}
                      onChange={(e) => setLaborBaseRate(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#241822] block mb-1">Raio (Km)</label>
                    <input
                      type="number"
                      min="1"
                      value={operatingRadius}
                      onChange={(e) => setOperatingRadius(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241822] block mb-1">Chave Pix para Recebimento</label>
                  <input
                    type="text"
                    required
                    placeholder="CPF, CNPJ, Telefone ou E-mail"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241822] block mb-1">Apresentação / Bio</label>
                  <textarea
                    rows={2}
                    placeholder="Descreva suas qualificações, cursos e principais serviços prestados..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d9bfd3] text-xs focus:border-[#a200ac] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-prestador"
                  className="w-full py-3.5 rounded-full bg-[#a200ac] hover:bg-[#8e0097] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer"
                >
                  Concluir Cadastro de Prestador
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
