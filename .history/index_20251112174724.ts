import { Telegraf, Markup } from "telegraf";
const bot = new Telegraf("8258750728:AAG18cury7bIaw8F_NZvfD80Gcdw4l577pQ");

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    if (!userId) return;

    // const payload = ctx.startPayload;
    let welcomeMessage = `
     **💫 Welcome to NishuWallet — Your Solana Companion!**

Manage your Solana wallet easily, securely, and instantly.

**Features:**
• 🔑 Create a new wallet in seconds
• 📥 Import existing wallets safely
• 💰 Check SOL & SPL token balances
• 💸 Send tokens instantly
• 📊 Track transaction history in real-time
• 🔒 Securely store and encrypt your private keys

**Security:**
• All private keys are encrypted
• Never share your private keys
• Use at your own risk (testnet recommended)

Choose an option below to get started:`;
    `
})