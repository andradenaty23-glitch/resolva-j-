import React, { useState } from 'react';
import { X, Plus, Image, DollarSign, MapPin, Phone, MessageSquare, Briefcase } from 'lucide-react';
import { ServicoDoc, CategoriaDoc } from '../types';
import { addServico, updateServico } from '../services/supabaseDatabase';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  profissionalId: string;
  profissionalNome: string;
  profissionalFoto?: string;
  initialService?: ServicoDoc | null;
  categorias?: CategoriaDoc[];
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  profissionalId,
  profissionalNome,
  profissionalFoto,
  initialService,
  categorias = []
}) => {
  const DEFAULT_CATEGORIAS = [
    { id: 'cat-eletrica', nome: 'Eletricista' },
    { id: 'cat-hidraulica', nome: 'Encanador / Hidráulica' },
    { id: 'cat-ar', nome: 'Ar-Condicionado & Refrigeração' },
    { id: 'cat-pintura', nome: 'Pintor & Acabamentos' },
    { id: 'cat-marcenaria', nome: 'Marceneiro & Móveis' },
    { id: 'cat-chaveiro', nome: 'Chaveiro & Fechaduras' },
    { id: 'cat-alvenaria', nome: 'Pedreiro & Alvenaria' },
    { id: 'cat-geral', nome: 'Marido de Aluguel / Reparos Gerais' }
  ];

  const availableCategories = categorias && categorias.length > 0 ? categorias : DEFAULT_CATEGORIAS;

  const [nome, setNome] = useState(initialService?.nome || '');
  const [descricao, setDescricao] = useState(initialService?.descricao || '');
  const [categoriaId, setCategoriaId] = useState(
    initialService?.categoriaId || (availableCategories[0]?.nome || 'Eletricista')
  );
  const [preco, setPreco] = useState(initialService?.preco ? String(initialService.preco) : '150');
  const [cidade, setCidade] = useState(initialService?.cidade || 'São Paulo');
  const [bairro, setBairro] = useState(initialService?.bairro || 'Pinheiros');
  const [endereco, setEndereco] = useState(initialService?.endereco || '');
  const [telefone, setTelefone] = useState(initialService?.telefone || '(11) 98765-4321');
  const [whatsapp, setWhatsapp] = useState(initialService?.whatsapp || '(11) 98765-4321');
  const [imagem, setImagem] = useState(
    initialService?.imagem ||
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
  );
  const [disponivel, setDisponivel] = useState(initialService?.disponivel !== false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('Informe o título do serviço.');
      return;
    }
    if (!preco || Number(preco) <= 0) {
      setErrorMsg('Informe um valor válido.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const selectedCat = availableCategories.find((c) => c.nome === categoriaId || c.id === categoriaId);
      const categoriaNome = selectedCat?.nome || categoriaId;

      if (initialService?.id) {
        await updateServico(initialService.id, {
          nome: nome.trim(),
          descricao: descricao.trim(),
          categoriaId,
          categoriaNome,
          preco: Number(preco),
          cidade: cidade.trim(),
          bairro: bairro.trim(),
          endereco: endereco.trim(),
          telefone: telefone.trim(),
          whatsapp: whatsapp.trim(),
          imagem: imagem.trim(),
          disponivel
        });
        onSuccess('Serviço atualizado com sucesso no Supabase!');
      } else {
        await addServico({
          profissionalId,
          profissionalNome,
          profissionalFoto,
          nome: nome.trim(),
          descricao: descricao.trim(),
          categoriaId,
          categoriaNome,
          preco: Number(preco),
          cidade: cidade.trim(),
          bairro: bairro.trim(),
          endereco: endereco.trim(),
          telefone: telefone.trim(),
          whatsapp: whatsapp.trim(),
          imagem: imagem.trim(),
          disponivel
        });
        onSuccess('Serviço cadastrado e publicado com sucesso no Supabase!');
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving service:', err);
      setErrorMsg('Não foi possível salvar o serviço. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                {initialService ? 'Editar Serviço PRO' : 'Cadastrar Novo Serviço PRO'}
              </h2>
              <p className="text-xs text-slate-500">Persistência direta no PostgreSQL via Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título do Serviço *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Instalação de Ventilador de Teto, Troca de Disjuntor..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preço Base (R$) *
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="150.00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Detalhada do que está incluso
            </label>
            <textarea
              rows={3}
              placeholder="Descreva o escopo do serviço, garantia oferecida, tempo médio de execução..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bairro de Atuação
              </label>
              <input
                type="text"
                placeholder="Ex: Pinheiros, Moema, Centro..."
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cidade
              </label>
              <input
                type="text"
                placeholder="São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp de Contato
              </label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telefone Comercial
              </label>
              <input
                type="text"
                placeholder="(11) 3333-3333"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              URL da Imagem de Capa do Serviço
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Status de Disponibilidade</div>
              <div className="text-[11px] text-slate-500">Serviço ativo para receber chamados</div>
            </div>
            <input
              type="checkbox"
              checked={disponivel}
              onChange={(e) => setDisponivel(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Salvando no Supabase...</span>
              ) : (
                <span>{initialService ? 'Salvar Alterações' : 'Publicar Serviço no Supabase'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
