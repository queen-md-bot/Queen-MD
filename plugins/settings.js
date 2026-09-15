const { cmd } = require('../inconnuboy');
const { getUserConfigFromMongoDB, updateUserConfigInMongoDB } = require('../lib/database');

// Helper to toggle a config key
async function toggleSetting(number, key, action, reply, onText, offText) {
    const userConfig = await getUserConfigFromMongoDB(number);
    const current = userConfig[key] === 'true';

    if (!action || !['on', 'off'].includes(action)) {
        return reply(`Current status: *${current ? 'ON ✅' : 'OFF ❌'}*\nUsage: *.command on/off*`);
    }

    const newVal = action === 'on';
    userConfig[key] = String(newVal);
    await updateUserConfigInMongoDB(number, userConfig);
    reply(newVal ? onText : offText);
}

// ── AUTO VIEW STATUS ──
cmd({
    pattern: 'autoviewstatus',
    alias: ['autoview', 'autostatus'],
    desc: 'Auto view WhatsApp statuses',
    category: 'settings',
    react: '👁️'
}, async (conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('*❌ Owner only command.*');
    const number = sender.split('@')[0];
    await toggleSetting(number, 'AUTO_VIEW_STATUS', args[0],
        reply,
        '*👁️ Auto View Status: ENABLED ✅*\n\nI will now auto-view all statuses.',
        '*👁️ Auto View Status: DISABLED ❌*'
    );
});

// ── ANTI CALL ──
cmd({
    pattern: 'anticall',
    alias: ['antical', 'blockcall'],
    desc: 'Auto reject incoming calls',
    category: 'settings',
    react: '📵'
}, async (conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('*❌ Owner only command.*');
    const number = sender.split('@')[0];
    await toggleSetting(number, 'ANTI_CALL', args[0],
        reply,
        '*📵 Anti Call: ENABLED ✅*\n\nAll incoming calls will be automatically rejected.',
        '*📵 Anti Call: DISABLED ❌*'
    );
});

// ── AUTO RECORDING ──
cmd({
    pattern: 'autorecording',
    alias: ['autorecord', 'recording'],
    desc: 'Show recording presence when receiving messages',
    category: 'settings',
    react: '🎙️'
}, async (conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('*❌ Owner only command.*');
    const number = sender.split('@')[0];
    await toggleSetting(number, 'AUTO_RECORDING', args[0],
        reply,
        '*🎙️ Auto Recording: ENABLED ✅*\n\nI will show "recording..." on every message.',
        '*🎙️ Auto Recording: DISABLED ❌*'
    );
});

// ── AUTO TYPING ──
cmd({
    pattern: 'autotyping',
    alias: ['autotype'],
    desc: 'Show typing presence when receiving messages',
    category: 'settings',
    react: '⌨️'
}, async (conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('*❌ Owner only command.*');
    const number = sender.split('@')[0];
    await toggleSetting(number, 'AUTO_TYPING', args[0],
        reply,
        '*⌨️ Auto Typing: ENABLED ✅*',
        '*⌨️ Auto Typing: DISABLED ❌*'
    );
});

// ── READ MESSAGE ──
cmd({
    pattern: 'readmessage',
    alias: ['autoread', 'bluetick'],
    desc: 'Auto read messages (blue tick)',
    category: 'settings',
    react: '✅'
}, async (conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('*❌ Owner only command.*');
    const number = sender.split('@')[0];
    await toggleSetting(number, 'READ_MESSAGE', args[0],
        reply,
        '*✅ Auto Read (Blue Tick): ENABLED ✅*',
        '*✅ Auto Read (Blue Tick): DISABLED ❌*'
    );
});
