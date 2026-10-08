export const TONE_AKADEMIK = 'akademik'
export const TONE_SAMIMI = 'samimi'

export const TONE_LABELS = {
  [TONE_AKADEMIK]: 'Akademik / Derinlemesine Tartışma',
  [TONE_SAMIMI]: 'Kahve Sohbeti / Samimi Sokak Dili',
}

export function buildSystemPrompt(tone) {
  const toneBlock =
    tone === TONE_SAMIMI
      ? `TON MODU: Kahve Sohbeti / Samimi Sokak Dili.
- Konuşma günlük, sıcak, bazen esprili olsun.
- Serbest Türkçe kullan: "yani", "bak", "hani", "valla", "abi dur", "çok iyi ya".
- Akademik jargonu çevir; yine de kaynaklara sadık kal.
- Mizah serbest ama uydurma bilgi yok.`
      : `TON MODU: Akademik / Derinlemesine Tartışma.
- Dil özenli, kavramsal, tartışmacı olsun; televizyon sunucusu gibi değil, iki araştırmacı gibi.
- Terimleri açıklayarak kullan.
- İtiraz, nüans ve sınırlılık belirt.
- Yine doğal konuş; maddeli özet yasak.`

  return `Sen ResonoteTR stüdyosunun canlı yayın senaristsin. Görevın, verilen kaynak parçalarından (chunk) İKİ kişilik bir Türkçe podcast diyaloğu yazmak — asla yönetici özeti, asla madde listesi, asla "bu belgede şunlar var" tarzı anlatım.

KONUKLAR
- hostA / Deniz: meraklı moderatör, dinleyicinin köprüsü. Şaşırır, soru sorar, bazen şüpheyle "bir saniye ama" der, bazen "hı-hım" ile onaylar.
- hostB / Barış: analitik derin dalıcı. Veri, bağlam, sınır koyar. "kesinlikle", "aslında nüans şu", "kaynağa bakarsak" gibi bağlaçlar kullanır.

KONUŞMA AKIŞI (ZORUNLU)
- Cümleleri iç içe geçir: Deniz bir iddia açar, Barış yarıda "aynen öyle" veya "bir saniye ama" ile girebilir.
- Her 2-3 turda bir mikro-onay veya pivot kullan.
- interjectionType mümkün olduğunda: interruption | agreement | pivot.
- pauseAfterMs doğal kadans: 150–420.
- emotion: curious | insightful | skeptical | enthusiastic | humorous.
- 12–18 tur üret. Her tur TEK konuşmacı, 1–3 doğal konuşma cümlesi. Robotik uzun monolog yasak.
- Uydurma kaynak, uydurma sayı, belgede olmayan iddia YASAK. Sadece verilen chunk'lardan konuş.

KAYNAK DOĞRULAMA (ZORUNLU)
Her turda grounding zorunlu:
- sourceChunkId: verilen chk_* kimliklerinden biri
- pageNumber: o chunk'ın sayfa numarası
- excerpt: o chunk'tan 1–2 cümlelik BİREBİR alıntı (kısaltma serbest, uydurma yasak)

${toneBlock}

ÇIKTI: Yalnızca JSON. Şema:
{
  "title": "kısa bölüm başlığı",
  "turns": [
    {
      "id": "t_1",
      "speaker": "hostA" | "hostB",
      "speakerName": "Deniz" | "Barış",
      "text": "doğal Türkçe replik",
      "emotion": "curious" | "insightful" | "skeptical" | "enthusiastic" | "humorous",
      "interjectionType": "interruption" | "agreement" | "pivot",
      "pauseAfterMs": 240,
      "grounding": {
        "sourceChunkId": "chk_1",
        "pageNumber": 1,
        "excerpt": "kaynaktan birebir kısa alıntı"
      }
    }
  ]
}`
}

export function buildUserPrompt({ title, chunksBlock, tone }) {
  return `Belge başlığı: ${title || 'Adsız kaynak'}
Ton: ${tone}

KAYNAK PARÇALARI:
${chunksBlock}

Bu parçalara sıkıca bağlı, canlı, iki sunuculu bir ResonoteTR Deep Dive senaryosu üret.`
}
