const { cmd } = require('../inconnuboy');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

cmd({
    pattern: "sticker",
    alias: ["s", "stik"],
    react: "🎨",
    category: "convert",
    desc: "Convert image/video to sticker",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Quoted message ya direct message se media nikalna
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';

        if (!/image|video/.test(mime)) return reply("⚠️ Please reply to an *image* or *video*!");

        reply("⏳ *Sticker Ban Raha Hai...*");

        // Media type determine karna (image ya video)
        const type = mime.split('/')[0];
        const mediaMsg = m.quoted ? m.quoted.message[type + 'Message'] : m.message[type + 'Message'];

        // Media download karna (Wahi 'vv' wala stream logic)
        const stream = await downloadContentFromMessage(mediaMsg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Temporary files ke raste
        const inputPath = `./temp_media_${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
        const outputPath = `./temp_sticker_${Date.now()}.webp`;

        fs.writeFileSync(inputPath, buffer);

        // FFmpeg command jo sticker ko sahi size (512x512) aur format mein badal dega
        const ffmpegCmd = `ffmpeg -i ${inputPath} -vcodec libwebp -filter:v "scale='if(gt(a,1),512,-1)':'if(gt(a,1),-1,512)',fps=15,pad=512:512:(512-iw)/2:(512-ih)/2:color=0x00000000" -loop 0 -preset default -an -vsync 0 -s 512:512 ${outputPath}`;

        exec(ffmpegCmd, async (err) => {
            // Kaam hone ke baad input file delete karein
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

            if (err) {
                console.log(err);
                return reply("❌ Conversion Failed!");
            }

            // Sticker bhejna
            await conn.sendMessage(from, { 
                sticker: fs.readFileSync(outputPath) 
            }, { quoted: mek });

            // Output file delete karein
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});
