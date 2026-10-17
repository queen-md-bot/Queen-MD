
//QUEEN 👑 GIRL TECH 

const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. CONFIGURATION DE BASE (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "queen_01",
    // NOTE: koi hardcoded DB credential nahi — apna MONGODB_URI env var mein set karo
    MONGODB_URI: process.env.MONGODB_URI || '',
    
    // ===========================================================
    // 2. INFORMATIONS DU BOT
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '923076012084', // Mettez votre numéro ici
    BOT_NAME: "Queen MD",
    BOT_FOOTER: 'Power by Queen MD',
    
    // Mode de travail : public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public", 
    
    // ===========================================================
    // 3. FONCTIONNALITÉS AUTOMATIQUES (STATUTS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Voir automatiquement les statuts
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Liker automatiquement les statuts
    AUTO_LIKE_EMOJI: ['❤️', '🌹', '😇', '💥', '🔥', '💫', '💎', '💙', '🌝', '💚'], 
    
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Répondre aux statuts
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || 'Nice status! 🔥', // Message de réponse
    
    // ===========================================================
    // 4. FONCTIONNALITÉS DE CHAT & PRÉSENCE
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Marquer les messages comme lus (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Afficher "Écrit..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Afficher "Enregistre..."
    
    // ===========================================================
    // 5. GESTION DES GROUPES
    // ===========================================================
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    WELCOME_MSG: process.env.WELCOME_MSG || null, 
    GOODBYE_MSG: process.env.GOODBYE_MSG || null, 
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null, 
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,
    
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/',
    
    // ===========================================================
    // 6. SÉCURITÉ & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Rejeter les appels
    REJECT_MSG: process.env.REJECT_MSG || '*📞 Call rejected automatically. No calls allowed.*',
    
    // ===========================================================
    // 7. IMAGES & LIENS
    // ===========================================================
    IMAGE_PATH: 'https://files.catbox.moe/dbc49y.jpg',
    // Main WhatsApp Channel (menu mein "View Channel" button isi ka hoga)
    CHANNEL_LINK: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbEhkSP4yltQOjpNjz1s',
    // Additional channels (naam + link)
    ADDITIONAL_CHANNELS: [
        { name: 'MUAVIA MINI BOT 🎭', link: 'https://whatsapp.com/channel/0029VbDUrr1AojYnZ7f3ny39' },
        { name: 'Android & iPhone Tips', link: 'https://whatsapp.com/channel/0029VbAYFuA7z4kXHVNHfM1Y' },
        { name: 'Prompt Gallery', link: 'https://whatsapp.com/channel/0029VbDbXlAHbFV4GgoF5N32' },
        { name: 'AI Image Prompt ✔️', link: 'https://whatsapp.com/channel/0029VbE0YLqCnA7mdEewPx17' }
    ],
    // Auto-follow: bot start par ye channels follow karne ki koshish karega
    AUTO_FOLLOW_CHANNELS: process.env.AUTO_FOLLOW_CHANNELS || 'true',
    // Auto-react: in channels ki nayi posts par auto reaction
    AUTO_REACT_CHANNELS: process.env.AUTO_REACT_CHANNELS || 'true',
    CHANNEL_REACT_EMOJI: process.env.CHANNEL_REACT_EMOJI || '❤️',
    
    // ===========================================================
    // 8. EXTERNAL API (Optionnel)
    // ===========================================================
    // NOTE: koi hardcoded Telegram credential nahi — apne env vars mein set karo
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || ''
    
};
  
