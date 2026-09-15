//---------------------------------------------------------------------------
//           KAMRAN-MD - UPSCALE AI (IMGUPSCALER)
//---------------------------------------------------------------------------
//  🚀 ENHANCE IMAGE QUALITY 2X OR 4X USING AI
//---------------------------------------------------------------------------

const { cmd } = require('../inconnuboy');
const axios = require('axios');
const FormData = require('form-data');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const HEADERS = {
    origin: 'https://imgupscaler.com',
    referer: 'https://imgupscaler.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Core Upscale Logic
 */
const upskel = {
    upload: async (buffer, scaleRadio = 2) => {
        if (![2, 4].includes(scaleRadio)) scaleRadio = 2;

        const form = new FormData();
        form.append('myfile', buffer, { filename: `${Date.now()}.jpg`, contentType: 'image/jpeg' });
        form.append('scaleRadio', scaleRadio.toString());

        const res = await axios.post(
            'https://get1.imglarger.com/api/UpscalerNew/UploadNew',
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    ...HEADERS
                }
            }
        );

        const jobId = res.data?.data?.code;
        if (!jobId) throw new Error('Upload failed: Job ID not generated.');

        return upskel.checkStatus(jobId, scaleRadio);
    },
    
    checkStatus: async (jobId, scaleRadio) => {
        const maxRetry = 30; // Max 2.5 minutes

        for (let i = 1; i <= maxRetry; i++) {
            const res = await axios.post(
                'https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew',
                { code: jobId, scaleRadio },
                {
                    headers: {
                        ...HEADERS,
                        accept: 'application/json, text/plain, */*',
                        'content-type': 'application/json'
                    }
                }
            );

            const data = res.data?.data;
            if (data && data.status === 'success') {
                return {
                    url: data.downloadUrls[0],
                    fileName: data.originalfilename,
                    size: data.filesize
                };
            }

            if (data && (data.status === 'failed' || data.status === 'error')) {
                throw new Error('AI processing failed on server.');
            }

            await sleep(5000); // Check every 5 seconds
        }
        throw new Error('Upscale process timed out.');
    }
};

// --- COMMAND: UPSCALE ---

cmd({
    pattern: "hd",
    alias: ["hdr", "enhance", "remini"],
    desc: "Upscale image quality using AI (2x or 4x).",
    category: "ai",
    use: ".upscale 4 (reply to photo)",
    filename: __filename,
}, async (conn, mek, m, { from, text, reply, prefix, command }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';

        if (!/image/.test(mime)) {
            return reply(`📸 Please reply to an *image* with \`${prefix + command} <2|4>\``);
        }

        const scale = text && (text.includes('4')) ? 4 : 2;

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        reply(`_🚀 Upscaling image ${scale}x... this may take up to a minute._`);

        // Download directly from WhatsApp
        const mediaBuffer = await q.download();
        if (!mediaBuffer) throw new Error("Could not download media.");

        // Process through AI
        const result = await upskel.upload(mediaBuffer, scale);

        // Send Result
        await conn.sendMessage(from, {
            image: { url: result.url },
            caption: `✅ *AI UPSCALE COMPLETE*\n\n🔍 *Scale:* ${scale}x\n📦 *Size:* ${(result.size / 1024).toFixed(2)} KB\n\n*🚀 Powered by 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
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

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Upscale Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message || "Failed to process image."}`);
    }
});
