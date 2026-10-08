import { TONE_AKADEMIK, TONE_SAMIMI } from './promptTemplates'

export const MOCK_DOCUMENT = {
  title: 'Akdeniz Tarımında İklim Stresi ve Yerel Adaptasyon (Örnek Kaynak)',
  sourceLabel: 'Örnek PDF / metin',
}

export const MOCK_CHUNKS = [
  {
    chunkId: 'chk_1',
    page: 1,
    text: 'Bu çalışma, Doğu Akdeniz kıyı kuşağında 1995–2024 döneminde gözlenen sıcaklık ekstremleri ile zeytin, buğday ve narenciye verimi arasındaki ilişkiyi incelemektedir. Analiz, bölgesel meteoroloji istasyonları ve çiftçi kooperatif kayıtlarını birleştirerek hem nicel hem nitel kanıt sunar.',
  },
  {
    chunkId: 'chk_2',
    page: 1,
    text: 'Bulgulara göre 35°C üzeri gün sayısı on yılda ortalama %28 artmıştır. Özellikle Temmuz–Ağustos pencerelerinde gece sıcaklıklarının 24°C’nin altına inmediği “tropikal gece” sayısı, zeytin fenolojisini bozarak yağ asidi kompozisyonunu etkilemektedir.',
  },
  {
    chunkId: 'chk_3',
    page: 1,
    text: 'Yazarlar, verim kaybının yalnızca sıcaklıkla açıklanamayacağını vurgular. Toprak nemi, sulama takvimi ve çeşit seçimi etkileşim içindedir. Aynı ilçede, geççi zeytin çeşitleri erken çeşitlere göre %11 daha az döküm göstermiştir.',
  },
  {
    chunkId: 'chk_4',
    page: 2,
    text: 'Nitel görüşmelerde üreticiler “eski takvimin öldüğünü” ifade eder. Budama ve hasat tarihleri aile belleklerinden değil, son beş yılın kaydından çıkarılmaktadır. Bu durum, geleneksel ekolojik bilginin kırılganlığını gösterir.',
  },
  {
    chunkId: 'chk_5',
    page: 2,
    text: 'Politika önerisi üç katmanlıdır: (1) yerel çeşit gen bankalarının güçlendirilmesi, (2) kooperatif ölçeğinde mikro-iklim istasyonları, (3) sigorta primlerinin tropikal gece metriğine endekslenmesi. Makale, ulusal ortalama sıcaklık hedeflerinin tarla ölçeğini gizlediğini savunur.',
  },
  {
    chunkId: 'chk_6',
    page: 2,
    text: 'Sınırlılıklar açıktır: örneklem 14 ilçeyle sınırlıdır ve seracılık dışarıda bırakılmıştır. Yazarlar, sonuçların Karadeniz fındık kuşağına doğrudan taşınamayacağını belirtir. Yine de yöntem, başka mahsuller için tekrarlanabilir bir şablon sunar.',
  },
  {
    chunkId: 'chk_7',
    page: 3,
    text: 'Sonuç bölümü, adaptasyonu “teknoloji ithali” değil “gözlem altyapısı + çeşit çeşitliliği” olarak tanımlar. Çiftçinin günlük kaydı, uydu verisi kadar kritik bir sinyal kabul edilir. Bu yaklaşım, iklim politikasını tarla defterine indirger.',
  },
]

function turn(partial) {
  return {
    interjectionType: undefined,
    pauseAfterMs: 260,
    ...partial,
  }
}

export const MOCK_TURNS = {
  [TONE_AKADEMIK]: [
    turn({
      id: 't_1',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Bugün masamızda Doğu Akdeniz tarımı var. Barış, ilk cümleden itibaren iddia net: 1995’ten 2024’e uzanan bir stres haritası. Dinleyici için köprü kuralım — bu tam olarak neyin kaydı?',
      emotion: 'curious',
      pauseAfterMs: 280,
      grounding: {
        sourceChunkId: 'chk_1',
        pageNumber: 1,
        excerpt:
          'Doğu Akdeniz kıyı kuşağında 1995–2024 döneminde gözlenen sıcaklık ekstremleri ile zeytin, buğday ve narenciye verimi arasındaki ilişki',
      },
    }),
    turn({
      id: 't_2',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Kesinlikle. Bu bir anekdot derlemesi değil; istasyon verisiyle kooperatif kayıtlarını aynı çerçeveye oturtuyor. Yani hem termometre hem tarla defteri konuşuyor.',
      emotion: 'insightful',
      interjectionType: 'agreement',
      pauseAfterMs: 220,
      grounding: {
        sourceChunkId: 'chk_1',
        pageNumber: 1,
        excerpt:
          'Bölgesel meteoroloji istasyonları ve çiftçi kooperatif kayıtlarını birleştirerek hem nicel hem nitel kanıt sunar.',
      },
    }),
    turn({
      id: 't_3',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Hı-hım. Peki şunu sorayım, çünkü kulağa dramatik geliyor: 35 derece üzeri günler gerçekten on yılda yüzde 28 mi artmış?',
      emotion: 'skeptical',
      pauseAfterMs: 240,
      grounding: {
        sourceChunkId: 'chk_2',
        pageNumber: 1,
        excerpt: '35°C üzeri gün sayısı on yılda ortalama %28 artmıştır.',
      },
    }),
    turn({
      id: 't_4',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Aynen öyle, metin bunu açık yazıyor. Asıl nüans ise gündüz rekorundan ziyade geceler: tropikal gece sayısı zeytinin fenolojisini bozuyor, yağ asidi kompozisyonuna kadar iniyor.',
      emotion: 'insightful',
      pauseAfterMs: 300,
      grounding: {
        sourceChunkId: 'chk_2',
        pageNumber: 1,
        excerpt:
          'Gece sıcaklıklarının 24°C’nin altına inmediği “tropikal gece” sayısı, zeytin fenolojisini bozarak yağ asidi kompozisyonunu etkilemektedir.',
      },
    }),
    turn({
      id: 't_5',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Bir saniye ama — o zaman her şeyi sıcaklık grafiğine mi yüklüyoruz? Çünkü bu, dinleyicide tek neden yanılsaması yaratır.',
      emotion: 'skeptical',
      interjectionType: 'interruption',
      pauseAfterMs: 200,
      grounding: {
        sourceChunkId: 'chk_3',
        pageNumber: 1,
        excerpt: 'Verim kaybının yalnızca sıcaklıkla açıklanamayacağını vurgular.',
      },
    }),
    turn({
      id: 't_6',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Hayır, yazarlar tam da o tuzağı kapatıyor. Toprak nemi, sulama takvimi ve çeşit seçimi etkileşimde. Aynı ilçede geççi zeytin, erken çeşitlere göre yüzde 11 daha az döküm göstermiş.',
      emotion: 'insightful',
      pauseAfterMs: 280,
      grounding: {
        sourceChunkId: 'chk_3',
        pageNumber: 1,
        excerpt:
          'Geççi zeytin çeşitleri erken çeşitlere göre %11 daha az döküm göstermiştir.',
      },
    }),
    turn({
      id: 't_7',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Bu bana tarlanın takvimini de değiştiriyor gibi geldi. “Eski takvim öldü” cümlesi… biraz edebi değil mi, yoksa sahadan mı geliyor?',
      emotion: 'curious',
      pauseAfterMs: 250,
      grounding: {
        sourceChunkId: 'chk_4',
        pageNumber: 2,
        excerpt: 'Üreticiler “eski takvimin öldüğünü” ifade eder.',
      },
    }),
    turn({
      id: 't_8',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Sahadan. Nitel görüşmelerde hasat ve budama artık aile belleğinden değil, son beş yılın kaydından çıkarılıyor. Geleneksel ekolojik bilgi kırılgan hale gelmiş.',
      emotion: 'insightful',
      interjectionType: 'agreement',
      pauseAfterMs: 260,
      grounding: {
        sourceChunkId: 'chk_4',
        pageNumber: 2,
        excerpt:
          'Budama ve hasat tarihleri aile belleklerinden değil, son beş yılın kaydından çıkarılmaktadır.',
      },
    }),
    turn({
      id: 't_9',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Peki politika tarafı? Üç katman duyuyorum ama ulusal ortalama hedefleri neden yetersiz kalıyor?',
      emotion: 'curious',
      interjectionType: 'pivot',
      pauseAfterMs: 220,
      grounding: {
        sourceChunkId: 'chk_5',
        pageNumber: 2,
        excerpt:
          'Ulusal ortalama sıcaklık hedeflerinin tarla ölçeğini gizlediğini savunur.',
      },
    }),
    turn({
      id: 't_10',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Çünkü tarla, ulusal ortalamada kayboluyor. Öneri net: yerel çeşit gen bankası, kooperatif mikro-iklim istasyonu ve sigorta priminin tropikal gece metriğine endekslenmesi.',
      emotion: 'enthusiastic',
      pauseAfterMs: 300,
      grounding: {
        sourceChunkId: 'chk_5',
        pageNumber: 2,
        excerpt:
          'Yerel çeşit gen bankalarının güçlendirilmesi, kooperatif ölçeğinde mikro-iklim istasyonları, sigorta primlerinin tropikal gece metriğine endekslenmesi.',
      },
    }),
    turn({
      id: 't_11',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Hı-hım. Bilim programı olarak sınırlılığı da okuyalım. 14 ilçe, seracılık dışarıda… sonucu nereye kadar götürebiliriz?',
      emotion: 'skeptical',
      pauseAfterMs: 240,
      grounding: {
        sourceChunkId: 'chk_6',
        pageNumber: 2,
        excerpt: 'Örneklem 14 ilçeyle sınırlıdır ve seracılık dışarıda bırakılmıştır.',
      },
    }),
    turn({
      id: 't_12',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Karadeniz fındığına birebir taşıyamayız, bunu yazarlar da söylüyor. Ama yöntem bir şablon: mahsul değişir, gözlem altyapısı kalır.',
      emotion: 'insightful',
      pauseAfterMs: 270,
      grounding: {
        sourceChunkId: 'chk_6',
        pageNumber: 2,
        excerpt:
          'Sonuçların Karadeniz fındık kuşağına doğrudan taşınamayacağını belirtir.',
      },
    }),
    turn({
      id: 't_13',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Kapanış cümlesi olarak kulağıma çarpan şey şu: adaptasyon teknoloji ithali değilmiş. Bu biraz kışkırtıcı, değil mi?',
      emotion: 'humorous',
      pauseAfterMs: 210,
      grounding: {
        sourceChunkId: 'chk_7',
        pageNumber: 3,
        excerpt:
          'Adaptasyonu “teknoloji ithali” değil “gözlem altyapısı + çeşit çeşitliliği” olarak tanımlar.',
      },
    }),
    turn({
      id: 't_14',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Kışkırtıcı ve kaynaklı. Çiftçinin günlük kaydı, uydu kadar kritik bir sinyal. İklim politikasını tarla defterine indirgemek… bence bu bölümün omurgası o.',
      emotion: 'enthusiastic',
      interjectionType: 'agreement',
      pauseAfterMs: 380,
      grounding: {
        sourceChunkId: 'chk_7',
        pageNumber: 3,
        excerpt:
          'Çiftçinin günlük kaydı, uydu verisi kadar kritik bir sinyal kabul edilir.',
      },
    }),
  ],
  [TONE_SAMIMI]: [
    turn({
      id: 't_1',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Tamam bak, kahveyi koydum. Konumuz Akdeniz tarımı ama dizüstü belgesel havası yok, söz veriyorum. Barış, bu kâğıt aslında ne diyor, insan dilinden?',
      emotion: 'curious',
      pauseAfterMs: 240,
      grounding: {
        sourceChunkId: 'chk_1',
        pageNumber: 1,
        excerpt:
          'Sıcaklık ekstremleri ile zeytin, buğday ve narenciye verimi arasındaki ilişkiyi incelemektedir.',
      },
    }),
    turn({
      id: 't_2',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Kısaca: hava delirmiş, tarla defteri de bunu yazıyor. İstasyon verisi var, kooperatif kaydı var. Yani hem “cihaz demiş” hem “amca demiş”.',
      emotion: 'humorous',
      interjectionType: 'agreement',
      pauseAfterMs: 220,
      grounding: {
        sourceChunkId: 'chk_1',
        pageNumber: 1,
        excerpt:
          'Meteoroloji istasyonları ve çiftçi kooperatif kayıtlarını birleştirerek hem nicel hem nitel kanıt sunar.',
      },
    }),
    turn({
      id: 't_3',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Valla yüzde 28 artmış 35 üstü günler… bu “yaz daha uzun” lafı değil, istatistik. Bir saniye ama, gece kısmı niye bu kadar kritik?',
      emotion: 'skeptical',
      pauseAfterMs: 210,
      grounding: {
        sourceChunkId: 'chk_2',
        pageNumber: 1,
        excerpt: '35°C üzeri gün sayısı on yılda ortalama %28 artmıştır.',
      },
    }),
    turn({
      id: 't_4',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Çünkü zeytin gece nefes alamıyor gibi düşün. Tropikal gece: 24’ün altına inmiyor hava. Fenoloji bozuluyor, yağın karakteri değişiyor. Aynen öyle, mesele sadece “çok sıcak” değil.',
      emotion: 'insightful',
      pauseAfterMs: 280,
      grounding: {
        sourceChunkId: 'chk_2',
        pageNumber: 1,
        excerpt:
          '“Tropikal gece” sayısı, zeytin fenolojisini bozarak yağ asidi kompozisyonunu etkilemektedir.',
      },
    }),
    turn({
      id: 't_5',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Hı-hım. Yani her şeyi termometreye yıkmayalım diyorsun. Çeşit de işin içindeymiş, geççi zeytin daha az dökülmüş.',
      emotion: 'curious',
      interjectionType: 'agreement',
      pauseAfterMs: 200,
      grounding: {
        sourceChunkId: 'chk_3',
        pageNumber: 1,
        excerpt:
          'Geççi zeytin çeşitleri erken çeşitlere göre %11 daha az döküm göstermiştir.',
      },
    }),
    turn({
      id: 't_6',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Kesinlikle. Nem, sulama, çeşit… hepsi birbirine kenetlenmiş. Tek grafik paylaşan tweet’lere inanma, belge öyle demiyor.',
      emotion: 'humorous',
      pauseAfterMs: 250,
      grounding: {
        sourceChunkId: 'chk_3',
        pageNumber: 1,
        excerpt: 'Toprak nemi, sulama takvimi ve çeşit seçimi etkileşim içindedir.',
      },
    }),
    turn({
      id: 't_7',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: '“Eski takvim öldü” kısmı bana çok film gibi geldi. Çiftçi gerçekten böyle mi konuşmuş?',
      emotion: 'curious',
      pauseAfterMs: 230,
      grounding: {
        sourceChunkId: 'chk_4',
        pageNumber: 2,
        excerpt: 'Üreticiler “eski takvimin öldüğünü” ifade eder.',
      },
    }),
    turn({
      id: 't_8',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Evet ya. Dededen kalan tarih değil, son beş yılın notu. Geleneksel bilgi var ama zemin kayıyor. Biraz iç burkucu, biraz da pratik.',
      emotion: 'insightful',
      pauseAfterMs: 270,
      grounding: {
        sourceChunkId: 'chk_4',
        pageNumber: 2,
        excerpt:
          'Budama ve hasat tarihleri aile belleklerinden değil, son beş yılın kaydından çıkarılmaktadır.',
      },
    }),
    turn({
      id: 't_9',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Peki Ankara’dan bakınca ne öneriyorlar? Üç madde var diye hatırlıyorum, sokak diline çevir.',
      emotion: 'enthusiastic',
      interjectionType: 'pivot',
      pauseAfterMs: 200,
      grounding: {
        sourceChunkId: 'chk_5',
        pageNumber: 2,
        excerpt: 'Politika önerisi üç katmanlıdır.',
      },
    }),
    turn({
      id: 't_10',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Tohumu sakla, tarlaya minik hava istasyonu koy, sigortayı da o “gece soğumuyor” sayısına bağla. Ulusal ortalama, tarlayı örtbas ediyor çünkü.',
      emotion: 'enthusiastic',
      pauseAfterMs: 300,
      grounding: {
        sourceChunkId: 'chk_5',
        pageNumber: 2,
        excerpt:
          'Ulusal ortalama sıcaklık hedeflerinin tarla ölçeğini gizlediğini savunur.',
      },
    }),
    turn({
      id: 't_11',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'Abi dur, abartmayalım: 14 ilçe, seracılık yok. Bunu fındığa da yapıştıramayız dimi?',
      emotion: 'skeptical',
      pauseAfterMs: 220,
      grounding: {
        sourceChunkId: 'chk_6',
        pageNumber: 2,
        excerpt: 'Örneklem 14 ilçeyle sınırlıdır ve seracılık dışarıda bırakılmıştır.',
      },
    }),
    turn({
      id: 't_12',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Yapıştıramayız, belge de diyor. Ama tarifi alabilirsin: bak, ölç, çeşit tut. Şablon gezici.',
      emotion: 'insightful',
      interjectionType: 'agreement',
      pauseAfterMs: 240,
      grounding: {
        sourceChunkId: 'chk_6',
        pageNumber: 2,
        excerpt:
          'Yöntem, başka mahsuller için tekrarlanabilir bir şablon sunar.',
      },
    }),
    turn({
      id: 't_13',
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: 'En sevdiğim cümle: “uydudan önce tarla defteri”. Biraz isyankâr, biraz doğru.',
      emotion: 'humorous',
      pauseAfterMs: 200,
      grounding: {
        sourceChunkId: 'chk_7',
        pageNumber: 3,
        excerpt:
          'Çiftçinin günlük kaydı, uydu verisi kadar kritik bir sinyal kabul edilir.',
      },
    }),
    turn({
      id: 't_14',
      speaker: 'hostB',
      speakerName: 'Barış',
      text: 'Aynen öyle. Adaptasyon, kamyonla drone indirmek değil; gözlemek ve çeşit bırakmak. Kahve bitti, kaynak duruyor.',
      emotion: 'enthusiastic',
      pauseAfterMs: 360,
      grounding: {
        sourceChunkId: 'chk_7',
        pageNumber: 3,
        excerpt:
          'Adaptasyonu “teknoloji ithali” değil “gözlem altyapısı + çeşit çeşitliliği” olarak tanımlar.',
      },
    }),
  ],
}

export function getMockStudio(tone = TONE_AKADEMIK) {
  const key = tone === TONE_SAMIMI ? TONE_SAMIMI : TONE_AKADEMIK
  return {
    title: MOCK_DOCUMENT.title,
    chunks: MOCK_CHUNKS,
    turns: MOCK_TURNS[key],
    usedFallback: true,
  }
}
