import React, { useState } from 'react';
import { X, User, Phone, FileText, DollarSign, MapPin, Check, Briefcase, Key, Plus, Sparkles } from 'lucide-react';
import { ProviderProfile } from '../types';
import { SERVICE_DEMANDS_CATALOG } from '../data/serviceDemands';

interface EditProviderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderProfile;
  onSave: (updated: Partial<ProviderProfile>) => void;
}

export const EditProviderProfileModal: React.FC<EditProviderProfileModalProps> = ({
  isOpen,
  onClose,
  provider,
  onSave
}) => {
  const [name, setName] = useState(provider.name || '');
  const [phone, setPhone] = useState(provider.phone || '');
  const [document, setDocument] = useState(provider.document || '');
  const [category, setCategory] = useState(provider.category || 'Hidráulica & Encanamento');
  const [laborBaseRate, setLaborBaseRate] = useState(provider.laborBaseRate || 100);
  const [operatingRadiusKm, setOperatingRadiusKm] = useState(provider.operatingRadiusKm || 15);
  const [pixKey, setPixKey] = useState(provider.bankAccount?.pixKey || '');
  const [bankName, setBankName] = useState(provider.bankAccount?.bank || 'Conta Bancária');
  const [bio, setBio] = useState(provider.bio || '');
  const [specialtiesText, setSpecialtiesText] = useState(
    provider.specialties?.join(', ') || 'Hidráulica, Elétrica, Reparos Gerais'
  );

  if (!isOpen) return null;

  const currentSpecialtiesArray = specialtiesText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const toggleSpecialty = (title: string) => {
    let updated: string[];
    if (currentSpecialtiesArray.includes(title)) {
      updated = currentSpecialtiesArray.filter((item) => item !== title);
    } else {
      updated = [...currentSpecialtiesArray, title];
    }
    setSpecialtiesText(updated.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      name: name.trim() || 'Prestador de Serviços',
      phone: phone.trim(),
      document: document.trim(),
      category: category.trim(),
      laborBaseRate: Number(laborBaseRate) || 100,
      operatingRadiusKm: Number(operatingRadiusKm) || 15,
      bio: bio.trim(),
      specialties: specialties.length > 0 ? specialties : ['Reparos Gerais'],
      bankAccount: {
        bank: bankName.trim() || 'Conta Bancária',
        pixKey: pixKey.trim()
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e4e4e7] flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#18181b]">Editar Dados do Prestador</h3>
              <p className="text-xs text-[#71717a]">Atualize seu nome profissional, chave Pix e área de atendimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71717a] hover:bg-[#f4f4f5] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#ea580c]" /> Nome Profissional / Razão Social
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Silva Reparos Técnicos"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#ea580c]" /> CNPJ ou CPF
              </label>
              <input
                type="text"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#ea580c]" /> WhatsApp / Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b]">Categoria Principal</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 bg-white"
              >
                {SERVICE_DEMANDS_CATALOG.map((dem) => (
                  <option key={dem.id} value={dem.name}>
                    {dem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ea580c]" /> Raio de Atendimento (km)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={operatingRadiusKm}
                onChange={(e) => setOperatingRadiusKm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#ea580c]" /> Valor Base Mão de Obra (R$)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                value={laborBaseRate}
                onChange={(e) => setLaborBaseRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#ea580c]" /> Chave Pix de Recebimento
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="E-mail, CPF ou celular"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
              />
            </div>
          </div>

          {/* Specialties Interactive Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#18181b]">Especialidades Atendidas</label>
              <span className="text-[11px] text-[#71717a]">Clique para adicionar ou remover</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7] max-h-36 overflow-y-auto">
              {SERVICE_DEMANDS_CATALOG.map((item) => {
                const isSelected = currentSpecialtiesArray.some(
                  (s) => s.toLowerCase() === item.shortName.toLowerCase() || s.toLowerCase() === item.name.toLowerCase()
                );
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSpecialty(item.shortName)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#ea580c] text-white shadow-2xs'
                        : 'bg-white text-[#52525b] border border-[#e4e4e7] hover:border-[#ea580c] hover:text-[#ea580c]'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{item.shortName}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="Ex: Vazamentos, Troca de registros, Aquecedores"
              className="w-full px-3.5 py-2 rounded-xl border border-[#e4e4e7] text-xs font-medium focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#18181b]">Apresentação / Descrição Profissional</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Breve resumo da sua experiência e equipamentos utilizados."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-medium focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#e4e4e7] text-xs font-bold text-[#52525b] hover:bg-[#f4f4f5] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-[#ea580c]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Salvar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
