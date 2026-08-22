import React, { useState } from 'react';
import { X, User, MapPin, Phone, Mail, Building2, Save, Check } from 'lucide-react';
import { ClientProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  onSave: (updated: Partial<ClientProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  client,
  onSave
}) => {
  const [name, setName] = useState(client.name || '');
  const [email, setEmail] = useState(client.email || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [cpf, setCpf] = useState(client.cpf || '');
  const [residenceType, setResidenceType] = useState<'apartamento' | 'casa' | 'comercial'>(
    client.residenceType || 'apartamento'
  );
  const [street, setStreet] = useState(client.address?.street || '');
  const [number, setNumber] = useState(client.address?.number || '');
  const [complement, setComplement] = useState(client.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(client.address?.neighborhood || '');
  const [city, setCity] = useState(client.address?.city || 'São Paulo');
  const [state, setState] = useState(client.address?.state || 'SP');
  const [cep, setCep] = useState(client.address?.cep || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || client.name,
      email: email.trim() || client.email,
      phone: phone.trim(),
      cpf: cpf.trim(),
      residenceType,
      address: {
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim() || 'São Paulo',
        state: state.trim() || 'SP',
        cep: cep.trim()
      }
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-[#e4e4e7]">
          <div>
            <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#fed7aa]">
              Seus Dados
            </span>
            <h3 className="text-xl font-bold text-[#18181b] mt-1">
              Editar Perfil & Endereço
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#18181b]">Dados Salvos com Sucesso!</h4>
            <p className="text-xs text-[#71717a]">Suas informações foram atualizadas no aplicativo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Dados Pessoais */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#71717a] uppercase tracking-wider">
                Dados Pessoais
              </h4>

              <div>
                <label className="text-xs font-semibold text-[#52525b] block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 90000-0000"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#52525b] block mb-1">CPF (opcional)</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Imóvel & Endereço */}
            <div className="space-y-3 pt-2 border-t border-[#e4e4e7]">
              <h4 className="text-xs font-extrabold text-[#71717a] uppercase tracking-wider">
                Endereço do Imóvel
              </h4>

              <div>
                <label className="text-xs font-semibold text-[#52525b] block mb-1">Tipo de Imóvel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['apartamento', 'casa', 'comercial'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setResidenceType(t)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-all ${
                        residenceType === t
                          ? 'bg-[#18181b] text-white border-[#18181b]'
                          : 'bg-[#fafafa] text-[#52525b] border-[#e4e4e7] hover:bg-zinc-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Logradouro (Rua / Av.)</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Av. Paulista, Rua das Flores..."
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Número</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Complemento / Apto</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto 42, Bloco C..."
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#52525b] block mb-1">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-xl px-3.5 py-2.5 text-sm text-[#18181b] focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[#e4e4e7] justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-[#e4e4e7] text-xs font-bold text-[#52525b] hover:bg-zinc-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
