const { cmd } = require('../inconnuboy');
const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const freevideo = {
  api: {
    base: "https://www.freeaivideos.org",
    endpoint: {
      generate: "/api/video_generation",
      request: (id) => `?request_id=${id}&prompt=`
    }
  },
  headers: {
    "user-agent": "NB Android/1.0.0",
    "origin": "https://www.freeaivideos.org",
    "referer": "https://www.freeaivideos.org/",
    "accept": "*/*"
  },

  generate: async ({ prompt, imageBuffer = null } = {}) => {
    let form = new FormData();
    form.append("prompt", prompt || "animate this image");

    if (imageBuffer) {
      form.append("initialFrame", imageBuffer, { 
        filename: "image.jpg", 
        contentType: "image/jpeg" 
      });
    }

    try {
      const res = await axios.post(
        `${freevideo.api.base}${freevideo.api.endpoint.generate}`,
        form,
        { 
          headers: { ...freevideo.headers, ...form.getHeaders() }, 
          timeout: 60000 
        }
      );
      return { success: true, request_id: res.data?.request_id };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  poll: async (requestId, timeoutMs = 10 * 60 * 1000) => {
    const url = `${freevideo.api.base}${freevideo.api.endpoint.generate}${freevideo.api.endpoint.request(requestId)}`;
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const loop = async () => {
        if (Date.now() - startTime >= timeoutMs) {
          return resolve({ success: false, error: "Timeout: Generation took too long" });
        }
        try {
          const res = await axios.get(url, { headers: freevideo.headers });
          if (res.data?.video_url) {
            return resolve({ success: true, data: res.data });
          }
        } catch (err) {}
        setTimeout(loop, 5000);
      };
      loop();
    });
  }
};

cmd({
    pattern: "aivideo",
    alias: ["genvideo", "freevideo"],
    react: "🎬",
    desc: "Generate AI Video from prompt or image",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, quoted }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!text && !mime.includes('image')) {
            return reply(`*❌ Usage Example:*\n\n*.aivideo* a cat walking in rain\n*OR*\nReply to an image with *.aivideo*`);
        }

        let imageBuffer = null;
        if (mime.includes('image')) {
            // Downloading image using Baileys stream
            const messageType = mime.split('/')[0];
            const stream = await downloadContentFromMessage(q.msg || q, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            imageBuffer = buffer;
        }

        const prompt = text || "animate this image";
        reply(`🎬 *🦋⍣⃝🇰ʜᴀɴzada🕊: AI Video Generator*\n\n📝 Prompt: ${prompt}\n⏳ Requesting server... Please wait.`);

        const generateResult = await freevideo.generate({ prompt, imageBuffer });

        if (!generateResult.success || !generateResult.request_id) {
            return reply(`❌ Error: ${generateResult.error || "Failed to get request ID"}`);
        }

        reply(`✅ *Request Accepted!*\n🆔 ID: ${generateResult.request_id}\n⏳ Processing... This takes 2-5 minutes. I will send the video automatically.`);

        const pollResult = await freevideo.poll(generateResult.request_id);

        if (!pollResult.success) {
            return reply(`❌ Error: ${pollResult.error}`);
        }

        const caption = `🎬 *AI Video Generated Successfully!*\n\n📝 *Prompt:* ${prompt}\n\n> © Powered by 🦋⍣⃝🇰ʜᴀɴzada🕊`;

        await conn.sendMessage(from, {
            video: { url: pollResult.data.video_url },
            caption: caption,
            mimetype: 'video/mp4'
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
});
