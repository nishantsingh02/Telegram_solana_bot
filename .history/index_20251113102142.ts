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
Your private keys are encrypted — never shared
• Always keep your keys safe
• Use on testnet for development or testing

Choose an option below to begin 🚀`;

return ctx.reply(welcomeMessage, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([ // 2d array
        [
            // this render alone in a single row
            Markup.button.callback("🔑 Generate Wallet", "generate_wallet") // generate_wallet this is the calback id
        ],
        [
            // these are render together in a single row
            Markup.button.callback("👁️ View Address", "view_address"),
            Markup.button.callback('🔐 Export Private Key', 'export_private_key')
        ], 
        [
            Markup.button.callback('💰 Check Balance', 'check_balance'),
            Markup.button.callback('📊 Transaction History', 'tx_history')
        ],
        [
            Markup.button.callback('💸 Send SOL', 'send_sol_menu'),
            Markup.button.callback('🪙 Send Token', 'send_token_menu')
        ]
    ])
})

bot.action("generate_wallet", (ctx) => {

})

});

async function startBot(): Promise<void> {
        try {
            await bot.launch({
                allowedUpdates: ["message", "callback_query"]
            })
        } catch(error) {
            console.error("Failed to start the bot: ", error);
            process.exit(1);
        }
    }

    // start the bot
    startBot();