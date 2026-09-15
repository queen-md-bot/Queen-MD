const { cmd, commands } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot", "pair2", "pair3"],
    react: "✅",
    desc: "Get pairing code for KAMRAN-MD bot",
    category: "download",
    use: ".pair 923195068XXX",
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q,
    isGroup,
    senderNumber,
    reply
}) => {
    try {
        // Get phone number
        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        // Validate number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply(
                "❌ Please provide a valid phone number without +\n\nExample:\n.pair 923195068XXX"
            );
        }

        // Your Heroku API
        const response = await axios.get(
            `https://khan-zada-f3a760e88caa.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`
        );

        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;

        await reply(
`🦋⍣⃝🇰ʜᴀɴᴢᴀᴅᴀ 🕊

✅ Pairing Completed

🔑 Your Pair Code:
*${pairingCode}*`
        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        await reply(`🔑 Pair Code: *${pairingCode}*`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting the pairing code.\nPlease try again later.");
    }
});
