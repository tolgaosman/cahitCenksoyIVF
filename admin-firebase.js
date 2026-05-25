import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    addDoc, 
    deleteDoc, 
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRGvbp9E30tE_0-FTr4Oq1DnoteEdwtfI",
    authDomain: "in-vitro-fertilization-154m9k.firebaseapp.com",
    projectId: "in-vitro-fertilization-154m9k",
    storageBucket: "in-vitro-fertilization-154m9k.appspot.com",
    messagingSenderId: "73069645780",
    appId: "1:73069645780:web:6d6f7a21a1d1ac26bd1041"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-link');

let authMode = 'login'; // login, signup, forgot

// Toggles for UI
const titleEl = document.getElementById('auth-title');
const subtitleEl = document.getElementById('auth-subtitle');
const nameGroup = document.getElementById('name-group');
const passwordGroup = document.getElementById('password-group');
const loginBtn = document.getElementById('login-btn');
const toggleForgot = document.getElementById('toggle-forgot');
const toggleSignup = document.getElementById('toggle-signup');
const backToLoginWrap = document.getElementById('back-to-login-wrapper');

function setAuthMode(mode) {
    authMode = mode;
    document.getElementById('login-error').style.display = 'none';
    
    if (mode === 'login') {
        titleEl.innerText = "Yönetim Paneli Girişi";
        subtitleEl.innerText = "Devam etmek için giriş yapın.";
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'block';
        document.getElementById('login-password').required = true;
        loginBtn.innerText = "Giriş Yap";
        toggleForgot.style.display = 'block';
        toggleSignup.style.display = 'block';
        backToLoginWrap.style.display = 'none';
    } else if (mode === 'signup') {
        titleEl.innerText = "Hesap Oluştur";
        subtitleEl.innerText = "Yeni bir yönetici hesabı oluşturun.";
        nameGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        document.getElementById('login-password').required = true;
        loginBtn.innerText = "Kayıt Ol";
        toggleForgot.style.display = 'none';
        toggleSignup.style.display = 'none';
        backToLoginWrap.style.display = 'block';
    } else if (mode === 'forgot') {
        titleEl.innerText = "Şifremi Unuttum";
        subtitleEl.innerText = "E-posta adresinize sıfırlama bağlantısı göndereceğiz.";
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        document.getElementById('login-password').required = false;
        loginBtn.innerText = "Sıfırlama Bağlantısı Gönder";
        toggleForgot.style.display = 'none';
        toggleSignup.style.display = 'none';
        backToLoginWrap.style.display = 'block';
    }
}

toggleForgot.addEventListener('click', (e) => { e.preventDefault(); setAuthMode('forgot'); });
toggleSignup.addEventListener('click', (e) => { e.preventDefault(); setAuthMode('signup'); });
document.getElementById('toggle-login').addEventListener('click', (e) => { e.preventDefault(); setAuthMode('login'); });

// AUTHENTICATION STATE OBSERVER
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Özel kullanıcı adı güncellemesi
        if (user.email === 'tolman2002@gmail.com' && user.displayName !== 'Tolga Osman Falay') {
            try {
                await updateProfile(user, { displayName: "Tolga Osman Falay" });
            } catch(e) {}
        }
        
        // Logged in
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'flex';
        const displayName = user.displayName || user.email.split('@')[0];
        document.getElementById('admin-email-display').innerHTML = `<i class="fa-solid fa-user"></i> ${displayName}`;
        
        // Load initial data
        loadSiteInfo();
        loadTeam();
        loadFaqs();
        loadBlog();
    } else {
        // Not logged in
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
    }
});

// AUTH SUBMIT LOGIC
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const name = document.getElementById('login-name').value;
    const errorText = document.getElementById('login-error');
    
    errorText.style.display = 'none';
    loginBtn.disabled = true;
    
    try {
        if (authMode === 'login') {
            loginBtn.innerText = "Giriş Yapılıyor...";
            await signInWithEmailAndPassword(auth, email, password);
            window.showToast("Başarıyla giriş yapıldı.");
        } else if (authMode === 'signup') {
            loginBtn.innerText = "Hesap Oluşturuluyor...";
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(userCredential.user, { displayName: name });
            }
            window.showToast("Hesap başarıyla oluşturuldu.");
            setAuthMode('login');
        } else if (authMode === 'forgot') {
            loginBtn.innerText = "Gönderiliyor...";
            await sendPasswordResetEmail(auth, email);
            window.showToast("Şifre sıfırlama bağlantısı e-postanıza gönderildi!");
            setAuthMode('login');
        }
    } catch (error) {
        if (authMode === 'forgot') {
            errorText.innerText = "Bu e-postaya ait hesap bulunamadı.";
        } else if (authMode === 'signup') {
            errorText.innerText = "Kayıt başarısız. Şifre çok kısa veya e-posta kullanımda olabilir.";
        } else {
            errorText.innerText = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
        }
        errorText.style.display = 'block';
    } finally {
        if (authMode === 'login') loginBtn.innerText = "Giriş Yap";
        if (authMode === 'signup') loginBtn.innerText = "Kayıt Ol";
        if (authMode === 'forgot') loginBtn.innerText = "Sıfırlama Bağlantısı Gönder";
        loginBtn.disabled = false;
    }
});

// LOGOUT LOGIC
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.showToast("Çıkış yapıldı.");
    }).catch((error) => {
        window.showToast("Çıkış yapılırken bir hata oluştu.", true);
    });
});

// ---------------------------------------------------------
// IMAGE UPLOAD HELPER
// ---------------------------------------------------------
async function uploadImage(file, folderName) {
    if (!file) return null;
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, `${folderName}/${fileName}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

// ---------------------------------------------------------
// 1. SITE INFO MODULE
// ---------------------------------------------------------
async function loadSiteInfo() {
    try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('site-phone1').value = data.phone1 || "";
            document.getElementById('site-phone2').value = data.phone2 || "";
            document.getElementById('site-email1').value = data.email1 || "";
            document.getElementById('site-email2').value = data.email2 || "";
            document.getElementById('site-address').value = data.address || "";
            document.getElementById('site-instagram').value = data.instagram || "";
            document.getElementById('site-facebook').value = data.facebook || "";
        }
    } catch(e) {
        console.error("Site ayarları yüklenemedi", e);
    }
}

document.getElementById('save-site-info').addEventListener('click', async () => {
    const btn = document.getElementById('save-site-info');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Kaydediliyor...`;
    btn.disabled = true;

    const data = {
        phone1: document.getElementById('site-phone1').value,
        phone2: document.getElementById('site-phone2').value,
        email1: document.getElementById('site-email1').value,
        email2: document.getElementById('site-email2').value,
        address: document.getElementById('site-address').value,
        instagram: document.getElementById('site-instagram').value,
        facebook: document.getElementById('site-facebook').value
    };

    try {
        await setDoc(doc(db, "settings", "general"), data);
        window.showToast("Site bilgileri başarıyla kaydedildi.");
    } catch(e) {
        window.showToast("Kaydedilirken bir hata oluştu.", true);
        console.error(e);
    } finally {
        btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet`;
        btn.disabled = false;
    }
});

// ---------------------------------------------------------
// 2. TEAM MODULE
// ---------------------------------------------------------
async function loadTeam() {
    try {
        const q = query(collection(db, "team"), orderBy("sortOrder", "asc"));
        const querySnapshot = await getDocs(q);
        const tbody = document.getElementById('team-table-body');
        tbody.innerHTML = '';
        
        if(querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Henüz ekip üyesi eklenmemiş.</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tbody.innerHTML += `
                <tr>
                    <td><img src="${data.imageUrl || 'cahit.jpg'}" width="50" style="border-radius:5px; height:50px; object-fit:cover;"></td>
                    <td>${data.name}</td>
                    <td>${data.role}</td>
                    <td class="actions-col">
                        <button class="btn btn-sm" onclick="editTeam('${doc.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTeam('${doc.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Ekip yüklenemedi", e);
    }
}

// Attach to window so HTML inline onclick can access it
window.editTeam = async (id) => {
    try {
        const docRef = doc(db, "team", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('team-id').value = id;
            document.getElementById('team-name').value = data.name || "";
            document.getElementById('team-role').value = data.role || "";
            document.getElementById('team-sort').value = data.sortOrder || 10;
            
            const fileDisplay = document.getElementById('file-name-display');
            if (fileDisplay) {
                fileDisplay.innerText = data.imageUrl ? "Sistemde görsel yüklü (Değiştirmek için tıklayın)" : "Görsel seçmek için tıklayın veya sürükleyin";
            }
            
            // Yeni Detay Alanları
            document.getElementById('team-lang').value = data.lang || "";
            document.getElementById('team-bachelors').value = data.bachelors || "";
            document.getElementById('team-masters').value = data.masters || "";
            document.getElementById('team-thesis').value = data.thesis || "";
            document.getElementById('team-experience').value = data.experience || "";
            document.getElementById('team-expertise').value = data.expertise || "";
            document.getElementById('team-certificate').value = data.certificate || "";
            document.getElementById('team-bio').value = data.bio || "";
            
            document.getElementById('modal-team-title').innerText = "Ekip Üyesini Düzenle";
            window.openModal('modal-team');
        }
    } catch(e) {
        console.error(e);
    }
};

window.deleteTeam = async (id) => {
    if(confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "team", id));
            window.showToast("Ekip üyesi silindi.");
            loadTeam();
        } catch(e) {
            window.showToast("Silinirken hata oluştu.", true);
            console.error(e);
        }
    }
};

document.getElementById('form-team').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-team-save');
    btn.innerText = "Kaydediliyor...";
    btn.disabled = true;
    
    const id = document.getElementById('team-id').value;
    const file = document.getElementById('team-image').files[0];
    
    try {
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadImage(file, 'team');
        }
        
        const data = {
            name: document.getElementById('team-name').value,
            role: document.getElementById('team-role').value,
            sortOrder: parseInt(document.getElementById('team-sort').value) || 10,
            lang: document.getElementById('team-lang').value,
            bachelors: document.getElementById('team-bachelors').value,
            masters: document.getElementById('team-masters').value,
            thesis: document.getElementById('team-thesis').value,
            experience: document.getElementById('team-experience').value,
            expertise: document.getElementById('team-expertise').value,
            certificate: document.getElementById('team-certificate').value,
            bio: document.getElementById('team-bio').value
        };
        
        // Sadece yeni görsel yüklendiyse güncelle, yoksa eskisini koru
        if (id) {
            if(imageUrl) data.imageUrl = imageUrl;
            await setDoc(doc(db, "team", id), data, { merge: true });
            window.showToast("Ekip üyesi güncellendi.");
        } else {
            data.imageUrl = imageUrl || ""; // Yeni ekleme
            await addDoc(collection(db, "team"), data);
            window.showToast("Yeni ekip üyesi eklendi.");
        }
        
        window.closeModal('modal-team');
        loadTeam();
    } catch (e) {
        window.showToast("Kaydedilirken hata oluştu.", true);
        console.error(e);
    } finally {
        btn.innerText = "Kaydet";
        btn.disabled = false;
    }
});

// ---------------------------------------------------------
// 3. FAQ MODULE
// ---------------------------------------------------------
async function loadFaqs() {
    try {
        const q = query(collection(db, "faqs"), orderBy("sortOrder", "asc"));
        const querySnapshot = await getDocs(q);
        const tbody = document.getElementById('faq-table-body');
        tbody.innerHTML = '';
        
        if(querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Henüz soru eklenmemiş.</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tbody.innerHTML += `
                <tr>
                    <td><strong>${data.question}</strong><br><small style="color:#666">${data.answer.substring(0, 50)}...</small></td>
                    <td>${data.sortOrder}</td>
                    <td class="actions-col">
                        <button class="btn btn-sm" onclick="editFaq('${doc.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFaq('${doc.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("SSS yüklenemedi", e);
    }
}

window.editFaq = async (id) => {
    try {
        const docRef = doc(db, "faqs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('faq-id').value = id;
            document.getElementById('faq-question').value = data.question || "";
            document.getElementById('faq-answer').value = data.answer || "";
            document.getElementById('faq-sort').value = data.sortOrder || 10;
            
            document.getElementById('modal-faq-title').innerText = "Soruyu Düzenle";
            window.openModal('modal-faq');
        }
    } catch(e) {
        console.error(e);
    }
};

window.deleteFaq = async (id) => {
    if(confirm("Bu soruyu silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "faqs", id));
            window.showToast("Soru silindi.");
            loadFaqs();
        } catch(e) {
            window.showToast("Silinirken hata oluştu.", true);
            console.error(e);
        }
    }
};

document.getElementById('form-faq').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-faq-save');
    btn.innerText = "Kaydediliyor...";
    btn.disabled = true;
    
    const id = document.getElementById('faq-id').value;
    
    const data = {
        question: document.getElementById('faq-question').value,
        answer: document.getElementById('faq-answer').value,
        sortOrder: parseInt(document.getElementById('faq-sort').value) || 10,
    };
    
    try {
        if (id) {
            await setDoc(doc(db, "faqs", id), data, { merge: true });
            window.showToast("Soru güncellendi.");
        } else {
            await addDoc(collection(db, "faqs"), data);
            window.showToast("Yeni soru eklendi.");
        }
        
        window.closeModal('modal-faq');
        loadFaqs();
    } catch (e) {
        window.showToast("Kaydedilirken hata oluştu.", true);
        console.error(e);
    } finally {
        btn.innerText = "Kaydet";
        btn.disabled = false;
    }
});

// ---------------------------------------------------------
// 4. BLOG MODULE
// ---------------------------------------------------------
async function loadBlog() {
    try {
        const q = query(collection(db, "blog"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const tbody = document.getElementById('blog-table-body');
        tbody.innerHTML = '';
        
        if(querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Henüz blog yazısı eklenmemiş.</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const statusBadge = data.status === 'published' 
                ? '<span style="background:#2ecc71; color:white; padding:3px 8px; border-radius:4px; font-size:0.8rem;">Yayında</span>'
                : '<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:0.8rem;">Taslak</span>';
                
            tbody.innerHTML += `
                <tr>
                    <td>${data.date}</td>
                    <td><strong>${data.title}</strong></td>
                    <td>${statusBadge}</td>
                    <td class="actions-col">
                        <button class="btn btn-sm" onclick="editBlog('${doc.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBlog('${doc.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Blog yüklenemedi", e);
    }
}

window.editBlog = async (id) => {
    try {
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('blog-id').value = id;
            document.getElementById('blog-title').value = data.title || "";
            document.getElementById('blog-summary').value = data.summary || "";
            document.getElementById('blog-content').value = data.content || "";
            document.getElementById('blog-status').value = data.status || "published";
            document.getElementById('blog-date').value = data.date || new Date().toISOString().split('T')[0];
            document.getElementById('blog-current-image').innerText = data.imageUrl ? "Yüklü Kapak Var" : "Yok";
            
            document.getElementById('modal-blog-title').innerText = "Blog Yazısını Düzenle";
            window.openModal('modal-blog');
        }
    } catch(e) {
        console.error(e);
    }
};

window.deleteBlog = async (id) => {
    if(confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "blog", id));
            window.showToast("Blog yazısı silindi.");
            loadBlog();
        } catch(e) {
            window.showToast("Silinirken hata oluştu.", true);
            console.error(e);
        }
    }
};

document.getElementById('form-blog').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-blog-save');
    btn.innerText = "Kaydediliyor...";
    btn.disabled = true;
    
    const id = document.getElementById('blog-id').value;
    const file = document.getElementById('blog-image').files[0];
    
    try {
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadImage(file, 'blog');
        }
        
        // Basit slug üretimi (URL dostu başlık)
        const title = document.getElementById('blog-title').value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        const data = {
            title: title,
            slug: slug,
            summary: document.getElementById('blog-summary').value,
            content: document.getElementById('blog-content').value,
            status: document.getElementById('blog-status').value,
            date: document.getElementById('blog-date').value,
            author: "Dr. Cahit Cenksoy" // Varsayılan yazar
        };
        
        if (id) {
            if(imageUrl) data.imageUrl = imageUrl;
            await setDoc(doc(db, "blog", id), data, { merge: true });
            window.showToast("Blog yazısı güncellendi.");
        } else {
            data.imageUrl = imageUrl || "";
            await addDoc(collection(db, "blog"), data);
            window.showToast("Yeni blog yazısı eklendi.");
        }
        
        window.closeModal('modal-blog');
        loadBlog();
    } catch (e) {
        window.showToast("Kaydedilirken hata oluştu.", true);
        console.error(e);
    } finally {
        btn.innerText = "Kaydet";
        btn.disabled = false;
    }
});

// Set default date for new blog
document.getElementById('blog-date').value = new Date().toISOString().split('T')[0];
