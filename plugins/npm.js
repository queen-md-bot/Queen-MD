const { cmd } = require('../inconnuboy');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "dlnpm",
    desc: "Download npm package as tgz file",
    category: "downloader",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) {
            return reply(
                "❌ *Package name do*\n\nExample:\n.npmdownload axios"
            );
        }

        const pkg = q.toLowerCase();
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        // 1️⃣ Get package info from npm registry
        const infoUrl = `https://registry.npmjs.org/${pkg}`;
        const infoRes = await axios.get(infoUrl).catch(() => null);

        if (!infoRes || !infoRes.data) {
            await react("❌");
            return reply("❌ Package NPM registry par nahi mila");
        }

        const data = infoRes.data;
        const latest = data['dist-tags'].latest;
        const tarballUrl = data.versions[latest].dist.tarball;

        const fileName = `${pkg}-${latest}.tgz`;
        const filePath = path.join(tempDir, fileName);

        // 2️⃣ Download tarball
        const tarballRes = await axios.get(tarballUrl, {
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(filePath, tarballRes.data);

        // 3️⃣ Send file
        await conn.sendMessage(
            from,
            {
                document: fs.readFileSync(filePath),
                mimetype: 'application/gzip',
                fileName: fileName,
                caption:
`📦 *NPM Package Downloaded*

• *Name:* ${pkg}
• *Version:* ${latest}
• *Format:* .tgz

Powered By *🦋⍣⃝🇰ʜᴀɴzada🕊* 🤖`
            },
            { quoted: mek }
        );

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("NPM Download Error:", err);
        await react("❌");
        reply("❌ NPM package download failed");
    }
});
