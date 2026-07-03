// Course 2 — Master Thai Reading & Writing. 10 progressive levels from the
// alphabet to short stories, with tracing, recognition games and quizzes.

import { l, v, type L, type Vocab } from "./helpers";

export interface WritingLevelDef {
  slug: string;
  title: L;
  description: L;
  intro: L;
  /** Characters introduced in this level (for tracing + recognition). */
  characters: { char: string; name: string; roman: string }[];
  /** Words/syllables to read using known characters. */
  vocab: Vocab[];
}

export const writingLevels: WritingLevelDef[] = [
  {
    slug: "middle-class-consonants",
    title: l("Middle-Class Consonants", "Consonnes de classe moyenne", "Konsonanten der mittleren Klasse"),
    description: l(
      "Your first 9 Thai letters — the foundation of the alphabet.",
      "Vos 9 premières lettres thaïes — la base de l'alphabet.",
      "Deine ersten 9 thailändischen Buchstaben — das Fundament des Alphabets.",
    ),
    intro: l(
      "Thai has 44 consonants in 3 classes. We start with the middle class: they follow the simplest tone rules. Each letter has a name word, e.g. ก is “gaw gài” — g for chicken.",
      "Le thaï compte 44 consonnes en 3 classes. On commence par la classe moyenne : ses règles de tons sont les plus simples. Chaque lettre a un mot-nom, ex. ก est « gaw gài » — g de poulet.",
      "Thai hat 44 Konsonanten in 3 Klassen. Wir beginnen mit der mittleren Klasse: sie folgt den einfachsten Tonregeln. Jeder Buchstabe hat ein Namenswort, z. B. ก ist „gaw gài“ — g wie Huhn.",
    ),
    characters: [
      { char: "ก", name: "gaw gài (chicken)", roman: "g" },
      { char: "จ", name: "jaw jaan (plate)", roman: "j" },
      { char: "ด", name: "daw dèk (child)", roman: "d" },
      { char: "ต", name: "dtaw dtào (turtle)", roman: "dt" },
      { char: "บ", name: "baw bai-mái (leaf)", roman: "b" },
      { char: "ป", name: "bpaw bplaa (fish)", roman: "bp" },
      { char: "อ", name: "aw àang (basin)", roman: "silent/aw" },
    ],
    vocab: [
      v("กา", "gaa", "crow", "corbeau", "Krähe"),
      v("ดี", "dii", "good", "bon", "gut"),
      v("ตา", "dtaa", "eye / grandfather", "œil / grand-père", "Auge / Großvater"),
      v("บ้าน", "bâan", "house", "maison", "Haus"),
      v("ปลา", "bplaa", "fish", "poisson", "Fisch"),
    ],
  },
  {
    slug: "high-class-consonants",
    title: l("High-Class Consonants", "Consonnes de classe haute", "Konsonanten der hohen Klasse"),
    description: l(
      "The aspirated letters that start with a rising tone.",
      "Les lettres aspirées qui commencent avec un ton montant.",
      "Die aspirierten Buchstaben, die mit steigendem Ton beginnen.",
    ),
    intro: l(
      "High-class consonants sound “breathy” (kh, ch, th, ph, f, s, h) and give syllables a rising tone by default. Compare ข (khǎi — egg) with ก from the last level.",
      "Les consonnes de classe haute sont « aspirées » (kh, ch, th, ph, f, s, h) et donnent par défaut un ton montant. Comparez ข (khǎi — œuf) avec ก du niveau précédent.",
      "Konsonanten der hohen Klasse klingen „behaucht“ (kh, ch, th, ph, f, s, h) und geben Silben standardmäßig einen steigenden Ton. Vergleiche ข (khǎi — Ei) mit ก aus dem letzten Level.",
    ),
    characters: [
      { char: "ข", name: "khǎw khài (egg)", roman: "kh" },
      { char: "ฉ", name: "chǎw chìng (cymbals)", roman: "ch" },
      { char: "ถ", name: "thǎw thǔng (bag)", roman: "th" },
      { char: "ผ", name: "phǎw phûeng (bee)", roman: "ph" },
      { char: "ฝ", name: "fǎw fǎa (lid)", roman: "f" },
      { char: "ส", name: "sǎw sǔea (tiger)", roman: "s" },
      { char: "ห", name: "hǎw hìip (chest)", roman: "h" },
    ],
    vocab: [
      v("ขา", "khǎa", "leg", "jambe", "Bein"),
      v("ผี", "phǐi", "ghost", "fantôme", "Geist"),
      v("เสือ", "sǔea", "tiger", "tigre", "Tiger"),
      v("หู", "hǔu", "ear", "oreille", "Ohr"),
      v("ถุง", "thǔng", "bag", "sac", "Tüte"),
    ],
  },
  {
    slug: "low-class-consonants",
    title: l("Low-Class Consonants", "Consonnes de classe basse", "Konsonanten der tiefen Klasse"),
    description: l(
      "The largest class — including the sounds ng, m, n, r, l, w, y.",
      "La classe la plus nombreuse — avec les sons ng, m, n, r, l, w, y.",
      "Die größte Klasse — mit den Lauten ng, m, n, r, l, w, y.",
    ),
    intro: l(
      "Low-class consonants include all the “sonorant” sounds. ง (ngoo nguu — snake) is the famous “ng” that can start a Thai word — practise it by saying “singing” and dropping “si”.",
      "Les consonnes de classe basse incluent toutes les sonantes. ง (ngoo nguu — serpent) est le fameux « ng » qui peut commencer un mot thaï — entraînez-vous en disant « camping » sans « campi ».",
      "Zur tiefen Klasse gehören alle „Sonoranten“. ง (ngoo nguu — Schlange) ist das berühmte „ng“, das ein thailändisches Wort beginnen kann — übe es mit „singen“ ohne „si“.",
    ),
    characters: [
      { char: "ค", name: "khaw khwaai (buffalo)", roman: "kh" },
      { char: "ง", name: "ngaw nguu (snake)", roman: "ng" },
      { char: "ช", name: "chaw cháang (elephant)", roman: "ch" },
      { char: "ท", name: "thaw thá-hǎan (soldier)", roman: "th" },
      { char: "น", name: "naw nǔu (mouse)", roman: "n" },
      { char: "พ", name: "phaw phaan (tray)", roman: "ph" },
      { char: "ฟ", name: "faw fan (teeth)", roman: "f" },
      { char: "ม", name: "maw máa (horse)", roman: "m" },
      { char: "ย", name: "yaw yák (giant)", roman: "y" },
      { char: "ร", name: "raw ruuea (boat)", roman: "r" },
      { char: "ล", name: "law ling (monkey)", roman: "l" },
      { char: "ว", name: "waw wǎaen (ring)", roman: "w" },
    ],
    vocab: [
      v("มา", "maa", "to come", "venir", "kommen"),
      v("งู", "nguu", "snake", "serpent", "Schlange"),
      v("ช้าง", "cháang", "elephant", "éléphant", "Elefant"),
      v("นก", "nók", "bird", "oiseau", "Vogel"),
      v("ลิง", "ling", "monkey", "singe", "Affe"),
      v("เรือ", "ruuea", "boat", "bateau", "Boot"),
    ],
  },
  {
    slug: "vowels",
    title: l("Vowels", "Les voyelles", "Vokale"),
    description: l(
      "Short and long vowels — written before, after, above and below consonants.",
      "Voyelles courtes et longues — écrites avant, après, au-dessus et en dessous des consonnes.",
      "Kurze und lange Vokale — geschrieben vor, nach, über und unter Konsonanten.",
    ),
    intro: l(
      "Thai vowels can appear on any side of their consonant! เ comes before, -า after, -ิ above, -ุ below. Vowel length changes meaning: khao ≠ khaao.",
      "Les voyelles thaïes peuvent apparaître de tous les côtés de leur consonne ! เ vient avant, -า après, -ิ au-dessus, -ุ en dessous. La longueur change le sens : khao ≠ khaao.",
      "Thailändische Vokale können auf jeder Seite ihres Konsonanten stehen! เ steht davor, -า danach, -ิ darüber, -ุ darunter. Die Vokallänge ändert die Bedeutung: khao ≠ khaao.",
    ),
    characters: [
      { char: "-ะ", name: "sara a (short a)", roman: "a" },
      { char: "-า", name: "sara aa (long a)", roman: "aa" },
      { char: "-ิ", name: "sara i (short i)", roman: "i" },
      { char: "-ี", name: "sara ii (long i)", roman: "ii" },
      { char: "-ุ", name: "sara u (short u)", roman: "u" },
      { char: "-ู", name: "sara uu (long u)", roman: "uu" },
      { char: "เ-", name: "sara e (long e)", roman: "ee" },
      { char: "แ-", name: "sara ae (long ae)", roman: "aae" },
      { char: "โ-", name: "sara o (long o)", roman: "oo" },
      { char: "ไ-", name: "sara ai", roman: "ai" },
    ],
    vocab: [
      v("มือ", "muue", "hand", "main", "Hand"),
      v("ปู", "bpuu", "crab", "crabe", "Krabbe"),
      v("เท", "thee", "to pour", "verser", "gießen"),
      v("แม่", "mâae", "mother", "mère", "Mutter"),
      v("ไม้", "máai", "wood", "bois", "Holz"),
      v("โต", "dtoo", "big (grown)", "grand", "groß"),
    ],
  },
  {
    slug: "tone-marks",
    title: l("Tone Marks", "Les marques de tons", "Tonzeichen"),
    description: l(
      "The 4 tone marks and how consonant class changes their sound.",
      "Les 4 marques de tons et comment la classe des consonnes change leur son.",
      "Die 4 Tonzeichen und wie die Konsonantenklasse ihren Klang verändert.",
    ),
    intro: l(
      "Thai has 5 tones: mid, low, falling, high, rising. Four little marks above the consonant (่ ้ ๊ ๋) combine with consonant class to produce the tone. The classic example: mǎa (dog), mâa? No — máa is horse, mǎa is dog, maa is come!",
      "Le thaï a 5 tons : moyen, bas, descendant, haut, montant. Quatre petites marques au-dessus de la consonne (่ ้ ๊ ๋) se combinent avec la classe de la consonne pour produire le ton. L'exemple classique : maa (venir), máa (cheval), mǎa (chien) !",
      "Thai hat 5 Töne: mittel, tief, fallend, hoch, steigend. Vier kleine Zeichen über dem Konsonanten (่ ้ ๊ ๋) ergeben zusammen mit der Konsonantenklasse den Ton. Das klassische Beispiel: maa (kommen), máa (Pferd), mǎa (Hund)!",
    ),
    characters: [
      { char: "่", name: "mái èek (tone mark 1)", roman: "low/falling" },
      { char: "้", name: "mái thoo (tone mark 2)", roman: "falling/high" },
      { char: "๊", name: "mái dtrii (tone mark 3)", roman: "high" },
      { char: "๋", name: "mái jàt-dtà-waa (tone mark 4)", roman: "rising" },
    ],
    vocab: [
      v("มา", "maa", "to come (mid tone)", "venir (ton moyen)", "kommen (mittlerer Ton)"),
      v("ม้า", "máa", "horse (high tone)", "cheval (ton haut)", "Pferd (hoher Ton)"),
      v("หมา", "mǎa", "dog (rising tone)", "chien (ton montant)", "Hund (steigender Ton)"),
      v("ไหม้", "mâi", "to burn (falling)", "brûler (descendant)", "brennen (fallend)"),
      v("ใหม่", "mài", "new (low tone)", "nouveau (ton bas)", "neu (tiefer Ton)"),
    ],
  },
  {
    slug: "reading-syllables",
    title: l("Reading Syllables", "Lire des syllabes", "Silben lesen"),
    description: l(
      "Combine consonants, vowels and tones into your first syllables.",
      "Combinez consonnes, voyelles et tons en vos premières syllabes.",
      "Kombiniere Konsonanten, Vokale und Töne zu deinen ersten Silben.",
    ),
    intro: l(
      "Now everything comes together: consonant + vowel + (tone mark) = syllable. Read slowly, left to right, and remember vowels that wrap around their consonant.",
      "Maintenant tout se combine : consonne + voyelle + (marque de ton) = syllabe. Lisez lentement, de gauche à droite, et attention aux voyelles qui entourent leur consonne.",
      "Jetzt fügt sich alles zusammen: Konsonant + Vokal + (Tonzeichen) = Silbe. Lies langsam, von links nach rechts, und denke an die Vokale, die ihren Konsonanten umschließen.",
    ),
    characters: [],
    vocab: [
      v("กิน", "gin", "to eat", "manger", "essen"),
      v("นอน", "nawn", "to sleep", "dormir", "schlafen"),
      v("รัก", "rák", "to love", "aimer", "lieben"),
      v("จำ", "jam", "to remember", "se souvenir", "sich erinnern"),
      v("พูด", "phûut", "to speak", "parler", "sprechen"),
      v("อ่าน", "àan", "to read", "lire", "lesen"),
      v("เขียน", "khǐan", "to write", "écrire", "schreiben"),
    ],
  },
  {
    slug: "reading-words",
    title: l("Reading Words", "Lire des mots", "Wörter lesen"),
    description: l(
      "Read real multi-syllable words you already know from speaking.",
      "Lisez de vrais mots à plusieurs syllabes que vous connaissez déjà à l'oral.",
      "Lies echte mehrsilbige Wörter, die du schon vom Sprechen kennst.",
    ),
    intro: l(
      "Thai is written without spaces between words! Words you learned in the speaking course now appear in Thai script — recognising them is a superpower moment.",
      "Le thaï s'écrit sans espaces entre les mots ! Les mots appris dans le cours d'expression orale apparaissent maintenant en écriture thaïe — les reconnaître est un moment magique.",
      "Thai wird ohne Leerzeichen zwischen Wörtern geschrieben! Wörter aus dem Sprechkurs erscheinen jetzt in thailändischer Schrift — sie zu erkennen ist ein magischer Moment.",
    ),
    characters: [],
    vocab: [
      v("สวัสดี", "sà-wàt-dii", "hello", "bonjour", "hallo"),
      v("ขอบคุณ", "khàwp-khun", "thank you", "merci", "danke"),
      v("อาหาร", "aa-hǎan", "food", "nourriture", "Essen"),
      v("โรงแรม", "roong-raem", "hotel", "hôtel", "Hotel"),
      v("สนามบิน", "sà-nǎam-bin", "airport", "aéroport", "Flughafen"),
      v("ตลาด", "dtà-làat", "market", "marché", "Markt"),
      v("หนังสือ", "nǎng-sǔue", "book", "livre", "Buch"),
    ],
  },
  {
    slug: "writing-practice",
    title: l("Writing & Spelling", "Écriture et orthographe", "Schreiben & Rechtschreibung"),
    description: l(
      "Write full words by hand and master Thai spelling rules.",
      "Écrivez des mots entiers à la main et maîtrisez l'orthographe thaïe.",
      "Schreibe ganze Wörter von Hand und meistere die thailändische Rechtschreibung.",
    ),
    intro: l(
      "Thai letters are drawn starting from the small circle (the “head”). Practise the stroke order daily — muscle memory makes reading faster too. Watch out for silent letters marked with ์.",
      "Les lettres thaïes se tracent en partant du petit cercle (la « tête »). Pratiquez l'ordre des traits chaque jour — la mémoire musculaire accélère aussi la lecture. Attention aux lettres muettes marquées ์.",
      "Thailändische Buchstaben beginnen beim kleinen Kreis (dem „Kopf“). Übe die Strichfolge täglich — Muskelgedächtnis beschleunigt auch das Lesen. Achte auf stumme Buchstaben mit ์.",
    ),
    characters: [
      { char: "์", name: "gaa-ran (silence mark)", roman: "silent" },
      { char: "ๆ", name: "mái yá-mók (repeat mark)", roman: "repeat" },
    ],
    vocab: [
      v("ครู", "khruu", "teacher", "professeur", "Lehrer"),
      v("นักเรียน", "nák-rian", "student", "élève", "Schüler"),
      v("โรงเรียน", "roong-rian", "school", "école", "Schule"),
      v("ภาษาไทย", "phaa-sǎa thai", "Thai language", "langue thaïe", "thailändische Sprache"),
      v("เพื่อน", "phûuean", "friend", "ami", "Freund"),
    ],
  },
  {
    slug: "reading-sentences",
    title: l("Reading Sentences & Paragraphs", "Lire des phrases et paragraphes", "Sätze & Absätze lesen"),
    description: l(
      "Read full sentences and short paragraphs with confidence.",
      "Lisez des phrases complètes et de courts paragraphes avec assurance.",
      "Lies ganze Sätze und kurze Absätze mit Selbstvertrauen.",
    ),
    intro: l(
      "Sentences at last! Thai marks the end of a sentence with a space. Read each sentence aloud — combining reading with speaking cements both skills.",
      "Enfin des phrases ! Le thaï marque la fin d'une phrase par un espace. Lisez chaque phrase à voix haute — combiner lecture et oral ancre les deux compétences.",
      "Endlich Sätze! Thai markiert das Satzende mit einem Leerzeichen. Lies jeden Satz laut — Lesen und Sprechen zu kombinieren festigt beide Fähigkeiten.",
    ),
    characters: [],
    vocab: [
      v("ฉันกินข้าว", "chǎn gin khâao", "I eat rice.", "Je mange du riz.", "Ich esse Reis."),
      v("เขาไปโรงเรียน", "khǎo pai roong-rian", "He/she goes to school.", "Il/elle va à l'école.", "Er/sie geht zur Schule."),
      v("แม่รักฉัน", "mâae rák chǎn", "Mother loves me.", "Maman m'aime.", "Mutter liebt mich."),
      v("ผมอ่านหนังสือทุกวัน", "phǒm àan nǎng-sǔue thúk wan", "I read a book every day.", "Je lis un livre chaque jour.", "Ich lese jeden Tag ein Buch."),
      v("วันนี้อากาศร้อนมาก", "wan-níi aa-gàat ráwn mâak", "Today the weather is very hot.", "Aujourd'hui il fait très chaud.", "Heute ist das Wetter sehr heiß."),
    ],
  },
  {
    slug: "short-stories",
    title: l("Short Stories", "Petites histoires", "Kurzgeschichten"),
    description: l(
      "Read your first real Thai story — and earn your certificate.",
      "Lisez votre première vraie histoire en thaï — et obtenez votre certificat.",
      "Lies deine erste echte thailändische Geschichte — und erhalte dein Zertifikat.",
    ),
    intro: l(
      "The final level! You will read a short story about a market day in Bangkok, write your own sentences, and pass the final exam to earn your official Reading & Writing certificate.",
      "Le dernier niveau ! Vous lirez une petite histoire sur un jour de marché à Bangkok, écrirez vos propres phrases et passerez l'examen final pour obtenir votre certificat officiel de lecture et d'écriture.",
      "Das letzte Level! Du liest eine Kurzgeschichte über einen Markttag in Bangkok, schreibst eigene Sätze und bestehst die Abschlussprüfung für dein offizielles Lese- und Schreibzertifikat.",
    ),
    characters: [],
    vocab: [
      v("เรื่อง", "rûueang", "story", "histoire", "Geschichte"),
      v("ตอนเช้า", "dtawn-cháao", "in the morning", "le matin", "am Morgen"),
      v("ตลาดน้ำ", "dtà-làat náam", "floating market", "marché flottant", "schwimmender Markt"),
      v("ผลไม้", "phǒn-lá-máai", "fruit", "fruit", "Obst"),
      v("มีความสุข", "mii khwaam-sùk", "to be happy", "être heureux", "glücklich sein"),
      v("จบ", "jòp", "the end", "fin", "Ende"),
    ],
  },
];
