const { cmd } = require('../inconnuboy');

/**
 * Advanced Admin Status Check with LID & PN Support
 */
async function checkAdminStatus(conn, chatId, senderId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';
        
        const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
        const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
        
        const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
        const senderIdWithoutSuffix = senderId.split('@')[0];
        
        let isBotAdmin = false;
        let isSenderAdmin = false;
        
        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split('@')[0] : '';
                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';

                if (botId.includes(pId) || botLid === pLid || botNumber === pPhoneNumber) isBotAdmin = true;
                if (senderId.includes(pId) || senderIdWithoutSuffix === pLid || senderNumber === pPhoneNumber) isSenderAdmin = true;
            }
        }
        return { isBotAdmin, isSenderAdmin };
    } catch (err) {
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

cmd({
    pattern: "end",
    alias: ["byeall", "kickall", "endgc"],
    desc: "Removes all members from the group except whitelisted numbers (LID Support)",
    category: "owner",
    react: "⚠️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, groupMetadata, isCreator, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isCreator) return reply("❌ Only the *Owner* can use this command.");

        // 1. Check Bot & Sender Status with LID Fix
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, sender);
        
        if (!isBotAdmin) return reply("❌ I need to be an *Admin* to clean this group.");
        // Since isCreator is checked, isSenderAdmin is technically covered, but LID safety is good.

        // 2. Whitelist (Your provided numbers)
        const ignoreList = [
            "9231"
        ];

        // 3. Identification of Bot's own identity to prevent self-kick
        const botIdPrefix = conn.user.id.split(':')[0].split('@')[0];
        const botLidPrefix = conn.user.lid ? conn.user.lid.split('@')[0] : null;

        const participants = groupMetadata.participants || [];
        
        // 4. Filtering Targets
        const targets = participants.filter(p => {
            const pNumber = p.id.split('@')[0];
            const pLid = p.lid ? p.lid.split('@')[0] : null;
            
            // Check if participant is in Whitelist
            const isWhitelisted = ignoreList.some(num => pNumber === num || (pLid && pLid === num));
            
            // Check if participant is the Bot itself (PN or LID)
            const isBot = pNumber === botIdPrefix || (botLidPrefix && pLid === botLidPrefix) || (pLid && pLid === botLidPrefix);

            // Target only if NOT whitelisted and NOT the bot
            return !isWhitelisted && !isBot;
        });

        const jids = targets.map(p => p.id);

        if (jids.length === 0) return reply("✅ No members to remove. Everyone is either whitelisted or it's just me.");

        await reply(`⏳ *Cleaning Group...*\nRemoving ${jids.length} members.\nLID-Protection: Enabled ✅`);

        // 5. Execution
        await conn.groupParticipantsUpdate(from, jids, "remove");

        // 6. Success Message with Newsletter UI
        await conn.sendMessage(from, { 
            text: `*🚨 GROUP ENDED SUCCESSFULLY*\n\n*Removed:* ${jids.length} members\n*Safe:* ${ignoreList.length} Whitelisted Users + Bot\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ _*🦋⍣⃝🇰ʜᴀɴzada🕊*_*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: '🦋⍣⃝🇰ʜᴀɴzada🕊',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("End command error:", error);
        reply("❌ Error: " + error.message);
    }
});
