// Seeds the full ThaiMastery curriculum: 2 courses, 19 levels, ~120 lessons,
// 19 exams, achievements and demo accounts (admin + student).
// Run with: npm run db:seed

import { PrismaClient, LessonType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { l, quizFromVocab, reverseQuizFromVocab, type L, type Vocab } from "./seed-data/helpers";
import { speakingLevels } from "./seed-data/speaking";
import { writingLevels } from "./seed-data/writing";

const prisma = new PrismaClient();

interface LessonSeed {
  type: LessonType;
  day: number;
  minutes: number;
  xpReward: number;
  title: L;
  content: unknown[];
}

function speakingLessons(level: (typeof speakingLevels)[number]): LessonSeed[] {
  const vc = level.vocab;
  return [
    {
      type: "LESSON",
      day: 1,
      minutes: 6,
      xpReward: 20,
      title: l("Daily Lesson: New Words & Dialogue", "Leçon du jour : mots et dialogue", "Tageslektion: Wörter & Dialog"),
      content: [
        { type: "text", body: level.intro },
        { type: "vocab", items: vc },
        { type: "dialogue", lines: level.dialogue },
        {
          type: "tip",
          body: l(
            "Listen to each word with the audio button, repeat it aloud twice, then read the dialogue out loud.",
            "Écoutez chaque mot avec le bouton audio, répétez-le deux fois à voix haute, puis lisez le dialogue à voix haute.",
            "Höre dir jedes Wort mit dem Audio-Button an, sprich es zweimal laut nach und lies dann den Dialog laut.",
          ),
        },
      ],
    },
    {
      type: "VOCABULARY",
      day: 1,
      minutes: 4,
      xpReward: 15,
      title: l("Daily Vocabulary: Flashcards", "Vocabulaire du jour : cartes mémoire", "Tagesvokabeln: Karteikarten"),
      content: [{ type: "flashcards", items: vc }],
    },
    {
      type: "SPEAKING",
      day: 2,
      minutes: 5,
      xpReward: 20,
      title: l("Speaking Practice", "Pratique orale", "Sprechübung"),
      content: [
        {
          type: "speaking",
          prompts: level.dialogue.map((d) => ({ thai: d.thai, roman: d.roman, translation: d.translation })),
        },
      ],
    },
    {
      type: "LISTENING",
      day: 2,
      minutes: 4,
      xpReward: 15,
      title: l("Listening Practice", "Compréhension orale", "Hörübung"),
      content: [
        {
          type: "tip",
          body: l(
            "Play each word at slow speed first, then normal speed. Can you recognise it before reading the translation?",
            "Écoutez chaque mot d'abord lentement, puis à vitesse normale. Le reconnaissez-vous avant de lire la traduction ?",
            "Spiele jedes Wort erst langsam, dann in normaler Geschwindigkeit ab. Erkennst du es, bevor du die Übersetzung liest?",
          ),
        },
        { type: "vocab", items: vc },
      ],
    },
    {
      type: "QUIZ",
      day: 3,
      minutes: 4,
      xpReward: 25,
      title: l("Daily Quiz", "Quiz du jour", "Tagesquiz"),
      content: [{ type: "quiz", questions: [...quizFromVocab(vc, 4), ...reverseQuizFromVocab(vc, 3)] }],
    },
    {
      type: "REVIEW",
      day: 3,
      minutes: 3,
      xpReward: 10,
      title: l("Daily Review", "Révision du jour", "Tageswiederholung"),
      content: [
        {
          type: "text",
          body: l(
            "One last pass before the exam: flip through all the flashcards and read the dialogue aloud one more time.",
            "Un dernier passage avant l'examen : revoyez toutes les cartes et relisez le dialogue à voix haute.",
            "Ein letzter Durchgang vor der Prüfung: Gehe alle Karteikarten durch und lies den Dialog noch einmal laut.",
          ),
        },
        { type: "flashcards", items: vc },
      ],
    },
  ];
}

function writingLessons(level: (typeof writingLevels)[number]): LessonSeed[] {
  const vc: Vocab[] = level.vocab;
  const lessons: LessonSeed[] = [
    {
      type: "LESSON",
      day: 1,
      minutes: 6,
      xpReward: 20,
      title: l("Daily Lesson: New Characters", "Leçon du jour : nouveaux caractères", "Tageslektion: Neue Zeichen"),
      content: [
        { type: "text", body: level.intro },
        ...(level.characters.length ? [{ type: "tracing", characters: level.characters }] : []),
        { type: "vocab", items: vc },
      ],
    },
  ];
  if (level.characters.length) {
    lessons.push({
      type: "WRITING",
      day: 1,
      minutes: 5,
      xpReward: 20,
      title: l("Interactive Tracing", "Traçage interactif", "Interaktives Nachzeichnen"),
      content: [
        {
          type: "tip",
          body: l(
            "Start each letter at its little circle (the head). Trace each character until the outline feels natural.",
            "Commencez chaque lettre par son petit cercle (la tête). Tracez chaque caractère jusqu'à ce que le geste devienne naturel.",
            "Beginne jeden Buchstaben an seinem kleinen Kreis (dem Kopf). Zeichne jedes Zeichen nach, bis die Bewegung natürlich wird.",
          ),
        },
        { type: "tracing", characters: level.characters },
      ],
    });
  }
  lessons.push(
    {
      type: "LESSON",
      day: 2,
      minutes: 5,
      xpReward: 15,
      title: l("Reading Practice", "Pratique de lecture", "Leseübung"),
      content: [
        {
          type: "tip",
          body: l(
            "Read each word aloud, then check yourself with the audio. Cover the romanisation with your hand for an extra challenge.",
            "Lisez chaque mot à voix haute, puis vérifiez avec l'audio. Cachez la romanisation avec la main pour corser l'exercice.",
            "Lies jedes Wort laut und überprüfe dich mit dem Audio. Verdecke die Umschrift mit der Hand für eine Extra-Herausforderung.",
          ),
        },
        { type: "vocab", items: vc },
        { type: "flashcards", items: vc },
      ],
    },
    {
      type: "QUIZ",
      day: 3,
      minutes: 4,
      xpReward: 25,
      title: l("Recognition Quiz", "Quiz de reconnaissance", "Erkennungsquiz"),
      content: [{ type: "quiz", questions: [...quizFromVocab(vc, 4), ...reverseQuizFromVocab(vc, 2)] }],
    },
    {
      type: "REVIEW",
      day: 3,
      minutes: 3,
      xpReward: 10,
      title: l("Daily Review", "Révision du jour", "Tageswiederholung"),
      content: [{ type: "flashcards", items: vc }],
    },
  );
  return lessons;
}

const ACHIEVEMENTS = [
  { code: "FIRST_LESSON", icon: "🌱", xp: 25, title: l("First Steps", "Premiers pas", "Erste Schritte"), description: l("Complete your first lesson", "Terminez votre première leçon", "Schließe deine erste Lektion ab") },
  { code: "TEN_LESSONS", icon: "📚", xp: 50, title: l("Bookworm", "Rat de bibliothèque", "Bücherwurm"), description: l("Complete 10 lessons", "Terminez 10 leçons", "Schließe 10 Lektionen ab") },
  { code: "FIFTY_LESSONS", icon: "🎓", xp: 150, title: l("Scholar", "Érudit", "Gelehrter"), description: l("Complete 50 lessons", "Terminez 50 leçons", "Schließe 50 Lektionen ab") },
  { code: "STREAK_7", icon: "🔥", xp: 75, title: l("On Fire", "En feu", "Feuer und Flamme"), description: l("Reach a 7-day streak", "Atteignez une série de 7 jours", "Erreiche eine 7-Tage-Serie") },
  { code: "STREAK_30", icon: "🌋", xp: 250, title: l("Unstoppable", "Inarrêtable", "Unaufhaltsam"), description: l("Reach a 30-day streak", "Atteignez une série de 30 jours", "Erreiche eine 30-Tage-Serie") },
  { code: "FIRST_EXAM", icon: "✅", xp: 50, title: l("Level Up", "Niveau supérieur", "Level Up"), description: l("Pass your first exam", "Réussissez votre premier examen", "Bestehe deine erste Prüfung") },
  { code: "FIVE_EXAMS", icon: "🏅", xp: 150, title: l("Exam Machine", "Machine à examens", "Prüfungsmaschine"), description: l("Pass 5 exams", "Réussissez 5 examens", "Bestehe 5 Prüfungen") },
  { code: "XP_1000", icon: "⭐", xp: 50, title: l("Rising Star", "Étoile montante", "Aufsteigender Stern"), description: l("Earn 1,000 XP", "Gagnez 1 000 XP", "Verdiene 1.000 XP") },
  { code: "XP_5000", icon: "🌟", xp: 150, title: l("Superstar", "Superstar", "Superstar"), description: l("Earn 5,000 XP", "Gagnez 5 000 XP", "Verdiene 5.000 XP") },
  { code: "FIRST_CERTIFICATE", icon: "📜", xp: 300, title: l("Certified", "Certifié", "Zertifiziert"), description: l("Earn your first certificate", "Obtenez votre premier certificat", "Erhalte dein erstes Zertifikat") },
  { code: "BOTH_CERTIFICATES", icon: "👑", xp: 500, title: l("Thai Master", "Maître du thaï", "Thai-Meister"), description: l("Earn both course certificates", "Obtenez les deux certificats", "Erhalte beide Kurszertifikate") },
];

async function main() {
  console.log("Seeding ThaiMastery…");

  // ── Courses & levels ────────────────────────────────────────────────────────
  const speaking = await prisma.course.upsert({
    where: { kind: "SPEAKING" },
    update: {},
    create: {
      kind: "SPEAKING",
      slug: "master-spoken-thai",
      order: 1,
      title: l("Master Spoken Thai", "Maîtriser le thaï parlé", "Gesprochenes Thai meistern"),
      tagline: l("Speak Thai fluently in less than 60 days", "Parlez thaï couramment en moins de 60 jours", "Sprich fließend Thai in weniger als 60 Tagen"),
      description: l(
        "9 progressive levels from greetings to fluent conversation, with daily 15–20 minute lessons, native audio, speaking practice and interactive quizzes.",
        "9 niveaux progressifs des salutations à la conversation fluide, avec des leçons quotidiennes de 15–20 minutes, de l'audio natif, de la pratique orale et des quiz interactifs.",
        "9 progressive Level von Begrüßungen bis zur fließenden Konversation, mit täglichen 15–20-Minuten-Lektionen, Muttersprachler-Audio, Sprechübungen und interaktiven Quizzen.",
      ),
    },
  });

  const writing = await prisma.course.upsert({
    where: { kind: "WRITING" },
    update: {},
    create: {
      kind: "WRITING",
      slug: "master-thai-reading-writing",
      order: 2,
      title: l("Master Thai Reading & Writing", "Maîtriser la lecture et l'écriture du thaï", "Thai lesen & schreiben meistern"),
      tagline: l("Read & write Thai in less than 60 days", "Lisez et écrivez le thaï en moins de 60 jours", "Lies und schreibe Thai in weniger als 60 Tagen"),
      description: l(
        "From the Thai alphabet to short stories: consonants, vowels, tone marks, interactive character tracing, spelling and reading practice.",
        "De l'alphabet thaï aux petites histoires : consonnes, voyelles, marques de tons, traçage interactif des caractères, orthographe et lecture.",
        "Vom thailändischen Alphabet bis zu Kurzgeschichten: Konsonanten, Vokale, Tonzeichen, interaktives Nachzeichnen, Rechtschreibung und Leseübungen.",
      ),
    },
  });

  for (const [ci, defs] of [
    [speaking.id, speakingLevels] as const,
    [writing.id, writingLevels] as const,
  ]) {
    for (let i = 0; i < defs.length; i++) {
      const def = defs[i];
      const level = await prisma.level.upsert({
        where: { courseId_slug: { courseId: ci, slug: def.slug } },
        update: {},
        create: {
          courseId: ci,
          order: i + 1,
          slug: def.slug,
          title: def.title,
          description: def.description,
          xpReward: 200,
        },
      });

      const existing = await prisma.lesson.count({ where: { levelId: level.id } });
      if (existing === 0) {
        const lessons = "dialogue" in def ? speakingLessons(def) : writingLessons(def);
        for (let j = 0; j < lessons.length; j++) {
          const ls = lessons[j];
          await prisma.lesson.create({
            data: {
              levelId: level.id,
              order: j + 1,
              day: ls.day,
              type: ls.type,
              minutes: ls.minutes,
              xpReward: ls.xpReward,
              title: ls.title,
              content: ls.content as object[],
            },
          });
        }
      }

      const questions = [...quizFromVocab(def.vocab, 6, 21 + i), ...reverseQuizFromVocab(def.vocab, 4, 31 + i)];
      await prisma.exam.upsert({
        where: { levelId: level.id },
        update: {},
        create: {
          levelId: level.id,
          passScore: 80,
          title: l(
            `Level ${i + 1} Exam: ${def.title.en}`,
            `Examen du niveau ${i + 1} : ${def.title.fr}`,
            `Prüfung Level ${i + 1}: ${def.title.de}`,
          ),
          questions: questions as unknown as object[],
        },
      });
    }
  }

  // ── Achievements ────────────────────────────────────────────────────────────
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({ where: { code: a.code }, update: {}, create: a });
  }

  // ── Demo accounts ───────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin1234!", 12);
  await prisma.user.upsert({
    where: { email: "admin@thaimastery.app" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@thaimastery.app",
      name: "Admin",
      role: "ADMIN",
      plan: "LIFETIME",
      passwordHash: adminHash,
      emailVerified: new Date(),
    },
  });

  const demoHash = await bcrypt.hash("demo1234!", 12);
  await prisma.user.upsert({
    where: { email: "demo@thaimastery.app" },
    update: {},
    create: {
      email: "demo@thaimastery.app",
      name: "Demo Student",
      role: "STUDENT",
      plan: "YEARLY",
      passwordHash: demoHash,
      emailVerified: new Date(),
    },
  });

  console.log("Seed complete ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
