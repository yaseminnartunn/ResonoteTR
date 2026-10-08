import { TONE_SAMIMI } from './promptTemplates'

const EMOTIONS = ['curious', 'insightful', 'skeptical', 'enthusiastic', 'humorous']

function excerptOf(text) {
  const cut = text.slice(0, 180)
  const stop = cut.lastIndexOf('.')
  return (stop > 40 ? cut.slice(0, stop + 1) : cut).trim()
}

const LINES = {
  akademik: {
    hostA: [
      (ex) => `Dinleyici için netleştirelim: kaynak tam olarak şunu kayda geçiriyor — “${ex}”. Barış, sen bunu nasıl okuyorsun?`,
      (ex) => `Bir saniye ama, burada bir gerilim var. Metin “${ex}” diyor. Bu iddia ne kadar sağlam?`,
      (ex) => `Hı-hım. Sayfadaki vurgu şu: “${ex}”. Bunu politika diline çevirirsek ne kalır?`,
      (ex) => `Merak ettiğim nokta sınırlılık. Alıntı şöyle: “${ex}”. Bunu nereye kadar götürebiliriz?`,
    ],
    hostB: [
      (ex) => `Kesinlikle. Parçaya bakarsak nüans burada: “${ex}”. Bu, tek neden hikâyesini kırıyor.`,
      (ex) => `Aynen öyle. Veri cümlesi açık: “${ex}”. Üstüne yorum katmadan önce bunu sabitleyelim.`,
      (ex) => `Aslında derinlik şu cümlede: “${ex}”. Bağlamı kaybedersek tartışma kayar.`,
      (ex) => `Kaynağa sadık kalırsak tablo bu: “${ex}”. Gerisi spekülasyon olur.`,
    ],
  },
  samimi: {
    hostA: [
      (ex) => `Bak, kâğıt düz yazmış: “${ex}”. Bu ne ya, ciddi mi ciddi?`,
      (ex) => `Hı-hım. Yani özetle şurası: “${ex}”. Bir saniye ama, bunu sokakta nasıl anlatırız?`,
      (ex) => `Valla alıntı sert: “${ex}”. Sen gülme, ben şüpheliyim biraz.`,
      (ex) => `Tamam pivot: “${ex}”. Kahveyi soğutmadan bunu bağlayalım.`,
    ],
    hostB: [
      (ex) => `Aynen öyle. Defterde duruyor: “${ex}”. Uydurmuyoruz, okuyoruz.`,
      (ex) => `Kesinlikle. “${ex}” — bu cümle işin omurgası. Gerisi süs.`,
      (ex) => `Dur, nüans kaçmasın: “${ex}”. Tweet’lik hali değil, tarla hali.`,
      (ex) => `Evet ya. Kaynak böyle: “${ex}”. Üstüne masal yazmayalım.`,
    ],
  },
}

export function synthesizeLocalScript(chunks, tone) {
  const pack = tone === TONE_SAMIMI ? LINES.samimi : LINES.akademik
  const turns = []
  let n = 1
  chunks.forEach((chunk, idx) => {
    const ex = excerptOf(chunk.text)
    const a = pack.hostA[idx % pack.hostA.length](ex)
    const b = pack.hostB[idx % pack.hostB.length](ex)
    turns.push({
      id: `t_${n}`,
      speaker: 'hostA',
      speakerName: 'Deniz',
      text: a,
      emotion: EMOTIONS[idx % EMOTIONS.length],
      interjectionType: idx % 3 === 1 ? 'interruption' : idx % 3 === 2 ? 'pivot' : undefined,
      pauseAfterMs: 220 + (idx % 3) * 40,
      grounding: {
        sourceChunkId: chunk.chunkId,
        pageNumber: chunk.page,
        excerpt: ex,
      },
    })
    n += 1
    turns.push({
      id: `t_${n}`,
      speaker: 'hostB',
      speakerName: 'Barış',
      text: b,
      emotion: EMOTIONS[(idx + 1) % EMOTIONS.length],
      interjectionType: 'agreement',
      pauseAfterMs: 260,
      grounding: {
        sourceChunkId: chunk.chunkId,
        pageNumber: chunk.page,
        excerpt: ex,
      },
    })
    n += 1
  })
  return turns.slice(0, 18)
}
