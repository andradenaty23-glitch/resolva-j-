import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  MessageSquare,
  Phone,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface SupportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  clientEmail?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pagamentos' | 'garantia' | 'visitas' | 'emergencia';
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'pagamentos',
    question: 'Como funciona a caução de pagamento protegida?',
    answer: 'Quando você aprova um orçamento e realiza o pagamento via Pix ou Cartão, o valor fica retido com segurança na conta de custódia do Resolva Já. O prestador de serviço só recebe o repasse após você atestar que o serviço foi concluído e inspecionado com sucesso.'
  },
  {
    id: 'faq-2',
    category: 'garantia',
    question: 'Como funciona a garantia de 90 dias com cobertura de até R$ 5.000?',
    answer: 'Todos os serviços intermediados pela plataforma possuem garantia legal e contratual de 90 dias. Se o mesmo problema persistir ou houver qualquer defeito de mão de obra ou peça, enviamos outro técnico perito sem nenhum custo para você ou reembolsamos integralmente o valor.'
  },
  {
    id: 'faq-3',
    category: 'visitas',
    question: 'Como posso reagendar ou cancelar uma visita técnica?',
    answer: 'Você pode gerenciar suas visitas na aba "Agenda". Cancelamentos ou reagendamentos gratuitos podem ser feitos com até 2 horas de antecedência do horário combinado diretamente pelo app ou comunicando o técnico pelo chat.'
  },
  {
    id: 'faq-4',
    category: 'emergencia',
    question: 'O que devo fazer em caso de emergência elétrica ou vazamento grave?',
    answer: 'Feche imediatamente o registro geral de água (hidrômetro) ou desarme a chave geral do quadro elétrico. Em seguida, acione nosso atendimento prioritário de emergência 24h pelo botão de plantão ou via WhatsApp oficial.'
  },
  {
    id: 'faq-5',
    category: 'visitas',
    question: 'Como os profissionais são selecionados e credenciados?',
    answer: 'Todos os profissionais passam por verificação rigorosa de antecedentes criminais, validação de documentação (CPF/CNPJ), checagem de certificações técnicas (ex: NR-10 para eletricistas) e teste de integridade com o nosso índice de confiança (Trust Score).'
  }
];

export const SupportCenterModal: React.FC<SupportCenterModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientEmail
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat' | 'ticket'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('duvida_tecnica');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketProtocol, setTicketProtocol] = useState('');

  // Live chat messages
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'bot' | 'agent'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Olá! Sou o assistente da Engenharia Residencial Resolva Já. Como podemos ajudar você hoje?',
      time: 'Agora'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const protocol = `SUP-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketProtocol(protocol);
    setTicketSuccess(true);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setChatInput('');

    setTimeout(() => {
      let botReply =
        'Recebemos sua mensagem! Um engenheiro técnico de plantão está analisando e responderá em instantes. Para casos urgentes, você também pode usar nosso WhatsApp.';
      if (userMsg.toLowerCase().includes('vazamento') || userMsg.toLowerCase().includes('água')) {
        botReply =
          'Detectamos uma dúvida sobre hidráulica. Recomendamos fechar o registro geral caso haja vazamento ativo. Deseja que localizemos um encanador credenciado de emergência?';
      } else if (userMsg.toLowerCase().includes('luz') || userMsg.toLowerCase().includes('disjuntor') || userMsg.toLowerCase().includes('choque')) {
        botReply =
          'Detectamos um alerta elétrico. Por segurança, não toque em fios expostos e mantenha o disjuntor do circuito desarmado até a chegada do técnico credenciado NR-10.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, time de Engenharia Resolva Já! Preciso de suporte residencial para o meu imóvel.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center shadow-2xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#18181b]">
                Central de Ajuda & Suporte
              </h3>
              <p className="text-xs text-[#71717a]">
                Engenharia Residencial & Atendimento ao Cliente Resolva Já
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">WhatsApp Oficial</p>
              <p className="text-[10px] text-emerald-700">Resposta em ~2 min</p>
            </div>
          </button>

          <a
            href="tel:08007376582"
            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950">Plantão 24 Horas</p>
              <p className="text-[10px] text-blue-700">0800 RESOLVA JÁ</p>
            </div>
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-[#e4e4e7] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#18181b] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Perguntas Frequentes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#ea580c] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Chat com Suporte
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'ticket'
                ? 'bg-[#18181b] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Abrir Chamado
          </button>
        </div>

        {/* TAB 1: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar dúvida (ex: caução, garantia, cancelamento)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
              />
            </div>

            {/* Accordion List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredFaqs.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
                  Nenhum artigo encontrado. Fale com nosso suporte no chat ao lado!
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#e4e4e7] rounded-2xl overflow-hidden bg-[#fafafa] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full p-3.5 flex justify-between items-center text-left cursor-pointer hover:bg-zinc-100/80 transition-colors"
                      >
                        <span className="text-xs font-bold text-[#18181b]">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#ea580c] shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#71717a] shrink-0 ml-2" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="p-3.5 pt-0 text-xs text-[#52525b] border-t border-[#e4e4e7]/60 bg-white leading-relaxed animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHAT AO VIVO */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[330px] border border-[#e4e4e7] rounded-2xl bg-[#fafafa] overflow-hidden">
            <div className="p-3 bg-white border-b border-[#e4e4e7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#18181b]">Engenheiro de Plantão</span>
              </div>
              <span className="text-[10px] text-[#71717a]">Tempo de resposta: Instantâneo</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-[#ea580c] text-white rounded-tr-xs'
                        : 'bg-white text-[#18181b] border border-[#e4e4e7] rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[9px] text-[#71717a] mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-2 bg-white border-t border-[#e4e4e7] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Digite sua dúvida ou relato técnico..."
                className="flex-1 px-3 py-2 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-3.5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ABRIR TICKET / CHAMADO */}
        {activeTab === 'ticket' && (
          <div>
            {ticketSuccess ? (
              <div className="py-6 text-center space-y-3 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#18181b]">Chamado Aberto com Sucesso!</h4>
                <p className="text-xs text-[#71717a]">
                  Protocolo de acompanhamento: <strong className="text-[#ea580c] font-mono">{ticketProtocol}</strong>
                </p>
                <p className="text-xs text-[#52525b] max-w-sm mx-auto">
                  Enviamos uma cópia para seu e-mail e nossa equipe retornará em até 2 horas úteis.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTicketSuccess(false);
                    setTicketSubject('');
                    setTicketMessage('');
                    setActiveTab('faq');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer mt-2"
                >
                  Voltar ao Suporte
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#18181b] block mb-1">Categoria do Chamado</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                  >
                    <option value="duvida_tecnica">Dúvida Técnica ou Diagnóstico</option>
                    <option value="pagamento">Pagamentos, Faturas ou Custódia Pix</option>
                    <option value="agendamento">Agendamento ou Atraso do Prestador</option>
                    <option value="garantia">Dúvida sobre Garantia de 90 dias</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#18181b] block mb-1">Assunto Resumido</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Dúvida sobre repasse do serviço #1042"
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#18181b] block mb-1">Mensagem / Detalhes</label>
                  <textarea
                    required
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva detalhadamente o que você precisa..."
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('faq')}
                    className="flex-1 py-2.5 rounded-full border border-[#e4e4e7] text-xs font-bold text-[#52525b] hover:bg-[#fafafa] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Enviar Chamado
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
