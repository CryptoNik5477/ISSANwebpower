// Course 1 — Master Spoken Thai. 9 progressive levels, each with daily
// lessons, vocabulary, speaking, listening, quiz, review + a level exam.

import { l, v, type L, type Vocab } from "./helpers";

export interface SpeakingLevelDef {
  slug: string;
  title: L;
  description: L;
  intro: L;
  vocab: Vocab[];
  dialogue: { speaker: string; thai: string; roman: string; translation: L }[];
}

export const speakingLevels: SpeakingLevelDef[] = [
  {
    slug: "basic-greetings",
    title: l("Basic Greetings", "Salutations de base", "Grundlegende Begrüßungen"),
    description: l(
      "Say hello, thank you and goodbye like a local.",
      "Dites bonjour, merci et au revoir comme un local.",
      "Sage Hallo, Danke und Tschüss wie ein Einheimischer.",
    ),
    intro: l(
      "Thai greetings are the key to every conversation. Add “khráp” (men) or “khâ” (women) at the end of sentences to be polite — Thais will love you for it.",
      "Les salutations thaïes sont la clé de toute conversation. Ajoutez « khráp » (hommes) ou « khâ » (femmes) à la fin des phrases pour être poli — les Thaïlandais adoreront.",
      "Thailändische Begrüßungen sind der Schlüssel zu jedem Gespräch. Hänge „khráp“ (Männer) oder „khâ“ (Frauen) ans Satzende, um höflich zu sein — die Thais werden es lieben.",
    ),
    vocab: [
      v("สวัสดี", "sà-wàt-dii", "hello", "bonjour", "hallo"),
      v("ขอบคุณ", "khàwp-khun", "thank you", "merci", "danke"),
      v("สบายดีไหม", "sà-baai-dii mái", "how are you?", "comment ça va ?", "wie geht es dir?"),
      v("สบายดี", "sà-baai-dii", "I'm fine", "je vais bien", "mir geht es gut"),
      v("ครับ", "khráp", "polite particle (men)", "particule polie (hommes)", "Höflichkeitspartikel (Männer)"),
      v("ค่ะ", "khâ", "polite particle (women)", "particule polie (femmes)", "Höflichkeitspartikel (Frauen)"),
      v("ลาก่อน", "laa-gàwn", "goodbye", "au revoir", "auf Wiedersehen"),
      v("ไม่เป็นไร", "mâi pen rai", "no problem / you're welcome", "pas de problème / de rien", "kein Problem / gern geschehen"),
    ],
    dialogue: [
      { speaker: "A", thai: "สวัสดีครับ สบายดีไหมครับ", roman: "sà-wàt-dii khráp, sà-baai-dii mái khráp", translation: l("Hello, how are you?", "Bonjour, comment ça va ?", "Hallo, wie geht es dir?") },
      { speaker: "B", thai: "สบายดีค่ะ ขอบคุณค่ะ", roman: "sà-baai-dii khâ, khàwp-khun khâ", translation: l("I'm fine, thank you.", "Je vais bien, merci.", "Mir geht es gut, danke.") },
      { speaker: "A", thai: "ลาก่อนครับ", roman: "laa-gàwn khráp", translation: l("Goodbye!", "Au revoir !", "Auf Wiedersehen!") },
    ],
  },
  {
    slug: "introducing-yourself",
    title: l("Introducing Yourself", "Se présenter", "Sich vorstellen"),
    description: l(
      "Tell people your name, where you're from and get to know them.",
      "Dites votre nom, d'où vous venez et faites connaissance.",
      "Sag deinen Namen, woher du kommst und lerne Leute kennen.",
    ),
    intro: l(
      "In Thai, men say “phǒm” for I and women say “chǎn”. There is no verb conjugation — Thai grammar is wonderfully simple.",
      "En thaï, les hommes disent « phǒm » pour je et les femmes « chǎn ». Il n'y a pas de conjugaison — la grammaire thaïe est merveilleusement simple.",
      "Auf Thai sagen Männer „phǒm“ für ich und Frauen „chǎn“. Es gibt keine Konjugation — die thailändische Grammatik ist wunderbar einfach.",
    ),
    vocab: [
      v("ผม", "phǒm", "I (men)", "je (hommes)", "ich (Männer)"),
      v("ฉัน", "chǎn", "I (women)", "je (femmes)", "ich (Frauen)"),
      v("ชื่อ", "chûue", "name / to be named", "nom / s'appeler", "Name / heißen"),
      v("คุณชื่ออะไร", "khun chûue à-rai", "what is your name?", "comment vous appelez-vous ?", "wie heißt du?"),
      v("มาจาก", "maa jàak", "to come from", "venir de", "kommen aus"),
      v("ประเทศ", "prà-thêet", "country", "pays", "Land"),
      v("ยินดีที่ได้รู้จัก", "yin-dii thîi dâi rúu-jàk", "nice to meet you", "enchanté", "freut mich, dich kennenzulernen"),
      v("อายุ", "aa-yú", "age", "âge", "Alter"),
    ],
    dialogue: [
      { speaker: "A", thai: "ผมชื่อทอมครับ คุณชื่ออะไรครับ", roman: "phǒm chûue Tom khráp, khun chûue à-rai khráp", translation: l("My name is Tom. What's your name?", "Je m'appelle Tom. Comment vous appelez-vous ?", "Ich heiße Tom. Wie heißt du?") },
      { speaker: "B", thai: "ฉันชื่อน้อยค่ะ ยินดีที่ได้รู้จักค่ะ", roman: "chǎn chûue Noi khâ, yin-dii thîi dâi rúu-jàk khâ", translation: l("My name is Noi. Nice to meet you!", "Je m'appelle Noi. Enchantée !", "Ich heiße Noi. Freut mich!") },
      { speaker: "A", thai: "ผมมาจากประเทศฝรั่งเศสครับ", roman: "phǒm maa jàak prà-thêet fà-ràng-sèet khráp", translation: l("I come from France.", "Je viens de France.", "Ich komme aus Frankreich.") },
    ],
  },
  {
    slug: "shopping",
    title: l("Shopping", "Faire les courses", "Einkaufen"),
    description: l(
      "Ask prices, bargain politely and shop at Thai markets.",
      "Demandez les prix, négociez poliment et achetez sur les marchés thaïs.",
      "Frage nach Preisen, handle höflich und kaufe auf thailändischen Märkten ein.",
    ),
    intro: l(
      "Bargaining is part of Thai market culture — always with a smile. “Thâo-rài?” (how much?) will be your most-used word.",
      "Négocier fait partie de la culture des marchés thaïs — toujours avec le sourire. « Thâo-rài ? » (combien ?) sera votre mot le plus utilisé.",
      "Feilschen gehört zur thailändischen Marktkultur — immer mit einem Lächeln. „Thâo-rài?“ (wie viel?) wird dein meistgenutztes Wort sein.",
    ),
    vocab: [
      v("เท่าไหร่", "thâo-rài", "how much?", "combien ?", "wie viel?"),
      v("แพง", "phaeng", "expensive", "cher", "teuer"),
      v("ถูก", "thùuk", "cheap", "bon marché", "billig"),
      v("ลดราคา", "lót raa-khaa", "discount", "réduction", "Rabatt"),
      v("ซื้อ", "súue", "to buy", "acheter", "kaufen"),
      v("ขาย", "khǎai", "to sell", "vendre", "verkaufen"),
      v("เงิน", "ngoen", "money", "argent", "Geld"),
      v("บาท", "bàat", "baht (currency)", "baht (monnaie)", "Baht (Währung)"),
      v("อันนี้", "an-níi", "this one", "celui-ci", "dieses hier"),
    ],
    dialogue: [
      { speaker: "A", thai: "อันนี้เท่าไหร่ครับ", roman: "an-níi thâo-rài khráp", translation: l("How much is this one?", "Combien coûte celui-ci ?", "Wie viel kostet dieses hier?") },
      { speaker: "B", thai: "สองร้อยบาทค่ะ", roman: "sǎwng ráwy bàat khâ", translation: l("Two hundred baht.", "Deux cents bahts.", "Zweihundert Baht.") },
      { speaker: "A", thai: "แพงไปหน่อย ลดราคาได้ไหมครับ", roman: "phaeng pai nàwy, lót raa-khaa dâi mái khráp", translation: l("A bit expensive. Can you give a discount?", "Un peu cher. Une petite réduction ?", "Etwas teuer. Geht ein Rabatt?") },
    ],
  },
  {
    slug: "restaurants",
    title: l("Restaurants", "Au restaurant", "Im Restaurant"),
    description: l(
      "Order food, say what you like and handle the bill.",
      "Commandez, dites ce que vous aimez et gérez l'addition.",
      "Bestelle Essen, sag was du magst und kümmere dich um die Rechnung.",
    ),
    intro: l(
      "Thai food is famous for a reason. Learn to say “mâi phèt” (not spicy) — it might save your evening. Start requests with “khǎw” (may I have).",
      "La cuisine thaïe est célèbre à juste titre. Apprenez « mâi phèt » (pas épicé) — cela peut sauver votre soirée. Commencez vos demandes par « khǎw » (puis-je avoir).",
      "Thailändisches Essen ist zu Recht berühmt. Lerne „mâi phèt“ (nicht scharf) — es könnte deinen Abend retten. Beginne Bestellungen mit „khǎw“ (ich hätte gern).",
    ),
    vocab: [
      v("อาหาร", "aa-hǎan", "food", "nourriture", "Essen"),
      v("อร่อย", "à-ròi", "delicious", "délicieux", "lecker"),
      v("เผ็ด", "phèt", "spicy", "épicé", "scharf"),
      v("ไม่เผ็ด", "mâi phèt", "not spicy", "pas épicé", "nicht scharf"),
      v("ข้าว", "khâao", "rice", "riz", "Reis"),
      v("น้ำ", "náam", "water", "eau", "Wasser"),
      v("เมนู", "mee-nuu", "menu", "menu", "Speisekarte"),
      v("เช็คบิล", "chék-bin", "the bill, please", "l'addition, s'il vous plaît", "die Rechnung, bitte"),
      v("ขอ", "khǎw", "may I have…", "puis-je avoir…", "ich hätte gern…"),
    ],
    dialogue: [
      { speaker: "A", thai: "ขอเมนูหน่อยครับ", roman: "khǎw mee-nuu nàwy khráp", translation: l("May I have the menu, please?", "Puis-je avoir le menu ?", "Kann ich bitte die Speisekarte haben?") },
      { speaker: "A", thai: "ขอผัดไทยไม่เผ็ดครับ", roman: "khǎw phàt-thai mâi phèt khráp", translation: l("Pad Thai, not spicy, please.", "Un pad thaï pas épicé, s'il vous plaît.", "Ein Pad Thai, nicht scharf, bitte.") },
      { speaker: "B", thai: "อร่อยไหมคะ", roman: "à-ròi mái khá", translation: l("Is it delicious?", "C'est bon ?", "Schmeckt es?") },
      { speaker: "A", thai: "อร่อยมากครับ เช็คบิลด้วยครับ", roman: "à-ròi mâak khráp, chék-bin dûai khráp", translation: l("Very delicious! The bill, please.", "Très bon ! L'addition, s'il vous plaît.", "Sehr lecker! Die Rechnung, bitte.") },
    ],
  },
  {
    slug: "transportation",
    title: l("Transportation", "Les transports", "Verkehrsmittel"),
    description: l(
      "Take taxis, trains and buses — and give directions.",
      "Prenez taxis, trains et bus — et donnez des directions.",
      "Nimm Taxis, Züge und Busse — und gib Wegbeschreibungen.",
    ),
    intro: l(
      "“Pai” (go) is one of the most useful Thai verbs. Combine it with a place and you can go anywhere: “pai sà-nǎam-bin” — to the airport!",
      "« Pai » (aller) est l'un des verbes thaïs les plus utiles. Combinez-le avec un lieu et vous pouvez aller partout : « pai sà-nǎam-bin » — à l'aéroport !",
      "„Pai“ (gehen/fahren) ist eines der nützlichsten thailändischen Verben. Kombiniere es mit einem Ort: „pai sà-nǎam-bin“ — zum Flughafen!",
    ),
    vocab: [
      v("รถ", "rót", "car / vehicle", "voiture / véhicule", "Auto / Fahrzeug"),
      v("รถไฟ", "rót-fai", "train", "train", "Zug"),
      v("รถเมล์", "rót-mee", "bus", "bus", "Bus"),
      v("แท็กซี่", "tháek-sîi", "taxi", "taxi", "Taxi"),
      v("ไปที่", "pai thîi", "go to", "aller à", "gehen/fahren nach"),
      v("เลี้ยวซ้าย", "líao sáai", "turn left", "tourner à gauche", "links abbiegen"),
      v("เลี้ยวขวา", "líao khwǎa", "turn right", "tourner à droite", "rechts abbiegen"),
      v("ตรงไป", "trong pai", "go straight", "tout droit", "geradeaus"),
      v("สนามบิน", "sà-nǎam-bin", "airport", "aéroport", "Flughafen"),
    ],
    dialogue: [
      { speaker: "A", thai: "ไปสนามบินเท่าไหร่ครับ", roman: "pai sà-nǎam-bin thâo-rài khráp", translation: l("How much to the airport?", "Combien pour l'aéroport ?", "Wie viel bis zum Flughafen?") },
      { speaker: "B", thai: "สามร้อยบาทครับ", roman: "sǎam ráwy bàat khráp", translation: l("Three hundred baht.", "Trois cents bahts.", "Dreihundert Baht.") },
      { speaker: "A", thai: "เลี้ยวขวาแล้วตรงไปครับ", roman: "líao khwǎa láaeo trong pai khráp", translation: l("Turn right, then go straight.", "Tournez à droite, puis tout droit.", "Rechts abbiegen, dann geradeaus.") },
    ],
  },
  {
    slug: "hotels",
    title: l("Hotels", "À l'hôtel", "Im Hotel"),
    description: l(
      "Book rooms, check in and ask about hotel services.",
      "Réservez, faites le check-in et renseignez-vous sur les services.",
      "Buche Zimmer, checke ein und frage nach Hotelservices.",
    ),
    intro: l(
      "Booking a room is easy once you know “jawng” (to book) and “hâwng” (room). Numbers from the shopping level come back here — review them!",
      "Réserver une chambre est facile avec « jawng » (réserver) et « hâwng » (chambre). Les nombres du niveau shopping reviennent ici — révisez-les !",
      "Ein Zimmer buchen ist leicht mit „jawng“ (buchen) und „hâwng“ (Zimmer). Die Zahlen aus dem Einkaufslevel kommen hier zurück — wiederhole sie!",
    ),
    vocab: [
      v("โรงแรม", "roong-raem", "hotel", "hôtel", "Hotel"),
      v("ห้อง", "hâwng", "room", "chambre", "Zimmer"),
      v("จอง", "jawng", "to book / reserve", "réserver", "buchen / reservieren"),
      v("กุญแจ", "gun-jae", "key", "clé", "Schlüssel"),
      v("คืน", "khuuen", "night", "nuit", "Nacht"),
      v("เช็คอิน", "chék-in", "check-in", "enregistrement", "Check-in"),
      v("สระว่ายน้ำ", "sà wâai náam", "swimming pool", "piscine", "Schwimmbad"),
      v("อาหารเช้า", "aa-hǎan cháao", "breakfast", "petit-déjeuner", "Frühstück"),
    ],
    dialogue: [
      { speaker: "A", thai: "ผมจองห้องไว้สองคืนครับ", roman: "phǒm jawng hâwng wái sǎwng khuuen khráp", translation: l("I booked a room for two nights.", "J'ai réservé une chambre pour deux nuits.", "Ich habe ein Zimmer für zwei Nächte gebucht.") },
      { speaker: "B", thai: "มีอาหารเช้าไหมคะ", roman: "mii aa-hǎan cháao mái khá", translation: l("Is breakfast included?", "Le petit-déjeuner est-il inclus ?", "Ist Frühstück inklusive?") },
      { speaker: "A", thai: "สระว่ายน้ำอยู่ที่ไหนครับ", roman: "sà wâai náam yùu thîi nǎi khráp", translation: l("Where is the swimming pool?", "Où est la piscine ?", "Wo ist das Schwimmbad?") },
    ],
  },
  {
    slug: "emergency",
    title: l("Emergency", "Urgences", "Notfälle"),
    description: l(
      "Get help fast: doctors, police and pharmacies.",
      "Obtenez de l'aide vite : médecins, police et pharmacies.",
      "Hole schnell Hilfe: Ärzte, Polizei und Apotheken.",
    ),
    intro: l(
      "Hopefully you'll never need this level — but knowing “chûai dûai!” (help!) and how to describe pain gives you real confidence abroad.",
      "Espérons que vous n'aurez jamais besoin de ce niveau — mais connaître « chûai dûai ! » (au secours !) et savoir décrire une douleur donne une vraie confiance à l'étranger.",
      "Hoffentlich brauchst du dieses Level nie — aber „chûai dûai!“ (Hilfe!) zu kennen und Schmerzen beschreiben zu können, gibt dir echte Sicherheit im Ausland.",
    ),
    vocab: [
      v("ช่วยด้วย", "chûai dûai", "help!", "au secours !", "Hilfe!"),
      v("หมอ", "mǎw", "doctor", "médecin", "Arzt"),
      v("โรงพยาบาล", "roong-phá-yaa-baan", "hospital", "hôpital", "Krankenhaus"),
      v("ตำรวจ", "tam-rùat", "police", "police", "Polizei"),
      v("เจ็บ", "jèp", "to hurt", "avoir mal", "wehtun"),
      v("ป่วย", "pùai", "sick", "malade", "krank"),
      v("ยา", "yaa", "medicine", "médicament", "Medikament"),
      v("อุบัติเหตุ", "ù-bàt-tì-hèet", "accident", "accident", "Unfall"),
    ],
    dialogue: [
      { speaker: "A", thai: "ช่วยด้วยครับ มีอุบัติเหตุ", roman: "chûai dûai khráp, mii ù-bàt-tì-hèet", translation: l("Help! There's been an accident.", "Au secours ! Il y a eu un accident.", "Hilfe! Es gab einen Unfall.") },
      { speaker: "B", thai: "โรงพยาบาลอยู่ใกล้ๆ ค่ะ", roman: "roong-phá-yaa-baan yùu glâi-glâi khâ", translation: l("The hospital is nearby.", "L'hôpital est tout près.", "Das Krankenhaus ist in der Nähe.") },
      { speaker: "A", thai: "ผมป่วย ต้องการหมอครับ", roman: "phǒm pùai, tâwng-gaan mǎw khráp", translation: l("I'm sick, I need a doctor.", "Je suis malade, j'ai besoin d'un médecin.", "Ich bin krank, ich brauche einen Arzt.") },
    ],
  },
  {
    slug: "conversation",
    title: l("Conversation", "Conversation", "Konversation"),
    description: l(
      "Chat about work, weather, likes and daily life.",
      "Parlez travail, météo, goûts et vie quotidienne.",
      "Plaudere über Arbeit, Wetter, Vorlieben und den Alltag.",
    ),
    intro: l(
      "Time to chain sentences together. Time words like “wan-níi” (today) and opinion verbs like “khít wâa” (to think that) turn phrases into real conversation.",
      "Il est temps d'enchaîner les phrases. Les mots de temps comme « wan-níi » (aujourd'hui) et les verbes d'opinion comme « khít wâa » (penser que) transforment des phrases en vraie conversation.",
      "Zeit, Sätze zu verketten. Zeitwörter wie „wan-níi“ (heute) und Meinungsverben wie „khít wâa“ (denken, dass) machen aus Phrasen echte Gespräche.",
    ),
    vocab: [
      v("คิดว่า", "khít wâa", "to think that", "penser que", "denken, dass"),
      v("ชอบ", "châwp", "to like", "aimer", "mögen"),
      v("ไม่ชอบ", "mâi châwp", "to dislike", "ne pas aimer", "nicht mögen"),
      v("ทำงาน", "tham-ngaan", "to work", "travailler", "arbeiten"),
      v("วันนี้", "wan-níi", "today", "aujourd'hui", "heute"),
      v("พรุ่งนี้", "phrûng-níi", "tomorrow", "demain", "morgen"),
      v("เมื่อวาน", "mûuea-waan", "yesterday", "hier", "gestern"),
      v("อากาศ", "aa-gàat", "weather", "météo", "Wetter"),
      v("สนุก", "sà-nùk", "fun", "amusant", "Spaß"),
    ],
    dialogue: [
      { speaker: "A", thai: "วันนี้อากาศดีมากครับ", roman: "wan-níi aa-gàat dii mâak khráp", translation: l("The weather is very nice today.", "Il fait très beau aujourd'hui.", "Das Wetter ist heute sehr schön.") },
      { speaker: "B", thai: "ใช่ค่ะ ฉันชอบเมืองไทยมาก", roman: "châi khâ, chǎn châwp mueang-thai mâak", translation: l("Yes! I really like Thailand.", "Oui ! J'adore la Thaïlande.", "Ja! Ich mag Thailand sehr.") },
      { speaker: "A", thai: "ผมคิดว่าภาษาไทยสนุกครับ", roman: "phǒm khít wâa phaa-sǎa thai sà-nùk khráp", translation: l("I think Thai is fun.", "Je pense que le thaï est amusant.", "Ich finde, Thai macht Spaß.") },
    ],
  },
  {
    slug: "fluency",
    title: l("Fluency", "Aisance", "Fließend sprechen"),
    description: l(
      "Connect ideas with because, if, but — and speak in full paragraphs.",
      "Reliez vos idées avec parce que, si, mais — et parlez en paragraphes.",
      "Verbinde Gedanken mit weil, wenn, aber — und sprich in ganzen Absätzen.",
    ),
    intro: l(
      "The final speaking level! Connectors and aspect markers (already, will, must) let you express complex thoughts. After the exam: your official certificate.",
      "Le dernier niveau d'expression orale ! Les connecteurs et marqueurs d'aspect (déjà, futur, devoir) permettent d'exprimer des idées complexes. Après l'examen : votre certificat officiel.",
      "Das letzte Sprech-Level! Konnektoren und Aspektmarker (schon, werden, müssen) lassen dich komplexe Gedanken ausdrücken. Nach der Prüfung: dein offizielles Zertifikat.",
    ),
    vocab: [
      v("เพราะว่า", "phráw wâa", "because", "parce que", "weil"),
      v("ถ้า", "thâa", "if", "si", "wenn / falls"),
      v("แต่", "tàae", "but", "mais", "aber"),
      v("เคย", "khoei", "to have ever (done)", "avoir déjà (fait)", "schon einmal (getan haben)"),
      v("กำลัง", "gam-lang", "-ing (in progress)", "en train de", "gerade dabei sein"),
      v("แล้ว", "láaeo", "already", "déjà", "schon / bereits"),
      v("จะ", "jà", "will (future)", "futur (va)", "werden (Futur)"),
      v("ต้อง", "tâwng", "must / have to", "devoir", "müssen"),
      v("น่าจะ", "nâa jà", "probably", "probablement", "wahrscheinlich"),
    ],
    dialogue: [
      { speaker: "A", thai: "ผมเรียนภาษาไทยเพราะว่าผมจะไปเมืองไทย", roman: "phǒm rian phaa-sǎa thai phráw wâa phǒm jà pai mueang-thai", translation: l("I study Thai because I will go to Thailand.", "J'apprends le thaï parce que je vais aller en Thaïlande.", "Ich lerne Thai, weil ich nach Thailand gehen werde.") },
      { speaker: "B", thai: "คุณเคยไปเชียงใหม่ไหมคะ", roman: "khun khoei pai chiang-mài mái khá", translation: l("Have you ever been to Chiang Mai?", "Êtes-vous déjà allé à Chiang Mai ?", "Warst du schon einmal in Chiang Mai?") },
      { speaker: "A", thai: "ยังครับ แต่ถ้ามีเวลา ผมจะไปแน่นอน", roman: "yang khráp, tàae thâa mii wee-laa, phǒm jà pai nâae-nawn", translation: l("Not yet, but if I have time I will definitely go.", "Pas encore, mais si j'ai le temps j'irai certainement.", "Noch nicht, aber wenn ich Zeit habe, gehe ich bestimmt.") },
    ],
  },
];
