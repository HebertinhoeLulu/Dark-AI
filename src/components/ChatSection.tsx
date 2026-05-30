import React, { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, RefreshCw, Skull, User, Paperclip, X, Image as ImageIcon, Pencil, RotateCw } from "lucide-react";
import { Message, FacialParameter } from "../types";

interface ChatSectionProps {
  key?: any;
  currentMetrics: FacialParameter[];
  initialMessages?: Message[];
  onMessagesUpdated?: (messages: Message[]) => void;
  onResetChat?: () => void;
}

export default function ChatSection({ currentMetrics, initialMessages, onMessagesUpdated }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [
    {
      id: "init",
      role: "assistant",
      content: "🦴 **DARK LOOKSMAXXING AI INICIADO.**\n\nSou seu mentor cibernético focado em otimização facial e corporal avançada baseada puramente na ciência.\n\nAqui, analisamos sua estrutura óssea craniofacial de forma rigorosa, impiedosa e científica.\n\n**Você pode anexar uma foto do seu rosto ou perfil** clicando no ícone de clipe abaixo para que eu possa avaliar a sua estrutura óssea, inclinação cantal ou gordura submental!\n\n**O que deseja analisar cientificamente hoje?**\n- \"Como otimizar a projeção da maxila com a prática correta de Mewing?\"\n- \"Explique os riscos biomecânicos graves de práticas estúpidas como o Bone Smashing.\"\n- \"Como reduzir o edema líquido facial (bloat) de forma rápida e biológica?\"",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analisando...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // States for Editing and Regenerating
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Processando bioinstruções...",
      "Computando Lei de Wolff para remodelamento...",
      "Avaliando ângulo gonial na mandíbula...",
      "Analisando matriz suborbital...",
      "Estudando relações faciais enviadas..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage("A imagem é muito pesada. Por favor, escolha um arquivo menor que 12MB para envio estável.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Centralised function to query the Gemini API with complete session history
  const requestAIResponse = async (chatHistory: Message[]) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payloadMessages = chatHistory.map(m => ({
        role: m.role,
        content: m.content,
        image: m.image
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          currentMetrics: currentMetrics.map(p => ({
            id: p.id,
            label: p.label,
            value: p.value,
            selectedStat: p.consequence
          }))
        })
      });

      let data: any;
      try {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          if (!res.ok) {
            throw new Error(`Erro no servidor (Status ${res.status}). A imagem/mensagem pode ser maior que o limite estável suportado.`);
          } else {
            throw new Error("A resposta recebida do servidor não pôde ser lida como JSON mapeado.");
          }
        }
      } catch (parseError: any) {
        throw parseError;
      }

      if (!res.ok) {
        const detailStr = data?.details ? ` (${data.details})` : "";
        throw new Error((data?.error || `Erro de resposta do servidor`) + detailStr);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "Sem resposta analítica disponível.",
        timestamp: new Date().toLocaleTimeString()
      };

      const finalMessages = [...chatHistory, botMsg];
      setMessages(finalMessages);
      onMessagesUpdated?.(finalMessages);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro ao consultar o mentor de IA. Verifique as credenciais no painel Secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    // Se não tiver texto E não tiver imagem, não enviamos nada
    if ((!rawText.trim() && !selectedImage) || isLoading) return;

    if (!textToSend) {
      setInputMessage("");
    }

    setErrorMessage(null);

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: rawText,
      timestamp: new Date().toLocaleTimeString(),
      image: selectedImage || undefined
    };

    // Salva a imagem pendente e limpa o input para os próximos envios
    const currentPendingImage = selectedImage;
    handleRemoveImage();

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    onMessagesUpdated?.(updatedMessages);
    
    await requestAIResponse(updatedMessages);
  };

  // Regenerate last AI response
  const handleRegenerateResponse = async () => {
    if (isLoading || messages.length < 2) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "assistant") return;

    // Discard the last assistant message
    const remainingMessages = messages.slice(0, -1);
    setMessages(remainingMessages);
    onMessagesUpdated?.(remainingMessages);

    await requestAIResponse(remainingMessages);
  };

  // Edit question helpers
  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const submitEditedMessage = async (msgId: string) => {
    if (!editingText.trim() || isLoading) return;

    const targetIdx = messages.findIndex(m => m.id === msgId);
    if (targetIdx === -1) return;

    // Remove all subsequent messages and update edited message
    const updatedMessages = messages.slice(0, targetIdx + 1);
    updatedMessages[targetIdx] = {
      ...updatedMessages[targetIdx],
      content: editingText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(updatedMessages);
    onMessagesUpdated?.(updatedMessages);
    setEditingMessageId(null);
    setEditingText("");

    await requestAIResponse(updatedMessages);
  };

  const samplePrompts = [
    { text: "Analise a geometria do meu rosto com base no meu upload.", label: "Análise Cefalométrica" },
    { text: "Qual a física por trás do Mewing no avanço maxilar superior?", label: "Mewing Craniofacial" },
    { text: "Como reduzir o edema e o cortisol facial (bloat) de forma científica?", label: "Derrubar o Bloat" }
  ];

  return (
    <div className="flex flex-col h-full flex-1 max-w-2xl mx-auto w-full relative bg-black">
      
      {/* Messages Window (ChatGPT Style Continuous Feed) */}
      <div className="flex-1 overflow-y-auto space-y-8 py-8 px-4 scrollbar-thin">
        {messages.map((m) => {
          const isAi = m.role === "assistant";
          return (
            <div 
              key={m.id} 
              className="flex gap-5 text-sm leading-relaxed text-gray-100 group transition-all"
            >
              {/* Profile Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold transition-transform group-hover:scale-105 ${
                isAi 
                  ? "bg-zinc-900 border-zinc-800 text-red-500" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-300"
              }`}>
                {isAi ? <Skull className="w-4 h-4 text-zinc-400" /> : <User className="w-4 h-4 text-zinc-300" />}
              </div>

              {/* Message Content Area */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[9px] tracking-widest text-zinc-650 uppercase select-none">
                    {isAi ? "DARK CHATBOT AI" : "VOCÊ"} — {m.timestamp}
                  </div>
                  {!isAi && editingMessageId !== m.id && (
                    <button
                      onClick={() => startEditing(m)}
                      disabled={isLoading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-1.5 text-[10px]"
                      title="Editar pergunta"
                    >
                      <Pencil className="w-3 h-3 text-zinc-500" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">Editar</span>
                    </button>
                  )}
                </div>
                
                {/* User picture display inside chat bubble if attached */}
                {m.image && (
                  <div className="my-2 max-w-sm rounded-lg overflow-hidden border border-zinc-850 bg-[#111] p-1 shadow-md">
                    <img 
                      src={m.image} 
                      alt="Arquivo de diagnóstico enviado" 
                      className="max-h-64 md:max-h-80 w-auto rounded object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {editingMessageId === m.id ? (
                  <div className="space-y-3 mt-1.5 p-3 rounded-lg bg-[#080808] border border-zinc-850 animate-fade-in">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-black text-sm text-zinc-200 p-2.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 min-h-[90px] font-sans resize-y"
                      placeholder="Edite sua pergunta..."
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => submitEditedMessage(m.id)}
                        disabled={isLoading || !editingText.trim()}
                        className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer select-none active:scale-95 disabled:opacity-50"
                      >
                        Salvar e Enviar
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isLoading}
                        className="bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs border border-zinc-800 px-3 py-1.5 rounded transition cursor-pointer select-none"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-sans text-sm tracking-wide leading-relaxed text-zinc-200">
                    {m.content}
                  </div>
                )}

                {/* Regenerate Response Button placed under the last assistant message */}
                {isAi && m.id !== "init" && messages[messages.length - 1].id === m.id && (
                  <div className="pt-3 animate-fade-in">
                    <button
                      onClick={handleRegenerateResponse}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-850 bg-[#09090a] hover:bg-[#141416] hover:border-zinc-800 text-zinc-400 hover:text-white text-xs transition cursor-pointer select-none active:scale-95 disabled:opacity-40"
                      title="Gerar outra resposta do mentor"
                    >
                      <RotateCw className={`w-3.5 h-3.5 text-zinc-500 ${isLoading ? "animate-spin text-zinc-300" : ""}`} />
                      <span className="font-mono text-[9px] uppercase tracking-wider">Regerar Resposta</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-5 text-sm leading-relaxed text-gray-400">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border bg-zinc-900 border-zinc-800 text-red-500 animate-pulse">
              <Skull className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-[#666] uppercase animate-pulse">
                {loadingText.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 text-zinc-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-600" />
                <p className="text-xs font-mono text-zinc-600">Alinhando matrizes de projeção do tensor craniano...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg border border-red-950 bg-red-955/5 text-red-300 text-xs flex gap-3 my-2 font-sans select-none">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono font-bold uppercase text-red-400">DECIFRAÇÃO DE ERRO REVERSO</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Anchor point to scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-black max-w-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-zinc-900/40">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              className="text-left p-3.5 rounded-xl bg-[#090909] hover:bg-[#121212] border border-zinc-900 transition-all text-xs font-sans text-zinc-400 hover:text-white cursor-pointer hover:border-zinc-850 flex flex-col justify-between"
            >
              <div className="font-mono font-bold text-zinc-600 text-[8px] uppercase tracking-wider mb-2">
                {p.label}
              </div>
              <p className="line-clamp-2 leading-relaxed text-[11px]">{p.text}</p>
            </button>
          ))}
        </div>
      )}

      {/* Message input bar (ChatGPT aesthetic: clean centered bar with rounded corners and paperclip) */}
      <div className="p-4 bg-black border-t border-zinc-900/50 shrink-0">
        
        {/* Attachment preview above the control bar */}
        {selectedImage && (
          <div className="max-w-xl mx-auto mb-3 px-4 py-2 bg-[#09090a] rounded-xl border border-zinc-850 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                <img src={selectedImage} alt="Preview do anexo" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-300 truncate font-mono">imagem_diagnostico.png</div>
                <div className="text-[10px] text-emerald-500 font-mono">Foto facial carregada na fila de análise</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1.5 rounded-full hover:bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white transition cursor-pointer"
              title="Excluir imagem"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative max-w-xl mx-auto flex items-center bg-[#0d0d0d] hover:bg-[#111111] transition-colors border border-zinc-850 hover:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl pl-3.5 pr-2 py-1.5"
        >
          {/* File Input button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 mr-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors shrink-0 cursor-pointer disabled:opacity-40"
            title="Anexar imagem de diagnóstico"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <input
            type="text"
            placeholder="Mande uma mensagem ou anexe uma foto..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-zinc-200 py-2 focus:outline-none placeholder-zinc-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
            className="ml-2 bg-white text-black hover:bg-zinc-200 font-bold p-2 rounded-full transition disabled:bg-zinc-900 disabled:text-zinc-700 shrink-0 cursor-pointer flex items-center justify-center shadow-lg"
            title="Enviar mensagem"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        
        <div className="text-center text-[9px] text-zinc-650 mt-2 font-mono tracking-wider select-none">
          O chatbot pode errar ao ler imagens. Use para fins educativos de biomecânica facial.
        </div>
      </div>

    </div>
  );
}
