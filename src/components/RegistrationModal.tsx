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
  ArrowRight,
  Briefcase,
  DollarSign,
  Compass,
  CreditCard,
  Building,
  Home,
  Store,
  Check,
  Search,
  Loader2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserRole, ClientProfile, ProviderProfile } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { 
  registerWithEmailPassword, 
  loginWithEmailPassword, 
  sendPasswordResetLink,
  formatFirebaseAuthError,
  FormattedAuthError
} from '../services/firebaseAuth';
import { validateCPF, validateCNPJ, validatePhone, sanitizeInput } from '../utils/security';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onRegisterClient: (client: ClientProfile) => void;
  onRegisterProvider: (provider: ProviderProfile) => void;
  onOpenGoogleAuth?: (role: UserRole) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'cliente',
  onRegisterClient,
  onRegisterProvider,
  onOpenGoogleAuth
}) => {
  const [modalMode, setModalMode] = useState<'cadastro' | 'login'>('cadastro');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Client form state
  const [clientPhoto, setClientPhoto] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [residenceType, setResidenceType] = useState<'apartamento' | 'casa' | 'comercial'>('apartamento');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [cep, setCep] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Provider form state
  const [providerPhoto, setProviderPhoto] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [providerDocument, setProviderDocument] = useState('');
  const [providerPassword, setProviderPassword] = useState('');
  const [category, setCategory] = useState('Hidráulica & Encanamento');
  const [experienceYears, setExperienceYears] = useState(5);
  const [laborBaseRate, setLaborBaseRate] = useState(120);
  const [operatingRadius, setOperatingRadius] = useState(20);
  const [pixKey, setPixKey] = useState('');
  const [bio, setBio] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [authError, setAuthError] = useState<FormattedAuthError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Formatting helpers
  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatCpfCnpj = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 14);
    if (numbers.length <= 11) {
      // CPF
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    } else {
      // CNPJ
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
    }
  };

  const handleCepLookup = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro) setStreet(data.logradouro);
          if (data.bairro) setNeighborhood(data.bairro);
          if (data.localidade) setCity(data.localidade);
          if (data.uf) setState(data.uf);
        }
      } catch (e) {
        console.warn('ViaCEP lookup failed:', e);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCep(val);
    if (val.replace(/\D/g, '').length === 8) {
      handleCepLookup(val);
    }
  };

  // Live Validation states
  const clientCpfValidation = clientCpf.trim() ? validateCPF(clientCpf) : null;
  const clientPhoneValidation = clientPhone.trim() ? validatePhone(clientPhone) : null;
  
  const cleanProvDoc = providerDocument.replace(/\D/g, '');
  const providerDocValidation = cleanProvDoc.length > 0 
    ? (cleanProvDoc.length <= 11 ? validateCPF(providerDocument) : validateCNPJ(providerDocument))
    : null;
  const providerPhoneValidation = providerPhone.trim() ? validatePhone(providerPhone) : null;

  if (!isOpen) return null;

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setSuccessMessage('');
    setAuthError(null);
    setResetFeedback(null);

    // Security Validations
    if (clientCpf.trim()) {
      const checkCpf = validateCPF(clientCpf);
      if (!checkCpf.valid) {
        setAuthError({
          title: 'CPF Inválido',
          message: `${checkCpf.message}. Para sua segurança, informe um CPF autêntico.`,
          code: 'auth/invalid-document',
          isEmailInUse: false,
          isWrongPassword: false
        });
        return;
      }
    }

    if (clientPhone.trim()) {
      const checkPhone = validatePhone(clientPhone);
      if (!checkPhone.valid) {
        setAuthError({
          title: 'Telefone Inválido',
          message: checkPhone.message,
          code: 'auth/invalid-phone',
          isEmailInUse: false,
          isWrongPassword: false
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await registerWithEmailPassword(
        clientEmail.trim(),
        clientPassword,
        sanitizeInput(clientName.trim(), 100),
        'cliente',
        {
          telefone: clientPhone.trim(),
          cidade: sanitizeInput(city.trim(), 80),
          bairro: sanitizeInput(neighborhood.trim(), 80)
        }
      );
      
      const newClient: ClientProfile = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: clientPhone.trim() || '(11) 98888-7777',
        cpf: clientCpf.trim(),
        residenceType,
        address: {
          street: sanitizeInput(street.trim(), 150),
          number: sanitizeInput(number.trim(), 20),
          complement: sanitizeInput(complement.trim(), 50),
          neighborhood: sanitizeInput(neighborhood.trim(), 100),
          city: sanitizeInput(city.trim(), 80),
          state: sanitizeInput(state.trim(), 10),
          cep: sanitizeInput(cep.trim(), 15)
        },
        plan: 'Resolva Já Free',
        walletBalance: 0.00,
        cashbackBalance: 0.00,
        avatar: result.user.picture,
        registeredAt: 'Agora'
      };

      setSuccessMessage('Conta de Cliente criada com sucesso!');
      setIsSuccess(true);
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      setTimeout(() => {
        onRegisterClient(newClient);
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Registration error:', err);
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setSuccessMessage('');
    setAuthError(null);
    setResetFeedback(null);

    // Security Document Checks
    const cleanDoc = providerDocument.replace(/\D/g, '');
    if (cleanDoc.length === 11) {
      const cpfCheck = validateCPF(providerDocument);
      if (!cpfCheck.valid) {
        setAuthError({
          title: 'Documento CPF Inválido',
          message: `${cpfCheck.message}. Profissionais devem fornecer CPF ou CNPJ com dígitos verificadores válidos.`,
          code: 'auth/invalid-document',
          isEmailInUse: false,
          isWrongPassword: false
        });
        return;
      }
    } else if (cleanDoc.length === 14) {
      const cnpjCheck = validateCNPJ(providerDocument);
      if (!cnpjCheck.valid) {
        setAuthError({
          title: 'Documento CNPJ Inválido',
          message: `${cnpjCheck.message}. Por favor, revise o número do CNPJ.`,
          code: 'auth/invalid-document',
          isEmailInUse: false,
          isWrongPassword: false
        });
        return;
      }
    } else {
      setAuthError({
        title: 'Documento Incompleto',
        message: 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido para o credenciamento de segurança.',
        code: 'auth/invalid-document',
        isEmailInUse: false,
        isWrongPassword: false
      });
      return;
    }

    if (providerPhone.trim()) {
      const checkPhone = validatePhone(providerPhone);
      if (!checkPhone.valid) {
        setAuthError({
          title: 'Telefone Inválido',
          message: checkPhone.message,
          code: 'auth/invalid-phone',
          isEmailInUse: false,
          isWrongPassword: false
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await registerWithEmailPassword(
        providerEmail.trim(),
        providerPassword,
        sanitizeInput(providerName.trim(), 100),
        'profissional',
        {
          telefone: providerPhone.trim()
        }
      );

      const newProvider: ProviderProfile = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: providerPhone.trim() || '(11) 99999-8888',
        document: providerDocument.trim(),
        category,
        specialties: [category, 'Reparos Residenciais', 'Instalação e Manutenção Especializada'],
        experienceYears: Number(experienceYears) || 5,
        laborBaseRate: Number(laborBaseRate) || 120,
        operatingRadiusKm: Number(operatingRadius) || 20,
        availability: 'Disponível Agora',
        verified: true,
        trustIndex: 98,
        rating: 5.0,
        reviewsCount: 1,
        completedJobsCount: 1,
        bio: sanitizeInput(bio.trim() || `Técnico profissional credenciado em ${category} no ecossistema Resolva Já.`, 500),
        avatar: result.user.picture,
        bankAccount: {
          bank: 'Banco Principal',
          pixKey: sanitizeInput(pixKey.trim() || providerEmail.trim(), 100)
        },
        totalEarningsMonth: 0,
        registeredAt: 'Agora'
      };

      setSuccessMessage('Credenciamento PRO com Verificação de Segurança concluído!');
      setIsSuccess(true);
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      setTimeout(() => {
        onRegisterProvider(newProvider);
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Provider Registration error:', err);
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setSuccessMessage('');
    setAuthError(null);
    setResetFeedback(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithEmailPassword(loginEmail.trim(), loginPassword);

      if (selectedRole === 'cliente') {
        const existingClient: ClientProfile = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.usuarioDoc.telefone || '(11) 98765-4321',
          cpf: '',
          residenceType: 'apartamento',
          address: {
            street: 'Av. Paulista',
            number: '1000',
            complement: '',
            neighborhood: result.usuarioDoc.bairro || 'Centro',
            city: result.usuarioDoc.cidade || 'São Paulo',
            state: 'SP',
            cep: '01310-100'
          },
          plan: 'Resolva Já Free',
          walletBalance: 0.00,
          cashbackBalance: 0.00,
          avatar: result.user.picture,
          registeredAt: 'Conta ativa'
        };
        setSuccessMessage(`Login realizado com sucesso! Bem-vindo(a), ${existingClient.name}`);
        setIsSuccess(true);
        setTimeout(() => {
          onRegisterClient(existingClient);
          setIsSuccess(false);
          onClose();
        }, 900);
      } else {
        const existingProvider: ProviderProfile = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.usuarioDoc.telefone || '(11) 98765-4321',
          document: '29.384.102/0001-92',
          category: 'Hidráulica & Encanamento',
          specialties: ['Vazamentos Hidráulicos', 'Tubulações PEX/PVC', 'Troca de Registros', 'Instalação de Misturadores'],
          experienceYears: 5,
          laborBaseRate: 120,
          operatingRadiusKm: 20,
          availability: 'Disponível Agora',
          verified: true,
          trustIndex: 94,
          rating: 4.9,
          reviewsCount: 142,
          completedJobsCount: 310,
          bio: 'Profissional da rede Resolva Já.',
          avatar: result.user.picture,
          bankAccount: {
            bank: 'Banco Inter (077)',
            pixKey: result.user.email
          },
          totalEarningsMonth: 4680,
          registeredAt: 'Ativo'
        };
        setSuccessMessage(`Login realizado com sucesso! Bem-vindo(a), ${existingProvider.name}`);
        setIsSuccess(true);
        setTimeout(() => {
          onRegisterProvider(existingProvider);
          setIsSuccess(false);
          onClose();
        }, 900);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[92vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#18181b]">
              {successMessage}
            </h3>
            <p className="text-xs text-[#71717a] max-w-xs">
              Perfil configurado no ecossistema RESOLVA JÁ. Sincronizando dados...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {modalMode === 'cadastro' ? 'Novo Cadastro' : 'Acesso Seguro'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[#18181b] mt-1">
                  {modalMode === 'cadastro'
                    ? selectedRole === 'cliente'
                      ? 'Cadastro de Cliente Residencial'
                      : 'Credenciamento de Prestador PRO'
                    : selectedRole === 'cliente'
                    ? 'Login Cliente Residencial'
                    : 'Login Painel Prestador PRO'}
                </h2>
                <p className="text-xs text-[#71717a] mt-0.5">
                  {modalMode === 'cadastro'
                    ? 'Crie seu perfil em segundos e acesse todas as funcionalidades do aplicativo.'
                    : 'Digite suas credenciais ou utilize o acesso rápido com a Conta Google.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher: Cadastro vs Login */}
            <div className="flex bg-[#f4f4f5] p-1 rounded-2xl border border-[#e4e4e7]">
              <button
                type="button"
                onClick={() => {
                  setModalMode('cadastro');
                  setAuthError(null);
                  setResetFeedback(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'cadastro'
                    ? 'bg-white text-[#18181b] shadow-xs'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Criar Nova Conta</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode('login');
                  setAuthError(null);
                  setResetFeedback(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'login'
                    ? 'bg-white text-[#18181b] shadow-xs'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Já Tenho Conta (Login)</span>
              </button>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#fafafa] p-1.5 rounded-2xl border border-[#e4e4e7]">
              <button
                type="button"
                id="tab-cad-cliente"
                onClick={() => {
                  setSelectedRole('cliente');
                  setAuthError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'cliente'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'text-[#71717a] hover:bg-white hover:text-[#18181b]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Cliente Residencial</span>
              </button>

              <button
                type="button"
                id="tab-cad-prestador"
                onClick={() => {
                  setSelectedRole('prestador');
                  setAuthError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'prestador'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'text-[#71717a] hover:bg-white hover:text-[#ea580c]'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Prestador PRO</span>
              </button>
            </div>

            {/* In-Modal Alert Card for Auth Errors */}
            {authError && (
              <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-col gap-2.5 animate-fadeIn shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">{authError.title}</h4>
                      <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{authError.message}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthError(null)}
                    className="text-amber-500 hover:text-amber-800 p-1 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {authError.isEmailInUse && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/80 mt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        const typedEmail = (selectedRole === 'cliente' ? clientEmail.trim() : providerEmail.trim()) || loginEmail.trim();
                        if (typedEmail) setLoginEmail(typedEmail);
                        setModalMode('login');
                        setAuthError(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#18181b] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fazer Login com este E-mail</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSendingReset}
                      onClick={async () => {
                        const typedEmail = (selectedRole === 'cliente' ? clientEmail.trim() : providerEmail.trim()) || loginEmail.trim();
                        if (!typedEmail) return;
                        setIsSendingReset(true);
                        try {
                          await sendPasswordResetLink(typedEmail);
                          setResetFeedback({
                            type: 'success',
                            message: `Link de redefinição de senha enviado para ${typedEmail}. Verifique sua caixa de entrada e spam!`
                          });
                          setAuthError(null);
                        } catch (e: any) {
                          const errFmt = formatFirebaseAuthError(e);
                          setAuthError(errFmt);
                        } finally {
                          setIsSendingReset(false);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>{isSendingReset ? 'Enviando link...' : 'Esqueci Minha Senha'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* In-Modal Feedback Card for Reset or Success */}
            {resetFeedback && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start justify-between gap-2 animate-fadeIn shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">E-mail de Recuperação Enviado</h4>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{resetFeedback.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetFeedback(null)}
                  className="text-emerald-500 hover:text-emerald-800 p-1 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Google Quick 1-Click Auth Button */}
            {onOpenGoogleAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGoogleAuth(selectedRole);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#fff7ed] text-[#18181b] border-2 border-[#e4e4e7] hover:border-[#ea580c] font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{modalMode === 'cadastro' ? 'Preencher cadastro com Conta Google' : 'Entrar rápido com Google'}</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-[#a1a1aa] text-[11px]">
              <div className="flex-1 h-px bg-[#e4e4e7]" />
              <span>ou preencha os dados do formulário</span>
              <div className="flex-1 h-px bg-[#e4e4e7]" />
            </div>

            {/* ===================== LOGIN MODE ===================== */}
            {modalMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5 mt-1">
                {/* Photo in Login with change option */}
                <PhotoUploader
                  currentPhoto={selectedRole === 'cliente' ? clientPhoto : providerPhoto}
                  userName={selectedRole === 'cliente' ? (clientName || 'Cliente') : (providerName || 'Prestador')}
                  role={selectedRole}
                  onPhotoSelected={(url) => {
                    if (selectedRole === 'cliente') {
                      setClientPhoto(url);
                    } else {
                      setProviderPhoto(url);
                    }
                  }}
                  title="Foto de Perfil (Opcional)"
                  subtitle="Toque para carregar ou atualizar sua imagem de avatar"
                />

                <div>
                  <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={loginEmail || (selectedRole === 'cliente' ? clientEmail : providerEmail)}
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
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#71717a]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#ea580c] focus:ring-[#ea580c]" />
                    <span>Lembrar neste dispositivo</span>
                  </label>
                  <button
                    type="button"
                    disabled={isSendingReset}
                    onClick={async () => {
                      const emailTarget = loginEmail.trim() || (selectedRole === 'cliente' ? clientEmail.trim() : providerEmail.trim());
                      if (!emailTarget) {
                        setAuthError({
                          title: 'Informe seu E-mail',
                          message: 'Por favor, digite seu e-mail no campo acima para receber as instruções de recuperação de senha.',
                          code: 'auth/missing-email',
                          isEmailInUse: false,
                          isWrongPassword: false
                        });
                        return;
                      }
                      setIsSendingReset(true);
                      setAuthError(null);
                      try {
                        await sendPasswordResetLink(emailTarget);
                        setResetFeedback({
                          type: 'success',
                          message: `Enviamos as instruções para redefinir a senha do e-mail ${emailTarget}. Verifique sua caixa de entrada.`
                        });
                      } catch (err: any) {
                        const formatted = formatFirebaseAuthError(err);
                        setAuthError(formatted);
                      } finally {
                        setIsSendingReset(false);
                      }
                    }}
                    className="text-[#ea580c] font-bold hover:underline cursor-pointer"
                  >
                    {isSendingReset ? 'Enviando...' : 'Esqueceu a senha?'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs shadow-md transition-all mt-1 cursor-pointer flex items-center justify-center gap-2 ${
                    selectedRole === 'cliente'
                      ? 'bg-[#18181b] hover:bg-[#27272a]'
                      : 'bg-[#ea580c] hover:bg-[#c2410c]'
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Entrar como {selectedRole === 'cliente' ? 'Cliente Residencial' : 'Prestador PRO'}</span>
                    </>
                  )}
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
                      userName={clientName || 'Cliente'}
                      role="cliente"
                      onPhotoSelected={setClientPhoto}
                      title="Foto de Perfil"
                      subtitle="Envie uma foto do dispositivo ou escolha um avatar"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">Nome Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Carlos Eduardo Mendes"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#18181b]">CPF (Opcional)</label>
                          {clientCpfValidation && (
                            <span className={`text-[10px] font-bold ${clientCpfValidation.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {clientCpfValidation.valid ? '✓ Válido' : 'Inválido'}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={clientCpf}
                          onChange={(e) => setClientCpf(formatCpfCnpj(e.target.value))}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                            clientCpfValidation && !clientCpfValidation.valid
                              ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                              : clientCpfValidation?.valid
                              ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/20'
                              : 'border-[#e4e4e7] focus:border-[#ea580c]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail</label>
                        <input
                          type="email"
                          required
                          placeholder="seu.email@exemplo.com"
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
                          placeholder="(11) 90000-0000"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(formatPhone(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Crie uma Senha de Acesso</label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Tipo de Imóvel Residencial</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'apartamento', label: 'Apartamento', icon: Building },
                          { id: 'casa', label: 'Casa', icon: Home },
                          { id: 'comercial', label: 'Comercial', icon: Store }
                        ].map((rt) => {
                          const Icon = rt.icon;
                          return (
                            <button
                              key={rt.id}
                              type="button"
                              onClick={() => setResidenceType(rt.id as any)}
                              className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                                residenceType === rt.id
                                  ? 'bg-[#18181b] text-white border-[#18181b]'
                                  : 'bg-white text-[#52525b] border-[#e4e4e7] hover:bg-zinc-50'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{rt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Address with auto-CEP */}
                    <div className="space-y-2 pt-2 border-t border-[#e4e4e7]">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#18181b] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#ea580c]" /> Endereço Residencial (Opcional)
                        </label>
                        {isLoadingCep && (
                          <span className="text-[10px] text-[#ea580c] flex items-center gap-1 font-bold">
                            <Loader2 className="w-3 h-3 animate-spin" /> Buscando CEP...
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="CEP (00000-000)"
                            value={cep}
                            onChange={handleCepChange}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Rua / Avenida"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Número"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Apto / Bloco"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Bairro"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-cliente"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Cadastrando Cliente...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Concluir Cadastro de Cliente</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* ===================== FORM PRESTADOR PRO ===================== */
                  <form onSubmit={handleProviderSubmit} className="flex flex-col gap-3.5 mt-1">
                    {/* PHOTO UPLOADER FOR PROVIDER */}
                    <PhotoUploader
                      currentPhoto={providerPhoto}
                      userName={providerName || 'Prestador PRO'}
                      role="prestador"
                      onPhotoSelected={setProviderPhoto}
                      title="Foto Profissional"
                      subtitle="Foto nítida e profissional aumenta em até 3x o fechamento de propostas"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">Nome Profissional / Empresa</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ricardo Mendes Reparos"
                          value={providerName}
                          onChange={(e) => setProviderName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#18181b]">CNPJ ou CPF Profissional</label>
                          {providerDocValidation && (
                            <span className={`text-[10px] font-bold ${providerDocValidation.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {providerDocValidation.valid ? `✓ ${cleanProvDoc.length <= 11 ? 'CPF' : 'CNPJ'} Autêntico` : 'Inválido'}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="00.000.000/0001-00 ou CPF"
                          value={providerDocument}
                          onChange={(e) => setProviderDocument(formatCpfCnpj(e.target.value))}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                            providerDocValidation && !providerDocValidation.valid
                              ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                              : providerDocValidation?.valid
                              ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/20'
                              : 'border-[#e4e4e7] focus:border-[#ea580c]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#18181b] block mb-1">E-mail de Trabalho</label>
                        <input
                          type="email"
                          required
                          placeholder="seu.email@profissional.com"
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
                          placeholder="(11) 90000-0000"
                          value={providerPhone}
                          onChange={(e) => setProviderPhone(formatPhone(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Crie uma Senha de Acesso PRO</label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={providerPassword}
                        onChange={(e) => setProviderPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Especialidade Principal</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white font-medium"
                      >
                        <option value="Hidráulica & Encanamento">🔧 Hidráulica & Encanamento</option>
                        <option value="Elétrica Residencial & Comercial">⚡ Elétrica Residencial & Comercial</option>
                        <option value="Ar Condicionado & Climatização">❄️ Ar Condicionado & Climatização</option>
                        <option value="Montagem & Reparo de Móveis">🪑 Montagem & Reparo de Móveis</option>
                        <option value="Desentupimento Especializado">🚰 Desentupimento Especializado</option>
                        <option value="Pintura & Acabamento Fino">🎨 Pintura & Acabamento Fino</option>
                        <option value="Chaveiro & Fechaduras Digitais">🔑 Chaveiro & Fechaduras Digitais</option>
                        <option value="Alvenaria & Pequenas Reformas">🧱 Alvenaria & Pequenas Reformas</option>
                        <option value="Serralheria & Portões Automáticos">🚪 Serralheria & Portões Automáticos</option>
                        <option value="Marcenaria & Móveis Planejados">🪵 Marcenaria & Móveis Planejados</option>
                        <option value="Instalação de Eletrodomésticos">🔌 Instalação de Eletrodomésticos</option>
                        <option value="Segurança Eletrônica, Alarmes & CFTV">📹 Segurança Eletrônica, Alarmes & CFTV</option>
                        <option value="Limpeza Pós-Obra & Fachadas">✨ Limpeza Pós-Obra & Fachadas</option>
                        <option value="Aquecedores a Gás & Boiler">🔥 Aquecedores a Gás & Boiler</option>
                        <option value="Gesso, Sancas & Drywall">📐 Gesso, Sancas & Drywall</option>
                        <option value="Reparos Gerais & Marido de Aluguel">🔨 Reparos Gerais & Marido de Aluguel</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Experiência (Anos)</label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Visita Base (R$)</label>
                        <input
                          type="number"
                          min="30"
                          step="10"
                          value={laborBaseRate}
                          onChange={(e) => setLaborBaseRate(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#18181b] block mb-1">Raio de Ação (Km)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={operatingRadius}
                          onChange={(e) => setOperatingRadius(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Chave Pix para Recebimento das Propostas</label>
                      <input
                        type="text"
                        placeholder="Chave Pix (E-mail, CPF, CNPJ ou Telefone)"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#18181b] block mb-1">Apresentação & Diferenciais</label>
                      <textarea
                        rows={2}
                        placeholder="Descreva sua experiência, ferramentas, garantias e diferenciais profissionais..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-prestador"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Credenciando Prestador...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Concluir Credenciamento PRO</span>
                        </>
                      )}
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
