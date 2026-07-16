const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Basit Admin Şifresi (Render ortamında bunu "Environment Variables" ile yapmalısınız)
const ADMIN_PASSWORD = "sevemezsiniz"; 

// Oyunları tutan geçici bellek (Gerçek projede burayı veritabanına bağlayın)
let oyunlar = [];

// Middleware: Admin kontrolü
function adminAuth(req, res, next) {
    if (req.cookies.admin === 'true') next();
    else res.redirect('/login');
}

app.get('/', (req, res) => res.render('index', { oyunlar }));

app.get('/login', (req, res) => res.send('<form method="POST">Şifre: <input name="pass" type="password"><button>Giriş</button></form>'));

app.post('/login', (req, res) => {
    if (req.body.pass === ADMIN_PASSWORD) {
        res.cookie('admin', 'true');
        res.redirect('/admin');
    } else res.send('Hatalı Şifre!');
});

app.get('/admin', adminAuth, (req, res) => res.render('admin', { oyunlar }));

app.post('/admin/ekle', adminAuth, (req, res) => {
    oyunlar.push({ isim: req.body.isim, link: req.body.link });
    res.redirect('/admin');
});

app.listen(3000, () => console.log('Site çalışıyor: http://localhost:3000'));
