import { Contact, SigmaxCountry, Message, Chat } from './types';

export const SYSTEM_USER_ID = 'me';

export const COUNTRY_THEMES: Record<SigmaxCountry, { color: string, accent: string, icon: string }> = {
  [SigmaxCountry.POWERLINGX]: { color: 'text-orange-500', accent: 'border-orange-500', icon: '⚡' },
  [SigmaxCountry.TAIQ]: { color: 'text-green-500', accent: 'border-green-500', icon: '🤖' },
  [SigmaxCountry.BEL_IQ_Z]: { color: 'text-purple-500', accent: 'border-purple-500', icon: '🧠' },
  [SigmaxCountry.SAVIROM]: { color: 'text-emerald-500', accent: 'border-emerald-500', icon: '🌿' },
  [SigmaxCountry.DIAMONDAURA]: { color: 'text-cyan-400', accent: 'border-cyan-400', icon: '💎' },
  [SigmaxCountry.LING_DYNOMAX]: { color: 'text-yellow-400', accent: 'border-yellow-400', icon: '🗣️' },
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Cmdr. Jaxon Vane',
    country: SigmaxCountry.POWERLINGX,
    role: 'Grid Ops Director',
    securityLevel: 'OFFICIAL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jaxon',
    status: 'online',
    lastSeen: new Date(),
    bio: 'Energy waits for no one. Efficiency is key.',
    systemPrompt: 'You are Commander Jaxon Vane. Speak in short, punchy sentences. Focus on power grids, energy efficiency, and speed. You are impatient but competent.'
  },
  {
    id: 'c2',
    name: 'Dr. Aris Thorne',
    country: SigmaxCountry.TAIQ,
    role: 'Chief Cyberneticist',
    securityLevel: 'INTEL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aris',
    status: 'busy',
    lastSeen: new Date(),
    bio: 'The code is the law.',
    systemPrompt: 'You are Dr. Aris Thorne. You are highly technical. Use computer science metaphors. You are logical and often dry in humor.'
  },
  {
    id: 'c3',
    name: 'High Merchant Kaelith',
    country: SigmaxCountry.DIAMONDAURA,
    role: 'Trade Minister',
    securityLevel: 'LEADER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelith',
    status: 'online',
    lastSeen: new Date(),
    bio: 'Clarity brings value.',
    systemPrompt: 'You are Lady Kaelith. You are sophisticated, wealthy, and polite. You care about transaction value and aesthetics.'
  },
  {
    id: 'c4',
    name: 'Warden Sylas',
    country: SigmaxCountry.SAVIROM,
    role: 'Eco-Preservationist',
    securityLevel: 'CITIZEN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sylas',
    status: 'in_mission',
    lastSeen: new Date(),
    bio: 'Nature remembers everything.',
    systemPrompt: 'You are Warden Sylas. You are calm, poetic, and slow to anger. You speak in metaphors about nature.'
  }
];

export const ADMIN_CHANNELS: Chat[] = [
  {
    id: 'admin_sir',
    type: 'channel',
    name: 'ADMINS.S.I.R CHANNEL',
    participants: [],
    admins: [],
    avatar: 'https://ui-avatars.com/api/?name=SIR&background=000000&color=ffffff&bold=true',
    description: 'Sigmax Intelligence & Reconnaissance - Top Clearance Only'
  },
  {
    id: 'admin_sigmax',
    type: 'channel',
    name: 'ADMINS.SIGMAX CHANNEL',
    participants: [],
    admins: [],
    avatar: 'https://ui-avatars.com/api/?name=SGX&background=0f172a&color=06b6d4&bold=true',
    description: 'Central Command Broadcasts'
  },
  {
    id: 'admin_rsd',
    type: 'channel',
    name: 'ADMINS.R.S.D CHANNEL',
    participants: [],
    admins: [],
    avatar: 'https://ui-avatars.com/api/?name=RSD&background=7f1d1d&color=fca5a5&bold=true',
    description: 'Research, Strategy, Defense'
  },
  {
    id: 'infinity_force',
    type: 'channel',
    name: 'INFINITY FORCE CHANNEL',
    participants: [],
    admins: [],
    avatar: 'https://ui-avatars.com/api/?name=INF&background=4c1d95&color=e9d5ff&bold=true',
    description: 'Multiversal Task Force Coordination'
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {}; // Deprecated in favor of LocalStorage
