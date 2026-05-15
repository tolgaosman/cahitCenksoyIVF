const faqData = {
    tr: [
        { q: "Tüp bebek nedir?", a: "Farklı nedenler ile kısırlık sorunu yaşayan çiftlerin gebe kalmaları için uygulanan en etkili tedavidir. Bu tedavide yumurta ile sperm laboratuar ortamında bir araya getirilir ve oluşturulan embriyo/lar anne rahmine yerleştirilir." },
        { q: "Tüp bebek tedavisinin aşamaları nelerdir?", a: "Tedavi öncesi çiftin ve test sonuçlarının değerlendirilmesi ile başlar. Sonraki adımlar sırasıyla yumurtaların büyütülmesi, yumurta toplama ve embriyo transferidir. Yumurtaların toplanmasından sonra laboratuarda yumurtaların döllenmesi, gerekli ise PGD veya NGS gibi genetik tanılar haricinde embriyoların takibi yapılır." },
        { q: "Tüp bebek doğumsal anomali şansını artırır mı?", a: "Tüp bebek ile oluşturulan gebeliklerde genetik anomali ihtimali artmaktadır. Bunun nedeni tüp bebek tedavisinin ileri yaştaki kadınlara daha sık uygulanıyor olmasıdır. Tüp bebek yapılırken genetik tanı testleri ile bu anomali ihtimalleri azaltılır." },
        { q: "Tüp bebek tedavisi öncesinde hangi testler istenmelidir?", a: "Kısırlık tanısı konmuş olan veya özel bir durum sebebi ile (genetik hastalıklar- tekrarlayan düşükler- cinsiyet belirleme) tüp bebek tedavisi planlanan çifte: Rahim filmi, kadın ve erkeğe ait kan testleri ve spermiyogram testleri yapılır. Gerekli görülür ise karyotip (genetik analiz) ve sperm DNA hasarı dâhil birçok özel test yapılabilir." },
        { q: "Yumurtalık (over) rezervi nedir?", a: "Bir kadının yumurtalıklarında kalan yumurta miktarıdır." },
        { q: "Yumurtalık (over) rezervi nasıl ölçülür?", a: "Güncel bilgilerimiz ile over rezervini değerlendirirken kanda AMH (anti müllerian hormon ) testi ve ultrason ile yumurtalıklardaki antral foliküllerin sayısına bakıyoruz. Adetin 2. veya 3. günü FSH ve Östrojen hormon düzeyleri tutarsız olduğundan artık birincil gösterge olarak kullanılmazlar." },
        { q: "Aşılama yöntemi (gebelik aşısı) nedir?", a: "Aşılama yöntemi kadının yumurtalıklarının uyarılarak, yumurtlamanın tetiklenmesi bununla uygun zamanlı olarak erkek sperminin yıkama işleminden geçirilerek rahim içine bir kanül yardımı ile ulaştırılmasıdır. Aşılama ilkel bir yöntem olup başarı şansı tüp bebek tedavisine göre oldukça düşüktür. Maliyeti ve tedavinin yaratacağı stres tüp bebek tedavisinden daha az olacağı için seçilmiş vakalarda uygulanabilir." },
        { q: "Ovülasyon indüksiyonu nedir?", a: "Üreme çağındaki bir kadının yumurtalıklarında her ay ortalama 10-20 adet yumurta büyüme eğilimindedir. Bunların arasından bir tanesi (dominant folikül) diğerlerinin büyümesini engeller ve kendisi ovülasyon (yumurtlama ) ile tüpün olduğu bölgeye atılır. Üremeye yardımcı tedavilerde (aşılama , tüp bebek vs.. ) mümkün olan en fazla yumurta toplanması için dışarıdan hormon veya hormon üretimini artıran ilaç tedavisi verilir. Bu sayede bir siklusta (aylık döngüde) büyümesi mümkün olan tüm foliküller (yumurta içeren sıvı kesecikleri) uyarılmış olur. Bu foliküller belli bir boyuta ulaştığı zaman ( ortalama 18 mm ) yumurtaların olgunlaşmasını sağlayan hormon ilaçları uygulanır. Buna ovülasyon indüksiyonu adı verilir." },
        { q: "ICSI (mikroenjeksiyon) IVF (tüp bebek ) ‘in klasik IVF ‘ten farkı nedir?", a: "Klasik tüp bebek tedavisinde yumurta sağlıklı spermlerin olduğu bir kaba yerleştirilir. Spermlerden bir tanesi yumurta zarını delerek dölleme işlemini kendisi başlatır. ICSI’de ise sperm ince bir kanül yardımı ile alınarak yumurta içine yerleştirilir. Bu sayede spermin yumurta içine girmesi şansa bırakılmamış olur. ICSI yönteminde yumurta dölleme oranı daha yüksektir." },
        { q: "Tüp bebek tedavisinden önce aşılama yapılması gerekli midir?", a: "Aşılama tedavisinin başarıya ulaşması için uygun koşullar gerekir. Sperm sayısı normal olan bir erkek ve düzenli yumurtlaması olan bir kadının cinsel ilişkiye girme sıklığında da sorun yoksa aşılamadan fayda görme şansı oldukça azdır. Seçilmiş hasta grubunda fayda sağlasa da aşılama yöntemi her tüp bebek tedavisinden önce uygulanmaz." },
        { q: "Tüplerin kapalı olması mutlaka tüp bebek tedavisini gerektirir mi?", a: "Tüpler tıkalı ise bir hasara bağlı tıkalı olduğu düşünülür. Operasyon ile tüpler açılmaya çalışılsa bile tüpteki hasar tamir edilemez. Her iki tüpün tıkalı olması tüp bebek tedavisinin yapılmasını gerektirir." },
        { q: "Tek tüpün tıkalı olması gebelik şansını azaltır mı?", a: "Tek tüpün açık olması gebelik şansını önemli ölçüde azaltmaz." },
        { q: "Kadın faktör kısırlığın en sık sebepleri nelerdir?", a: "Kadına bağlı en sık kısırlık sebebi yumurtlamadaki problemlerdir (polikistik over sendromu gibi.) . Daha sonra azalmış yumurtalık rezervi, tüpleri tutan hastalıklar, vajinismus, endometriozis gibi nedenler sayılabilir." },
        { q: "Erkek faktör kısırlığın tedavisi her zaman tüp bebek tedavisi midir?", a: "Sperm sayılarındaki sorun hormon üretimindeki yetersizliğe bağlı ise baba adayı ilaç tedavilerinden fayda görebilir." },
        { q: "Tüp bebek tedavisi en fazla kaç kez tekrarlanabilir?", a: "Tüp bebek tedavilerinin kesin bir üst sınırı yoktur fakat 7-8 denemeden fazlası pek önerilmez. Bunun nedeni gebelik şansının az olmasıdır. Her tedavi çifti maddi ve manevi yıkıma uğratmaktadır. Sorunun sperm veya yumurta kaynaklı olduğu biliniyor ise donasyon tedavisi önerilebilir. Kıbrıs’ta donasyon tedavileri yasal olarak uygulanmaktadır." },
        { q: "Kıbrıs’ta tüp bebek tedavileri neden farklıdır?", a: "Kıbrıs’ın kuzeyindeki tüp bebek yönetmeliği dünyanın birçok ülkesinin aksine yumurta, sperm ve embriyo bağışına izin vermektedir." },
        { q: "Donasyon nedir?", a: "Kendi üreme hücreleri ile gebelik elde etmesi mümkün olmayan çiftlerin bağış yoluyla başka bireylerden yumurta, sperm veya her ikisini de almalarıdır." },
        { q: "IMSI (intrastoplazmik morfoloji bakımından seçilmiş sperm enjeksiyonu ) nedir?", a: "Imsi yöntemi tüp bebek tedavisinde, bir sperm seçme yöntemidir. Özellikle ağır erkek faktörü (sperm sayımı oldukça düşük, hareketlilik az ve yapısal olarak kötü durumda ise) olan durumlarda yumurta içine yerleştirilecek olan spermin dikkatle seçilmesi gerekir. Normal bir sperm seçme yönteminde 400 kez büyütme altında sperm seçilirken IMSI yönteminde büyütme 6000-10000 arasında büyütme yapılır. Bu sayede spermin çekirdeği de değerlendirilebilir. Kıbrıs’ta tüp bebek tedavisinde kendi laboratuarımızda bu yöntemi standart olarak uygulamaktayız." },
        { q: "Sperm donasyonu (bağışı) nedir?", a: "Sperm bağışı tescilli uluslararası bir sperm bankasından tüp bebek işleminde kullanılmak üzere alınır. Kadın yumurtaları alınan spermler ile döllenir ve anne rahmine transfer edilir." },
        { q: "Sperm donasyonu için nereye başvuru yapılır?", a: "Sperm donasyonu için bu konuda yetkili bir tüp bebek merkezine başvurulur. Tüp bebek merkezi sizin için dünya üzerindeki herhangi bir sperm bankasından sperm talebi yapabilir." },
        { q: "Tüp bebek tedavisi hangi mevsimde yapılmalıdır?", a: "Tüp bebek başarı oranları mevsimlerden etkilenmez. Bu nedenle her mevsim yapılabilir." },
        { q: "Kıbrıs’ta yapılan tüp bebek tedavileri dünyada farklı ülkelerde de yapılır mı?", a: "Yumurta bağışı gibi tedaviler dünyada belli başlı az sayıda ülkede yapılıyor olmasına rağmen fiyat, başarı, ulaşım, güvenlik ve bekleme süresini düşündüğümüzde en doğru tercih olarak Kıbrıs olarak karşımıza çıkmaktadır." },
        { q: "Mikroenjeksiyon yöntemi (ICSI ) nedir?", a: "Tüp bebek tedavisi sırasında spermin mikroskopik bir kanül yardımı ile yumurta içine enjekte edildiği bir yöntemdir. Kıbrıs’ta tüp bebek tedavisi sırasında kliniğimizde standart olarak bu yöntem kullanılmaktadır." },
        { q: "Azospermi nedir?", a: "Erkek boşalma sıvısında hiç sperme rastlanmamasıdır." },
        { q: "Azospermi her zaman sperm donasyonu tedavisi gerektirir mi?", a: "Azospermi durumunda sebep araştırılarak mikro-TESE işlemi ile testislerden doku örneği alınarak mikroskop altında sperm araması yapılır." },
        { q: "Sigara kısırlık yapar mı?", a: "Sigara kadın ve erkeklerde ayrı ayrı kısırlık nedenidir. Kadınlarda sadece yumurtaları değil rahim duvarını da olumsuz etkiler. Erkeklerde ise sperm hareketliliği ve sperm DNA’sı üzerinde olumsuz etkiye sahiptir." },
        { q: "Yumurta toplama ( OPU) nasıl yapılır?", a: "Yumurta toplama ağrılı bir işlem olduğundan anestezi altında yapılması önerilir. Vajenden ultrason kılavuzluğunda ince bir iğne ile yumurtalıklara ulaşılır. Foliküllerdeki sıvı ile birlikte yumurtalar vücut dışına alınır." },
        { q: "Yumurta toplama ağrılı bir işlem midir?", a: "Tek bir folikül var ise herhangi bir iğne kadar can yakar fakat yumurta sayısı fazla ise anestezi altında yapılması önerilir." },
        { q: "Yumurta toplama işleminden sonra tüp bebek merkezinde kaç saat kalınmalıdır?", a: "Yumurta toplama sedasyon dediğimiz yüzeysel ve kısa süreli bir anestezi yöntemi ile yapılır (sedoanaljezi) . İlaç etkisi ilacı kestikten birkaç dakika sonra sona erer ve hasta uyanır. Uyanma sonrası adet sancısına benzer bir kasık ağrısı olabilir. Genellikle 1-2 saat sonra hasta evine gidebilir." },
        { q: "Tüp bebek tedavisinde kullanılan hormon ilaçları kansere neden olur mu?", a: "Yapılan geniş çalışmalarda tüp bebek tedavisi uygulanan hastalarda yumurtalık kanseri dâhil hiçbir kanser türünün artmadığı ortaya konmuştur." },
        { q: "Yumurta donasyonunda donör ve alıcı anne-baba adayı birbirlerini tanıyabilir mi?", a: "Donasyon tedavisinin esası gizliliktir. Anne- baba adayları hiçbir şekilde donörün adını soyadını bilmemelidir veya fotoğrafını görmemelidir. Bu etik olarak uygun değildir ve ciddi yasal sorunlar yaşanmasına neden olur!" },
        { q: "Embriyo transferi öncesi hangi hormonlar kontrol edilmelidir?", a: "Transfer hazırlığı yapıldığı sırada estrojen ve progesteron hormonları kontrol edilmelidir. Özellikle progesterondaki zamanından önce olan kendiliğinden artış embriyonun anne rahmine tutunmasını engeller." },
        { q: "Rahim duvarı embriyo transferi öncesinde kaç milimetre olmalı?", a: "Endometrium yani rahim duvarı transfer öncesinde en az 7.5 mm olmalıdır." },
        { q: "Emriyo transferi nasıl bir işlemdir?", a: "Yumurtalar döllendikten sonra embriyo adını alır. Dölleme işleminden sonra ince bir kanül yardımı ile jinekolojik muayene pozisyonunda, ultrason eşliğinde rahim ağzından geçilerek embriyo/lar rahim içine gönderilir." },
        { q: "Kaç tane embriyo transfer edilmelidir?", a: "Transfer edilen her embriyo tek seferde gebe kalma şansınızı artırır. Bunun yanında transfer edilen her embriyo çoğul gebelik riskini artırmaktadır. En uygun embriyo sayısına karar verirken embriyoların kalitesi, anne adayının yaşı, toplamda kaç embriyo olduğu, embriyoların genetik tanısının olup olmadığı, önceki IVF sonuçları gibi birçok faktörün yanında ailenin talebi de oldukça önemlidir." },
        { q: "Birden fazla embriyo transferi yapıldığı zaman mutlaka çoğul gebelik mi olur?", a: "Birden fazla embriyo transferi yapılsa bile genellikle tek gebelik elde edilmektedir. Bunun sebebi her embriyonun anne rahmine başarılı şekilde tutunamamasıdır. Birden fazla embriyo transferi yapılmasının da esasen sebebi budur." },
        { q: "Çoğul gebelik olursa nasıl bir yol izlenir?", a: "İkiz gebelikler genellikle ailenin özel bir talebi olmaz ise takip edilir ve başarıyla doğurtulur. Üçüz gebeliklere ise erken doğum ve şiddetli büyüme gelişme geriliğine sebep olacağı için müdahale edilmelidir." },
        { q: "Embriyo azaltma işlemi sırasında diğer bebekler zarar görebilir mi?", a: "Bu işlem konunun uzmanı doktorlar tarafından yapıldığı için bu risk oldukça az olmakla birlikte diğer embriyo/lar da müdahaleden zarar görebilir." },
        { q: "Embriyo transferi sonrası hemen ayağa kalkılır mı?", a: "Embriyo transferi sonrası 5. dk’da ayağa kalkmak ile 2 saat sonra kalkmak arasında gebelik oranları açısından fark yoktur. Uzun süreli istirahatlar vücudun kan akımını bozabilir." },
        { q: "Embriyo transferi sonrasında nasıl beslenilmelidir?", a: "Anne adayı transfer sonrasında mümkün oldukça doğal beslenmeli. Transfer öncesinde hangi miktarda yemek yiyorsa aynısı miktarda beslenmeye devam etmelidir. Bitki çayları ve tropik meyveler gibi vücudun işleyişini değiştirebilecek besinlerden kaçınılmalıdır." },
        { q: "Embriyo transferi sonrası banyo yapılabilir mi?", a: "Embriyo transferi sonrasında çok soğuk ve çok sıcak banyo yapılması önerilmez. Ilık suyla ayakta duş şeklinde banyo yapılması daha doğru olacaktır." },
        { q: "Embriyo transferi sonrası cinsel ilişki zararlı mı?", a: "Gebelik testine kadar cinsel ilişki önerilmemekle birlikte bunun başarıyı etkilediği ile ilgili net bir bilgi mevcut değildir." },
        { q: "Embriyo transferi sonrası egzersiz / spor yapılabilir mi?", a: "Yine gebelik testine kadar egzersiz önerilmez fakat mutlak bir yatak istirahatı da uygun olmayacaktır." },
        { q: "Tüplerin bağlanmasından sonra gebelik kararı alınırsa ne yapılmalıdır?", a: "Tüp ligasyonu yani tüplerin bağlanması işlemi sonrasında gebelik kararı alınırsa en doğru yaklaşım tüp bebek tedavisi olacaktır. Ameliyat ile tüplerin tekrardan tamiri; sağlıklı gebelik ihtimali düşük ve dış gebelik riski yüksek bir tedavi seçeneğidir." },
        { q: "Tüplerin içinde sıvı olması (hidrosalpinks) veya iltihap olması (piyosalpinks) durumunda gebelik için en uygun yaklaşım ne olmalıdır?", a: "Tüplerin içinde sıvı olması kendiliğinden gebelik olma şansını ve tüp bebek başarısını oldukça düşüren bir durumdur. Bu problem olduğu zaman laparoskopik (kapalı) operasyonla hasta olan tüpün çıkarılması gerekir." },
        { q: "Tüplerde sıvı birikmesi ve tüplerdeki tıkanıklığın en sık nedeni nedir?", a: "Klamidya ve Naiseria gibi enfeksiyonlar tüplerdeki yapışıklık, tıkanıklık ve sıvı birikmesine neden olan en sık etkenlerdir." },
        { q: "Menapozdaki bir kadının gebe kalma ihtimali var mıdır?", a: "Yumurta donasyonu tedavisi ile menapozdaki kadınların da gebelik şansı vardır. Kıbrıs’ta tüp bebek tedavisi ile menapoza girmiş kadınlarda, sperm sonuçları da normal ise, %70-90 civarında gebelik elde etmekteyiz." },
        { q: "Tüp bebek tedavisinin tutup tutmadığı nasıl anlaşılır?", a: "Klasik gebelik belirtileri olan kasıklarda adet sancısı şeklindeki hafif ağrılar, memelerde hassasiyet, bulantı veya lekelenme tarzında vajinal kanama olabilir. Bunlara rağmen gebeliğin anlaşılmasının tek yolu kanda b-Hcg hormonunun ölçülmesidir." },
        { q: "Tüp bebek tedavisi ile doğan bebeklerde sağlık sorunlarında artış olur mu?", a: "Bugüne kadar tüp bebek tedavisi ile doğan çocukların sağlık sorunlarında artış izlenmemiştir." },
        { q: "Tekrarlayan gebelik kayıplarında (düşükler) tüp bebek tedavisi faydalı olur mu?", a: "Tekrarlayan gebelik kayıplarının en sık bilinen sebebi genetik sorunlardır. Tüp bebek tedavisi sırasında PGD veya NGS gibi genetik tanı testleri yapılarak embriyonun transfer edilmeden önce genetik hastalığı olup olmadığına bakılabilir." },
        { q: "Tedavi için bekleme sırası var mıdır?", a: "Hayır, bekleme sırası yoktur." }
    ]
};

function renderFAQs(lang) {
    const faqContainer = document.getElementById('faqAccordion');
    if (!faqContainer) return;

    faqContainer.innerHTML = '';
    
    const questions = faqData[lang] || faqData['tr']; // Fallback to TR for now if other langs not ready

    questions.forEach((item) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        
        accordionItem.innerHTML = `
            <button class="accordion-header">
                <span>${item.q}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="accordion-content">
                <p>${item.a}</p>
            </div>
        `;
        
        const header = accordionItem.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = accordionItem.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) accordionItem.classList.add('active');
        });
        
        faqContainer.appendChild(accordionItem);
    });
}
