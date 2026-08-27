import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Layers,
  FileCheck2,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import {
  UsuarioDoc,
  ServicoDoc,
  SolicitacaoDoc,
  CategoriaDoc
} from '../types';
import {
  subscribeAllUsuarios,
  subscribeAllServicosAdmin,
  subscribeAllSolicitacoesAdmin,
  subscribeCategorias,
  addCategoria,
  deleteServico,
  deleteUsuario,
  deleteUsuarioByEmail,
  seedDefaultCategoriasIfEmpty
} from '../services/firestoreService';

interface AdminPanelScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentUserEmail?: string;
  onBackToHome?: () => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  isOpen = true,
  onClose,
  currentUserEmail,
  onBackToHome
}) => {
  if (isOpen === false) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else if (onBackToHome) onBackToHome();
  };
  const [activeTab, setActiveTab] = useState<'usuarios' | 'servicos' | 'solicitacoes' | 'categorias'>('usuarios');
  const [usuarios, setUsuarios] = useState<UsuarioDoc[]>([]);
  const [servicos, setServicos] = useState<ServicoDoc[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoDoc[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDoc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Layers');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubUsers = subscribeAllUsuarios(setUsuarios);
    const unsubServicos = subscribeAllServicosAdmin(setServicos);
    const unsubSols = subscribeAllSolicitacoesAdmin(setSolicitacoes);
    const unsubCats = subscribeCategorias(setCategorias);

    return () => {
      unsubUsers();
      unsubServicos();
      unsubSols();
      unsubCats();
    };
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategoria({
        nome: newCatName.trim(),
        descricao: newCatDesc.trim() || 'Serviços especializados',
        icone: newCatIcon,
        ativa: true
      });
      setNewCatName('');
      setNewCatDesc('');
      setIsAddingCat(false);
      showFeedback('Categoria adicionada com sucesso no Firestore!');
    } catch (err: any) {
      showFeedback('Erro ao adicionar categoria: ' + err.message);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o serviço "${name}" como moderador?`)) {
      try {
        await deleteServico(id);
        showFeedback(`Serviço "${name}" removido com sucesso.`);
      } catch (err: any) {
        showFeedback('Erro ao remover: ' + err.message);
      }
    }
  };

  const handleDeleteUser = async (uid: string, name: string, email: string) => {
    if (window.confirm(`Deseja realmente excluir permanentemente o perfil de "${name}" (${email})?`)) {
      try {
        await deleteUsuario(uid);
        showFeedback(`Perfil de "${email}" foi excluído com sucesso do Firestore.`);
      } catch (err: any) {
        showFeedback('Erro ao excluir usuário: ' + err.message);
      }
    }
  };

  const [emailToPurge, setEmailToPurge] = useState('');
  const [isPurging, setIsPurging] = useState(false);

  const handlePurgeUserByEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = emailToPurge.trim();
    if (!target) return;
    if (window.confirm(`Excluir todos os registros vinculados ao e-mail ${target}?`)) {
      setIsPurging(true);
      try {
        const res = await deleteUsuarioByEmail(target);
        showFeedback(res.message);
        setEmailToPurge('');
      } catch (err: any) {
        showFeedback('Erro ao excluir: ' + (err.message || String(err)));
      } finally {
        setIsPurging(false);
      }
    }
  };

  const handleSeedCats = async () => {
    await seedDefaultCategoriasIfEmpty();
    showFeedback('Categorias padrão inicializadas no Firestore!');
  };

  // Metrics
  const totalClientes = usuarios.filter((u) => u.tipo === 'cliente').length;
  const totalProfissionais = usuarios.filter((u) => u.tipo === 'profissional').length;
  const totalConcluidas = solicitacoes.filter((s) => s.status === 'concluida').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 text-slate-100 p-4 sm:p-6 pb-24">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert size={16} /> Painel de Controle Master • Firebase Firestore
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administração Resolva Já
          </h1>
          <p className="text-sm text-slate-400">
            Conectado como <span className="text-amber-300 font-medium">{currentUserEmail || 'Admin'}</span>
          </p>
        </div>

        <button
          onClick={handleClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition border border-slate-700 flex items-center gap-2 cursor-pointer"
        >
          Voltar ao App
        </button>
      </div>

      {actionFeedback && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-medium flex items-center justify-between">
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total de Usuários</div>
          <div className="text-2xl font-black text-white mt-1">{usuarios.length}</div>
          <div className="text-xs text-blue-400 mt-1">
            {totalClientes} Clientes • {totalProfissionais} PROs
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Serviços no Ar</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{servicos.length}</div>
          <div className="text-xs text-slate-400 mt-1">{categorias.length} categorias ativas</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Solicitações Totais</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{solicitacoes.length}</div>
          <div className="text-xs text-emerald-300 mt-1">{totalConcluidas} concluídas</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Status Banco Firestore</div>
          <div className="text-2xl font-black text-indigo-400 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Ativo
          </div>
          <div className="text-xs text-slate-400 mt-1">Tempo Real (onSnapshot)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'usuarios'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users size={16} /> Usuários ({usuarios.length})
          </button>
          <button
            onClick={() => setActiveTab('servicos')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'servicos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Briefcase size={16} /> Serviços ({servicos.length})
          </button>
          <button
            onClick={() => setActiveTab('solicitacoes')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'solicitacoes'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileCheck2 size={16} /> Solicitações ({solicitacoes.length})
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'categorias'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers size={16} /> Categorias ({categorias.length})
          </button>
        </div>

        {/* Filter input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail, título ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        {/* Tab 1: Usuários */}
        {activeTab === 'usuarios' && (
          <div className="space-y-4">
            {/* Quick Purge by Email Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
                <Trash2 size={18} />
                <span>Excluir Usuário por E-mail:</span>
              </div>
              <form onSubmit={handlePurgeUserByEmail} className="flex flex-1 max-w-md items-center gap-2">
                <input
                  type="email"
                  placeholder="ex: usuario@email.com"
                  value={emailToPurge}
                  onChange={(e) => setEmailToPurge(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={isPurging || !emailToPurge.trim()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  {isPurging ? 'Excluindo...' : 'Excluir'}
                </button>
              </form>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-4">Usuário</th>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Localização</th>
                      <th className="p-4">Cadastrado Em</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {usuarios
                      .filter(
                        (u) =>
                          u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.uid} className="hover:bg-slate-750/50">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={u.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                              alt={u.nome}
                              className="w-9 h-9 rounded-full object-cover border border-slate-600"
                            />
                            <div>
                              <div className="font-semibold text-slate-100">{u.nome}</div>
                              <div className="text-xs text-slate-400 font-mono">UID: {u.uid.slice(0, 10)}...</div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-mono text-xs sm:text-sm">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                u.tipo === 'admin'
                                  ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                                  : u.tipo === 'profissional'
                                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                                  : 'bg-orange-900/80 text-orange-300 border border-orange-700'
                              }`}
                            >
                              {u.tipo}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300">
                            {u.bairro || 'Centro'}, {u.cidade || 'São Paulo'}
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            {u.criadoEm ? new Date(u.criadoEm).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.uid, u.nome, u.email)}
                              className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/80 rounded-lg transition cursor-pointer"
                              title="Excluir usuário do sistema"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                          Nenhum usuário cadastrado encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Serviços */}
        {activeTab === 'servicos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicos
              .filter(
                (s) =>
                  s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.categoriaNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={s.imagem || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80'}
                      alt={s.nome}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {s.categoriaNome}
                        </span>
                        <span className="text-sm font-black text-emerald-400">
                          R$ {s.preco?.toFixed(2) || '0,00'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-100 mt-1">{s.nome}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{s.descricao}</p>
                      <div className="text-xs text-slate-400 mt-2">
                        📍 {s.bairro}, {s.cidade} • Profissional: {s.profissionalNome || 'PRO'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">ID: {s.id.slice(0, 8)}...</span>
                    <button
                      onClick={() => handleDeleteService(s.id, s.nome)}
                      className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Moderar / Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Tab 3: Solicitações */}
        {activeTab === 'solicitacoes' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-4">Serviço / Chamado</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Profissional</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {solicitacoes
                    .filter(
                      (s) =>
                        s.servicoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.profissionalNome?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-slate-750/50">
                        <td className="p-4">
                          <div className="font-semibold text-slate-100">{s.servicoNome}</div>
                          <div className="text-xs text-slate-400">{s.descricao}</div>
                        </td>
                        <td className="p-4 text-slate-300">{s.clienteNome || 'Cliente'}</td>
                        <td className="p-4 text-slate-300">{s.profissionalNome || 'Profissional'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              s.status === 'concluida'
                                ? 'bg-emerald-900/80 text-emerald-300'
                                : s.status === 'aceita' || s.status === 'em_andamento'
                                ? 'bg-blue-900/80 text-blue-300'
                                : s.status === 'cancelada' || s.status === 'recusada'
                                ? 'bg-rose-900/80 text-rose-300'
                                : 'bg-amber-900/80 text-amber-300'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          {s.criadoEm ? new Date(s.criadoEm).toLocaleDateString('pt-BR') : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Categorias */}
        {activeTab === 'categorias' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Categorias no Firestore</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSeedCats}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> Restaurar Padrões
                </button>
                <button
                  onClick={() => setIsAddingCat(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus size={14} /> Nova Categoria
                </button>
              </div>
            </div>

            {isAddingCat && (
              <form onSubmit={handleAddCategory} className="bg-slate-800 border border-amber-500/40 rounded-2xl p-4 space-y-3">
                <div className="text-sm font-bold text-amber-400">Cadastrar Nova Categoria</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nome da categoria (ex: Eletricista)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                    className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                  />
                  <input
                    type="text"
                    placeholder="Descrição curta"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                  />
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                  >
                    <option value="Zap">Zap (Elétrica)</option>
                    <option value="Droplets">Droplets (Hidráulica)</option>
                    <option value="Hammer">Hammer (Pedreiro)</option>
                    <option value="Paintbrush">Paintbrush (Pintor)</option>
                    <option value="Sparkles">Sparkles (Diarista)</option>
                    <option value="Wrench">Wrench (Manutenção)</option>
                    <option value="Flower2">Flower2 (Jardinagem)</option>
                    <option value="Cpu">Cpu (Informática)</option>
                    <option value="Scissors">Scissors (Beleza)</option>
                    <option value="Layers">Layers (Outros)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCat(false)}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Salvar no Firestore
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{cat.nome}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{cat.descricao}</div>
                  </div>
                  <span className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                    {cat.icone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
