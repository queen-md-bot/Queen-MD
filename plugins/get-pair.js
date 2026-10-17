const { cmd, commands } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot", "pair2", "pair3"],
    react: "✅",
    desc: "Get pairing code for Queen MD bot",
    category: "main",
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
    // NOTE: purana Heroku pairing backend dead hai (404).
    // Bot ka apna pairing system web page par hai — wahan se code lo.
    return await reply(
`🤖 *Queen MD*

⚠️ *Pairing via command abhi available nahi hai.*

✅ Bot ke web pairing page se apna pairing code hasil karo.

*Power by Queen MD*`
    );
});
