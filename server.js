require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();

// ====== الإعدادات ======
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waqdi_earn';
const SESSION_SECRET = process.env.SESSION_SECRET || 'tarzan_waqdi_secret';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI).then(() => console.log('✅ MongoDB connected')).catch(console.error);

// تحميل إعدادات الموقع
const siteConfigPath = path.join(__dirname, 'config', 'site.json');
function loadSiteConfig(){
  try { return JSON.parse(fs.readFileSync(siteConfigPath, 'utf8')); }
  catch(e){ return { brand: 'طرزان الواقدي', accounts: {} }; }
}
app.locals.site = loadSiteConfig();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 أيام
}));

// سكب المتغيرات للواجهات
app.use((req, res, next) => {
  res.locals.site = app.locals.site;
  res.locals.user = req.session.user || null;
  res.locals.baseReward = parseInt(process.env.BASE_REWARD_YER || '2000', 10);
  res.locals.refReward  = parseInt(process.env.REF_REWARD_YER  || '500', 10);
  res.locals.minPayout  = parseInt(process.env.MIN_PAYOUT_YER  || '5000', 10);
  next();
});

// معدل الطلبات للنماذج
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use('/auth', limiter);
app.use('/api', limiter);
app.use('/r', limiter);

// تمرير كود الإحالة من الرابط /r/:code إلى السيشن
app.get('/r/:code', (req, res) => {
  req.session.referCode = req.params.code;
  res.redirect('/referral');
});

// ====== المسارات ======
const authRoutes = require('./src/routes/auth');
const dashRoutes = require('./src/routes/dashboard');
const apiRoutes  = require('./src/routes/api');
const adminRoutes= require('./src/routes/admin');
const refRoutes  = require('./src/routes/referral');

app.use('/', authRoutes);
app.use('/', dashRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/', refRoutes);

// 404
app.use((req, res) => res.status(404).render('404'));

app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
