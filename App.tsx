import React, { useState, useEffect, useRef } from 'react';
import { User, Chat, Message, SigmaxCountry, AnalysisResult, SmartSuggestion } from './types';
import { COUNTRY_THEMES, INITIAL_CONTACTS } from './constants';
import * as GeminiService from './services/geminiService';
import * as Persistence from './services/persistence';
import { 
  PaperAirplaneIcon, ShieldCheckIcon, CpuChipIcon, SignalIcon, GlobeAltIcon, BoltIcon,
  SparklesIcon, LanguageIcon, PlusIcon, UserGroupIcon, HashtagIcon, LockClosedIcon,
  ArrowRightOnRectangleIcon, FaceSmileIcon, CameraIcon, CheckBadgeIcon, ExclamationTriangleIcon,
  Cog6ToothIcon, TrashIcon, NoSymbolIcon, CommandLineIcon, BeakerIcon, BookOpenIcon,
  ComputerDesktopIcon, DocumentTextIcon, KeyIcon, MicrophoneIcon, VideoCameraIcon,
  PhoneXMarkIcon, ChatBubbleLeftRightIcon, SpeakerWaveIcon, Bars3Icon, XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

// --- Types for Props ---

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent, chatId: string) => void;
  otherUser?: User; // For private chats
  isUnread: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
  onReact: (emoji: string) => void;
  currentUserId: string;
}

// --- New Advanced Components ---

// 1. Decrypted Text Effect
const DecryptedText = ({ text, speed = 30 }: { text: string, speed?: number }) => {
  const [display, setDisplay] = useState(text);
  const [finished, setFinished] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    // Only animate if text is non-empty
    if (!text) return;
    
    let iteration = 0;
    const maxIterations = text.length;
    
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setFinished(true);
        setDisplay(text); // Ensure final state is correct
      }
      iteration += 1 / 2; // Slower reveal
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={finished ? "" : "font-mono text-cyan-300"}>{display}</span>;
};

// 2. Holographic Tilt Container
// Fix: Make children optional to avoid type errors in strict mode
const HoloTilt = ({ children, active }: { children?: React.ReactNode, active: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !active) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Rotate slightly based on mouse position
    const rotateY = x * 4; // Max 2 deg
    const rotateX = -y * 4; // Max 2 deg
    
    setTransform(`perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.005)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)');
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.1s ease-out' }}
      className="w-full h-full transform-style-3d"
    >
      {children}
    </div>
  );
};

// --- Existing Components (Preserved) ---

const LaptopScene = ({ onExit }: { onExit: () => void }) => {
  // ... (Existing implementation preserved)
  const [unlocked, setUnlocked] = useState(false);
  const [keyForged, setKeyForged] = useState(false);
  const [assembly, setAssembly] = useState<string[]>([]);
  const correctOrder = [
    'function generateKey() {',
    '  const x = Sigmax.get(ID);',
    '  return "AUTHORIZED";',
    '}'
  ];
  const [pool, setPool] = useState<string[]>([]);
  useEffect(() => {
    setPool([...correctOrder].sort(() => Math.random() - 0.5));
  }, []);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const handleBlockClick = (block: string) => {
    setAssembly([...assembly, block]);
    setPool(pool.filter(b => b !== block));
  };
  const reset = () => {
    setAssembly([]);
    setPool([...correctOrder].sort(() => Math.random() - 0.5));
    setKeyForged(false);
  };
  const checkCode = () => {
    if (JSON.stringify(assembly) === JSON.stringify(correctOrder)) {
      setKeyForged(true);
    } else {
      alert("Compilation Error: Syntax Invalid. Sequence mismatch.");
      reset();
    }
  };
  const swipeCard = () => {
    setUnlocked(true);
  };
  if (unlocked) {
    return (
      <div className="absolute inset-0 bg-slate-800 flex flex-col p-8 font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <button onClick={onExit} className="absolute top-4 right-4 text-red-400 hover:text-red-300 z-10 flex items-center">
          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1"/> LOGOUT
        </button>
        <div className="z-10">
          <h1 className="text-2xl text-cyan-400 mb-8 border-b border-cyan-500/30 pb-2 flex items-center">
            <ComputerDesktopIcon className="w-8 h-8 mr-3" /> CAPTAIN_COSMIC'S TERMINAL
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
             <div onClick={() => setOpenFile('ALLIES')} className="flex flex-col items-center cursor-pointer hover:bg-white/5 p-4 rounded transition-all group">
                <GlobeAltIcon className="w-12 h-12 md:w-16 md:h-16 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs md:text-sm text-white mt-2 group-hover:text-blue-300">ALLIES.enc</span>
             </div>
             <div onClick={() => setOpenFile('INVENTIONS')} className="flex flex-col items-center cursor-pointer hover:bg-white/5 p-4 rounded transition-all group">
                <CpuChipIcon className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs md:text-sm text-white mt-2 group-hover:text-emerald-300">INVENTIONS.log</span>
             </div>
          </div>
        </div>
        {openFile && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-3/4 h-3/4 bg-slate-900 border border-slate-600 shadow-2xl p-0 flex flex-col z-50 rounded-lg overflow-hidden">
              <div className="bg-slate-800 p-2 border-b border-slate-700 flex justify-between items-center">
                 <span className="text-xs text-slate-400 uppercase tracking-wider pl-2">{openFile}.txt</span>
                 <button onClick={() => setOpenFile(null)} className="text-red-500 hover:bg-red-500/10 px-3 py-1 rounded">X</button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-black font-mono text-sm">
                {openFile === 'ALLIES' ? (
                   <div className="text-green-400 animate-fade-in">
                     <p className="text-xs text-green-700 mb-4">DECRYPTING... SUCCESS</p>
                     <h2 className="text-xl font-bold underline mb-4 text-green-300">CONFIDENTIAL // ALLIANCE LIST</h2>
                     <ul className="space-y-2 list-disc pl-5">
                       <li><span className="text-orange-400 font-bold">POWERLINGX</span> - Energy Directorate</li>
                       <li><span className="text-cyan-400 font-bold">TAIQ</span> - Cybernetic Research</li>
                       <li><span className="text-purple-400 font-bold">BEL-IQ-Z</span> - Intelligence & Psi-Ops</li>
                       <li><span className="text-yellow-400 font-bold">LING-DYNOMAX</span> - Advanced Propulsion</li>
                       <li><span className="text-emerald-400 font-bold">SAVIROM</span> - Bio-Preservation</li>
                     </ul>
                   </div>
                ) : (
                  <div className="text-cyan-300 animate-fade-in">
                    <p className="text-xs text-cyan-900 mb-4">LOADING LOGS... COMPLETE</p>
                    <h2 className="text-xl font-bold underline mb-4">R&D DEVELOPMENT LOG</h2>
                    <div className="space-y-4">
                      <div className="border-l-2 border-cyan-700 pl-4">
                         <h3 className="font-bold text-white">Project Neural-Lace v4</h3>
                         <p className="opacity-80">Latency reduced to 0.4ms. Stable connection across 5000km range verified.</p>
                      </div>
                      <div className="border-l-2 border-cyan-700 pl-4">
                         <h3 className="font-bold text-white">Quantum Shielding Emitter</h3>
                         <p className="opacity-80">Prototype Phase. Energy consumption high (requires Powerlingx grid support).</p>
                      </div>
                      <div className="border-l-2 border-cyan-700 pl-4">
                         <h3 className="font-bold text-white">Hyper-Drones</h3>
                         <p className="opacity-80">Combat Ready. Swarm AI logic updated by TAIQ engineers.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
           </div>
        )}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center font-mono p-4">
       <button onClick={onExit} className="absolute top-4 left-4 text-slate-500 hover:text-white transition-colors">← EXIT SYSTEM</button>
       {!keyForged ? (
         <div className="w-full max-w-lg p-6 border border-cyan-500/50 rounded-xl bg-slate-900/50 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
           <div className="flex items-center justify-center mb-6 text-cyan-400">
             <LockClosedIcon className="w-6 h-6 mr-2" />
             <h2 className="tracking-widest font-bold">SECURITY OVERRIDE</h2>
           </div>
           <p className="text-xs text-slate-400 mb-4 text-center">Protocol Mismatch. Reassemble code blocks to generate Key Card.</p>
           <div className="bg-black border border-slate-700 p-4 min-h-[120px] mb-4 space-y-1 rounded relative overflow-hidden">
             <div className="absolute top-0 right-0 p-1 text-[10px] text-slate-700">main.js</div>
             {assembly.length === 0 && <span className="text-slate-700 italic text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">// Insert code blocks here...</span>}
             {assembly.map((line, i) => (
               <div key={i} className="text-green-400 text-sm font-mono border-l-2 border-transparent hover:border-green-500 pl-1 cursor-default">{line}</div>
             ))}
           </div>
           <div className="space-y-2 mb-6">
             {pool.map((block, i) => (
               <button 
                key={i} onClick={() => handleBlockClick(block)} 
                className="block w-full text-left px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500 text-cyan-200 text-sm rounded border border-slate-600 transition-all font-mono"
               >
                 {block}
               </button>
             ))}
           </div>
           <div className="flex justify-between items-center pt-4 border-t border-slate-800">
             <button onClick={reset} className="text-red-400 text-xs hover:text-red-300 uppercase tracking-wider">Reset Sequence</button>
             <button 
              onClick={checkCode} 
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20" 
              disabled={pool.length > 0}
             >
               COMPILE KEY
             </button>
           </div>
         </div>
       ) : (
         <div className="flex flex-col items-center animate-fade-in relative z-10">
           <div onClick={swipeCard} className="w-72 h-44 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.4)] flex flex-col items-center justify-center mb-8 border-t border-yellow-300 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
              <div className="absolute top-6 left-6 w-10 h-8 bg-yellow-200 rounded opacity-80 border border-yellow-600"></div>
              <div className="z-10 text-center mt-4">
                <KeyIcon className="w-10 h-10 text-white mx-auto mb-2 opacity-90" />
                <h3 className="font-bold text-white text-xl tracking-[0.2em] drop-shadow-md">MASTER KEY</h3>
                <p className="text-[10px] text-yellow-100 font-mono mt-1">SIGMAX // LVL.5</p>
              </div>
              <div className="absolute top-0 left-0 w-[200%] h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 -skew-x-12"></div>
           </div>
           <p className="text-cyan-400 animate-pulse mb-6 text-sm tracking-widest font-bold">ACCESS GRANTED. KEY GENERATED.</p>
           <button onClick={swipeCard} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow-lg shadow-cyan-500/30 transition-all flex items-center">
             <CreditCardIconWrapper className="w-5 h-5 mr-2" /> SWIPE TO UNLOCK
           </button>
         </div>
       )}
    </div>
  );
};

const CreditCardIconWrapper = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.25 8.25a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V8.25Z" />
    <path d="M2.25 6a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75v.75H2.25V6Z" />
  </svg>
);

const MeetingRoom = ({ user, onClose }: { user: User, onClose: () => void }) => {
  // ... (Preserved)
  const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const participants = [user, ...INITIAL_CONTACTS];
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser. Use Chrome/Edge.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      addMessage(user.name, transcript);
      setActiveSpeaker('Processing...');
      const responders = INITIAL_CONTACTS.sort(() => 0.5 - Math.random()).slice(0, 2);
      for (const bot of responders) {
        setTimeout(async () => {
          setActiveSpeaker(bot.name);
          const response = await GeminiService.generatePersonaResponse(
             messages.map(m => ({
               id: 'temp', chatId: 'meeting', senderId: m.sender === user.name ? 'me' : 'bot', 
               text: m.text, timestamp: new Date().toISOString(), status: 'read', priority: 'NORMAL'
             })),
             bot.name,
             bot.systemPrompt,
             transcript
          );
          addMessage(bot.name, response);
          setActiveSpeaker(null);
        }, Math.random() * 2000 + 1000);
      }
    };
    recognition.start();
  };
  const addMessage = (sender: string, text: string) => {
    setMessages(prev => [...prev, {
      sender,
      text,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
    }]);
  };
  return (
    <div className="absolute inset-0 z-50 bg-[#202124] flex flex-col lg:flex-row text-white font-sans overflow-hidden">
      <div className="flex-1 flex flex-col p-2 md:p-4">
         <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 overflow-y-auto">
            {participants.map(p => (
              <div key={p.id} className="relative bg-[#3c4043] rounded-lg overflow-hidden flex items-center justify-center group border border-transparent hover:border-blue-500 transition-colors aspect-video md:aspect-auto">
                 <img src={p.avatar} alt={p.name} className="w-16 h-16 md:w-24 md:h-24 rounded-full opacity-90" />
                 <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-black/50 px-2 py-1 rounded text-xs md:text-sm font-medium flex items-center">
                   {p.name} {p.id === user.id && '(You)'}
                   {activeSpeaker === p.name && <SpeakerWaveIcon className="w-4 h-4 ml-2 text-green-400 animate-pulse" />}
                 </div>
                 <div className="absolute top-2 right-2 md:top-4 md:right-4 flex space-x-1">
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-1 h-5 bg-blue-500 rounded animate-pulse delay-75"></div>
                    <div className="w-1 h-2 bg-blue-500 rounded animate-pulse delay-150"></div>
                 </div>
              </div>
            ))}
         </div>
         <div className="h-16 md:h-20 flex items-center justify-center space-x-4 md:space-x-6 bg-[#202124] shrink-0">
            <button onClick={startListening} className={`p-3 md:p-4 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-[#3c4043] hover:bg-[#474a4d]'}`}>
              <MicrophoneIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button className="p-3 md:p-4 rounded-full bg-[#3c4043] hover:bg-[#474a4d]">
              <VideoCameraIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button onClick={onClose} className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-red-600 hover:bg-red-700">
              <PhoneXMarkIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
         </div>
      </div>
      <div className="w-full h-1/3 lg:h-full lg:w-96 bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200">
         <div className="h-12 md:h-16 flex items-center px-4 md:px-6 border-b border-gray-200 justify-between shrink-0">
            <h3 className="text-gray-800 font-medium text-sm md:text-base">Meeting details</h3>
            <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full lg:hidden">
               <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
         </div>
         <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-4 md:mt-10">
                <ChatBubbleLeftRightIcon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs md:text-sm">Say something via microphone...</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === user.name ? 'items-end' : 'items-start'}`}>
                 <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-xs font-bold text-gray-700">{msg.sender}</span>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                 </div>
                 <div className={`px-4 py-2 rounded-lg text-sm max-w-[85%] ${msg.sender === user.name ? 'bg-blue-100 text-blue-900 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                   {msg.text}
                 </div>
              </div>
            ))}
         </div>
         <div className="p-2 md:p-4 bg-white border-t border-gray-200 shrink-0">
            <div className="bg-gray-100 rounded-full px-4 py-2 md:py-3 text-xs md:text-sm text-gray-500 italic flex items-center">
               <MicrophoneIcon className="w-3 h-3 md:w-4 md:h-4 mr-2" />
               Listening active in speech mode only...
            </div>
         </div>
      </div>
    </div>
  );
};

const TerminalWindow = ({ user, onClose, onUpdateUser }: { user: User, onClose: () => void, onUpdateUser: (u: User) => void }) => {
  // ... (Preserved)
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Sigmax Secure Terminal v3.0.1', 'Type command to proceed...']);
  const [scene, setScene] = useState<'TERMINAL' | 'BROWSER' | 'STUDY' | 'LAB' | 'LAPTOP'>('TERMINAL');
  const [url, setUrl] = useState('');
  const [showConstitution, setShowConstitution] = useState(false);
  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toUpperCase();
      const newHistory = [...history, `> ${input}`];
      if (cmd === 'EXIT') { onClose(); } 
      else if (cmd === 'CLEAR') { setHistory([]); } 
      else if (cmd === 'POWERLINGX') { setScene('BROWSER'); setHistory([]); } 
      else if (cmd === 'TAIQ') { setScene('STUDY'); setHistory([]); } 
      else if (cmd === 'BEL-IQ-Z') { setScene('LAB'); setHistory([]); } 
      else if (cmd === 'CAPTAIN-COSMIC') { setScene('LAPTOP'); setHistory([]); } 
      else { newHistory.push(`Access Denied: Unknown Command "${cmd}"`); setHistory(newHistory); }
      setInput('');
    }
  };
  const handleBrowserGo = () => {
    if (url.trim().toUpperCase() === 'POWERLIEX') { setShowConstitution(true); } 
    else { alert("404: Node Not Found on Sigmax Grid"); }
  };
  const signConstitution = () => {
    const updated = Persistence.updateUserCountry(user.id, SigmaxCountry.POWERLINGX);
    onUpdateUser(updated);
    alert("Allegiance Sworn. Welcome to Powerlingx, Citizen.");
    setShowConstitution(false);
  };
  if (scene === 'LAPTOP') { return <LaptopScene onExit={() => setScene('TERMINAL')} />; }
  if (scene === 'BROWSER') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col font-sans">
        <div className="h-12 bg-slate-800 flex items-center px-4 space-x-2 border-b border-slate-700">
           <button onClick={() => setScene('TERMINAL')} className="text-slate-400 hover:text-white">←</button>
           <button className="text-slate-400 hover:text-white">↻</button>
           <div className="flex-1 bg-slate-900 rounded-full h-8 px-4 flex items-center">
             <GlobeAltIcon className="w-4 h-4 text-slate-500 mr-2" />
             <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleBrowserGo()} className="bg-transparent border-none outline-none text-white text-sm w-full" placeholder="Enter Grid Address..." />
           </div>
           <button onClick={handleBrowserGo} className="text-cyan-400 font-bold text-xs">GO</button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-white relative overflow-hidden">
           {!showConstitution ? (
             <div className="text-center text-slate-300">
               <GlobeAltIcon className="w-24 h-24 md:w-32 md:h-32 mx-auto text-slate-200 mb-4" />
               <h1 className="text-2xl md:text-4xl font-bold text-slate-400">POWERLINGX BROWSER</h1>
               <p className="mt-2 text-sm md:text-base">Secure Gateway Active</p>
             </div>
           ) : (
             <div className="absolute inset-0 bg-yellow-50 overflow-y-auto p-4 md:p-12 font-serif text-slate-900">
                <div className="max-w-2xl mx-auto border-4 border-double border-slate-900 p-4 md:p-8 shadow-2xl bg-[#fffdf0]">
                  <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 underline">THE CONSTITUTION OF POWERLINGX</h1>
                  <p className="mb-4 text-sm md:text-base">We, the enlightened minds of the Grid, establish this covenant to maximize efficiency, energy flow, and progress.</p>
                  <p className="mb-4 text-sm md:text-base">Article I: Power is the ultimate currency. Waste nothing.</p>
                  <p className="mb-4 text-sm md:text-base">Article II: The Network is sovereign. Disconnection is treason.</p>
                  <p className="mb-8 text-sm md:text-base">Article III: Loyalty to Sigmax is absolute, but Powerlingx leads the charge.</p>
                  <div className="border-t border-slate-900 pt-8 mt-8 text-center">
                    <p className="italic mb-4 text-xs md:text-sm">By signing below, you pledge your digital soul to the infrastructure.</p>
                    <button onClick={signConstitution} className="px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white font-bold text-lg md:text-xl hover:bg-slate-700 transition-colors font-sans">SIGN PLEDGE</button>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  }
  if (scene === 'STUDY') {
    return (
      <div className="absolute inset-0 z-50 bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <button onClick={() => setScene('TERMINAL')} className="absolute top-4 left-4 text-white z-20">← EXIT</button>
        <div className="absolute top-1/4 left-1/4 transform -rotate-12 bg-white w-32 h-48 md:w-48 md:h-64 p-4 shadow-xl opacity-80 hover:opacity-100 transition-opacity">
           <h3 className="text-xs font-bold underline">Sigmax Protocol v1</h3>
           <p className="text-[8px] mt-2">Drafting the initial node connection...</p>
        </div>
        <div className="absolute bottom-1/4 right-1/3 transform rotate-6 bg-white w-40 h-28 md:w-56 md:h-40 p-4 shadow-xl opacity-80 hover:opacity-100 transition-opacity">
           <h3 className="text-xs font-bold text-red-800">THREAT ANALYSIS</h3>
           <p className="text-[8px] mt-2">External incursions detected in Sector 7...</p>
        </div>
        <div className="relative z-10 bg-[#3d2b1f] p-4 md:p-8 rounded-lg shadow-2xl border-t-4 border-[#5c4033] flex flex-col items-center">
           <h2 className="text-amber-100 font-serif text-lg md:text-2xl mb-4">The Taiq Study</h2>
           <div onClick={() => alert("The TAIQ Constitution emphasizes Logic, Code, and Order above all emotion.")} className="cursor-pointer bg-[#f3e5ab] w-48 h-64 md:w-64 md:h-80 p-6 shadow-lg transform hover:scale-105 transition-transform border border-amber-900/20">
             <div className="border-b border-black pb-2 mb-2 text-center font-bold font-serif text-sm md:text-base">TAIQ CONSTITUTION</div>
             <div className="space-y-2">
               <div className="h-1 bg-gray-400 w-full rounded"></div>
               <div className="h-1 bg-gray-400 w-5/6 rounded"></div>
               <div className="h-1 bg-gray-400 w-full rounded"></div>
               <div className="h-1 bg-gray-400 w-4/6 rounded"></div>
             </div>
             <div className="mt-8 text-[10px] text-center italic text-slate-600">(Click to Read)</div>
           </div>
        </div>
      </div>
    );
  }
  if (scene === 'LAB') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-900 text-cyan-500 font-mono p-4 md:p-8 overflow-y-auto">
        <button onClick={() => setScene('TERMINAL')} className="mb-4 hover:text-white">← RETURN TO TERMINAL</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-full">
          <div className="border border-cyan-500/30 p-6 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setScene('BROWSER')}>
             <GlobeAltIcon className="w-12 h-12 md:w-16 md:h-16 mb-4" />
             <h3 className="text-lg md:text-xl font-bold">Launch Powerlingx Browser</h3>
             <p className="text-sm opacity-70 mt-2">Access the secure grid web.</p>
          </div>
          <div className="border border-cyan-500/30 p-6 rounded-lg bg-slate-800/50">
             <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center"><BeakerIcon className="w-5 h-5 md:w-6 md:h-6 mr-2"/> Experimental Software</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => alert("Software by Ibhan: Neural Net Optimizer v9.2 - OPERATIONAL")} className="p-3 bg-slate-700 hover:bg-cyan-900 rounded text-xs text-left"><ComputerDesktopIcon className="w-4 h-4 inline mr-2"/> Ibhan's OptiNet</button>
                <button onClick={() => alert("Software by Ritankar: Quantum Encryption Keygen - SECURE")} className="p-3 bg-slate-700 hover:bg-cyan-900 rounded text-xs text-left"><ComputerDesktopIcon className="w-4 h-4 inline mr-2"/> Ritankar's Keygen</button>
                <button onClick={() => alert("Software by Satyaki: Defense Grid Monitor - ACTIVE")} className="p-3 bg-slate-700 hover:bg-cyan-900 rounded text-xs text-left"><ComputerDesktopIcon className="w-4 h-4 inline mr-2"/> Satyaki's Shield</button>
                <button onClick={() => alert("Software by Dian: Holographic UI Render Engine - RENDERING")} className="p-3 bg-slate-700 hover:bg-cyan-900 rounded text-xs text-left"><ComputerDesktopIcon className="w-4 h-4 inline mr-2"/> Dian's HoloCore</button>
                <button onClick={() => alert("Software by Soumyadeepta: Global Comms Uplink - CONNECTED")} className="p-3 bg-slate-700 hover:bg-cyan-900 rounded text-xs text-left"><ComputerDesktopIcon className="w-4 h-4 inline mr-2"/> Soumya's Uplink</button>
             </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 z-50 bg-black text-green-500 font-mono p-4 md:p-8 overflow-hidden flex flex-col">
       <div className="flex justify-between items-start mb-4 border-b border-green-900 pb-2">
         <h2 className="text-base md:text-lg">ROOT@SIGMAX:~#</h2>
         <button onClick={onClose} className="text-red-500 hover:text-red-400">[X] TERMINATE</button>
       </div>
       <div className="flex-1 overflow-y-auto space-y-1 mb-4 text-xs md:text-sm">
         {history.map((line, i) => <div key={i} className="whitespace-pre-wrap">{line}</div>)}
       </div>
       <div className="flex items-center bg-green-900/20 p-2 rounded">
         <span className="mr-2">{'>'}</span>
         <input autoFocus type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} className="bg-transparent border-none outline-none text-green-500 w-full text-sm md:text-base" />
       </div>
    </div>
  );
};

const VerificationFlow = ({ user, onComplete }: { user: User, onComplete: (u: User) => void }) => {
  // ... (Preserved)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reportData, setReportData] = useState({ fullName: user.name, age: '', department: 'General' });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'analyzing' | 'success' | 'failed'>('idle');
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; }
    } catch (err) { console.error("Camera access denied", err); }
  };
  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setScanStatus('analyzing');
    setIsScanning(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    const result = await GeminiService.verifyUserIdentity(base64);
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('success');
      setMatchResult(result.name);
      const verifiedUser = Persistence.verifyUser(user.id, `REP-${Date.now()}`, result.name);
      setTimeout(() => { onComplete(verifiedUser); }, 3000);
    }, 2000);
  };
  useEffect(() => { if (step === 2) startCamera(); }, [step]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
       <div className="relative z-10 w-full max-w-lg p-6 md:p-8 glass-panel rounded-2xl border border-cyan-500/30">
         <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center tracking-widest flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 mr-2" />
            SECURITY CLEARANCE
         </h2>
         {step === 1 && (
           <div className="space-y-4 animate-fade-in">
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <h3 className="text-cyan-400 font-bold uppercase text-xs mb-2">Mandatory Verification Report</h3>
               <p className="text-slate-300 text-sm mb-4">First-time neural link established. Please confirm biometric data.</p>
               <input type="text" value={reportData.fullName} disabled className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-slate-400 mb-2" />
               <input type="number" placeholder="Biological Age" className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white mb-2" onChange={e => setReportData({...reportData, age: e.target.value})}/>
               <select className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white" onChange={e => setReportData({...reportData, department: e.target.value})}>
                 <option>General Citizen</option>
                 <option>Sigmax Ops</option>
                 <option>Grid Maintenance</option>
               </select>
             </div>
             <button onClick={() => setStep(2)} disabled={!reportData.age} className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded shadow-lg shadow-cyan-500/30 transition-all uppercase disabled:opacity-50">Proceed to Biometrics</button>
           </div>
         )}
         {step === 2 && (
           <div className="flex flex-col items-center">
             <div className="relative w-48 h-48 md:w-64 md:h-64 bg-black rounded-full overflow-hidden border-4 border-cyan-500/50 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
               {scanStatus === 'idle' || scanStatus === 'analyzing' ? (
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <CheckBadgeIcon className="w-16 h-16 md:w-20 md:h-20 text-emerald-500 animate-bounce" />
                 </div>
               )}
               {isScanning && (
                 <div className="absolute inset-0 bg-cyan-500/20 animate-pulse z-20 grid grid-cols-4 grid-rows-4">
                    {Array.from({length:16}).map((_,i) => (<div key={i} className="border border-cyan-400/30"></div>))}
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]"></div>
                 </div>
               )}
             </div>
             {scanStatus === 'idle' && (
               <button onClick={captureAndAnalyze} className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 rounded-full text-white font-bold hover:bg-cyan-500 transition-all"><CameraIcon className="w-5 h-5" /> <span>Initiate Face Scan</span></button>
             )}
             {scanStatus === 'analyzing' && (<p className="text-cyan-400 animate-pulse text-sm uppercase tracking-widest">Processing Neural Vector...</p>)}
             {scanStatus === 'success' && (
                <div className="text-center animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-2">IDENTITY VERIFIED</h3>
                  {matchResult ? (
                    <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-lg">
                       <p className="text-xs text-emerald-400 uppercase">Match Found</p>
                       <p className="text-lg font-bold text-white">{matchResult}</p>
                       <p className="text-xs text-slate-400 mt-2">Admin Privileges Granted</p>
                    </div>
                  ) : (
                    <div className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                       <p className="text-slate-300">Citizen Identity Confirmed.</p>
                       <p className="text-xs text-slate-500 mt-1">Standard Access Level</p>
                    </div>
                  )}
                </div>
             )}
           </div>
         )}
       </div>
    </div>
  );
};

const AuthScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  // ... (Preserved)
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', country: SigmaxCountry.POWERLINGX });
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const user = Persistence.login(formData.phone, formData.password);
        if (user) onLogin(user); else setError("Invalid credentials. Access Denied.");
      } else {
        const newUser = Persistence.signup({
          name: formData.name, phoneNumber: formData.phone, password: formData.password, country: formData.country,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
          role: 'Citizen', securityLevel: 'CITIZEN', bio: 'New recruit to the Sigmax Alliance.', systemPrompt: 'You are a new user.'
        });
        onLogin(newUser);
      }
    } catch (err: any) { setError(err.message); }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-80"></div>
        <div className="grid grid-cols-12 h-full w-full opacity-10 pointer-events-none">{Array.from({length: 12}).map((_,i) => <div key={i} className="border-r border-cyan-500/20 h-full"></div>)}</div>
      </div>
      <div className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-900/50 mx-4">
        <div className="text-center mb-8">
          <GlobeAltIcon className="w-16 h-16 text-cyan-500 mx-auto mb-4 animate-pulse-slow" />
          <h1 className="text-3xl font-bold text-white tracking-widest">SIGMAX NEXUS</h1>
          <p className="text-xs text-cyan-400 uppercase tracking-[0.3em] mt-2">Secure Global Link</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-xs text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div><label className="block text-xs text-slate-400 uppercase mb-1">Identity Name</label><input type="text" required className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div>
                <label className="block text-xs text-slate-400 uppercase mb-1">Allegiance (Country)</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value as SigmaxCountry})}>
                  {Object.values(SigmaxCountry).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
          <div><label className="block text-xs text-slate-400 uppercase mb-1">Comm Link (Phone No.)</label><input type="text" required placeholder="+SIG-XXXX" className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><label className="block text-xs text-slate-400 uppercase mb-1">Access Key (Password)</label><input type="password" required className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
          <button type="submit" className="w-full py-3 mt-6 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 transition-all uppercase tracking-wider text-sm flex justify-center items-center">
            {isLogin ? 'Establish Uplink' : 'Initialize Identity'} <ArrowRightOnRectangleIcon className="w-4 h-4 ml-2"/>
          </button>
        </form>
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs text-slate-500 hover:text-cyan-400 underline transition-colors">{isLogin ? "Request New Clearance Level (Sign Up)" : "Return to Login Node"}</button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, senderName, onReact, currentUserId }) => {
  const [translated, setTranslated] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const handleTranslate = async () => {
    setIsTranslating(true);
    const result = await GeminiService.translateMessage(message.text);
    setTranslated(result);
    setIsTranslating(false);
  };
  const reactions = message.reactions || {};
  const hasReactions = Object.keys(reactions).length > 0;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-6 group relative`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-3 md:p-4 relative overflow-visible backdrop-blur-sm
        ${isOwn ? 'bg-gradient-to-br from-indigo-600/80 to-purple-700/80 text-white rounded-tr-none border border-indigo-400/30' : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-600/30'} ${message.priority === 'CRITICAL' ? 'border-red-500 animate-pulse bg-red-900/40' : ''}`}
        onMouseEnter={() => setShowEmoji(true)}
        onMouseLeave={() => setShowEmoji(false)}
        onClick={() => setShowEmoji(!showEmoji)}
      >
        {!isOwn && <div className="text-[10px] text-cyan-400 mb-1 font-bold uppercase">{senderName}</div>}
        {message.priority === 'CRITICAL' && (
          <div className="flex items-center space-x-1 text-red-400 text-xs font-bold mb-1 uppercase tracking-wider">
            <BoltIcon className="w-3 h-3" /> <span>Priority: Critical</span>
          </div>
        )}
        <div className="relative z-10 text-sm md:text-base whitespace-pre-wrap break-words">
          {/* Apply DecryptedText effect for new messages not sent by self for cool effect, or always */}
          <DecryptedText text={message.text} speed={20} />
          {translated && <div className="mt-2 pt-2 border-t border-white/10 text-xs text-emerald-300 italic">Translated: {translated}</div>}
        </div>
        <div className="mt-1 flex justify-between items-center text-[10px] opacity-70">
          <span className="flex items-center space-x-1">
            {message.metadata?.networkType === 'SECURE_MESH' && <ShieldCheckIcon className="w-3 h-3 text-emerald-400" />}
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
          <div className="flex space-x-2">
            {!isOwn && !translated && (
               <button onClick={handleTranslate} disabled={isTranslating} className="hover:text-cyan-400 transition-colors">
                 {isTranslating ? '...' : <LanguageIcon className="w-3 h-3" />}
               </button>
            )}
            <span>{isOwn ? (message.status === 'read' ? '✓✓' : '✓') : ''}</span>
          </div>
        </div>
        {(showEmoji || hasReactions) && (
          <div className={`absolute ${isOwn ? '-left-10' : '-right-10'} top-2 transition-opacity duration-200 ${showEmoji ? 'opacity-100 z-50' : 'opacity-0 z-[-1]'} flex flex-col space-y-1 bg-black/50 p-1 rounded-full`}>
             <button onClick={() => onReact('👍')} className="text-lg hover:scale-125 transition-transform">👍</button>
             <button onClick={() => onReact('❤️')} className="text-lg hover:scale-125 transition-transform">❤️</button>
             <button onClick={() => onReact('😂')} className="text-lg hover:scale-125 transition-transform">😂</button>
             <button onClick={() => onReact('😮')} className="text-lg hover:scale-125 transition-transform">😮</button>
             <button onClick={() => onReact('😡')} className="text-lg hover:scale-125 transition-transform">😡</button>
          </div>
        )}
        {hasReactions && (
          <div className={`absolute -bottom-4 ${isOwn ? 'right-0' : 'left-0'} flex space-x-1 bg-slate-900/80 rounded-full px-2 py-0.5 border border-slate-700 shadow-lg min-w-max z-20`}>
            {Object.entries(reactions).map(([emoji, userIds]) => {
              const users = userIds as string[];
              return (
                <span key={emoji} className="text-xs flex items-center space-x-1" title={users.length > 0 ? `${users.length} users` : ''}>
                  <span>{emoji}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{users.length}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [inputText, setInputText] = useState('');
  const [showAddChat, setShowAddChat] = useState(false);
  const [showManageChat, setShowManageChat] = useState(false);
  const [manageAddPhone, setManageAddPhone] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chatId: string } | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showMeetingRoom, setShowMeetingRoom] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newGroupData, setNewGroupData] = useState({ name: '', phones: '' });
  const [modalMode, setModalMode] = useState<'private' | 'group' | 'block'>('private');
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Persistence.initializeSystem();
    const session = Persistence.getSession();
    if (session) { setUser(session); loadData(session.id); }
  }, []);

  const loadData = (userId: string) => {
    setChats(Persistence.getUserChats(userId));
    setUserMap(Persistence.getUserMap());
  };

  useEffect(() => {
    if (!user) return;
    Persistence.subscribeToNetwork(
      (newMessage) => {
        if (activeChatId === newMessage.chatId) {
          setActiveMessages(prev => {
             const exists = prev.findIndex(m => m.id === newMessage.id);
             if (exists !== -1) { const updated = [...prev]; updated[exists] = newMessage; return updated; }
             return [...prev, newMessage];
          });
        }
        setChats(Persistence.getUserChats(user.id));
      },
      (updatedChat) => { if (updatedChat.participants.includes(user.id)) { setChats(Persistence.getUserChats(user.id)); setUserMap(Persistence.getUserMap()); } }
    );
  }, [user, activeChatId]);

  useEffect(() => {
    if (activeChatId && user) {
      setActiveMessages(Persistence.getMessages(activeChatId));
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setSmartSuggestions([]);
      setAnalysis(null);
      Persistence.toggleChatReadStatus(activeChatId, user.id, false);
      setMobileMenuOpen(false);
    }
  }, [activeChatId]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [activeMessages]);

  useEffect(() => {
    if (!activeMessages.length || !activeChatId) return;
    const lastMsg = activeMessages[activeMessages.length - 1];
    const activeChat = chats.find(c => c.id === activeChatId);
    if (lastMsg.senderId !== user?.id) {
       GeminiService.generateSmartReplies(lastMsg.text, `In chat: ${activeChat?.name || 'Private Chat'}. My role: ${user?.role}`).then(setSmartSuggestions);
    }
  }, [activeMessages.length, activeChatId]);

  const handleLogout = () => { Persistence.logout(); setUser(null); setActiveChatId(null); };
  const handleContextMenu = (e: React.MouseEvent, chatId: string) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, chatId }); };
  const closeContextMenu = () => setContextMenu(null);
  const handleToggleReadStatus = () => {
    if (!contextMenu || !user) return;
    const chat = chats.find(c => c.id === contextMenu.chatId);
    if (chat) {
       const isCurrentlyUnread = chat.unreadBy?.includes(user.id);
       Persistence.toggleChatReadStatus(chat.id, user.id, !isCurrentlyUnread);
       setChats(Persistence.getUserChats(user.id));
    }
    closeContextMenu();
  };
  const handleSendMessage = async (text: string, priority: 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL') => {
    if (!activeChatId || !user || !text.trim()) return;
    if (activeChatId === 'admin_sigmax' && text === '/TERMINAL') { setShowTerminal(true); setInputText(''); return; }
    if (text === 'LING-DYNOMAX') { setShowMeetingRoom(true); setInputText(''); return; }
    try {
      const newMessage: Message = { id: `msg_${Date.now()}`, chatId: activeChatId, senderId: user.id, text: text, timestamp: new Date().toISOString(), status: 'sent', priority: priority, metadata: { networkType: 'SECURE_MESH' } };
      setActiveMessages(prev => [...prev, newMessage]);
      Persistence.sendMessage(newMessage);
      setInputText('');
      setSmartSuggestions([]);
      const activeChat = chats.find(c => c.id === activeChatId);
      if (activeChat?.type === 'private') {
        const otherId = activeChat.participants.find(p => p !== user.id);
        const otherUser = userMap[otherId!];
        if (otherUser && otherUser.systemPrompt) {
          setTimeout(async () => {
            const responseText = await GeminiService.generatePersonaResponse(activeMessages.concat(newMessage), otherUser.name, otherUser.systemPrompt, text);
            const botMsg: Message = { id: `msg_${Date.now()}_bot`, chatId: activeChatId, senderId: otherUser.id, text: responseText, timestamp: new Date().toISOString(), status: 'delivered', priority: priority === 'CRITICAL' ? 'CRITICAL' : 'NORMAL' };
            Persistence.sendMessage(botMsg);
          }, 1500);
        }
      }
    } catch (e: any) { alert(e.message); setActiveMessages(prev => prev.slice(0, -1)); }
  };
  const handleReaction = (messageId: string, emoji: string) => {
    if (!activeChatId || !user) return;
    Persistence.addReaction(activeChatId, messageId, user.id, emoji);
    setActiveMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const reactions = m.reactions || {};
        let userList = reactions[emoji] || [];
        if (userList.includes(user.id)) { userList = userList.filter(id => id !== user.id); } else { userList = [...userList, user.id]; }
        const newReactions = { ...reactions, [emoji]: userList };
        if (userList.length === 0) delete newReactions[emoji];
        return { ...m, reactions: newReactions };
      }
      return m;
    }));
  };
  const handleCreateChat = () => {
    if (!user) return;
    try {
      if (modalMode === 'block') {
        const blocked = Persistence.blockUserByPhone(user.id, newChatPhone);
        alert(`Uplink Terminated: ${blocked.name} has been blocked.`);
        const session = Persistence.getSession();
        if (session) setUser(session);
      } else if (modalMode === 'private') {
        const chat = Persistence.createPrivateChat(user.id, newChatPhone);
        loadData(user.id);
        setActiveChatId(chat.id);
      } else {
        const phones = newGroupData.phones.split(',').map(p => p.trim());
        const chat = Persistence.createGroup(user.id, newGroupData.name, phones, 'group');
        loadData(user.id);
        setActiveChatId(chat.id);
      }
      setShowAddChat(false);
      setNewChatPhone('');
    } catch (e: any) { alert(e.message); }
  };
  const handleBlockUser = (targetId: string) => {
    if (!user) return;
    const isBlocked = user.blockedUserIds?.includes(targetId);
    if (isBlocked) { Persistence.unblockUser(user.id, targetId); } else { Persistence.blockUser(user.id, targetId); }
    const session = Persistence.getSession();
    if (session) setUser(session);
  };
  const handleAddMember = () => {
    if (!activeChatId || !user || !manageAddPhone) return;
    try { Persistence.addMemberToChat(activeChatId, user.id, manageAddPhone); setManageAddPhone(''); loadData(user.id); } catch (e: any) { alert(e.message); }
  };
  const handleRemoveMember = (targetId: string) => {
    if (!activeChatId || !user) return;
    if (window.confirm("Are you sure you want to remove this entity from the secure channel?")) {
      try { Persistence.removeMemberFromChat(activeChatId, user.id, targetId); loadData(user.id); } catch (e: any) { alert(e.message); }
    }
  };
  const runAnalysis = async () => { if (!activeMessages.length) return; setIsAnalyzing(true); const result = await GeminiService.analyzeConversation(activeMessages); setAnalysis(result); setIsAnalyzing(false); };
  
  const ChatItemComp: React.FC<ChatItemProps> = ({ chat, isActive, onClick, onContextMenu, otherUser, isUnread }) => {
    let name = chat.name;
    let avatar = chat.avatar;
    let status = null;
    let theme = null;
    if (chat.type === 'private' && otherUser) { name = otherUser.name; avatar = otherUser.avatar; status = otherUser.status || 'offline'; theme = COUNTRY_THEMES[otherUser.country]; } 
    else { theme = { color: 'text-slate-300', accent: 'border-slate-500', icon: chat.type === 'channel' ? <HashtagIcon className="w-4 h-4"/> : <UserGroupIcon className="w-4 h-4"/> }; }
    return (
      <div onClick={onClick} onContextMenu={(e) => onContextMenu(e, chat.id)} className={`p-3 flex items-center space-x-3 cursor-pointer transition-all duration-200 border-l-4 ${isActive ? `bg-slate-800/80 border-cyan-500` : 'bg-transparent border-transparent hover:bg-slate-800/50'} relative`}>
        <div className="relative"><img src={avatar} alt={name} className="w-10 h-10 rounded-full bg-slate-700 object-cover" />{status && (<div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`} />)}</div>
        <div className="flex-1 min-w-0"><div className="flex justify-between items-baseline"><h3 className={`font-medium truncate text-sm ${isActive ? 'text-white' : 'text-slate-300'} ${isUnread ? 'font-bold text-white' : ''}`}>{name}</h3>{chat.lastMessage && (<span className="text-[10px] text-slate-600">{new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>)}</div><div className="flex justify-between items-center"><p className={`text-xs truncate max-w-[140px] ${isUnread ? 'text-white font-semibold' : 'text-slate-500'}`}>{chat.lastMessage ? chat.lastMessage.text : (chat.description || 'No messages yet')}</p>{theme && <span className="text-xs opacity-50">{theme.icon}</span>}</div></div>
        {isUnread && (<div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>)}
      </div>
    );
  };

  if (!user) { return <HoloTilt active={false}><AuthScreen onLogin={(u) => { setUser(u); loadData(u.id); }} /></HoloTilt>; }
  if (!user.isVerified) { return <VerificationFlow user={user} onComplete={(u) => { setUser(u); loadData(u.id); }} />; }
  if (showTerminal) { return <TerminalWindow user={user} onClose={() => setShowTerminal(false)} onUpdateUser={(u) => setUser(u)} />; }
  if (showMeetingRoom) { return <MeetingRoom user={user} onClose={() => setShowMeetingRoom(false)} />; }

  const activeChat = chats.find(c => c.id === activeChatId);
  const otherChatUserId = activeChat?.type === 'private' ? activeChat.participants.find(id => id !== user.id) : undefined;
  const otherChatUser = otherChatUserId ? userMap[otherChatUserId] : undefined;
  const activeChatName = activeChat?.type === 'private' ? otherChatUser?.name : activeChat?.name;
  const activeChatTheme = activeChat?.type === 'private' && otherChatUser ? COUNTRY_THEMES[otherChatUser.country] : { color: 'text-white', accent: 'border-slate-500' };
  const isAdmin = activeChat?.admins?.includes(user.id);
  const visibleMessages = activeMessages.filter(msg => !user.blockedUserIds?.includes(msg.senderId));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" onClick={closeContextMenu}>
      {mobileMenuOpen && (<div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />)}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-700/50 flex flex-col glass-panel backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"><GlobeAltIcon className="w-6 h-6 text-white" /></div><div><h1 className="font-bold text-lg tracking-wider text-white">SIGMAX</h1><p className="text-[10px] text-cyan-400 uppercase tracking-widest">{user.country} NODE</p></div></div>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
            <button onClick={handleLogout} className="hidden lg:block text-slate-500 hover:text-red-400"><LockClosedIcon className="w-5 h-5"/></button>
          </div>
          <button onClick={() => { setShowAddChat(true); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800/80 hover:bg-cyan-700/50 border border-slate-600 hover:border-cyan-500 rounded-lg text-xs text-slate-300 transition-all uppercase tracking-wider"><PlusIcon className="w-4 h-4" /> <span>Manage Connections</span></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center"><HashtagIcon className="w-3 h-3 mr-1" /> Channels</div>
          {chats.filter(c => c.type === 'channel').map(chat => (<ChatItemComp key={chat.id} chat={chat} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} onContextMenu={handleContextMenu} isUnread={chat.unreadBy?.includes(user.id) || false} />))}
          <div className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center"><SignalIcon className="w-3 h-3 mr-1" /> Direct Links</div>
          {chats.filter(c => c.type !== 'channel').map(chat => { const otherId = chat.participants.find(p => p !== user.id); return (<ChatItemComp key={chat.id} chat={chat} otherUser={otherId ? userMap[otherId] : undefined} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} onContextMenu={handleContextMenu} isUnread={chat.unreadBy?.includes(user.id) || false} />); })}
        </div>
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 text-xs text-slate-500 flex justify-between items-center"><div className="flex flex-col"><span>{user.name}</span><span className="text-cyan-500">{user.verificationData?.identityMatch ? 'ADMIN' : 'USER'}</span></div><button onClick={handleLogout} className="lg:hidden text-slate-500 hover:text-red-400"><LockClosedIcon className="w-5 h-5"/></button></div>
      </div>
      {contextMenu && (<div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-50 bg-slate-800 border border-slate-600 rounded shadow-xl py-1 w-40"><button onClick={handleToggleReadStatus} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">{chats.find(c => c.id === contextMenu.chatId)?.unreadBy?.includes(user.id) ? 'Mark as Read' : 'Mark as Unread'}</button></div>)}
      
      {/* 3D Holo Container Wrapper */}
      <div className="flex-1 h-full w-full relative perspective-container">
        <HoloTilt active={true}>
          {activeChatId && activeChat ? (
            <div className="flex-1 flex flex-col relative w-full h-full bg-slate-900/40 rounded-l-3xl overflow-hidden border-l border-white/5 shadow-2xl">
              <div className="h-16 border-b border-slate-700/50 glass-panel flex justify-between items-center px-4 md:px-6 z-10">
                <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
                  <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-slate-400 hover:text-white shrink-0"><Bars3Icon className="w-6 h-6" /></button>
                  <div className="flex flex-col md:flex-row md:items-center"><h2 className={`text-lg md:text-xl font-semibold tracking-wide text-white truncate max-w-[150px] md:max-w-xs`}>{activeChatName}</h2><div className="flex items-center space-x-2 mt-1 md:mt-0 md:ml-4">{activeChat.type === 'private' && otherChatUser && (<span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${activeChatTheme?.accent} ${activeChatTheme?.color} bg-slate-900/50`}>{otherChatUser.country}</span>)}{activeChat.type === 'channel' && (<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/50 text-cyan-400 border border-cyan-700 shrink-0">SECURE CHANNEL</span>)}</div></div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
                  {isAdmin && activeChat.type !== 'private' && (<button onClick={() => setShowManageChat(true)} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors text-slate-400 hover:text-cyan-400" title="Manage Channel"><Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6" /></button>)}
                  <button onClick={runAnalysis} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors text-cyan-400" title="Analyze"><CpuChipIcon className="w-5 h-5 md:w-6 md:h-6" /></button>
                  {activeChat.type === 'private' && otherChatUser && (<button onClick={() => setShowInfoPanel(!showInfoPanel)} className="lg:hidden p-2 text-slate-400 hover:text-white"><InformationCircleIcon className="w-6 h-6" /></button>)}
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                {visibleMessages.map(msg => (<MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user.id} senderName={userMap[msg.senderId]?.name || 'Unknown'} onReact={(emoji) => handleReaction(msg.id, emoji)} currentUserId={user.id} />))}
              </div>
              {smartSuggestions.length > 0 && (<div className="px-4 md:px-6 py-2 flex space-x-2 overflow-x-auto bg-slate-900/40 border-t border-slate-800/50">{smartSuggestions.map((suggestion, idx) => (<button key={idx} onClick={() => handleSendMessage(suggestion.text)} className="whitespace-nowrap px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700 transition-all text-xs text-slate-300 flex flex-col items-start"><span className="font-semibold text-cyan-400 mb-0.5 uppercase text-[9px]">{suggestion.tone}</span>{suggestion.text}</button>))}</div>)}
              <div className="p-2 md:p-4 glass-panel border-t border-slate-700/50">
                <div className="flex items-center space-x-2 md:space-x-4 bg-slate-800/50 rounded-2xl p-2 border border-slate-600/50 focus-within:border-cyan-500/50 transition-colors">
                  <button onClick={() => handleSendMessage(inputText, 'CRITICAL')} className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors shrink-0" title="Send Critical Priority"><BoltIcon className="w-5 h-5" /></button>
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)} placeholder="Transmit message..." className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 min-w-0" />
                  <button onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim()} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 shrink-0"><PaperAirplaneIcon className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-900/50 relative w-full h-full rounded-l-3xl border-l border-white/5">
               <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden absolute top-4 left-4 text-slate-400 hover:text-white p-2"><Bars3Icon className="w-8 h-8" /></button>
              <GlobeAltIcon className="w-24 h-24 mb-4 opacity-20 animate-pulse-slow" />
              <p className="text-lg tracking-widest font-light">ESTABLISH CONNECTION</p>
            </div>
          )}
        </HoloTilt>
      </div>

      <div className={`fixed inset-y-0 right-0 z-40 w-72 glass-panel border-l border-slate-700/50 flex flex-col p-6 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${showInfoPanel ? 'translate-x-0' : 'translate-x-full'} ${(!activeChat || activeChat.type !== 'private' || !otherChatUser) ? 'hidden' : 'lg:flex'}`}>
        <button onClick={() => setShowInfoPanel(false)} className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
        {activeChat && activeChat.type === 'private' && otherChatUser && (
          <>
            <div className="flex flex-col items-center mb-8 mt-6 lg:mt-0">
               <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 mb-4"><img src={otherChatUser.avatar} alt="" className="w-full h-full rounded-full" /></div>
               <h3 className="text-xl font-bold text-white text-center">{otherChatUser.name}</h3>
               <p className="text-sm text-slate-400 text-center">{otherChatUser.role}</p>
               <p className="text-xs text-cyan-500 mt-1">{otherChatUser.phoneNumber}</p>
               <button onClick={() => handleBlockUser(otherChatUser.id)} className={`mt-4 flex items-center px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${user.blockedUserIds?.includes(otherChatUser.id) ? 'bg-red-900/50 text-red-400 border border-red-500 hover:bg-red-800/50' : 'bg-slate-800 text-slate-400 border border-slate-600 hover:text-white hover:bg-slate-700'}`}><NoSymbolIcon className="w-4 h-4 mr-2" />{user.blockedUserIds?.includes(otherChatUser.id) ? 'Unblock User' : 'Block User'}</button>
            </div>
            {analysis && (<div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700"><div className="text-[10px] uppercase text-slate-500 mb-1">Live Analysis</div><p className="text-xs text-slate-300">{analysis.summary}</p><div className={`mt-2 text-xs font-bold ${analysis.threatLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>Threat: {analysis.threatLevel}</div></div>)}
          </>
        )}
      </div>

      {showAddChat && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-4">Initialize Uplink</h3>
            <div className="flex space-x-1 mb-4 bg-slate-800 rounded p-1">
              <button onClick={() => setModalMode('private')} className={`flex-1 py-2 md:py-1 text-[10px] rounded uppercase transition-colors ${modalMode === 'private' ? 'bg-cyan-700 text-white' : 'text-slate-400 hover:text-white'}`}>Private</button>
              <button onClick={() => setModalMode('group')} className={`flex-1 py-2 md:py-1 text-[10px] rounded uppercase transition-colors ${modalMode === 'group' ? 'bg-cyan-700 text-white' : 'text-slate-400 hover:text-white'}`}>Group</button>
              <button onClick={() => setModalMode('block')} className={`flex-1 py-2 md:py-1 text-[10px] rounded uppercase transition-colors ${modalMode === 'block' ? 'bg-red-900/80 text-white' : 'text-slate-400 hover:text-red-400'}`}>Block ID</button>
            </div>
            {modalMode === 'block' ? (
              <div className="mb-4">
                <p className="text-xs text-red-400 mb-2">Warning: Blocking a neural link will prevent all incoming data transmission from this source.</p>
                 <input type="text" placeholder="Target Comm Link (+SIG-...)" className="w-full bg-slate-900 border border-red-900/50 focus:border-red-500 rounded p-2 text-white text-sm" value={newChatPhone} onChange={e => setNewChatPhone(e.target.value)} />
              </div>
            ) : modalMode === 'private' ? (
              <input type="text" placeholder="Target Comm Link (Phone No)" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm mb-4" value={newChatPhone} onChange={e => setNewChatPhone(e.target.value)} />
            ) : (
              <>
                <input type="text" placeholder="Group Designation (Name)" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm mb-2" value={newGroupData.name} onChange={e => setNewGroupData({...newGroupData, name: e.target.value})} />
                <input type="text" placeholder="Comm Links (comma separated)" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm mb-4" value={newGroupData.phones} onChange={e => setNewGroupData({...newGroupData, phones: e.target.value})} />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowAddChat(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleCreateChat} className={`px-4 py-2 rounded text-xs text-white font-bold transition-colors ${modalMode === 'block' ? 'bg-red-700 hover:bg-red-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}>{modalMode === 'block' ? 'TERMINATE LINK' : 'CONNECT'}</button>
            </div>
          </div>
        </div>
      )}

      {showManageChat && activeChat && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-cyan-500/50">
             <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-white">Manage Members</h3><button onClick={() => setShowManageChat(false)} className="text-slate-500 hover:text-white">X</button></div>
             <div className="mb-4 max-h-60 overflow-y-auto pr-2 space-y-2">
               {activeChat.participants.map(partId => {
                 const partUser = userMap[partId];
                 if (!partUser) return null;
                 const isSelf = partId === user.id;
                 return (
                   <div key={partId} className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                     <div className="flex items-center space-x-2 overflow-hidden"><img src={partUser.avatar} className="w-6 h-6 rounded-full" /><span className="text-xs text-slate-300 truncate">{partUser.name} {isSelf && '(You)'}</span></div>
                     {!isSelf && (<button onClick={() => handleRemoveMember(partId)} className="text-red-500 hover:text-red-400 p-1" title="Remove Member"><TrashIcon className="w-4 h-4" /></button>)}
                   </div>
                 )
               })}
             </div>
             <div className="border-t border-slate-700 pt-4">
               <label className="text-xs text-slate-500 uppercase block mb-1">Add Member by ID</label>
               <div className="flex space-x-2"><input type="text" placeholder="Comm Link (+SIG-...)" value={manageAddPhone} onChange={e => setManageAddPhone(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" /><button onClick={handleAddMember} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-xs font-bold">ADD</button></div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}