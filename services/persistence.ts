import { User, Chat, Message, SigmaxCountry } from '../types';
import { INITIAL_CONTACTS, ADMIN_CHANNELS } from '../constants';

const STORAGE_KEYS = {
  USERS: 'sigmax_users',
  CHATS: 'sigmax_chats',
  MESSAGES: 'sigmax_messages',
  SESSION: 'sigmax_session'
};

// --- Realtime Network Simulation ---
const networkChannel = new BroadcastChannel('sigmax_global_network');

export const subscribeToNetwork = (
  onMessage: (msg: Message) => void,
  onChatUpdate: (chat: Chat) => void
) => {
  networkChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === 'NEW_MESSAGE') onMessage(payload);
    if (type === 'MESSAGE_UPDATE') onMessage(payload); // Re-use onMessage for updates (reactions)
    if (type === 'CHAT_UPDATE') onChatUpdate(payload);
  };
};

// --- Database Helpers ---
const getDB = () => ({
  users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}') as Record<string, User>,
  chats: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '{}') as Record<string, Chat>,
  messages: JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}') as Record<string, Message[]>
});

const saveDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Initialization ---
export const initializeSystem = () => {
  const db = getDB();
  let dirty = false;

  // Seed Initial Bots/Users
  INITIAL_CONTACTS.forEach(contact => {
    if (!db.users[contact.id]) {
      db.users[contact.id] = {
        ...contact,
        phoneNumber: `+SIG-${Math.floor(Math.random()*9000)+1000}`,
        password: 'admin',
        isVerified: true,
        blockedUserIds: []
      };
      dirty = true;
    }
  });

  // Seed Admin Channels (AND POPULATE WITH RELEVANT BOTS)
  ADMIN_CHANNELS.forEach(adminChat => {
    if (!db.chats[adminChat.id]) {
      // Pre-populate specific bots into admin channels so they aren't empty
      const botParticipants: string[] = [];
      
      // Jaxon (c1), Aris (c2), Kaelith (c3), Sylas (c4)
      if (adminChat.id === 'admin_sir') botParticipants.push('c1', 'c2'); 
      if (adminChat.id === 'admin_sigmax') botParticipants.push('c1', 'c2', 'c3');
      if (adminChat.id === 'admin_rsd') botParticipants.push('c2');
      if (adminChat.id === 'infinity_force') botParticipants.push('c1', 'c2', 'c3', 'c4');

      db.chats[adminChat.id] = {
        ...adminChat,
        participants: botParticipants,
        admins: botParticipants // Bots are admins
      };
      dirty = true;
    }
  });

  if (dirty) {
    saveDB(STORAGE_KEYS.USERS, db.users);
    saveDB(STORAGE_KEYS.CHATS, db.chats);
  }
};

// --- Auth Services ---

export const login = (phoneNumber: string, password: string): User | null => {
  const users = getDB().users;
  const user = Object.values(users).find(u => u.phoneNumber === phoneNumber && u.password === password);
  if (user) {
    localStorage.setItem(STORAGE_KEYS.SESSION, user.id);
    return user;
  }
  return null;
};

export const signup = (userData: Omit<User, 'id' | 'isVerified' | 'blockedUserIds'>): User => {
  const db = getDB();
  if (Object.values(db.users).some(u => u.phoneNumber === userData.phoneNumber)) {
    throw new Error("Communicator ID already registered.");
  }

  const newUser: User = {
    ...userData,
    id: `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    isVerified: false, // Default to false
    blockedUserIds: []
  };

  db.users[newUser.id] = newUser;
  saveDB(STORAGE_KEYS.USERS, db.users);
  localStorage.setItem(STORAGE_KEYS.SESSION, newUser.id);
  
  return newUser;
};

export const verifyUser = (userId: string, reportId: string, matchedIdentity: string | null): User => {
  const db = getDB();
  const user = db.users[userId];
  if (!user) throw new Error("User not found");

  user.isVerified = true;
  user.verificationData = {
    reportId,
    faceScanTimestamp: new Date().toISOString(),
    identityMatch: matchedIdentity || undefined
  };

  // Logic to assign channels based on identity
  if (matchedIdentity) {
    user.role = `Admin: ${matchedIdentity}`;
    user.securityLevel = 'ADMIN';

    // Helper to join channel
    const joinChannel = (channelId: string) => {
      // Ensure channel exists first
      if (!db.chats[channelId]) return;
      
      if (!db.chats[channelId].participants.includes(userId)) {
        db.chats[channelId].participants.push(userId);
      }
      
      // Grant admin rights if not present
      if (!db.chats[channelId].admins) db.chats[channelId].admins = [];
      if (!db.chats[channelId].admins!.includes(userId)) {
        db.chats[channelId].admins!.push(userId);
      }
      
      networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: db.chats[channelId] });
    };

    if (matchedIdentity === "SOUMYADEEPTA ROY") {
      joinChannel('admin_sir');
      joinChannel('admin_sigmax');
    } 
    else if (matchedIdentity === "RITANKAR CHAKRABORTY") {
      joinChannel('admin_sir');
      joinChannel('admin_sigmax');
      joinChannel('admin_rsd');
      joinChannel('infinity_force');
    }
    else if (matchedIdentity === "SATYAKI HALDER") {
      joinChannel('admin_sigmax');
      joinChannel('admin_rsd');
      joinChannel('infinity_force');
    }
    else if (matchedIdentity === "DIAN DEY") {
      joinChannel('admin_sigmax');
      joinChannel('admin_rsd');
      joinChannel('infinity_force');
    }
    else if (matchedIdentity === "IBHAN CHAKRABORTY") {
      joinChannel('admin_sir');
      joinChannel('admin_sigmax');
    }
  }

  saveDB(STORAGE_KEYS.USERS, db.users);
  saveDB(STORAGE_KEYS.CHATS, db.chats);
  return user;
};

export const updateUserCountry = (userId: string, country: SigmaxCountry) => {
  const db = getDB();
  if (db.users[userId]) {
    db.users[userId].country = country;
    saveDB(STORAGE_KEYS.USERS, db.users);
  }
  return db.users[userId];
}

export const getSession = (): User | null => {
  const id = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!id) return null;
  return getDB().users[id] || null;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// --- Block Services ---

export const blockUser = (myId: string, targetId: string) => {
  const db = getDB();
  const me = db.users[myId];
  if (!me) return;
  if (!me.blockedUserIds) me.blockedUserIds = [];
  if (!me.blockedUserIds.includes(targetId)) {
    me.blockedUserIds.push(targetId);
    saveDB(STORAGE_KEYS.USERS, db.users);
  }
};

export const blockUserByPhone = (myId: string, phoneNumber: string) => {
  const db = getDB();
  const target = Object.values(db.users).find(u => u.phoneNumber === phoneNumber);
  
  if (!target) throw new Error("Target comm link not found on network.");
  if (target.id === myId) throw new Error("Cannot block self.");

  const me = db.users[myId];
  if (!me.blockedUserIds) me.blockedUserIds = [];
  
  if (!me.blockedUserIds.includes(target.id)) {
    me.blockedUserIds.push(target.id);
    saveDB(STORAGE_KEYS.USERS, db.users);
  }
  return target;
};

export const unblockUser = (myId: string, targetId: string) => {
  const db = getDB();
  const me = db.users[myId];
  if (!me || !me.blockedUserIds) return;
  me.blockedUserIds = me.blockedUserIds.filter(id => id !== targetId);
  saveDB(STORAGE_KEYS.USERS, db.users);
};

// --- Data Services ---

export const getUserChats = (userId: string): Chat[] => {
  const allChats = Object.values(getDB().chats);
  // Strictly filter chats where the user is a participant
  return allChats.filter(chat => chat.participants.includes(userId));
};

export const getMessages = (chatId: string): Message[] => {
  return getDB().messages[chatId] || [];
};

export const sendMessage = (message: Message): void => {
  const db = getDB();
  
  const chat = db.chats[message.chatId];
  if (!chat) throw new Error("Secure channel not found.");

  // CRITICAL: Ensure sender is a participant of the channel (Security Check for Admin Channels)
  if (!chat.participants.includes(message.senderId)) {
    throw new Error("Access Denied: You are not authorized to transmit on this secure channel.");
  }

  // Check Block Status (Private chats only)
  if (chat.type === 'private') {
    const recipientId = chat.participants.find(id => id !== message.senderId);
    if (recipientId) {
      const recipient = db.users[recipientId];
      if (recipient.blockedUserIds?.includes(message.senderId)) {
        throw new Error("Message delivery failed: Neural link rejected (Blocked).");
      }
    }
  }

  if (!db.messages[message.chatId]) db.messages[message.chatId] = [];
  db.messages[message.chatId].push(message);
  saveDB(STORAGE_KEYS.MESSAGES, db.messages);

  // Update last message
  chat.lastMessage = message;
  saveDB(STORAGE_KEYS.CHATS, db.chats);

  networkChannel.postMessage({ type: 'NEW_MESSAGE', payload: message });
  networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: chat });
};

export const addReaction = (chatId: string, messageId: string, userId: string, emoji: string) => {
  const db = getDB();
  const msgs = db.messages[chatId];
  if (!msgs) return;

  const msgIndex = msgs.findIndex(m => m.id === messageId);
  if (msgIndex === -1) return;

  const msg = msgs[msgIndex];
  if (!msg.reactions) msg.reactions = {};
  
  // Toggle logic
  if (msg.reactions[emoji]?.includes(userId)) {
    msg.reactions[emoji] = msg.reactions[emoji].filter(id => id !== userId);
    if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
  } else {
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    msg.reactions[emoji].push(userId);
  }

  saveDB(STORAGE_KEYS.MESSAGES, db.messages);
  networkChannel.postMessage({ type: 'MESSAGE_UPDATE', payload: msg });
};

export const createPrivateChat = (myId: string, otherPhoneNumber: string): Chat => {
  const db = getDB();
  const otherUser = Object.values(db.users).find(u => u.phoneNumber === otherPhoneNumber);
  
  if (!otherUser) throw new Error("User not found on Sigmax Network.");
  if (otherUser.id === myId) throw new Error("Cannot open neural link with self.");

  // Check if blocked
  const me = db.users[myId];
  if (me.blockedUserIds?.includes(otherUser.id)) {
     throw new Error("Cannot connect: You have blocked this neural signature.");
  }
  if (otherUser.blockedUserIds?.includes(myId)) {
    throw new Error("Connection Refused: Remote node has blocked your uplink.");
  }

  const existing = Object.values(db.chats).find(c => 
    c.type === 'private' && 
    c.participants.includes(myId) && 
    c.participants.includes(otherUser.id)
  );
  if (existing) return existing;

  const newChat: Chat = {
    id: `chat_${Date.now()}`,
    type: 'private',
    participants: [myId, otherUser.id]
  };

  db.chats[newChat.id] = newChat;
  saveDB(STORAGE_KEYS.CHATS, db.chats);
  networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: newChat });
  return newChat;
};

export const createGroup = (creatorId: string, name: string, participantPhones: string[], type: 'group' | 'channel' = 'group'): Chat => {
  const db = getDB();
  
  const participants = [creatorId];
  participantPhones.forEach(phone => {
    const u = Object.values(db.users).find(user => user.phoneNumber === phone);
    if (u) participants.push(u.id);
  });

  const newChat: Chat = {
    id: `${type}_${Date.now()}`,
    type,
    name,
    participants,
    admins: [creatorId],
    avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
  };

  db.chats[newChat.id] = newChat;
  saveDB(STORAGE_KEYS.CHATS, db.chats);
  networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: newChat });
  return newChat;
};

// --- Channel Management Services ---

export const addMemberToChat = (chatId: string, adminId: string, phone: string) => {
  const db = getDB();
  const chat = db.chats[chatId];
  if (!chat) throw new Error("Chat not found");
  
  if (!chat.admins?.includes(adminId)) {
    throw new Error("Unauthorized: Only admins can manage members.");
  }

  const userToAdd = Object.values(db.users).find(u => u.phoneNumber === phone);
  if (!userToAdd) throw new Error("User not found on network.");
  
  if (chat.participants.includes(userToAdd.id)) {
    throw new Error("User is already in this channel.");
  }

  chat.participants.push(userToAdd.id);
  saveDB(STORAGE_KEYS.CHATS, db.chats);
  networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: chat });
};

export const removeMemberFromChat = (chatId: string, adminId: string, targetUserId: string) => {
  const db = getDB();
  const chat = db.chats[chatId];
  if (!chat) throw new Error("Chat not found");

  if (!chat.admins?.includes(adminId)) {
    throw new Error("Unauthorized: Only admins can manage members.");
  }

  if (targetUserId === adminId) {
    throw new Error("Cannot remove self via admin panel. Leave chat instead.");
  }

  chat.participants = chat.participants.filter(id => id !== targetUserId);
  
  // Also remove from admins if they were one
  if (chat.admins) {
      chat.admins = chat.admins.filter(id => id !== targetUserId);
  }

  saveDB(STORAGE_KEYS.CHATS, db.chats);
  networkChannel.postMessage({ type: 'CHAT_UPDATE', payload: chat });
};

export const getUserMap = (): Record<string, User> => {
  return getDB().users;
};