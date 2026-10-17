/**
 * Queen MD — Audio converter utility
 * Converts audio buffers to WhatsApp PTT (voice note) format using ffmpeg.
 */
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

async function toPTT(buffer, ext = 'mp3') {
    const tmpIn = path.join(os.tmpdir(), `conv-in-${Date.now()}.${ext}`);
    const tmpOut = path.join(os.tmpdir(), `conv-out-${Date.now()}.ogg`);
    try {
        fs.writeFileSync(tmpIn, buffer);
        await execFileAsync('ffmpeg', [
            '-y', '-i', tmpIn,
            '-c:a', 'libopus',
            '-b:a', '64k',
            '-ar', '48000',
            tmpOut
        ]);
        return fs.readFileSync(tmpOut);
    } finally {
        try { fs.unlinkSync(tmpIn); } catch (_) {}
        try { fs.unlinkSync(tmpOut); } catch (_) {}
    }
}

module.exports = { toPTT };
