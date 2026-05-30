import React, { useState, useEffect } from "react";
import { 
  Skull, 
  MessageSquare, 
  Menu, 
  X, 
  Plus, 
  User,
  Settings,
  History,
  Trash2,
  Search,
  Check,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  Download,
  Smartphone,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChatSection from "./components/ChatSection";
import { INITIAL_PARAMETERS } from "./constants";
import { Message, ChatSession } from "./types";
import logoImg from "./assets/images/logo_1780112956790.png";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // PWA & Mobile States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Check if app is launched in standalone mode
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    // Check if the screen is mobile or user-agent represents phone/tablet
    const checkMobile = () => {
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const mobileWidth = window.innerWidth < 768;
      setIsMobile(mobileUA || mobileWidth);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("Dark Looksmax AI - Instalado com sucesso.");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Escolha do usuário para instalação: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Fallback for devices without beforeinstallprompt API support (such as iOS Safari)
      setShowInstallGuide(true);
    }
  };

  // Manage Sessions inside localStorage with v3 safety suffix
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const data = localStorage.getItem("looksmax_sessions_v3");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Erro ao ler sessões do localStorage:", e);
    }
    
    // Default initial session
    const defaultId = "session_default_" + Date.now();
    return [{
      id: defaultId,
      title: "Mentor de IA Dark",
      messages: [
        {
          id: "init",
          role: "assistant",
          content: "🦴 **DARK LOOKSMAXXING AI INICIADO.**\n\nSou seu mentor cibernético focado em otimização facial e corporal avançada baseada puramente na ciência.\n\nAqui, analisamos sua estrutura óssea craniofacial de forma rigorosa, impiedosa e científica.\n\n**Você pode anexar uma foto do seu rosto ou perfil** clicando no ícone de clipe abaixo para que eu possa avaliar a sua estrutura óssea, inclinação cantal ou gordura submental!\n\n**O que deseja analisar cientificamente hoje?**\n- \"Como otimizar a projeção da maxila com a prática correta de Mewing?\"\n- \"Explique os riscos biomecânicos graves de práticas estúpidas como o Bone Smashing.\"\n- \"Como reduzir o edema líquido facial (bloat) de forma rápida e biológica?\"",
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      timestamp: new Date().toLocaleString()
    }];
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    return chatSessions[0]?.id || "";
  });

  // Keep localStorage up to date
  useEffect(() => {
    localStorage.setItem("looksmax_sessions_v3", JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Find active session
  const activeSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];

  const handleNewChat = () => {
    const newId = "session_" + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: "Nova Conversa",
      messages: [
        {
          id: "init",
          role: "assistant",
          content: "🦴 **DARK LOOKSMAXXING AI INICIADO.**\n\nSou seu mentor cibernético focado em otimização facial e corporal avançada baseada puramente na ciência.\n\nAqui, analisamos sua estrutura óssea craniofacial de forma rigorosa, impiedosa e científica.\n\n**Você pode anexar uma foto do seu rosto ou perfil** clicando no ícone de clipe abaixo para que eu possa avaliar a sua estrutura óssea, inclinação cantal ou gordura submental!\n\n**O que deseja analisar cientificamente hoje?**\n- \"Como otimizar a projeção da maxila com a prática correta de Mewing?\"\n- \"Explique os riscos biomecânicos graves de práticas estúpidas como o Bone Smashing.\"\n- \"Como reduzir o edema líquido facial (bloat) de forma rápida e biológica?\"",
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      timestamp: new Date().toLocaleString()
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newId);
    setIsSidebarOpen(false);
    setIsHistoryOpen(false);
  };

  const handleMessagesUpdated = (newMessages: Message[]) => {
    // Generate clean dynamic title using first user's message
    const userMsg = newMessages.find(m => m.role === "user");
    let dynamicTitle = activeSession?.title || "Nova Conversa";
    
    if (userMsg && (dynamicTitle === "Nova Conversa" || dynamicTitle === "Mentor de IA Dark")) {
      const sanitized = userMsg.content.replace(/[#*`_]/g, "").trim();
      dynamicTitle = sanitized.slice(0, 32) + (sanitized.length > 32 ? "..." : "");
    }

    setChatSessions(prev => prev.map(s => {
      if (s.id === activeChatId) {
        return {
          ...s,
          title: dynamicTitle,
          messages: newMessages,
          timestamp: new Date().toLocaleString()
        };
      }
      return s;
    }));
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent choosing this session on click
    
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== idToDelete);
      
      // If we deleted all sessions, create a default one
      if (filtered.length === 0) {
        const defaultId = "session_default_" + Date.now();
        const defaultSession: ChatSession = {
          id: defaultId,
          title: "Mentor de IA Dark",
          messages: [
            {
              id: "init",
              role: "assistant",
              content: "🦴 **DARK LOOKSMAXXING AI INICIADO.**\n\nSou seu mentor cibernético focado em otimização facial e corporal avançada baseada puramente na ciência.\n\nAqui, analisamos sua estrutura óssea craniofacial de forma rigorosa, impiedosa e científica.\n\n**Você pode anexar uma foto do seu rosto ou perfil** clicando no ícone de clipe abaixo para que eu possa avaliar a sua estrutura óssea, inclinação cantal ou gordura submental!\n\n**O que deseja analisar cientificamente hoje?**\n- \"Como otimizar a projeção da maxila com a prática correta de Mewing?\"\n- \"Explique os riscos biomecânicos graves de práticas estúpidas como o Bone Smashing.\"\n- \"Como reduzir o edema líquido facial (bloat) de forma rápida e biológica?\"",
              timestamp: new Date().toLocaleTimeString()
            }
          ],
          timestamp: new Date().toLocaleString()
        };
        setActiveChatId(defaultId);
        return [defaultSession];
      }
      
      // If we deleted the currently active chat, set to first remaining
      if (activeChatId === idToDelete) {
        const nextActive = filtered[0]?.id || "";
        setActiveChatId(nextActive);
      }
      return filtered;
    });
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Deseja realmente apagar todo o seu histórico de conversas sob este perfil cibernético?")) {
      const defaultId = "session_default_" + Date.now();
      const defaultSession: ChatSession = {
        id: defaultId,
        title: "Mentor de IA Dark",
        messages: [
          {
            id: "init",
            role: "assistant",
            content: "🦴 **DARK LOOKSMAXXING AI INICIADO.**\n\nSou seu mentor cibernético focado em otimização facial e corporal avançada baseada puramente na ciência.\n\nAqui, analisamos sua estrutura óssea craniofacial de forma rigorosa, impiedosa e científica.\n\n**Você pode anexar uma foto do seu rosto ou perfil** clicando no ícone de clipe abaixo para que eu possa avaliar a sua estrutura óssea, inclinação cantal ou gordura submental!\n\n**O que deseja analisar cientificamente hoje?**\n- \"Como otimizar a projeção da maxila com a prática correta de Mewing?\"\n- \"Explique os riscos biomecânicos graves de práticas estúpidas como o Bone Smashing.\"\n- \"Como reduzir o edema líquido facial (bloat) de forma rápida e biológica?\"",
            timestamp: new Date().toLocaleTimeString()
          }
        ],
        timestamp: new Date().toLocaleString()
      };
      setChatSessions([defaultSession]);
      setActiveChatId(defaultId);
      setIsHistoryOpen(false);
    }
  };

  // Filter history items by search term safely
  const filteredSessions = chatSessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-screen w-screen bg-black text-zinc-200 flex overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
      <AnimatePresence mode="wait">
        {showLanding ? (
          /* PORTAL LANDING PAGE (Futuristic, high contrast, featuring the brand-new logo) */
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto bg-black bg-radial-[circle_at_center] from-zinc-950 via-black to-black select-none"
          >
            {/* Subtle background red pulse glow matching logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-650/5 blur-[120px] rounded-full pointer-events-none select-none z-0" />

            {/* Glowing vertical grids representing scanners */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.08)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10 my-auto">
              
              {/* Mascot logo card */}
              <motion.div 
                initial={{ transform: "scale(0.9) translateY(20px)", opacity: 0 }}
                animate={{ transform: "scale(1) translateY(0px)", opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="w-full md:w-1/2 flex flex-col items-center text-center justify-center relative"
              >
                {/* Float motion for the esports logo */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-red-600/10 rounded-3xl blur-2xl group-hover:bg-red-600/20 transition-all duration-700 pointer-events-none" />
                  <img 
                    src={logoImg} 
                    alt="Dark Looksmax AI Mascot Logo" 
                    className="w-80 h-80 object-contain rounded-3xl border border-zinc-900/55 bg-black/60 shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Subtitle brand stamp */}
                <div className="mt-6 space-y-1">
                  <h2 className="text-xl font-bold tracking-widest text-white font-mono uppercase">
                    DARK LOOKSMAX AI
                  </h2>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.25em]">
                    CYBERNETIC CEPHALOMETRICS v3.5
                  </p>
                </div>
              </motion.div>

              {/* Boarding and features details column */}
              <motion.div 
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full md:w-1/2 flex flex-col justify-center space-y-6"
              >
                {/* Security and status indicators */}
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none bg-zinc-900/60 border border-zinc-800/80 px-2 py-1 rounded">
                    SISTEMA ATIVO & SEGURO
                  </span>
                </div>

                {/* Main Pitch */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Descubra sua <span className="text-red-500 font-mono tracking-wide relative">Verdadeira</span> Estrutura Óssea.
                  </h1>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                    Analise sua simetria craniofacial, projeção de maxila e proporções faciais baseando-se em métricas puramente científicas e biológicas direcionadas ao esporte estético.
                  </p>
                </div>

                {/* Dynamic Features List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 transition">
                    <Skull className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Cefalometria IA Avançada</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Diagnósticos baseados em fotos de perfil e rosto para medir proporções e contornos.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 transition">
                    <Activity className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Biomecânica Craniana</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Explicação sobre Mewing correto e os riscos sérios de atividades destrutivas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 transition">
                    <TrendingUp className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Desinchaco Biológico Fast</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Ciência por trás do controle de sódio, retenção de fluidos e drenagem linfática facial.</p>
                    </div>
                  </div>
                </div>

                {/* Enter Gateway CTA Button / PWA Install Trigger */}
                <div className="space-y-4 pt-3">
                  {isMobile && !isInstalled ? (
                    // PWA Installation Mode for Mobile (User requested "Baixar")
                    <div className="space-y-2.5">
                      <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-red-650 hover:bg-red-700 text-white text-sm font-extrabold tracking-wider transition cursor-pointer select-none border-t border-white/10 shadow-[0_0_25px_rgba(220,38,38,0.25)] active:scale-[0.98] uppercase font-mono"
                      >
                        <Download className="w-4.5 h-4.5 text-white shrink-0 animate-bounce" />
                        Baixar
                      </button>
                      
                      {/* Secondary option so mobile users can still enter chat without installing */}
                      <button
                        onClick={() => setShowLanding(false)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-transparent hover:bg-zinc-900/60 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide transition cursor-pointer select-none border border-zinc-900"
                      >
                        Continuar no navegador
                        <ChevronRight className="w-4 h-4 shrink-0 text-zinc-500" />
                      </button>
                    </div>
                  ) : (
                    // Default Desktop Mode / Standalone Mobile Mode
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setShowLanding(false)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-extrabold tracking-tight transition cursor-pointer select-none border-t border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.08)] active:scale-[0.98]"
                      >
                        INICIAR CONVERSA COM MENTOR
                        <ChevronRight className="w-4 h-4 text-black shrink-0" />
                      </button>

                      {isInstallable && !isInstalled && (
                        // Optional Desktop PWA install secondary action
                        <button
                          onClick={handleInstallClick}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer select-none border border-zinc-900"
                        >
                          <Download className="w-3.5 h-3.5 animate-pulse" />
                          Instalar App no Computador
                        </button>
                      )}
                    </div>
                  )}

                  {/* Safety Guard disclaimer */}
                  <div className="flex items-start gap-2 text-[9px] font-mono text-zinc-650 leading-relaxed">
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                    <span>
                      AVISO: O mentor AI oferece análises estéticas cefalométricas educacionais de teor estritamente científico. Siga rotinas biomorfológicas sempre com responsabilidade.
                    </span>
                  </div>
                </div>

              </motion.div>

            </div>

            {/* Footer Signature */}
            <div className="absolute bottom-4 left-0 right-0 w-full text-center text-[10px] font-mono text-zinc-700 tracking-wider">
              DARK CONCEPTS © 2026 • TODOS OS DIREITOS RESERVADOS.
            </div>
          </motion.div>
        ) : (
          /* CORE APPLICATION DASHBOARD (ChatGPT style fully loaded workspace) */
          <motion.div 
            key="chat-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 w-full h-full flex overflow-hidden relative"
          >
            {/* SIDEBAR (ChatGPT style, ultra clean, black background and fine borders) */}
            <aside className={`
              fixed inset-y-0 left-0 z-50 w-64 bg-[#080808] border-r border-zinc-900 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 shrink-0 h-full
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              {/* Sidebar Navigation */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                
                {/* Logo / Header with brand-new Mascot icon */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-900/60 shadow-sm">
                  <div 
                    onClick={() => setShowLanding(true)}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition select-none"
                    title="Menu Principal"
                  >
                    <img 
                      src={logoImg} 
                      alt="Mini Mascot" 
                      className="w-7 h-7 object-cover rounded border border-zinc-800 bg-black"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-xs tracking-wider text-white block">
                        DARK LOOKSMAX AI
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                        Cefalometria v3.5
                      </span>
                    </div>
                  </div>
                  {/* Close button on mobile */}
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white md:hidden cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* New Chat Button (Prominent but minimalist) */}
                <div className="p-3">
                  <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-900 bg-[#0f0f10] hover:bg-zinc-900 text-zinc-200 text-xs font-semibold tracking-tight transition cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-zinc-400" />
                      Novo Chat
                    </span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] bg-black border border-zinc-900 text-zinc-500 font-mono">⌘N</kbd>
                  </button>
                </div>

                {/* Chat List (Real ChatGPT history loaded from state) */}
                <nav className="px-2 py-2 space-y-1 overflow-y-auto max-h-[50vh] scrollbar-thin">
                  <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest font-bold text-zinc-650 uppercase">
                    Conversas Recentes
                  </div>
                  {chatSessions.map(session => {
                    const active = session.id === activeChatId;
                    return (
                      <div key={session.id} className="group relative flex items-center px-1">
                        <button
                          onClick={() => {
                            setActiveChatId(session.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-left transition truncate pr-8 ${
                            active 
                              ? "bg-zinc-900 text-white" 
                              : "text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40"
                          }`}
                        >
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${active ? "text-zinc-200" : "text-zinc-600"}`} />
                          <span className="truncate">{session.title}</span>
                        </button>
                        {/* Delete button only displayed on hover or active */}
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-800 text-zinc-550 hover:text-red-400 transition cursor-pointer"
                          title="Excluir conversa"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button> 
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer (ChatGPT style Profile Footer) */}
              <div className="p-3 border-t border-zinc-900 bg-[#060606] shrink-0">
                <div className="flex items-center gap-2 px-1.5 justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6.5 h-6.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-405 font-bold shrink-0 animate-pulse">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-sans font-bold text-zinc-300 block leading-tight truncate">Membro Looksmax</span>
                      <span className="text-[8.5px] font-mono text-emerald-500 block">Online & Seguro</span>
                    </div>
                  </div>
                  {/* Exit back to landing page */}
                  <button 
                    onClick={() => setShowLanding(true)}
                    className="p-1 px-2 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800 text-[10px] hover:text-zinc-200 transition font-mono uppercase cursor-pointer"
                    title="Voltar ao início"
                  >
                    Sair
                  </button>
                </div>
              </div>

            </aside>

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/85 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* MAIN LAYOUT CANVAS */}
            <div className="flex-1 flex flex-col h-full bg-black overflow-hidden relative">
              
              {/* Simple ChatGPT Header on Both Desktop and Mobile */}
              <header className="h-14 bg-[#090909] border-b border-zinc-900 px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1.5 -ml-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white md:hidden transition cursor-pointer"
                    title="Abrir Menu"
                  >
                    <Menu className="w-4.5 h-4.5" />
                  </button>
                  
                  <div 
                    onClick={() => setShowLanding(true)}
                    className="flex items-center gap-2 select-none cursor-pointer hover:opacity-85 transition"
                    title="Voltar ao Início"
                  >
                    <img 
                      src={logoImg} 
                      alt="Mascot Mini Header" 
                      className="w-5 h-5 object-cover rounded bg-black border border-zinc-850"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h1 className="text-xs font-bold tracking-wider text-white font-mono uppercase leading-none">
                        DARK LOOKSMAX AI
                      </h1>
                      <span className="text-[8.5px] font-mono text-zinc-600 block mt-0.5 uppercase tracking-widest leading-none">
                        Mentor de Diagnóstico Craniofacial
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  
                  {/* HISTÓRICO DE CONVERSAS BUTTON (Top right) */}
                  <div className="relative">
                    <button
                      onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-850 bg-[#09090a] hover:bg-[#141416] hover:border-[#222] text-zinc-200 text-xs font-medium tracking-tight transition cursor-pointer select-none active:scale-95"
                      title="Histórico de conversas"
                    >
                      <History className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="hidden sm:inline">Histórico</span>
                      <span className="bg-zinc-900 text-zinc-300 text-[9px] font-mono px-1 py-0.2 rounded border border-zinc-850 font-bold ml-1">
                        {chatSessions.length}
                      </span>
                    </button>

                    {/* Popover Dropdown for History */}
                    {isHistoryOpen && (
                      <>
                        {/* Backdrop boundary detector to dismiss popover onClick */}
                        <div className="fixed inset-0 z-30" onClick={() => setIsHistoryOpen(false)} />
                        
                        <div className="absolute right-0 top-11 mt-1 w-80 bg-[#080809] border border-zinc-850 rounded-xl shadow-2xl p-3.5 z-40 animate-fade-in text-zinc-300 flex flex-col max-h-[380px]">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2">
                            <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5 select-none">
                              <History className="w-3 h-3 text-zinc-450" /> Histórico de Sessões
                            </span>
                            <button
                              onClick={handleClearAllHistory}
                              className="text-[9px] font-mono text-red-500 hover:text-red-400 hover:underline transition uppercase tracking-wider cursor-pointer"
                            >
                              Limpar Tudo
                            </button>
                          </div>

                          {/* Filter search bar */}
                          <div className="relative mb-2 shrink-0">
                            <Search className="w-3 h-3 text-zinc-650 absolute left-2.5 top-2.5" />
                            <input
                              type="text"
                              placeholder="Filtrar conversas..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full bg-[#030303] text-xs py-1.5 pl-8 pr-3.5 rounded-lg border border-zinc-900 text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-zinc-800 transition"
                            />
                          </div>

                          {/* Chat Sessions list inside popover */}
                          <div className="overflow-y-auto space-y-1 flex-1 pr-1 hover:scrollbar-zinc scrollbar-thin">
                            {filteredSessions.length === 0 ? (
                              <div className="text-center py-6 text-zinc-600 font-mono text-[9px] uppercase tracking-wide">
                                Nenhum registro correspondente.
                              </div>
                            ) : (
                              filteredSessions.map(session => {
                                const active = session.id === activeChatId;
                                return (
                                  <div 
                                    key={session.id} 
                                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-left transition select-none ${
                                      active 
                                        ? "bg-zinc-900" 
                                        : "hover:bg-zinc-900/40"
                                    }`}
                                    onClick={() => {
                                      setActiveChatId(session.id);
                                      setIsHistoryOpen(false);
                                    }}
                                  >
                                    <div className="min-w-0 flex-1 pr-2">
                                      <div className="text-xs font-semibold text-zinc-300 group-hover:text-white truncate flex items-center gap-1.5">
                                        {active ? (
                                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                        ) : (
                                          <MessageSquare className="w-3 h-3 text-zinc-500 shrink-0" />
                                        )}
                                        <span className="truncate">{session.title}</span>
                                      </div>
                                      <span className="font-mono text-[8px] text-zinc-650 block mt-0.5 uppercase tracking-wider ml-4.5">
                                        {session.timestamp}
                                      </span>
                                    </div>
                                    
                                    <button
                                      onClick={(e) => handleDeleteSession(session.id, e)}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-800 text-zinc-550 hover:text-red-400 transition cursor-pointer"
                                      title="Excluir sessão"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* "+" NOVO CHAT BUTTON */}
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-black text-xs font-bold tracking-tight transition cursor-pointer select-none active:scale-95 shadow-lg"
                    title="Nova Sessão"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Nova Conversa</span>
                  </button>

                </div>
              </header>

              {/* Inner Module Arena */}
              <div className="flex-1 overflow-y-auto bg-black flex flex-col">
                <div className="flex-1 min-h-0">
                  <ChatSection 
                    key={activeChatId} 
                    currentMetrics={INITIAL_PARAMETERS} 
                    initialMessages={activeSession?.messages}
                    onMessagesUpdated={handleMessagesUpdated}
                  />
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS / Manual PWA Installation Guide Modal */}
      <AnimatePresence>
        {showInstallGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstallGuide(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative max-w-sm w-full bg-[#0c0c0e] border border-zinc-850 rounded-2xl p-6 shadow-2xl z-10 text-center space-y-5"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-950/40 border border-red-900/50 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-red-500 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-md font-bold tracking-tight text-white uppercase font-mono">
                  Como Instalar o App
                </h3>
                <p className="text-xs text-zinc-400">
                  Instale o **Dark Looksmax AI** na sua tela de início para acesso rápido e funcionalidade offline completa.
                </p>
              </div>

              {/* Instructions list depending on iOS or Android */}
              <div className="text-left space-y-3 p-3.5 bg-black/40 border border-zinc-900 rounded-xl text-xs text-zinc-300">
                {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                  // iOS Safari instructions
                  <div className="space-y-2 font-sans">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">1</span>
                      <p className="leading-normal">Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima na barra inferior do Safari).</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">2</span>
                      <p className="leading-normal">Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> (+).</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">3</span>
                      <p className="leading-normal">Confirme tocando em <strong>Adicionar</strong> no canto superior direito.</p>
                    </div>
                  </div>
                ) : (
                  // Android / other browsers instructions
                  <div className="space-y-2 font-sans">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">1</span>
                      <p className="leading-normal">Toque no menu de três pontos <strong>(⋮)</strong> do seu navegador no topo ou rodapé.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">2</span>
                      <p className="leading-normal">Selecione <strong>Adicionar à tela inicial</strong> ou <strong>Instalar aplicativo</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">3</span>
                      <p className="leading-normal">Siga os prompts da tela para concluir o download.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action and Dismiss */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowInstallGuide(false);
                    setShowLanding(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition cursor-pointer select-none active:scale-[0.97]"
                >
                  Continuar no Navegador
                </button>
                <button
                  onClick={() => setShowInstallGuide(false)}
                  className="w-full py-1.5 text-zinc-500 hover:text-zinc-300 text-[11px] font-medium transition cursor-pointer"
                >
                  Fechar guia
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
