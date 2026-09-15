const config = require('../config');
const { cmd } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    desc: "Show all bot commands",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {

        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number);

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let menuText = `*╭────⬡ ${config.BOT_NAME} ⬡────⭓* 
*├▢ 🤖 Owner:* ${config.OWNER_NUMBER}
*├▢ 📜 Commands:* 250+
*├▢ ⏱️ Runtime:* ${hours}h ${minutes}m ${seconds}s
*├▢ 📡 Baileys:* Multi Device
*├▢ ☁️ Platform:* Heroku
*├▢ 📦 Prefix:* ${config.PREFIX}
*├▢ ⚙️ Mode:* ${config.WORK_TYPE}
*├▢ 🏷️ Version:* 5.0.0 Bᴇᴛᴀ
*╰─────────────────⭓*

*╭────⬡ SETTINGS STATUS ⬡────*
*├▢ 👁️ Auto View:* ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}
*├▢ 📵 Anti Call:* ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}
*├▢ 🎙️ Auto Record:* ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}
*├▢ ⌨️ Auto Typing:* ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}
*├▢ 📖 Auto Read:* ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}
*╰─────────────────⭓*

*╭────⬡ DOWNLOAD MENU ⬡────*
*├▢ facebook*
*├▢ mediafire*
*├▢ tiktok*
*├▢ twitter*
*├▢ insta*
*├▢ apk*
*├▢ img*
*├▢ tt2*
*├▢ pins*
*├▢ apk2*
*├▢ fb2*
*├▢ pinterest*
*├▢ spotify*
*├▢ play*
*├▢ play2*
*├▢ audio*
*├▢ video*
*├▢ video2*
*├▢ ytmp3*
*├▢ ytmp4*
*├▢ song*
*├▢ darama*
*├▢ gdrive*
*├▢ ssweb*
*├▢ tiks*
*╰────────────────*

*╭────⬡ GROUP MENU ⬡────*
*├▢ grouplink*
*├▢ kickall*
*├▢ kickall2*
*├▢ kickall3*
*├▢ add*
*├▢ remove*
*├▢ kick*
*├▢ promote*
*├▢ demote*
*├▢ dismiss*
*├▢ revoke*
*├▢ setgoodbye*
*├▢ setwelcome*
*├▢ delete*
*├▢ getpic*
*├▢ ginfo*
*├▢ disappear on*
*├▢ disappear off*
*├▢ disappear 7D,24H*
*├▢ allreq*
*├▢ updategname*
*├▢ updategdesc*
*├▢ joinrequests*
*├▢ senddm*
*├▢ nikal*
*├▢ mute*
*├▢ unmute*
*├▢ lockgc*
*├▢ unlockgc*
*├▢ invite*
*├▢ tag*
*├▢ hidetag*
*├▢ tagall*
*├▢ tagadmins*
*╰────────────────*

*╭────⬡ SETTING MENU ⬡────*
*├▢ .prefix*  
*├▢ .botname*   
*├▢ .ownername*
*├▢ .botimage*
*├▢ .mode* 
*├▢ .autoreact* 
*├▢ .autoreply*
*├▢ .autosticker*
*├▢ .autotyping*   
*├▢ .autostatusview*  
*├▢ .autostatusreact* 
*├▢ .autostatusreply*  
*├▢ .autorecoding* 
*├▢ .alwaysonline*
*├▢ .welcome*   
*├▢ .goodbye*   
*├▢ .antilink* 
*├▢ .antilinkkick*  
*├▢ .deletelink*
*├▢ .antibad*   
*├▢ .antibot* 
*├▢ .read-message*  
*├▢ .mention-reply*  
*├▢ .admin-action* 
*├▢ .creact*
*├▢ .cemojis* 
*╰────────────────*

*╭────⬡ AUDIO MENU ⬡────*
*├▢ .bass*
*├▢ .slow* 
*├▢ .fast*
*├▢ .reverse*
*├▢ .baby* 
*├▢ .demon*
*├▢ .earrape*  
*├▢ .nightcore*
*├▢ .robot* 
*├▢ .chipmunk* 
*├▢ .radio* 
*├▢ .blown* 
*├▢ .tupai*   
*├▢ .fat* 
*├▢ .smooth*
*├▢ .deep*
*╰────────────────*

*╭────⬡ REACTIONS MENU ⬡────*
*├▢ bully*
*├▢ cuddle*
*├▢ cry*
*├▢ hug*
*├▢ awoo*
*├▢ kiss*
*├▢ lick*
*├▢ pat*
*├▢ smug*
*├▢ bonk*
*├▢ yeet*
*├▢ blush*
*├▢ smile*
*├▢ wave*
*├▢ highfive*
*├▢ handhold*
*├▢ nom*
*├▢ bite*
*├▢ glomp*
*├▢ slap*
*├▢ kill*
*├▢ happy*
*├▢ wink*
*├▢ poke*
*├▢ dance*
*├▢ cringe*
*╰────────────────*

*╭────⬡ LOGO MAKER ⬡────*
*├▢ neonlight*
*├▢ blackpink*
*├▢ dragonball*
*├▢ 3dcomic*
*├▢ america*
*├▢ naruto*
*├▢ sadgirl*
*├▢ clouds*
*├▢ futuristic*
*├▢ 3dpaper*
*├▢ eraser*
*├▢ sunset*
*├▢ leaf*
*├▢ galaxy*
*├▢ sans*
*├▢ boom*
*├▢ hacker*
*├▢ devilwings*
*├▢ nigeria*
*├▢ bulb*
*├▢ angelwings*
*├▢ zodiac*
*├▢ luxury*
*├▢ paint*
*├▢ frozen*
*├▢ castle*
*├▢ tatoo*
*├▢ valorant*
*├▢ bear*
*├▢ typography*
*├▢ birthday*
*╰────────────────*

*╭────⬡ OWNER MENU ⬡────*
*├▢ owner*
*├▢ menu*
*├▢ menu2*
*├▢ vv*
*├▢ listcmd*
*├▢ allmenu*
*├▢ repo*
*├▢ block*
*├▢ unblock*
*├▢ fullpp*
*├▢ setpp*
*├▢ restart*
*├▢ shutdown*
*├▢ updatecmd*
*├▢ alive*
*├▢ ping*
*├▢ gjid*
*├▢ jid*
*╰────────────────*

*╭────⬡ FUN MENU ⬡────*
*├▢ shapar*
*├▢ rate*
*├▢ insult*
*├▢ hack*
*├▢ ship*
*├▢ character*
*├▢ pickup*
*├▢ joke*
*├▢ hrt*
*├▢ hpy*
*├▢ syd*
*├▢ anger*
*├▢ shy*
*├▢ kiss*
*├▢ mon*
*├▢ cunfuzed*
*├▢ hand*
*├▢ nikal*
*├▢ hold*
*├▢ hug*
*├▢ hifi*
*├▢ poke*
*╰────────────────*

*╭────⬡ CONVERT MENU ⬡────*
*├▢ sticker*
*├▢ sticker2*
*├▢ emojimix*
*├▢ fancy*
*├▢ take*
*├▢ tomp3*
*├▢ tts*
*├▢ trt*
*├▢ base64*
*├▢ unbase64*
*├▢ binary*
*├▢ dbinary*
*├▢ tinyurl*
*├▢ urldecode*
*├▢ urlencode*
*├▢ url*
*├▢ repeat*
*├▢ ask*
*├▢ readmore*
*╰────────────────*

*╭────⬡ AI MENU ⬡────*
*├▢ ai*
*├▢ gpt3*
*├▢ gpt2*
*├▢ gptmini*
*├▢ gpt*
*├▢ meta*
*├▢ blackbox*
*├▢ luma*
*├▢ dj*
*├▢ khan*
*├▢ jawad*
*├▢ gpt4*
*├▢ bing*
*├▢ imagine*
*├▢ imagine2*
*├▢ copilot*
*╰────────────────*

*╭────⬡ MAIN MENU ⬡────*
*├▢ ping*
*├▢ ping2*
*├▢ speed*
*├▢ live*
*├▢ alive*
*├▢ runtime*
*├▢ uptime*
*├▢ repo*
*├▢ owner*
*├▢ menu*
*├▢ menu2*
*├▢ restart*
*╰────────────────*

*╭────⬡ ANIME MENU ⬡────*
*├▢ fack*
*├▢ truth*
*├▢ dare*
*├▢ dog*
*├▢ awoo*
*├▢ garl*
*├▢ waifu*
*├▢ neko*
*├▢ megnumin*
*├▢ maid*
*├▢ loli*
*├▢ animegirl*
*├▢ animenews*
*├▢ foxgirl*
*├▢ naruto*
*╰────────────────*

*╭────⬡ OTHER MENU ⬡────*
*├▢ timenow*
*├▢ date*
*├▢ count*
*├▢ calculate*
*├▢ flip*
*├▢ coinflip*
*├▢ rcolor*
*├▢ roll*
*├▢ fact*
*├▢ wikipedia*
*├▢ githubstalk*
*├▢ yts*
*├▢ ytv*
*╰────────────────*

${config.DESCRIPTION}`;

        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH },
            caption: menuText,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("Error: " + e.message);
    }
});
