/**
 * Queen MD — Centralized WhatsApp Channel configuration
 *
 * - MAIN_CHANNEL_LINK: menu mein "View Channel" button isi ka hoga
 * - MAIN_CHANNEL_JID: newsletter forward attribution ke liye (jab resolve ho jaye)
 * - ADDITIONAL_CHANNELS: extra channels ki list
 *
 * Agar JID set nahi hai to newsletter attribution skip hoti hai (fake JID nahi lagate).
 */
const config = require('../config');

const MAIN_CHANNEL_LINK = config.CHANNEL_LINK || '';
const MAIN_CHANNEL_JID = process.env.MAIN_CHANNEL_JID || '';
const ADDITIONAL_CHANNELS = config.ADDITIONAL_CHANNELS || [];

/**
 * Newsletter forward context banata hai — sirf tab jab JID configured ho.
 * Returns: contextInfo object ya empty object.
 */
function getNewsletterContext() {
    if (!MAIN_CHANNEL_JID) return {};
    return {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: MAIN_CHANNEL_JID,
            newsletterName: config.BOT_NAME,
            serverMessageId: 1
        }
    };
}

/**
 * Channel ka tappable preview card (externalAdReply).
 */
function getChannelAdReply(title, body, thumbnailUrl) {
    if (!MAIN_CHANNEL_LINK) return undefined;
    return {
        title: title || '📢 View Channel',
        body: body || config.BOT_NAME,
        thumbnailUrl: thumbnailUrl || config.IMAGE_PATH,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        sourceUrl: MAIN_CHANNEL_LINK
    };
}

module.exports = {
    MAIN_CHANNEL_LINK,
    MAIN_CHANNEL_JID,
    ADDITIONAL_CHANNELS,
    getNewsletterContext,
    getChannelAdReply
};
