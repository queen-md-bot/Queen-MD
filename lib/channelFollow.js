/**
 * Queen MD — Auto Follow + Auto React for WhatsApp Channels
 *
 * - Bot start par saare configured channels ko follow karne ki koshish karta hai
 * - Channels ki nayi posts par auto-reaction bhejta hai
 * - Har channel ka result/error/status log karta hai
 *
 * LIMITATIONS (honest):
 * - Follow/react ke liye channel ka newsletter JID chahiye hota hai.
 *   JID invite link se `newsletterMetadata('invite', code)` se resolve hota hai.
 * - Ye sirf tab kaam karega jab bot ka WhatsApp session live aur authenticated ho.
 * - Bina live session ke isay test nahi kiya ja sakta (report mein UNTESTED).
 */

const config = require('../config');

const CHANNELS = [
    { name: 'Main Channel', link: config.CHANNEL_LINK },
    ...(config.ADDITIONAL_CHANNELS || [])
];

// Resolve honay ke baad JIDs yahan store honge (auto-react ke liye)
const resolvedJids = new Map(); // jid -> { name, link }

function extractInviteCode(link) {
    if (!link) return null;
    const m = link.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)/);
    return m ? m[1] : null;
}

async function resolveChannelJid(conn, link) {
    const code = extractInviteCode(link);
    if (!code) throw new Error('Invalid channel link format');
    // Baileys: invite code se newsletter metadata (JID) resolve karo
    const meta = await conn.newsletterMetadata('invite', code);
    if (!meta || !meta.id) throw new Error('Could not resolve channel JID');
    return { jid: meta.id, name: meta.name || '', code };
}

/**
 * Saare channels ko follow karo. Har channel ka result return karta hai.
 */
async function autoFollowChannels(conn) {
    const results = [];
    if (String(config.AUTO_FOLLOW_CHANNELS).toLowerCase() !== 'true') {
        console.log('⏭️ [Channel] Auto-follow disabled');
        return results;
    }
    for (const ch of CHANNELS) {
        const entry = { name: ch.name, link: ch.link, status: 'pending' };
        try {
            if (!ch.link) throw new Error('No link configured');
            const { jid, name } = await resolveChannelJid(conn, ch.link);
            await conn.newsletterFollow(jid);
            resolvedJids.set(jid, { name: ch.name || name, link: ch.link });
            entry.status = 'followed';
            entry.jid = jid;
            console.log(`✅ [Channel] Followed: ${ch.name} (${jid})`);
        } catch (e) {
            entry.status = 'failed';
            entry.error = e.message;
            console.log(`❌ [Channel] Follow failed: ${ch.name} — ${e.message}`);
        }
        results.push(entry);
    }
    return results;
}

/**
 * Newsletter message par auto-react (messages.upsert se call hota hai).
 */
async function autoReactChannelPost(conn, mek) {
    try {
        if (String(config.AUTO_REACT_CHANNELS).toLowerCase() !== 'true') return;
        const remoteJid = mek?.key?.remoteJid;
        if (!remoteJid || !remoteJid.endsWith('@newsletter')) return;
        // Sirf hamare configured channels par react karo
        if (!resolvedJids.has(remoteJid)) return;
        const serverId = mek.newsletterServerId;
        if (!serverId) return;
        const emoji = config.CHANNEL_REACT_EMOJI || '❤️';
        await conn.newsletterReactMessage(remoteJid, serverId.toString(), emoji);
        console.log(`💫 [Channel] Reacted ${emoji} on ${resolvedJids.get(remoteJid).name}`);
    } catch (e) {
        console.log(`⚠️ [Channel] React failed: ${e.message}`);
    }
}

module.exports = {
    CHANNELS,
    resolvedJids,
    autoFollowChannels,
    autoReactChannelPost,
    extractInviteCode
};
