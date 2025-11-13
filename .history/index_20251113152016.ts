import "dotenv/config"
import { Telegraf, Markup } from "telegraf";
const bot = new Telegraf(process.env.BOT_TOKEN || "");
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, SystemInstruction, SystemProgram, Transaction } from "@solana/web3.js";
import { message } from "telegraf/filters";
import { isValidPrivateKey, isValidPublicKey } from "./validator";

//TODO: use a db insted of in memmory storage
const USER: Record<string, Keypair> = {};

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/lbd-9159msvd8sYL-suzv")

const PENDING_REQUEST: Record<string, {
    type: "SEND_SOL" | "SEND_TOKEN",
    amount?: number,
    to? : string
}> = {}; // key: string , value: object

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
    ...Markup.inlineKeyboard([
      // 2d array
      [
        // this render alone in a single row
        Markup.button.callback("🔑 Generate Wallet", "generate_wallet"), // generate_wallet this is the calback id
      ],
      [
        // these are render together in a single row
        Markup.button.callback("👁️ View Address", "view_address"),
        Markup.button.callback("🔐 Export Private Key", "export_private_key"),
      ],
      [
        Markup.button.callback("💰 Check Balance", "check_balance"),
        Markup.button.callback("📊 Transaction History", "tx_history"),
      ],
      [
        Markup.button.callback("💸 Send SOL", "send_sol_menu"),
        Markup.button.callback("🪙 Send Token", "send_token_menu"),
      ],
    ]),
  });
});

// ctx.reply(message, {object}) this only asspect two argument
bot.action("generate_wallet", async (ctx) => {
  try {
    ctx.answerCbQuery("Generating new wallet...");
    const keypair = Keypair.generate();
    const userId = ctx.from.id
    USER[userId] = keypair; // we need to do a db call for this

    return ctx.reply(
       `💰 **Balance:** 0 SOL (\$0.00)

📥 *Tap to copy the address and deposit SOL.*

⚠️ You need to deposit **1 SOL** for this function to work.

\`${ keypair.publicKey.toBase58() }\`   ← *Tap to copy*`,
      { parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('👁️ View Address', 'view_address'),
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
       },      
    );
  } catch (error) {
    await ctx.answerCbQuery("❌ Failed to generate wallet"); // this shows a popup that is visible only for 2–3 seconds
    return ctx.reply("❌ An error occurred. Please try again."); // this shows its on the screen
  }
});

bot.action("view_address", async (ctx) => {
    try {
    ctx.answerCbQuery("")
    const userId = ctx.from.id
    const keypair = USER[userId]

    if (!keypair) {
        return ctx.reply("❌ You don't have a wallet yet.\nGenerate one first.", {
            parse_mode: "Markdown",
             ...Markup.inlineKeyboard([
                [
                    Markup.button.callback("🔑 Generate Wallet", "generate_wallet")
                ]
            ])
        })
    }

        ctx.reply(`👁️ **Your Wallet Address**

        \`${ keypair.publicKey.toBase58() }\`

        📥 *Tap to copy*

        Use this address to receive SOL & SPL tokens.`, {
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('👁️ View Address', 'view_address'),
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
    } catch(error) {
        await ctx.answerCbQuery("Error while showing address")
        console.error(error);
        return ctx.reply("❌ **Failed to display your address.**\nPlease try again.");
    }
})



bot.action("send_sol_menu", (ctx) => {
    const userId = ctx.from?.id
    ctx.answerCbQuery()
    ctx.reply("can u share the address to send to")
    PENDING_REQUEST[userId] = {
        type: "SEND_SOL"
    }
})


bot.on(message("text"), (ctx) => {
    const userId = ctx.from?.id;
    
    // No pending request in the global variable
    if(!PENDING_REQUEST[userId]) return;

    // Pending SEND_SOL and waiting for recipient address
    if(PENDING_REQUEST[userId].type === "SEND_SOL" && !PENDING_REQUEST[userId].to) {

        if(!isValidPublicKey(ctx.message.text)) {
            return ctx.reply("❌ Invalid public key. Please enter a valid Solana address.")
        }

        PENDING_REQUEST[userId].to = ctx.message.text
        
        return ctx.reply("💰 Great! Now enter the amount in SOL:")
    }

    // waiting for the amount input
    if(PENDING_REQUEST[userId].type === "SEND_SOL" && !PENDING_REQUEST[userId].amount) {
        const amount = Number(ctx.message.text)

        if(isNaN(amount) || amount <= 0) {
            return ctx.reply("❌ Invalid amount. Please enter a valid SOL amount.");
        }

        PENDING_REQUEST[userId].amount = amount

        // asking for the private key
        return ctx.reply("🔐 Now send your private key (Base58):")
    }
    
    // waiting for the user private key
    if(PENDING_REQUEST[userId]?.type === "SEND_SOL" && PENDING_REQUEST[userId].to && PENDING_REQUEST[userId].amount) {
        const PrivateKeyInput = ctx.message.text.trim();
        const keypair = isValidPrivateKey(PrivateKeyInput);

        if(!keypair) {
            return ctx.reply("❌ Invalid private key format. Please send a valid Base58 or JSON array private key.")
        }
    }

    // transection logic

    async function sendSol() {
        try {
            const toPubKey = new PublicKey(PENDING_REQUEST[userId].to);
            const lamports = PENDING_REQUEST[userId].amount * LAMPORTS_PER_SOL;

            const transaction = new Transaction().add(SystemProgram.)
        }
    }

    const signature = await sendAndConfirmTransaction(connection, txn, )
    }

    // return ctx.reply(`Initiated a txn for ${amount} SOL to ${to}`)

    ctx.reply(`Initiated the transaction`)
    delete PENDING_REQUEST[userId]; // delete the panding request from the object.
});



// this is the fuction to start the bot
async function startBot(): Promise<void> {
  try {
    await bot.launch({
      allowedUpdates: ["message", "callback_query"],
    });
  } catch (error) {
    console.error("Failed to start the bot: ", error);
    process.exit(1);
  }
}

// start the bot
startBot();
