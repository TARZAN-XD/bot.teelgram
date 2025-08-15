const { Telegraf, Markup } = require('telegraf');

// ضع التوكن و ID الأدمن هنا
const BOT_TOKEN = "7468967312:AAGeEoeJaD1WarTcLhbRBmbil1kD-Mz3khE";
const OWNER_CHAT_ID = "7210057243";

const OWNER_TG = "t.me/Yemeon";                    
const OWNER_WA = "https://wa.me/+994403668386";    

if (!BOT_TOKEN) {
  console.error("❌ لم يتم ضبط BOT_TOKEN");
  process.exit(1);
}
if (!OWNER_CHAT_ID) {
  console.error("❌ لم يتم ضبط OWNER_CHAT_ID");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const WELCOME_TEXT = `~*مرحباً بك عزيزي المشترك 🚬*~

*اختر الخدمة وانتظر رد المالك💬*
متوفر رشق لجميع التواصل الاجتماعي فيسبوك وتويتر واليوتيوب وتيك توك وانستجرام واتس اب ♋
*رشق تفاعل مسابقات رشق أعضاء رشق استفهام رشق مشاهدات💭*
*متوفر شحن شدات بابجي عبر الأيدي 🆔*
*متوفر شحن شدات فري فاير عبر الأيدي 🆔*
*متوفر فك وحظر ارقام تليجرام واتساب فيسبوك انستجرام تيك توك 📴*
*🤠متوفر تفعيل احتيالي حسابات قنوات تليجرام 👌*
👤︙للشراء :  ${OWNER_TG}
👤︙للتواصل واتس: ${OWNER_WA}
~*📢︙متوفر توثيق فيسبوك بالعلامة السوداء:*~`;

const services = [
  { key: 'rshq', title: 'رشق تفاعل (فيسبوك/تويتر/يوتيوب...)' },
  { key: 'rshq_members', title: 'رشق أعضاء' },
  { key: 'rshq_views', title: 'رشق مشاهدات / مشاهدة' },
  { key: 'pubg', title: 'شحن شدات بابجي' },
  { key: 'freefire', title: 'شحن شدات فري فاير' },
  { key: 'unban', title: 'فك/حظر أرقام (تليجرام/واتساب/...)' },
  { key: 'fraud_activate', title: 'تفعيل احتيالي قنوات تليجرام' },
  { key: 'contact_owner', title: 'التواصل مع المالك' }
];

function servicesKeyboard() {
  const buttons = services.map(s => Markup.button.callback(s.title, `svc_${s.key}`));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
  return Markup.inlineKeyboard(rows);
}

bot.start(async (ctx) => {
  await ctx.replyWithMarkdown(WELCOME_TEXT, servicesKeyboard());
});

bot.command('menu', (ctx) => {
  ctx.replyWithMarkdown(WELCOME_TEXT, servicesKeyboard());
});

bot.action(/svc_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  await ctx.answerCbQuery(); 
  const user = ctx.from;
  const userTag = `@${user.username || 'لا يوجد'}`;
  const userInfo = `طلب جديد من المستخدم:
اسم: ${user.first_name || ''} ${user.last_name || ''}
معرف: ${user.id}
يوزر: ${userTag}
الخدمة: ${key}
وقت: ${new Date().toLocaleString('en-GB')}`;

  switch (key) {
    case 'rshq':
    case 'rshq_members':
    case 'rshq_views':
    case 'pubg':
    case 'freefire':
    case 'unban':
    case 'fraud_activate':
      await ctx.reply(`📌 للتواصل مع المالك:\n👤 ${OWNER_TG}\n📱 ${OWNER_WA}`);
      break;
    case 'contact_owner':
      await ctx.reply(`تواصل مباشرة:\n👤 ${OWNER_TG}\n📱 ${OWNER_WA}`);
      break;
    default:
      await ctx.reply('تم استلام طلبك، سيتواصل معك المالك قريبًا.');
  }

  try {
    await ctx.telegram.sendMessage(OWNER_CHAT_ID, `🔔 طلب خدمة جديد\n\n${userInfo}`);
  } catch (err) {
    console.error('خطأ عند ارسال رسالة للمالك:', err);
  }
});

bot.on('text', async (ctx) => {
  const txt = ctx.message.text.trim();
  const trigger = ['شراء','طلب','مساعدة','دعم','ادفع','الدفع'];
  if (trigger.some(k => txt.toLowerCase().includes(k))) {
    const user = ctx.from;
    const forwardText = `🔔 رسالة من المستخدم:\nاسم: ${user.first_name || ''} ${user.last_name || ''}\nمعرّف: ${user.id}\nيوزر: @${user.username || 'لا يوجد'}\n\nالنص:\n${txt}`;
    await ctx.reply('✅ تم إرسال رسالتك للمالك للمتابعة.');
    await ctx.telegram.sendMessage(OWNER_CHAT_ID, forwardText);
  } else {
    await ctx.reply('هل تريد عرض قائمة الخدمات؟', servicesKeyboard());
  }
});

bot.catch((err) => console.error('Bot error', err));

bot.launch().then(() => console.log('🤖 Bot launched')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
