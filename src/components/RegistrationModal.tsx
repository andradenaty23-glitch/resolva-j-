import React, { useState } from 'react';
import {
  X,
  User,
  Wrench,
  CheckCircle2,
  MapPin,
  Shield,
  Sparkles,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Phone,
  Camera,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientProfile, ProviderProfile, UserRole } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { SafeAvatar } from './SafeAvatar';

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
  const [modalMode, setModalMode] = useState<'cadastro' | 'login'>('cadastro');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Client form state
  const [clientPhoto, setClientPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80');
  const [clientName, setClientName] = useState('Natália Andrade');
  const [clientEmail, setClientEmail] = useState('andradenaty23@gmail.com');
  const [clientPhone, setClientPhone] = useState('(11) 98123-4567');
  const [clientCpf, setClientCpf] = useState('382.491.028-44');
  const [residenceType, setResidenceType] = useState<'apartamento' | 'casa' | 'comercial'>('apartamento');
  const [street, setStreet] = useState('Rua das Palmeiras');
  const [number, setNumber] = useState('450');
  const [complement, setComplement] = useState('Apto 82, Bloco B');
  const [neighborhood, setNeighborhood] = useState('Pinheiros');
  const [city, setCity] = useState('São Paulo');
  const [cep, setCep] = useState('05422-010');

  // Provider form state
  const [providerPhoto, setProviderPhoto] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80');
  const [providerName, setProviderName] = useState('Ricardo Silva');
  const [providerEmail, setProviderEmail] = useState('ricardo.silva.reparos@gmail.com');
  const [providerPhone, setProviderPhone] = useState('(11) 98765-4321');
  const [providerDocument, setProviderDocument] = useState('29.384.102/0001-92');
  const [category, setCategory] = useState('Encanamento / Hidráulica');
  const [experienceYears, setExperienceYears] = useState(12);
  const [laborBaseRate, setLaborBaseRate] = useState(100);
  const [operatingRadius, setOperatingRadius] = useState(15);
  const [pixKey, setPixKey] = useState('ricardo.silva.reparos@gmail.com');
  const [bio, setBio] = useState('Técnico hidráulico certificado com mais de 12 anos de experiência em edifícios residenciais e comerciais em São Paulo.');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('andradenaty23@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: ClientProfile = {
      id: `client-${Date.now()}`,
      name: clientName.trim() || 'Natália Andrade',
      email: clientEmail.trim() || 'andradenaty23@gmail.com',
      phone: clientPhone.trim() || '(11) 98123-4567',
      cpf: clientCpf.trim() || '382.491.028-44',
      residenceType,
      address: {
        street: street.trim() || 'Rua das Palmeiras',
        number: number.trim() || '450',
        complement: complement.trim() || 'Apto 82',
        neighborhood: neighborhood.trim() || 'Pinheiros',
        city: city.trim() || 'São Paulo',
        state: 'SP',
        cep: cep.trim() || '05422-010'
      },
      plan: 'Resolva Já Plus',
      walletBalance: 120.00,
      cashbackBalance: 28.50,
      avatar: clientPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      registeredAt: 'Agora'
    };

    setSuccessMessage('Conta de Cliente Criada com Sucesso!');
    setIsSuccess(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => {
      onRegisterClient(newClient);
      setIsSuccess(false);
      onClose();
    }, 1300);
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProvider: ProviderProfile = {
      id: `provider-${Date.now()}`,
      name: providerName.trim() || 'Ricardo Silva',
      email: providerEmail.trim() || 'ricardo.silva.reparos@gmail.com',
      phone: providerPhone.trim() || '(11) 98765-4321',
      document: providerDocument.trim() || '29.384.102/0001-92',
      category,
      specialties: [category, 'Vazamentos & Reparos', 'Troca de Registros', 'Instalação de Misturadores'],
      experienceYears: Number(experienceYears) || 10,
      laborBaseRate: Number(laborBaseRate) || 100,
      operatingRadiusKm: Number(operatingRadius) || 15,
      availability: 'Disponível Agora',
      verified: true,
      trustIndex: 95,
      rating: 4.9,
      reviewsCount: 142,
      completedJobsCount: 310,
      bio: bio || 'Profissional credenciado Resolva Já PRO.',
      avatar: providerPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      bankAccount: {
        bank: 'Banco Inter (077)',
        pixKey: pixKey || providerEmail
      },
      totalEarningsMonth: 4680,
      registeredAt: 'Agora'
    };

    setSuccessMessage('Credenciamento de Prestador Concluído!');
    setIsSuccess(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => {
      onRegisterProvider(newProvider);
      setIsSuccess(false);
      onClose();
    }, 1300);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'cliente') {
      const existingClient: ClientProfile = {
        id: 'client-1',
        name: clientName || 'Natália Andrade',
        email: loginEmail || 'andradenaty23@gmail.com',
        phone: clientPhone || '(11) 98123-4567',
        cpf: clientCpf || '382.491.028-44',
        residenceType,
        address: {
          street,
          number,
          complement,
          neighborhood,
          city,
          state: 'SP',
          cep
        },
        plan: 'Resolva Já Plus',
        walletBalance: 120.00,
        cashbackBalance: 28.50,
        avatar: clientPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        registeredAt: 'Janeiro de 2024'
      };
      setSuccessMessage(`Login realizado com sucesso! Bem-vinda, ${existingClient.name}`);
      setIsSuccess(true);
      setTimeout(() => {
        onRegisterClient(existingClient);
        setIsSuccess(false);
        onClose();
      }, 1000);
    } else {
      const existingProvider: ProviderProfile = {
        id: 'provider-1',
        name: providerName || 'Ricardo Silva',
        email: loginEmail || 'ricardo.silva.reparos@gmail.com',
        phone: providerPhone || '(11) 98765-4321',
        document: providerDocument || '29.384.102/0001-92',
        category,
        specialties: ['Vazamentos Hidráulicos', 'Tubulações PEX/PVC', 'Troca de Registros', 'Instalação de Misturadores'],
        experienceYears,
        laborBaseRate,
        operatingRadiusKm: operatingRadius,
        availability: 'Disponível Agora',
        verified: true,
        trustIndex: 94,
        rating: 4.9,
        reviewsCount: 142,
        completedJobsCount: 310,
        bio,
        avatar: providerPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        bankAccount: {
          bank: 'Banco Inter (077)',
          pixKey: pixKey || 'ricardo.silva.reparos@gmail.com'
        },
        totalEarningsMonth: 4680,
        registeredAt: 'Março de 2023'
      };
      setSuccessMessage(`Login realizado com sucesso! Bem-vindo, ${existingProvider.name}`);
      setIsSuccess(true);
      setTimeout(() => {
        onRegisterProvider(existingProvider);
        setIsSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[92vh] overflow-y-auto animate-scaleUp">
        {isSuccess ? (
          <div className="py-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#18181b]">
              {successMessage}
            </h3>
            <p className="text-xs text-[#71717a] max-w-xs">
              Autenticado no ecossistema RESOLVA JÁ. Sincronizando seu perfil e dados...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  RESOLVA JÁ Autenticação
                </span>
                <h2 className="text-xl font-black text-[#18181b] mt-1">
                  {modalMode === 'cadastro' ? 'Criar Nova Conta' : 'Acessar Minha Conta'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher: Cadastro vs Login */}
            <div className="flex bg-[#f4f4f5] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setModalMode('cadastro')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'cadastro'
                    ? 'bg-white text-[#18181b] shadow-xs'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Criar Conta</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'login'
                    ? 'bg-white text-[#18181b] shadow-xs'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar (Login)</span>
              </button>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#fafafa] p-1.5 rounded-2xl border border-[#e4e4e7]">
              <button
                type="button"
                id="tab-cad-cliente"
                onClick={() => setSelectedRole('cliente')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'cliente'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'text-[#71717a] hover:bg-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Perfil Cliente</span>
              </button>

              <button
                type="button"
                id="tab-cad-prestador"
                onClick={() => setSelectedRole('prestador')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'prestador'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'text-[#71717a] hover:bg-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Perfil Prestador</span>
              </button>
            </div>

            {/* ===================== LOGIN MODE ===================== */}
            {modalMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5 mt-1">
                {/* Photo in Login with change option */}
                <PhotoUploader
                  currentPhoto={selectedRole === 'cliente' ? clientPhoto : providerPhoto}
                  userName={selectedRole === 'cliente' ? clientName : providerName}
                  role={selectedRole}
                  onPhotoSelected={(url) => {
                    if (selectedRole === 'cliente') {
                      setClientPhoto(url);
                    } else {
                      setProviderPhoto(url);
                    }
                  }}
                  title="Foto do seu Perfil (Adicione ou Atualize)"
                  subtitle="Selecione do celular/PC para atualizar sua foto de perfil"
                />

                <div>
                  <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={selectedRole === 'cliente' ? clientEmail : providerEmail}
                      onChange={(e) => {
                        if (selectedRole === 'cliente') setClientEmail(e.target.value);
                        else setProviderEmail(e.target.value);
                        setLoginEmail(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#18181b] block mb-1">Senha de Acesso</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Sua senha segura"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#71717a]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#ea580c] focus:ring-[#ea580c]" />
                    <span>Lembrar neste dispositivo</span>
                  </label>
                  <button type="button" className="text-[#ea580c] font-bold hover:underline">
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white font-bold text-xs shadow-md transition-all mt-1 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar como {selectedRole === 'cliente' ? 'Cliente' : 'Prestador PRO'}</span>
                </button>
              </form>
            ) : (
              /* ===================== CADASTRO MODE ===================== */
              <>
                {selectedRole === 'cliente' ? (
                  <form onSubmit={handleClientSubmit} className="flex flex-col gap-3.5 mt-1">
                    {/* PHOTO UPLOADER FOR CLIENT */}
                    <PhotoUploader
                      currentPhoto={clientPhoto}
                      userName={clientName || 'Natália Andrade'}
                      role="cliente"
                      onPhotoSelected={setClientPhoto}
                      title="Adicionar Foto de Perfil"
                      subtitle="Upload do celular/PC ou escolha das opções"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">Nome Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Natália Andrade"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">CPF (válido)</label>
                        <input
                          type="text"
                          required
                          placeholder="382.491.028-44"
                          value={clientCpf}
                          onChange={(e) => setClientCpf(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail</label>
                        <input
                          type="email"
                          required
                          placeholder="andradenaty23@gmail.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">WhatsApp / Telefone</label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 98123-4567"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Tipo de Imóvel</label>
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
                            className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              residenceType === rt.id
                                ? 'bg-[#18181b] text-white border-[#18181b]'
                                : 'bg-white text-[#52525b] border-[#e4e4e7]'
                            }`}
                          >
                            {rt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 pt-1 border-t border-[#e4e4e7]">
                      <label className="text-xs font-bold text-[#18181b] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#ea580c]" /> Endereço Residencial Real
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <input
                            type="text"
                            required
                            placeholder="Rua das Palmeiras"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="450"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Apto 82, Bloco B"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Pinheiros"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                        <input
                          type="text"
                          required
                          placeholder="05422-010"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-cliente"
                      className="w-full py-3.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Concluir Cadastro com Foto</span>
                    </button>
                  </form>
                ) : (
                  /* FORM PRESTADOR */
                  <form onSubmit={handleProviderSubmit} className="flex flex-col gap-3.5 mt-1">
                    {/* PHOTO UPLOADER FOR PROVIDER */}
                    <PhotoUploader
                      currentPhoto={providerPhoto}
                      userName={providerName || 'Ricardo Silva'}
                      role="prestador"
                      onPhotoSelected={setProviderPhoto}
                      title="Foto Profissional para o Perfil"
                      subtitle="Foto nítida gera até 3x mais fechamentos de serviços"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">Nome Completo / MEI</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ricardo Silva"
                          value={providerName}
                          onChange={(e) => setProviderName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">CNPJ ou CPF Profissional</label>
                        <input
                          type="text"
                          required
                          placeholder="29.384.102/0001-92"
                          value={providerDocument}
                          onChange={(e) => setProviderDocument(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail Profissional</label>
                        <input
                          type="email"
                          required
                          placeholder="ricardo.silva.reparos@gmail.com"
                          value={providerEmail}
                          onChange={(e) => setProviderEmail(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">WhatsApp de Atendimento</label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 98765-4321"
                          value={providerPhone}
                          onChange={(e) => setProviderPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Category & Rates */}
                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Especialidade Principal</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
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
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Exp. (Anos)</label>
                        <input
                          type="number"
                          min="1"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Mão de Obra (R$)</label>
                        <input
                          type="number"
                          min="50"
                          value={laborBaseRate}
                          onChange={(e) => setLaborBaseRate(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Raio (Km)</label>
                        <input
                          type="number"
                          min="1"
                          value={operatingRadius}
                          onChange={(e) => setOperatingRadius(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Chave Pix para Recebimento Direto</label>
                      <input
                        type="text"
                        required
                        placeholder="ricardo.silva.reparos@gmail.com"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Apresentação / Bio Profissional</label>
                      <textarea
                        rows={2}
                        placeholder="Técnico hidráulico certificado com mais de 12 anos de experiência..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-prestador"
                      className="w-full py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Concluir Credenciamento PRO com Foto</span>
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
