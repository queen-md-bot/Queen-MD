const { cmd } = require('../inconnuboy');

// ── KICK ALL ──
cmd({
    pattern: 'kickall2',
    desc: 'Kick all members from the group (except admins)',
    category: 'group',
    react: '🦵'
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, participants, groupAdmins, reply }) => {
    try {
        if (!isGroup) return reply('*❌ Group only command.*');
        if (!isOwner && !isAdmins) return reply('*❌ Only admins can use kickall.*');
        if (!isBotAdmins) return reply('*❌ I need to be an admin to kick members.*');

        const members = participants.filter(p => !groupAdmins.includes(p.id));
        if (!members.length) return reply('*❌ No regular members to kick.*');

        await reply(`*🦵 Kicking ${members.length} members...*`);

        for (const member of members) {
            try {
                await conn.groupParticipantsUpdate(from, [member.id], 'remove');
                await new Promise(r => setTimeout(r, 500));
            } catch (_) {}
        }

        await reply(`*✅ Done! Kicked ${members.length} members.*`);
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});

// ── TAG ALL ──
cmd({
    pattern: 'tagall',
    alias: ['mentionall'],
    desc: 'Tag all group members',
    category: 'group',
    react: '📢'
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, participants, args, reply }) => {
    try {
        if (!isGroup) return reply('*❌ Group only command.*');
        if (!isOwner && !isAdmins) return reply('*❌ Only admins can tag all.*');

        const text = args.join(' ') || '📢 Attention everyone!';
        const mentions = participants.map(p => p.id);
        const mentionText = mentions.map(m => `@${m.split('@')[0]}`).join(' ');

        await conn.sendMessage(from, {
            text: `*${text}*\n\n${mentionText}`,
            mentions
        }, { quoted: mek });
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
