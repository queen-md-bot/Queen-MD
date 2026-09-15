const { cmd } = require('../inconnuboy');

cmd({
    pattern: "status",
    alias: ["sw", "mystatus", "uploadstatus"],
    desc: "Upload status with media or text",
    category: "owner",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator, sender }) => {
    if (!isCreator) return reply("❌ This command is only for owners!");
    
    try {
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || '' : '';
        const caption = text?.trim() || "";
        
        if (!quotedMsg && !caption) {
            return reply(
                `⚠️ Reply to media or provide text!\n\n` +
                `Examples:\n` +
                `• .status Hello everyone\n` +
                `• Reply to an image with: .status`
            );
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const statusJid = 'status@broadcast';
        
        // Format JID properly - use sender as is, WhatsApp handles the format
        const myJid = sender;
        
        let messageContent = {};
        
        if (quotedMsg) {
            const mediaBuffer = await quotedMsg.download();
            if (!mediaBuffer) throw new Error("Failed to download media");
            
            if (mimeType.startsWith('image/')) {
                messageContent = {
                    image: mediaBuffer,
                    caption: caption || "",
                    mimetype: mimeType
                };
            } 
            else if (mimeType.startsWith('video/')) {
                messageContent = {
                    video: mediaBuffer,
                    caption: caption || "",
                    mimetype: mimeType
                };
            } 
            else if (mimeType.startsWith('audio/')) {
                const isPTT = quotedMsg.message?.audioMessage?.ptt || false;
                messageContent = {
                    audio: mediaBuffer,
                    mimetype: isPTT ? 'audio/ogg; codecs=opus' : 'audio/mp4',
                    ptt: isPTT
                };
            }
            else {
                const msgType = Object.keys(quotedMsg.message || {})[0];
                
                if (msgType === 'imageMessage') {
                    messageContent = {
                        image: mediaBuffer,
                        caption: caption || "",
                        mimetype: 'image/jpeg'
                    };
                }
                else if (msgType === 'videoMessage') {
                    messageContent = {
                        video: mediaBuffer,
                        caption: caption || "",
                        mimetype: 'video/mp4'
                    };
                }
                else if (msgType === 'audioMessage' || msgType === 'pttMessage') {
                    messageContent = {
                        audio: mediaBuffer,
                        mimetype: msgType === 'pttMessage' ? 'audio/ogg; codecs=opus' : 'audio/mp4',
                        ptt: msgType === 'pttMessage'
                    };
                }
                else {
                    return reply("❌ Unsupported media type!");
                }
            }
            
            // Add contextInfo matching the pattern from your message
            messageContent.contextInfo = {
                remoteJid: 'status@broadcast',
                participant: myJid,
                quotedType: 'EXPLICIT'
            };
        } 
        else if (caption) {
            messageContent = {
                text: caption,
                contextInfo: {
                    remoteJid: 'status@broadcast',
                    participant: myJid,
                    quotedType: 'EXPLICIT'
                }
            };
        }
        
        // Send as status with proper structure
        await conn.sendMessage(statusJid, messageContent, {
            backgroundColor: "#FF0000",
            font: 0,
            statusJidList: [myJid, myJid], // Twice for self-view
            broadcast: true
        });
        
        await reply("✅ Status uploaded successfully!");
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (error) {
        console.error("Status Upload Error:", error);
        reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
