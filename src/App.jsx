import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Zap,
  RotateCcw,
  Keyboard,
  Target,
} from "lucide-react";

const GreekLearningApp = () => {
  const [mode, setMode] = useState("menu");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState("lowercase");

  // Iterative learning states for vocabulary
  const [wrongWords, setWrongWords] = useState([]);
  const [round, setRound] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [currentRoundWords, setCurrentRoundWords] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Greek keyboard layout
  const greekKeyboard = {
    lowercase: [
      ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ"],
      ["ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π"],
      ["ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"],
      ["ς"], // final sigma
    ],
    breathing: [
      ["ἀ", "ἐ", "ἠ", "ἰ", "ὀ", "ὐ", "ὠ"], // smooth breathing (lenis)
      ["ἁ", "ἑ", "ἡ", "ἱ", "ὁ", "ὑ", "ὡ"], // rough breathing (asper)
      ["ἄ", "ἔ", "ἤ", "ἴ", "ὄ", "ὔ", "ὤ"], // smooth + acute
      ["ἅ", "ἕ", "ἥ", "ἵ", "ὅ", "ὕ", "ὥ"], // rough + acute
      ["ἂ", "ἒ", "ἢ", "ἲ", "ὂ", "ὒ", "ὢ"], // smooth + grave
      ["ἃ", "ἓ", "ἣ", "ἳ", "ὃ", "ὓ", "ὣ"], // rough + grave
    ],
    accents: [
      ["ά", "έ", "ή", "ί", "ό", "ύ", "ώ"], // acute
      ["ὰ", "ὲ", "ὴ", "ὶ", "ὸ", "ὺ", "ὼ"], // grave
      ["ᾶ", "ῆ", "ῖ", "ῦ", "ῶ"], // circumflex
      ["ᾳ", "ῃ", "ῳ"], // iota subscript (plain)
      ["ᾴ", "ῄ", "ῴ"], // iota subscript + acute
      ["ᾲ", "ῂ", "ῲ"], // iota subscript + grave
      ["ᾷ", "ῇ", "ῷ"], // iota subscript + circumflex
    ],
    capitals: [
      ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ"],
      ["Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π"],
      ["Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"],
    ],
    capitalsPlus: [
      ["Ἀ", "Ἐ", "Ἠ", "Ἰ", "Ὀ", "Ὠ"], // capitals with smooth breathing
      ["Ἁ", "Ἑ", "Ἡ", "Ἱ", "Ὁ", "Ὑ", "Ὡ"], // capitals with rough breathing
      ["Ἄ", "Ἔ", "Ἤ", "Ἴ", "Ὄ", "Ὤ"], // capitals smooth + acute
      ["Ἅ", "Ἕ", "Ἥ", "Ἵ", "Ὅ", "Ὕ", "Ὥ"], // capitals rough + acute
    ],
  };

  // Verb conjugation data
  const verbLessons = [
    {
      id: 1,
      title: "Present Active (λύω - I release)",
      intro: "The foundation verb - master this pattern!",
      forms: [
        { name: "1st Sg.", form: "λύω", meaning: "I release" },
        { name: "2nd Sg.", form: "λύεις", meaning: "you release" },
        { name: "3rd Sg.", form: "λύει", meaning: "he/she/it releases" },
        { name: "1st Pl.", form: "λύομεν", meaning: "we release" },
        { name: "2nd Pl.", form: "λύετε", meaning: "you (all) release" },
        { name: "3rd Pl.", form: "λύουσι(ν)", meaning: "they release" },
      ],
    },
    {
      id: 2,
      title: "Present Middle/Passive (λύω)",
      intro: "Same verb, different voice - reflexive or passive!",
      forms: [
        {
          name: "1st Sg.",
          form: "λύομαι",
          meaning: "I release (for myself) / I am released",
        },
        {
          name: "2nd Sg.",
          form: "λύῃ",
          meaning: "you release (yourself) / you are released",
        },
        {
          name: "3rd Sg.",
          form: "λύεται",
          meaning: "he/she releases (self) / is released",
        },
        {
          name: "1st Pl.",
          form: "λυόμεθα",
          meaning: "we release (ourselves) / we are released",
        },
        { name: "2nd Pl.", form: "λύεσθε", meaning: "you (all) are released" },
        {
          name: "3rd Pl.",
          form: "λύονται",
          meaning: "they release (selves) / they are released",
        },
      ],
    },
    {
      id: 3,
      title: "Imperfect Active (ἔλυον - I was releasing)",
      intro: "Past continuous - augment + endings!",
      forms: [
        { name: "1st Sg.", form: "ἔλυον", meaning: "I was releasing" },
        { name: "2nd Sg.", form: "ἔλυες", meaning: "you were releasing" },
        {
          name: "3rd Sg.",
          form: "ἔλυε(ν)",
          meaning: "he/she/it was releasing",
        },
        { name: "1st Pl.", form: "ἐλύομεν", meaning: "we were releasing" },
        {
          name: "2nd Pl.",
          form: "ἐλύετε",
          meaning: "you (all) were releasing",
        },
        { name: "3rd Pl.", form: "ἔλυον", meaning: "they were releasing" },
      ],
    },
    {
      id: 4,
      title: "Aorist Active (ἔλυσα - I released)",
      intro: "Simple past - the workhorse tense!",
      forms: [
        { name: "1st Sg.", form: "ἔλυσα", meaning: "I released" },
        { name: "2nd Sg.", form: "ἔλυσας", meaning: "you released" },
        { name: "3rd Sg.", form: "ἔλυσε(ν)", meaning: "he/she/it released" },
        { name: "1st Pl.", form: "ἐλύσαμεν", meaning: "we released" },
        { name: "2nd Pl.", form: "ἐλύσατε", meaning: "you (all) released" },
        { name: "3rd Pl.", form: "ἔλυσαν", meaning: "they released" },
      ],
    },
    {
      id: 5,
      title: "Future Active (λύσω - I will release)",
      intro: "Looking ahead - add sigma!",
      forms: [
        { name: "1st Sg.", form: "λύσω", meaning: "I will release" },
        { name: "2nd Sg.", form: "λύσεις", meaning: "you will release" },
        { name: "3rd Sg.", form: "λύσει", meaning: "he/she/it will release" },
        { name: "1st Pl.", form: "λύσομεν", meaning: "we will release" },
        { name: "2nd Pl.", form: "λύσετε", meaning: "you (all) will release" },
        { name: "3rd Pl.", form: "λύσουσι(ν)", meaning: "they will release" },
      ],
    },
    {
      id: 6,
      title: "εἰμί (I am) - Present",
      intro: "THE most irregular verb - memorize it!",
      forms: [
        { name: "1st Sg.", form: "εἰμί", meaning: "I am" },
        { name: "2nd Sg.", form: "εἶ", meaning: "you are" },
        { name: "3rd Sg.", form: "ἐστί(ν)", meaning: "he/she/it is" },
        { name: "1st Pl.", form: "ἐσμέν", meaning: "we are" },
        { name: "2nd Pl.", form: "ἐστέ", meaning: "you (all) are" },
        { name: "3rd Pl.", form: "εἰσί(ν)", meaning: "they are" },
      ],
    },
    {
      id: 7,
      title: "Contract Verbs -έω (ποιέω - I do/make)",
      intro: "ε + ε/ει contracts to ει!",
      forms: [
        { name: "1st Sg.", form: "ποιῶ", meaning: "I do, make" },
        { name: "2nd Sg.", form: "ποιεῖς", meaning: "you do, make" },
        { name: "3rd Sg.", form: "ποιεῖ", meaning: "he/she/it does, makes" },
        { name: "1st Pl.", form: "ποιοῦμεν", meaning: "we do, make" },
        { name: "2nd Pl.", form: "ποιεῖτε", meaning: "you (all) do, make" },
        { name: "3rd Pl.", form: "ποιοῦσι(ν)", meaning: "they do, make" },
      ],
    },
    {
      id: 8,
      title: "Contract Verbs -άω (τιμάω - I honor)",
      intro: "α + ω/ο contracts differently!",
      forms: [
        { name: "1st Sg.", form: "τιμῶ", meaning: "I honor" },
        { name: "2nd Sg.", form: "τιμᾷς", meaning: "you honor" },
        { name: "3rd Sg.", form: "τιμᾷ", meaning: "he/she/it honors" },
        { name: "1st Pl.", form: "τιμῶμεν", meaning: "we honor" },
        { name: "2nd Pl.", form: "τιμᾶτε", meaning: "you (all) honor" },
        { name: "3rd Pl.", form: "τιμῶσι(ν)", meaning: "they honor" },
      ],
    },
  ];

  // Declension data
  const declensionLessons = [
    {
      id: 1,
      title: "Second Declension Masculine (ὁ ἄνθρωπος)",
      intro: "The bread and butter of Greek nouns!",
      cases: [
        {
          name: "Nominative Sg.",
          form: "ὁ ἄνθρωπος",
          meaning: "the man (subject)",
        },
        {
          name: "Accusative Sg.",
          form: "τὸν ἄνθρωπον",
          meaning: "the man (object)",
        },
        { name: "Genitive Sg.", form: "τοῦ ἀνθρώπου", meaning: "of the man" },
        { name: "Dative Sg.", form: "τῷ ἀνθρώπῳ", meaning: "to/for the man" },
        {
          name: "Nominative Pl.",
          form: "οἱ ἄνθρωποι",
          meaning: "the men (subject)",
        },
        {
          name: "Accusative Pl.",
          form: "τοὺς ἀνθρώπους",
          meaning: "the men (object)",
        },
        { name: "Genitive Pl.", form: "τῶν ἀνθρώπων", meaning: "of the men" },
        {
          name: "Dative Pl.",
          form: "τοῖς ἀνθρώποις",
          meaning: "to/for the men",
        },
      ],
    },
    {
      id: 2,
      title: "Second Declension Neuter (τὸ ἔργον)",
      intro: "Neuter nouns - nom/acc are always the same!",
      cases: [
        {
          name: "Nominative Sg.",
          form: "τὸ ἔργον",
          meaning: "the work (subject)",
        },
        {
          name: "Accusative Sg.",
          form: "τὸ ἔργον",
          meaning: "the work (object)",
        },
        { name: "Genitive Sg.", form: "τοῦ ἔργου", meaning: "of the work" },
        { name: "Dative Sg.", form: "τῷ ἔργῳ", meaning: "to/for the work" },
        {
          name: "Nominative Pl.",
          form: "τὰ ἔργα",
          meaning: "the works (subject)",
        },
        {
          name: "Accusative Pl.",
          form: "τὰ ἔργα",
          meaning: "the works (object)",
        },
        { name: "Genitive Pl.", form: "τῶν ἔργων", meaning: "of the works" },
        {
          name: "Dative Pl.",
          form: "τοῖς ἔργοις",
          meaning: "to/for the works",
        },
      ],
    },
    {
      id: 3,
      title: "First Declension Feminine (ἡ θάλαττα)",
      intro: "Master the -α/-η patterns!",
      cases: [
        {
          name: "Nominative Sg.",
          form: "ἡ θάλαττα",
          meaning: "the sea (subject)",
        },
        {
          name: "Accusative Sg.",
          form: "τὴν θάλατταν",
          meaning: "the sea (object)",
        },
        { name: "Genitive Sg.", form: "τῆς θαλάττης", meaning: "of the sea" },
        { name: "Dative Sg.", form: "τῇ θαλάττῃ", meaning: "to/for the sea" },
        {
          name: "Nominative Pl.",
          form: "αἱ θάλατται",
          meaning: "the seas (subject)",
        },
        {
          name: "Accusative Pl.",
          form: "τὰς θαλάττας",
          meaning: "the seas (object)",
        },
        { name: "Genitive Pl.", form: "τῶν θαλαττῶν", meaning: "of the seas" },
        {
          name: "Dative Pl.",
          form: "ταῖς θαλάτταις",
          meaning: "to/for the seas",
        },
      ],
    },
    {
      id: 4,
      title: "Third Declension (ὁ πατήρ - father)",
      intro: "Consonant stems - trickier but very common!",
      cases: [
        {
          name: "Nominative Sg.",
          form: "ὁ πατήρ",
          meaning: "the father (subject)",
        },
        {
          name: "Accusative Sg.",
          form: "τὸν πατέρα",
          meaning: "the father (object)",
        },
        { name: "Genitive Sg.", form: "τοῦ πατρός", meaning: "of the father" },
        { name: "Dative Sg.", form: "τῷ πατρί", meaning: "to/for the father" },
        {
          name: "Nominative Pl.",
          form: "οἱ πατέρες",
          meaning: "the fathers (subject)",
        },
        {
          name: "Accusative Pl.",
          form: "τοὺς πατέρας",
          meaning: "the fathers (object)",
        },
        {
          name: "Genitive Pl.",
          form: "τῶν πατέρων",
          meaning: "of the fathers",
        },
        {
          name: "Dative Pl.",
          form: "τοῖς πατράσι(ν)",
          meaning: "to/for the fathers",
        },
      ],
    },
    {
      id: 5,
      title: "Third Declension (ἡ πόλις - city)",
      intro: "ι-stems are everywhere in Greek!",
      cases: [
        {
          name: "Nominative Sg.",
          form: "ἡ πόλις",
          meaning: "the city (subject)",
        },
        {
          name: "Accusative Sg.",
          form: "τὴν πόλιν",
          meaning: "the city (object)",
        },
        { name: "Genitive Sg.", form: "τῆς πόλεως", meaning: "of the city" },
        { name: "Dative Sg.", form: "τῇ πόλει", meaning: "to/for the city" },
        {
          name: "Nominative Pl.",
          form: "αἱ πόλεις",
          meaning: "the cities (subject)",
        },
        {
          name: "Accusative Pl.",
          form: "τὰς πόλεις",
          meaning: "the cities (object)",
        },
        { name: "Genitive Pl.", form: "τῶν πόλεων", meaning: "of the cities" },
        {
          name: "Dative Pl.",
          form: "ταῖς πόλεσι(ν)",
          meaning: "to/for the cities",
        },
      ],
    },
    {
      id: 6,
      title: "Adjectives 2-1-2 (καλός καλή καλόν)",
      intro: "Good, beautiful - learn to decline adjectives!",
      cases: [
        {
          name: "Nom. Sg. M.",
          form: "καλός",
          meaning: "good/beautiful (masc)",
        },
        { name: "Nom. Sg. F.", form: "καλή", meaning: "good/beautiful (fem)" },
        {
          name: "Nom. Sg. N.",
          form: "καλόν",
          meaning: "good/beautiful (neut)",
        },
        { name: "Gen. Sg. M.", form: "καλοῦ", meaning: "of good (masc)" },
        { name: "Gen. Sg. F.", form: "καλῆς", meaning: "of good (fem)" },
        { name: "Gen. Sg. N.", form: "καλοῦ", meaning: "of good (neut)" },
        { name: "Nom. Pl. M.", form: "καλοί", meaning: "good (masc pl)" },
        { name: "Nom. Pl. N.", form: "καλά", meaning: "good (neut pl)" },
      ],
    },
  ];

  // Vocabulary lessons
  const vocabularyLessons = [
    {
      id: 1,
      title: "Section 1A: Complete Vocabulary",
      words: [
        { greek: "ἀκούουσιν", english: "they hear" },
        { greek: "βαίνει", english: "he goes" },
        { greek: "βλέπει", english: "he looks" },
        { greek: "βλέπουσιν", english: "they look" },
        { greek: "δὲ", english: "and, but" },
        { greek: "εἰς", english: "to, into" },
        { greek: "εἰς Εὔβοιαν", english: "to euboia" },
        { greek: "εἰς τὸ πλοῖον", english: "onto the ship" },
        { greek: "εἰς Χίον", english: "to chios" },
        { greek: "εἰσβαίνει", english: "he embarks" },
        { greek: "εἰσβαίνουσιν", english: "they embark" },
        { greek: "ἐν", english: "in, on" },
        { greek: "ἐν Βυζαντίῳ", english: "in byzantium" },
        { greek: "ἐν Εὐβοίᾳ", english: "in euboia" },
        { greek: "ἐν Χίῳ", english: "in chios" },
        { greek: "ἐξαίφνης", english: "suddenly" },
        { greek: "ἔπειτα", english: "then, next" },
        { greek: "ἐστιν", english: "it, there is" },
        { greek: "καὶ", english: "and" },
        { greek: "καὶ … καὶ", english: "both … and" },
        { greek: "μὲν … δὲ", english: "on the one hand … on the other" },
        { greek: "ὁ", english: "the" },
        { greek: "ὁ κυβερνήτης", english: "the captain, helmsman" },
        { greek: "ὁ ραψωδός", english: "the rhapsode" },
        { greek: "oἱ", english: "the" },
        { greek: "oἱ ναῦται", english: "the sailors, crew" },
        { greek: "ὁρᾷ", english: "he sees" },
        { greek: "ὁρῶσιν", english: "they see" },
        { greek: "οὖν", english: "so, really, therefore" },
        { greek: "πλεῖ", english: "it sails" },
        { greek: "πρὸς", english: "towards" },
        { greek: "πρὸς τὰς Ἀθήνας", english: "towards athens" },
        { greek: "πρὸς τὴν γήν", english: "towards land" },
        { greek: "πρὸς τὸν Πειραιᾶ", english: "towards the peiraieus" },
        { greek: "τε … καὶ", english: "both … and" },
        { greek: "τέλος", english: "finally" },
        { greek: "τὴν", english: "the" },
        { greek: "τὴν ἀκρόπολιν", english: "the acropolis" },
        { greek: "τί;", english: "what?" },
        { greek: "τὸν", english: "the" },
        { greek: "τὸν Παρθενῶνα", english: "the parthenon" },
        { greek: "τὸ", english: "the" },
        { greek: "τὸ πλοῖον", english: "the ship, vessel" },
        { greek: "ψόφον", english: "a noise" },
      ],
    },
    {
      id: 2,
      title: "Section 1B: Complete Vocabulary",
      words: [
        { greek: "ἀκούω", english: "i hear" },
        { greek: "ἀκούεις", english: "you hear" },
        { greek: "ἀκούομεν", english: "we hear" },
        { greek: "ἄκουε", english: "listen!" },
        { greek: "ἀληθῆ", english: "the truth" },
        { greek: "ἀλλά", english: "but" },
        { greek: "ἆρα", english: "question" },
        { greek: "αὖθις", english: "again" },
        { greek: "βλέπε", english: "look!" },
        { greek: "γὰρ", english: "for" },
        { greek: "δεῦρο", english: "here, over here" },
        { greek: "ἐγὼ", english: "i" },
        { greek: "ἔγωγε", english: "i at least" },
        { greek: "ἐλθέ", english: "come!" },
        { greek: "ἐστιν", english: "it is" },
        { greek: "ἡ ἀκρόπολις", english: "the acropolis" },
        { greek: "ἡμεῖς", english: "we" },
        { greek: "ἰδού", english: "here! hey! look!" },
        { greek: "καὶ", english: "and, also" },
        { greek: "καλός", english: "beautiful" },
        { greek: "καλὴ", english: "beautiful" },
        { greek: "καλόν", english: "beautiful" },
        { greek: "κυβερνῆτα", english: "captain" },
        { greek: "κυβερνήτης", english: "captain" },
        { greek: "λέγεις", english: "you are speaking" },
        { greek: "μὰ Δία", english: "by zeus" },
        { greek: "μὴ", english: "do not" },
        { greek: "ναί", english: "yes" },
        { greek: "νῦν", english: "now" },
        { greek: "ὁ Παρθενών", english: "the parthenon" },
        { greek: "ὁ Πειραιεύς", english: "the peiraieus" },
        { greek: "ὁρῶ", english: "i see" },
        { greek: "ὁρᾷς", english: "you see" },
        { greek: "οὐ", english: "no" },
        { greek: "οὐδὲν", english: "nothing" },
        { greek: "οὖν", english: "so, really, therefore" },
        { greek: "οὐχ", english: "not" },
        { greek: "ὁ ψόφος", english: "the noise" },
        { greek: "ποῦ;", english: "where?" },
        { greek: "σαφῶς", english: "clearly" },
        { greek: "σὺ", english: "you" },
        { greek: "τὴν ἀκρόπολιν", english: "the acropolis" },
        { greek: "τίς;", english: "what? who?" },
        { greek: "τὸ νεῶριον", english: "the naval dockyard" },
        { greek: "τὸν Παρθενῶνα", english: "the parthenon" },
        { greek: "τὸν Πειραιᾶ", english: "the peiraieus" },
        { greek: "τὸν ψόφον", english: "the noise" },
        { greek: "φρόντιζε", english: "worry!" },
        { greek: "ψόφος", english: "a noise" },
        { greek: "ὦ", english: "o" },
        { greek: "ὡς", english: "how!" },
      ],
    },
    {
      id: 3,
      title: "Section 1C: Complete Vocabulary",
      words: [
        { greek: "αἱ", english: "the" },
        { greek: "αἱ ὁλκάδες", english: "the merchant ships" },
        { greek: "βαίνετε", english: "you are going" },
        { greek: "βλέπετε", english: "look!" },
        { greek: "διὰ τί;", english: "why?" },
        { greek: "Δικαιόπολι", english: "dikaiopolis" },
        { greek: "εἰσιν", english: "they are" },
        { greek: "ἔλθετε", english: "come!" },
        { greek: "ἐστι(ν)", english: "they are" },
        { greek: "Ζηνόθεμι", english: "zenothemis" },
        { greek: "καλ-αί", english: "beautiful, fine" },
        { greek: "καλ-ά", english: "beautiful, fine" },
        { greek: "καταβαίνομεν", english: "we go down" },
        { greek: "κάτωθεν", english: "from below" },
        { greek: "λέγε", english: "say!" },
        { greek: "μένετε", english: "you stay" },
        { greek: "ὁρῶμεν", english: "we see" },
        { greek: "ὁρᾶτε", english: "you see" },
        { greek: "οὐκ", english: "not" },
        { greek: "πόθεν;", english: "from where?" },
        { greek: "ποῖ;", english: "where to?" },
        { greek: "Πόσειδον", english: "poseidon (god of the sea)" },
        { greek: "τὰ", english: "the" },
        { greek: "τὰ ἐμπόρια", english: "the markets" },
        { greek: "τὰς", english: "the" },
        { greek: "τὰς ὁλκάδας", english: "the merchant ships" },
        { greek: "τί μήν;", english: "so what?; of course" },
        { greek: "ὑμεῖς", english: "you" },
        { greek: "φίλοι", english: "friends" },
        { greek: "φροντίζετε", english: "worry!" },
      ],
    },
    {
      id: 4,
      title: "Section 1D-E: Placeholder",
      words: [
        { greek: "φέρω", english: "i carry", hint: "Transfer" },
        { greek: "ἄγω", english: "i lead", hint: "Pedagogue" },
        { greek: "ποιέω", english: "i do", hint: "Poet makes" },
        { greek: "εἰμί", english: "i am", hint: "Essential verb!" },
        { greek: "ἔχω", english: "i have", hint: "Hold, possess" },
        { greek: "γάρ", english: "for", hint: "Explanation" },
        { greek: "μέν", english: "on one hand", hint: "Balance" },
        { greek: "ὁ δοῦλος", english: "the slave", hint: "Servant" },
        { greek: "ὁ δεσπότης", english: "the master", hint: "Despot" },
        { greek: "κελεύω", english: "i order", hint: "Command" },
      ],
    },
    {
      id: 5,
      title: "Section 1G-H: Ships & Navigation",
      words: [
        {
          greek: "ὁ κυβερνήτης",
          english: "the captain",
          hint: "Cyber = steer",
        },
        { greek: "ὁ ναύκληρος", english: "ship-owner", hint: "Nautical clerk" },
        { greek: "μένω", english: "i wait", hint: "Remain" },
        { greek: "πλέω", english: "i sail", hint: "Navigate" },
        { greek: "ὁ ἐμπορος", english: "merchant", hint: "Emporium" },
        { greek: "τὸ φορτίον", english: "cargo", hint: "Portable goods" },
        { greek: "οἶδα", english: "i know", hint: "Perfect = I have seen" },
        { greek: "βούλομαι", english: "i want", hint: "Desire" },
        { greek: "δύναμαι", english: "i can", hint: "Dynamic" },
        { greek: "ὅτι", english: "that", hint: "Introduces clause" },
      ],
    },
    {
      id: 6,
      title: "Section 1I-J: Around Athens",
      words: [
        { greek: "ἡ Ἀθήνη", english: "athens", hint: "The city!" },
        { greek: "ὁ Πειραιεύς", english: "piraeus", hint: "Athens port" },
        { greek: "ἡ ἀγορά", english: "marketplace", hint: "Agora" },
        { greek: "ἡ ἀκρόπολις", english: "acropolis", hint: "High city" },
        { greek: "ὁ Παρθενών", english: "parthenon", hint: "Famous temple" },
        { greek: "καλός", english: "beautiful", hint: "Calligraphy" },
        { greek: "ἀγαθός", english: "good", hint: "Virtue" },
        { greek: "κακός", english: "bad", hint: "Cacophony" },
        { greek: "μέγας", english: "big", hint: "Mega" },
        { greek: "μικρός", english: "small", hint: "Micro" },
      ],
    },
    {
      id: 7,
      title: "Section 2A-B: Legal Drama",
      words: [
        { greek: "ὁ δικαστής", english: "juror", hint: "Judge" },
        {
          greek: "τὸ δικαστήριον",
          english: "law-court",
          hint: "Where justice happens",
        },
        { greek: "ἡ δίκη", english: "lawsuit", hint: "Justice case" },
        { greek: "ὁ ῥήτωρ", english: "orator", hint: "Rhetoric" },
        { greek: "λαμβάνω", english: "i take", hint: "Grab, receive" },
        { greek: "ἀδικέω", english: "i do wrong", hint: "Injustice" },
        { greek: "ἀποκτείνω", english: "i kill", hint: "Deadly" },
        { greek: "πείθω", english: "i persuade", hint: "Convince" },
        { greek: "ἄδικος", english: "unjust", hint: "Not just" },
        { greek: "δίκαιος", english: "just", hint: "Fair, right" },
      ],
    },
    {
      id: 8,
      title: "Section 2C-D: Politics & Rhetoric",
      words: [
        { greek: "ὁ λόγος", english: "word", hint: "Logic, -logy" },
        { greek: "λέγω", english: "i say", hint: "Lecture" },
        { greek: "ὁ νόμος", english: "law", hint: "Autonomy" },
        { greek: "ἡ πόλις", english: "city-state", hint: "Politics" },
        { greek: "ὁ πολίτης", english: "citizen", hint: "Political person" },
        { greek: "κρίνω", english: "i judge", hint: "Critic" },
        { greek: "νομίζω", english: "i think", hint: "Custom/law based" },
        { greek: "δοκέω", english: "i seem", hint: "It seems..." },
        { greek: "χρή", english: "it is necessary", hint: "Impersonal" },
        { greek: "δεινός", english: "terrible", hint: "Dual meaning!" },
      ],
    },
    {
      id: 9,
      title: "Section 3A-B: Family & Home",
      words: [
        { greek: "ὁ πατήρ", english: "father", hint: "Paternal" },
        { greek: "ἡ μήτηρ", english: "mother", hint: "Maternal" },
        { greek: "ὁ υἱός", english: "son", hint: "Offspring" },
        { greek: "ἡ θυγάτηρ", english: "daughter", hint: "Female child" },
        { greek: "ἡ οἰκία", english: "house", hint: "Economy = house-law" },
        { greek: "ὁ οἶκος", english: "household", hint: "Eco-" },
        { greek: "εἰσέρχομαι", english: "i enter", hint: "Into-come" },
        { greek: "ἐξέρχομαι", english: "i go out", hint: "Exit" },
        { greek: "γίγνομαι", english: "i become", hint: "Genesis" },
        { greek: "παῖς", english: "child", hint: "Pedagogue" },
      ],
    },
    {
      id: 10,
      title: "Section 3C-D: War & Peace",
      words: [
        { greek: "ὁ πόλεμος", english: "war", hint: "Polemic" },
        { greek: "ἡ εἰρήνη", english: "peace", hint: "Irenic" },
        { greek: "ὁ στρατηγός", english: "general", hint: "Strategy" },
        { greek: "ὁ στρατιώτης", english: "soldier", hint: "Army man" },
        { greek: "μάχομαι", english: "i fight", hint: "Battle" },
        { greek: "νικάω", english: "i conquer", hint: "Nike = victory" },
        { greek: "ἡττάομαι", english: "i am defeated", hint: "Lose" },
        { greek: "σῴζω", english: "i save", hint: "Soteriology" },
        { greek: "ἀποθνῄσκω", english: "i die", hint: "Thanatos" },
        { greek: "κίνδυνος", english: "danger", hint: "Risk" },
      ],
    },
    {
      id: 11,
      title: "Section 3E: Final Essentials",
      words: [
        { greek: "ὁ χρόνος", english: "time", hint: "Chronology" },
        { greek: "ὁ τόπος", english: "place", hint: "Topography" },
        { greek: "ὁ λόγος", english: "reason", hint: "Logic" },
        { greek: "ἡ ψυχή", english: "soul", hint: "Psychology" },
        { greek: "τὸ σῶμα", english: "body", hint: "Somatic" },
        { greek: "ζητέω", english: "i seek", hint: "Search for" },
        { greek: "εὑρίσκω", english: "i find", hint: "Heuristic" },
        { greek: "δείκνυμι", english: "i show", hint: "Demonstrate" },
        { greek: "πρᾶγμα", english: "thing", hint: "Pragmatic" },
        { greek: "χρῆμα", english: "money", hint: "Chrematistics" },
      ],
    },
  ];

  const generateDeclensionQuiz = (lesson) => {
    const questions = lesson.cases.map((c) => ({
      question: `What is the ${c.name} of ${
        lesson.title.split("(")[1].split(")")[0]
      }?`,
      answer: c.form,
      hint: c.meaning,
      caseName: c.name,
    }));
    return shuffleArray(questions).slice(0, 5);
  };

  const generateVerbQuiz = (lesson) => {
    const questions = lesson.forms.map((f) => ({
      question: `Conjugate ${
        lesson.title.split("(")[1]?.split(")")[0] || lesson.title.split("(")[0]
      } in the ${f.name}`,
      answer: f.form,
      hint: f.meaning,
      formName: f.name,
    }));
    return shuffleArray(questions).slice(0, 5);
  };

  const generateVocabQuiz = (wordsToQuiz) => {
    // For iterative learning: use ALL words, don't slice to 5
    const questions = wordsToQuiz.map((w) => ({
      question: `What does "${w.greek}" mean?`,
      answer: w.english.toLowerCase(),
      greek: w.greek,
      wordData: w, // Store word data for tracking wrong answers
    }));
    return shuffleArray(questions);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const insertGreekChar = (char) => {
    setUserAnswer((prev) => prev + char);
  };

  const handleBackspace = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const handleAnswer = (quiz) => {
    const correctAnswer = quiz[currentQuestion].answer.toLowerCase().trim();
    const userInput = userAnswer.toLowerCase().trim();

    // Check if answer is empty
    if (userInput === "") {
      setFeedback({
        type: "incorrect",
        message: "Enter an answer!",
        hint: "Use the keyboard or click on the Greek letters",
      });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const isCorrect =
      userInput === correctAnswer ||
      correctAnswer.includes(userInput) ||
      userInput
        .replace(/[άἀἁἄἅὰᾶ]/g, "α")
        .replace(/[έἐἑἔἕὲ]/g, "ε")
        .replace(/[ήἠἡἤἥὴῆ]/g, "η")
        .replace(/[ίἰἱἴἵὶῖ]/g, "ι")
        .replace(/[όὀὁὄὅὸ]/g, "ο")
        .replace(/[ύὐὑὔὕὺῦ]/g, "υ")
        .replace(/[ώὠὡὤὥὼῶ]/g, "ω") ===
        correctAnswer
          .replace(/[άἀἁἄἅὰᾶ]/g, "α")
          .replace(/[έἐἑἔἕὲ]/g, "ε")
          .replace(/[ήἠἡἤἥὴῆ]/g, "η")
          .replace(/[ίἰἱἴἵὶῖ]/g, "ι")
          .replace(/[όὀὁὄὅὸ]/g, "ο")
          .replace(/[ύὐὑὔὕὺῦ]/g, "υ")
          .replace(/[ώὠὡὤὥὼῶ]/g, "ω");

    if (isCorrect) {
      setScore(score + 10);
      setStreak(streak + 1);
      setFeedback({ type: "correct", message: "✨ Ἄριστα! (Excellent!)" });
      // Track correct answer
      setAnsweredQuestions((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = true;
        return newAnswers;
      });
    } else {
      setStreak(0);
      // For vocabulary with iterative learning, track wrong words
      if (
        selectedLesson.type === "vocabulary" &&
        quiz[currentQuestion].wordData
      ) {
        setWrongWords((prev) => [...prev, quiz[currentQuestion].wordData]);
      }
      setFeedback({
        type: "incorrect",
        message: `Not quite! The answer is: ${quiz[currentQuestion].answer}`,
        hint: quiz[currentQuestion].hint,
      });
      // Track incorrect answer
      setAnsweredQuestions((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = false;
        return newAnswers;
      });
    }

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer("");
        setFeedback(null);
      } else {
        // End of round - check if we need another round for vocabulary
        if (selectedLesson.type === "vocabulary" && wrongWords.length > 0) {
          setMode("roundComplete");
        } else {
          setMode("results");
        }
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswer("");
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setWrongWords([]);
    setRound(1);
    setCurrentRoundWords([]);
    setAnsweredQuestions([]);
  };

  const startLesson = (type, lessonId) => {
    resetQuiz();
    let lesson, quiz;

    if (type === "declension") {
      lesson = declensionLessons.find((l) => l.id === lessonId);
      quiz = generateDeclensionQuiz(lesson);
      setSelectedLesson({ type, lesson, quiz });
    } else if (type === "vocabulary") {
      lesson = vocabularyLessons.find((l) => l.id === lessonId);
      setTotalWords(lesson.words.length);
      setCurrentRoundWords(lesson.words);
      quiz = generateVocabQuiz(lesson.words);
      setSelectedLesson({ type, lesson, quiz });
    } else if (type === "verbs") {
      lesson = verbLessons.find((l) => l.id === lessonId);
      quiz = generateVerbQuiz(lesson);
      setSelectedLesson({ type, lesson, quiz });
    }

    setMode("quiz");
  };

  const startNextRound = () => {
    // Start new round with only the words that were wrong
    setRound(round + 1);
    setCurrentQuestion(0);
    setUserAnswer("");
    setFeedback(null);
    setAnsweredQuestions([]);

    const newQuiz = generateVocabQuiz(wrongWords);
    setCurrentRoundWords(wrongWords);
    setWrongWords([]); // Clear for the new round
    setSelectedLesson((prev) => ({ ...prev, quiz: newQuiz }));
    setMode("quiz");
  };

  // Menu View
  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-indigo-900 mb-2">
              Χαῖρε! (Welcome!)
            </h1>
            <p className="text-xl text-indigo-700">
              Your Daily Classical Greek Practice
            </p>
            <p className="text-sm text-indigo-600 mt-2">
              Aligned with JACT Reading Greek
            </p>
            <p className="text-xs text-indigo-500 mt-1">
              ✨ Complete virtual keyboard with all diacritics!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-purple-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Declension Drills
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Master noun endings with interactive practice
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {declensionLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => startLesson("declension", lesson.id)}
                    className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-purple-900 text-sm">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-purple-700">
                      {lesson.intro}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-amber-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Vocabulary Flash
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Quick vocab quizzes from Reading Greek
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {vocabularyLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => startLesson("vocabulary", lesson.id)}
                    className="w-full text-left p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-amber-900 text-sm">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-amber-700">
                      {lesson.words.length} essential words
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="text-emerald-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Verb Conjugations
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Practice your tenses and voices
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {verbLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => startLesson("verbs", lesson.id)}
                    className="w-full text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-emerald-900 text-sm">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-emerald-700">
                      {lesson.intro}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📚 Study Tips
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• The complete vocabularies use iterative learning.</li>
              <li>
                • Virtual keyboard includes Greek punctuation: ano teleia (·)
                and question mark (;)
              </li>
              <li>• Practice 5-10 minutes daily for best retention</li>
              <li>• Start with declensions, then verbs, then vocabulary</li>
              <li>• Say forms out loud to build muscle memory</li>
              <li>• For verbs: memorize principal parts of common verbs</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Round Complete View (between vocabulary rounds)
  if (mode === "roundComplete") {
    const masteredThisRound = currentRoundWords.length - wrongWords.length;
    const totalMastered = totalWords - wrongWords.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Round {round} Complete!
            </h2>

            <div className="mb-6 space-y-2">
              <p className="text-lg text-gray-700">
                You mastered{" "}
                <span className="font-bold text-green-600">
                  {masteredThisRound}
                </span>{" "}
                out of{" "}
                <span className="font-bold">{currentRoundWords.length}</span>{" "}
                words this round
              </p>
              <p className="text-xl font-bold text-indigo-600">
                Overall: {totalMastered}/{totalWords} words mastered
              </p>
              <p className="text-md text-gray-600">
                {wrongWords.length} words need more practice
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(totalMastered / totalWords) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startNextRound}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Continue - Round {round + 1}
              </button>
              <button
                onClick={() => setMode("menu")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if (mode === "quiz" && selectedLesson) {
    const quiz = selectedLesson.quiz;
    const question = quiz[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setMode("menu")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              ← Back to Menu
            </button>
            <div className="flex gap-4 items-center">
              {selectedLesson.type === "vocabulary" && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                  <Target className="text-indigo-500" size={20} />
                  <span className="font-bold text-gray-800">Round {round}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Trophy className="text-amber-500" size={20} />
                <span className="font-bold text-gray-800">{score}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Zap className="text-orange-500" size={20} />
                <span className="font-bold text-gray-800">{streak} streak</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-indigo-600">
                  Question {currentQuestion + 1} of {quiz.length}
                  {selectedLesson.type === "vocabulary" &&
                    ` (${currentRoundWords.length} words this round)`}
                </span>
                <div className="flex gap-1">
                  {quiz.map((_, idx) => {
                    const wasAnswered = answeredQuestions[idx] !== undefined;
                    const wasCorrect = answeredQuestions[idx] === true;
                    const isCurrent = idx === currentQuestion;

                    let colorClass = "bg-gray-200"; // Not answered yet
                    if (isCurrent) {
                      colorClass = "bg-indigo-500"; // Current question
                    } else if (wasAnswered) {
                      colorClass = wasCorrect ? "bg-green-400" : "bg-red-400"; // Green if correct, red if wrong
                    }

                    return (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${colorClass}`}
                      />
                    );
                  })}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {question.question}
              </h2>
              {question.hint && (
                <p className="text-sm text-gray-500 italic">
                  Hint: {question.hint}
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onFocus={() => setShowKeyboard(true)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !feedback && handleAnswer(quiz)
                  }
                  placeholder="Type your answer or use the keyboard below..."
                  className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  autoFocus
                  disabled={!!feedback}
                />
                <button
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Keyboard size={24} />
                </button>
              </div>
            </div>

            {showKeyboard && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <button
                    onClick={() => setKeyboardMode("lowercase")}
                    className={`px-3 py-1 rounded text-sm ${
                      keyboardMode === "lowercase"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    lowercase
                  </button>
                  <button
                    onClick={() => setKeyboardMode("breathing")}
                    className={`px-3 py-1 rounded text-sm ${
                      keyboardMode === "breathing"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    breathing
                  </button>
                  <button
                    onClick={() => setKeyboardMode("accents")}
                    className={`px-3 py-1 rounded text-sm ${
                      keyboardMode === "accents"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    accents
                  </button>
                  <button
                    onClick={() => setKeyboardMode("capitals")}
                    className={`px-3 py-1 rounded text-sm ${
                      keyboardMode === "capitals"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    CAPITALS
                  </button>
                  <button
                    onClick={() => setKeyboardMode("capitalsPlus")}
                    className={`px-3 py-1 rounded text-sm ${
                      keyboardMode === "capitalsPlus"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    CAPITALS+
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 ml-auto text-sm"
                  >
                    ⌫ Delete
                  </button>
                </div>

                <div className="space-y-2">
                  {greekKeyboard[keyboardMode].map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-2 justify-center">
                      {row.map((char, charIdx) => (
                        <button
                          key={charIdx}
                          onClick={() => insertGreekChar(char)}
                          className="px-4 py-2 bg-white hover:bg-indigo-50 border border-gray-300 rounded font-greek text-lg min-w-[40px]"
                          disabled={!!feedback}
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  ))}
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      onClick={() => insertGreekChar(" ")}
                      className="px-20 py-2 bg-white hover:bg-indigo-50 border border-gray-300 rounded text-sm"
                      disabled={!!feedback}
                    >
                      SPACE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {feedback && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  feedback.type === "correct"
                    ? "bg-green-100 border-2 border-green-400"
                    : "bg-red-100 border-2 border-red-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === "correct" ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <XCircle className="text-red-600" size={24} />
                  )}
                  <p
                    className={`font-semibold ${
                      feedback.type === "correct"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {feedback.message}
                  </p>
                </div>
                {feedback.hint && (
                  <p className="text-sm text-gray-700 mt-2">
                    💡 {feedback.hint}
                  </p>
                )}
              </div>
            )}

            {!feedback && (
              <button
                onClick={() => handleAnswer(quiz)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (mode === "results") {
    const isMastery =
      selectedLesson.type === "vocabulary" && wrongWords.length === 0;
    const percentage = (score / (selectedLesson.quiz.length * 10)) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-8xl mb-4">{isMastery ? "🏆" : "✨"}</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {isMastery
                ? "Complete Mastery!"
                : percentage === 100
                ? "Ἄριστα! Perfect!"
                : percentage >= 80
                ? "Εὖ γε! Well done!"
                : percentage >= 60
                ? "Καλῶς! Good!"
                : "Keep practicing!"}
            </h2>

            {isMastery && (
              <div className="mb-6">
                <p className="text-2xl font-bold text-green-600 mb-2">
                  All {totalWords} words mastered!
                </p>
                <p className="text-lg text-gray-700">
                  Completed in {round} round{round > 1 ? "s" : ""}
                </p>
              </div>
            )}

            <p className="text-5xl font-bold text-indigo-600 mb-8">
              {score} points
            </p>

            <div className="space-y-3">
              <button
                onClick={() =>
                  startLesson(selectedLesson.type, selectedLesson.lesson.id)
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Practice Again
              </button>
              <button
                onClick={() => setMode("menu")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default GreekLearningApp;
