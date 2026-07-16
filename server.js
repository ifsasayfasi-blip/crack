const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Basit Admin Şifresi
const ADMIN_PASSWORD = "sevemezsiniz"; 

// Oyun verilerini tutan dizi
let oyunlar = [{ isim: "Örnek Oyun", link: "#" }];

// Admin Yetkilendirme Kontrolü
function adminAuth(req, res, next) {
    if (req.cookies.admin === 'true') next();
    else res.redirect('/login');
}

// Ana Sayfa (Kullanıcı Tarafı)
app.get('/', (req, res) => {
    let html = '<h1>Oyun Listesi</h1>';
    oyunlar.forEach(oyun => {
        html += `
            <div style="border:1px solid #ccc; padding:10px; margin:5px;">
                <h3>${oyun.isim}</h3>
                <button onclick="gizliIndir('${oyun.link}')">Hemen İndir</button>
            </div>`;
    });
    html += `
        <script>
            function gizliIndir(url) {
                const a = document.createElement('a');
                a.href = url;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        </script>`;
    res.send(html);
});

// Giriş Sayfası
app.get('/login', (req, res) => {
    res.send('<form method="POST">Şifre: <input name="pass" type="password"><button>Giriş</button></form>');
});

app.post('/login', (req, res) => {
    if (req.body.pass === ADMIN_PASSWORD) {
        res.cookie('admin', 'true');
        res.redirect('/admin');
    } else res.send('Hatalı Şifre!');
});

// Admin Paneli
app.get('/admin', adminAuth, (req, res) => {
    res.send(`
        <h1>Admin Paneli</h1>
        <form action="/admin/ekle" method="POST">
            <input name="isim" placeholder="Oyun İsmi" required>
            <input name="link" placeholder="İndirme Linki" required>
            <button type="submit">Ekle</button>
        </form>
        <br><a href="/">Ana Sayfaya Dön</a>
    `);
});

app.post('/admin/ekle', adminAuth, (req, res) => {
    oyunlar.push({ isim: req.body.isim, link: req.body.link });
    res.redirect('/admin');
});

app.listen(3000, () => console.log('Sunucu http://localhost:3000 üzerinde çalışıyor.'));
