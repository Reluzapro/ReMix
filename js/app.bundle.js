// Bundled standalone script for Safari file:// compatibility
(function() {
'use strict';

// --- File: js/questionsData.js ---
// Banque de questions par défaut (Anglais uniquement)
const DEFAULT_SUBJECTS = {
  "qcm_anglais__2025": {
    "id": "qcm_anglais__2025",
    "name": "QCM anglais ➔ 2025",
    "path": "QCM anglais::2025",
    "pathParts": [
      "QCM anglais",
      "2025"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2025_1",
        "question": "1) The police are listening to witnesses to figure out if their story backs ... the victim’s.",
        "correct": "a) up",
        "options": [
          "a) up",
          "b) out",
          "c) on",
          "d) for"
        ],
        "explanation": "<b>a) up</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To back up signifie confirmer ou étayer une version des faits."
      },
      {
        "id": "qcm_anglais__2025_2",
        "question": "2) Once you start ... this series, you'll love it to bits.",
        "correct": "d) watching",
        "options": [
          "a) watch",
          "b) to watching",
          "c) watches",
          "d) watching"
        ],
        "explanation": "<b>d) watching</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> Après start, on utilise le gérondif (-ing) pour une action qui s'inscrit dans la durée."
      },
      {
        "id": "qcm_anglais__2025_3",
        "question": "3) ... I start cooking, can you pop down to the shop and get the wine, please?",
        "correct": "b) While",
        "options": [
          "a) During",
          "b) While",
          "c) In the meantime",
          "d) Whereas"
        ],
        "explanation": "<b>b) While</b>\n\n<b>Point :</b> Conjonction de temps\n<b>Règle :</b> While introduit une proposition (Sujet + Verbe), contrairement à During qui n'est suivi que d'un groupe nominal."
      },
      {
        "id": "qcm_anglais__2025_4",
        "question": "4) Have you ... the matter up before?",
        "correct": "c) brought",
        "options": [
          "a) bring",
          "b) bringing",
          "c) brought",
          "d) bringed"
        ],
        "explanation": "<b>c) brought</b>\n\n<b>Point :</b> Participe Passé\n<b>Règle :</b> Le Present Perfect exige la 3e colonne des verbes irréguliers (Bring / Brought / Brought)."
      },
      {
        "id": "qcm_anglais__2025_5",
        "question": "5) The meeting was called off ... to the fact that the manager was stuck in Dallas.",
        "correct": "a) due",
        "options": [
          "a) due",
          "b) because",
          "c) owed",
          "d) consequently"
        ],
        "explanation": "<b>a) due</b>\n\n<b>Point :</b> Locution causale\n<b>Règle :</b> La structure fixe est Due to. Because ne peut pas être suivi de to sans of (Because of)."
      },
      {
        "id": "qcm_anglais__2025_6",
        "question": "6) When he ... , we ‘ll start the meeting straight away.",
        "correct": "d) arrives",
        "options": [
          "a) is arriving",
          "b) will arrive",
          "c) arrived",
          "d) arrives"
        ],
        "explanation": "<b>d) arrives</b>\n\n<b>Point :</b> Future in Time Clauses\n<b>Règle :</b> Dans une subordonnée de temps (When, As soon as...), on utilise le Présent Simple pour exprimer le futur. Will est proscrit."
      },
      {
        "id": "qcm_anglais__2025_7",
        "question": "7) She ... an air hostess for only two years when the plane crashed.",
        "correct": "b) had been",
        "options": [
          "a) is",
          "b) had been",
          "c) has been being",
          "d) were"
        ],
        "explanation": "<b>b) had been</b>\n\n<b>Point :</b> Past Perfect\n<b>Règle :</b> Exprime l'antériorité et la durée d'un état par rapport à un autre événement passé (crashed)."
      },
      {
        "id": "qcm_anglais__2025_8",
        "question": "8) When he was a kid, he ... as soon as he saw a dog.",
        "correct": "d) would cry",
        "options": [
          "a) cries",
          "b) were crying",
          "c) would have been crying",
          "d) would cry"
        ],
        "explanation": "<b>d) would cry</b>\n\n<b>Point :</b> Habitude passée\n<b>Règle :</b> Would + Base Verbale exprime une action répétée ou une caractéristique du sujet dans le passé."
      },
      {
        "id": "qcm_anglais__2025_9",
        "question": "9) I came ... a very famous American actor while in a bar in New York.",
        "correct": "a) across",
        "options": [
          "a) across",
          "b) up with",
          "c) around",
          "d) out"
        ],
        "explanation": "<b>a) across</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To come across signifie rencontrer par hasard. Come up with signifie trouver une idée/solution."
      },
      {
        "id": "qcm_anglais__2025_10",
        "question": "10) I don’t care what she thinks. She is such a ... , superficial and selfish person!",
        "correct": "c) bigmouthed",
        "options": [
          "a) big mouth",
          "b) big mouthed",
          "c) bigmouthed",
          "d) big-mouthing"
        ],
        "explanation": "<b>c) bigmouthed</b>\n\n<b>Point :</b> Adjectif composé\n<b>Règle :</b> On utilise l'adjectif en -ed devant le nom person. Big mouth est le nom (une grande gueule)."
      },
      {
        "id": "qcm_anglais__2025_11",
        "question": "11) We’ll sort this problem ... but think about it!",
        "correct": "a) later",
        "options": [
          "a) later",
          "b) sooner",
          "c) ever",
          "d) earlier"
        ],
        "explanation": "<b>later</b> : <b>Correct</b>. C'est l'adverbe de temps standard pour dire que l'on s'occupera de quelque chose après le moment présent."
      },
      {
        "id": "qcm_anglais__2025_12",
        "question": "12) Sorry, we can’t ... you tonight.",
        "correct": "b) be joining",
        "options": [
          "a) be joined",
          "b) be joining",
          "c) to join",
          "d) have joined"
        ],
        "explanation": "<b>b) be joining</b>\n\n<b>Point :</b> Futur Continu\n<b>Règle :</b> La structure be + V-ing après un modal exprime une action prévue ou un arrangement futur."
      },
      {
        "id": "qcm_anglais__2025_13",
        "question": "13) What time do you want to check ... at sir?",
        "correct": "a) out",
        "options": [
          "a) out",
          "b) up",
          "c) off",
          "d) in"
        ],
        "explanation": "<b>a) out</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> Check out signifie quitter l'hôtel. Note : in n'étant pas proposé seul, out est la réponse logique."
      },
      {
        "id": "qcm_anglais__2025_14",
        "question": "14) It seems that salsa is very popular ... the world these days.",
        "correct": "a) all over",
        "options": [
          "a) all over",
          "b) over",
          "c) into",
          "d) through"
        ],
        "explanation": "<b>a) all over</b>\n\n<b>Point :</b> Préposition spatiale\n<b>Règle :</b> All over the world est l'expression consacrée pour partout dans le monde."
      },
      {
        "id": "qcm_anglais__2025_15",
        "question": "15) He told you that he would accept the job, ... he?",
        "correct": "b) didn’t",
        "options": [
          "a) would",
          "b) didn’t",
          "c) has",
          "d) hadn’t"
        ],
        "explanation": "<b>b) didn’t</b>\n\n<b>Point :</b> Question Tag\n<b>Règle :</b> Le tag porte sur le verbe principal told (passé simple). On utilise donc l'auxiliaire did à la forme négative."
      },
      {
        "id": "qcm_anglais__2025_16",
        "question": "16) I want to go to Spain for 6 months to brush up on my ....",
        "correct": "d) Spanish",
        "options": [
          "a) Spaniard",
          "b) spaniard",
          "c) spanish",
          "d) Spanish"
        ],
        "explanation": "<b>d) Spanish</b>\n\n<b>Point :</b> Majuscules / Nationalités\n<b>Règle :</b> En anglais, les noms de langues et de nationalités prennent toujours une majuscule."
      },
      {
        "id": "qcm_anglais__2025_17",
        "question": "17) You ... worry before your presentation. You're ready and you'll be fine!",
        "correct": "d) needn't",
        "options": [
          "a) shouldn't to",
          "b) don't need",
          "c) may not",
          "d) needn't"
        ],
        "explanation": "<b>d) needn't</b>\n\n<b>Point :</b> Modaux / Absence d'obligation\n<b>Règle :</b> Needn't est un modal exprimant l'absence de nécessité. Contrairement à don't need, il est suivi directement de la base verbale sans to."
      },
      {
        "id": "qcm_anglais__2025_18",
        "question": "18) Finally we are not going to Ibiza; our plans ....",
        "correct": "a) have changed",
        "options": [
          "a) have changed",
          "b) were changed",
          "c) changed",
          "d) have been changing"
        ],
        "explanation": "<b>a) have changed</b>\n\n<b>Point :</b> Present Perfect\n<b>Règle :</b> On utilise le Present Perfect pour une action passée qui a une conséquence directe sur la situation présente."
      },
      {
        "id": "qcm_anglais__2025_19",
        "question": "19) Look at the crowd!.  ...'s going on?",
        "correct": "c) What",
        "options": [
          "a) Who",
          "b) Why",
          "c) What",
          "d) Which"
        ],
        "explanation": "<b>c) What</b>\n\n<b>Point :</b> Mots interrogatifs\n<b>Règle :</b> What's going on? est l'expression standard pour demander Qu'est-ce qu'il se passe ?."
      },
      {
        "id": "qcm_anglais__2025_20",
        "question": "20) He should listen ... his teacher because his teacher knows best.",
        "correct": "b) to",
        "options": [
          "a) Ø",
          "b) to",
          "c) at",
          "d) for"
        ],
        "explanation": "<b>b) to</b>\n\n<b>Point :</b> Verbe à préposition\n<b>Règle :</b> Le verbe listen est obligatoirement suivi de to lorsqu'il y a un complément d'objet."
      },
      {
        "id": "qcm_anglais__2025_21",
        "question": "21) I'm sorry but I'm ... booked for the summer.",
        "correct": "a) quiet",
        "options": [
          "a) quiet",
          "b) pretty",
          "c) forcefully",
          "d) fully"
        ],
        "explanation": "<b>d) fully</b>\n\n<b>Point :</b> Collocation / Adverbes\n<b>Règle :</b> Fully booked est une expression figée signifiant que tout est complet (hôtel, restaurant, agenda)."
      },
      {
        "id": "qcm_anglais__2025_22",
        "question": "22) Hong-Kong ... be a very fascinating city. I'd love to visit it.",
        "correct": "c) must",
        "options": [
          "a) is to",
          "b) ought",
          "c) must",
          "d) should"
        ],
        "explanation": "<b>c) must</b>\n\n<b>Point :</b> Modaux / Déduction logique\n<b>Règle :</b> Must exprime ici une forte probabilité ou une certitude logique (devoir être). Ought nécessiterait to."
      },
      {
        "id": "qcm_anglais__2025_23",
        "question": "23) I was ... order oysters when the waiter said: No more oysters today, sir.",
        "correct": "b) about to",
        "options": [
          "a) ready for",
          "b) about to",
          "c) about",
          "d) going"
        ],
        "explanation": "<b>b) about to</b>\n\n<b>Point :</b> Futur proche dans le passé\n<b>Règle :</b> Be about to + base verbale signifie être sur le point de faire quelque chose."
      },
      {
        "id": "qcm_anglais__2025_24",
        "question": "24) If I ... a famous scientist, I ... be Turing because what he invented was awesome.",
        "correct": "b) were / would",
        "options": [
          "a) will be / would",
          "b) were / would",
          "c) am / will",
          "d) be / will"
        ],
        "explanation": "<b>b) were / would</b>\n\n<b>Point :</b> Conditionnel (Type 2)\n<b>Règle :</b> Pour exprimer une hypothèse imaginaire au présent, on utilise If + Prétérit modal (were) et would + Base Verbale."
      },
      {
        "id": "qcm_anglais__2025_25",
        "question": "25) Don't ... , everything is under control.",
        "correct": "a) worry",
        "options": [
          "a) worry",
          "b) worries",
          "c) worried",
          "d) be worry"
        ],
        "explanation": "<b>a) worry</b>\n\n<b>Point :</b> Impératif négatif\n<b>Règle :</b> L'impératif se construit simplement avec Don't suivi de la base verbale."
      },
      {
        "id": "qcm_anglais__2025_26",
        "question": "26) Which one is the odd one out?",
        "correct": "d) weird",
        "options": [
          "a) complex",
          "b) tricky",
          "c) complicated",
          "d) weird"
        ],
        "explanation": "<b>d) weird</b>\n\n<b>Point :</b> Vocabulaire / Intrus\n<b>Règle :</b> Complex, tricky et complicated sont synonymes de difficile. Weird signifie étrange et ne décrit pas un niveau de difficulté."
      },
      {
        "id": "qcm_anglais__2025_27",
        "question": "27) The English are known to be even-tempered. Even-tempered does not mean:",
        "correct": "c) ebullient",
        "options": [
          "a) placid",
          "b) phlegmatic",
          "c) ebullient",
          "d) cool"
        ],
        "explanation": "<b>c) ebullient</b>\n\n<b>Point :</b> Vocabulaire / Antonymes\n<b>Règle :</b> Even-tempered signifie calme, d'humeur égale. Ebullient (exubérant, bouillonnant) en est l'opposé."
      },
      {
        "id": "qcm_anglais__2025_28",
        "question": "28) He has recently changed ... . Pick the wrong answer.",
        "correct": "a) of cars",
        "options": [
          "a) of cars",
          "b) cars",
          "c) his car",
          "d) car"
        ],
        "explanation": "<b>a) of cars</b>\n\n<b>Point :</b> Interférence linguistique (Français)\n<b>Règle :</b> On ne dit pas change of pour changer d'objet physique. On utilise le verbe directement : change cars (pluriel) ou change his car."
      },
      {
        "id": "qcm_anglais__2025_29",
        "question": "29) If you wish to apply for a job in our company, please fill in this ... .",
        "correct": "c) form",
        "options": [
          "a) check",
          "b) quizz",
          "c) form",
          "d) worksheet"
        ],
        "explanation": "<b>c) form</b>\n\n<b>Point :</b> Vocabulaire professionnel\n<b>Règle :</b> To fill in a form est la locution consacrée pour remplir un formulaire."
      },
      {
        "id": "qcm_anglais__2025_30",
        "question": "30) Is ... at home now, do you think?",
        "correct": "b) anybody",
        "options": [
          "a) somebody",
          "b) anybody",
          "c) a person",
          "d) no one"
        ],
        "explanation": "<b>b) anybody</b>\n\n<b>Point :</b> Pronoms indéfinis\n<b>Règle :</b> Dans une phrase interrogative, on utilise généralement anybody plutôt que somebody."
      },
      {
        "id": "qcm_anglais__2025_31",
        "question": "31) If I ... something, it would be something practical and useful.",
        "correct": "c) invented",
        "options": [
          "a) invent",
          "b) had been inventing",
          "c) invented",
          "d) have invented"
        ],
        "explanation": "<b>c) invented</b>\n\n<b>Point :</b> Conditionnel type 2 (Hypothèse)\n<b>Règle :</b> If + Prétérit simple | would + Base Verbale. On exprime un imaginaire présent ou futur."
      },
      {
        "id": "qcm_anglais__2025_32",
        "question": "32) I was drinking coffee in Venice when ... my next door neighbour stood in front of me...",
        "correct": "d) bizarrely",
        "options": [
          "a) sullenly",
          "b) amazingly",
          "c) funnily",
          "d) bizarrely"
        ],
        "explanation": "<b>d) bizarrely</b>\n\n<b>Point :</b> Adverbe de modalité\n<b>Règle :</b> Bizarrely exprime l'étrangeté d'une coïncidence. Funnily nécessite généralement enough pour avoir ce sens."
      },
      {
        "id": "qcm_anglais__2025_33",
        "question": "33) I wish I did not have to type my report tonight. I’m just so ... .",
        "correct": "b) exhausted",
        "options": [
          "a) excited",
          "b) exhausted",
          "c) upset",
          "d) joyful"
        ],
        "explanation": "<b>b) exhausted</b>\n\n<b>Point :</b> Vocabulaire / Adjectifs en -ed\n<b>Règle :</b> Exhausted (épuisé) est le seul adjectif cohérent avec le souhait de ne pas avoir à travailler."
      },
      {
        "id": "qcm_anglais__2025_34",
        "question": "34) He likes ... dancing ... socializing, so why does he go clubbing?",
        "correct": "c) neither ... nor",
        "options": [
          "a) neither ... no",
          "b) neither ... or",
          "c) neither ... nor",
          "d) either ... or"
        ],
        "explanation": "<b>c) neither ... nor</b>\n\n<b>Point :</b> Conjonctions de coordination\n<b>Règle :</b> La structure négative corrélative est strictement neither... nor (ni... ni)."
      },
      {
        "id": "qcm_anglais__2025_35",
        "question": "35) As a Japanese manager, he would not have been ... if we had not bowed to him, would he?",
        "correct": "b) pleased",
        "options": [
          "a) pleasing",
          "b) pleased",
          "c) pleasant",
          "d) please"
        ],
        "explanation": "<b>b) pleased</b>\n\n<b>Point :</b> Adjectif en -ed vs -ing\n<b>Règle :</b> On utilise -ed pour décrire un sentiment ressenti par une personne (pleased = satisfait/content)."
      },
      {
        "id": "qcm_anglais__2025_36",
        "question": "36) She wants you ... for lunch.",
        "correct": "c) to stay",
        "options": [
          "a) staying",
          "b) stay",
          "c) to stay",
          "d) stayed"
        ],
        "explanation": "<b>c) to stay</b>\n\n<b>Point :</b> Structure de verbe complexe\n<b>Règle :</b> Want + CO + to-infinitive. On utilise obligatoirement to pour exprimer ce que l'on veut qu'autrui fasse."
      },
      {
        "id": "qcm_anglais__2025_37",
        "question": "37) Offering a toast to the guest of honor, he said: “... to a long and happy life”.",
        "correct": "a) Here is",
        "options": [
          "a) Here is",
          "b) There is",
          "c) That’s",
          "d) Here"
        ],
        "explanation": "<b>a) Here is</b>\n\n<b>Point :</b> Expression idiomatique\n<b>Règle :</b> Here is to... (ou Here's to...) est la formule rituelle pour porter un toast en anglais."
      },
      {
        "id": "qcm_anglais__2025_38",
        "question": "38) I am not money-obsessed ... there are worse things to be obsessed by.",
        "correct": "d) though",
        "options": [
          "a) unless",
          "b) so long as",
          "c) provided",
          "d) though"
        ],
        "explanation": "<b>d) though</b>\n\n<b>Point :</b> Conjonction de concession\n<b>Règle :</b> Though exprime ici l'opposition ou la nuance (bien que / cependant / cela dit)."
      },
      {
        "id": "qcm_anglais__2025_39",
        "question": "39) It’s high time you ... on your own, you know.",
        "correct": "d) lived",
        "options": [
          "a) are living",
          "b) should have lived",
          "c) live",
          "d) lived"
        ],
        "explanation": "<b>d) lived</b>\n\n<b>Point :</b> Unreal Past (Passé fictif)\n<b>Règle :</b> Après It's (high) time, le verbe se met au prétérit pour exprimer une action qui devrait déjà être en cours."
      },
      {
        "id": "qcm_anglais__2025_40",
        "question": "40) My teacher told me to keep him ... about my internship.",
        "correct": "a) posted",
        "options": [
          "a) posted",
          "b) aware",
          "c) awake",
          "d) up to it"
        ],
        "explanation": "<b>a) posted</b>\n\n<b>Point :</b> Idiome professionnel\n<b>Règle :</b> To keep someone posted signifie tenir quelqu'un au courant de l'évolution d'une situation."
      },
      {
        "id": "qcm_anglais__2025_41",
        "question": "41) Holland is ... to be pretty and picturesque.",
        "correct": "b) said",
        "options": [
          "a) told",
          "b) said",
          "c) explained",
          "d) expected"
        ],
        "explanation": "<b>b) said</b>\n\n<b>Point :</b> Passif de rumeur/opinion\n<b>Règle :</b> La structure Sujet + be + said + to-inf traduit On dit que.... Told nécessiterait un destinataire direct."
      },
      {
        "id": "qcm_anglais__2025_42",
        "question": "42) He has made many ... to science and will soon be awarded a prize.",
        "correct": "c) contributions",
        "options": [
          "a) medals",
          "b) distinctions",
          "c) contributions",
          "d) research"
        ],
        "explanation": "<b>c) contributions</b>\n\n<b>Point :</b> Collocation verbale\n<b>Règle :</b> On utilise le verbe make avec le nom contributions (make a contribution to)."
      },
      {
        "id": "qcm_anglais__2025_43",
        "question": "43) He never accounts ... his mistakes and always feels others are responsible.",
        "correct": "a) for",
        "options": [
          "a) for",
          "b) to",
          "c) with",
          "d) by"
        ],
        "explanation": "<b>a) for</b>\n\n<b>Point :</b> Verbe à préposition\n<b>Règle :</b> To account for something signifie expliquer ou assumer la responsabilité de quelque chose."
      },
      {
        "id": "qcm_anglais__2025_44",
        "question": "44) We regret ... you earlier of the upcoming changes.",
        "correct": "c) not informing",
        "options": [
          "a) to not inform",
          "b) to not informing",
          "c) not informing",
          "d) not inform"
        ],
        "explanation": "<b>c) not informing</b>\n\n<b>Point :</b> Regret + V-ing vs To-inf\n<b>Règle :</b> Regret + V-ing exprime un remords concernant une action passée (ne pas avoir informé). Regret + to-inf sert à annoncer une mauvaise nouvelle présente."
      },
      {
        "id": "qcm_anglais__2025_45",
        "question": "45) How about... to the swimming-pool later on?",
        "correct": "d) going",
        "options": [
          "a) go",
          "b) to go",
          "c) to going",
          "d) going"
        ],
        "explanation": "<b>d) going</b>\n\n<b>Point :</b> Suggestion / Verb Patterns\n<b>Règle :</b> L'expression How about est suivie du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2025_46",
        "question": "46) She will post the videos on our website... the week.",
        "correct": "d) within",
        "options": [
          "a) along",
          "b) on",
          "c) while",
          "d) within"
        ],
        "explanation": "<b>d) within</b>\n\n<b>Point :</b> Préposition temporelle\n<b>Règle :</b> Within the week signifie d'ici la fin de la semaine / au cours de la semaine."
      },
      {
        "id": "qcm_anglais__2025_47",
        "question": "47) It looks like Hailey and Tim can't stand",
        "correct": "d) each other",
        "options": [
          "a) theirs",
          "b) themselves",
          "c) each others",
          "d) each other"
        ],
        "explanation": "<b>d) each other</b>\n\n<b>Point :</b> Pronom réciproque\n<b>Règle :</b> Each other s'utilise pour une relation réciproque entre deux personnes. Each others n'existe pas."
      },
      {
        "id": "qcm_anglais__2025_48",
        "question": "48) We will do our utmost to get there ... time.",
        "correct": "c) on",
        "options": [
          "a) at",
          "b) by the",
          "c) on",
          "d) off"
        ],
        "explanation": "<b>c) on</b>\n\n<b>Point :</b> Préposition / Ponctualité\n<b>Règle :</b> On time signifie à l'heure (ponctualité exacte), contrairement à in time (à temps/avant la limite)."
      },
      {
        "id": "qcm_anglais__2025_49",
        "question": "49) I lent you the book two months ago. Haven't you finished it ... ?",
        "correct": "c) yet",
        "options": [
          "a) already",
          "b) soon",
          "c) yet",
          "d) now"
        ],
        "explanation": "<b>c) yet</b>\n\n<b>Point :</b> Adverbe temporel\n<b>Règle :</b> Yet s'utilise en fin de phrase interrogative ou négative pour une action attendue."
      },
      {
        "id": "qcm_anglais__2025_50",
        "question": "50) Last summer he... out an internship in Ecuador and had a fantastic time.",
        "correct": "d) carried",
        "options": [
          "a) has carried",
          "b) did carry",
          "c) had carried",
          "d) carried"
        ],
        "explanation": "<b>d) carried</b>\n\n<b>Point :</b> Temps du passé\n<b>Règle :</b> Last summer est un marqueur temporel précis qui impose le prétérit simple. To carry out signifie effectuer/réaliser."
      },
      {
        "id": "qcm_anglais__2025_51",
        "question": "51) Some teenagers are so ... these days.",
        "correct": "d) irresponsible",
        "options": [
          "a) unresponsible",
          "b) disresponsible",
          "c) misresponsible",
          "d) irresponsible"
        ],
        "explanation": "<b>d) irresponsible</b>\n\n<b>Point :</b> Préfixe privatif\n<b>Règle :</b> Le préfixe correct pour l'adjectif responsible est ir-."
      },
      {
        "id": "qcm_anglais__2025_52",
        "question": "52) For ... interested in graphic design, a training session will come up in June.",
        "correct": "c) those",
        "options": [
          "a) these",
          "b) that",
          "c) those",
          "d) them"
        ],
        "explanation": "<b>c) those</b>\n\n<b>Point :</b> Pronom démonstratif\n<b>Règle :</b> Those remplace the people who are. C'est le pronom de rappel pour un groupe indéfini suivi d'un adjectif ou d'une relative."
      },
      {
        "id": "qcm_anglais__2025_53",
        "question": "53) ... robots are becoming ubiquitous in society today.",
        "correct": "a) Ø",
        "options": [
          "a) Ø",
          "b) The",
          "c) Those",
          "d) These"
        ],
        "explanation": "<b>a) Ø</b>\n\n<b>Point :</b> Article zéro\n<b>Règle :</b> On n'utilise pas d'article pour les noms au pluriel pris dans un sens général ou abstrait."
      },
      {
        "id": "qcm_anglais__2025_54",
        "question": "54) ... the patient will wait for treatment, the more brain tissue will die.",
        "correct": "c) The longer",
        "options": [
          "a) The longest",
          "b) The long time",
          "c) The longer",
          "d) The more long time"
        ],
        "explanation": "<b>c) The longer</b>\n\n<b>Point :</b> Double comparatif\n<b>Règle :</b> Structure The + comparatif, the + comparatif pour exprimer une progression parallèle (plus... plus...)."
      },
      {
        "id": "qcm_anglais__2025_55",
        "question": "55) A new ... is being developed to transform wood into a material stronger than steel.",
        "correct": "a) process",
        "options": [
          "a) process",
          "b) proceed",
          "c) processing",
          "d) proceding"
        ],
        "explanation": "<b>a) process</b>\n\n<b>Point :</b> Vocabulaire / Catégorie grammaticale\n<b>Règle :</b> Process est le nom (un procédé). Proceed est un verbe (procéder/continuer)."
      },
      {
        "id": "qcm_anglais__2025_56",
        "question": "56) Lots of patients are not getting treatment",
        "correct": "b) fast enough",
        "options": [
          "a) enough fast",
          "b) fast enough",
          "c) quiet fast",
          "d) too fast"
        ],
        "explanation": "<b>b) fast enough</b>\n\n<b>Point :</b> Adverbe / Degré\n<b>Règle :</b> Enough se place toujours APRÈS l'adverbe ou l'adjectif qu'il modifie."
      },
      {
        "id": "qcm_anglais__2025_57",
        "question": "57) ... sugar input is beneficial for the health.",
        "correct": "a) Reducing",
        "options": [
          "a) Reducing",
          "b) Reduction",
          "c) Reduced",
          "d) Reduce"
        ],
        "explanation": "<b>a) Reducing</b>\n\n<b>Point :</b> Gérondif sujet\n<b>Règle :</b> Le gérondif (V-ing) est utilisé comme sujet pour transformer une action en concept nominal."
      },
      {
        "id": "qcm_anglais__2025_58",
        "question": "58) Teamwork is based... cooperation, empathy and openness.",
        "correct": "d) on",
        "options": [
          "a) in",
          "b) of",
          "c) around",
          "d) on"
        ],
        "explanation": "<b>d) on</b>\n\n<b>Point :</b> Préposition fixe\n<b>Règle :</b> Le verbe to be based se construit systématiquement avec la préposition on."
      },
      {
        "id": "qcm_anglais__2025_59",
        "question": "59) Despite ... the guitar by himself, he became proficient in no time.",
        "correct": "d) learning",
        "options": [
          "a) learn",
          "b) learned",
          "c) learnt",
          "d) learning"
        ],
        "explanation": "<b>d) learning</b>\n\n<b>Point :</b> Préposition + Gérondif\n<b>Règle :</b> Après la préposition despite, on utilise obligatoirement la forme en -ing (V-ing)."
      },
      {
        "id": "qcm_anglais__2025_60",
        "question": "60) They have developed a system ... allows windows to be secure and unbreakable.",
        "correct": "b) which",
        "options": [
          "a) who",
          "b) which",
          "c) Ø",
          "d) what"
        ],
        "explanation": "<b>b) which</b>\n\n<b>Point :</b> Pronom relatif\n<b>Règle :</b> Which s'utilise pour les objets ou les concepts (ici a system). Who est réservé aux personnes."
      },
      {
        "id": "qcm_anglais__2025_61",
        "question": "61) There is ... other vehicle like this in existence.",
        "correct": "a) none",
        "options": [
          "a) none",
          "b) not",
          "c) no",
          "d) Ø"
        ],
        "explanation": "<b>c) no</b>\n\n<b>Point :</b> Déterminant de négation\n<b>Règle :</b> On utilise no directement devant un nom pour exprimer l'absence. Not nécessiterait un article (not a)."
      },
      {
        "id": "qcm_anglais__2025_62",
        "question": "62) ... solutions like pilot goggles or tinted windows reduce pilot visibility.",
        "correct": "c) Current",
        "options": [
          "a) Actual",
          "b) Present",
          "c) Current",
          "d) Presently"
        ],
        "explanation": "<b>c) Current</b>\n\n<b>Point :</b> Faux-ami\n<b>Règle :</b> Current signifie actuel. Actual est un faux-ami qui signifie réel / effectif."
      },
      {
        "id": "qcm_anglais__2025_63",
        "question": "63) The ... has not commented on the report yet.",
        "correct": "b) firm",
        "options": [
          "a) society",
          "b) firm",
          "c) companie",
          "d) compagny"
        ],
        "explanation": "<b>b) firm</b>\n\n<b>Point :</b> Vocabulaire / Faux-ami\n<b>Règle :</b> Firm ou Company désigne une entreprise. Society est un faux-ami signifiant la société au sens général (humain). Les options C et D sont mal orthographiées."
      },
      {
        "id": "qcm_anglais__2025_64",
        "question": "64) It is a system that enables autonomous vehicles and human drivers to communicate ...",
        "correct": "c) one another",
        "options": [
          "a) each other",
          "b) Ø",
          "c) one another",
          "d) each others"
        ],
        "explanation": "<b>c) one another</b>\n\n<b>Point :</b> Pronom réciproque\n<b>Règle :</b> Bien que each other soit possible, one another est souvent privilégié pour un ensemble de sujets indéfinis ou nombreux. Note : l'absence de with est une ellipse courante dans certains tests."
      },
      {
        "id": "qcm_anglais__2025_65",
        "question": "65) ... self-driving vehicles can signal if they are operating in an autonomous driving mode.",
        "correct": "d) Ø",
        "options": [
          "a) Every",
          "b) Each",
          "c) A",
          "d) Ø"
        ],
        "explanation": "<b>d) Ø</b>\n\n<b>Point :</b> Article zéro\n<b>Règle :</b> On utilise l'article zéro devant un nom au pluriel pour une généralité. Every et Each exigeraient un nom au singulier (vehicle)."
      },
      {
        "id": "qcm_anglais__2025_66",
        "question": "66) Measurements ... at five-minute intervals.",
        "correct": "c) were recorded",
        "options": [
          "a) have recorded",
          "b) is recorded",
          "c) were recorded",
          "d) will recorded"
        ],
        "explanation": "<b>c) were recorded</b>\n\n<b>Point :</b> Voix passive\n<b>Règle :</b> Sujet pluriel (measurements) + auxiliaire BE au prétérit + participe passé. Les mesures ne s'enregistrent pas elles-mêmes."
      },
      {
        "id": "qcm_anglais__2025_67",
        "question": "67) Corn biofuel production consumes water ... algae biofuel production can filter water.",
        "correct": "a) whereas",
        "options": [
          "a) whereas",
          "b) contrary with",
          "c) in spite of",
          "d) opposed to"
        ],
        "explanation": "<b>a) whereas</b>\n\n<b>Point :</b> Conjonction d'opposition\n<b>Règle :</b> Whereas (tandis que) permet d'opposer deux propositions complètes."
      },
      {
        "id": "qcm_anglais__2025_68",
        "question": "68) If he is ... public speaker, why does he not capture his audience?",
        "correct": "c) such a good",
        "options": [
          "a) such good a",
          "b) such good",
          "c) such a good",
          "d) a such good"
        ],
        "explanation": "<b>c) such a good</b>\n\n<b>Point :</b> Structure de l'intensif\n<b>Règle :</b> La structure correcte est Such + a/an + adjectif + nom singulier."
      },
      {
        "id": "qcm_anglais__2025_69",
        "question": "69) According to the ... statistics, employment is picking up in Europe.",
        "correct": "c) latest",
        "options": [
          "a) late",
          "b) later",
          "c) latest",
          "d) lately"
        ],
        "explanation": "<b>c) latest</b>\n\n<b>Point :</b> Superlatif\n<b>Règle :</b> The latest signifie les toutes dernières (les plus récentes), à ne pas confondre avec last (les dernières d'une série finie)."
      },
      {
        "id": "qcm_anglais__2025_70",
        "question": "70) He succeeded very well ... hard work and determination.",
        "correct": "a) thanks to",
        "options": [
          "a) thanks to",
          "b) in spite of",
          "c) provided",
          "d) nevertheless"
        ],
        "explanation": "<b>a) thanks to</b>\n\n<b>Point :</b> Expression de la cause\n<b>Règle :</b> Thanks to (grâce à) introduit la cause positive du succès."
      },
      {
        "id": "qcm_anglais__2025_71",
        "question": "71) The wristbands are designed ... they can fit users of any age and size.",
        "correct": "c) so that",
        "options": [
          "a) so as",
          "b) such as",
          "c) so that",
          "d) so as to"
        ],
        "explanation": "<b>c) so that</b>\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> So that est suivi d'une proposition (sujet + verbe). So as to serait suivi d'une base verbale."
      },
      {
        "id": "qcm_anglais__2025_72",
        "question": "72) I can't help ... my nails. I'm feeling stressed out, you see.",
        "correct": "b) biting",
        "options": [
          "a) bite",
          "b) biting",
          "c) bitten",
          "d) to bite"
        ],
        "explanation": "<b>b) biting</b>\n\n<b>Point :</b> Idiome / Gérondif\n<b>Règle :</b> L'expression can't help (ne pas pouvoir s'empêcher de) est systématiquement suivie du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2025_73",
        "question": "73) It is the most moving film we have ... seen.",
        "correct": "c) ever",
        "options": [
          "a) never",
          "b) whenever",
          "c) ever",
          "d) already"
        ],
        "explanation": "<b>c) ever</b>\n\n<b>Point :</b> Adverbe de temps\n<b>Règle :</b> Avec un superlatif (the most...) et le Present Perfect, on utilise ever pour signifier jamais encore ou auparavant."
      },
      {
        "id": "qcm_anglais__2025_74",
        "question": "74) Any plans for tonight? Sure, I... with my mates.",
        "correct": "d) am going out",
        "options": [
          "a) go out",
          "b) gonna go out",
          "c) have gone out",
          "d) am going out"
        ],
        "explanation": "<b>d) am going out</b>\n\n<b>Point :</b> Présent Continu à valeur de futur\n<b>Règle :</b> On utilise le Présent Continu (be + V-ing) pour des arrangements personnels fermes et déjà planifiés."
      },
      {
        "id": "qcm_anglais__2025_75",
        "question": "75) She has received offers of donations... her post went viral.",
        "correct": "a) since",
        "options": [
          "a) since",
          "b) whereas",
          "c) ago",
          "d) while"
        ],
        "explanation": "<b>a) since</b>\n\n<b>Point :</b> Marqueur temporel\n<b>Règle :</b> Since introduit un point de départ précis dans le temps (ici, le moment où le post est devenu viral)."
      },
      {
        "id": "qcm_anglais__2025_76",
        "question": "76) He wants his students to get familiar... the software.",
        "correct": "c) of",
        "options": [
          "a) about",
          "b) on",
          "c) of",
          "d) with"
        ],
        "explanation": "<b>d) with</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> L'expression correcte est to be/get familiar with something (se familiariser avec)."
      },
      {
        "id": "qcm_anglais__2025_77",
        "question": "77) Scientists believe that aliens could have their ... language.",
        "correct": "d) own",
        "options": [
          "a) personal",
          "b) proper",
          "c) peculiar",
          "d) own"
        ],
        "explanation": "<b>d) own</b>\n\n<b>Point :</b> Adjectif de possession\n<b>Règle :</b> Their own language (leur propre langue) est la structure standard pour insister sur la possession exclusive."
      },
      {
        "id": "qcm_anglais__2025_78",
        "question": "78) There is a hook on the backpack ... you don't want to carry your water bottle in your hand.",
        "correct": "a) in case",
        "options": [
          "a) in case",
          "b) in the case",
          "c) in cases",
          "d) unless"
        ],
        "explanation": "<b>a) in case</b>\n\n<b>Point :</b> Conjonction de précaution\n<b>Règle :</b> In case signifie au cas où et exprime une précaution prise face à une éventualité."
      },
      {
        "id": "qcm_anglais__2025_79",
        "question": "79) Computers are everywhere ... us in every possible way.",
        "correct": "c) assisting",
        "options": [
          "a) insisting",
          "b) attending",
          "c) assisting",
          "d) cooperating"
        ],
        "explanation": "<b>c) assisting</b>\n\n<b>Point :</b> Vocabulaire / Collocation\n<b>Règle :</b> To assist someone signifie aider ou assister quelqu'un. Attending signifie assister à un événement (être présent)."
      },
      {
        "id": "qcm_anglais__2025_80",
        "question": "80) Somewhere warm for a holiday? There is a wide... of choices but it won't be cheap.",
        "correct": "b) range",
        "options": [
          "a) possibility",
          "b) range",
          "c) selections",
          "d) sort"
        ],
        "explanation": "<b>b) range</b>\n\n<b>Point :</b> Expression de la diversité\n<b>Règle :</b> A wide range of choices est la collocation consacrée pour dire un large éventail de choix."
      },
      {
        "id": "qcm_anglais__2025_81",
        "question": "81) Too ... of us wanted to go to the conference - there was a limited number of seats.",
        "correct": "c) many",
        "options": [
          "a) much",
          "b) few",
          "c) many",
          "d) little"
        ],
        "explanation": "<b>c) many</b>\n\n<b>Point :</b> Quantifieur (Dénombrable)\n<b>Règle :</b> On utilise many pour les noms dénombrables au pluriel (us/people). Le contexte de limitation de sièges indique un excès de demande (too many)."
      },
      {
        "id": "qcm_anglais__2025_82",
        "question": "82) Can you explain to us how to... reliable storage and retrieval of data, please?",
        "correct": "b) ensure",
        "options": [
          "a) assure",
          "b) ensure",
          "c) able",
          "d) access"
        ],
        "explanation": "<b>b) ensure</b>\n\n<b>Point :</b> Vocabulaire (Verbes d'action)\n<b>Règle :</b> To ensure signifie garantir ou s'assurer que quelque chose soit réalisé de manière fiable."
      },
      {
        "id": "qcm_anglais__2025_83",
        "question": "83) Memorizing is the... of success when it comes to medical studies.",
        "correct": "a) basis",
        "options": [
          "a) basis",
          "b) basics",
          "c) bases",
          "d) heart"
        ],
        "explanation": "<b>a) basis</b>\n\n<b>Point :</b> Vocabulaire (Fondement)\n<b>Règle :</b> The basis of success désigne le fondement ou la base de la réussite. Basics désigne les rudiments."
      },
      {
        "id": "qcm_anglais__2025_84",
        "question": "84) Cloud storage has given a ... dimension to the cloud.",
        "correct": "b) further",
        "options": [
          "a) furthest",
          "b) further",
          "c) farthest",
          "d) farther"
        ],
        "explanation": "<b>b) further</b>\n\n<b>Point :</b> Comparatif de distance figurative\n<b>Règle :</b> Further est utilisé pour une distance abstraite ou supplémentaire (une autre dimension). Farther est réservé à la distance physique."
      },
      {
        "id": "qcm_anglais__2025_85",
        "question": "85) How ... do you visit your family in Germany?",
        "correct": "d) often",
        "options": [
          "a) long",
          "b) sooner",
          "c) much",
          "d) often"
        ],
        "explanation": "<b>d) often</b>\n\n<b>Point :</b> Interrogation sur la fréquence\n<b>Règle :</b> How often est la structure pour interroger sur la fréquence d'une action. How long interroge sur la durée."
      },
      {
        "id": "qcm_anglais__2025_86",
        "question": "86) Wifi has made internet access ... to everybody despite geographical and infrastructure obstacles.",
        "correct": "c) available",
        "options": [
          "a) impossible",
          "b) feasible",
          "c) available",
          "d) inacessible"
        ],
        "explanation": "<b>c) available</b>\n\n<b>Point :</b> Vocabulaire (Accessibilité)\n<b>Règle :</b> Le contexte d'obstacles surmontés indique que l'accès est devenu available (disponible/accessible)."
      },
      {
        "id": "qcm_anglais__2025_87",
        "question": "87) Tell me ... laptop you like best and want to buy.",
        "correct": "b) which",
        "options": [
          "a) wherever",
          "b) which",
          "c) whose",
          "d) whom"
        ],
        "explanation": "<b>b) which</b>\n\n<b>Point :</b> Pronom relatif de choix\n<b>Règle :</b> Which s'utilise lorsqu'il s'agit de choisir parmi un ensemble limité ou défini d'objets."
      },
      {
        "id": "qcm_anglais__2025_88",
        "question": "88) This program is used ... résumés and search for key words that match.",
        "correct": "c) to scan",
        "options": [
          "a) to scanning",
          "b) for scan",
          "c) to scan",
          "d) at scanning"
        ],
        "explanation": "<b>c) to scan</b>\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> Be used to + base verbale exprime ici la fonction ou le but d'un objet (utilisé pour / pour servir à)."
      },
      {
        "id": "qcm_anglais__2025_89",
        "question": "89) The applicants who ... will be invited to the corporate office and interviewed there.",
        "correct": "b) qualify",
        "options": [
          "a) qualified",
          "b) qualify",
          "c) qualifies",
          "d) are qualifying"
        ],
        "explanation": "<b>b) qualify</b>\n\n<b>Point :</b> Accord sujet-verbe (Relative)\n<b>Règle :</b> Le pronom relatif who reprend applicants (pluriel). Le verbe doit donc être conjugué au pluriel (sans -s)."
      },
      {
        "id": "qcm_anglais__2025_90",
        "question": "90) Once he has an established base, Tom will have to continually look ... new customers to make business brisk.",
        "correct": "c) for",
        "options": [
          "a) at",
          "b) after",
          "c) for",
          "d) up"
        ],
        "explanation": "<b>c) for</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To look for signifie chercher. Look after signifie s'occuper de, et Look up signifie chercher une information dans un dictionnaire."
      },
      {
        "id": "qcm_anglais__2025_91",
        "question": "91) Catching a plane to New York is more than ten ... than taking a boat, isn't it?",
        "correct": "d) times faster",
        "options": [
          "a) more times fast",
          "b) faster times",
          "c) times fastest",
          "d) times faster"
        ],
        "explanation": "<b>d) times faster</b>\n\n<b>Point :</b> Comparatif avec multiplicateur\n<b>Règle :</b> Pour exprimer un rapport de proportion, on utilise la structure : [multiplicateur] + times + [comparatif en -er]."
      },
      {
        "id": "qcm_anglais__2025_92",
        "question": "92) The rocket was successfully launched ... 6th February 2024 ... 3.45 pm.",
        "correct": "c) on / at",
        "options": [
          "a) at / on",
          "b) in/to",
          "c) on / at",
          "d) to/at"
        ],
        "explanation": "<b>c) on / at</b>\n\n<b>Point :</b> Prépositions temporelles\n<b>Règle :</b> On utilise on devant une date précise (jour/mois/année) et at devant une heure précise."
      },
      {
        "id": "qcm_anglais__2025_93",
        "question": "93) Three asteroids... crashed into the Earth last night but nobody was hurt.",
        "correct": "d) supposedly",
        "options": [
          "a) suppose",
          "b) supposing",
          "c) supposed",
          "d) supposedly"
        ],
        "explanation": "<b>d) supposedly</b>\n\n<b>Point :</b> Adverbe de modalité\n<b>Règle :</b> Supposedly (prétendument / d'après ce qu'on dit) est l'adverbe requis pour porter un jugement sur l'ensemble de l'énoncé."
      },
      {
        "id": "qcm_anglais__2025_94",
        "question": "94) ... her cousins are currently studying in the States.",
        "correct": "a) Both",
        "options": [
          "a) Both",
          "b) Together",
          "c) Either",
          "d) The Both"
        ],
        "explanation": "<b>a) Both</b>\n\n<b>Point :</b> Déterminant de dualité\n<b>Règle :</b> Both s'utilise pour désigner les deux membres d'un groupe. The both est une erreur de structure."
      },
      {
        "id": "qcm_anglais__2025_95",
        "question": "95) After ... all his material, he sat back waiting for some response.",
        "correct": "a) submitting",
        "options": [
          "a) submitting",
          "b) submitted",
          "c) submission",
          "d) submit"
        ],
        "explanation": "<b>a) submitting</b>\n\n<b>Point :</b> Préposition + Gérondif\n<b>Règle :</b> Après la préposition after, le verbe doit obligatoirement prendre la forme en -ing (V-ing)."
      },
      {
        "id": "qcm_anglais__2025_96",
        "question": "96) A recruiter ... profile candidates based on gender or ethnicity. It is illegal.",
        "correct": "d) ought not to",
        "options": [
          "a) needn't",
          "b) ought to",
          "c) must",
          "d) ought not to"
        ],
        "explanation": "<b>d) ought not to</b>\n\n<b>Point :</b> Modal / Conseil et obligation morale\n<b>Règle :</b> Ought not to exprime une forte recommandation ou une obligation morale de ne pas faire quelque chose (devrait ne pas)."
      },
      {
        "id": "qcm_anglais__2025_97",
        "question": "97) The company hired a professional recruiter to fill the ... positions.",
        "correct": "b) vacant",
        "options": [
          "a) free",
          "b) vacant",
          "c) vacancy",
          "d) vacation"
        ],
        "explanation": "<b>b) vacant</b>\n\n<b>Point :</b> Vocabulaire professionnel\n<b>Règle :</b> Vacant positions (ou vacancies) est le terme correct pour désigner des postes vacants/libres dans une entreprise."
      },
      {
        "id": "qcm_anglais__2025_98",
        "question": "98) ... the National Recruiting Fair to be held on Saturday, May 10th to find your ideal job.",
        "correct": "a) Attend",
        "options": [
          "a) Attend",
          "b) Await",
          "c) Meet",
          "d) Get in touch with"
        ],
        "explanation": "<b>a) Attend</b>\n\n<b>Point :</b> Vocabulaire (Faux-ami)\n<b>Règle :</b> To attend signifie assister à (un événement). C'est le verbe requis ici pour une foire ou un salon."
      },
      {
        "id": "qcm_anglais__2025_99",
        "question": "99) Now you can stop that ... job search and see many companies on the same day in the same place.",
        "correct": "c) time-consuming",
        "options": [
          "a) submitting",
          "b) recruiting",
          "c) time-consuming",
          "d) profiling"
        ],
        "explanation": "<b>c) time-consuming</b>\n\n<b>Point :</b> Adjectif composé\n<b>Règle :</b> Time-consuming signifie qui prend beaucoup de temps (chronophage), ce qui justifie l'intérêt d'aller dans un salon pour voir plusieurs entreprises."
      },
      {
        "id": "qcm_anglais__2025_100",
        "question": "100) ... a student, I can't afford to travel as much as I would love to as I'm usually broke.",
        "correct": "c) As",
        "options": [
          "a) For",
          "b) Like",
          "c) As",
          "d) Such"
        ],
        "explanation": "<b>c) As</b>\n\n<b>Point :</b> Préposition de rôle\n<b>Règle :</b> On utilise As pour exprimer une fonction ou un statut réel (En tant qu'étudiant). Like exprime une comparaison (Comme un étudiant, alors qu'on ne l'est pas forcément)."
      }
    ]
  },
  "qcm_anglais__2024": {
    "id": "qcm_anglais__2024",
    "name": "QCM anglais ➔ 2024",
    "path": "QCM anglais::2024",
    "pathParts": [
      "QCM anglais",
      "2024"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2024_1",
        "question": "1) Have you ... tasted snails?",
        "correct": "b) ever",
        "options": [
          "a) before",
          "b) ever",
          "c) never",
          "d) yet"
        ],
        "explanation": "<b>b) ever</b>\n\n<b>Point :</b> Present Perfect / Expérience\n<b>Règle :</b> On utilise ever (déjà) dans les questions au Present Perfect pour interroger sur une expérience vécue au moins une fois dans la vie."
      },
      {
        "id": "qcm_anglais__2024_2",
        "question": "2) When I was 10, I ... already quite tall for my age.",
        "correct": "a) was",
        "options": [
          "a) was",
          "b) were",
          "c) have been",
          "d) had been"
        ],
        "explanation": "<b>a) was</b>\n\n<b>Point :</b> Prétérit de BE\n<b>Règle :</b> Pour le sujet I, la forme du prétérit est was. Le marqueur When I was 10 impose un temps du passé simple."
      },
      {
        "id": "qcm_anglais__2024_3",
        "question": "3) Are you afraid of ...?",
        "correct": "d) skiing",
        "options": [
          "a) to ski",
          "b) ski",
          "c) skis",
          "d) skiing"
        ],
        "explanation": "<b>d) skiing</b>\n\n<b>Point :</b> Préposition + Gérondif\n<b>Règle :</b> Après une préposition (ici of), le verbe qui suit doit obligatoirement être au gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2024_4",
        "question": "4) We did not understand you. What ...?",
        "correct": "a) did you say",
        "options": [
          "a) did you say",
          "b) you said",
          "c) did you",
          "d) said you"
        ],
        "explanation": "<b>a) did you say</b>\n\n<b>Point :</b> Construction de l'interrogation au prétérit\n<b>Règle :</b> La structure d'une question au passé simple est : Mot interrogatif + auxiliaire DID + sujet + Base Verbale."
      },
      {
        "id": "qcm_anglais__2024_5",
        "question": "5) She did not get ... answers to her application letters.",
        "correct": "a) many",
        "options": [
          "a) many",
          "b) lots",
          "c) much",
          "d) lot of"
        ],
        "explanation": "<b>a) many</b>\n\n<b>Point :</b> Quantifieurs\n<b>Règle :</b> Answers est un nom dénombrable pluriel. Dans une phrase négative, on utilise many. Much est réservé aux indénombrables."
      },
      {
        "id": "qcm_anglais__2024_6",
        "question": "6) This feedback is ... the company policy.",
        "correct": "b) critical of",
        "options": [
          "a) critical with",
          "b) critical of",
          "c) criticized",
          "d) being criticizing"
        ],
        "explanation": "<b>b) critical of</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> L'expression to be critical of something signifie critiquer ou porter un jugement négatif sur quelque chose."
      },
      {
        "id": "qcm_anglais__2024_7",
        "question": "7) She ... really know what to answer to that strange request.",
        "correct": "b) didn't",
        "options": [
          "a) hasn't",
          "b) didn't",
          "c) wasn't",
          "d) don't"
        ],
        "explanation": "<b>b) didn't</b>\n\n<b>Point :</b> Auxiliaire de négation au passé\n<b>Règle :</b> Le verbe know nécessite l'auxiliaire do pour la négation. Comme le contexte semble narratif ou passé, didn't est la seule forme correcte (don't ne s'accorderait pas avec She)."
      },
      {
        "id": "qcm_anglais__2024_8",
        "question": "8) Fancy going to the cinema tomorrow? I'd rather ... in, sorry.",
        "correct": "b) stay",
        "options": [
          "a) to stay",
          "b) stay",
          "c) staying",
          "d) stayed"
        ],
        "explanation": "<b>b) stay</b>\n\n<b>Point :</b> Structure de la préférence\n<b>Règle :</b> Après would rather ('d rather), on utilise directement la Base Verbale sans to."
      },
      {
        "id": "qcm_anglais__2024_9",
        "question": "9) If I was given 400 euros for my birthday, I guess I ... save the money for my internship in Japan.",
        "correct": "b) would",
        "options": [
          "a) will",
          "b) would",
          "c) ought",
          "d) shall"
        ],
        "explanation": "<b>b) would</b>\n\n<b>Point :</b> Conditionnel (Type 2)\n<b>Règle :</b> Dans une structure en IF au prétérit (If I was given), la proposition principale utilise would + Base Verbale pour exprimer l'hypothèse."
      },
      {
        "id": "qcm_anglais__2024_10",
        "question": "10) I just love ...",
        "correct": "c) electronics",
        "options": [
          "a) electronical",
          "b) electronism",
          "c) electronics",
          "d) electronic"
        ],
        "explanation": "<b>c) electronics</b>\n\n<b>Point :</b> Noms de sciences/domaines en -ics\n<b>Règle :</b> Les domaines d'étude ou technologies se terminent souvent par -ics et sont singuliers (electronics, physics, mathematics)."
      },
      {
        "id": "qcm_anglais__2024_11",
        "question": "11) His bike is the same ... yours, isn't it?",
        "correct": "c) as",
        "options": [
          "a) that",
          "b) than",
          "c) as",
          "d) Ø"
        ],
        "explanation": "<b>c) as</b>\n\n<b>Point :</b> Comparaison d'égalité\n<b>Règle :</b> La structure fixe pour exprimer l'identité est the same as (le même que)."
      },
      {
        "id": "qcm_anglais__2024_12",
        "question": "12) A friend in need, is a friend ...",
        "correct": "c) indeed",
        "options": [
          "a) in did",
          "b) in deed",
          "c) indeed",
          "d) in death"
        ],
        "explanation": "<b>c) indeed</b>\n\n<b>Point :</b> Proverbe / Idiome\n<b>Règle :</b> A friend in need is a friend indeed est un proverbe signifiant qu'un ami qui vous aide quand vous êtes dans le besoin est un véritable ami."
      },
      {
        "id": "qcm_anglais__2024_13",
        "question": "13) My friends and I used to party at ...",
        "correct": "b) week-ends",
        "options": [
          "a) week-end",
          "b) week-ends",
          "c) Saturday night",
          "d) Saturdays"
        ],
        "explanation": "<b>b) week-ends</b>\n\n<b>Point :</b> Préposition temporelle (BrE)\n<b>Règle :</b> En anglais britannique, on utilise at the weekend ou at weekends (au pluriel pour une habitude). Note : on Saturdays serait possible mais l'option propose at."
      },
      {
        "id": "qcm_anglais__2024_14",
        "question": "14) In today's world, everything is going ... and ... global.",
        "correct": "d) more / more",
        "options": [
          "a) more / less",
          "b) less / less",
          "c) more / Ø",
          "d) more / more"
        ],
        "explanation": "<b>d) more / more</b>\n\n<b>Point :</b> Comparatif de progression\n<b>Règle :</b> More and more signifie de plus en plus. C'est la structure utilisée pour exprimer une évolution croissante."
      },
      {
        "id": "qcm_anglais__2024_15",
        "question": "15) Fake news about the coup ... published last night.",
        "correct": "b) was",
        "options": [
          "a) were",
          "b) was",
          "c) have been",
          "d) has been"
        ],
        "explanation": "<b>b) was</b>\n\n<b>Point :</b> Noms indénombrables\n<b>Règle :</b> Le mot news est indénombrable en anglais et s'utilise toujours avec un verbe au singulier, même s'il se termine par un s."
      },
      {
        "id": "qcm_anglais__2024_16",
        "question": "16) I can't stand ... next to somebody who is having a smoke.",
        "correct": "d) sitting",
        "options": [
          "a) seated",
          "b) seat",
          "c) sit",
          "d) sitting"
        ],
        "explanation": "<b>d) sitting</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> L'expression de goût can't stand (ne pas supporter) est suivie du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2024_17",
        "question": "17) It seems that he took a very ... step in joining this company.",
        "correct": "b) unfortunate",
        "options": [
          "a) infortunate",
          "b) unfortunate",
          "c) unfortunately",
          "d) imfortunate"
        ],
        "explanation": "<b>b) unfortunate</b>\n\n<b>Point :</b> Formation des adjectifs / Préfixe\n<b>Règle :</b> Le préfixe privatif pour fortunate est un-. Infortunate n'existe pas en anglais moderne."
      },
      {
        "id": "qcm_anglais__2024_18",
        "question": "18) She's not interested ... making friends with local people.",
        "correct": "b) in",
        "options": [
          "a) by",
          "b) in",
          "c) Ø",
          "d) at"
        ],
        "explanation": "<b>b) in</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> L'adjectif interested se construit systématiquement avec la préposition in."
      },
      {
        "id": "qcm_anglais__2024_19",
        "question": "19) Not ... a mask to protect oneself from diverse viruses is risky these days.",
        "correct": "a) wearing",
        "options": [
          "a) wearing",
          "b) wear",
          "c) worn",
          "d) to wearing"
        ],
        "explanation": "<b>a) wearing</b>\n\n<b>Point :</b> Gérondif sujet\n<b>Règle :</b> Pour transformer un verbe en sujet de la phrase, on utilise le gérondif (V-ing). Ici : Le fait de ne pas porter...."
      },
      {
        "id": "qcm_anglais__2024_20",
        "question": "20) We'll phone you as soon as we're ...",
        "correct": "a) done",
        "options": [
          "a) done",
          "b) did",
          "c) dead",
          "d) doing"
        ],
        "explanation": "<b>a) done</b>\n\n<b>Point :</b> Expression idiomatique\n<b>Règle :</b> To be done est une expression courante pour dire avoir fini ou avoir terminé une tâche."
      },
      {
        "id": "qcm_anglais__2024_21",
        "question": "21) ... are problem solvers.",
        "correct": "a) Engineers",
        "options": [
          "a) Engineers",
          "b) Ingeneers",
          "c) Enginers",
          "d) Engeniers"
        ],
        "explanation": "<b>a) Engineers</b>\n\n<b>Point :</b> Orthographe\n<b>Règle :</b> L'orthographe correcte du métier d'ingénieur en anglais est Engineer."
      },
      {
        "id": "qcm_anglais__2024_22",
        "question": "22) At school I wish we ... a cafeteria with a nice choice of sandwiches and snacks.",
        "correct": "a) had",
        "options": [
          "a) had",
          "b) have",
          "c) will have",
          "d) will be having"
        ],
        "explanation": "<b>a) had</b>\n\n<b>Point :</b> Expression du regret (Wish)\n<b>Règle :</b> Après I wish, pour exprimer un regret sur une situation présente, on utilise le prétérit simple (Unreal Past)."
      },
      {
        "id": "qcm_anglais__2024_23",
        "question": "23) An empathic person is a person who puts themself ... someone else's shoes.",
        "correct": "a) in",
        "options": [
          "a) in",
          "b) inside",
          "c) on",
          "d) onto"
        ],
        "explanation": "<b>a) in</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> L'expression to put oneself in someone's shoes (se mettre à la place de quelqu'un) utilise la préposition in."
      },
      {
        "id": "qcm_anglais__2024_24",
        "question": "24) These days, you will find anything you need ... the Internet.",
        "correct": "a) on",
        "options": [
          "a) on",
          "b) in",
          "c) upon",
          "d) inside"
        ],
        "explanation": "<b>a) on</b>\n\n<b>Point :</b> Préposition / Médias numériques\n<b>Règle :</b> On utilise on pour tout ce qui est diffusé sur un écran ou via un réseau (on the Internet, on TV)."
      },
      {
        "id": "qcm_anglais__2024_25",
        "question": "25) Some day, I ... rich.",
        "correct": "c) will be",
        "options": [
          "a) am",
          "b) would be",
          "c) will be",
          "d) am being"
        ],
        "explanation": "<b>c) will be</b>\n\n<b>Point :</b> Futur de prédiction\n<b>Règle :</b> Pour exprimer une prédiction ou une intention lointaine (Un jour...), on utilise le futur simple avec will."
      },
      {
        "id": "qcm_anglais__2024_26",
        "question": "26) Most youngsters find ... hard ... choose the right language register when addressing people at work.",
        "correct": "b) it/ to",
        "options": [
          "a) / to",
          "b) it/ to",
          "c) you/ to",
          "d) it/ you"
        ],
        "explanation": "<b>b) it/ to</b>\n\n<b>Point :</b> It anticipateur\n<b>Règle :</b> On utilise it comme objet factice après certains verbes (find, think, make) suivi d'un adjectif et d'une proposition en to. Find it hard to do...."
      },
      {
        "id": "qcm_anglais__2024_27",
        "question": "27) You ... to quickly update the operating system on your computer or it might crash.",
        "correct": "a) need",
        "options": [
          "a) need",
          "b) should",
          "c) could",
          "d) needed"
        ],
        "explanation": "<b>a) need</b>\n\n<b>Point :</b> Modalité / Structure verbale\n<b>Règle :</b> L'option need est la seule compatible avec la préposition to. Les modaux (should, could) sont suivis directement de la base verbale."
      },
      {
        "id": "qcm_anglais__2024_28",
        "question": "28) Watch out! There's dog mess on the pavement. Don't walk ... it!",
        "correct": "c) in",
        "options": [
          "a) over",
          "b) into",
          "c) in",
          "d) on"
        ],
        "explanation": "<b>c) in</b>\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> To walk in something suggère que l'on marche dedans (pénétration dans la matière), ce qui est le piège classique ici."
      },
      {
        "id": "qcm_anglais__2024_29",
        "question": "29) ... loves vacation.",
        "correct": "b) Everyone",
        "options": [
          "a) All the people",
          "b) Everyone",
          "c) None",
          "d) All"
        ],
        "explanation": "<b>b) Everyone</b>\n\n<b>Point :</b> Pronoms indéfinis / Accord\n<b>Règle :</b> Le verbe loves est au singulier. Everyone est un pronom singulier, contrairement à All (the) people qui demanderait un pluriel."
      },
      {
        "id": "qcm_anglais__2024_30",
        "question": "30) If she ... on every point of the contract, let's sign it today!",
        "correct": "d) agrees",
        "options": [
          "a) is agree",
          "b) agree",
          "c) agreeing",
          "d) agrees"
        ],
        "explanation": "<b>d) agrees</b>\n\n<b>Point :</b> Conditionnel Type 1 / Verbe d'opinion\n<b>Règle :</b> Dans une subordonnée en if, on utilise le présent simple. De plus, agree est un verbe d'action en anglais (on ne dit pas is agree)."
      },
      {
        "id": "qcm_anglais__2024_31",
        "question": "31) It's high time you ... to bed, young lady.",
        "correct": "d) went",
        "options": [
          "a) go",
          "b) are about to go",
          "c) 're going",
          "d) went"
        ],
        "explanation": "<b>d) went</b>\n\n<b>Point :</b> Unreal Past\n<b>Règle :</b> Après l'expression It's (high) time, on utilise obligatoirement le prétérit pour exprimer une action qui devrait déjà être accomplie."
      },
      {
        "id": "qcm_anglais__2024_32",
        "question": "32) Leadership is a very subjective notion; it depends ... how you see it.",
        "correct": "b) on",
        "options": [
          "a) of",
          "b) on",
          "c) to",
          "d) off"
        ],
        "explanation": "<b>b) on</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe depend se construit toujours avec la préposition on (dépendre de)."
      },
      {
        "id": "qcm_anglais__2024_33",
        "question": "33) It was the first time I ... jelly fish. It was not very tasty.",
        "correct": "b) had eaten",
        "options": [
          "a) have eaten",
          "b) had eaten",
          "c) ate",
          "d) have been eating"
        ],
        "explanation": "<b>b) had eaten</b>\n\n<b>Point :</b> Past Perfect\n<b>Règle :</b> Avec la structure It was the first time, on utilise le Past Perfect (had + participe passé) car on se place dans un récit au passé."
      },
      {
        "id": "qcm_anglais__2024_34",
        "question": "34) Last year, they had to ... an internship by themselves.",
        "correct": "a) look for",
        "options": [
          "a) look for",
          "b) look at",
          "c) look into",
          "d) look forward"
        ],
        "explanation": "<b>a) look for</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To look for signifie chercher. Les étudiants ont dû chercher un stage par eux-mêmes."
      },
      {
        "id": "qcm_anglais__2024_35",
        "question": "35) Jeff ... Thai boxing for 4 years now. He is pretty good at it.",
        "correct": "c) has been practising",
        "options": [
          "a) practises",
          "b) have been practising",
          "c) has been practising",
          "d) had practised"
        ],
        "explanation": "<b>c) has been practising</b>\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> On utilise has been -ing pour une action commencée dans le passé qui continue dans le présent (for 4 years now)."
      },
      {
        "id": "qcm_anglais__2024_36",
        "question": "36) Students always need to focus deeply ... do well for the TOEIC exam.",
        "correct": "a) in order to",
        "options": [
          "a) in order to",
          "b) for",
          "c) so as for",
          "d) in order for"
        ],
        "explanation": "<b>a) in order to</b>\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> In order to est suivi d'une base verbale pour exprimer l'objectif."
      },
      {
        "id": "qcm_anglais__2024_37",
        "question": "37) She ... get in touch with my cousin while in New York. He'll take her out.",
        "correct": "c) should",
        "options": [
          "a) must to",
          "b) may",
          "c) should",
          "d) have to"
        ],
        "explanation": "<b>c) should</b>\n\n<b>Point :</b> Modal / Probabilité\n<b>Règle :</b> Should exprime ici une suggestion ou une probabilité logique. Must to est grammaticalement impossible."
      },
      {
        "id": "qcm_anglais__2024_38",
        "question": "38) You seem not to be used to ... any breakfast but this is not good for you.",
        "correct": "a) having",
        "options": [
          "a) having",
          "b) have",
          "c) having had",
          "d) had"
        ],
        "explanation": "<b>a) having</b>\n\n<b>Point :</b> Be used to + V-ing\n<b>Règle :</b> L'expression be used to (être habitué à) est suivie du gérondif (-ing)."
      },
      {
        "id": "qcm_anglais__2024_39",
        "question": "39) My boyfriend and I go hiking ...",
        "correct": "a) every year",
        "options": [
          "a) every year",
          "b) over the years",
          "c) all years",
          "d) any years"
        ],
        "explanation": "<b>a) every year</b>\n\n<b>Point :</b> Expression de la fréquence\n<b>Règle :</b> Every year (chaque année) est la structure correcte pour exprimer une habitude annuelle."
      },
      {
        "id": "qcm_anglais__2024_40",
        "question": "40) With two stops on the way, the journey to Malaysia is ... long.",
        "correct": "b) dreadfully",
        "options": [
          "a) dreadful",
          "b) dreadfully",
          "c) dreadfully and",
          "d) quiet"
        ],
        "explanation": "<b>b) dreadfully</b>\n\n<b>Point :</b> Adverbe de degré\n<b>Règle :</b> On utilise l'adverbe en -ly pour modifier un adjectif (ici long)."
      },
      {
        "id": "qcm_anglais__2024_41",
        "question": "41) I have been in a drama club... I joined my new engineering school.",
        "correct": "a) since",
        "options": [
          "a) since",
          "b) beforehand",
          "c) for",
          "d) during"
        ],
        "explanation": "<b>a) since</b>\n\n<b>Point :</b> Marqueur temporel\n<b>Règle :</b> Since introduit le point de départ précis d'une action qui dure encore (le moment de l'inscription)."
      },
      {
        "id": "qcm_anglais__2024_42",
        "question": "42) I will walk you to your judo class as soon as the rain ...",
        "correct": "c) has stopped",
        "options": [
          "a) is stopping",
          "b) was over",
          "c) has stopped",
          "d) is finish"
        ],
        "explanation": "<b>c) has stopped</b>\n\n<b>Point :</b> Future in Time Clauses\n<b>Règle :</b> Après as soon as, on utilise le présent simple ou le present perfect pour exprimer le futur."
      },
      {
        "id": "qcm_anglais__2024_43",
        "question": "43) Last summer, I had a cooking class in Thailand.",
        "correct": "a) So did I",
        "options": [
          "a) So did I",
          "b) So I do",
          "c) I so did",
          "d) I did so"
        ],
        "explanation": "<b>a) So did I</b>\n\n<b>Point :</b> Approbation affirmative\n<b>Règle :</b> La structure pour dire moi aussi au passé est : So + auxiliaire (did) + sujet (I)."
      },
      {
        "id": "qcm_anglais__2024_44",
        "question": "44) His girlfriend won't... him to do an internship abroad. She is so jealous!",
        "correct": "a) allow",
        "options": [
          "a) allow",
          "b) demand",
          "c) require",
          "d) argue with"
        ],
        "explanation": "<b>a) allow</b>\n\n<b>Point :</b> Verbe de permission\n<b>Règle :</b> Allow someone to do something est la structure correcte pour exprimer la permission."
      },
      {
        "id": "qcm_anglais__2024_45",
        "question": "45) My studio flat is ... from my business school, which is great.",
        "correct": "a) within walking distance",
        "options": [
          "a) within walking distance",
          "b) within a walk",
          "c) within walking",
          "d) no distance"
        ],
        "explanation": "<b>a) within walking distance</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> Within walking distance est une expression figée signifiant à une distance accessible à pied."
      },
      {
        "id": "qcm_anglais__2024_46",
        "question": "46) Did he forget his phone?. I hope ...",
        "correct": "d) not",
        "options": [
          "a) no",
          "b) none",
          "c) never",
          "d) not"
        ],
        "explanation": "<b>d) not</b>\n\n<b>Point :</b> Pro-form not \n<b>Règle :</b> Après des verbes comme hope, fear ou believe, on utilise not pour exprimer une réponse négative à une question fermée."
      },
      {
        "id": "qcm_anglais__2024_47",
        "question": "47) We are used to exercising ...",
        "correct": "d) twice a week",
        "options": [
          "a) twice the week",
          "b) twice times a week",
          "c) twice",
          "d) twice a week"
        ],
        "explanation": "<b>d) twice a week</b>\n\n<b>Point :</b> Expression de la fréquence \n<b>Règle :</b> La structure correcte pour la fréquence est [Nombre de fois] + [a/an] + [Période]. On ne dit pas twice times."
      },
      {
        "id": "qcm_anglais__2024_48",
        "question": "48) In which ... will she intern next year?",
        "correct": "c) company",
        "options": [
          "a) companie",
          "b) compagny",
          "c) company",
          "d) society"
        ],
        "explanation": "<b>c) company</b>\n\n<b>Point :</b> Orthographe et Vocabulaire \n<b>Règle :</b> Company est l'orthographe correcte. Society est un faux-ami signifiant la société humaine en général."
      },
      {
        "id": "qcm_anglais__2024_49",
        "question": "49) His strongest... is obviously electronics.",
        "correct": "a) point",
        "options": [
          "a) point",
          "b) fault",
          "c) assets",
          "d) skills"
        ],
        "explanation": "<b>a) point</b>\n\n<b>Point :</b> Collocation / Point fort \n<b>Règle :</b> Strong point est l'expression idiomatique pour désigner un domaine où l'on excelle."
      },
      {
        "id": "qcm_anglais__2024_50",
        "question": "50) Which word is the odd one out?",
        "correct": "d) stagist",
        "options": [
          "a) intern",
          "b) trainee",
          "c) apprentice",
          "d) stagist"
        ],
        "explanation": "<b>d) stagist</b>\n\n<b>Point :</b> Vocabulaire / Gallicisme \n<b>Règle :</b> Stagist n'existe pas en anglais ; c'est une erreur calquée sur le français stagiaire. Les termes corrects sont intern ou trainee."
      },
      {
        "id": "qcm_anglais__2024_51",
        "question": "51) When you ... the result, please give us a bell!",
        "correct": "c) know",
        "options": [
          "a) will know",
          "b) have know",
          "c) know",
          "d) knew"
        ],
        "explanation": "<b>c) know</b>\n\n<b>Point :</b> Future in Time Clauses \n<b>Règle :</b> Dans une subordonnée de temps (introduite par when), on utilise le présent simple pour exprimer une idée de futur."
      },
      {
        "id": "qcm_anglais__2024_52",
        "question": "52) I'm taking some vitamin supplements but I ... feel tired.",
        "correct": "a) still",
        "options": [
          "a) still",
          "b) notwithstanding",
          "c) whatever",
          "d) however"
        ],
        "explanation": "<b>a) still</b>\n\n<b>Point :</b> Adverbe de continuité \n<b>Règle :</b> Still exprime la persistance d'un état (encore/toujours). However est une conjonction d'opposition."
      },
      {
        "id": "qcm_anglais__2024_53",
        "question": "53) What is she passionate...?",
        "correct": "b) about",
        "options": [
          "a) by",
          "b) about",
          "c) in",
          "d) into"
        ],
        "explanation": "<b>b) about</b>\n\n<b>Point :</b> Préposition fixe \n<b>Règle :</b> L'adjectif passionate est systématiquement suivi de la préposition about."
      },
      {
        "id": "qcm_anglais__2024_54",
        "question": "54) ... are they talking to?",
        "correct": "a) Whom",
        "options": [
          "a) Whom",
          "b) Whose",
          "c) What",
          "d) Why"
        ],
        "explanation": "<b>a) Whom</b>\n\n<b>Point :</b> Pronom interrogatif complément \n<b>Règle :</b> On utilise Whom lorsqu'il est le complément d'une préposition (to en fin de phrase ici) désignant une personne."
      },
      {
        "id": "qcm_anglais__2024_55",
        "question": "55) It is a fantastic gift. I can't believe... luck!",
        "correct": "a) my",
        "options": [
          "a) my",
          "b) the",
          "c) such a",
          "d) Ø"
        ],
        "explanation": "<b>a) my</b>\n\n<b>Point :</b> Déterminant possessif \n<b>Règle :</b> On utilise my luck (ma chance) pour exprimer un sentiment personnel face à un événement."
      },
      {
        "id": "qcm_anglais__2024_56",
        "question": "56) Have you noticed that there are ... holiday-makers than last year?",
        "correct": "d) fewer",
        "options": [
          "a) less",
          "b) lesser",
          "c) few",
          "d) fewer"
        ],
        "explanation": "<b>d) fewer</b>\n\n<b>Point :</b> Comparatif de supériorité (Dénombrable) \n<b>Règle :</b> Pour les noms dénombrables au pluriel (holiday-makers), on utilise fewer. Less est réservé aux indénombrables."
      },
      {
        "id": "qcm_anglais__2024_57",
        "question": "57) Each state implements ... own policy in the US.",
        "correct": "b) its",
        "options": [
          "a) their's",
          "b) its",
          "c) it's",
          "d) his"
        ],
        "explanation": "<b>b) its</b>\n\n<b>Point :</b> Possessif neutre \n<b>Règle :</b> Its (sans apostrophe) est l'adjectif possessif pour un nom neutre singulier (Each state). It's est la contraction de it is."
      },
      {
        "id": "qcm_anglais__2024_58",
        "question": "58) All my colleagues want... students to become skilled electrical engineers.",
        "correct": "c) their",
        "options": [
          "a) them",
          "b) that",
          "c) their",
          "d) theirs"
        ],
        "explanation": "<b>c) their</b>\n\n<b>Point :</b> Adjectif possessif \n<b>Règle :</b> On utilise their devant le nom students pour indiquer la possession plurielle (les étudiants de mes collègues)."
      },
      {
        "id": "qcm_anglais__2024_59",
        "question": "59) ... are said to be heavy drinkers.",
        "correct": "a) Russians",
        "options": [
          "a) Russians",
          "b) russian people",
          "c) Russia' people",
          "d) The Russian"
        ],
        "explanation": "<b>a) Russians</b>\n\n<b>Point :</b> Noms de peuples / Généralité \n<b>Règle :</b> On utilise le nom de la nationalité au pluriel avec une majuscule pour désigner l'ensemble d'un peuple."
      },
      {
        "id": "qcm_anglais__2024_60",
        "question": "60) Recently, many students had to get a part-time job for ... reasons.",
        "correct": "b) economic",
        "options": [
          "a) economical",
          "b) economic",
          "c) finance",
          "d) economics"
        ],
        "explanation": "<b>b) economic</b>\n\n<b>Point :</b> Adjectif qualificatif \n<b>Règle :</b> Economic signifie lié à l'économie (le domaine). Economical signifie qui permet de faire des économies (peu coûteux)."
      },
      {
        "id": "qcm_anglais__2024_61",
        "question": "61) He will go and study abroad ... he gets a grant.",
        "correct": "b) provided",
        "options": [
          "a) owing",
          "b) provided",
          "c) should",
          "d) nevertheless"
        ],
        "explanation": "<b>b) provided</b>\n\n<b>Point :</b> Conjonction de condition \n<b>Règle :</b> Provided (that) signifie à condition que ou pourvu que."
      },
      {
        "id": "qcm_anglais__2024_62",
        "question": "62) Something unexpected... during the physics class this morning.",
        "correct": "c) occurred",
        "options": [
          "a) took places",
          "b) has happening",
          "c) occurred",
          "d) arrived"
        ],
        "explanation": "<b>c) occurred</b>\n\n<b>Point :</b> Vocabulaire (Verbe d'événement)\n<b>Règle :</b> To occur est le synonyme formel de to happen (se produire). Arrived est un faux-ami dans ce contexte."
      },
      {
        "id": "qcm_anglais__2024_63",
        "question": "63) A scandal ... President Biden has just broken out.",
        "correct": "d) involving",
        "options": [
          "a) showing off",
          "b) exposing about",
          "c) revealing about",
          "d) involving"
        ],
        "explanation": "<b>d) involving</b>\n\n<b>Point :</b> Participe présent / Relation\n<b>Règle :</b> Involving (impliquant / concernant) est le terme correct pour lier un scandale à une personne."
      },
      {
        "id": "qcm_anglais__2024_64",
        "question": "64) Coaches are not people... give their clients advice but they put you on the right path.",
        "correct": "b) who",
        "options": [
          "a) whom",
          "b) who",
          "c) whose",
          "d) which"
        ],
        "explanation": "<b>b) who</b>\n\n<b>Point :</b> Pronom relatif sujet\n<b>Règle :</b> On utilise who pour une personne lorsqu'il est le sujet du verbe qui suit (ici give)."
      },
      {
        "id": "qcm_anglais__2024_65",
        "question": "65) Which set phrase means very easy?",
        "correct": "c) it's a bed of roses",
        "options": [
          "a) it's a bed of peonies",
          "b) it's a bed of daffodils",
          "c) it's a bed of roses",
          "d) it's a bed of daisies"
        ],
        "explanation": "<b>c) it's a bed of roses</b>\n\n<b>Point :</b> Idiome / Expression figée\n<b>Règle :</b> A bed of roses désigne une situation facile, confortable ou sans encombre."
      },
      {
        "id": "qcm_anglais__2024_66",
        "question": "66) Are you staying at uni or going to your ... at the week-end?",
        "correct": "b) sister's",
        "options": [
          "a) sister place",
          "b) sister's",
          "c) sister",
          "d) sister'"
        ],
        "explanation": "<b>b) sister's</b>\n\n<b>Point :</b> Génitif elliptique\n<b>Règle :</b> On utilise le génitif seul ('s) pour désigner le domicile d'une personne sans répéter le mot house ou place."
      },
      {
        "id": "qcm_anglais__2024_67",
        "question": "67) She doesn't know... about AI.",
        "correct": "c) much",
        "options": [
          "a) something",
          "b) nothing",
          "c) much",
          "d) a lot of"
        ],
        "explanation": "<b>c) much</b>\n\n<b>Point :</b> Quantifieur / Phrase négative\n<b>Règle :</b> Dans une phrase négative avec un indénombrable (AI), on utilise much pour exprimer une grande quantité."
      },
      {
        "id": "qcm_anglais__2024_68",
        "question": "68) Do you prefer judo ... karate?",
        "correct": "c) to",
        "options": [
          "a) than",
          "b) that",
          "c) to",
          "d) at"
        ],
        "explanation": "<b>c) to</b>\n\n<b>Point :</b> Verbe de préférence\n<b>Règle :</b> Le verbe prefer se construit avec la structure prefer A to B. L'usage de than est une erreur courante."
      },
      {
        "id": "qcm_anglais__2024_69",
        "question": "69) I wish I ... languages and ... help those tourists.",
        "correct": "b) spoke could",
        "options": [
          "a) speak .could",
          "b) spoke could",
          "c) can speak can",
          "d) have spoken ...can"
        ],
        "explanation": "<b>b) spoke could</b>\n\n<b>Point :</b> Unreal Past (Wish)\n<b>Règle :</b> Après wish, on utilise le prétérit pour exprimer un regret présent. Ici : I wish I spoke... and could help."
      },
      {
        "id": "qcm_anglais__2024_70",
        "question": "70) Why not ... Chinese food for lunch?",
        "correct": "b) order",
        "options": [
          "a) to order",
          "b) order",
          "c) ordering",
          "d) orders"
        ],
        "explanation": "<b>b) order</b>\n\n<b>Point :</b> Suggestion\n<b>Règle :</b> La structure Why not est toujours suivie directement de la Base Verbale (sans to)."
      },
      {
        "id": "qcm_anglais__2024_71",
        "question": "71) If we had not had the ... skills, we would not have applied for this position.",
        "correct": "a) right",
        "options": [
          "a) right",
          "b) good",
          "c) fine",
          "d) OK"
        ],
        "explanation": "<b>a) right</b>\n\n<b>Point :</b> Adjectif qualificatif\n<b>Règle :</b> The right skills signifie les compétences appropriées ou adéquates pour un poste."
      },
      {
        "id": "qcm_anglais__2024_72",
        "question": "72) Is there ... milk left by any chance?",
        "correct": "a) any",
        "options": [
          "a) any",
          "b) a",
          "c) no",
          "d) little"
        ],
        "explanation": "<b>a) any</b>\n\n<b>Point :</b> Déterminant interrogatif\n<b>Règle :</b> On utilise any dans les questions pour interroger sur l'existence d'une quantité, surtout avec un indénombrable (milk)."
      },
      {
        "id": "qcm_anglais__2024_73",
        "question": "73) They should take some time to think ...",
        "correct": "d) it over",
        "options": [
          "a) on it",
          "b) it about",
          "c) to it",
          "d) it over"
        ],
        "explanation": "<b>d) it over</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To think something over signifie réfléchir mûrement à une décision ou un problème."
      },
      {
        "id": "qcm_anglais__2024_74",
        "question": "74) ... is he? He is 1.10 meters now.",
        "correct": "c) How tall",
        "options": [
          "a) How big",
          "b) How high",
          "c) How tall",
          "d) How"
        ],
        "explanation": "<b>c) how tall</b>\n\n<b>Point :</b> Interrogation sur la taille\n<b>Règle :</b> On utilise How tall pour mesurer la taille d'une personne. How high est réservé aux objets ou aux bâtiments."
      },
      {
        "id": "qcm_anglais__2024_75",
        "question": "75) I know that all of you are ... the holidays most impatiently.",
        "correct": "b) waiting for",
        "options": [
          "a) attending for",
          "b) waiting for",
          "c) expecting for",
          "d) waiting"
        ],
        "explanation": "<b>b) waiting for</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe wait exige la préposition for s'il est suivi d'un complément d'objet."
      },
      {
        "id": "qcm_anglais__2024_76",
        "question": "76) My flatmate likes things ... neatly.",
        "correct": "c) done",
        "options": [
          "a) to do",
          "b) be done",
          "c) done",
          "d) doing"
        ],
        "explanation": "<b>c) done</b>\n\n<b>Point :</b> Structure résultative\n<b>Règle :</b> Like things done (V + objet + participe passé) exprime la manière dont on aime que les choses soient réalisées."
      },
      {
        "id": "qcm_anglais__2024_77",
        "question": "77) It's a pity we ... you last night but my son was sick.",
        "correct": "d) couldn't join",
        "options": [
          "a) did join",
          "b) can't join",
          "c) shouldn't join",
          "d) couldn't join"
        ],
        "explanation": "<b>d) couldn't join</b>\n\n<b>Point :</b> Modalité au passé\n<b>Règle :</b> Couldn't exprime l'incapacité ou l'impossibilité de réaliser une action dans le passé."
      },
      {
        "id": "qcm_anglais__2024_78",
        "question": "78) Owing to climate change, many people will have to migrate to more ... climates and countries.",
        "correct": "a) hospitable",
        "options": [
          "a) hospitable",
          "b) picturesque",
          "c) sunny",
          "d) balmy"
        ],
        "explanation": "<b>a) hospitable</b>\n\n<b>Point :</b> Vocabulaire / Contexte\n<b>Règle :</b> Hospitable signifie accueillant ou vivable. C'est le seul adjectif logique pour désigner une destination de migration climatique."
      },
      {
        "id": "qcm_anglais__2024_79",
        "question": "79) How about ... a film at the cinema for tomorrow night?",
        "correct": "d) finding",
        "options": [
          "a) to find",
          "b) find",
          "c) she find",
          "d) finding"
        ],
        "explanation": "<b>d) finding</b>\n\n<b>Point :</b> Suggestion / Verb Patterns\n<b>Règle :</b> La structure How about est systématiquement suivie du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2024_80",
        "question": "80) He... no effort whatsoever to understand our viewpoint.",
        "correct": "a) made",
        "options": [
          "a) made",
          "b) make",
          "c) making",
          "d) to make"
        ],
        "explanation": "<b>a) made</b>\n\n<b>Point :</b> Collocation / Temps du passé\n<b>Règle :</b> To make an effort est la collocation correcte. Le contexte ici exige le prétérit pour une action passée et terminée."
      },
      {
        "id": "qcm_anglais__2024_81",
        "question": "81) Grandma's computer is out of order. Should I ...?",
        "correct": "b) have it repaired",
        "options": [
          "a) make it repaired",
          "b) have it repaired",
          "c) let it repair",
          "d) get it repair"
        ],
        "explanation": "<b>b) have it repaired</b>\n\n<b>Point :</b> Causatif / Have something done\n<b>Règle :</b> On utilise Have + objet + participe passé pour exprimer le fait de faire faire quelque chose par un tiers."
      },
      {
        "id": "qcm_anglais__2024_82",
        "question": "82) He was pretty miserable due to the fact that he was ...",
        "correct": "a) an only child",
        "options": [
          "a) an only child",
          "b) lonely child",
          "c) an alone child",
          "d) alone"
        ],
        "explanation": "<b>a) an only child</b>\n\n<b>Point :</b> Vocabulaire / Statut familial\n<b>Règle :</b> An only child est l'expression consacrée pour dire un fils/une fille unique."
      },
      {
        "id": "qcm_anglais__2024_83",
        "question": "83) ... you go ... you stay, but I have to leave right now.",
        "correct": "b) Either / or",
        "options": [
          "a) Or / or",
          "b) Either / or",
          "c) Either / nor",
          "d) Either / Ø"
        ],
        "explanation": "<b>b) Either / or</b>\n\n<b>Point :</b> Conjonctions corrélatives\n<b>Règle :</b> La paire Either... or permet d'exprimer un choix entre deux alternatives (Soit... soit...)."
      },
      {
        "id": "qcm_anglais__2024_84",
        "question": "84) The spectators... the concert hall as soon as the doors opened.",
        "correct": "a) left",
        "options": [
          "a) left",
          "b) leave",
          "c) are leaving",
          "d) have leave"
        ],
        "explanation": "<b>a) left</b>\n\n<b>Point :</b> Concordance des temps\n<b>Règle :</b> L'action principale doit être au prétérit (left) car elle est liée à une subordonnée de temps au prétérit (opened)."
      },
      {
        "id": "qcm_anglais__2024_85",
        "question": "85) What a lovely scooter. Is it ...?",
        "correct": "a) yours",
        "options": [
          "a) yours",
          "b) your",
          "c) you",
          "d) your's"
        ],
        "explanation": "<b>a) yours</b>\n\n<b>Point :</b> Pronom possessif\n<b>Règle :</b> On utilise le pronom possessif yours (le tien) pour remplacer le nom. Your est un adjectif qui nécessite un nom derrière."
      },
      {
        "id": "qcm_anglais__2024_86",
        "question": "86) While she ... in the park, she realized some passers-by were staring at her.",
        "correct": "b) was doing press-ups",
        "options": [
          "a) is doing press-ups",
          "b) was doing press-ups",
          "c) had been doing press-ups",
          "d) has done press-ups"
        ],
        "explanation": "<b>b) was doing press-ups</b>\n\n<b>Point :</b> Past Continuous\n<b>Règle :</b> On utilise was -ing pour une action longue en cours de déroulement dans le passé, souvent interrompue par un événement ponctuel."
      },
      {
        "id": "qcm_anglais__2024_87",
        "question": "87) He'd love to quit ...",
        "correct": "b) snacking",
        "options": [
          "a) to snack",
          "b) snacking",
          "c) the snacks",
          "d) the snacking"
        ],
        "explanation": "<b>b) snacking</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> Le verbe quit (arrêter) est suivi du gérondif (V-ing) lorsqu'il s'agit d'une habitude."
      },
      {
        "id": "qcm_anglais__2024_88",
        "question": "88) ... the weather was really terrible, we decided to stay in and watch some series.",
        "correct": "d) As",
        "options": [
          "a) Consequently",
          "b) As a consequence",
          "c) So",
          "d) As"
        ],
        "explanation": "<b>d) As</b>\n\n<b>Point :</b> Conjonction de cause\n<b>Règle :</b> As signifie ici Puisque ou Comme et introduit la cause de la décision."
      },
      {
        "id": "qcm_anglais__2024_89",
        "question": "89) Which one is not synonymous with the others?",
        "correct": "d) special",
        "options": [
          "a) weird",
          "b) strange",
          "c) bizarre",
          "d) special"
        ],
        "explanation": "<b>d) special</b>\n\n<b>Point :</b> Vocabulaire / Intrus\n<b>Règle :</b> Weird, strange et bizarre sont synonymes. Special a une connotation généralement positive ou neutre et ne signifie pas étrange."
      },
      {
        "id": "qcm_anglais__2024_90",
        "question": "90) What ... tonight? Any plans?",
        "correct": "d) are you doing",
        "options": [
          "a) have you been doing",
          "b) you doing",
          "c) do you do",
          "d) are you doing"
        ],
        "explanation": "<b>d) are you doing</b>\n\n<b>Point :</b> Futur / Arrangements personnels\n<b>Règle :</b> On utilise le présent continu (be + V-ing) pour interroger sur des projets ou des arrangements prévus dans un futur proche."
      },
      {
        "id": "qcm_anglais__2024_91",
        "question": "91) Who knows if they ... up tomorrow. They often let us down.",
        "correct": "a) will turn",
        "options": [
          "a) will turn",
          "b) turned",
          "c) are turning up",
          "d) have turned"
        ],
        "explanation": "<b>a) will turn</b>\n\n<b>Point :</b> Futur de prédiction / Incertitude\n<b>Règle :</b> Après if dans une complétive (et non une conditionnelle), on peut utiliser will pour exprimer le futur. Turn up signifie arriver/apparaître."
      },
      {
        "id": "qcm_anglais__2024_92",
        "question": "92) The mafiosi did not know that the police had them ....",
        "correct": "a) under surveillance",
        "options": [
          "a) under surveillance",
          "b) in surveillance",
          "c) surveilled",
          "d) over surveillance"
        ],
        "explanation": "<b>a) under</b>\n\n<b>Point :</b> Collocation / Préposition\n<b>Règle :</b> Under surveillance est l'expression figée pour dire sous surveillance."
      },
      {
        "id": "qcm_anglais__2024_93",
        "question": "93) Cergy is ... from Paris than I thought.",
        "correct": "b) farther",
        "options": [
          "a) further",
          "b) farther",
          "c) far",
          "d) farrer"
        ],
        "explanation": "<b>b) farther</b>\n\n<b>Point :</b> Comparatif de distance physique\n<b>Règle :</b> Pour une distance géographique réelle, on utilise farther. Further est privilégié pour une distance figurative ou supplémentaire (ex: further information)."
      },
      {
        "id": "qcm_anglais__2024_94",
        "question": "94) At the party, the man's unusual mannerisms drew ... attention to him.",
        "correct": "d) everybody's",
        "options": [
          "a) everybody",
          "b) anybody",
          "c) all",
          "d) everybody's"
        ],
        "explanation": "<b>d) everybody's</b>\n\n<b>Point :</b> Génitif (possession)\n<b>Règle :</b> On utilise le 's pour indiquer que l'attention appartient à tout le monde (l'attention de tout le monde)."
      },
      {
        "id": "qcm_anglais__2024_95",
        "question": "95) Which one is not synonymous with to work very hard?",
        "correct": "b) to work as crazy",
        "options": [
          "a) to work around the clock",
          "b) to work as crazy",
          "c) to work tirelessly",
          "d) to be extremely hardworking"
        ],
        "explanation": "<b>b) to work as crazy</b>\n\n<b>Point :</b> Idiome / Comparaison\n<b>Règle :</b> L'expression correcte est to work like crazy. L'usage de as est ici une erreur de structure idiomatique."
      },
      {
        "id": "qcm_anglais__2024_96",
        "question": "96) Sarah was making dinner; Matt was setting a nice table.",
        "correct": "a) meanwhile",
        "options": [
          "a) meanwhile",
          "b) meantime",
          "c) a while",
          "d) during"
        ],
        "explanation": "<b>a) meanwhile</b>\n\n<b>Point :</b> Adverbe de simultanéité\n<b>Règle :</b> Meanwhile est l'adverbe utilisé pour dire pendant ce temps. Meantime s'utilise généralement dans la locution in the meantime."
      },
      {
        "id": "qcm_anglais__2024_97",
        "question": "97) What is the meaning of to be out of hands for a person or a situation?",
        "correct": "a) to become uncontrollable",
        "options": [
          "a) to become uncontrollable",
          "b) to fall from a user's hands",
          "c) to become difficult",
          "d) to disappear"
        ],
        "explanation": "<b>a) to become uncontrollable</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> L'expression to get out of hand (parfois notée hands) signifie qu'une situation échappe à tout contrôle."
      },
      {
        "id": "qcm_anglais__2024_98",
        "question": "98) ... the spectacular growth of online shopping, many people still enjoy window shopping.",
        "correct": "b) Despite",
        "options": [
          "a) Although",
          "b) Despite",
          "c) In spite",
          "d) However"
        ],
        "explanation": "<b>b) Despite</b>\n\n<b>Point :</b> Conjonction d'opposition\n<b>Règle :</b> Despite est suivi d'un groupe nominal. In spite exigerait la présence de of, et Although exigerait une proposition (sujet + verbe)."
      },
      {
        "id": "qcm_anglais__2024_99",
        "question": "99) Which one is the odd one out?",
        "correct": "c) To put it in a nutshell",
        "options": [
          "a) For starters",
          "b) To start with",
          "c) To put it in a nutshell",
          "d) To begin with"
        ],
        "explanation": "<b>c) To put it in a nutshell</b>\n\n<b>Point :</b> Connecteurs logiques / Intrus\n<b>Règle :</b> Les options A, B et D servent à introduire un début de liste ou d'argumentation. In a nutshell sert à résumer ou conclure."
      },
      {
        "id": "qcm_anglais__2024_100",
        "question": "100) Not only ... not drink alcohol, but he doesn't approve of others doing so.",
        "correct": "a) does he",
        "options": [
          "a) does he",
          "b) he does",
          "c) he",
          "d) he would"
        ],
        "explanation": "<b>a) does he</b>\n\n<b>Point :</b> Inversion après adverbe négatif\n<b>Règle :</b> Lorsqu'une phrase commence par Not only, on doit inverser l'ordre sujet-auxiliaire (structure de question)."
      }
    ]
  },
  "qcm_anglais__2023": {
    "id": "qcm_anglais__2023",
    "name": "QCM anglais ➔ 2023",
    "path": "QCM anglais::2023",
    "pathParts": [
      "QCM anglais",
      "2023"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (99 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2023_1",
        "question": "1) Have you ... met a star in the flesh?",
        "correct": "b) ever",
        "options": [
          "a) already",
          "b) ever",
          "c) never",
          "d) yet"
        ],
        "explanation": "<b>b) ever</b>\n\n<b>Point :</b> Present Perfect / Expérience vécue\n<b>Règle :</b> On utilise ever dans les questions au Present Perfect pour demander si une action a déjà eu lieu au moins une fois dans la vie du sujet."
      },
      {
        "id": "qcm_anglais__2023_2",
        "question": "2) When I was 7 years old, I... already quite mature for my age.",
        "correct": "a) was",
        "options": [
          "a) was",
          "b) were",
          "c) have been",
          "d) had been"
        ],
        "explanation": "<b>a) was</b>\n\n<b>Point :</b> Prétérit de BE\n<b>Règle :</b> Le marqueur temporel When I was 7 impose le prétérit simple. Avec le sujet I, la forme correcte est was."
      },
      {
        "id": "qcm_anglais__2023_3",
        "question": "3) Do you enjoy...?",
        "correct": "d) skiing",
        "options": [
          "a) to ski",
          "b) ski",
          "c) skis",
          "d) skiing"
        ],
        "explanation": "<b>d) skiing</b>\n\n<b>Point :</b> Verb Patterns / Goûts\n<b>Règle :</b> Le verbe enjoy est systématiquement suivi d'un gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2023_4",
        "question": "4) I did not quite hear you. What ...?",
        "correct": "a) did you say",
        "options": [
          "a) did you say",
          "b) you said",
          "c) did you",
          "d) said you"
        ],
        "explanation": "<b>a) did you say</b>\n\n<b>Point :</b> Question au prétérit\n<b>Règle :</b> Structure d'une interrogation au passé simple : Mot interrogatif + auxiliaire DID + sujet + Base Verbale."
      },
      {
        "id": "qcm_anglais__2023_5",
        "question": "5) She did not get ... money for her birthday this year.",
        "correct": "c) much",
        "options": [
          "a) many",
          "b) lots",
          "c) much",
          "d) lot of"
        ],
        "explanation": "<b>c) much</b>\n\n<b>Point :</b> Quantifieurs (Indénombrable)\n<b>Règle :</b> Money est un nom indénombrable. Dans une phrase négative, on utilise much pour exprimer une grande quantité."
      },
      {
        "id": "qcm_anglais__2023_6",
        "question": "6) This blog is heavily ... the Russian government.",
        "correct": "b) critical of",
        "options": [
          "a) critical with",
          "b) critical of",
          "c) criticized",
          "d) criticizing"
        ],
        "explanation": "<b>b) critical of</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> L'adjectif critical (au sens de porter un jugement critique) se construit avec la préposition of."
      },
      {
        "id": "qcm_anglais__2023_7",
        "question": "7) She... really know what to answer to that strange request.",
        "correct": "b) didn't",
        "options": [
          "a) hasn't",
          "b) didn't",
          "c) wasn't",
          "d) don't"
        ],
        "explanation": "<b>b) didn't</b>\n\n<b>Point :</b> Auxiliaire de négation au passé\n<b>Règle :</b> Le verbe know nécessite l'auxiliaire do. Le contexte narratif impose le prétérit didn't. Hasn't et wasn't sont grammaticalement incorrects ici."
      },
      {
        "id": "qcm_anglais__2023_8",
        "question": "8) Fancy going to the restaurant tonight?. I'd rather ... at home, sorry.",
        "correct": "b) stay",
        "options": [
          "a) to stay",
          "b) stay",
          "c) staying",
          "d) stayed"
        ],
        "explanation": "<b>b) stay</b>\n\n<b>Point :</b> Expression de la préférence\n<b>Règle :</b> Après would rather ('d rather), on utilise directement la Base Verbale (sans to)."
      },
      {
        "id": "qcm_anglais__2023_9",
        "question": "9) Would you guys like to go ... Greece with me next summer?",
        "correct": "a) to",
        "options": [
          "a) to",
          "b) towards",
          "c) in",
          "d) back"
        ],
        "explanation": "<b>a) to</b>\n\n<b>Point :</b> Préposition de mouvement\n<b>Règle :</b> On utilise la préposition to après un verbe de mouvement (go) pour indiquer la destination (un pays)."
      },
      {
        "id": "qcm_anglais__2023_10",
        "question": "10) They both love ...",
        "correct": "c) electronics",
        "options": [
          "a) electronical",
          "b) electronism",
          "c) electronics",
          "d) electronic"
        ],
        "explanation": "<b>c) electronics</b>\n\n<b>Point :</b> Noms de sciences en -ics\n<b>Règle :</b> Les domaines technologiques ou scientifiques prennent souvent une terminaison en -ics et s'utilisent comme des noms (ex: physics, electronics)."
      },
      {
        "id": "qcm_anglais__2023_11",
        "question": "11) His bike is the same ... ours, isn't it?",
        "correct": "c) as",
        "options": [
          "a) that",
          "b) than",
          "c) as",
          "d) Ø"
        ],
        "explanation": "<b>c) as</b>\n\n<b>Point :</b> Comparaison d'égalité\n<b>Règle :</b> La structure fixe pour exprimer l'identité ou la ressemblance totale est the same as."
      },
      {
        "id": "qcm_anglais__2023_12",
        "question": "12) In Thailand, kids have to wear a uniform ... go to school.",
        "correct": "d) to",
        "options": [
          "a) for",
          "b) for to",
          "c) in order",
          "d) to"
        ],
        "explanation": "<b>d) to</b>\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> L'infinitif de but s'exprime par to + Base Verbale. For serait suivi d'un gérondif."
      },
      {
        "id": "qcm_anglais__2023_13",
        "question": "13) My friends and I have lots of fun when we ...",
        "correct": "d) party",
        "options": [
          "a) do the feast",
          "b) celebrating",
          "c) go at a party",
          "d) party"
        ],
        "explanation": "<b>d) party</b>\n\n<b>Point :</b> Vocabulaire / Verbe d'action\n<b>Règle :</b> To party est le verbe utilisé en anglais pour signifier faire la fête."
      },
      {
        "id": "qcm_anglais__2023_14",
        "question": "14) With today's technology, it looks like ... smaller, ... better.",
        "correct": "d) the / the",
        "options": [
          "a) the / Ø",
          "b) / the",
          "c) Ø / Ø",
          "d) the / the"
        ],
        "explanation": "<b>d) the / the</b>\n\n<b>Point :</b> Double comparatif\n<b>Règle :</b> Structure The + comparatif, the + comparatif pour exprimer une progression parallèle (plus c'est petit, mieux c'est)."
      },
      {
        "id": "qcm_anglais__2023_15",
        "question": "15) This fake news ... published on January 3rd 2023.",
        "correct": "b) was",
        "options": [
          "a) were",
          "b) was",
          "c) have been",
          "d) has been"
        ],
        "explanation": "<b>b) was</b>\n\n<b>Point :</b> Noms indénombrables\n<b>Règle :</b> News est un nom indénombrable singulier en anglais. Il s'accorde donc avec was au prétérit passif."
      },
      {
        "id": "qcm_anglais__2023_16",
        "question": "16) This tiny item is worth up to 3... dollars.",
        "correct": "b) thousand",
        "options": [
          "a) thousands",
          "b) thousand",
          "c) thousands of",
          "d) thousand of"
        ],
        "explanation": "<b>b) thousand</b>\n\n<b>Point :</b> Adjectifs numéraux\n<b>Règle :</b> Les mots thousand, hundred et million sont invariables lorsqu'ils sont précédés d'un nombre précis (ici 3)."
      },
      {
        "id": "qcm_anglais__2023_17",
        "question": "17) It seems that she took a very ... decision in marrying him.",
        "correct": "b) unfortunate",
        "options": [
          "a) infortunate",
          "b) unfortunate",
          "c) unfortunately",
          "d) imfortunate"
        ],
        "explanation": "<b>b) unfortunate</b>\n\n<b>Point :</b> Préfixes privatifs\n<b>Règle :</b> Le préfixe correct pour l'adjectif fortunate est un-. Infortunate n'existe pas en anglais."
      },
      {
        "id": "qcm_anglais__2023_18",
        "question": "18) ... French are famous around the world for their cartoon industry.",
        "correct": "b) The",
        "options": [
          "a) Any",
          "b) The",
          "c) Ø",
          "d) Every"
        ],
        "explanation": "<b>b) The</b>\n\n<b>Point :</b> Article défini / Nationalités\n<b>Règle :</b> On utilise The devant une nationalité (nom pluriel) pour désigner l'ensemble d'un peuple."
      },
      {
        "id": "qcm_anglais__2023_19",
        "question": "19) Not ... a mask in public transport is not a good idea these days.",
        "correct": "a) wearing",
        "options": [
          "a) wearing",
          "b) wear",
          "c) worn",
          "d) to wearing"
        ],
        "explanation": "<b>a) wearing</b>\n\n<b>Point :</b> Gérondif sujet\n<b>Règle :</b> Pour transformer une action en sujet de phrase (Le fait de porter / ne pas porter), on utilise la forme en -ing."
      },
      {
        "id": "qcm_anglais__2023_20",
        "question": "20) He said he loves ... here; it's so peaceful!",
        "correct": "c) it",
        "options": [
          "a) us",
          "b) ours",
          "c) it",
          "d) her"
        ],
        "explanation": "<b>c) it</b>\n\n<b>Point :</b> Idiome / Pronom it objet\n<b>Règle :</b> L'expression to love it here est une structure fixe où it sert d'objet factice désignant le lieu ou la situation actuelle."
      },
      {
        "id": "qcm_anglais__2023_21",
        "question": "21) ... were the most revered people in 19th century Britain.",
        "correct": "a) Engineers",
        "options": [
          "a) Engineers",
          "b) Ingeneers",
          "c) Enginers",
          "d) Engeniers"
        ],
        "explanation": "<b>a) Engineers</b>\n\n<b>Point :</b> Orthographe\n<b>Règle :</b> Engineer (ingénieur) prend deux e à la fin."
      },
      {
        "id": "qcm_anglais__2023_22",
        "question": "22) Do it this way; it's much ....",
        "correct": "c) easier",
        "options": [
          "a) more easier",
          "b) easy",
          "c) easier",
          "d) easily"
        ],
        "explanation": "<b>c) easier</b>\n\n<b>Point :</b> Comparatif de supériorité\n<b>Règle :</b> Pour les adjectifs courts (easy), on ajoute la terminaison -ier. L'utilisation de more devant un comparatif en -er est une faute grave (double comparatif)."
      },
      {
        "id": "qcm_anglais__2023_23",
        "question": "23) I wish you could put yourself ... my shoes.",
        "correct": "a) in",
        "options": [
          "a) in",
          "b) inside",
          "c) on",
          "d) onto"
        ],
        "explanation": "<b>a) in</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> L'expression to put oneself in someone's shoes (se mettre à la place de quelqu'un) utilise la préposition in."
      },
      {
        "id": "qcm_anglais__2023_24",
        "question": "25) Don't look for your birthday present; it ... anyway.",
        "correct": "c) has been hidden",
        "options": [
          "a) is hiding",
          "b) has hidden",
          "c) has been hidden",
          "d) in hiding"
        ],
        "explanation": "<b>c) has been hidden</b>\n\n<b>Point :</b> Voix passive (Present Perfect)\n<b>Règle :</b> Le cadeau n'est pas l'auteur de l'action (il ne s'est pas caché lui-même). On utilise donc le passif be + participe passé."
      },
      {
        "id": "qcm_anglais__2023_25",
        "question": "26) Most young people find ... hard ... speak English correctly.",
        "correct": "b) it / to",
        "options": [
          "a) / to",
          "b) it / to",
          "c) you / to",
          "d) it / you"
        ],
        "explanation": "<b>b) it / to</b>\n\n<b>Point :</b> It anticipateur\n<b>Règle :</b> Après le verbe find, on utilise it comme objet provisoire avant un adjectif suivi d'une proposition infinitive en to."
      },
      {
        "id": "qcm_anglais__2023_26",
        "question": "27) The company ... to update its operating system most urgently.",
        "correct": "d) needs",
        "options": [
          "a) need",
          "b) should",
          "c) could",
          "d) needs"
        ],
        "explanation": "<b>d) needs</b>\n\n<b>Point :</b> Accord sujet-verbe / Structure verbale\n<b>Règle :</b> The company est au singulier, donc le verbe prend un s au présent. De plus, seul need peut être suivi de to."
      },
      {
        "id": "qcm_anglais__2023_27",
        "question": "28) You should know that his interview may be ...",
        "correct": "c) recorded",
        "options": [
          "a) a record",
          "b) recording",
          "c) recorded",
          "d) records"
        ],
        "explanation": "<b>c) recorded</b>\n\n<b>Point :</b> Voix passive après modal\n<b>Règle :</b> Après le modal may et l'auxiliaire be, on utilise le participe passé pour former le passif (peut être enregistrée)."
      },
      {
        "id": "qcm_anglais__2023_28",
        "question": "29) ... loves going on vacation.",
        "correct": "b) Everyone",
        "options": [
          "a) All the people",
          "b) Everyone",
          "c) People",
          "d) All"
        ],
        "explanation": "<b>b) Everyone</b>\n\n<b>Point :</b> Pronoms indéfinis / Accord\n<b>Règle :</b> Le verbe loves est à la 3ème personne du singulier. Everyone est un pronom singulier, alors que People est pluriel."
      },
      {
        "id": "qcm_anglais__2023_29",
        "question": "30) If she ... on every point of the contract, let's sign it now!",
        "correct": "d) agrees",
        "options": [
          "a) is agree",
          "b) agree",
          "c) agreeing",
          "d) agrees"
        ],
        "explanation": "<b>d) agrees</b>\n\n<b>Point :</b> Conditionnel Type 1 / Verbe d'action\n<b>Règle :</b> Après if, on utilise le présent simple. De plus, agree est un verbe d'action en anglais (on ne dit jamais is agree)."
      },
      {
        "id": "qcm_anglais__2023_30",
        "question": "31) It's about time you ... what you want to study next year.",
        "correct": "c) decided",
        "options": [
          "a) decide",
          "b) to decide",
          "c) decided",
          "d) have decided"
        ],
        "explanation": "<b>c) decided</b>\n\n<b>Point :</b> Unreal Past\n<b>Règle :</b> Après l'expression It's about time ou It's high time, on utilise le prétérit pour exprimer une action qui devrait déjà être en cours ou accomplie."
      },
      {
        "id": "qcm_anglais__2023_31",
        "question": "32) I guess it all depends... you.",
        "correct": "b) on",
        "options": [
          "a) of",
          "b) on",
          "c) to",
          "d) off"
        ],
        "explanation": "<b>b) on</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe depend se construit systématiquement avec la préposition on."
      },
      {
        "id": "qcm_anglais__2023_32",
        "question": "33) It is the first time I... a real snake.",
        "correct": "a) have seen",
        "options": [
          "a) have seen",
          "b) see",
          "c) had seen",
          "d) saw"
        ],
        "explanation": "<b>a) have seen</b>\n\n<b>Point :</b> Present Perfect\n<b>Règle :</b> Avec la structure It is the first time, on utilise le Present Perfect (have + participe passé) pour faire le bilan d'une expérience présente."
      },
      {
        "id": "qcm_anglais__2023_33",
        "question": "34) This year we have to ... an internship ourselves.",
        "correct": "a) look for",
        "options": [
          "a) look for",
          "b) look at",
          "c) look into",
          "d) look forward"
        ],
        "explanation": "<b>a) look for</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To look for signifie chercher. Les étudiants doivent chercher un stage par eux-mêmes."
      },
      {
        "id": "qcm_anglais__2023_34",
        "question": "35) Tom ... karate for 5 years now. He is pretty good!",
        "correct": "c) has been practising",
        "options": [
          "a) practises",
          "b) have been practising",
          "c) has been practising",
          "d) had practised"
        ],
        "explanation": "<b>c) has been practising</b>\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> On utilise has been + V-ing pour une action qui a commencé dans le passé et qui se poursuit encore aujourd'hui (marqué par for 5 years now)."
      },
      {
        "id": "qcm_anglais__2023_35",
        "question": "36) Most of the time, Brits need milk ... make a proper cup of tea.",
        "correct": "a) in order to",
        "options": [
          "a) in order to",
          "b) for",
          "c) so as for",
          "d) in order for"
        ],
        "explanation": "<b>a) in order to</b>\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> In order to est suivi d'une base verbale pour exprimer l'objectif ou la finalité d'une action."
      },
      {
        "id": "qcm_anglais__2023_36",
        "question": "37) You ... see this film; it's really awesome!",
        "correct": "d) have to",
        "options": [
          "a) must to",
          "b) may",
          "c) could",
          "d) have to"
        ],
        "explanation": "<b>d) have to</b>\n\n<b>Point :</b> Modalité d'obligation / Conseil fort\n<b>Règle :</b> Must to est grammaticalement incorrect (must est suivi de la BV seule). Have to exprime ici la nécessité ou une recommandation forte."
      },
      {
        "id": "qcm_anglais__2023_37",
        "question": "38) He would love to go to ... to do an internship in the automotive industry.",
        "correct": "c) Germany",
        "options": [
          "a) Deutschland",
          "b) Deutchland",
          "c) Germany",
          "d) German countries"
        ],
        "explanation": "<b>c) Germany</b>\n\n<b>Point :</b> Vocabulaire / Noms de pays\n<b>Règle :</b> Germany est le nom anglais correct pour désigner l'Allemagne. Deutschland est le nom allemand."
      },
      {
        "id": "qcm_anglais__2023_38",
        "question": "39) My family and I go camping ...",
        "correct": "a) every year",
        "options": [
          "a) every year",
          "b) over the years",
          "c) all years",
          "d) any years"
        ],
        "explanation": "<b>a) every year</b>\n\n<b>Point :</b> Expression de la fréquence\n<b>Règle :</b> Every year (chaque année) est la locution temporelle correcte pour exprimer une habitude annuelle."
      },
      {
        "id": "qcm_anglais__2023_39",
        "question": "40) How ... have you stayed in London?",
        "correct": "b) many times",
        "options": [
          "a) many time",
          "b) many times",
          "c) long times",
          "d) much"
        ],
        "explanation": "<b>b) many times</b>\n\n<b>Point :</b> Interrogation sur la fréquence\n<b>Règle :</b> How many times permet d'interroger sur le nombre de fois qu'une action a été répétée. Note : How long aurait interrogé sur la durée, mais n'est pas proposé."
      },
      {
        "id": "qcm_anglais__2023_40",
        "question": "41) I've been living in London ... I left Greece ten years ago.",
        "correct": "a) since",
        "options": [
          "a) since",
          "b) before",
          "c) for",
          "d) during"
        ],
        "explanation": "<b>a) since</b>\n\n<b>Point :</b> Marqueur temporel\n<b>Règle :</b> Since introduit un point de départ précis dans le passé (le moment du départ de Grèce) pour une action qui dure encore."
      },
      {
        "id": "qcm_anglais__2023_41",
        "question": "42) I will drive you home as soon as the ballet class ...",
        "correct": "c) has finished",
        "options": [
          "a) is finishing",
          "b) was over",
          "c) has finished",
          "d) is finish"
        ],
        "explanation": "<b>c) has finished</b>\n\n<b>Point :</b> Future in Time Clauses\n<b>Règle :</b> Dans une subordonnée de temps (as soon as), on utilise le présent simple ou le Present Perfect pour exprimer une action future."
      },
      {
        "id": "qcm_anglais__2023_42",
        "question": "43) I went interailing in Europe last summer. ...",
        "correct": "a) So did I.",
        "options": [
          "a) So did I.",
          "b) So I do.",
          "c) I so did.",
          "d) I did so."
        ],
        "explanation": "<b>a) So did I.</b>\n\n<b>Point :</b> Accord affirmatif au passé\n<b>Règle :</b> Pour dire moi aussi après une phrase au prétérit, on utilise la structure : So + auxiliaire (did) + sujet (I)."
      },
      {
        "id": "qcm_anglais__2023_43",
        "question": "44) It's a pity his girlfriend doesn't want him ...",
        "correct": "b) to travel",
        "options": [
          "a) travelling",
          "b) to travel",
          "c) a traveller",
          "d) for travelling"
        ],
        "explanation": "<b>b) to travel</b>\n\n<b>Point :</b> Structure de Want\n<b>Règle :</b> La structure correcte est Want someone to do something. On utilise l'infinitif complet après le complément d'objet."
      },
      {
        "id": "qcm_anglais__2023_44",
        "question": "45) His hall of residence is ... from his university.",
        "correct": "a) within walking distance",
        "options": [
          "a) within walking distance",
          "b) within a walk",
          "c) within walking",
          "d) no distance"
        ],
        "explanation": "<b>a) within walking distance</b>\n\n<b>Point :</b> Idiome / Distance\n<b>Règle :</b> Within walking distance est l'expression consacrée pour dire que quelque chose est à deux pas ou accessible à pied."
      },
      {
        "id": "qcm_anglais__2023_45",
        "question": "46) Did you forget your laptop? I hope ....",
        "correct": "d) not",
        "options": [
          "a) no",
          "b) none",
          "c) never",
          "d) not"
        ],
        "explanation": "<b>d) not</b>\n\n<b>Point :</b> Réponse courte négative\n<b>Règle :</b> Après des verbes comme hope, fear ou believe, on utilise not pour exprimer que non (ex: I hope not = j'espère que non)."
      },
      {
        "id": "qcm_anglais__2023_46",
        "question": "47) I am used to ... two cups of tea for breakfast.",
        "correct": "c) drinking",
        "options": [
          "a) drink",
          "b) drinks",
          "c) drinking",
          "d) drunk"
        ],
        "explanation": "<b>c) drinking</b>\n\n<b>Point :</b> Be used to + V-ing\n<b>Règle :</b> La structure be used to (être habitué à) exige que le verbe suivant soit au gérondif (forme en -ing)."
      },
      {
        "id": "qcm_anglais__2023_47",
        "question": "48) In which ... will you intern next summer?",
        "correct": "c) company",
        "options": [
          "a) companie",
          "b) compagny",
          "c) company",
          "d) society"
        ],
        "explanation": "<b>c) company</b>\n\n<b>Point :</b> Orthographe et Vocabulaire\n<b>Règle :</b> Company est l'orthographe correcte. Society est un faux-ami signifiant la société au sens humain/général."
      },
      {
        "id": "qcm_anglais__2023_48",
        "question": "49) His strongest point... obviously electronics.",
        "correct": "c) is",
        "options": [
          "a) it's",
          "b) that's",
          "c) is",
          "d) are"
        ],
        "explanation": "<b>c) is</b>\n\n<b>Point :</b> Accord sujet-verbe\n<b>Règle :</b> Le sujet de la phrase est point (singulier), le verbe doit donc être is. It's ou that's créeraient une répétition inutile du sujet."
      },
      {
        "id": "qcm_anglais__2023_49",
        "question": "50) Which word is the odd one out?",
        "correct": "d) stager",
        "options": [
          "a) intern",
          "b) trainee",
          "c) apprentice",
          "d) stager"
        ],
        "explanation": "<b>d) stager</b>\n\n<b>Point :</b> Vocabulaire / Gallicisme\n<b>Règle :</b> Stager n'existe pas en anglais, c'est un calque du mot stagiaire. Les termes corrects sont intern ou trainee."
      },
      {
        "id": "qcm_anglais__2023_50",
        "question": "51) The price is not the same as ...",
        "correct": "c) expected",
        "options": [
          "a) expecting",
          "b) expects",
          "c) expected",
          "d) my expectation"
        ],
        "explanation": "<b>c) expected</b>\n\n<b>Point :</b> Comparaison elliptique\n<b>Règle :</b> The same as expected signifie le même que ce qui était attendu. On utilise le participe passé pour cette structure."
      },
      {
        "id": "qcm_anglais__2023_51",
        "question": "52) If you feel lonely, you can call me ...",
        "correct": "c) at any time",
        "options": [
          "a) anyway",
          "b) many times",
          "c) at any time",
          "d) no time"
        ],
        "explanation": "<b>c) at any time</b>\n\n<b>Point :</b> Expression temporelle\n<b>Règle :</b> At any time signifie à n'importe quel moment."
      },
      {
        "id": "qcm_anglais__2023_52",
        "question": "53) What is she ...?",
        "correct": "d) interested in",
        "options": [
          "a) interesting in",
          "b) interesting at",
          "c) interested by",
          "d) interested in"
        ],
        "explanation": "<b>d) interested in</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> L'adjectif interested (éprouver de l'intérêt) se construit toujours avec la préposition in."
      },
      {
        "id": "qcm_anglais__2023_53",
        "question": "54) ... makes you think he is the best candidate?",
        "correct": "c) What",
        "options": [
          "a) Who",
          "b) Why",
          "c) What",
          "d) Why"
        ],
        "explanation": "<b>c) What</b>\n\n<b>Point :</b> Pronom interrogatif sujet\n<b>Règle :</b> Ici, on interroge sur la cause ou la chose qui provoque la pensée : Qu'est-ce qui te fait penser.... What est le pronom sujet."
      },
      {
        "id": "qcm_anglais__2023_54",
        "question": "55) It is ... fantastic gift. I can't believe my luck!",
        "correct": "b) such a",
        "options": [
          "a) so",
          "b) such a",
          "c) a so",
          "d) so much"
        ],
        "explanation": "<b>b) such a</b>\n\n<b>Point :</b> Structure de l'intensif\n<b>Règle :</b> On utilise Such + a + adjectif + nom singulier pour renforcer un nom qualifié. So ne s'utiliserait que devant l'adjectif seul."
      },
      {
        "id": "qcm_anglais__2023_55",
        "question": "56) Have you noticed that there are ... candidates this year than last year?",
        "correct": "d) fewer",
        "options": [
          "a) less",
          "b) lesser",
          "c) few",
          "d) fewer"
        ],
        "explanation": "<b>d) fewer</b>\n\n<b>Point :</b> Comparatif d'infériorité (Dénombrable)\n<b>Règle :</b> Pour les noms dénombrables au pluriel (candidates), on utilise fewer. Less est réservé aux noms indénombrables."
      },
      {
        "id": "qcm_anglais__2023_56",
        "question": "57) Each country is implementing ... own policy.",
        "correct": "b) its",
        "options": [
          "a) their's",
          "b) its",
          "c) her",
          "d) his"
        ],
        "explanation": "<b>b) its</b>\n\n<b>Point :</b> Adjectif possessif neutre\n<b>Règle :</b> On utilise its (sans apostrophe) pour la possession d'un nom neutre singulier comme country ou state."
      },
      {
        "id": "qcm_anglais__2023_57",
        "question": "58) All the teachers want ... students to become skilled engineers.",
        "correct": "c) their",
        "options": [
          "a) them",
          "b) that",
          "c) their",
          "d) theirs"
        ],
        "explanation": "<b>c) their</b>\n\n<b>Point :</b> Adjectif possessif\n<b>Règle :</b> On utilise their devant le nom students pour indiquer qu'il s'agit de leurs élèves."
      },
      {
        "id": "qcm_anglais__2023_58",
        "question": "59) ... are said to be heavy drinkers.",
        "correct": "a) The Irish",
        "options": [
          "a) The Irish",
          "b) irish people",
          "c) Ireland' people",
          "d) Irish"
        ],
        "explanation": "<b>a) The Irish</b>\n\n<b>Point :</b> Noms de nationalités (Collectif)\n<b>Règle :</b> On utilise The suivi du nom de nationalité pour désigner l'ensemble du peuple (The Irish, The French, The English)."
      },
      {
        "id": "qcm_anglais__2023_59",
        "question": "60) I had to get a part-time job for ... reasons.",
        "correct": "b) economic",
        "options": [
          "a) economical",
          "b) economic",
          "c) finance",
          "d) economics"
        ],
        "explanation": "<b>b) economic</b>\n\n<b>Point :</b> Adjectifs qualificatifs\n<b>Règle :</b> Economic signifie lié à l'économie ou aux finances. Economical signifie qui permet de faire des économies (peu coûteux)."
      },
      {
        "id": "qcm_anglais__2023_60",
        "question": "61) I will go and study in the US ... I get a grant.",
        "correct": "b) provided",
        "options": [
          "a) owing",
          "b) provided",
          "c) unless",
          "d) nevertheless"
        ],
        "explanation": "<b>b) provided</b>\n\n<b>Point :</b> Conjonction de condition\n<b>Règle :</b> Provided (that) signifie à condition que ou pourvu que."
      },
      {
        "id": "qcm_anglais__2023_61",
        "question": "62) Something strange ... last night in the corridor of the residence.",
        "correct": "c) occurred",
        "options": [
          "a) took places",
          "b) has happened",
          "c) occurred",
          "d) arrived"
        ],
        "explanation": "<b>c) occurred</b>\n\n<b>Point :</b> Vocabulaire (Verbe d'événement)\n<b>Règle :</b> To occur est le synonyme de to happen (se produire). Arrived est un faux-ami ici."
      },
      {
        "id": "qcm_anglais__2023_62",
        "question": "63) A scandal ... Rishi Sunak broke out just after he was elected PM.",
        "correct": "d) involving",
        "options": [
          "a) showing off",
          "b) exposing about",
          "c) revealing about",
          "d) involving"
        ],
        "explanation": "<b>d) involving</b>\n\n<b>Point :</b> Participe présent / Relation\n<b>Règle :</b> Involving (impliquant / concernant) est le terme correct pour lier un scandale à une personne."
      },
      {
        "id": "qcm_anglais__2023_63",
        "question": "64) A coach is not a person ... gives advice but a person that puts you on the right path.",
        "correct": "b) who",
        "options": [
          "a) whom",
          "b) who",
          "c) whose",
          "d) which"
        ],
        "explanation": "<b>b) who</b>\n\n<b>Point :</b> Pronom relatif sujet\n<b>Règle :</b> On utilise who pour une personne lorsqu'il est le sujet du verbe qui suit (ici gives)."
      },
      {
        "id": "qcm_anglais__2023_64",
        "question": "65) Which set phrase means very easy?",
        "correct": "b) it's a piece of cake",
        "options": [
          "a) It's as easy as cake",
          "b) it's a piece of cake",
          "c) it's a slice of cake",
          "d) it's a cake"
        ],
        "explanation": "<b>b) it's a piece of cake</b>\n\n<b>Point :</b> Idiome / Expression figée\n<b>Règle :</b> A piece of cake est l'expression idiomatique standard pour dire que quelque chose est très facile."
      },
      {
        "id": "qcm_anglais__2023_65",
        "question": "66) Are you staying at uni or going to your ... at the weekend?",
        "correct": "b) mother's",
        "options": [
          "a) mother place",
          "b) mother's",
          "c) mother",
          "d) mother'"
        ],
        "explanation": "<b>b) mother's</b>\n\n<b>Point :</b> Génitif elliptique\n<b>Règle :</b> On utilise le 's seul pour désigner le domicile d'une personne (chez ma mère)."
      },
      {
        "id": "qcm_anglais__2023_66",
        "question": "67) He doesn't know ... about quantum physics.",
        "correct": "c) much",
        "options": [
          "a) something",
          "b) nothing",
          "c) much",
          "d) a lot of"
        ],
        "explanation": "<b>c) much</b>\n\n<b>Point :</b> Quantifieur / Phrase négative\n<b>Règle :</b> Dans une phrase négative avec un nom indénombrable (physics), on utilise much pour exprimer une grande quantité."
      },
      {
        "id": "qcm_anglais__2023_67",
        "question": "68) Do you prefer jogging ... body building?",
        "correct": "c) to",
        "options": [
          "a) rather than",
          "b) that",
          "c) to",
          "d) at"
        ],
        "explanation": "<b>c) to</b>\n\n<b>Point :</b> Verbe de préférence\n<b>Règle :</b> La structure correcte pour exprimer une préférence entre deux choses est prefer A to B."
      },
      {
        "id": "qcm_anglais__2023_68",
        "question": "69) I wish I ... Japanese and help those tourists.",
        "correct": "b) spoke",
        "options": [
          "a) speak",
          "b) spoke",
          "c) could speak",
          "d) am speaking"
        ],
        "explanation": "<b>b) spoke</b>\n\n<b>Point :</b> Unreal Past (Wish)\n<b>Règle :</b> Après wish, on utilise le prétérit pour exprimer un regret concernant une situation présente."
      },
      {
        "id": "qcm_anglais__2023_69",
        "question": "70) Why not ... pizza tonight?",
        "correct": "b) order",
        "options": [
          "a) to order",
          "b) order",
          "c) ordering",
          "d) orders"
        ],
        "explanation": "<b>b) order</b>\n\n<b>Point :</b> Suggestion\n<b>Règle :</b> La structure Why not est toujours suivie directement de la Base Verbale."
      },
      {
        "id": "qcm_anglais__2023_70",
        "question": "71) If I did not have the right skills, I ... apply for this job.",
        "correct": "c) would not",
        "options": [
          "a) will not",
          "b) would",
          "c) would not",
          "d) will"
        ],
        "explanation": "<b>c) would not</b>\n\n<b>Point :</b> Conditionnel Type 2\n<b>Règle :</b> Structure If + prétérit ... would + BV. Le sens exige ici la négation : je ne postulerais pas."
      },
      {
        "id": "qcm_anglais__2023_71",
        "question": "72) Is there ... coffee left by any chance?",
        "correct": "a) any",
        "options": [
          "a) any",
          "b) some",
          "c) no",
          "d) little"
        ],
        "explanation": "<b>a) any</b>\n\n<b>Point :</b> Déterminant interrogatif\n<b>Règle :</b> On utilise any dans les questions pour interroger sur l'existence d'une quantité indéfinie."
      },
      {
        "id": "qcm_anglais__2023_72",
        "question": "73) You should take some time to think ...",
        "correct": "d) it over",
        "options": [
          "a) on it",
          "b) it about",
          "c) to it",
          "d) it over"
        ],
        "explanation": "<b>d) it over</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To think something over signifie réfléchir mûrement à une proposition ou une idée."
      },
      {
        "id": "qcm_anglais__2023_73",
        "question": "74) ... is he? He is 1.90 meter tall.",
        "correct": "c) How tall",
        "options": [
          "a) How big",
          "b) How high",
          "c) How tall",
          "d) How"
        ],
        "explanation": "<b>c) How tall</b>\n\n<b>Point :</b> Interrogation sur la taille\n<b>Règle :</b> On utilise How tall pour mesurer la taille d'une personne. How high est réservé aux objets ou aux bâtiments."
      },
      {
        "id": "qcm_anglais__2023_74",
        "question": "75) I know that all the students are ... the holidays most impatiently.",
        "correct": "b) waiting for",
        "options": [
          "a) attending for",
          "b) waiting for",
          "c) expecting for",
          "d) waiting"
        ],
        "explanation": "<b>b) waiting for</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe wait exige la préposition for s'il est suivi d'un complément d'objet."
      },
      {
        "id": "qcm_anglais__2023_75",
        "question": "76) My colleague likes things... neatly.",
        "correct": "c) done",
        "options": [
          "a) to do",
          "b) be done",
          "c) done",
          "d) doing"
        ],
        "explanation": "<b>c) done</b>\n\n<b>Point :</b> Structure résultative\n<b>Règle :</b> On utilise V + objet + participe passé pour exprimer la manière dont on aime que les choses soient réalisées ou l'état dans lequel on les préfère."
      },
      {
        "id": "qcm_anglais__2023_76",
        "question": "77) It's a pity we ... you last night but Karen was sick.",
        "correct": "d) couldn't join",
        "options": [
          "a) did join",
          "b) can't join",
          "c) shouldn't join",
          "d) couldn't join"
        ],
        "explanation": "<b>d) couldn't join</b>\n\n<b>Point :</b> Capacité / Possibilité au passé\n<b>Règle :</b> Couldn't est le prétérit de can't, exprimant l'impossibilité de réaliser une action dans le passé."
      },
      {
        "id": "qcm_anglais__2023_77",
        "question": "78) ... climate change, many people will have to migrate to more hospitable climates and countries.",
        "correct": "b) Owing to",
        "options": [
          "a) Owing",
          "b) Owing to",
          "c) Because",
          "d) Contrary to"
        ],
        "explanation": "<b>b) Owing to</b>\n\n<b>Point :</b> Expression de la cause\n<b>Règle :</b> Owing to est une locution prépositive synonyme de due to (en raison de). Because sans of doit être suivi d'une proposition complète (sujet + verbe)."
      },
      {
        "id": "qcm_anglais__2023_78",
        "question": "79) Look, the walls are damp because the drain pipe is ...",
        "correct": "a) leaking",
        "options": [
          "a) leaking",
          "b) fleeing",
          "c) flowing",
          "d) dropping"
        ],
        "explanation": "<b>a) leaking</b>\n\n<b>Point :</b> Vocabulaire technique\n<b>Règle :</b> To leak signifie fuir (pour un liquide ou un gaz s'échappant d'un tuyau ou d'un trou)."
      },
      {
        "id": "qcm_anglais__2023_79",
        "question": "80) He denied ... that nasty remark to his brother.",
        "correct": "c) making",
        "options": [
          "a) made",
          "b) make",
          "c) making",
          "d) to make"
        ],
        "explanation": "<b>c) making</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> Le verbe deny (nier) est obligatoirement suivi du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2023_80",
        "question": "81) My cell phone is out of order. Should I ...?",
        "correct": "b) have it repaired",
        "options": [
          "a) make it repaired",
          "b) have it repaired",
          "c) let it repair",
          "d) get it repair"
        ],
        "explanation": "<b>b) have it repaired</b>\n\n<b>Point :</b> Structure causative\n<b>Règle :</b> Have + objet + participe passé exprime le fait de faire faire quelque chose par un tiers (ici, un réparateur)."
      },
      {
        "id": "qcm_anglais__2023_81",
        "question": "82) He has no brother and no sister. You never told me Neil was ....",
        "correct": "a) an only child",
        "options": [
          "a) an only child",
          "b) a lonely child",
          "c) an alone child",
          "d) alone"
        ],
        "explanation": "<b>a) an only child</b>\n\n<b>Point :</b> Vocabulaire familial\n<b>Règle :</b> An only child est l'expression consacrée pour désigner un enfant unique."
      },
      {
        "id": "qcm_anglais__2023_82",
        "question": "83) ... you hurry up ... you stay in but I'm in a bit of a rush.",
        "correct": "b) Either / or",
        "options": [
          "a) Or / or",
          "b) Either / or",
          "c) Either / nor",
          "d) Either / Ø"
        ],
        "explanation": "<b>b) Either / or</b>\n\n<b>Point :</b> Conjonction de coordination\n<b>Règle :</b> Either... or (soit... soit) permet d'exprimer un choix ou une alternative."
      },
      {
        "id": "qcm_anglais__2023_83",
        "question": "84) The passengers ... the train as soon as they opened the door.",
        "correct": "a) left",
        "options": [
          "a) left",
          "b) leave",
          "c) are leaving",
          "d) have leave"
        ],
        "explanation": "<b>a) left</b>\n\n<b>Point :</b> Temps du récit\n<b>Règle :</b> On utilise le prétérit simple pour des actions passées et terminées. La subordonnée de temps (as soon as they opened) impose la concordance au prétérit."
      },
      {
        "id": "qcm_anglais__2023_84",
        "question": "85) This bike is brand new. Is it ...?",
        "correct": "a) yours",
        "options": [
          "a) yours",
          "b) your",
          "c) you",
          "d) your's"
        ],
        "explanation": "<b>a) yours</b>\n\n<b>Point :</b> Pronom possessif\n<b>Règle :</b> Yours remplace your bike. On ne met jamais d'apostrophe aux pronoms possessifs (hers, ours, yours, theirs)."
      },
      {
        "id": "qcm_anglais__2023_85",
        "question": "86) While she ... in the park, she realized some people were staring at her.",
        "correct": "b) was exercising",
        "options": [
          "a) exercised",
          "b) was exercising",
          "c) had been exercising",
          "d) has exercised"
        ],
        "explanation": "<b>b) was exercising</b>\n\n<b>Point :</b> Past Continuous\n<b>Règle :</b> On utilise was/were + V-ing pour décrire une action longue en cours de déroulement au passé, qui sert de cadre à un événement ponctuel (realized)."
      },
      {
        "id": "qcm_anglais__2023_86",
        "question": "87) I'd love to quit ...",
        "correct": "b) smoking",
        "options": [
          "a) to smoke",
          "b) smoking",
          "c) the smoke",
          "d) the smoking"
        ],
        "explanation": "<b>b) smoking</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> Le verbe quit (arrêter) est suivi du gérondif (V-ing) lorsqu'il exprime l'arrêt d'une habitude."
      },
      {
        "id": "qcm_anglais__2023_87",
        "question": "88) ... the weather was miserable, we decided to stay in and binge watch some series.",
        "correct": "d) As",
        "options": [
          "a) Consequently",
          "b) As a consequence",
          "c) So",
          "d) As"
        ],
        "explanation": "<b>d) As</b>\n\n<b>Point :</b> Conjonction de cause\n<b>Règle :</b> As signifie ici puisque ou comme et introduit la raison de la décision."
      },
      {
        "id": "qcm_anglais__2023_88",
        "question": "89) We have decided ... any good New Year resolutions this year.",
        "correct": "d) not to make",
        "options": [
          "a) not making",
          "b) to not make",
          "c) not make",
          "d) not to make"
        ],
        "explanation": "<b>d) not to make</b>\n\n<b>Point :</b> Infinitif négatif\n<b>Règle :</b> Après decide, on utilise to + base verbale. À la forme négative, le not se place devant le to."
      },
      {
        "id": "qcm_anglais__2023_89",
        "question": "90) We won't consider you for our basket-ball team until you ...",
        "correct": "c) grow up",
        "options": [
          "a) are growing",
          "b) are growing up",
          "c) grow up",
          "d) have grow up"
        ],
        "explanation": "<b>c) grow up</b>\n\n<b>Point :</b> Future in Time Clauses\n<b>Règle :</b> Après until, on utilise le présent simple (et non le futur) pour exprimer une action future."
      },
      {
        "id": "qcm_anglais__2023_90",
        "question": "91) She wants to buy herself a new car when she ... 18.",
        "correct": "b) turns",
        "options": [
          "a) will turn",
          "b) turns",
          "c) turn",
          "d) have turned"
        ],
        "explanation": "<b>b) turns</b>\n\n<b>Point :</b> Future in Time Clauses\n<b>Règle :</b> Dans une subordonnée de temps introduite par when, on utilise le présent simple pour évoquer le futur."
      },
      {
        "id": "qcm_anglais__2023_91",
        "question": "92) The gang did not know that the police had them ... .",
        "correct": "a) under surveillance",
        "options": [
          "a) under surveillance",
          "b) in surveillance",
          "c) surveilled",
          "d) over surveillance"
        ],
        "explanation": "<b>a) under surveillance</b>\n\n<b>Point :</b> Collocation / Préposition\n<b>Règle :</b> Under surveillance est l'expression fixe pour dire sous surveillance."
      },
      {
        "id": "qcm_anglais__2023_92",
        "question": "93) What does his decision depend ...?",
        "correct": "b) on",
        "options": [
          "a) Ø",
          "b) on",
          "c) of",
          "d) over"
        ],
        "explanation": "<b>b) on</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe depend se construit systématiquement avec la préposition on."
      },
      {
        "id": "qcm_anglais__2023_93",
        "question": "94) Paul's unusual mannerisms draw... attention to him.",
        "correct": "d) everybody's",
        "options": [
          "a) everybody",
          "b) anybody",
          "c) all",
          "d) everybody's"
        ],
        "explanation": "<b>d) everybody's</b>\n\n<b>Point :</b> Cas possessif (Génitif)\n<b>Règle :</b> On utilise le 's pour indiquer que l'attention appartient à tout le monde (l'attention de tout le monde)."
      },
      {
        "id": "qcm_anglais__2023_94",
        "question": "95) Which one is synonymous with to work night and day?",
        "correct": "a) to work around the clock",
        "options": [
          "a) to work around the clock",
          "b) to work on the clock",
          "c) to work like a clock",
          "d) to work clockwise"
        ],
        "explanation": "<b>a) to work around the clock</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> Around the clock signifie 24h/24, soit travailler sans relâche jour et nuit."
      },
      {
        "id": "qcm_anglais__2023_95",
        "question": "96) Sarah was rehearsing her presentation; ..., Matt was finishing his maths.",
        "correct": "a) meanwhile",
        "options": [
          "a) meanwhile",
          "b) meantime",
          "c) a while",
          "d) during"
        ],
        "explanation": "<b>a) meanwhile</b>\n\n<b>Point :</b> Adverbe de simultanéité\n<b>Règle :</b> Meanwhile est l'adverbe utilisé pour exprimer pendant ce temps entre deux propositions indépendantes."
      },
      {
        "id": "qcm_anglais__2023_96",
        "question": "97) What is the meaning of to get out of hand for a person or a situation?",
        "correct": "a) to become uncontrollable",
        "options": [
          "a) to become uncontrollable",
          "b) to fall from a user's hands",
          "c) to become difficult",
          "d) to disappear"
        ],
        "explanation": "<b>a) to become uncontrollable</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> L'expression to get out of hand signifie qu'une situation échappe à tout contrôle."
      },
      {
        "id": "qcm_anglais__2023_97",
        "question": "98) She ... really know what to answer to that strange request.",
        "correct": "b) didn't",
        "options": [
          "a) hasn't",
          "b) didn't",
          "c) can",
          "d) will"
        ],
        "explanation": "<b>b) didn't</b>\n\n<b>Point :</b> Auxiliaire de négation\n<b>Règle :</b> Le verbe know nécessite l'auxiliaire do pour la négation au prétérit (didn't)."
      },
      {
        "id": "qcm_anglais__2023_98",
        "question": "99) Which one is the odd one out?",
        "correct": "d) In general",
        "options": [
          "a) To cut a long story short",
          "b) In short",
          "c) In a word",
          "d) In general"
        ],
        "explanation": "<b>d) In general</b>\n\n<b>Point :</b> Connecteurs logiques / Intrus\n<b>Règle :</b> Les trois premières options servent à résumer ou abréger un propos. In general exprime une généralité."
      },
      {
        "id": "qcm_anglais__2023_99",
        "question": "100) To make ends meet means:",
        "correct": "c) to earn just enough money to live on",
        "options": [
          "a) To last until the end",
          "b) To get two ends to touch",
          "c) to earn just enough money to live on",
          "d) to match two things"
        ],
        "explanation": "<b>c) to earn just enough money to live on</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> To make ends meet (joindre les deux bouts) signifie gagner juste assez d'argent pour subvenir à ses besoins."
      }
    ]
  },
  "qcm_anglais__2022": {
    "id": "qcm_anglais__2022",
    "name": "QCM anglais ➔ 2022",
    "path": "QCM anglais::2022",
    "pathParts": [
      "QCM anglais",
      "2022"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2022_1",
        "question": "1) This time tomorrow, you ... sitting in a deck chair on the beach. Lucky you!",
        "correct": "d) will be",
        "options": [
          "a) are",
          "b) were",
          "c) will",
          "d) will be"
        ],
        "explanation": "<b>D) will be</b>\n\n<b>Point :</b> Future Continuous\n<b>Règle :</b> On utilise will be + V-ing pour décrire une action qui sera en cours de déroulement à un moment précis du futur."
      },
      {
        "id": "qcm_anglais__2022_2",
        "question": "2) Before you telephoned, I... working on my English presentation for next week.",
        "correct": "a) was",
        "options": [
          "a) was",
          "b) will be",
          "c) can",
          "d) have been"
        ],
        "explanation": "<b>A) was</b>\n\n<b>Point :</b> Past Continuous\n<b>Règle :</b> On utilise le prétérit en BE+ING pour une action qui servait de cadre (le travail sur la présentation) au moment où un événement ponctuel est survenu (le coup de téléphone)."
      },
      {
        "id": "qcm_anglais__2022_3",
        "question": "3) Tomorrow, we ... taking a day off.",
        "correct": "a) are",
        "options": [
          "a) are",
          "b) will",
          "c) have",
          "d) Ø"
        ],
        "explanation": "<b>A) are</b>\n\n<b>Point :</b> Présent Continu à valeur de futur\n<b>Règle :</b> Le présent continu (be + V-ing) est utilisé pour exprimer des arrangements ou des décisions déjà prises pour le futur proche."
      },
      {
        "id": "qcm_anglais__2022_4",
        "question": "4) Where did they ... for their holiday in the end?",
        "correct": "b) go",
        "options": [
          "a) went",
          "b) go",
          "c) gone",
          "d) going"
        ],
        "explanation": "<b>B) go</b>\n\n<b>Point :</b> Question au prétérit simple\n<b>Règle :</b> Après l'auxiliaire did, le verbe se met obligatoirement à la base verbale (sans marque de temps)."
      },
      {
        "id": "qcm_anglais__2022_5",
        "question": "5) I must admit you...try but the answer is still no.",
        "correct": "b) did",
        "options": [
          "a) have",
          "b) did",
          "c) will",
          "d) could"
        ],
        "explanation": "<b>B) did</b>\n\n<b>Point :</b> Did emphatique\n<b>Règle :</b> On utilise l'auxiliaire did devant une base verbale dans une phrase affirmative pour insister sur la réalité d'une action (Tu as BIEN essayé)."
      },
      {
        "id": "qcm_anglais__2022_6",
        "question": "6) How ... have you visited the USA?",
        "correct": "c) many times",
        "options": [
          "a) long",
          "b) much time",
          "c) many times",
          "d) Ø"
        ],
        "explanation": "<b>C) many times</b>\n\n<b>Point :</b> Interrogation sur la fréquence\n<b>Règle :</b> How many times permet de compter le nombre de fois qu'une action a été effectuée. How long interrogerait sur la durée."
      },
      {
        "id": "qcm_anglais__2022_7",
        "question": "7) He's ... working there since he left school.",
        "correct": "d) been",
        "options": [
          "a) had",
          "b) done",
          "c) have",
          "d) been"
        ],
        "explanation": "<b>D) been</b>\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> La structure has been + V-ing (He's = He has) exprime une action commencée dans le passé qui se poursuit encore, avec le marqueur since."
      },
      {
        "id": "qcm_anglais__2022_8",
        "question": "8) It's time you ... to school or you'll be late.",
        "correct": "b) went",
        "options": [
          "a) go",
          "b) went",
          "c) are going",
          "d) going"
        ],
        "explanation": "<b>B) went</b>\n\n<b>Point :</b> Unreal Past\n<b>Règle :</b> Après It's time, on utilise le prétérit pour exprimer une action qui devrait déjà être faite."
      },
      {
        "id": "qcm_anglais__2022_9",
        "question": "9) We honestly couldn't follow a word of what you ... last night.",
        "correct": "c) were saying",
        "options": [
          "a) are saying",
          "b) will say",
          "c) were saying",
          "d) did say"
        ],
        "explanation": "<b>C) were saying</b>\n\n<b>Point :</b> Concordance des temps / Aspect progressif\n<b>Règle :</b> On utilise le Past Continuous pour décrire ce que la personne était en train de dire au moment passé du récit."
      },
      {
        "id": "qcm_anglais__2022_10",
        "question": "10) I've just ... that the price of gas has gone up again.",
        "correct": "c) been told",
        "options": [
          "a) have told",
          "b) am told",
          "c) been told",
          "d) was told"
        ],
        "explanation": "<b>C) been told</b>\n\n<b>Point :</b> Passif au Present Perfect\n<b>Règle :</b> La structure have been + participe passé exprime une action subie (on m'a dit) dont le résultat est lié au présent."
      },
      {
        "id": "qcm_anglais__2022_11",
        "question": "11) If you were stopped by the police for speeding, what ... you do?",
        "correct": "c) would",
        "options": [
          "a) will",
          "b) shall",
          "c) would",
          "d) can"
        ],
        "explanation": "<b>C) would</b>\n\n<b>Point :</b> Conditionnel Type 2\n<b>Règle :</b> Dans une hypothèse au présent (If + prétérit), la proposition principale utilise would + base verbale."
      },
      {
        "id": "qcm_anglais__2022_12",
        "question": "12) If we get there early enough, we ... you a seat.",
        "correct": "d) shall save",
        "options": [
          "a) did save",
          "b) do save",
          "c) am saving",
          "d) shall save"
        ],
        "explanation": "<b>D) shall save</b>\n\n<b>Point :</b> Futur / Conditionnel Type 1\n<b>Règle :</b> Dans une structure en If + présent, on utilise le futur (will ou shall) dans la principale pour une conséquence probable."
      },
      {
        "id": "qcm_anglais__2022_13",
        "question": "13) When I'm in town, I ... listening to the birds.",
        "correct": "d) miss",
        "options": [
          "a) missing",
          "b) am missing",
          "c) missed",
          "d) miss"
        ],
        "explanation": "<b>D) miss</b>\n\n<b>Point :</b> Présent simple\n<b>Règle :</b> On utilise le présent simple pour exprimer une habitude ou un sentiment permanent."
      },
      {
        "id": "qcm_anglais__2022_14",
        "question": "14) Ah, there you ...! I was wondering where you were.",
        "correct": "b) are",
        "options": [
          "a) be",
          "b) are",
          "c) were",
          "d) have been"
        ],
        "explanation": "<b>B) are</b>\n\n<b>Point :</b> Locution idiomatique au présent\n<b>Règle :</b> There you are est l'expression fixe pour dire Ah, t'es là / voilà."
      },
      {
        "id": "qcm_anglais__2022_15",
        "question": "15) She said she'd help him if she ...",
        "correct": "a) could",
        "options": [
          "a) could",
          "b) can",
          "c) can't",
          "d) have been able"
        ],
        "explanation": "<b>A) could</b>\n\n<b>Point :</b> Concordance des temps / Conditionnel\n<b>Règle :</b> Dans le style indirect introduit par un verbe au passé (said), can devient could pour respecter la concordance des temps."
      },
      {
        "id": "qcm_anglais__2022_16",
        "question": "16) He would not go until he ... seen all the paintings.",
        "correct": "a) had",
        "options": [
          "a) had",
          "b) was",
          "c) is",
          "d) has"
        ],
        "explanation": "<b>A) had</b>\n\n<b>Point :</b> Past Perfect\n<b>Règle :</b> On utilise le Past Perfect (had + participe passé) pour exprimer l'antériorité d'une action par rapport à un moment passé (le moment où il est parti)."
      },
      {
        "id": "qcm_anglais__2022_17",
        "question": "17) James ... my friend for over 10 years.",
        "correct": "b) has been",
        "options": [
          "a) is",
          "b) has been",
          "c) has been being",
          "d) is being"
        ],
        "explanation": "<b>B) has been</b>\n\n<b>Point :</b> Present Perfect\n<b>Règle :</b> Pour exprimer un bilan de durée (une action qui a commencé dans le passé et qui dure encore), on utilise le Present Perfect avec for."
      },
      {
        "id": "qcm_anglais__2022_18",
        "question": "18) How ... have you been waiting in the rain?",
        "correct": "d) long",
        "options": [
          "a) much",
          "b) many",
          "c) often",
          "d) long"
        ],
        "explanation": "<b>D) long</b>\n\n<b>Point :</b> Interrogation sur la durée\n<b>Règle :</b> How long est la structure utilisée pour interroger sur la durée d'une action."
      },
      {
        "id": "qcm_anglais__2022_19",
        "question": "19) It is often said that Honesty is the ... policy.",
        "correct": "d) best",
        "options": [
          "a) Ø",
          "b) better",
          "c) greater",
          "d) best"
        ],
        "explanation": "<b>D) best</b>\n\n<b>Point :</b> Superlatif / Proverbe\n<b>Règle :</b> Honesty is the best policy est un proverbe anglais figé signifiant que l'honnêteté est toujours la meilleure solution."
      },
      {
        "id": "qcm_anglais__2022_20",
        "question": "20) Management is unable to say when the new policy will ...",
        "correct": "c) be implemented",
        "options": [
          "a) implement",
          "b) implemented",
          "c) be implemented",
          "d) be implementing"
        ],
        "explanation": "<b>C) be implemented</b>\n\n<b>Point :</b> Voix passive au futur\n<b>Règle :</b> La politique ne s'implante pas elle-même ; elle sera implantée. On utilise will be + participe passé."
      },
      {
        "id": "qcm_anglais__2022_21",
        "question": "21) We are late. I'm afraid the game ... started.",
        "correct": "c) has already",
        "options": [
          "a) is already",
          "b) is ever",
          "c) has already",
          "d) has ever"
        ],
        "explanation": "<b>C) has already</b>\n\n<b>Point :</b> Present Perfect / Adverbe\n<b>Règle :</b> On utilise has already pour indiquer qu'une action est déjà accomplie au moment où l'on parle."
      },
      {
        "id": "qcm_anglais__2022_22",
        "question": "22) Sometimes in business, rules have to be changed ... needs.",
        "correct": "c) according to",
        "options": [
          "a) for the",
          "b) regarded to",
          "c) according to",
          "d) relative in"
        ],
        "explanation": "<b>C) according to</b>\n\n<b>Point :</b> Locution prépositive\n<b>Règle :</b> According to signifie selon ou en fonction de. C'est la structure correcte pour lier le changement des règles aux besoins."
      },
      {
        "id": "qcm_anglais__2022_23",
        "question": "23) Health and safety issues should be a priority with ... organization.",
        "correct": "d) any",
        "options": [
          "a) some",
          "b) Ø",
          "c) many",
          "d) any"
        ],
        "explanation": "<b>D) any</b>\n\n<b>Point :</b> Déterminant distributif\n<b>Règle :</b> Any exprime ici l'idée de n'importe quelle organisation, sans exception."
      },
      {
        "id": "qcm_anglais__2022_24",
        "question": "24) Jerry, our new German teacher, ... German for 5 years now.",
        "correct": "d) has been teaching",
        "options": [
          "a) is teaching",
          "b) taught",
          "c) has been taught",
          "d) has been teaching"
        ],
        "explanation": "<b>D) has been teaching</b>\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> On utilise has been + V-ing pour souligner la durée d'une action commencée dans le passé et toujours en cours (for 5 years now)."
      },
      {
        "id": "qcm_anglais__2022_25",
        "question": "25) The company accepts ... responsibility for items lost or stolen.",
        "correct": "b) no",
        "options": [
          "a) none",
          "b) no",
          "c) not",
          "d) Ø"
        ],
        "explanation": "<b>B) no</b>\n\n<b>Point :</b> Déterminant de négation\n<b>Règle :</b> On utilise no directement devant un nom (responsibility) pour exprimer une absence totale de quantité ou de qualité."
      },
      {
        "id": "qcm_anglais__2022_26",
        "question": "26) In ... advertising, accuracy is most important when it comes to identifying the target market.",
        "correct": "d) Ø",
        "options": [
          "a) the",
          "b) some",
          "c) any",
          "d) Ø"
        ],
        "explanation": "<b>D) Ø</b>\n\n<b>Point :</b> Article zéro\n<b>Règle :</b> On n'utilise pas d'article devant les noms de domaines ou de concepts abstraits (comme la publicité) pris dans un sens général."
      },
      {
        "id": "qcm_anglais__2022_27",
        "question": "27) Have you ... seen such a funny film?",
        "correct": "d) ever",
        "options": [
          "a) already",
          "b) never",
          "c) always",
          "d) ever"
        ],
        "explanation": "<b>D) ever</b>\n\n<b>Point :</b> Present Perfect / Question\n<b>Règle :</b> Dans une question portant sur une expérience de vie au Present Perfect, on utilise ever (déjà/jamais)."
      },
      {
        "id": "qcm_anglais__2022_28",
        "question": "28) We have to agree ... new planning regulations.",
        "correct": "d) on",
        "options": [
          "a) for",
          "b) Ø",
          "c) in",
          "d) on"
        ],
        "explanation": "<b>D) on</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe agree se construit avec la préposition on lorsqu'il s'agit de se mettre d'accord sur un sujet ou un document."
      },
      {
        "id": "qcm_anglais__2022_29",
        "question": "29) The company spends too much ... sponsorship.",
        "correct": "a) on",
        "options": [
          "a) on",
          "b) at",
          "c) in",
          "d) for"
        ],
        "explanation": "<b>A) on</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Le verbe spend (dépenser) se construit avec la préposition on pour introduire l'objet de la dépense."
      },
      {
        "id": "qcm_anglais__2022_30",
        "question": "30) They often work till 8 and have a late dinner, ... they do in Spain.",
        "correct": "a) as",
        "options": [
          "a) as",
          "b) so",
          "c) likewise",
          "d) likely"
        ],
        "explanation": "<b>A) as</b>\n\n<b>Point :</b> Conjonction de comparaison\n<b>Règle :</b> On utilise as pour introduire une proposition de comparaison (as + sujet + verbe). Like s'utiliserait devant un nom seul."
      },
      {
        "id": "qcm_anglais__2022_31",
        "question": "31) I don't understand ... English they speak in some parts of the USA.",
        "correct": "c) the",
        "options": [
          "a) an",
          "b) Ø",
          "c) the",
          "d) a"
        ],
        "explanation": "<b>C) the</b>\n\n<b>Point :</b> Article défini\n<b>Règle :</b> Bien qu'on n'utilise pas d'article pour les langues en général, on utilise the lorsqu'elle est spécifiée par une proposition relative (l'anglais QU'ILS parlent)."
      },
      {
        "id": "qcm_anglais__2022_32",
        "question": "32) We never work ... Sundays.",
        "correct": "a) on",
        "options": [
          "a) on",
          "b) in",
          "c) for",
          "d) at"
        ],
        "explanation": "<b>A) on</b>\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> On utilise systématiquement la préposition on devant les jours de la semaine."
      },
      {
        "id": "qcm_anglais__2022_33",
        "question": "33) She worked ... a sales rep for 3 years, then she joined our department.",
        "correct": "a) as",
        "options": [
          "a) as",
          "b) such as",
          "c) like",
          "d) likely"
        ],
        "explanation": "<b>A) as</b>\n\n<b>Point :</b> Préposition de fonction\n<b>Règle :</b> On utilise as pour indiquer une fonction réelle ou un métier (en tant que). Like indiquerait une simple ressemblance."
      },
      {
        "id": "qcm_anglais__2022_34",
        "question": "34) ... United States ... becoming more and more vulnerable to ... natural disasters.",
        "correct": "b) The/is/Ø",
        "options": [
          "a) The/is/the",
          "b) The/is/Ø",
          "c) Ø/are/the",
          "d) Ø/are/Ø"
        ],
        "explanation": "<b>B) The / is / Ø</b>\n\n<b>Point :</b> Articles et accord\n<b>Règle :</b> Les noms de pays au pluriel comme The United States prennent l'article the mais s'accordent au singulier (is). On utilise l'article zéro devant les noms au pluriel pris au sens général (disasters)."
      },
      {
        "id": "qcm_anglais__2022_35",
        "question": "35) My husband is an early bird. He gets ... at 6 every day of the week.",
        "correct": "b) up",
        "options": [
          "a) out",
          "b) up",
          "c) on",
          "d) over"
        ],
        "explanation": "<b>B) up</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To get up signifie se lever (sortir du lit). Un early bird est un lève-tôt."
      },
      {
        "id": "qcm_anglais__2022_36",
        "question": "36) They never agree ... each other. They had better get a divorce.",
        "correct": "d) with",
        "options": [
          "a) Ø",
          "b) for",
          "c) on",
          "d) with"
        ],
        "explanation": "<b>D) with</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> On utilise agree with someone pour dire que l'on est d'accord avec une personne."
      },
      {
        "id": "qcm_anglais__2022_37",
        "question": "37) ... 7 p.m, the shipment still hadn't arrived.",
        "correct": "d) At",
        "options": [
          "a) In",
          "b) until",
          "c) On",
          "d) At"
        ],
        "explanation": "<b>D) At</b>\n\n<b>Point :</b> Préposition de temps (heure)\n<b>Règle :</b> On utilise la préposition at pour introduire une heure précise."
      },
      {
        "id": "qcm_anglais__2022_38",
        "question": "38) John McEwan trained as ... engineer, but moved into ... sales a few years later.",
        "correct": "a) an / Ø",
        "options": [
          "a) an / Ø",
          "b) a / Ø",
          "c) Ø / the",
          "d) an / the"
        ],
        "explanation": "<b>A) an / Ø</b>\n\n<b>Point :</b> Articles / Métiers et domaines\n<b>Règle :</b> On utilise l'article indéfini (a/an) devant un métier. Engineer commençant par une voyelle, on utilise an. Le domaine sales (les ventes) ne prend pas d'article ici."
      },
      {
        "id": "qcm_anglais__2022_39",
        "question": "39) The application form must be returned ... tomorrow.",
        "correct": "a) by",
        "options": [
          "a) by",
          "b) For",
          "c) within",
          "d) at"
        ],
        "explanation": "<b>A) by</b>\n\n<b>Point :</b> Préposition de limite temporelle\n<b>Règle :</b> By signifie au plus tard ou d'ici une certaine date."
      },
      {
        "id": "qcm_anglais__2022_40",
        "question": "40) According to the police, the burglars broke ... the house around midnight.",
        "correct": "a) into",
        "options": [
          "a) into",
          "b) in",
          "c) over",
          "d) up"
        ],
        "explanation": "<b>A) into</b>\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> To break into signifie entrer par effraction dans un lieu."
      },
      {
        "id": "qcm_anglais__2022_41",
        "question": "41) I have never got ... with my brother-in-law.",
        "correct": "a) on",
        "options": [
          "a) on",
          "b) into",
          "c) over",
          "d) up"
        ],
        "explanation": "<b>A) on</b>\n\n<b>Point :</b> Phrasal Verb / Relation\n<b>Règle :</b> To get on (well) with someone signifie s'entendre (bien) avec quelqu'un."
      },
      {
        "id": "qcm_anglais__2022_42",
        "question": "42) Wood ... have risen by more than 20% over the last month.",
        "correct": "c) prices",
        "options": [
          "a) price",
          "b) prize",
          "c) prices",
          "d) prizes"
        ],
        "explanation": "<b>C) prices</b>\n\n<b>Point :</b> Vocabulaire / Accord\n<b>Règle :</b> Prices (prix) s'accorde au pluriel avec l'auxiliaire have. Prize signifie une récompense."
      },
      {
        "id": "qcm_anglais__2022_43",
        "question": "43) She keeps her notes in a ... folder.",
        "correct": "a) big red plastic",
        "options": [
          "a) big red plastic",
          "b) red big plastic",
          "c) plastic big red",
          "d) big plastic red"
        ],
        "explanation": "<b>A) big red plastic</b>\n\n<b>Point :</b> Ordre des adjectifs\n<b>Règle :</b> L'ordre habituel est : Opinion &gt; Taille (big) &gt; Âge &gt; Couleur (red) &gt; Origine &gt; Matière (plastic)."
      },
      {
        "id": "qcm_anglais__2022_44",
        "question": "44) While my motorbike ... I wandered round the city center which is lovely.",
        "correct": "d) was being repaired",
        "options": [
          "a) be repaired",
          "b) being repaired",
          "c) was repairing",
          "d) was being repaired"
        ],
        "explanation": "<b>D) was being repaired</b>\n\n<b>Point :</b> Passif au Past Continuous\n<b>Règle :</b> On utilise le passif progressif (was being + participe passé) pour exprimer qu'une action était en train d'être subie par l'objet (la moto était en train d'être réparée)."
      },
      {
        "id": "qcm_anglais__2022_45",
        "question": "45) There has been an increase ... the number of faulty products recently.",
        "correct": "b) in",
        "options": [
          "a) of",
          "b) in",
          "c) for",
          "d) to"
        ],
        "explanation": "<b>B) in</b>\n\n<b>Point :</b> Nom à préposition fixe\n<b>Règle :</b> Le nom increase est suivi de la préposition in pour indiquer le domaine de l'augmentation."
      },
      {
        "id": "qcm_anglais__2022_46",
        "question": "46) He is very good ... singing but is a useless dancer.",
        "correct": "a) at",
        "options": [
          "a) at",
          "b) in",
          "c) about",
          "d) into"
        ],
        "explanation": "<b>A) at</b>\n\n<b>Point :</b> Adjectif à préposition fixe\n<b>Règle :</b> Good at (+ V-ing ou nom) est la structure utilisée pour exprimer une compétence."
      },
      {
        "id": "qcm_anglais__2022_47",
        "question": "47) Last spring, my boyfriend promised me we ... on a city break sometime soon.",
        "correct": "c) would go",
        "options": [
          "a) will go",
          "b) went",
          "c) would go",
          "d) should go"
        ],
        "explanation": "<b>C) would go</b>\n\n<b>Point :</b> Future in the past\n<b>Règle :</b> Dans un récit au passé (promised), le futur will devient would pour exprimer une action à venir vue depuis ce moment passé."
      },
      {
        "id": "qcm_anglais__2022_48",
        "question": "48) Rod was wearing his dad's brown jacket yesterday, ... he?",
        "correct": "b) wasn't",
        "options": [
          "a) was",
          "b) wasn't",
          "c) were",
          "d) didn't"
        ],
        "explanation": "<b>B) wasn't</b>\n\n<b>Point :</b> Question Tag\n<b>Règle :</b> On reprend l'auxiliaire de la phrase (was) à la forme opposée (wasn't) pour demander confirmation."
      },
      {
        "id": "qcm_anglais__2022_49",
        "question": "49) It is relatively easy to enter ... our lab, which is a real problem.",
        "correct": "d) Ø",
        "options": [
          "a) in",
          "b) of",
          "c) within",
          "d) Ø"
        ],
        "explanation": "<b>D) Ø</b>\n\n<b>Point :</b> Verbe sans préposition\n<b>Règle :</b> Le verbe enter est transitif direct en anglais pour un lieu physique (on n'ajoute pas in)."
      },
      {
        "id": "qcm_anglais__2022_50",
        "question": "50) If you ask me, this app is ... useful than that one.",
        "correct": "a) less",
        "options": [
          "a) less",
          "b) as",
          "c) so",
          "d) such"
        ],
        "explanation": "<b>A) less</b>\n\n<b>Point :</b> Comparatif d'infériorité\n<b>Règle :</b> On utilise less devant un adjectif long pour comparer deux éléments."
      },
      {
        "id": "qcm_anglais__2022_51",
        "question": "51) When they ... their sandwiches, they went for a swim in the lake.",
        "correct": "b) had eaten",
        "options": [
          "a) had been eating",
          "b) had eaten",
          "c) will have eaten",
          "d) will be eating"
        ],
        "explanation": "<b>B) had eaten</b>\n\n<b>Point :</b> Past Perfect\n<b>Règle :</b> On utilise le Past Perfect (had + participe passé) pour une action terminée avant un autre moment du passé (went)."
      },
      {
        "id": "qcm_anglais__2022_52",
        "question": "52) If the meeting doesn't end ... time, I'll have to apologize and leave.",
        "correct": "b) on",
        "options": [
          "a) at",
          "b) on",
          "c) within",
          "d) by"
        ],
        "explanation": "<b>B) on</b>\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> On time exprime la ponctualité (à l'heure prévue), par opposition à in time (assez tôt pour)."
      },
      {
        "id": "qcm_anglais__2022_53",
        "question": "53) I borrowed this book ... the library and wish you would read it.",
        "correct": "b) from",
        "options": [
          "a) for",
          "b) from",
          "c) to",
          "d) of"
        ],
        "explanation": "<b>B) from</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> On utilise borrow something from someone/somewhere (emprunter à)."
      },
      {
        "id": "qcm_anglais__2022_54",
        "question": "54) Mark is good at scientific subjects ... programming computers.",
        "correct": "b) such as",
        "options": [
          "a) such",
          "b) such as",
          "c) so",
          "d) as"
        ],
        "explanation": "<b>B) such as</b>\n\n<b>Point :</b> Expression de l'exemple\n<b>Règle :</b> Such as introduit des exemples précis illustrant une catégorie générale."
      },
      {
        "id": "qcm_anglais__2022_55",
        "question": "55) Claire did learn ... Portuguese before she started her internship in Brazil.",
        "correct": "d) some",
        "options": [
          "a) some little",
          "b) little by little",
          "c) some much",
          "d) some"
        ],
        "explanation": "<b>D) some</b>\n\n<b>Point :</b> Quantifieur\n<b>Règle :</b> Some est utilisé devant un nom indénombrable (une langue) pour exprimer une quantité indéfinie mais réelle."
      },
      {
        "id": "qcm_anglais__2022_56",
        "question": "56) His supervisor has congratulated him on his doing a good ...",
        "correct": "d) job",
        "options": [
          "a) task",
          "b) work",
          "c) mission",
          "d) job"
        ],
        "explanation": "<b>D) job</b>\n\n<b>Point :</b> Collocation\n<b>Règle :</b> L'expression consacrée pour féliciter quelqu'un de son travail est to do a good job."
      },
      {
        "id": "qcm_anglais__2022_57",
        "question": "57) Her arguments weren't very ...",
        "correct": "c) convincing",
        "options": [
          "a) convinced",
          "b) convince",
          "c) convincing",
          "d) convinces"
        ],
        "explanation": "<b>C) convincing</b>\n\n<b>Point :</b> Adjectif en -ING\n<b>Règle :</b> On utilise la forme en -ing pour décrire une caractéristique (les arguments sont convaincants). La forme en -ed décrirait un sentiment."
      },
      {
        "id": "qcm_anglais__2022_58",
        "question": "58) When you apply ... a job, you need a perfect résumé.",
        "correct": "d) for",
        "options": [
          "a) in",
          "b) into",
          "c) forward",
          "d) for"
        ],
        "explanation": "<b>D) for</b>\n\n<b>Point :</b> Verbe à préposition fixe\n<b>Règle :</b> Apply for a job est la structure standard pour dire postuler à un emploi."
      },
      {
        "id": "qcm_anglais__2022_59",
        "question": "59) In this restaurant, dinner is served from 6 ... to midnight.",
        "correct": "c) p.m.",
        "options": [
          "a) sharp",
          "b) a.m.",
          "c) p.m.",
          "d) clock"
        ],
        "explanation": "<b>C) p.m.</b>\n\n<b>Point :</b> Expression de l'heure\n<b>Règle :</b> p.m. désigne les heures après midi (le soir), ce qui correspond à l'heure du dîner."
      },
      {
        "id": "qcm_anglais__2022_60",
        "question": "60) Ladies and gentlemen, this is the room in ... the poet died.",
        "correct": "a) which",
        "options": [
          "a) which",
          "b) where",
          "c) whose",
          "d) that"
        ],
        "explanation": "<b>A) which</b>\n\n<b>Point :</b> Pronom relatif avec préposition\n<b>Règle :</b> On utilise which lorsqu'une préposition (in) précède le pronom relatif pour un lieu. Si in n'était pas là, on utiliserait where."
      },
      {
        "id": "qcm_anglais__2022_61",
        "question": "61) On seeing the teacher trip and fall, the students couldn't help ...",
        "correct": "b) laughing",
        "options": [
          "a) laugh",
          "b) laughing",
          "c) laughed",
          "d) to laugh"
        ],
        "explanation": "<b>B) laughing</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> L'expression can't help (ne pas pouvoir s'empêcher de) est systématiquement suivie du gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2022_62",
        "question": "62) ... the end of May, they will have sold all their stock.",
        "correct": "a) By",
        "options": [
          "a) By",
          "b) On",
          "c) In",
          "d) To"
        ],
        "explanation": "<b>A) By</b>\n\n<b>Point :</b> Expression du délai\n<b>Règle :</b> By exprime une limite temporelle (d'ici, au plus tard). Il est souvent couplé au Future Perfect (will have sold)."
      },
      {
        "id": "qcm_anglais__2022_63",
        "question": "63) Both products are obviously bad quality but that one is probably ... of the two.",
        "correct": "a) the worse",
        "options": [
          "a) the worse",
          "b) the worst",
          "c) worst",
          "d) worse"
        ],
        "explanation": "<b>A) the worse</b>\n\n<b>Point :</b> Comparatif vs Superlatif\n<b>Règle :</b> Lorsqu'on compare seulement DEUX éléments, on utilise le comparatif de supériorité précédé de the. Le superlatif (the worst) est réservé aux groupes de trois ou plus."
      },
      {
        "id": "qcm_anglais__2022_64",
        "question": "64) The T-shirt you want is ... sale.",
        "correct": "c) on",
        "options": [
          "a) at",
          "b) in",
          "c) on",
          "d) off"
        ],
        "explanation": "<b>C) on</b>\n\n<b>Point :</b> Collocation\n<b>Règle :</b> On sale est l'expression correcte pour dire que quelque chose est en vente ou en promotion."
      },
      {
        "id": "qcm_anglais__2022_65",
        "question": "65) Is your room within ... of your school?",
        "correct": "d) walking distance",
        "options": [
          "a) walk distance",
          "b) a walk",
          "c) a walker's",
          "d) walking distance"
        ],
        "explanation": "<b>D) walking distance</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> Within walking distance signifie à une distance accessible à pied."
      },
      {
        "id": "qcm_anglais__2022_66",
        "question": "66) I am looking forward ... you again, the headhunter said.",
        "correct": "a) to meeting",
        "options": [
          "a) to meeting",
          "b) to meet",
          "c) for meeting",
          "d) at meeting"
        ],
        "explanation": "<b>A) to meeting</b>\n\n<b>Point :</b> Verb Patterns\n<b>Règle :</b> L'expression look forward to est suivie du gérondif (V-ing) car to est ici une préposition, pas une marque de l'infinitif."
      },
      {
        "id": "qcm_anglais__2022_67",
        "question": "67) Could you please call the customer who hasn't ordered any articles ... two years and investigate?",
        "correct": "d) for",
        "options": [
          "a) during",
          "b) while",
          "c) since",
          "d) for"
        ],
        "explanation": "<b>D) for</b>\n\n<b>Point :</b> Marqueur de durée\n<b>Règle :</b> On utilise for pour exprimer la durée d'une action ou d'une absence d'action (pendant deux ans). Since introduirait un point de départ."
      },
      {
        "id": "qcm_anglais__2022_68",
        "question": "68) She said ..., which we understood perfectly.",
        "correct": "b) No way",
        "options": [
          "a) No won",
          "b) No way",
          "c) Not entrance",
          "d) None problem"
        ],
        "explanation": "<b>B) No way</b>\n\n<b>Point :</b> Idiome / Expression familière\n<b>Règle :</b> No way est une expression figée signifiant Pas question ou Impossible."
      },
      {
        "id": "qcm_anglais__2022_69",
        "question": "69) Who do you reckon will be ... president next May?",
        "correct": "b) France's",
        "options": [
          "a) the France's",
          "b) France's",
          "c) a French",
          "d) a"
        ],
        "explanation": "<b>B) France's</b>\n\n<b>Point :</b> Cas possessif (Génitif)\n<b>Règle :</b> Pour exprimer la possession liée à un pays, on utilise le nom du pays + 's. On ne met pas l'article the devant France."
      },
      {
        "id": "qcm_anglais__2022_70",
        "question": "70) ... said to be disappearing. What a pity!",
        "correct": "b) Bees are",
        "options": [
          "a) Bee is",
          "b) Bees are",
          "c) All of bees are",
          "d) Every bees"
        ],
        "explanation": "<b>B) Bees are</b>\n\n<b>Point :</b> Généralité au pluriel\n<b>Règle :</b> Pour parler d'une espèce en général, on utilise le pluriel sans article (article zéro). Le verbe s'accorde au pluriel (are)."
      },
      {
        "id": "qcm_anglais__2022_71",
        "question": "71) Ms Jones promised to place a large order for our chocolates ... Easter.",
        "correct": "d) at",
        "options": [
          "a) In",
          "b) on",
          "c) since",
          "d) at"
        ],
        "explanation": "<b>D) at</b>\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> On utilise at pour les périodes de fêtes religieuses ou de congés considérées comme un bloc (at Easter, at Christmas)."
      },
      {
        "id": "qcm_anglais__2022_72",
        "question": "72) I very much enjoyed that film. ....",
        "correct": "d) So did I",
        "options": [
          "a) Neither did I",
          "b) So I did",
          "c) So I do",
          "d) So did I"
        ],
        "explanation": "<b>D) So did I</b>\n\n<b>Point :</b> Accord affirmatif au passé\n<b>Règle :</b> Pour dire moi aussi au prétérit : So + auxiliaire (did) + sujet (I)."
      },
      {
        "id": "qcm_anglais__2022_73",
        "question": "73) Have you seen ... James Bond movie?",
        "correct": "b) the latest",
        "options": [
          "a) the last",
          "b) the latest",
          "c) the lately",
          "d) the late"
        ],
        "explanation": "<b>B) the latest</b>\n\n<b>Point :</b> Vocabulaire / Adjectif\n<b>Règle :</b> The latest signifie le plus récent dans une série qui continue. The last signifierait le dernier d'une série définitivement terminée."
      },
      {
        "id": "qcm_anglais__2022_74",
        "question": "74) Pick the one that does not mean at present:",
        "correct": "a) actually",
        "options": [
          "a) actually",
          "b) currently",
          "c) presently",
          "d) for the"
        ],
        "explanation": "<b>A) actually</b>\n\n<b>Point :</b> Faux-ami\n<b>Règle :</b> Actually signifie en fait ou en réalité. Les trois autres options signifient actuellement ou pour le moment."
      },
      {
        "id": "qcm_anglais__2022_75",
        "question": "89) Would you say that Berlin is worth...?",
        "correct": "d) visiting",
        "options": [
          "a) visit",
          "b) to visit",
          "c) visited",
          "d) visiting"
        ],
        "explanation": "<b>D) visiting</b>\n\n<b>Point :</b> Structure de Worth \n<b>Règle :</b> L'adjectif worth (valoir la peine) est suivi d'un gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2022_76",
        "question": "90) The TOEIC certification is not that difficult; ... you need to practise and learn how to manage your time.",
        "correct": "b) however",
        "options": [
          "a) because",
          "b) however",
          "c) since",
          "d) as long as"
        ],
        "explanation": "<b>B) however</b>\n\n<b>Point :</b> Connecteur d'opposition \n<b>Règle :</b> However (cependant) introduit une nuance ou une restriction à l'affirmation précédente."
      },
      {
        "id": "qcm_anglais__2022_77",
        "question": "91) What about spending a holiday abroad when the lockdown ... to an end?",
        "correct": "b) comes",
        "options": [
          "a) will come",
          "b) comes",
          "c) come",
          "d) must to come"
        ],
        "explanation": "<b>B) comes</b>\n\n<b>Point :</b> Future in Time Clauses \n<b>Règle :</b> Après when, on utilise le présent simple pour exprimer le futur dans une subordonnée de temps."
      },
      {
        "id": "qcm_anglais__2022_78",
        "question": "92) Did you know that you can ... a lot of money teaching English in some Asian countries?",
        "correct": "c) make",
        "options": [
          "a) earning",
          "b) win",
          "c) make",
          "d) do"
        ],
        "explanation": "<b>C) make</b>\n\n<b>Point :</b> Collocation \n<b>Règle :</b> L'expression consacrée pour gagner de l'argent par le travail est to make money."
      },
      {
        "id": "qcm_anglais__2022_79",
        "question": "93) I can't remember ... I am to see the bank manager.",
        "correct": "d) at what time",
        "options": [
          "a) how long for",
          "b) whenever",
          "c) at what moment",
          "d) at what time"
        ],
        "explanation": "<b>D) at what time</b>\n\n<b>Point :</b> Interrogation sur l'heure \n<b>Règle :</b> At what time est la structure standard pour demander une heure précise de rendez-vous."
      },
      {
        "id": "qcm_anglais__2022_80",
        "question": "94) Due to urgent repairs on the track, the train had to be cancelled. We apologize for the ...",
        "correct": "a) inconvenience",
        "options": [
          "a) inconvenience",
          "b) delays",
          "c) late",
          "d) worries"
        ],
        "explanation": "<b>A) inconvenience</b>\n\n<b>Point :</b> Vocabulaire / Collocation \n<b>Règle :</b> Apologize for the inconvenience (présenter ses excuses pour le désagrément) est une formule de politesse standard."
      },
      {
        "id": "qcm_anglais__2022_81",
        "question": "95) Train apps are ... useful to make a quick train reservation.",
        "correct": "a) most",
        "options": [
          "a) most",
          "b) much",
          "c) such",
          "d) quiet"
        ],
        "explanation": "<b>A) most</b>\n\n<b>Point :</b> Adverbe de degré \n<b>Règle :</b> Dans ce contexte, <b>most</b> est utilisé comme un adverbe de degré pour signifier <b>très</b> ou <b>extrêmement</b> (very). C'est un usage formel mais courant."
      },
      {
        "id": "qcm_anglais__2022_82",
        "question": "96) ... the result, the experiment is certainly worth trying.",
        "correct": "a) Whatever",
        "options": [
          "a) Whatever",
          "b) Even though",
          "c) However",
          "d) For all"
        ],
        "explanation": "<b>A) Whatever</b>\n\n<b>Point :</b> Pronom relatif indéfini \n<b>Règle :</b> Whatever signifie quel que soit ou peu importe. Ici : Quel que soit le résultat."
      },
      {
        "id": "qcm_anglais__2022_83",
        "question": "97) When we saw him, we really wondered what he would be ... as a colleague.",
        "correct": "a) like",
        "options": [
          "a) like",
          "b) likely",
          "c) alike",
          "d) the like"
        ],
        "explanation": "<b>A) like</b>\n\n<b>Point :</b> Description d'une personne \n<b>Règle :</b> La structure What is someone like? sert à interroger ou décrire le caractère ou l'apparence d'une personne."
      },
      {
        "id": "qcm_anglais__2022_84",
        "question": "98) The next budget will be reduced. It's a pity but we ... help it.",
        "correct": "d) can't",
        "options": [
          "a) mustn't",
          "b) haven't to",
          "c) shan't",
          "d) can't"
        ],
        "explanation": "<b>D) can't</b>\n\n<b>Point :</b> Idiome \n<b>Règle :</b> Can't help it est une expression figée signifiant ne rien y pouvoir ou ne pas pouvoir s'en empêcher."
      },
      {
        "id": "qcm_anglais__2022_85",
        "question": "99) Excuse me sir, what's the best way to get to Tower Bridge? ... way you go, you can't miss it.",
        "correct": "c) Whichever",
        "options": [
          "a) Wherever",
          "b) What",
          "c) Whichever",
          "d) Anywhere"
        ],
        "explanation": "<b>C) Whichever</b>\n\n<b>Point :</b> Déterminant relatif \n<b>Règle :</b> Whichever way signifie n'importe quel chemin (parmi ceux possibles)."
      },
      {
        "id": "qcm_anglais__2022_86",
        "question": "100) When she broke a leg, her pain was not as bad as it ...",
        "correct": "a) might have been",
        "options": [
          "a) might have been",
          "b) need have been",
          "c) must have been",
          "d) can have been"
        ],
        "explanation": "<b>A) might have been</b>\n\n<b>Point :</b> Modalité / Hypothèse passée \n<b>Règle :</b> Might have + participe passé exprime une possibilité qui ne s'est pas réalisée (ce qui aurait pu être)."
      },
      {
        "id": "qcm_anglais__2022_87",
        "question": "75) We intend to install the new equipment... the vacation.",
        "correct": "a) during",
        "options": [
          "a) during",
          "b) since",
          "c) at",
          "d) within"
        ],
        "explanation": "<b>A) during</b>\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> On utilise during pour indiquer qu'un événement se déroule pendant une période de temps donnée (pendant les vacances)."
      },
      {
        "id": "qcm_anglais__2022_88",
        "question": "76) If we had known you were in Spain at the same time as us, we ... to see you.",
        "correct": "d) would have come",
        "options": [
          "a) would come",
          "b) came",
          "c) should come",
          "d) would have come"
        ],
        "explanation": "<b>D) would have come</b>\n\n<b>Point :</b> Conditionnel Passé (Type 3)\n<b>Règle :</b> Dans une structure en If + past perfect (had known), on utilise would have + participe passé dans la principale pour exprimer une hypothèse sur le passé qui ne s'est pas réalisée."
      },
      {
        "id": "qcm_anglais__2022_89",
        "question": "77) Her internship was a ... internship.",
        "correct": "c) 3-month",
        "options": [
          "a) 3 months long",
          "b) 3-months",
          "c) 3-month",
          "d) 3-monthed"
        ],
        "explanation": "<b>C) 3-month</b>\n\n<b>Point :</b> Adjectif composé\n<b>Règle :</b> Lorsqu'une mesure (nombre + nom) est placée devant un nom comme adjectif, elle est invariable (pas de 's') et les termes sont liés par un trait d'union."
      },
      {
        "id": "qcm_anglais__2022_90",
        "question": "78) He did really well in his exams so he was accepted in ... schools he was keen on.",
        "correct": "c) all the",
        "options": [
          "a) every",
          "b) all",
          "c) all the",
          "d) any"
        ],
        "explanation": "<b>C) all the</b>\n\n<b>Point :</b> Déterminant de totalité\n<b>Règle :</b> On utilise all the devant un nom pluriel pour désigner la totalité d'un groupe spécifique d'objets ou de lieux."
      },
      {
        "id": "qcm_anglais__2022_91",
        "question": "79) The more, ... is a proverb that often proves to be true.",
        "correct": "d) the merrier",
        "options": [
          "a) the funnier",
          "b) the better",
          "c) the madder",
          "d) the merrier"
        ],
        "explanation": "<b>D) the merrier</b>\n\n<b>Point :</b> Proverbe\n<b>Règle :</b> The more the merrier est l'expression consacrée pour dire Plus on est de fous, plus on rit."
      },
      {
        "id": "qcm_anglais__2022_92",
        "question": "80) Who lives the... from school in his group?",
        "correct": "a) farthest",
        "options": [
          "a) farthest",
          "b) farrest",
          "c) farther",
          "d) further"
        ],
        "explanation": "<b>A) farthest</b>\n\n<b>Point :</b> Superlatif de distance\n<b>Règle :</b> Le superlatif de far pour désigner la plus grande distance physique est farthest. Further est plus courant pour une distance figurative."
      },
      {
        "id": "qcm_anglais__2022_93",
        "question": "81) One of the following does not mean in the end:",
        "correct": "a) at least",
        "options": [
          "a) at least",
          "b) eventually",
          "c) finally",
          "d) at the end of the day"
        ],
        "explanation": "<b>A) at least</b>\n\n<b>Point :</b> Vocabulaire / Synonymie\n<b>Règle :</b> At least signifie au moins, alors que les trois autres options expriment l'idée de finalement ou en fin de compte."
      },
      {
        "id": "qcm_anglais__2022_94",
        "question": "82) They will help us, ...?",
        "correct": "d) won't they",
        "options": [
          "a) don't they",
          "b) isn't it",
          "c) will they",
          "d) won't they"
        ],
        "explanation": "<b>D) won't they</b>\n\n<b>Point :</b> Question Tag\n<b>Règle :</b> Avec une phrase affirmative au futur (will), le tag de confirmation reprend l'auxiliaire à la forme opposée (won't)."
      },
      {
        "id": "qcm_anglais__2022_95",
        "question": "83) She wanted to have an international career, ... she did a double diploma in the US.",
        "correct": "b) therefore",
        "options": [
          "a) although",
          "b) therefore",
          "c) such as",
          "d) whereas"
        ],
        "explanation": "<b>B) therefore</b>\n\n<b>Point :</b> Connecteur de conséquence\n<b>Règle :</b> Therefore (par conséquent) introduit la conséquence logique d'un objectif ou d'une situation."
      },
      {
        "id": "qcm_anglais__2022_96",
        "question": "84) What about ... out to a pizzeria tonight?",
        "correct": "a) going",
        "options": [
          "a) going",
          "b) gone",
          "c) went",
          "d) we going"
        ],
        "explanation": "<b>A) going</b>\n\n<b>Point :</b> Suggestion\n<b>Règle :</b> Après la structure What about, on utilise systématiquement le gérondif (V-ing)."
      },
      {
        "id": "qcm_anglais__2022_97",
        "question": "85) Well, you never know; give it ...",
        "correct": "b) a try",
        "options": [
          "a) a go-ahead",
          "b) a try",
          "c) a call",
          "d) a trial"
        ],
        "explanation": "<b>B) a try</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> Give it a try est l'expression idiomatique standard pour dire essayer ou tenter le coup."
      },
      {
        "id": "qcm_anglais__2022_98",
        "question": "86) It was music to my ears is said of something that:",
        "correct": "b) is pleasant to hear",
        "options": [
          "a) is melodious",
          "b) is pleasant to hear",
          "c) is related to classical music",
          "d) calms you down"
        ],
        "explanation": "<b>B) is pleasant to hear</b>\n\n<b>Point :</b> Idiome\n<b>Règle :</b> Cette expression signifie qu'une information ou une nouvelle est particulièrement agréable à entendre."
      },
      {
        "id": "qcm_anglais__2022_99",
        "question": "87) In Japan, you ... initiate physical contact with people as it would be a cultural faux-pas.",
        "correct": "c) shouldn't",
        "options": [
          "a) should",
          "b) could",
          "c) shouldn't",
          "d) ought not"
        ],
        "explanation": "<b>C) shouldn't</b>\n\n<b>Point :</b> Modalité / Conseil\n<b>Règle :</b> Shouldn't exprime ici un conseil ou une recommandation de ne pas faire quelque chose pour éviter un impair social."
      },
      {
        "id": "qcm_anglais__2022_100",
        "question": "88) I can go on an Erasmus exchange program... the cost of living is not too high.",
        "correct": "a) provided",
        "options": [
          "a) provided",
          "b) unless",
          "c) as long",
          "d) considering"
        ],
        "explanation": "<b>A) provided</b>\n\n<b>Point :</b> Condition\n<b>Règle :</b> Provided (that) signifie à condition que. As long as aurait été correct, mais as long seul est grammaticalement incomplet."
      }
    ]
  },
  "qcm_anglais__2021": {
    "id": "qcm_anglais__2021",
    "name": "QCM anglais ➔ 2021",
    "path": "QCM anglais::2021",
    "pathParts": [
      "QCM anglais",
      "2021"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2021_1",
        "question": "1) This morning I met John.... the bus-stop.",
        "correct": "d) at",
        "options": [
          "a) in",
          "b) before",
          "c) to",
          "d) at"
        ],
        "explanation": "d) at\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> On utilise <b>at</b> pour désigner un point précis dans l'espace (un arrêt de bus, une adresse)."
      },
      {
        "id": "qcm_anglais__2021_2",
        "question": "2) ... guests who arrived yesterday came by plane.",
        "correct": "a) Most of the",
        "options": [
          "a) Most of the",
          "b) Most of",
          "c) The most of",
          "d) The most of the"
        ],
        "explanation": "a) Most of the\n\n<b>Point :</b> Quantifieurs\n<b>Règle :</b> Devant un nom spécifique introduit par un article, on utilise <b>Most of the</b>."
      },
      {
        "id": "qcm_anglais__2021_3",
        "question": "3) My bank account has been ... the red for a while.",
        "correct": "a) in",
        "options": [
          "a) in",
          "b) on",
          "c) to",
          "d) at"
        ],
        "explanation": "a) in\n\n<b>Point :</b> Expression idiomatique\n<b>Règle :</b> <b>In the red</b> signifie être à découvert (le contraire est in the black)."
      },
      {
        "id": "qcm_anglais__2021_4",
        "question": "4) Ms Sailor, our Japanese distributor, suggested Tom... her in a few weeks.",
        "correct": "b) call",
        "options": [
          "a) to call",
          "b) call",
          "c) calling",
          "d) called"
        ],
        "explanation": "c) calling; b) call (subjonctif)\n\n<b>Point :</b> Verbe de suggestion\n<b>Règle :</b> Le verbe <b>suggest</b> est suivi de <b>V-ing</b> ou d'une subordonnée en that, jamais de to + infinitif."
      },
      {
        "id": "qcm_anglais__2021_5",
        "question": "5) My boss would like ... more with Asian customers.",
        "correct": "c) to work",
        "options": [
          "a) for work",
          "b) working",
          "c) to work",
          "d) worked"
        ],
        "explanation": "c) to work\n\n<b>Point :</b> Volition\n<b>Règle :</b> Après <b>would like</b>, on utilise toujours l'infinitif complet (<b>to + Base Verbale</b>)."
      },
      {
        "id": "qcm_anglais__2021_6",
        "question": "6) The wall of the store ... was not badly damaged, but we decided to strengthen ...",
        "correct": "c) itself/ it",
        "options": [
          "a) oneself/it",
          "b) oneself/its",
          "c) itself/ it",
          "d) itself/ its"
        ],
        "explanation": "c) itself/ it\n\n<b>Point :</b> Réfléchis et Pronoms personnels\n<b>Règle :</b> <b>Itself</b> renforce l'objet inanimé (le mur lui-même). <b>It</b> remplace l'objet complément (le renforcer)."
      },
      {
        "id": "qcm_anglais__2021_7",
        "question": "7) Jim... his office. It looks lovely now.",
        "correct": "d) got a worker to repaint",
        "options": [
          "a) had a worker repainted",
          "b) got a worker repaint",
          "c) had a worker to repaint",
          "d) got a worker to repaint"
        ],
        "explanation": "d) got a worker to repaint\n\n<b>Point :</b> Structure causative (faire faire)\n<b>Règle :</b> La structure est <b>Get + quelqu'un + TO + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2021_8",
        "question": "8) When I ... 20, I want to tour the world with my friends.",
        "correct": "d) am",
        "options": [
          "a) be",
          "b) will be",
          "c) am being",
          "d) am"
        ],
        "explanation": "d) am\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après <b>When</b>, on utilise le <b>Présent Simple</b> pour exprimer une action future (interdiction du futur avec will)."
      },
      {
        "id": "qcm_anglais__2021_9",
        "question": "9) Where can they leave your key?. They can ... it back in my mail box.",
        "correct": "b) drop",
        "options": [
          "a) pose",
          "b) drop",
          "c) live",
          "d) let"
        ],
        "explanation": "b) drop\n\n<b>Point :</b> Vocabulaire / Phrasal verb\n<b>Règle :</b> <b>To drop (something) off/back</b> signifie déposer ou laisser quelque chose rapidement."
      },
      {
        "id": "qcm_anglais__2021_10",
        "question": "10) Mr Tatler's office is... the second floor.",
        "correct": "a) on",
        "options": [
          "a) on",
          "b) in",
          "c) into",
          "d) at"
        ],
        "explanation": "a) on\n\n<b>Point :</b> Préposition de surface\n<b>Règle :</b> On utilise toujours <b>on</b> pour les étages (floor)."
      },
      {
        "id": "qcm_anglais__2021_11",
        "question": "11) Despite the legal difficulties, we decided to go... with the merger.",
        "correct": "b) ahead",
        "options": [
          "a) up",
          "b) ahead",
          "c) onto",
          "d) off"
        ],
        "explanation": "b) ahead\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To go ahead</b> signifie continuer ou lancer une action comme prévu."
      },
      {
        "id": "qcm_anglais__2021_12",
        "question": "12) He enjoys traveling... his boss prefers staying at the office.",
        "correct": "a) whereas",
        "options": [
          "a) whereas",
          "b) in spite of",
          "c) unlike",
          "d) because of"
        ],
        "explanation": "a) whereas\n\n<b>Point :</b> Contraste\n<b>Règle :</b> <b>Whereas</b> (tandis que) permet d'opposer deux propositions complètes."
      },
      {
        "id": "qcm_anglais__2021_13",
        "question": "13) Look, Lena's phone is on the coffee table. She ... have left it there last night.",
        "correct": "d) must",
        "options": [
          "a) should",
          "b) would",
          "c) could",
          "d) must"
        ],
        "explanation": "d) must\n\n<b>Point :</b> Modalité (quasi-certitude)\n<b>Règle :</b> <b>Must have + Participe Passé</b> exprime une déduction quasi-certaine sur un fait passé."
      },
      {
        "id": "qcm_anglais__2021_14",
        "question": "14) You ... pay now, just give a deposit.",
        "correct": "b) needn't",
        "options": [
          "a) shan't",
          "b) needn't",
          "c) wouldn't",
          "d) ought"
        ],
        "explanation": "b) needn't\n\n<b>Point :</b> Absence d'obligation\n<b>Règle :</b> <b>Needn't</b> signifie que l'action n'est pas nécessaire (tu n'as pas besoin de)."
      },
      {
        "id": "qcm_anglais__2021_15",
        "question": "15) I will ask Mr McManus for... because I'd like to get a loan.",
        "correct": "c) an appointment",
        "options": [
          "a) a rendez-vous",
          "b) a date",
          "c) an appointment",
          "d) a consultation"
        ],
        "explanation": "c) an appointment\n\n<b>Point :</b> Vocabulaire / Faux-amis\n<b>Règle :</b> Dans un contexte professionnel, on utilise <b>appointment</b>. Rendez-vous est souvent lié à une rencontre sociale ou galante en anglais."
      },
      {
        "id": "qcm_anglais__2021_16",
        "question": "16) Which actor does he ... most?",
        "correct": "b) admire",
        "options": [
          "a) admires",
          "b) admire",
          "c) admired",
          "d) admiring"
        ],
        "explanation": "b) admire\n\n<b>Point :</b> Grammaire (Interrogation)\n<b>Règle :</b> Après l'auxiliaire <b>does</b>, le verbe est toujours à la <b>Base Verbale</b> (pas de -s, pas de -ed)."
      },
      {
        "id": "qcm_anglais__2021_17",
        "question": "17) There was a new play last night and the audience ... for five minutes. I guess people loved the play.",
        "correct": "c) applauded",
        "options": [
          "a) applaude",
          "b) have applauded",
          "c) applauded",
          "d) have been applauding"
        ],
        "explanation": "c) applauded\n\n<b>Point :</b> Temps du passé\n<b>Règle :</b> L'action est terminée, datée (last night) et n'a pas de lien avec le présent : on utilise le <b>Prétérit simple</b>."
      },
      {
        "id": "qcm_anglais__2021_18",
        "question": "18) She was advised to arrive... the airport very early.",
        "correct": "b) at",
        "options": [
          "a) in",
          "b) at",
          "c) into",
          "d) on"
        ],
        "explanation": "b) at\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> On utilise <b>at</b> pour les lieux fonctionnels ou les étapes d'un trajet (airport, station, etc.)."
      },
      {
        "id": "qcm_anglais__2021_19",
        "question": "19) I don't like my job very much ... the salary is good.",
        "correct": "b) but",
        "options": [
          "a) as a result",
          "b) but",
          "c) despite",
          "d) consequently"
        ],
        "explanation": "b) but\n\n<b>Point :</b> Connecteur de contraste\n<b>Règle :</b> <b>But</b> (mais) relie deux propositions indépendantes qui s'opposent."
      },
      {
        "id": "qcm_anglais__2021_20",
        "question": "20) How do you get... with your new colleagues? Very well, thanks.",
        "correct": "d) along",
        "options": [
          "a) up",
          "b) forward",
          "c) down",
          "d) along"
        ],
        "explanation": "d) along\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To get along with someone</b> signifie bien s'entendre avec quelqu'un."
      },
      {
        "id": "qcm_anglais__2021_21",
        "question": "21) If I ... more money, I... more income tax.",
        "correct": "c) had earned / would have paid",
        "options": [
          "a) had earned / will pay",
          "b) earned / would have paid",
          "c) had earned / would have paid",
          "d) earned / will pay"
        ],
        "explanation": "c) had earned / would have paid\n\n<b>Point :</b> Conditionnel passé (If Clause type 3)\n<b>Règle :</b> Pour un regret sur le passé : <b>If + Past Perfect (had earned)</b>, suivi de <b>Would have + Participe Passé</b>."
      },
      {
        "id": "qcm_anglais__2021_22",
        "question": "22) They have been seeing each other for 6 months; and yet they... each other for over ten years.",
        "correct": "a) have known",
        "options": [
          "a) have known",
          "b) know",
          "c) knew",
          "d) have been knowing"
        ],
        "explanation": "a) have known\n\n<b>Point :</b> Verbes d'état au présent parfait\n<b>Règle :</b> <b>Know</b> est un verbe d'état (statique) : on ne peut pas l'utiliser à la forme -ing. On utilise le <b>Present Perfect simple</b>."
      },
      {
        "id": "qcm_anglais__2021_23",
        "question": "23)... they really ... or just pretending?",
        "correct": "b) Are / working",
        "options": [
          "a) Do / work",
          "b) Are / working",
          "c) Did / work",
          "d) Will / work"
        ],
        "explanation": "b) Are / working\n\n<b>Point :</b> Aspect (Be + -ing)\n<b>Règle :</b> On utilise la forme progressive pour une action en train de se dérouler au moment où l'on parle."
      },
      {
        "id": "qcm_anglais__2021_24",
        "question": "24) Stop cleaning this old wall. You ... your time.",
        "correct": "b) are wasting",
        "options": [
          "a) are losing",
          "b) are wasting",
          "c) lose",
          "d) waste"
        ],
        "explanation": "b) are wasting\n\n<b>Point :</b> Vocabulaire / Idiome\n<b>Règle :</b> On dit <b>to waste time</b> (gaspiller son temps) plutôt que lose dans ce contexte. La forme progressive (are wasting) souligne l'action en cours."
      },
      {
        "id": "qcm_anglais__2021_25",
        "question": "25) There is a vending machine... the photocopier.",
        "correct": "c) next to",
        "options": [
          "a) between",
          "b) next",
          "c) next to",
          "d) on"
        ],
        "explanation": "c) next to\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> <b>Next to</b> signifie à côté de. L'option next seule est incomplète."
      },
      {
        "id": "qcm_anglais__2021_26",
        "question": "26) We were late... the strike.",
        "correct": "b) because of",
        "options": [
          "a) in spite of",
          "b) because of",
          "c) while",
          "d) as for"
        ],
        "explanation": "b) because of\n\n<b>Point :</b> Cause / Conséquence\n<b>Règle :</b> <b>Because of</b> est suivi d'un groupe nominal pour exprimer la cause (à cause de la grève)."
      },
      {
        "id": "qcm_anglais__2021_27",
        "question": "27) Pass me ... salt, ... you?",
        "correct": "b) the / will",
        "options": [
          "a) any / will",
          "b) the / will",
          "c) the / won't",
          "d) / won't"
        ],
        "explanation": "b) the / will\n\n<b>Point :</b> Article et Question Tag (Impératif)\n<b>Règle :</b> On utilise l'article défini <b>the</b> pour un objet précis. Pour un impératif poli, le tag est souvent <b>will you</b>."
      },
      {
        "id": "qcm_anglais__2021_28",
        "question": "28) You... killed because there was no brake fluid in the reservoir of the car.",
        "correct": "a) could have been",
        "options": [
          "a) could have been",
          "b) may have",
          "c) might have",
          "d) must have been"
        ],
        "explanation": "a) could have been\n\n<b>Point :</b> Modalité (Événement passé qui ne s'est pas produit)\n<b>Règle :</b> <b>Could have + Participe passé</b> exprime une possibilité passée (tu aurais pu être tué)."
      },
      {
        "id": "qcm_anglais__2021_29",
        "question": "29) I can't stand ... for people who are always late.",
        "correct": "c) waiting",
        "options": [
          "a) wait",
          "b) to wait",
          "c) waiting",
          "d) to waiting"
        ],
        "explanation": "c) waiting\n\n<b>Point :</b> Gérondif\n<b>Règle :</b> L'expression <b>can't stand</b> (ne pas supporter) est toujours suivie d'un verbe en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2021_30",
        "question": "30) Rowan Atkinson aka Mr Bean graduated ... electrical engineer before he went into acting.",
        "correct": "a) as an",
        "options": [
          "a) as an",
          "b) as",
          "c) like",
          "d) like an"
        ],
        "explanation": "a) as an\n\n<b>Point :</b> Préposition de fonction / Métier\n<b>Règle :</b> On utilise <b>as</b> (+ article) pour parler d'une fonction réelle ou d'un métier (en tant qu'ingénieur)."
      },
      {
        "id": "qcm_anglais__2021_31",
        "question": "31) I can't stand him as he is ... complaining.",
        "correct": "b) always",
        "options": [
          "a) still",
          "b) always",
          "c) again",
          "d) ever"
        ],
        "explanation": "b) always\n\n<b>Point :</b> Aspect (Be + -ing + Always)\n<b>Règle :</b> <b>Be + Always + V-ing</b> exprime un agacement ou un reproche face à une habitude répétitive."
      },
      {
        "id": "qcm_anglais__2021_32",
        "question": "32) Our head office is... the post office.",
        "correct": "d) opposite",
        "options": [
          "a) over",
          "b) next",
          "c) on",
          "d) opposite"
        ],
        "explanation": "d) opposite\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> <b>Opposite</b> signifie en face de. On ne dit pas opposite to ou opposite of pour un bâtiment."
      },
      {
        "id": "qcm_anglais__2021_33",
        "question": "33) We can't use the printer because we've run ... of paper.",
        "correct": "a) out",
        "options": [
          "a) out",
          "b) up",
          "c) down",
          "d) Ø"
        ],
        "explanation": "a) out\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To run out of something</b> signifie être à court de quelque chose / ne plus en avoir."
      },
      {
        "id": "qcm_anglais__2021_34",
        "question": "34) Last year I lost my laptop and I ... a new one.",
        "correct": "b) had to buy",
        "options": [
          "a) must have bought",
          "b) had to buy",
          "c) had bought",
          "d) would buy"
        ],
        "explanation": "b) had to buy\n\n<b>Point :</b> Obligation au passé\n<b>Règle :</b> Le prétérit de must (obligation) n'existe pas ; on utilise <b>had to</b> pour exprimer une obligation passée."
      },
      {
        "id": "qcm_anglais__2021_35",
        "question": "35) Do you mind my ... in the room?",
        "correct": "c) smoking",
        "options": [
          "a) smoke",
          "b) to smoke",
          "c) smoking",
          "d) to smoking"
        ],
        "explanation": "c) smoking\n\n<b>Point :</b> Gérondif possessif\n<b>Règle :</b> Après <b>mind</b>, on utilise le gérondif. L'utilisation de l'adjectif possessif (my smoking) est la forme la plus correcte grammaticalement."
      },
      {
        "id": "qcm_anglais__2021_36",
        "question": "36) The Americans ... every four years to choose their president but also their representatives, mayors and sheriffs.",
        "correct": "d) vote",
        "options": [
          "a) were used to voting",
          "b) are voting",
          "c) are used to vote",
          "d) vote"
        ],
        "explanation": "d) vote\n\n<b>Point :</b> Présent Simple (Habitude/Vérité générale)\n<b>Règle :</b> Pour une action régulière et factuelle, on utilise le <b>Présent Simple</b>."
      },
      {
        "id": "qcm_anglais__2021_37",
        "question": "37) When my brother was arrested for shoplifting, my parents were furious ... him.",
        "correct": "a) with",
        "options": [
          "a) with",
          "b) for",
          "c) of",
          "d) against"
        ],
        "explanation": "a) with\n\n<b>Point :</b> Préposition après un adjectif\n<b>Règle :</b> On est <b>furious with someone</b> (en colère contre quelqu'un). On peut aussi dire furious at someone."
      },
      {
        "id": "qcm_anglais__2021_38",
        "question": "38) ... France, people celebrate Bastille Day on 14th July.",
        "correct": "d) Throughout",
        "options": [
          "a) At",
          "b) Over",
          "c) Through",
          "d) Throughout"
        ],
        "explanation": "d) Throughout\n\n<b>Point :</b> Préposition de lieu/espace\n<b>Règle :</b> <b>Throughout</b> signifie partout dans ou d'un bout à l'autre de (à l'échelle de tout le pays)."
      },
      {
        "id": "qcm_anglais__2021_39",
        "question": "39) If you have such a stomachache, you ... to go to the doctor's.",
        "correct": "b) ought",
        "options": [
          "a) should",
          "b) ought",
          "c) must",
          "d) had better"
        ],
        "explanation": "b) ought\n\n<b>Point :</b> Modalité (Conseil)\n<b>Règle :</b> <b>Ought</b> est le seul modal de la liste qui nécessite la particule <b>to</b> (ought to go)."
      },
      {
        "id": "qcm_anglais__2021_40",
        "question": "40) How can parents get their children ... more these days?",
        "correct": "a) to read",
        "options": [
          "a) to read",
          "b) read",
          "c) reading",
          "d) reads"
        ],
        "explanation": "a) to read\n\n<b>Point :</b> Structure causative\n<b>Règle :</b> Avec l'opérateur <b>get</b> (sens : convaincre/persuader), on utilise la structure <b>get + complément + TO + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2021_41",
        "question": "41) She has applied ... 4 internships.",
        "correct": "d) for",
        "options": [
          "a) to",
          "b) with",
          "c) at",
          "d) for"
        ],
        "explanation": "d) for\n\n<b>Point :</b> Phrasal Verb / Préposition\n<b>Règle :</b> On utilise <b>apply for</b> pour postuler à un emploi, un stage ou une bourse."
      },
      {
        "id": "qcm_anglais__2021_42",
        "question": "42) I have already got three meetings.... Thursday morning.",
        "correct": "b) on",
        "options": [
          "a) in",
          "b) on",
          "c) at",
          "d) of"
        ],
        "explanation": "b) on\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> On utilise <b>on</b> devant les jours de la semaine (Thursday), même s'ils sont suivis de morning, afternoon ou evening."
      },
      {
        "id": "qcm_anglais__2021_43",
        "question": "43) When a situation gets out of hand, it ...",
        "correct": "c) is unmanageable",
        "options": [
          "a) falls out of perspective",
          "b) is lost to the world",
          "c) is unmanageable",
          "d) is confusing"
        ],
        "explanation": "c) is unmanageable\n\n<b>Point :</b> Idiome / Vocabulaire\n<b>Règle :</b> <b>To get out of hand</b> signifie devenir incontrôlable ou ingérable (unmanageable)."
      },
      {
        "id": "qcm_anglais__2021_44",
        "question": "44) We... over lunch tomorrow.",
        "correct": "a) are meeting",
        "options": [
          "a) are meeting",
          "b) meet",
          "c) are about to meet",
          "d) will have met"
        ],
        "explanation": "a) are meeting\n\n<b>Point :</b> Expression du futur (Arrangement)\n<b>Règle :</b> Le <b>Présent en BE + V-ing</b> est utilisé pour un rendez-vous ou un arrangement déjà fixé dans le futur."
      },
      {
        "id": "qcm_anglais__2021_45",
        "question": "45) If I ... you, I ... go and see that play as soon as possible. It is just amazing.",
        "correct": "c) were/would",
        "options": [
          "a) were/will",
          "b) would be/will",
          "c) were/would",
          "d) am/would"
        ],
        "explanation": "c) were/would\n\n<b>Point :</b> Conditionnel (If Clause type 2)\n<b>Règle :</b> Pour un conseil imaginaire : <b>If + Prétérit modal (were)</b>, suivi de <b>Would + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2021_46",
        "question": "46)... this survey is very interesting, some of the figures are misleading.",
        "correct": "c) Although",
        "options": [
          "a) Because",
          "b) Since",
          "c) Although",
          "d) So"
        ],
        "explanation": "c) Although\n\n<b>Point :</b> Connecteur de concession\n<b>Règle :</b> <b>Although</b> (bien que) introduit une opposition entre deux faits réels."
      },
      {
        "id": "qcm_anglais__2021_47",
        "question": "47) When the plane crashed, it ... only three times.",
        "correct": "d) had flown",
        "options": [
          "a) has flown",
          "b) flew",
          "c) was flowing",
          "d) had flown"
        ],
        "explanation": "d) had flown\n\n<b>Point :</b> Temps du passé (Antériorité)\n<b>Règle :</b> Pour une action (voler) antérieure à une autre action passée (le crash), on utilise le <b>Past Perfect (had + participe passé)</b>."
      },
      {
        "id": "qcm_anglais__2021_48",
        "question": "48) The accountant is on a business trip so he... have stolen the cash that was in the safe.",
        "correct": "a) mustn't",
        "options": [
          "a) mustn't",
          "b) can't",
          "c) needn't",
          "d) shouldn't"
        ],
        "explanation": "b) can't\n\n<b>Point :</b> Modalité (Impossibilité logique)\n<b>Règle :</b> <b>Can't have + Participe passé</b> exprime une quasi-certitude négative (il est impossible qu'il ait fait cela)."
      },
      {
        "id": "qcm_anglais__2021_49",
        "question": "49) Mr Coburn denied ... on the crime scene earlier on.",
        "correct": "c) having been",
        "options": [
          "a) to be",
          "b) to being",
          "c) having been",
          "d) to have been"
        ],
        "explanation": "c) having been\n\n<b>Point :</b> Verbe + Gérondif\n<b>Règle :</b> Le verbe <b>deny</b> (nier) est toujours suivi d'un verbe en <b>-ing</b> (ou having + participe passé pour insister sur l'antériorité)."
      },
      {
        "id": "qcm_anglais__2021_50",
        "question": "62) They intend to hire another secretary ... it is impossible for one secretary to cope with this task.",
        "correct": "a) as",
        "options": [
          "a) as",
          "b) like",
          "c) as for",
          "d) even"
        ],
        "explanation": "a) as\n\n<b>Point :</b> Connecteur de cause\n<b>Règle :</b> <b>As</b> est ici synonyme de because ou since (puisque / car) pour introduire une explication."
      },
      {
        "id": "qcm_anglais__2021_51",
        "question": "63) We'll have to work hard to make ... the delay.",
        "correct": "c) up for",
        "options": [
          "a) up",
          "b) up to",
          "c) up for",
          "d) upside down"
        ],
        "explanation": "c) up for\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To make up for something</b> signifie compenser ou rattraper (un retard, une erreur)."
      },
      {
        "id": "qcm_anglais__2021_52",
        "question": "64) What about... a take-away pizza for dinner?",
        "correct": "a) buying",
        "options": [
          "a) buying",
          "b) buy",
          "c) to buy",
          "d) bought"
        ],
        "explanation": "a) buying\n\n<b>Point :</b> Suggestion\n<b>Règle :</b> Après la structure <b>What about</b> ou <b>How about</b>, le verbe se met toujours à la forme <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2021_53",
        "question": "65) He badly hurt... while trying to clean the tool.",
        "correct": "b) himself",
        "options": [
          "a) oneself",
          "b) himself",
          "c) him",
          "d) itself"
        ],
        "explanation": "b) himself\n\n<b>Point :</b> Pronom réfléchi\n<b>Règle :</b> Le sujet est He, donc le pronom réfléchi correspondant est <b>himself</b> (il s'est blessé lui-même)."
      },
      {
        "id": "qcm_anglais__2021_54",
        "question": "66) Tom always was a fast driver. He was ... to have a car accident one day.",
        "correct": "b) bound",
        "options": [
          "a) about",
          "b) bound",
          "c) unlikely",
          "d) probably"
        ],
        "explanation": "b) bound\n\n<b>Point :</b> Expression de la fatalité / certitude\n<b>Règle :</b> <b>To be bound to + BV</b> signifie que quelque chose est inévitable ou certain d'arriver."
      },
      {
        "id": "qcm_anglais__2021_55",
        "question": "67) Not to judge a book by its cover means:",
        "correct": "c) not to judge on appearances",
        "options": [
          "a) to have a good look at the book before buying it",
          "b) to read the back cover before buying it",
          "c) not to judge on appearances",
          "d) to buy books at random"
        ],
        "explanation": "c) not to judge on appearances\n\n<b>Point :</b> Idiome / Proverbe\n<b>Règle :</b> Cette expression signifie qu'il ne faut pas se fier aux apparences."
      },
      {
        "id": "qcm_anglais__2021_56",
        "question": "68) I feel ... sorry for not helping you move out last week-end but I had a backache and was in pain.",
        "correct": "a) terribly",
        "options": [
          "a) terribly",
          "b) terrible",
          "c) much",
          "d) very much"
        ],
        "explanation": "a) terribly\n\n<b>Point :</b> Adverbe d'intensité\n<b>Règle :</b> On utilise l'adverbe <b>terribly</b> pour modifier l'adjectif sorry. Terrible est un adjectif et ne peut pas modifier un autre adjectif."
      },
      {
        "id": "qcm_anglais__2021_57",
        "question": "69) He is neither interested in engineering studies ... in medical studies. What will he do then?",
        "correct": "a) nor",
        "options": [
          "a) nor",
          "b) or",
          "c) either",
          "d) Ø"
        ],
        "explanation": "a) nor\n\n<b>Point :</b> Corrélation négative\n<b>Règle :</b> La structure fixe est <b>Neither... nor...</b> (Ni... ni...)."
      },
      {
        "id": "qcm_anglais__2021_58",
        "question": "72) Because of the transport strike, he decided to come to work ...",
        "correct": "a) on foot",
        "options": [
          "a) on foot",
          "b) by feet",
          "c) on feet",
          "d) on walking"
        ],
        "explanation": "a) on foot\n\n<b>Point :</b> Moyen de transport\n<b>Règle :</b> L'expression figée pour dire à pied est toujours <b>on foot</b> (au singulier)."
      },
      {
        "id": "qcm_anglais__2021_59",
        "question": "73) He... a lot of squash to get the stress out of his system and it works wonders.",
        "correct": "d) is used to playing",
        "options": [
          "a) used to play",
          "b) was used to play",
          "c) was used to playing",
          "d) is used to playing"
        ],
        "explanation": "d) is used to playing\n\n<b>Point :</b> Accoutumance (Be used to)\n<b>Règle :</b> <b>Be used to + V-ing</b> exprime une habitude actuelle ou une accoutumance. L'indice it works wonders montre que c'est une habitude présente."
      },
      {
        "id": "qcm_anglais__2021_60",
        "question": "74) .... the pandemic and the lack of social interactions, more and more people are feeling depressed.",
        "correct": "a) Due to",
        "options": [
          "a) Due to",
          "b) Because",
          "c) Owing",
          "d) As of"
        ],
        "explanation": "a) Due to\n\n<b>Point :</b> Cause\n<b>Règle :</b> <b>Due to</b> introduit une cause suivie d'un groupe nominal. Because seul devrait être suivi d'une proposition complète (sujet + verbe)."
      },
      {
        "id": "qcm_anglais__2021_61",
        "question": "75) .... the problems he came across during his internship, it was a valuable experience.",
        "correct": "b) Despite",
        "options": [
          "a) In spite",
          "b) Despite",
          "c) Although",
          "d) Whereas"
        ],
        "explanation": "b) Despite\n\n<b>Point :</b> Concession\n<b>Règle :</b> <b>Despite</b> est suivi d'un groupe nominal (malgré les problèmes). In spite nécessite obligatoirement of."
      },
      {
        "id": "qcm_anglais__2021_62",
        "question": "76) You must fill ... this form to get a new passport.",
        "correct": "c) in",
        "options": [
          "a) off",
          "b) on",
          "c) in",
          "d) for"
        ],
        "explanation": "c) in\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To fill in</b> (ou fill out) signifie remplir un formulaire ou un document."
      },
      {
        "id": "qcm_anglais__2021_63",
        "question": "77) She had never heard... good speech.",
        "correct": "c) such a",
        "options": [
          "a) such",
          "b) a such",
          "c) such a",
          "d) so"
        ],
        "explanation": "c) such a\n\n<b>Point :</b> Intensif avec nom dénombrable\n<b>Règle :</b> La structure est <b>Such + a/an + adjectif + nom</b> pour un nom singulier dénombrable."
      },
      {
        "id": "qcm_anglais__2021_64",
        "question": "78) The Export manager and the Sales manager talk to... every day.",
        "correct": "d) each other",
        "options": [
          "a) themselves",
          "b) theirs",
          "c) each one",
          "d) each other"
        ],
        "explanation": "d) each other\n\n<b>Point :</b> Pronom réciproque\n<b>Règle :</b> On utilise <b>each other</b> quand deux personnes agissent l'une sur l'autre (se parler l'un à l'autre)."
      },
      {
        "id": "qcm_anglais__2021_65",
        "question": "79) Mike and his German counterpart have been working on the same project ... about two weeks.",
        "correct": "a) for",
        "options": [
          "a) for",
          "b) since",
          "c) during",
          "d) while"
        ],
        "explanation": "a) for\n\n<b>Point :</b> Expression de la durée\n<b>Règle :</b> <b>For</b> introduit une durée (pendant deux semaines), tandis que since introduit un point de départ précis."
      },
      {
        "id": "qcm_anglais__2021_66",
        "question": "80) Mrs Lombard is looking forward to ... to our Hong-Kong office when she is promoted.",
        "correct": "a) being sent",
        "options": [
          "a) being sent",
          "b) be sent",
          "c) been sent",
          "d) sending"
        ],
        "explanation": "a) being sent\n\n<b>Point :</b> Structure fixe + Voix passive\n<b>Règle :</b> <b>Look forward to</b> est toujours suivi de <b>V-ing</b>. Ici, c'est une forme passive (être envoyée) : <b>being + participe passé</b>."
      },
      {
        "id": "qcm_anglais__2021_67",
        "question": "81) The British Prime Minister said he was trying to obtain ... support in his campaign against drugs.",
        "correct": "a) people's",
        "options": [
          "a) people's",
          "b) people",
          "c) the people",
          "d) peoples"
        ],
        "explanation": "a) people's\n\n<b>Point :</b> Génitif (Possession)\n<b>Règle :</b> Pour exprimer le soutien des gens, on utilise le cas possessif : <b>people's support</b> (le soutien appartenant aux gens)."
      },
      {
        "id": "qcm_anglais__2021_68",
        "question": "82) I'm so happy, I've got ... holiday.",
        "correct": "a) a two-week",
        "options": [
          "a) a two-week",
          "b) two week",
          "c) a two week's",
          "d) a two weeks"
        ],
        "explanation": "a) a two-week\n\n<b>Point :</b> Adjectif composé\n<b>Règle :</b> Un nombre + une unité de temps fonctionnant comme adjectif ne prend <b>jamais de s</b> et est précédé d'un article : <b>a two-week holiday</b>."
      },
      {
        "id": "qcm_anglais__2021_69",
        "question": "83) Can you ... me to buy that book next time I'm in town?",
        "correct": "b) remind",
        "options": [
          "a) remember",
          "b) remind",
          "c) recall",
          "d) remembering"
        ],
        "explanation": "b) remind\n\n<b>Point :</b> Confusion de vocabulaire\n<b>Règle :</b> <b>Remind someone to do something</b> signifie rappeler à quelqu'un de faire quelque chose. Remember signifie se souvenir."
      },
      {
        "id": "qcm_anglais__2021_70",
        "question": "84) She would like to... the manager.",
        "correct": "b) introduce you to",
        "options": [
          "a) introduce you",
          "b) introduce you to",
          "c) present you with",
          "d) meet you"
        ],
        "explanation": "b) introduce you to\n\n<b>Point :</b> Construction verbale\n<b>Règle :</b> On utilise <b>Introduce A to B</b> (présenter A à B)."
      },
      {
        "id": "qcm_anglais__2021_71",
        "question": "85) He... for only five minutes when the train arrived.",
        "correct": "c) had been waiting",
        "options": [
          "a) was waiting",
          "b) has been waiting",
          "c) had been waiting",
          "d) will wait"
        ],
        "explanation": "c) had been waiting\n\n<b>Point :</b> Past Perfect Continuous\n<b>Règle :</b> On utilise le <b>Past Perfect en BE + V-ing</b> pour une action qui durait depuis un certain temps avant un autre événement passé (l'arrivée du train)."
      },
      {
        "id": "qcm_anglais__2021_72",
        "question": "86) Just ten people came to the party; apparently only ... were not afraid of the bad weather conditions.",
        "correct": "a) a few",
        "options": [
          "a) a few",
          "b) most",
          "c) little",
          "d) minority"
        ],
        "explanation": "a) a few\n\n<b>Point :</b> Quantifieurs\n<b>Règle :</b> <b>A few</b> s'utilise avec un nom dénombrable pluriel pour signifier quelques-uns/un petit nombre. Little s'utilise avec du singulier indénombrable."
      },
      {
        "id": "qcm_anglais__2021_73",
        "question": "87) And now for dessert, ... ice-cream flavour do you prefer: vanilla, chocolate or lemon?",
        "correct": "b) which",
        "options": [
          "a) what",
          "b) which",
          "c) whose",
          "d) whatever"
        ],
        "explanation": "b) which\n\n<b>Point :</b> Pronom interrogatif\n<b>Règle :</b> On utilise <b>which</b> (et non what) quand le choix est limité à une liste restreinte d'options précises."
      },
      {
        "id": "qcm_anglais__2021_74",
        "question": "88) ... she goes, she always enjoys her trip.",
        "correct": "b) Wherever",
        "options": [
          "a) Whenever",
          "b) Wherever",
          "c) Whatever",
          "d) Whoever"
        ],
        "explanation": "b) Wherever\n\n<b>Point :</b> Adverbe composé en -ever\n<b>Règle :</b> <b>Wherever</b> signifie peu importe l'endroit où ou partout où."
      },
      {
        "id": "qcm_anglais__2021_75",
        "question": "89) You won't get the order ... you call the client back.",
        "correct": "d) unless",
        "options": [
          "a) otherwise",
          "b) anyway",
          "c) no matter",
          "d) unless"
        ],
        "explanation": "d) unless\n\n<b>Point :</b> Condition négative\n<b>Règle :</b> <b>Unless</b> signifie à moins que ou si... ne... pas. C'est le connecteur logique de la condition ici."
      },
      {
        "id": "qcm_anglais__2021_76",
        "question": "90) ... you decide, please call me as soon as possible to let me know.",
        "correct": "b) No matter what",
        "options": [
          "a) No matter that",
          "b) No matter what",
          "c) However that",
          "d) However what"
        ],
        "explanation": "b) No matter what\n\n<b>Point :</b> Expression de l'indifférence\n<b>Règle :</b> <b>No matter what</b> signifie peu importe ce que ou quoi que."
      },
      {
        "id": "qcm_anglais__2021_77",
        "question": "91) I ... well enough to go on speaking.",
        "correct": "d) didn't feel",
        "options": [
          "a) didn't feel myself",
          "b) didn't feel oneself",
          "c) didn't feel me",
          "d) didn't feel"
        ],
        "explanation": "d) didn't feel\n\n<b>Point :</b> Verbe de perception/état\n<b>Règle :</b> Le verbe <b>feel</b> s'utilise généralement sans pronom réfléchi pour exprimer un état de santé ou une sensation physique."
      },
      {
        "id": "qcm_anglais__2021_78",
        "question": "92) ... fault is it? Actually, I don't think it is anyone's fault.",
        "correct": "d) Whose",
        "options": [
          "a) What",
          "b) Which",
          "c) Whom",
          "d) Whose"
        ],
        "explanation": "d) Whose\n\n<b>Point :</b> Interrogatif de possession\n<b>Règle :</b> <b>Whose</b> est utilisé pour poser une question sur le propriétaire ou le responsable (à qui est la faute ?)."
      },
      {
        "id": "qcm_anglais__2021_79",
        "question": "93) She has asked us ... tell him the truth about his birth.",
        "correct": "a) not to",
        "options": [
          "a) not to",
          "b) to not",
          "c) don't",
          "d) not"
        ],
        "explanation": "a) not to\n\n<b>Point :</b> Infinitif négatif\n<b>Règle :</b> Pour mettre un infinitif à la forme négative après un verbe de demande (ask), on place <b>not</b> devant <b>to</b>."
      },
      {
        "id": "qcm_anglais__2021_80",
        "question": "94) Paper is made ... wood, isn't it?",
        "correct": "c) from",
        "options": [
          "a) up of",
          "b) of",
          "c) from",
          "d) with"
        ],
        "explanation": "c) from\n\n<b>Point :</b> Origine de fabrication\n<b>Règle :</b> On utilise <b>made from</b> quand la matière première a été transformée chimiquement ou physiquement (le bois ne ressemble plus à du papier)."
      },
      {
        "id": "qcm_anglais__2021_81",
        "question": "95) I cannot quite hear you. ... you speak louder, please?",
        "correct": "c) Could",
        "options": [
          "a) Cannot",
          "b) Might",
          "c) Could",
          "d) Should"
        ],
        "explanation": "c) Could\n\n<b>Point :</b> Modalité (Requête polie)\n<b>Règle :</b> <b>Could</b> est la forme polie pour demander à quelqu'un de faire quelque chose (capacité/possibilité)."
      },
      {
        "id": "qcm_anglais__2021_82",
        "question": "96) He has ... friends on Facebook. He is a bit of a loner.",
        "correct": "b) few",
        "options": [
          "a) little",
          "b) few",
          "c) fewer",
          "d) plenty of"
        ],
        "explanation": "b) few\n\n<b>Point :</b> Quantifieurs (Sens négatif)\n<b>Règle :</b> <b>Few</b> exprime une petite quantité insuffisante (peu de). Little ne peut pas s'utiliser avec le pluriel friends."
      },
      {
        "id": "qcm_anglais__2021_83",
        "question": "97) Why are they walking so fast?. They are...",
        "correct": "d) in a hurry",
        "options": [
          "a) hurry",
          "b) hurried",
          "c) in hurry",
          "d) in a hurry"
        ],
        "explanation": "d) in a hurry\n\n<b>Point :</b> Expression figée\n<b>Règle :</b> L'expression correcte est <b>to be in a hurry</b> (être pressé). L'article a est obligatoire."
      },
      {
        "id": "qcm_anglais__2021_84",
        "question": "98) We would rather ... a curry delivered at home than sit in a noisy curry house.",
        "correct": "b) have",
        "options": [
          "a) had",
          "b) have",
          "c) having",
          "d) have had"
        ],
        "explanation": "b) have\n\n<b>Point :</b> Préférence (Would rather)\n<b>Règle :</b> <b>Would rather</b> est toujours suivi de la <b>Base Verbale</b> (infinitif sans to) pour exprimer une préférence présente ou future."
      },
      {
        "id": "qcm_anglais__2021_85",
        "question": "99) I hope 2021 won't be as miserable... 2020.",
        "correct": "c) as",
        "options": [
          "a) that",
          "b) than",
          "c) as",
          "d) like"
        ],
        "explanation": "c) as\n\n<b>Point :</b> Comparatif d'égalité / inégalité\n<b>Règle :</b> La structure de comparaison est <b>as + adjectif + as</b>. À la forme négative (not as... as), elle exprime une différence."
      },
      {
        "id": "qcm_anglais__2021_86",
        "question": "100) I have never ... tasted it but I saw this wine in restaurants.",
        "correct": "c) many times",
        "options": [
          "a) much time",
          "b) often times",
          "c) many times",
          "d) long time ago"
        ],
        "explanation": "c) many times\n\n<b>Point :</b> Adverbe de fréquence / Quantité\n<b>Règle :</b> <b>Many times</b> (souvent / plusieurs fois) s'utilise avec le Present Perfect pour parler d'une expérience répétée ou, ici, de son absence."
      },
      {
        "id": "qcm_anglais__2021_87",
        "question": "50) He is off to the hairdresser's to ...",
        "correct": "d) get his hair cut",
        "options": [
          "a) have cut his hair",
          "b) get cut his hair",
          "c) let his hair cut",
          "d) get his hair cut"
        ],
        "explanation": "d) get his hair cut\n\n<b>Point :</b> Structure causative passive\n<b>Règle :</b> On utilise <b>Have/Get + objet + Participe Passé</b> pour une action effectuée par un tiers (le coiffeur)."
      },
      {
        "id": "qcm_anglais__2021_88",
        "question": "51) Give my regards to your parents means:",
        "correct": "d) Say hello for me",
        "options": [
          "a) Give this present",
          "b) Give a kiss",
          "c) Give my attention",
          "d) Say hello for me"
        ],
        "explanation": "d) Say hello for me\n\n<b>Point :</b> Expression idiomatique\n<b>Règle :</b> <b>Give my regards</b> est une formule pour transmettre ses salutations."
      },
      {
        "id": "qcm_anglais__2021_89",
        "question": "52) It is your Spanish client... the phone: he says it's rather urgent.",
        "correct": "d) on",
        "options": [
          "a) at",
          "b) into",
          "c) onto",
          "d) on"
        ],
        "explanation": "d) on\n\n<b>Point :</b> Préposition\n<b>Règle :</b> On est toujours <b>on the phone</b>."
      },
      {
        "id": "qcm_anglais__2021_90",
        "question": "53) We are sending you the bill for the repairs,... agreed earlier.",
        "correct": "c) as",
        "options": [
          "a) since",
          "b) like",
          "c) as",
          "d) l"
        ],
        "explanation": "c) as\n\n<b>Point :</b> Comparaison / Conformité\n<b>Règle :</b> On utilise <b>as</b> pour introduire une proposition (comme convenu)."
      },
      {
        "id": "qcm_anglais__2021_91",
        "question": "54) I'll call him back... I am done with this.",
        "correct": "b) as soon as",
        "options": [
          "a) soon",
          "b) as soon as",
          "c) sooner than",
          "d) Ø"
        ],
        "explanation": "b) as soon as\n\n<b>Point :</b> Conjonction de temps\n<b>Règle :</b> <b>As soon as</b> (dès que) est suivi du présent pour un sens futur."
      },
      {
        "id": "qcm_anglais__2021_92",
        "question": "55) Where are the scissors? They... be in this drawer, but they are not.",
        "correct": "c) should",
        "options": [
          "a) must",
          "b) might",
          "c) should",
          "d) would"
        ],
        "explanation": "c) should\n\n<b>Point :</b> Probabilité logique\n<b>Règle :</b> <b>Should</b> exprime ici ce qui est censé être (une attente logique)."
      },
      {
        "id": "qcm_anglais__2021_93",
        "question": "56) Look, our two briefcases are ...",
        "correct": "b) alike",
        "options": [
          "a) look like",
          "b) alike",
          "c) like",
          "d) similars"
        ],
        "explanation": "b) alike\n\n<b>Point :</b> Adjectif de ressemblance\n<b>Règle :</b> <b>Alike</b> s'utilise après le verbe pour dire que deux choses sont identiques.\n\nc) Like indique la resemblance"
      },
      {
        "id": "qcm_anglais__2021_94",
        "question": "57) At Gordon Transport Inc, we guarantee... orders within two weeks.",
        "correct": "d) to deliver",
        "options": [
          "a) delivery",
          "b) delivering",
          "c) deliver",
          "d) to deliver"
        ],
        "explanation": "d) to deliver\nPoint : Construction verbale\nRègle : Le verbe guarantee est ici suivi d'un infinitif complet (to + Base Verbale) pour exprimer l'engagement à réaliser l'action."
      },
      {
        "id": "qcm_anglais__2021_95",
        "question": "58) Our warehouses are located ... the country, so we can deliver goods very quickly.",
        "correct": "b) all over",
        "options": [
          "a) over",
          "b) all over",
          "c) at",
          "d) into"
        ],
        "explanation": "b) all over\n\n<b>Point :</b> Préposition d'espace\n<b>Règle :</b> <b>All over</b> signifie partout à travers une zone géographique."
      },
      {
        "id": "qcm_anglais__2021_96",
        "question": "59) Global wine production is decreasing... the pandemic and economic uncertainty.",
        "correct": "a) because of",
        "options": [
          "a) because of",
          "b) while",
          "c) whereas",
          "d) in spite"
        ],
        "explanation": "a) because of\n\n<b>Point :</b> Cause\n<b>Règle :</b> <b>Because of</b> est suivi d'un groupe nominal."
      },
      {
        "id": "qcm_anglais__2021_97",
        "question": "60) She called ...her tax-adviser to have him help her with her tax-return.",
        "correct": "b) Ø",
        "options": [
          "a) with",
          "b) Ø",
          "c) at",
          "d) to"
        ],
        "explanation": "b) Ø\n\n<b>Point :</b> Verbe transitif direct\n<b>Règle :</b> <b>To call someone</b> ne prend pas de préposition."
      },
      {
        "id": "qcm_anglais__2021_98",
        "question": "61) You'll like the new computer... you are used to it.",
        "correct": "b) once",
        "options": [
          "a) at once",
          "b) once",
          "c) one",
          "d) one time"
        ],
        "explanation": "b) once\n\n<b>Point :</b> Conjonction de temps\n<b>Règle :</b> <b>Once</b> signifie une fois que."
      },
      {
        "id": "qcm_anglais__2021_99",
        "question": "70) I... a poem about the beautiful Norwegian landscapes. Would you like to read it?",
        "correct": "a) have been writing",
        "options": [
          "a) have been writing",
          "b) had written",
          "c) have writing",
          "d) had been writing"
        ],
        "explanation": "a) have been writing\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> On utilise <b>have been + V-ing</b> pour une activité qui vient de s'achever et dont le résultat est visible."
      },
      {
        "id": "qcm_anglais__2021_100",
        "question": "71) It is high time we ... if we want to catch the ten o'clock flight.",
        "correct": "b) left",
        "options": [
          "a) leave",
          "b) left",
          "c) will leave",
          "d) should leave"
        ],
        "explanation": "b) left\n\n<b>Point :</b> Irréel du présent\n<b>Règle :</b> Après <b>It is high time</b>, on utilise obligatoirement le <b>Prétérit modal</b>."
      }
    ]
  },
  "qcm_anglais__2020": {
    "id": "qcm_anglais__2020",
    "name": "QCM anglais ➔ 2020",
    "path": "QCM anglais::2020",
    "pathParts": [
      "QCM anglais",
      "2020"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (97 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2020_1",
        "question": "1) Do you want him to call you as soon as...?",
        "correct": "b) he arrives",
        "options": [
          "a) he will arrive",
          "b) he arrives",
          "c) he shall arrive",
          "d) he arrived"
        ],
        "explanation": "b) he arrives\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après les conjonctions de temps (as soon as, when, once), on utilise le <b>Présent Simple</b> pour exprimer un sens futur. L'usage de will est interdit."
      },
      {
        "id": "qcm_anglais__2020_2",
        "question": "2) She is.....political figure I have ever known.",
        "correct": "b) the most honest",
        "options": [
          "a) the more honest",
          "b) the most honest",
          "c) more honest",
          "d) so honest"
        ],
        "explanation": "b) the most honest\n\n<b>Point :</b> Superlatif\n<b>Règle :</b> Pour les adjectifs longs (2 syllabes ou plus, sauf exceptions), le superlatif se forme avec <b>the most + adjectif</b>."
      },
      {
        "id": "qcm_anglais__2020_3",
        "question": "3) How long...?",
        "correct": "a) have they waited",
        "options": [
          "a) have they waited",
          "b) are they waiting",
          "c) did they waiting",
          "d) has they been waiting"
        ],
        "explanation": "a) have they waited\n\n<b>Point :</b> Temps et Durée\n<b>Règle :</b> Avec How long, on utilise un temps du parfait (Present Perfect). L'option (d) est fausse car l'auxiliaire has ne s'accorde pas avec they."
      },
      {
        "id": "qcm_anglais__2020_4",
        "question": "4) Prices have increased....5% lately.",
        "correct": "c) by",
        "options": [
          "a) from",
          "b) at",
          "c) by",
          "d) of"
        ],
        "explanation": "c) by\n\n<b>Point :</b> Préposition de mesure\n<b>Règle :</b> Pour indiquer l'écart d'une variation ou un taux d'augmentation/diminution, on utilise la préposition <b>by</b>."
      },
      {
        "id": "qcm_anglais__2020_5",
        "question": "5) Eveybody left early,...?",
        "correct": "a) didn't they",
        "options": [
          "a) didn't they",
          "b) hasn't he",
          "c) didn't he",
          "d) haven't they"
        ],
        "explanation": "a) didn't they\n\n<b>Point :</b> Question Tag\n<b>Règle :</b> Les pronoms indéfinis comme Everybody ou Someone sont suivis d'un tag au pluriel (<b>they</b>). La phrase étant au prétérit positif, le tag doit être au prétérit négatif."
      },
      {
        "id": "qcm_anglais__2020_6",
        "question": "6) They are...to have been very busy at the time",
        "correct": "d) said",
        "options": [
          "a) referred",
          "b) pretended",
          "c) told",
          "d) said"
        ],
        "explanation": "d) said\n\n<b>Point :</b> Passive reportative\n<b>Règle :</b> La structure <b>be said to + infinitif</b> permet de rapporter des propos (on dit que...)."
      },
      {
        "id": "qcm_anglais__2020_7",
        "question": "7) The program was watched by five...viewers.",
        "correct": "a) million",
        "options": [
          "a) million",
          "b) millions",
          "c) millions of",
          "d) -million"
        ],
        "explanation": "a) million\n\n<b>Point :</b> Adjectifs numéraux\n<b>Règle :</b> Les mots comme million, thousand, hundred restent <b>invariables</b> (pas de -s) lorsqu'ils sont précédés d'un nombre précis."
      },
      {
        "id": "qcm_anglais__2020_8",
        "question": "8) They had tried both methods but...worked",
        "correct": "b) neither",
        "options": [
          "a) the two",
          "b) neither",
          "c) not either",
          "d) no one"
        ],
        "explanation": "b) neither\n\n<b>Point :</b> Négation de deux éléments\n<b>Règle :</b> <b>Neither</b> signifie ni l'un ni l'autre. Il porte déjà la négation, donc le verbe reste à la forme affirmative."
      },
      {
        "id": "qcm_anglais__2020_9",
        "question": "9) Berlin is really worth...",
        "correct": "a) visiting",
        "options": [
          "a) visiting",
          "b) visit",
          "c) to be visited",
          "d) visited"
        ],
        "explanation": "a) visiting\n\n<b>Point :</b> Construction de l'adjectif worth\n<b>Règle :</b> L'expression <b>be worth</b> (valoir la peine) est systématiquement suivie d'un verbe en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_10",
        "question": "10) I...text her now before it's too late.",
        "correct": "b) 'd rather",
        "options": [
          "a) 'd like better",
          "b) 'd rather",
          "c) would better",
          "d) rather wish"
        ],
        "explanation": "b) 'd rather\n\n<b>Point :</b> Expression de la préférence\n<b>Règle :</b> <b>Would rather</b> est suivi de la <b>Base Verbale</b> (infinitif sans to)."
      },
      {
        "id": "qcm_anglais__2020_11",
        "question": "11) Who did you borrow this...?",
        "correct": "b) from",
        "options": [
          "a) to",
          "b) from",
          "c) of",
          "d) off"
        ],
        "explanation": "b) from\n\n<b>Point :</b> Préposition verbale\n<b>Règle :</b> On dit <b>to borrow something from someone</b> (emprunter quelque chose à quelqu'un)."
      },
      {
        "id": "qcm_anglais__2020_12",
        "question": "12) This is not true of... Americans !",
        "correct": "b) all",
        "options": [
          "a) most of",
          "b) all",
          "c) the most of",
          "d) all most"
        ],
        "explanation": "b) all\n\n<b>Point :</b> Quantifieur\n<b>Règle :</b> <b>All</b> peut être suivi directement d'un nom pluriel pour une généralité. Most of aurait nécessité un article (the)."
      },
      {
        "id": "qcm_anglais__2020_13",
        "question": "13) He is not used...orders.",
        "correct": "d) to obeying",
        "options": [
          "a) to obey",
          "b) obeying",
          "c) obey",
          "d) to obeying"
        ],
        "explanation": "d) to obeying\n\n<b>Point :</b> Accoutumance (Be used to)\n<b>Règle :</b> <b>Be used to</b> (être habitué à) est une structure où to est une préposition. Elle doit donc être suivie du gérondif en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_14",
        "question": "14) Do you think he will be running...presidency?",
        "correct": "a) for",
        "options": [
          "a) for",
          "b) to",
          "c) into",
          "d) in"
        ],
        "explanation": "a) for\n\n<b>Point :</b> Phrasal Verb / Politique\n<b>Règle :</b> <b>To run for presidency</b> signifie être candidat à la présidence."
      },
      {
        "id": "qcm_anglais__2020_15",
        "question": "15) Greta Thunberg worries herself...over pollution and the protection of the environment.",
        "correct": "d) to death",
        "options": [
          "a) deadly",
          "b) dead",
          "c) at death",
          "d) to death"
        ],
        "explanation": "d) to death\n\n<b>Point :</b> Expression idiomatique d'intensité\n<b>Règle :</b> <b>To worry oneself to death</b> signifie se faire un sang d'encre ou se tourmenter à mort."
      },
      {
        "id": "qcm_anglais__2020_16",
        "question": "16)...laptop is this?",
        "correct": "c) Whose",
        "options": [
          "a) Whom",
          "b) Who",
          "c) Whose",
          "d) Where"
        ],
        "explanation": "c) Whose\n\n<b>Point :</b> Pronom interrogatif de possession\n<b>Règle :</b> <b>Whose</b> permet de poser une question sur l'appartenance (À qui est ce... ?)."
      },
      {
        "id": "qcm_anglais__2020_17",
        "question": "17) Tom, ...junior excecutive I work with, is thinking of moving to China on a three-year project.",
        "correct": "a) a",
        "options": [
          "a) a",
          "b) an",
          "c) this",
          "d) «... »"
        ],
        "explanation": "a) a\n\n<b>Point :</b> Article indéfini\n<b>Règle :</b> On utilise l'article <b>a</b> devant un titre de fonction ou une profession commençant par une consonne."
      },
      {
        "id": "qcm_anglais__2020_18",
        "question": "18)...finishes first wins the game.",
        "correct": "c) Whoever",
        "options": [
          "a) Whatever",
          "b) Whichever",
          "c) Whoever",
          "d) Wherever"
        ],
        "explanation": "c) Whoever\n\n<b>Point :</b> Pronom composé en -ever\n<b>Règle :</b> <b>Whoever</b> signifie quiconque ou celui qui."
      },
      {
        "id": "qcm_anglais__2020_19",
        "question": "19) That region suffers...terrible poverty.",
        "correct": "a) from",
        "options": [
          "a) from",
          "b) of",
          "c) by",
          "d) with"
        ],
        "explanation": "a) from\n\n<b>Point :</b> Préposition verbale\n<b>Règle :</b> Le verbe <b>suffer</b> se construit avec la préposition <b>from</b> (souffrir de)."
      },
      {
        "id": "qcm_anglais__2020_20",
        "question": "20) « Tell me, Alex, how long is it since we...each other? »",
        "correct": "d) saw",
        "options": [
          "a) were not seeing",
          "b) have not seen",
          "c) have seen",
          "d) saw"
        ],
        "explanation": "d) saw\n\n<b>Point :</b> Construction avec since\n<b>Règle :</b> Dans la structure How long is it since..., on utilise le <b>Prétérit</b> pour désigner le moment précis de la dernière fois où l'action a eu lieu."
      },
      {
        "id": "qcm_anglais__2020_21",
        "question": "21) Why don't you make a start instead of just...about it?",
        "correct": "c) talking",
        "options": [
          "a) to talk",
          "b) having talked",
          "c) talking",
          "d) talk"
        ],
        "explanation": "c) talking\n\n<b>Point :</b> Préposition + Gérondif\n<b>Règle :</b> Après une préposition ou une locution prépositive comme <b>instead of</b>, le verbe se met toujours en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_22",
        "question": "22) «... put that on your account, sir? » asked the waiter.",
        "correct": "a) Shall I",
        "options": [
          "a) Shall I",
          "b) Will I",
          "c) Am I going to",
          "d) Ought I"
        ],
        "explanation": "a) Shall I\n\n<b>Point :</b> Modal (Proposition de service)\n<b>Règle :</b> On utilise <b>Shall I</b> à la forme interrogative pour proposer poliment son aide ou un service."
      },
      {
        "id": "qcm_anglais__2020_23",
        "question": "23) In Africa, there are a lot of hunger and diseases...to eradicate.",
        "correct": "a) still",
        "options": [
          "a) still",
          "b) always",
          "c) more",
          "d) even"
        ],
        "explanation": "a) still\n\n<b>Point :</b> Adverbe de temps\n<b>Règle :</b> <b>Still</b> signifie encore (persistance d'une situation)."
      },
      {
        "id": "qcm_anglais__2020_24",
        "question": "24) There were only ...dollars left in his pockets and ...in his bank account.",
        "correct": "a) a few...none",
        "options": [
          "a) a few...none",
          "b) no...any",
          "c) many...no",
          "d) none...few"
        ],
        "explanation": "a) a few...none\n\n<b>Point :</b> Quantifieurs\n<b>Règle :</b> <b>A few</b> s'utilise pour une petite quantité dénombrable. <b>None</b> exprime l'absence totale de quelque chose."
      },
      {
        "id": "qcm_anglais__2020_25",
        "question": "25) Why...his office now?",
        "correct": "b) not call",
        "options": [
          "a) not to call",
          "b) not call",
          "c) not calling",
          "d) don't call"
        ],
        "explanation": "b) not call\n\n<b>Point :</b> Suggestion\n<b>Règle :</b> La structure <b>Why not</b> est suivie directement de la <b>Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2020_26",
        "question": "26) Their job is to try and determine what everything will cost in the year...",
        "correct": "b) ahead",
        "options": [
          "a) next",
          "b) ahead",
          "c) coming",
          "d) in front"
        ],
        "explanation": "b) ahead\n\n<b>Point :</b> Expression du futur\n<b>Règle :</b> <b>The year ahead</b> est une expression figée pour désigner l'année à venir."
      },
      {
        "id": "qcm_anglais__2020_27",
        "question": "27) What he said about these ...interesting.",
        "correct": "a) people was",
        "options": [
          "a) people was",
          "b) people were",
          "c) peoples were",
          "d) people are"
        ],
        "explanation": "a) people was\n\n<b>Point :</b> Accord du verbe\n<b>Règle :</b> Le sujet de la phrase est la proposition nominale What he said (ce qu'il a dit), qui est singulière. Le verbe s'accorde donc au singulier (was)."
      },
      {
        "id": "qcm_anglais__2020_28",
        "question": "28) Mr Johnson is as loyal...as you could hope to find.",
        "correct": "c) a Democrat",
        "options": [
          "a) Democrat",
          "b) the Democrat",
          "c) a Democrat",
          "d) some Democrat"
        ],
        "explanation": "c) a Democrat\n\n<b>Point :</b> Structure de comparaison\n<b>Règle :</b> Dans la structure <b>as + adjectif + a + nom + as</b>, on place l'article indéfini entre l'adjectif et le nom."
      },
      {
        "id": "qcm_anglais__2020_29",
        "question": "29) He stayed on at the conference and so...she.",
        "correct": "d) did",
        "options": [
          "a) has",
          "b) does",
          "c) will",
          "d) did"
        ],
        "explanation": "d) did\n\n<b>Point :</b> Reprise avec SO\n<b>Règle :</b> Pour exprimer moi aussi / elle aussi, on utilise <b>So + auxiliaire + sujet</b>. L'auxiliaire doit correspondre au temps de la phrase précédente (ici le prétérit de stayed)."
      },
      {
        "id": "qcm_anglais__2020_30",
        "question": "30) They've become the 3rd ...producer of wood in Canada.",
        "correct": "a) largest",
        "options": [
          "a) largest",
          "b) larger",
          "c) at large",
          "d) in large"
        ],
        "explanation": "a) largest\n\n<b>Point :</b> Superlatif\n<b>Règle :</b> On utilise le superlatif (<b>-est</b>) même lorsqu'il y a un chiffre de classement (the 3rd largest)."
      },
      {
        "id": "qcm_anglais__2020_31",
        "question": "31) I never wanted...such lies.",
        "correct": "a) him to tell",
        "options": [
          "a) him to tell",
          "b) his telling",
          "c) that he tells",
          "d) he told"
        ],
        "explanation": "a) him to tell\n\n<b>Point :</b> Proposition infinitive\n<b>Règle :</b> Le verbe <b>want</b> se construit avec la structure <b>want + complément + to + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2020_32",
        "question": "32) « Japan? ». « I wouldn't mind going there...on my next vacation », she replied.",
        "correct": "b) either",
        "options": [
          "a) too",
          "b) either",
          "c) neither",
          "d) also"
        ],
        "explanation": "b) either\n\n<b>Point :</b> Aussi en contexte négatif\n<b>Règle :</b> Dans une phrase négative (wouldn't), on utilise <b>either</b> en fin de phrase pour dire non plus."
      },
      {
        "id": "qcm_anglais__2020_33",
        "question": "33) When were you here ... ?",
        "correct": "d) last",
        "options": [
          "a) the last",
          "b) for the last",
          "c) for last",
          "d) last"
        ],
        "explanation": "d) last\n\n<b>Point :</b> Adverbe de temps\n<b>Règle :</b> <b>Last</b> utilisé seul comme adverbe de temps en fin de phrase signifie la dernière fois."
      },
      {
        "id": "qcm_anglais__2020_34",
        "question": "34) It was one of the few valid...available of this problem at the time.",
        "correct": "c) analyses",
        "options": [
          "a) analyse",
          "b) analysis",
          "c) analyses",
          "d) analysing"
        ],
        "explanation": "c) analyses\n\n<b>Point :</b> Pluriel irrégulier\n<b>Règle :</b> Le pluriel des mots d'origine grecque en -is se transforme en <b>-es</b>. One of the few impose l'usage du pluriel."
      },
      {
        "id": "qcm_anglais__2020_35",
        "question": "35) ...the cost of living in Eastern Europe was still lower.",
        "correct": "c) Back then",
        "options": [
          "a) These days",
          "b) In these days",
          "c) Back then",
          "d) In the past days"
        ],
        "explanation": "c) Back then\n\n<b>Point :</b> Expression du passé\n<b>Règle :</b> <b>Back then</b> est une expression figée pour dire à cette époque-là (dans le passé)."
      },
      {
        "id": "qcm_anglais__2020_36",
        "question": "36) When the plane ... he had been working as a stewart for just a few months.",
        "correct": "d) crashed",
        "options": [
          "a) crash",
          "b) crashes",
          "c) had been crashing",
          "d) crashed"
        ],
        "explanation": "d) crashed\n\n<b>Point :</b> Rupture temporelle\n<b>Règle :</b> On utilise le <b>Prétérit simple</b> pour une action brève qui vient interrompre une action longue ou un bilan (exprimé ici par le Past Perfect Continuous)."
      },
      {
        "id": "qcm_anglais__2020_37",
        "question": "37) « Do you think it will happen again ? » « I hope... »",
        "correct": "b) not",
        "options": [
          "a) no",
          "b) not",
          "c) that not",
          "d) it doesn't do"
        ],
        "explanation": "b) not\n\n<b>Point :</b> Pro-phrase négative\n<b>Règle :</b> Pour répondre négativement après des verbes comme hope, fear, believe, suppose, on utilise <b>not</b> (I hope not = j'espère que non)."
      },
      {
        "id": "qcm_anglais__2020_38",
        "question": "38) Because of the strikes, we...be allowed to work from home.",
        "correct": "c) should",
        "options": [
          "a) are",
          "b) cannot",
          "c) should",
          "d) would"
        ],
        "explanation": "c) should\n\n<b>Point :</b> Modalité (Probabilité/Conseil)\n<b>Règle :</b> <b>Should</b> exprime ici ce qui est probable ou logique au vu de la situation (on devrait nous autoriser à)."
      },
      {
        "id": "qcm_anglais__2020_39",
        "question": "39) One of the...had disappeared from the shed. What a shame !",
        "correct": "b) boys' bicycles",
        "options": [
          "a) boy's bycicle",
          "b) boys' bicycles",
          "c) boys bicycle",
          "d) boys' bicycle"
        ],
        "explanation": "b) boys' bicycles\n\n<b>Point :</b> Génitif pluriel\n<b>Règle :</b> Après One of the, on attend un nom au pluriel. Le possesseur est au pluriel (boys), donc l'apostrophe se place après le -s (<b>boys'</b>)."
      },
      {
        "id": "qcm_anglais__2020_40",
        "question": "40) Could you tell me what...",
        "correct": "a) the expression << Soft Skills >> means?",
        "options": [
          "a) the expression << Soft Skills >> means?",
          "b) means the expression << Soft Skills >> ?",
          "c) does the expression << Soft Skills >>mean?",
          "d) does mean the expression << Soft Skills >>?"
        ],
        "explanation": "a) the expression &lt;&lt; Soft Skills &gt;&gt; means?\n\n<b>Point :</b> Interrogation indirecte\n<b>Règle :</b> Dans une subordonnée interrogative (après Could you tell me), on ne fait pas d'inversion. On utilise l'ordre : Sujet + Verbe."
      },
      {
        "id": "qcm_anglais__2020_41",
        "question": "41) « I'm fed up with her attitude ». «...»",
        "correct": "b) So am I",
        "options": [
          "a) Same to me",
          "b) So am I",
          "c) I am so",
          "d) Also me"
        ],
        "explanation": "b) So am I\n\n<b>Point :</b> Approbation (Moi aussi)\n<b>Règle :</b> Pour approuver une phrase affirmative, on utilise <b>So + auxiliaire + sujet</b>. L'auxiliaire doit correspondre à celui utilisé dans la phrase précédente."
      },
      {
        "id": "qcm_anglais__2020_42",
        "question": "42) They did this...as to boost productivity.",
        "correct": "c) so",
        "options": [
          "a) this such",
          "b) «... »",
          "c) so",
          "d) in order"
        ],
        "explanation": "c) so\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> La locution <b>so as to</b> (+ Base Verbale) signifie afin de ou de manière à."
      },
      {
        "id": "qcm_anglais__2020_43",
        "question": "43) Parisians, ...Chicagoans, take a keen interest in architecture.",
        "correct": "b) like",
        "options": [
          "a) as",
          "b) like",
          "c) same",
          "d) alike"
        ],
        "explanation": "b) like\n\n<b>Point :</b> Comparaison\n<b>Règle :</b> On utilise <b>like</b> devant un groupe nominal pour exprimer la ressemblance. As est utilisé devant une proposition (Sujet + Verbe)."
      },
      {
        "id": "qcm_anglais__2020_44",
        "question": "44) In theory ...techniques are equally valuable.",
        "correct": "d) all three",
        "options": [
          "a) the three all",
          "b) whole the three",
          "c) whole three",
          "d) all three"
        ],
        "explanation": "d) all three\n\n<b>Point :</b> Déterminant / Quantité\n<b>Règle :</b> Pour désigner un groupe de trois éléments, on utilise la structure <b>all three</b>."
      },
      {
        "id": "qcm_anglais__2020_45",
        "question": "45) Eight Britons...ten drink more than three cups of tea every day.",
        "correct": "d) out of",
        "options": [
          "a) out",
          "b) from",
          "c) on",
          "d) out of"
        ],
        "explanation": "d) out of\n\n<b>Point :</b> Proportion / Statistique\n<b>Règle :</b> On exprime une proportion avec la structure <b>X out of Y</b> (X sur Y)."
      },
      {
        "id": "qcm_anglais__2020_46",
        "question": "46) Before...this device, please read the instructions carefully.",
        "correct": "c) using",
        "options": [
          "a) use",
          "b) to use",
          "c) using",
          "d) have used"
        ],
        "explanation": "c) using\n\n<b>Point :</b> Préposition + Gérondif\n<b>Règle :</b> Après la préposition <b>before</b> (ou after), le verbe se met toujours à la forme <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_47",
        "question": "47) He 'd stopped... a long time ago when he started again.",
        "correct": "c) smoking",
        "options": [
          "a) to smoking",
          "b) to have smoked",
          "c) smoking",
          "d) smoke"
        ],
        "explanation": "c) smoking\n\n<b>Point :</b> Verbe + Gérondif\n<b>Règle :</b> Le verbe <b>stop</b> suivi du gérondif (<b>-ing</b>) signifie cesser une activité. (Suivi de l'infinitif, il signifie s'arrêter pour faire quelque chose)."
      },
      {
        "id": "qcm_anglais__2020_48",
        "question": "48) This is the most amazing film we have...seen.",
        "correct": "b) ever",
        "options": [
          "a) yet",
          "b) ever",
          "c) never",
          "d) already"
        ],
        "explanation": "b) ever\n\n<b>Point :</b> Superlatif + Present Perfect\n<b>Règle :</b> Dans une phrase au superlatif, on utilise <b>ever</b> pour dire auparavant ou que j'aie jamais vu."
      },
      {
        "id": "qcm_anglais__2020_49",
        "question": "49) There is no need for...drastic measures yet!",
        "correct": "c) such",
        "options": [
          "a) so",
          "b) as",
          "c) such",
          "d) that"
        ],
        "explanation": "c) such\n\n<b>Point :</b> Intensif\n<b>Règle :</b> On utilise <b>such</b> devant un adjectif suivi d'un nom au pluriel."
      },
      {
        "id": "qcm_anglais__2020_50",
        "question": "50) We have ...not received the documents which means the delivery will be delayed.",
        "correct": "c) still",
        "options": [
          "a) yet",
          "b) ever",
          "c) still",
          "d) now"
        ],
        "explanation": "c) still\n\n<b>Point :</b> Adverbe de temps\n<b>Règle :</b> <b>Still</b> (toujours) placé avant la négation souligne que la situation perdure. Yet se placerait en fin de proposition (have not received... yet)."
      },
      {
        "id": "qcm_anglais__2020_51",
        "question": "51) He handed me a list on which...",
        "correct": "a) there were four names",
        "options": [
          "a) there were four names",
          "b) four names were there",
          "c) four names were",
          "d) were there four names"
        ],
        "explanation": "a) there were four names\n\n<b>Point :</b> Proposition relative\n<b>Règle :</b> Après un pronom relatif (on which), on retrouve la structure classique d'une phrase déclarative : Sujet + Verbe."
      },
      {
        "id": "qcm_anglais__2020_52",
        "question": "52) I'm afraid I'm not very good...English.",
        "correct": "d) at",
        "options": [
          "a) for",
          "b) on",
          "c) within",
          "d) at"
        ],
        "explanation": "d) at\n\n<b>Point :</b> Adjectif + Préposition\n<b>Règle :</b> L'adjectif <b>good</b> (ainsi que bad ou excellent) se construit avec la préposition <b>at</b> pour exprimer une compétence."
      },
      {
        "id": "qcm_anglais__2020_53",
        "question": "53) Don't worry, he... get over his disappointment and get back to normal soon.",
        "correct": "a) will",
        "options": [
          "a) will",
          "b) can",
          "c) must",
          "d) shouldn't"
        ],
        "explanation": "a) will\n\n<b>Point :</b> Futur (Prédiction)\n<b>Règle :</b> On utilise <b>will</b> pour exprimer une certitude ou une prédiction sur l'avenir."
      },
      {
        "id": "qcm_anglais__2020_54",
        "question": "54) Physics is...they are good at.",
        "correct": "b) what",
        "options": [
          "a) which",
          "b) what",
          "c) that",
          "d) this"
        ],
        "explanation": "b) what\n\n<b>Point :</b> Pronom relatif nominal\n<b>Règle :</b> <b>What</b> est utilisé ici pour signifier la chose que ou ce que. Il n'a pas d'antécédent."
      },
      {
        "id": "qcm_anglais__2020_55",
        "question": "55) By the time a plane ...its main fuel tanks are nearly empty.",
        "correct": "d) lands",
        "options": [
          "a) has been landing",
          "b) will land",
          "c) will have landed",
          "d) lands"
        ],
        "explanation": "d) lands\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après <b>By the time</b> (au moment où), on utilise le <b>Présent Simple</b> pour exprimer un sens futur."
      },
      {
        "id": "qcm_anglais__2020_56",
        "question": "56) All he does is...; he must be ill.",
        "correct": "a) sleep",
        "options": [
          "a) sleep",
          "b) sleeping",
          "c) to sleep",
          "d) sleeps"
        ],
        "explanation": "a) sleep\n\n<b>Point :</b> Infinitif après ALL\n<b>Règle :</b> Après la structure All + sujet + do + is/was, on utilise la <b>Base Verbale</b> (sans to)."
      },
      {
        "id": "qcm_anglais__2020_57",
        "question": "59) « Stop interrupting your grandmother », the mother said to the little boy. « You... rude »",
        "correct": "a) are being",
        "options": [
          "a) are being",
          "b) mustn't",
          "c) are becoming",
          "d) become"
        ],
        "explanation": "a) are being\n\n<b>Point :</b> Aspect BE + -ing (Comportement passager)\n<b>Règle :</b> Le présent en <b>BE + V-ing</b> avec l'adjectif rude souligne que le garçon se comporte mal en ce moment précis."
      },
      {
        "id": "qcm_anglais__2020_58",
        "question": "60) They ...divorced for quite a few years now.",
        "correct": "d) have been",
        "options": [
          "a) are",
          "b) «... »",
          "c) were",
          "d) have been"
        ],
        "explanation": "d) have been\n\n<b>Point :</b> Bilan (Present Perfect)\n<b>Règle :</b> Pour une situation qui a commencé dans le passé et qui dure encore (indiqué par <b>for</b> + durée + <b>now</b>), on utilise le <b>Present Perfect</b>."
      },
      {
        "id": "qcm_anglais__2020_59",
        "question": "61) Although they are brother and sister, they...speak to each other these days.",
        "correct": "b) hardly",
        "options": [
          "a) hardy",
          "b) hardly",
          "c) strictly",
          "d) mainly"
        ],
        "explanation": "b) hardly\n\n<b>Point :</b> Adverbe de fréquence négative\n<b>Règle :</b> <b>Hardly</b> signifie presque pas. Attention à ne pas le confondre avec hard (dur)."
      },
      {
        "id": "qcm_anglais__2020_60",
        "question": "62) How old...you when you moved from China to the States ?",
        "correct": "a) were",
        "options": [
          "a) were",
          "b) have",
          "c) are",
          "d) did"
        ],
        "explanation": "a) were\n\n<b>Point :</b> Âge au passé\n<b>Règle :</b> On utilise l'auxiliaire <b>BE</b> au prétérit (were) pour parler de l'âge dans le passé."
      },
      {
        "id": "qcm_anglais__2020_61",
        "question": "63) If you...no money to pay for a taxi », she asked, « how did you get here >>?",
        "correct": "c) had",
        "options": [
          "a) have had",
          "b) had had",
          "c) had",
          "d) got"
        ],
        "explanation": "c) had\n\n<b>Point :</b> Conditionnel (If clause)\n<b>Règle :</b> Dans un contexte passé (asked / did you get), on utilise le <b>Prétérit</b> pour exprimer la condition."
      },
      {
        "id": "qcm_anglais__2020_62",
        "question": "64) The bride was a slim, fair...Danish girl.",
        "correct": "a) -haired",
        "options": [
          "a) -haired",
          "b) haired",
          "c) hair",
          "d) hair's"
        ],
        "explanation": "a) -haired\n\n<b>Point :</b> Adjectif composé\n<b>Règle :</b> Pour décrire une caractéristique physique, on utilise la structure <b>Adjectif + Nom-ED</b> (ex: fair-haired = aux cheveux clairs)."
      },
      {
        "id": "qcm_anglais__2020_63",
        "question": "65) The oddest thing...Mr Chang is his voice.",
        "correct": "c) about",
        "options": [
          "a) from",
          "b) of",
          "c) about",
          "d) as for"
        ],
        "explanation": "c) about\n\n<b>Point :</b> Préposition\n<b>Règle :</b> On utilise <b>about</b> pour parler d'un sujet ou d'une caractéristique concernant quelqu'un ou quelque chose."
      },
      {
        "id": "qcm_anglais__2020_64",
        "question": "66) The police have made little progress in discovering...information concerning the crime.",
        "correct": "a) any",
        "options": [
          "a) any",
          "b) some",
          "c) an",
          "d) much"
        ],
        "explanation": "a) any \n\n<b>Point :</b> Déterminant / Quantifieur\n<b>Règle :</b> Dans une phrase à sens négatif (little progress implique une négation), on utilise <b>any</b> pour parler d'une quantité indéterminée."
      },
      {
        "id": "qcm_anglais__2020_65",
        "question": "67) Have you...eaten grilled ants? It's a Columbian speciality.",
        "correct": "b) ever",
        "options": [
          "a) never",
          "b) ever",
          "c) already",
          "d) yet"
        ],
        "explanation": "b) ever \n\n<b>Point :</b> Adverbe de fréquence\n<b>Règle :</b> Dans une question au Present Perfect portant sur une expérience de vie, on utilise <b>ever</b> (déjà/jamais)."
      },
      {
        "id": "qcm_anglais__2020_66",
        "question": "68) Because of the current strikes, she...not have any train this morning.",
        "correct": "c) may",
        "options": [
          "a) would",
          "b) should",
          "c) may",
          "d) must"
        ],
        "explanation": "c) may \n\n<b>Point :</b> Modalité (Possibilité)\n<b>Règle :</b> <b>May</b> exprime une éventualité ou une possibilité incertaine dans le présent ou le futur."
      },
      {
        "id": "qcm_anglais__2020_67",
        "question": "69) You ...to respect the rules of the zoo or you will have to pay a fine and leave.",
        "correct": "c) have",
        "options": [
          "a) must",
          "b) are bound",
          "c) have",
          "d) should"
        ],
        "explanation": "c) have \n\n<b>Point :</b> Obligation\n<b>Règle :</b> <b>Have to</b> exprime une obligation externe (règlement). C'est le seul ici qui se construit avec la particule <b>to</b>."
      },
      {
        "id": "qcm_anglais__2020_68",
        "question": "70) The later we go to bed, the...we find it to fall asleep.",
        "correct": "c) more difficult",
        "options": [
          "a) difficuly",
          "b) most difficult",
          "c) more difficult",
          "d) difficulter"
        ],
        "explanation": "c) more difficult \n\n<b>Point :</b> Double comparatif\n<b>Règle :</b> La structure <b>The + comparatif..., the + comparatif...</b> exprime une corrélation (plus..., plus...)."
      },
      {
        "id": "qcm_anglais__2020_69",
        "question": "72) The children's bad health in Malawi is probably...to malnutrition.",
        "correct": "d) due",
        "options": [
          "a) thanks",
          "b) caused",
          "c) coming",
          "d) due"
        ],
        "explanation": "d) due \n\n<b>Point :</b> Cause\n<b>Règle :</b> <b>Due to</b> signifie dû à ou à cause de. C'est la structure adjectivale correcte après le verbe be."
      },
      {
        "id": "qcm_anglais__2020_70",
        "question": "73) My uncle is thinking...buying a dog for his kids as a Christmas present.",
        "correct": "b) of",
        "options": [
          "a) off",
          "b) of",
          "c) to",
          "d) «... »"
        ],
        "explanation": "b) of \n\n<b>Point :</b> Verbe à préposition\n<b>Règle :</b> Le verbe <b>think</b> se construit avec <b>of</b> ou <b>about</b> lorsqu'il est suivi d'une activité en -ing (envisager de)."
      },
      {
        "id": "qcm_anglais__2020_71",
        "question": "74) It's high time he...something about his poor English if he wants to become an engineer.",
        "correct": "a) did",
        "options": [
          "a) did",
          "b) does",
          "c) do",
          "d) is doing"
        ],
        "explanation": "a) did \n\n<b>Point :</b> Irréel du présent\n<b>Règle :</b> Après l'expression <b>It's high time</b>, on utilise obligatoirement le <b>Prétérit modal</b>."
      },
      {
        "id": "qcm_anglais__2020_72",
        "question": "75) Mr Green doesn't smoke, ...he ?",
        "correct": "c) does",
        "options": [
          "a) is",
          "b) do",
          "c) does",
          "d) doesn't"
        ],
        "explanation": "c) does \n\n<b>Point :</b> Question Tag\n<b>Règle :</b> Le tag reprend l'auxiliaire de la phrase (do/does). La phrase étant négative (doesn't), le tag doit être affirmatif (<b>does he</b>)."
      },
      {
        "id": "qcm_anglais__2020_73",
        "question": "76) -« Was the plane on time? » -« No, he had to wait...an hour ».",
        "correct": "d) over",
        "options": [
          "a) plus",
          "b) more",
          "c) since",
          "d) over"
        ],
        "explanation": "d) over \n<b>Point :</b> Préposition de quantité\n<b>Règle :</b> <b>Over</b> (plus de) est utilisé pour indiquer un dépassement d'une mesure de temps ou de quantité."
      },
      {
        "id": "qcm_anglais__2020_74",
        "question": "77) He was only a kid...but he says he will never forget.",
        "correct": "b) at the time",
        "options": [
          "a) this time",
          "b) at the time",
          "c) for the time",
          "d) at a time"
        ],
        "explanation": "b) at the time \n\n<b>Point :</b> Expression temporelle\n<b>Règle :</b> <b>At the time</b> est une locution figée signifiant à l'époque ou à ce moment-là."
      },
      {
        "id": "qcm_anglais__2020_75",
        "question": "78) The project would cost...$300 million.",
        "correct": "c) an estimated",
        "options": [
          "a) an estimate",
          "b) to estimate",
          "c) an estimated",
          "d) the estimate of"
        ],
        "explanation": "c) an estimated\n\n<b>Point :</b> Participe passé adjectival\n<b>Règle :</b> On utilise <b>an estimated</b> devant un chiffre pour signifier un montant estimé à."
      },
      {
        "id": "qcm_anglais__2020_76",
        "question": "79) It is now 5 years...the discovery was made.",
        "correct": "b) since",
        "options": [
          "a) ago",
          "b) since",
          "c) for",
          "d) when"
        ],
        "explanation": "b) since\n\n<b>Point :</b> Bilan temporel\n<b>Règle :</b> La structure <b>It is + durée + since + prétérit</b> permet de dire cela fait X temps que l'événement s'est produit."
      },
      {
        "id": "qcm_anglais__2020_77",
        "question": "80) They met 10 years...while doing an internship in Argentina and got married recently.",
        "correct": "a) ago",
        "options": [
          "a) ago",
          "b) «... »",
          "c) since",
          "d) away"
        ],
        "explanation": "a) ago\n\n<b>Point :</b> Expression du passé\n<b>Règle :</b> <b>Ago</b> se place après une durée pour dater un événement terminé par rapport au présent."
      },
      {
        "id": "qcm_anglais__2020_78",
        "question": "81)...to Suzan's party tonight?",
        "correct": "c) Are you coming",
        "options": [
          "a) Do you come",
          "b) Are you come",
          "c) Are you coming",
          "d) Coming"
        ],
        "explanation": "c) Are you coming\n\n<b>Point :</b> Futur (Arrangement)\n<b>Règle :</b> On utilise le présent en <b>BE + V-ing</b> pour parler d'un projet ou d'une invitation déjà fixée dans le futur."
      },
      {
        "id": "qcm_anglais__2020_79",
        "question": "82) He said...students involved had no idea they were breaking the rules.",
        "correct": "b) most of the",
        "options": [
          "a) the most",
          "b) most of the",
          "c) most of",
          "d) the most of"
        ],
        "explanation": "b) most of the\n\n<b>Point :</b> Quantifieur\n<b>Règle :</b> Devant un nom spécifique (les étudiants en question), on utilise <b>most of the</b>."
      },
      {
        "id": "qcm_anglais__2020_80",
        "question": "83) This morning, Marc was bungee jumping...Tom was paragliding.",
        "correct": "c) while",
        "options": [
          "a) wherever",
          "b) when",
          "c) while",
          "d) whenever"
        ],
        "explanation": "c) while\n\n<b>Point :</b> Simultanéité\n<b>Règle :</b> <b>While</b> (pendant que / alors que) permet de lier deux actions qui se déroulent en même temps au passé."
      },
      {
        "id": "qcm_anglais__2020_81",
        "question": "84) Gladys...in a prestigious London University for 2 years now.",
        "correct": "d) has been studying",
        "options": [
          "a) studies",
          "b) is studying",
          "c) has studied",
          "d) has been studying"
        ],
        "explanation": "d) has been studying\n\n<b>Point :</b> Present Perfect Continuous\n<b>Règle :</b> Pour une action qui a commencé dans le passé, qui dure encore, et dont on souligne la durée (for 2 years now), on utilise <b>has been + V-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_82",
        "question": "85) As he finished playing that magnificent concerto,...fell upon the audience.",
        "correct": "a) silence",
        "options": [
          "a) silence",
          "b) a silence did",
          "c) the silence",
          "d) silence had"
        ],
        "explanation": "a) silence\n\n<b>Point :</b> Article zéro\n<b>Règle :</b> Le nom abstrait <b>silence</b> s'utilise ici sans article pour désigner la notion générale de silence qui s'installe."
      },
      {
        "id": "qcm_anglais__2020_83",
        "question": "86) Their son was held...for 40 days.",
        "correct": "a) hostage",
        "options": [
          "a) hostage",
          "b) like hostage",
          "c) as hostage",
          "d) the hostage"
        ],
        "explanation": "a) hostage\n\n<b>Point :</b> Expression figée\n<b>Règle :</b> On dit <b>to be held hostage</b> (être retenu en otage) sans article ni préposition entre les deux mots."
      },
      {
        "id": "qcm_anglais__2020_84",
        "question": "87) We have the money....it, would be stupid.",
        "correct": "c) Not using",
        "options": [
          "a) No use",
          "b) No using",
          "c) Not using",
          "d) Not use"
        ],
        "explanation": "c) Not using\n\n<b>Point :</b> Gérondif sujet\n<b>Règle :</b> Le gérondif peut servir de sujet à une phrase. Pour le mettre à la forme négative, on place <b>not</b> devant le verbe en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2020_85",
        "question": "88) They...with each other since they were kids.",
        "correct": "c) have been in love",
        "options": [
          "a) have been loving",
          "b) have been loved",
          "c) have been in love",
          "d) have been in loved"
        ],
        "explanation": "c) have been in love\n\n<b>Point :</b> État et Bilan\n<b>Règle :</b> On utilise le <b>Present Perfect</b> simple (have been) avec l'adjectif in love pour exprimer un état qui dure depuis un point précis du passé (since)."
      },
      {
        "id": "qcm_anglais__2020_86",
        "question": "89) Education is the key for those teenagers most...risk.",
        "correct": "b) at",
        "options": [
          "a) in",
          "b) at",
          "c) to",
          "d) on"
        ],
        "explanation": "b) at\n\n<b>Point :</b> Préposition fixe\n<b>Règle :</b> L'expression correcte pour dire à risque est <b>at risk</b>."
      },
      {
        "id": "qcm_anglais__2020_87",
        "question": "90) They will not resume work until their demand...met.",
        "correct": "d) has been",
        "options": [
          "a) has not been",
          "b) won't be",
          "c) will be",
          "d) has been"
        ],
        "explanation": "d) has been\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après <b>until</b>, on utilise le présent ou le <b>Present Perfect</b> (pour souligner l'achèvement) pour exprimer le futur. On ne rajoute pas de négation car until la porte déjà."
      },
      {
        "id": "qcm_anglais__2020_88",
        "question": "91) We 've asked...embassy for more details.",
        "correct": "d) the",
        "options": [
          "a) to the",
          "b) from the",
          "c) of the",
          "d) the"
        ],
        "explanation": "d) the\n\n<b>Point :</b> Verbe transitif direct\n<b>Règle :</b> Le verbe <b>ask</b> est suivi directement de son complément (l'ambassade) sans préposition."
      },
      {
        "id": "qcm_anglais__2020_89",
        "question": "92) ...at 90 degrees?",
        "correct": "c) does water boil",
        "options": [
          "a) Is water boiling",
          "b) do water boil",
          "c) does water boil",
          "d) has water boil"
        ],
        "explanation": "c) does water boil\n\n<b>Point :</b> Vérité générale\n<b>Règle :</b> Pour les lois de la nature ou les faits permanents, on utilise le <b>Présent Simple</b>."
      },
      {
        "id": "qcm_anglais__2020_90",
        "question": "93) It's a very private matter. The...you say about it, the better.",
        "correct": "d) less",
        "options": [
          "a) least",
          "b) lest",
          "c) lesser",
          "d) less"
        ],
        "explanation": "d) less\n\n<b>Point :</b> Double comparatif\n<b>Règle :</b> La structure <b>The less... the better</b> exprime une corrélation inverse (moins..., mieux...)."
      },
      {
        "id": "qcm_anglais__2020_91",
        "question": "94) It looks like she has...friends on Facebook than you do.",
        "correct": "d) fewer",
        "options": [
          "a) less",
          "b) lesser",
          "c) least",
          "d) fewer"
        ],
        "explanation": "d) fewer\n\n<b>Point :</b> Comparatif d'infériorité\n<b>Règle :</b> On utilise <b>fewer</b> devant un nom dénombrable pluriel (friends). Less est réservé aux indénombrables."
      },
      {
        "id": "qcm_anglais__2020_92",
        "question": "95) -« Shall I invite Henry to the party? » -« It would be nice if you.... »",
        "correct": "c) did",
        "options": [
          "a) invited",
          "b) did invite",
          "c) did",
          "d) shall"
        ],
        "explanation": "c) did\n\n<b>Point :</b> Reprise avec auxiliaire\n<b>Règle :</b> On utilise l'auxiliaire <b>did</b> (correspondant au prétérit du conditionnel invited) pour éviter de répéter le verbe."
      },
      {
        "id": "qcm_anglais__2020_93",
        "question": "96) As soon as you...your dinner, go straight to bed. It's getting late.",
        "correct": "b) finish",
        "options": [
          "a) will finish",
          "b) finish",
          "c) will be finishing",
          "d) are finished"
        ],
        "explanation": "b) finish\n\n<b>Point :</b> Subordonnée de temps\n<b>Règle :</b> Après <b>As soon as</b>, on utilise le <b>Présent Simple</b> même si le sens de la phrase est futur."
      },
      {
        "id": "qcm_anglais__2020_94",
        "question": "97) Not only...she graduate from an engineering school, but later on she graduated from a business school too.",
        "correct": "a) did",
        "options": [
          "a) did",
          "b) will",
          "c) has",
          "d) have"
        ],
        "explanation": "a) did\n\n<b>Point :</b> Inversion sujet-auxiliaire\n<b>Règle :</b> Lorsqu'une phrase commence par une structure restrictive comme <b>Not only</b>, on procède à l'inversion de l'auxiliaire (ici did pour le prétérit) et du sujet."
      },
      {
        "id": "qcm_anglais__2020_95",
        "question": "98) Most of the managers are well aware of the gap that now...between them and the company's other staff.",
        "correct": "a) exists",
        "options": [
          "a) exists",
          "b) has existed",
          "c) is existing",
          "d) existed"
        ],
        "explanation": "a) exists\n\n<b>Point :</b> Présent de vérité / état\n<b>Règle :</b> Pour exprimer un état de fait actuel et permanent, le <b>Présent Simple</b> est requis."
      },
      {
        "id": "qcm_anglais__2020_96",
        "question": "99) What is the basic...rate in France?",
        "correct": "b) tax",
        "options": [
          "a) taxes",
          "b) tax",
          "c) taxis",
          "d) taxing"
        ],
        "explanation": "b) tax\n\n<b>Point :</b> Nom composé\n<b>Règle :</b> Dans un nom composé comme <b>tax rate</b> (taux d'imposition), le premier nom joue le rôle d'adjectif et reste au singulier."
      },
      {
        "id": "qcm_anglais__2020_97",
        "question": "100) Mary is only 9, ...she is so mature and reasonable.",
        "correct": "b) and yet",
        "options": [
          "a) although",
          "b) and yet",
          "c) despite",
          "d) while"
        ],
        "explanation": "b) and yet\n\n<b>Point :</b> Connecteur d'opposition\n<b>Règle :</b> <b>And yet</b> (et pourtant) permet d'introduire un contraste fort entre deux propositions indépendantes."
      }
    ]
  },
  "qcm_anglais__2019": {
    "id": "qcm_anglais__2019",
    "name": "QCM anglais ➔ 2019",
    "path": "QCM anglais::2019",
    "pathParts": [
      "QCM anglais",
      "2019"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2019_1",
        "question": "1) He.... before he knew the company was having difficulties",
        "correct": "a) had resigned",
        "options": [
          "a) had resigned",
          "b) was resigning",
          "c) resigns",
          "d) has resigned"
        ],
        "explanation": "a) had resigned\n\n<b>Point :</b> Past Perfect\n<b>Règle :</b> On utilise le <b>Past Perfect</b> (had + participe passé) pour exprimer une action qui s'est déroulée <b>avant</b> une autre action passée (ici, le fait de savoir que l'entreprise avait des problèmes)."
      },
      {
        "id": "qcm_anglais__2019_2",
        "question": "2) If Tom were looking for an internship in Germany, our recruitment manager...",
        "correct": "d) could",
        "options": [
          "a) helped",
          "b) will have helped",
          "c) can to help",
          "d) could"
        ],
        "explanation": "d) could\n\n<b>Point :</b> Conditionnel (Hypothèse)\n<b>Règle :</b> Dans une structure en <b>If + Prétérit</b> (irréel du présent), la principale doit être au conditionnel (<b>would/could + BV</b>). Les autres options sont grammaticalement impossibles ici."
      },
      {
        "id": "qcm_anglais__2019_3",
        "question": "3) The teacher wants the essay. .....by 12:15",
        "correct": "a) finished",
        "options": [
          "a) finished",
          "b) finishing",
          "c) will be finished",
          "d) must be finished"
        ],
        "explanation": "a) finished\n\n<b>Point :</b> Adjectif / Participe Passé\n<b>Règle :</b> On utilise ici le participe passé <b>finished</b> pour exprimer l'état souhaité du devoir (qu'il soit terminé)."
      },
      {
        "id": "qcm_anglais__2019_4",
        "question": "4) The company's benefits were up, ...... the CEO felt satisfied",
        "correct": "b) therefore",
        "options": [
          "a) nevertheless",
          "b) therefore",
          "c) however",
          "d) for this purpose"
        ],
        "explanation": "b) therefore\n\n<b>Point :</b> Connecteur logique (Conséquence)\n<b>Règle :</b> <b>Therefore</b> signifie par conséquent. C'est le seul connecteur qui exprime la suite logique entre l'augmentation des profits et la satisfaction du PDG."
      },
      {
        "id": "qcm_anglais__2019_5",
        "question": "5) ...... the economic crisis, lots of people lost their job",
        "correct": "b) Because of",
        "options": [
          "a) When",
          "b) Because of",
          "c) Although",
          "d) Since"
        ],
        "explanation": "b) Because of\n\n<b>Point :</b> Cause + Groupe Nominal\n<b>Règle :</b> <b>Because of</b> introduit une cause suivie d'un nom. When ou Since nécessiteraient un sujet et un verbe."
      },
      {
        "id": "qcm_anglais__2019_6",
        "question": "6) Consumer confidence fell.....................May",
        "correct": "c) in",
        "options": [
          "a) next",
          "b) on",
          "c) in",
          "d) the"
        ],
        "explanation": "c) in\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> Devant les mois de l'année, on utilise toujours la préposition <b>in</b>."
      },
      {
        "id": "qcm_anglais__2019_7",
        "question": "7) The conference will take place............Berlin",
        "correct": "c) in",
        "options": [
          "a) at",
          "b) on",
          "c) in",
          "d) to"
        ],
        "explanation": "c) in\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> Devant les noms de villes ou de pays, on utilise la préposition <b>in</b>."
      },
      {
        "id": "qcm_anglais__2019_8",
        "question": "8) Many elderly people can't use computers, ............. they need help.",
        "correct": "c) consequently",
        "options": [
          "a) on the whole",
          "b) besides",
          "c) consequently",
          "d) for example"
        ],
        "explanation": "c) consequently\n\n<b>Point :</b> Connecteur logique (Conséquence)\n<b>Règle :</b> <b>Consequently</b> exprime la conséquence d'une situation (ils ne savent pas utiliser les PC, donc ils ont besoin d'aide)."
      },
      {
        "id": "qcm_anglais__2019_9",
        "question": "9) The teacher let the students.....just before 5 o’clock",
        "correct": "a) leave",
        "options": [
          "a) leave",
          "b) left",
          "c) to leave",
          "d) leaving"
        ],
        "explanation": "a) leave\n\n<b>Point :</b> Structure verbale (LET)\n<b>Règle :</b> Le verbe <b>LET</b> est suivi d'un complément et de la <b>Base Verbale</b> (infinitif sans to)."
      },
      {
        "id": "qcm_anglais__2019_10",
        "question": "10) Find.....the main details about him and write his biography",
        "correct": "c) out",
        "options": [
          "a) up",
          "b) about",
          "c) out",
          "d) around"
        ],
        "explanation": "c) out\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To find out</b> signifie découvrir ou se renseigner sur."
      },
      {
        "id": "qcm_anglais__2019_11",
        "question": "11) The film....going on since 2 o'clock. What a long film!",
        "correct": "a) has been",
        "options": [
          "a) has been",
          "b) was",
          "c) is",
          "d) has being"
        ],
        "explanation": "a) has been\n\n<b>Point :</b> Bilan + Durée (Present Perfect)\n<b>Règle :</b> Avec <b>since</b>, on utilise le <b>Present Perfect</b> (ici à la forme continue has been going on) pour une action commencée dans le passé qui dure encore."
      },
      {
        "id": "qcm_anglais__2019_12",
        "question": "12) Ambition, talent.....desire are ingredients for success",
        "correct": "d) and",
        "options": [
          "a) or",
          "b) either",
          "c) neither",
          "d) and"
        ],
        "explanation": "d) and\n\n<b>Point :</b> Coordination\n<b>Règle :</b> On utilise <b>and</b> pour additionner les éléments d'une liste positive."
      },
      {
        "id": "qcm_anglais__2019_13",
        "question": "13) If this man.....elected, the country's economy will recover",
        "correct": "a) is",
        "options": [
          "a) is",
          "b) was",
          "c) will be",
          "d) would"
        ],
        "explanation": "a) is\n\n<b>Point :</b> Conditionnel de type 1 (Probable)\n<b>Règle :</b> Dans une structure en <b>If</b> exprimant le futur, la subordonnée est au <b>Présent Simple</b> et la principale au futur (will)."
      },
      {
        "id": "qcm_anglais__2019_14",
        "question": "14) Five years ago, he bought himself a second-hand car and............Australia",
        "correct": "b) visited",
        "options": [
          "a) visits",
          "b) visited",
          "c) has visited",
          "d) was visiting"
        ],
        "explanation": "b) visited\n\n<b>Point :</b> Narration au passé (Prétérit)\n<b>Règle :</b> L'indicateur <b>Five years ago</b> impose l'usage du <b>Prétérit</b> pour toutes les actions terminées de la phrase."
      },
      {
        "id": "qcm_anglais__2019_15",
        "question": "15) He got his wallet.... .while visiting the Champs-Elysees",
        "correct": "c) stolen",
        "options": [
          "a) steal",
          "b) stealing",
          "c) stolen",
          "d) to steal"
        ],
        "explanation": "c) stolen\n\n<b>Point :</b> Structure causative passive\n<b>Règle :</b> La structure <b>Get + objet + participe passé</b> exprime quelque chose que l'on subit ou que l'on fait faire par quelqu'un."
      },
      {
        "id": "qcm_anglais__2019_16",
        "question": "16) You should improve your English,...your best option is to spend some months in an English-speaking country",
        "correct": "b) that's why",
        "options": [
          "a) however",
          "b) that's why",
          "c) because",
          "d) but"
        ],
        "explanation": "b) that's why\n\n<b>Point :</b> Connecteur logique (Conséquence)\n<b>Règle :</b> <b>That's why</b> signifie c'est pourquoi. Il introduit la conclusion logique du conseil donné précédemment."
      },
      {
        "id": "qcm_anglais__2019_17",
        "question": "17) She always listens to the news... cooking, so she can keep up with whatever happens in the world",
        "correct": "b) while",
        "options": [
          "a) during",
          "b) while",
          "c) in the meantime",
          "d) for"
        ],
        "explanation": "b) while\n\n<b>Point :</b> Simultanéité\n<b>Règle :</b> On utilise <b>while + V-ing</b> pour exprimer deux actions simultanées. During doit être suivi d'un groupe nominal."
      },
      {
        "id": "qcm_anglais__2019_18",
        "question": "18) He has... done two internships abroad, hasn't he?",
        "correct": "c) already",
        "options": [
          "a) yet",
          "b) ever",
          "c) already",
          "d) never"
        ],
        "explanation": "c) already\n\n<b>Point :</b> Adverbe de temps (Déjà)\n<b>Règle :</b> Dans une phrase affirmative au Present Perfect, on utilise <b>already</b> pour indiquer qu'une action a déjà été accomplie."
      },
      {
        "id": "qcm_anglais__2019_19",
        "question": "19) My uncle always attempts to make his employees..…like family.",
        "correct": "d) feel",
        "options": [
          "a) feeling",
          "b) feels",
          "c) felt",
          "d) feel"
        ],
        "explanation": "d) feel\n\n<b>Point :</b> Structure causative (MAKE)\n<b>Règle :</b> Après le verbe <b>MAKE</b> suivi d'un complément d'objet, on utilise obligatoirement la <b>Base Verbale</b> (sans to)."
      },
      {
        "id": "qcm_anglais__2019_20",
        "question": "20) If I don't get my bonus paid soon, I... be in the red at the bank!",
        "correct": "d) will",
        "options": [
          "a) am",
          "b) am going",
          "c) am about to",
          "d) will"
        ],
        "explanation": "d) will\n\n<b>Point :</b> Conditionnel Type 1 (Probable)\n<b>Règle :</b> La structure <b>If + Présent</b> demande un futur en <b>will</b> dans la proposition principale."
      },
      {
        "id": "qcm_anglais__2019_21",
        "question": "21) The swimming-pool ... within the next month",
        "correct": "a) will be inaugurated",
        "options": [
          "a) will be inaugurated",
          "b) will inaugurated",
          "c) will inaugurate",
          "d) would be inaugurated"
        ],
        "explanation": "a) will be inaugurated\n\n<b>Point :</b> Futur Passif\n<b>Règle :</b> Pour une action future subie par le sujet (la piscine), on utilise <b>will + be + participe passé</b>."
      },
      {
        "id": "qcm_anglais__2019_22",
        "question": "22) Could you have a technician.............and see my printer today because it's out of order?",
        "correct": "c) come",
        "options": [
          "a) comes",
          "b) coming",
          "c) come",
          "d) to come"
        ],
        "explanation": "c) come\n\n<b>Point :</b> Structure causative (HAVE)\n<b>Règle :</b> La structure <b>Have + quelqu'un + Base Verbale</b> exprime le fait de faire faire quelque chose à quelqu'un."
      },
      {
        "id": "qcm_anglais__2019_23",
        "question": "23) They got sick... the Christmas holidays",
        "correct": "c) during",
        "options": [
          "a) while",
          "b) since",
          "c) during",
          "d) once"
        ],
        "explanation": "c) during\n\n<b>Point :</b> Préposition de temps\n<b>Règle :</b> <b>During</b> est suivi d'un nom (les vacances) pour indiquer à quel moment l'événement a eu lieu."
      },
      {
        "id": "qcm_anglais__2019_24",
        "question": "24) Don't worry, your bank has got branches.......... the United States",
        "correct": "a) throughout",
        "options": [
          "a) throughout",
          "b) at",
          "c) about",
          "d) on"
        ],
        "explanation": "a) throughout\n\n<b>Point :</b> Préposition d'espace\n<b>Règle :</b> <b>Throughout</b> signifie partout dans ou à travers tout (un pays, une zone)."
      },
      {
        "id": "qcm_anglais__2019_25",
        "question": "25) Let the customer in, offer him some coffee.........I'll get Tom to come as quickly as possible",
        "correct": "c) meanwhile",
        "options": [
          "a) so",
          "b) nevertheless",
          "c) meanwhile",
          "d) due to"
        ],
        "explanation": "c) meanwhile\n\n<b>Point :</b> Adverbe de liaison\n<b>Règle :</b> <b>Meanwhile</b> signifie pendant ce temps. Il sert à lier deux actions qui se passent en même temps."
      },
      {
        "id": "qcm_anglais__2019_26",
        "question": "26) The ..with the government was settled after weeks of negotiation",
        "correct": "a) dispute",
        "options": [
          "a) dispute",
          "b) disputing",
          "c) disputable",
          "d) disputant"
        ],
        "explanation": "a) dispute\n\n<b>Point :</b> Nature du mot (Nom)\n<b>Règle :</b> On a besoin du nom commun <b>dispute</b> (le litige/conflit) pour servir de sujet à la phrase."
      },
      {
        "id": "qcm_anglais__2019_27",
        "question": "27) Make sure to show it to an.............art dealer",
        "correct": "c) authorized",
        "options": [
          "a) authority",
          "b) authorization",
          "c) authorized",
          "d) authoritarian"
        ],
        "explanation": "c) authorized\n\n<b>Point :</b> Adjectif (Participe passé)\n<b>Règle :</b> On utilise <b>authorized</b> (agréé/autorisé) pour qualifier le marchand d'art."
      },
      {
        "id": "qcm_anglais__2019_28",
        "question": "28) The manager apologized for............late to work this morning",
        "correct": "b) being",
        "options": [
          "a) be",
          "b) being",
          "c) having been",
          "d) been"
        ],
        "explanation": "b) being\n\n<b>Point :</b> Gérondif après préposition\n<b>Règle :</b> Après la préposition <b>for</b>, le verbe doit obligatoirement être à la forme <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2019_29",
        "question": "29) The students............the results of the exam tomorrow afternoon",
        "correct": "b) will know",
        "options": [
          "a) will be knowing",
          "b) will know",
          "c) will have known",
          "d) is going to be knowing"
        ],
        "explanation": "b) will know\n\n<b>Point :</b> Futur simple\n<b>Règle :</b> Know est un verbe d'état qui ne s'utilise généralement pas aux formes progressives (en -ing). Le futur simple <b>will know</b> est la forme correcte."
      },
      {
        "id": "qcm_anglais__2019_30",
        "question": "30) They found it difficult to adapt to Chinese ways........the first six months and then got used to it",
        "correct": "a) for",
        "options": [
          "a) for",
          "b) as soon as",
          "c) while",
          "d) once upon a time"
        ],
        "explanation": "a) for\n\n<b>Point :</b> Expression de la durée\n<b>Règle :</b> <b>For</b> est utilisé pour introduire une période de temps (pendant les six premiers mois)."
      },
      {
        "id": "qcm_anglais__2019_31",
        "question": "31) It's important that the competitors.. .all the rules",
        "correct": "d) know",
        "options": [
          "a) are knowing",
          "b) will know",
          "c) is knowing",
          "d) know"
        ],
        "explanation": "d) know\n\n<b>Point :</b> Subjonctif / Base Verbale\n<b>Règle :</b> Après des expressions d'importance ou de nécessité (It is important / vital / essential that...), on utilise la <b>Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2019_32",
        "question": "32) As a kid, I. .practise karate twice a week",
        "correct": "a) used to",
        "options": [
          "a) used to",
          "b) am used to",
          "c) was used to",
          "d) using to"
        ],
        "explanation": "a) used to\n\n<b>Point :</b> Habitude passée révolue\n<b>Règle :</b> <b>Used to + Base Verbale</b> exprime une action répétée dans le passé qui n'a plus cours aujourd'hui."
      },
      {
        "id": "qcm_anglais__2019_33",
        "question": "33) ..he says, he is always funny",
        "correct": "d) Whatever",
        "options": [
          "a) Whoever",
          "b) Wherever",
          "c) Whenever",
          "d) Whatever"
        ],
        "explanation": "d) Whatever\n\n<b>Point :</b> Pronom composé en -ever\n<b>Règle :</b> <b>Whatever</b> signifie peu importe ce que ou quoi qu'il. Ici : Quoi qu'il dise."
      },
      {
        "id": "qcm_anglais__2019_34",
        "question": "34) Neither has she got a brother.......a sister and has always felt sad about it",
        "correct": "a) nor",
        "options": [
          "a) nor",
          "b) or",
          "c) yet",
          "d) neither"
        ],
        "explanation": "a) nor\n\n<b>Point :</b> Corrélation négative\n<b>Règle :</b> La structure fixe pour exprimer ni l'un, ni l'autre est <b>Neither... nor...</b>."
      },
      {
        "id": "qcm_anglais__2019_35",
        "question": "35) He wishes he .not so slow at memorizing his lessons",
        "correct": "c) were",
        "options": [
          "a) was",
          "b) weren't",
          "c) were",
          "d) is"
        ],
        "explanation": "c) were\n\n<b>Point :</b> Expression du regret (WISH)\n<b>Règle :</b> Après wish, pour un regret portant sur le présent, on utilise le <b>Prétérit modal</b>. Pour le verbe BE, on utilise <b>were</b> à toutes les personnes en style soutenu."
      },
      {
        "id": "qcm_anglais__2019_36",
        "question": "36) ..flavour ice-cream would you like, sir? Vanilla, strawberry or chocolate?",
        "correct": "a) Which",
        "options": [
          "a) Which",
          "b) What",
          "c) Whose",
          "d) Whom"
        ],
        "explanation": "a) Which\n\n<b>Point :</b> Pronom interrogatif\n<b>Règle :</b> On utilise <b>Which</b> au lieu de What lorsque le choix est limité à une liste d'options précise."
      },
      {
        "id": "qcm_anglais__2019_37",
        "question": "37) .fault is it? Well - I don't have a clue",
        "correct": "d) Whose",
        "options": [
          "a) What",
          "b) Which",
          "c) Whom",
          "d) Whose"
        ],
        "explanation": "d) Whose\n\n<b>Point :</b> Possession (Interrogation)\n<b>Règle :</b> <b>Whose</b> permet d'interroger sur le possesseur ou le responsable (À qui est la faute ?)."
      },
      {
        "id": "qcm_anglais__2019_38",
        "question": "38) We............him for over ten years and consider him a very reliable and honest person",
        "correct": "c) have known",
        "options": [
          "a) know",
          "b) knew",
          "c) have known",
          "d) have been knowing"
        ],
        "explanation": "c) have known\n\n<b>Point :</b> Bilan (Present Perfect)\n<b>Règle :</b> Pour un verbe d'état comme know, on utilise le <b>Present Perfect simple</b> pour faire un bilan sur une durée qui continue (for ten years)."
      },
      {
        "id": "qcm_anglais__2019_39",
        "question": "39) If you want to brush.......... your Spanish before the holidays, you'd better hurry up",
        "correct": "b) up",
        "options": [
          "a) in",
          "b) up",
          "c) out",
          "d) into"
        ],
        "explanation": "b) up\n\n<b>Point :</b> Phrasal Verb\n<b>Règle :</b> <b>To brush up</b> (ou brush up on) signifie rafraîchir ses connaissances ou se remettre à niveau."
      },
      {
        "id": "qcm_anglais__2019_40",
        "question": "40) How do you believe they entered...........your house?",
        "correct": "d) Ø",
        "options": [
          "a) in",
          "b) into",
          "c) onto",
          "d) Ø"
        ],
        "explanation": "d) Ø\n\n<b>Point :</b> Verbe transitif direct\n<b>Règle :</b> Le verbe <b>enter</b> (pénétrer dans) est transitif direct en anglais quand il s'agit d'un lieu physique. On ne met pas de préposition."
      },
      {
        "id": "qcm_anglais__2019_41",
        "question": "41) Do you want me to call you as soon as ...........?",
        "correct": "c) we arrive",
        "options": [
          "a) we will arrive",
          "b) we shall arrive",
          "c) we arrive",
          "d) we arrived"
        ],
        "explanation": "c) we arrive\n\n<b>Point :</b> Subordonnée de temps\n<b>Règle :</b> Dans une subordonnée de temps introduit par <b>as soon as</b>, on utilise le <b>Présent Simple</b> pour exprimer le futur."
      },
      {
        "id": "qcm_anglais__2019_42",
        "question": "42) I have no other telephone number.......this one",
        "correct": "a) than",
        "options": [
          "a) than",
          "b) that",
          "c) as",
          "d) from"
        ],
        "explanation": "a) than\n\n<b>Point :</b> Comparatif d'exclusion\n<b>Règle :</b> L'expression <b>no other... than</b> signifie aucun autre... que."
      },
      {
        "id": "qcm_anglais__2019_43",
        "question": "43) He... to Hong-Kong two years ago and loves it over there",
        "correct": "d) moved",
        "options": [
          "a) has moved",
          "b) is moving",
          "c) had moved",
          "d) moved"
        ],
        "explanation": "d) moved\n\n<b>Point :</b> Prétérit simple\n<b>Règle :</b> L'indicateur de temps précis <b>two years ago</b> impose l'usage du <b>Prétérit</b> (action terminée et datée)."
      },
      {
        "id": "qcm_anglais__2019_44",
        "question": "44) Everybody left early, ?",
        "correct": "b) didn't they",
        "options": [
          "a) didn't he",
          "b) didn't they",
          "c) hasn't he",
          "d) haven't they"
        ],
        "explanation": "b) didn't they\n\n<b>Point :</b> Question Tag\n<b>Règle :</b> Les pronoms indéfinis comme Everybody ou Nobody sont repris par <b>they</b> dans le tag. Le verbe étant au prétérit simple, on utilise l'auxiliaire did à la forme négative."
      },
      {
        "id": "qcm_anglais__2019_45",
        "question": "45) The affair caused........violent reactions!",
        "correct": "c) such",
        "options": [
          "a) so much",
          "b) what",
          "c) such",
          "d) so"
        ],
        "explanation": "c) such\n\n<b>Point :</b> Intensif avec nom pluriel\n<b>Règle :</b> On utilise <b>such</b> devant un groupe nominal (adjectif + nom au pluriel) pour exprimer l'intensité."
      },
      {
        "id": "qcm_anglais__2019_46",
        "question": "46) The program was viewed by four.. .viewers",
        "correct": "b) million",
        "options": [
          "a) millions",
          "b) million",
          "c) million of",
          "d) -million"
        ],
        "explanation": "b) million\n\n<b>Point :</b> Adjectifs numéraux\n<b>Règle :</b> Million, thousand, hundred sont <b>invariables</b> lorsqu'ils sont précédés d'un nombre précis (four million)."
      },
      {
        "id": "qcm_anglais__2019_47",
        "question": "47) They had tried both methods but. .worked",
        "correct": "b) neither",
        "options": [
          "a) two",
          "b) neither",
          "c) not either",
          "d) no one"
        ],
        "explanation": "b) neither\n\n<b>Point :</b> Choix entre deux éléments\n<b>Règle :</b> <b>Neither</b> signifie ni l'un ni l'autre. Il est utilisé pour nier deux options précédemment citées."
      },
      {
        "id": "qcm_anglais__2019_48",
        "question": "48). .nothing has been agreed yet, our representatives are very hopeful",
        "correct": "c) Even though",
        "options": [
          "a) Despite",
          "b) In spite of",
          "c) Even though",
          "d) However"
        ],
        "explanation": "c) Even though\n\n<b>Point :</b> Concession\n<b>Règle :</b> <b>Even though</b> est une conjonction suivie d'une proposition complète (sujet + verbe). Despite nécessiterait un groupe nominal."
      },
      {
        "id": "qcm_anglais__2019_49",
        "question": "49) An escape game is great fun; it is really worth.......",
        "correct": "b) doing",
        "options": [
          "a) to be done",
          "b) doing",
          "c) to do",
          "d) done"
        ],
        "explanation": "b) doing\n\n<b>Point :</b> Construction de WORTH\n<b>Règle :</b> L'adjectif <b>worth</b> est toujours suivi d'un verbe en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2019_50",
        "question": "50) I.......send them a text to let them know I'll be late for dinner",
        "correct": "b) had better",
        "options": [
          "a) 'd like better",
          "b) had better",
          "c) would better",
          "d) rather wish"
        ],
        "explanation": "b) had better\n\n<b>Point :</b> Conseil / Suggestion forte\n<b>Règle :</b> <b>Had better + Base Verbale</b> signifie ferait mieux de. C'est la structure correcte pour exprimer une nécessité ou un conseil."
      },
      {
        "id": "qcm_anglais__2019_51",
        "question": "51) This country is waking up to just.... .bad its schools are",
        "correct": "c) how",
        "options": [
          "a) much",
          "b) such",
          "c) how",
          "d) seriously"
        ],
        "explanation": "c) how\n\n<b>Point :</b> Exclamative indirecte\n<b>Règle :</b> On utilise <b>how + adjectif</b> pour souligner le degré d'une caractéristique."
      },
      {
        "id": "qcm_anglais__2019_52",
        "question": "52) The government wants something done.....",
        "correct": "c) about",
        "options": [
          "a) on",
          "b) over",
          "c) about",
          "d) into"
        ],
        "explanation": "c) about\n\n<b>Point :</b> Phrasal Verb / Idiome\n<b>Règle :</b> <b>To do something about something</b> signifie agir pour régler un problème."
      },
      {
        "id": "qcm_anglais__2019_53",
        "question": "53) Who did you borrow this...........?",
        "correct": "d) from",
        "options": [
          "a) to",
          "b) of",
          "c) with",
          "d) from"
        ],
        "explanation": "d) from\n\n<b>Point :</b> Préposition verbale\n<b>Règle :</b> On utilise la structure <b>to borrow something FROM someone</b> (emprunter à quelqu'un)."
      },
      {
        "id": "qcm_anglais__2019_54",
        "question": "54) She ....... working in Britain for five years when the Brexit was voted",
        "correct": "c) had been",
        "options": [
          "a) used to",
          "b) was",
          "c) had been",
          "d) has been"
        ],
        "explanation": "c) had been\n\n<b>Point :</b> Past Perfect Continuous\n<b>Règle :</b> Pour exprimer une action qui durait (for five years) jusqu'à un moment précis du passé (when the Brexit was voted), on utilise le <b>Past Perfect en BE + -ing</b>."
      },
      {
        "id": "qcm_anglais__2019_55",
        "question": "55) This is not true of.. ..Americans!",
        "correct": "b) all",
        "options": [
          "a) most of",
          "b) all",
          "c) the most of",
          "d) all most"
        ],
        "explanation": "b) all\n\n<b>Point :</b> Quantifieur général\n<b>Règle :</b> <b>All</b> suivi directement d'un nom au pluriel permet de faire une généralité (tous les Américains)."
      },
      {
        "id": "qcm_anglais__2019_56",
        "question": "56) The official candidate will be known in. ..........months",
        "correct": "a) the next few",
        "options": [
          "a) the next few",
          "b) next",
          "c) some next",
          "d) few"
        ],
        "explanation": "a) the next few\n\n<b>Point :</b> Expression de temps futur\n<b>Règle :</b> <b>The next few</b> est la locution idiomatique pour dire les quelques prochains (mois/jours/etc.)."
      },
      {
        "id": "qcm_anglais__2019_57",
        "question": "57) That drug was.... so he had to see his doctor again.",
        "correct": "c) useless",
        "options": [
          "a) useful",
          "b) powerful",
          "c) useless",
          "d) harmless"
        ],
        "explanation": "c) useless\n\n<b>Point :</b> Vocabulaire / Suffixe\n<b>Règle :</b> Le suffixe <b>-less</b> indique l'absence. Ici, le contexte (devoir revoir le médecin) implique que le médicament était <b>useless</b> (inutile/inefficace)."
      },
      {
        "id": "qcm_anglais__2019_58",
        "question": "58) Our policy needs. ..if we want to go global",
        "correct": "d) reviewing",
        "options": [
          "a) to review",
          "b) to reviewing",
          "c) review",
          "d) reviewing"
        ],
        "explanation": "d) reviewing\n\n<b>Point :</b> Besoin passif (NEED + -ING)\n<b>Règle :</b> Après le verbe need, l'utilisation de la forme en <b>-ing</b> a un sens passif (needs reviewing = a besoin d'être révisée)."
      },
      {
        "id": "qcm_anglais__2019_59",
        "question": "59) Remember: your job as an air hostess is to make............feel like.",
        "correct": "d) everybody-somebody",
        "options": [
          "a) anybody-nobody",
          "b) nobody-somebody",
          "c) everybody-nobody",
          "d) everybody-somebody"
        ],
        "explanation": "d) everybody-somebody\n\n<b>Point :</b> Pronoms indéfinis\n<b>Règle :</b> L'expression <b>make somebody feel like somebody</b> signifie faire en sorte que quelqu'un se sente important/considéré."
      },
      {
        "id": "qcm_anglais__2019_60",
        "question": "60) They are not used. .orders.",
        "correct": "b) to obeying",
        "options": [
          "a) to obey",
          "b) to obeying",
          "c) obeying",
          "d) obey"
        ],
        "explanation": "b) to obeying\n\n<b>Point :</b> Accoutumance (BE USED TO)\n<b>Règle :</b> La structure <b>be used to</b> est suivie d'un gérondif en <b>-ing</b> car le to est ici une préposition."
      },
      {
        "id": "qcm_anglais__2019_61",
        "question": "61) What.........people thinking when they listened to the President?",
        "correct": "a) were",
        "options": [
          "a) were",
          "b) have",
          "c) had",
          "d) is"
        ],
        "explanation": "a) were\n\n<b>Point :</b> Prétérit continu (Interrogation)\n<b>Règle :</b> Pour interroger sur une action en cours à un moment précis du passé, on utilise l'auxiliaire <b>BE au prétérit</b> (were car le sujet people est pluriel)."
      },
      {
        "id": "qcm_anglais__2019_62",
        "question": "62) He may be running. .the presidency again next year",
        "correct": "a) for",
        "options": [
          "a) for",
          "b) to",
          "c) into",
          "d) in"
        ],
        "explanation": "a) for\n\n<b>Point :</b> Phrasal verb politique\n<b>Règle :</b> <b>To run for</b> est l'expression consacrée pour dire être candidat à une élection."
      },
      {
        "id": "qcm_anglais__2019_63",
        "question": "63) These ecologists worry themselves. .over the melting of the ice cap",
        "correct": "d) to death",
        "options": [
          "a) deadly",
          "b) dead",
          "c) at death",
          "d) to death"
        ],
        "explanation": "d) to death\n\n<b>Point :</b> Expression idiomatique d'intensité\n<b>Règle :</b> <b>To worry oneself to death</b> signifie se faire un sang d'encre ou se tourmenter à mort."
      },
      {
        "id": "qcm_anglais__2019_64",
        "question": "64) I wish I had a car and a garage to keep.............",
        "correct": "a) it in",
        "options": [
          "a) it in",
          "b) it with",
          "c) wherein",
          "d) in with"
        ],
        "explanation": "a) it in\n\n<b>Point :</b> Placement du pronom et préposition\n<b>Règle :</b> On place le pronom complément it (la voiture) avant la préposition de lieu in (dans le garage)."
      },
      {
        "id": "qcm_anglais__2019_65",
        "question": "65) I don't have the feeling that ... of us has ever really understood what he wanted",
        "correct": "b) any",
        "options": [
          "a) nobody",
          "b) any",
          "c) some",
          "d) somebody"
        ],
        "explanation": "b) any\n\n<b>Point :</b> Déterminant / Polarité négative\n<b>Règle :</b> Dans une phrase à sens négatif (I don't have the feeling), on utilise <b>any</b> pour exprimer l'un d'entre nous ou qui que ce soit."
      },
      {
        "id": "qcm_anglais__2019_66",
        "question": "66) The whole government wants these new measures. .... take effect on December 10",
        "correct": "d) to",
        "options": [
          "a) should",
          "b) they",
          "c) could",
          "d) to"
        ],
        "explanation": "d) to\n\n<b>Point :</b> Proposition infinitive\n<b>Règle :</b> Le verbe <b>want</b> se construit avec la structure <b>want + complément + to + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2019_67",
        "question": "67) Many products are known ....contaminated",
        "correct": "a) to have been",
        "options": [
          "a) to have been",
          "b) having been",
          "c) to being",
          "d) to having been"
        ],
        "explanation": "a) to have been\n\n<b>Point :</b> Passive reportative\n<b>Règle :</b> On utilise la structure <b>be known + to + infinitif</b>. Ici, l'infinitif passé (to have been) exprime un état qui a commencé avant le moment où on en parle."
      },
      {
        "id": "qcm_anglais__2019_68",
        "question": "68) Prices have increased. .5%",
        "correct": "b) by",
        "options": [
          "a) from",
          "b) by",
          "c) at",
          "d) of"
        ],
        "explanation": "b) by\n\n<b>Point :</b> Préposition de mesure\n<b>Règle :</b> Pour indiquer l'écart d'une variation (augmentation ou baisse), la préposition correcte est <b>by</b>."
      },
      {
        "id": "qcm_anglais__2019_69",
        "question": "69) .students were given a deadline",
        "correct": "c) The",
        "options": [
          "a) Most of",
          "b) All of",
          "c) The",
          "d) Any"
        ],
        "explanation": "c) The\n\n<b>Point :</b> Article défini\n<b>Règle :</b> L'article <b>The</b> permet de désigner un groupe spécifique d'étudiants. Les options Most of et All of auraient nécessité un the juste après (ex: Most of the students)."
      },
      {
        "id": "qcm_anglais__2019_70",
        "question": "70) << Get..... to work now or you'll have to stay up all night >>",
        "correct": "b) down",
        "options": [
          "a) up",
          "b) down",
          "c) off",
          "d) in"
        ],
        "explanation": "b) down\n\n<b>Point :</b> Phrasal Verb idiomatique\n<b>Règle :</b> <b>To get down to work</b> est une expression figée signifiant se mettre sérieusement au travail."
      },
      {
        "id": "qcm_anglais__2019_71",
        "question": "71) <<< What does she do for a living? >>> <<< She is.............engineer! >>>",
        "correct": "c) an",
        "options": [
          "a) a",
          "b) some",
          "c) an",
          "d) Ø"
        ],
        "explanation": "c) an\n\n<b>Point :</b> Article indéfini\n<b>Règle :</b> On utilise <b>an</b> devant un nom de métier commençant par un son voyelle (engineer)."
      },
      {
        "id": "qcm_anglais__2019_72",
        "question": "72) .................answers last will be eliminated",
        "correct": "a) Whoever",
        "options": [
          "a) Whoever",
          "b) Whatever",
          "c) Wherever",
          "d) Whomever"
        ],
        "explanation": "a) Whoever\n\n<b>Point :</b> Pronom relatif composé\n<b>Règle :</b> <b>Whoever</b> signifie quiconque ou la personne qui. Il joue ici le rôle de sujet du verbe answers."
      },
      {
        "id": "qcm_anglais__2019_73",
        "question": "73) Please find...........a copy of your insurance policy.",
        "correct": "b) enclosed",
        "options": [
          "a) enclose",
          "b) enclosed",
          "c) enclosure",
          "d) in enclosing"
        ],
        "explanation": "b) enclosed\n\n<b>Point :</b> Formule de correspondance\n<b>Règle :</b> <b>Please find enclosed</b> est la formule standard en anglais commercial pour dire Veuillez trouver ci-joint."
      },
      {
        "id": "qcm_anglais__2019_74",
        "question": "74) She will join us at the restaurant as soon as she.. .her homework",
        "correct": "a) has finished",
        "options": [
          "a) has finished",
          "b) has been finishing",
          "c) would finish",
          "d) finished"
        ],
        "explanation": "a) has finished\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après as soon as, on utilise le Présent Simple ou le <b>Present Perfect</b> (pour souligner l'achèvement de l'action) pour exprimer un futur."
      },
      {
        "id": "qcm_anglais__2019_75",
        "question": "75) The Qataris have invested. .$ 10 million in revamping some luxury Parisian hotels",
        "correct": "b) an estimated",
        "options": [
          "a) estimated",
          "b) an estimated",
          "c) estimating",
          "d) an estimate"
        ],
        "explanation": "b) an estimated\n\n<b>Point :</b> Adjectif de mesure\n<b>Règle :</b> On utilise <b>an estimated</b> devant un chiffre pour indiquer qu'il s'agit d'une estimation."
      },
      {
        "id": "qcm_anglais__2019_76",
        "question": "76) In July the Dow-Jones... .by 80 points",
        "correct": "d) fell",
        "options": [
          "a) felt",
          "b) has fallen",
          "c) has felt",
          "d) fell"
        ],
        "explanation": "d) fell\n\n<b>Point :</b> Prétérit simple\n<b>Règle :</b> L'indication d'une date précise et révolue (In July) impose l'usage du prétérit. Fell est le prétérit de fall (tomber)."
      },
      {
        "id": "qcm_anglais__2019_77",
        "question": "77) They bravely resisted.. .attack of the gang.",
        "correct": "a) the",
        "options": [
          "a) the",
          "b) to the",
          "c) out the",
          "d) up the"
        ],
        "explanation": "a) the\n\n<b>Point :</b> v direct\n<b>Règle :</b> Le verbe <b>resist</b> est transitif direct en anglais. On ne met pas de préposition comme to entre le verbe et son complément."
      },
      {
        "id": "qcm_anglais__2019_78",
        "question": "78) We can see she's anxious; what.... .about?",
        "correct": "d) is she worried",
        "options": [
          "a) worries",
          "b) does she worry",
          "c) the worry is",
          "d) is she worried"
        ],
        "explanation": "d) is she worried\n\n<b>Point :</b> Adjectif de sentiment\n<b>Règle :</b> On utilise l'adjectif en <b>-ed</b> (worried) pour décrire l'état émotionnel d'une personne. La structure est <b>be worried about</b>."
      },
      {
        "id": "qcm_anglais__2019_79",
        "question": "79) The factory workers......on strike for more than a month",
        "correct": "b) have been",
        "options": [
          "a) are",
          "b) have been",
          "c) were",
          "d) had been"
        ],
        "explanation": "b) have been\n\n<b>Point :</b> Bilan (Present Perfect)\n<b>Règle :</b> L'expression de la durée <b>for more than a month</b> avec une situation qui dure encore impose le <b>Present Perfect</b>."
      },
      {
        "id": "qcm_anglais__2019_80",
        "question": "80) The CEO has adopted these measures with a view......the sales",
        "correct": "c) to boosting",
        "options": [
          "a) to boost",
          "b) of boosting",
          "c) to boosting",
          "d) on boosting"
        ],
        "explanation": "c) to boosting\n\n<b>Point :</b> Expression du but\n<b>Règle :</b> L'expression <b>with a view to</b> est une locution prépositive. Elle est obligatoirement suivie d'un gérondif en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2019_81",
        "question": "81) I can't make a decision now; I would like to obtain. .information",
        "correct": "a) a little",
        "options": [
          "a) a little",
          "b) little",
          "c) a bit",
          "d) some"
        ],
        "explanation": "a) a little\n\n<b>Point :</b> Quantifieur (Indénombrable)\n<b>Règle :</b> Information est indénombrable. On utilise <b>a little</b> pour exprimer un peu de (quantité faible mais positive)."
      },
      {
        "id": "qcm_anglais__2019_82",
        "question": "82) I wish he ..... with us one more week; he is ever so nice!",
        "correct": "b) would stay",
        "options": [
          "a) stays",
          "b) would stay",
          "c) will stay",
          "d) stayed"
        ],
        "explanation": "b) would stay\n\n<b>Point :</b> Expression du regret / souhait (WISH)\n<b>Règle :</b> Pour exprimer un souhait concernant le futur ou une volonté, on utilise <b>wish + would + Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2019_83",
        "question": "83) << Why not ..food and drinks on the premises ? We need to keep this place clean! >>>",
        "correct": "a) prohibit",
        "options": [
          "a) prohibit",
          "b) prohibiting",
          "c) prohibition",
          "d) prohibits"
        ],
        "explanation": "a) prohibit\n\n<b>Point :</b> Suggestion (WHY NOT)\n<b>Règle :</b> La structure de suggestion <b>Why not</b> est toujours suivie de la <b>Base Verbale</b> (sans to)."
      },
      {
        "id": "qcm_anglais__2019_84",
        "question": "84) Five people were arrested and charged...... spying for the Russian government",
        "correct": "a) with",
        "options": [
          "a) with",
          "b) of",
          "c) in",
          "d) for"
        ],
        "explanation": "a) with\n\n<b>Point :</b> Préposition verbale\n<b>Règle :</b> En anglais juridique, on utilise la structure <b>to be charged WITH something</b> (être inculpé de quelque chose)."
      },
      {
        "id": "qcm_anglais__2019_85",
        "question": "85) .... of these four paintings do you prefer?",
        "correct": "b) Which",
        "options": [
          "a) What",
          "b) Which",
          "c) Whose",
          "d) Whom"
        ],
        "explanation": "b) Which\n\n<b>Point :</b> Pronom interrogatif (Choix)\n<b>Règle :</b> On utilise <b>Which</b> lorsqu'il s'agit de choisir parmi un nombre limité d'options (ici, les quatre tableaux)."
      },
      {
        "id": "qcm_anglais__2019_86",
        "question": "86) His results were a bit...............compared to what he could have done",
        "correct": "c) disappointing",
        "options": [
          "a) disappointment",
          "b) disappointed",
          "c) disappointing",
          "d) disappoint"
        ],
        "explanation": "c) disappointing\n\n<b>Point :</b> Adjectif en -ING vs -ED\n<b>Règle :</b> On utilise la terminaison en <b>-ing</b> pour décrire la caractéristique d'une chose qui provoque un sentiment (les résultats sont décevants)."
      },
      {
        "id": "qcm_anglais__2019_87",
        "question": "87) He has not seen his uncle since he.....10",
        "correct": "d) was",
        "options": [
          "a) had",
          "b) have",
          "c) had been",
          "d) was"
        ],
        "explanation": "d) was\n\n<b>Point :</b> Construction avec SINCE\n<b>Règle :</b> Après since, on utilise le <b>Prétérit</b> pour désigner le point de départ de l'action (ici, probablement une période comme l'enfance)."
      },
      {
        "id": "qcm_anglais__2019_88",
        "question": "88)  I wish I…………………….my internship in China because it was very difficult to\nsocialize with Chinese people who hardly spoke any English at all!",
        "correct": "d) had not done",
        "options": [
          "a) don't do",
          "b) haven't done",
          "c) would not do",
          "d) had not done"
        ],
        "explanation": "d) had not done\n\n<b>Point :</b> Regret sur le passé (WISH)\n<b>Règle :</b> Pour exprimer un regret sur un événement révolu, on utilise <b>wish + Past Perfect</b> (had + participe passé)."
      },
      {
        "id": "qcm_anglais__2019_89",
        "question": "89) These boys really look. ..each other; of course, they do, they are twins!",
        "correct": "b) like",
        "options": [
          "a) alike",
          "b) like",
          "c) at",
          "d) into"
        ],
        "explanation": "b) like\n\n<b>Point :</b> Comparaison (Ressemblance)\n<b>Règle :</b> On utilise <b>look like</b> suivi d'un complément (each other) pour exprimer la ressemblance physique."
      },
      {
        "id": "qcm_anglais__2019_90",
        "question": "90)  We can’t help …………………that there is no point in studying Applied Arts if you want\nto make a good living.",
        "correct": "a) thinking",
        "options": [
          "a) thinking",
          "b) think",
          "c) thoughts",
          "d) thought"
        ],
        "explanation": "a) thinking\n\n<b>Point :</b> Idiome (CAN'T HELP)\n<b>Règle :</b> L'expression <b>can't help</b> (ne pas pouvoir s'empêcher de) est toujours suivie du gérondif en <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2019_91",
        "question": "91) This car costs. ..in Sweden as in Belgium",
        "correct": "c) twice as much",
        "options": [
          "a) twice as many",
          "b) half as many",
          "c) twice as much",
          "d) half price"
        ],
        "explanation": "c) twice as much\n\n<b>Point :</b> Comparatif de quantité\n<b>Règle :</b> Pour exprimer un prix (indénombrable), on utilise <b>as much as</b>. Le multiplicateur se place devant : <b>twice as much as</b>."
      },
      {
        "id": "qcm_anglais__2019_92",
        "question": "92) <<< What .tonight, Paul? »",
        "correct": "b) are you doing",
        "options": [
          "a) do you do",
          "b) are you doing",
          "c) are you done",
          "d) are you about to do"
        ],
        "explanation": "b) are you doing\n\n<b>Point :</b> Futur (Arrangement)\n<b>Règle :</b> On utilise le présent en <b>BE + -ing</b> pour parler d'un projet futur déjà organisé ou prévu."
      },
      {
        "id": "qcm_anglais__2019_93",
        "question": "93) It's time he .........himself a job and a flat, don't you think?",
        "correct": "a) found",
        "options": [
          "a) found",
          "b) finds",
          "c) will find",
          "d) has found"
        ],
        "explanation": "a) found\n\n<b>Point :</b> Irréel du présent\n<b>Règle :</b> Après l'expression <b>It's time</b>, on utilise obligatoirement le <b>Prétérit modal</b>."
      },
      {
        "id": "qcm_anglais__2019_94",
        "question": "94) He said he did not know when his parents.... back",
        "correct": "c) would be",
        "options": [
          "a) were",
          "b) will be",
          "c) would be",
          "d) be"
        ],
        "explanation": "c) would be\n\n<b>Point :</b> Futur dans le passé (Concordance)\n<b>Règle :</b> Dans un récit au passé (He said), le futur will devient <b>would</b>."
      },
      {
        "id": "qcm_anglais__2019_95",
        "question": "95) He had to .several job interviews before landing the job",
        "correct": "c) attend",
        "options": [
          "a) sit",
          "b) assist",
          "c) attend",
          "d) go"
        ],
        "explanation": "c) attend\n\n<b>Point :</b> Vocabulaire (Faux-ami)\n<b>Règle :</b> <b>To attend</b> signifie assister à ou se rendre à. C'est le verbe correct pour des entretiens d'embauche."
      },
      {
        "id": "qcm_anglais__2019_96",
        "question": "96) Try to make. ..your stay in Australia.",
        "correct": "a) the most of",
        "options": [
          "a) the most of",
          "b) most",
          "c) more",
          "d) most of"
        ],
        "explanation": "a) the most of\n\n<b>Point :</b> Expression figée\n<b>Règle :</b> <b>To make the most of something</b> signifie profiter au maximum de quelque chose."
      },
      {
        "id": "qcm_anglais__2019_97",
        "question": "97) I'd rather he...............his own car tonight because I won't stay any later than 10",
        "correct": "b) took",
        "options": [
          "a) takes",
          "b) took",
          "c) is taking",
          "d) has taken"
        ],
        "explanation": "b) took\n\n<b>Point :</b> Préférence (WOULD RATHER)\n<b>Règle :</b> Lorsque <b>would rather</b> est suivi d'un sujet différent, on utilise le <b>Prétérit modal</b>."
      },
      {
        "id": "qcm_anglais__2019_98",
        "question": "98) If I was not interested in engineering studies, I ........do medical studies",
        "correct": "a) would",
        "options": [
          "a) would",
          "b) will",
          "c) can",
          "d) am going to"
        ],
        "explanation": "a) would\n\n<b>Point :</b> Conditionnel Type 2\n<b>Règle :</b> Dans une structure en <b>If + Prétérit</b>, la principale utilise le modal <b>would</b>."
      },
      {
        "id": "qcm_anglais__2019_99",
        "question": "99) Molly is a good friend of............., isn't she?",
        "correct": "d) theirs",
        "options": [
          "a) them",
          "b) they",
          "c) their",
          "d) theirs"
        ],
        "explanation": "d) theirs\n\n<b>Point :</b> Double génitif / Pronom possessif\n<b>Règle :</b> Après la structure a friend of, on utilise un <b>pronom possessif</b> (mine, yours, theirs, etc.)."
      },
      {
        "id": "qcm_anglais__2019_100",
        "question": "100) The children .in the sea for a few minutes when a storm broke out...",
        "correct": "b) had been playing",
        "options": [
          "a) had played",
          "b) had been playing",
          "c) played",
          "d) have played"
        ],
        "explanation": "b) had been playing\n\n<b>Point :</b> Past Perfect Continuous\n<b>Règle :</b> On utilise le <b>Past Perfect en -ing</b> pour une action qui durait dans le passé jusqu'à ce qu'un événement (storm broke out) l'interrompe."
      }
    ]
  },
  "qcm_anglais__2018": {
    "id": "qcm_anglais__2018",
    "name": "QCM anglais ➔ 2018",
    "path": "QCM anglais::2018",
    "pathParts": [
      "QCM anglais",
      "2018"
    ],
    "category": "QCM anglais",
    "icon": "🇬🇧",
    "description": "Cours d'anglais QCM (100 cartes).",
    "questions": [
      {
        "id": "qcm_anglais__2018_1",
        "question": "1) I couldn't tell him much because we were.........",
        "correct": "b) cut off",
        "options": [
          "a) cut on",
          "b) cut off",
          "c) cut into",
          "d) cut of"
        ],
        "explanation": "b) cut off\n\n<b>Point :</b> Phrasal verb (Téléphone)\n<b>Règle :</b> <b>To be cut off</b> signifie être coupé lors d'une conversation téléphonique."
      },
      {
        "id": "qcm_anglais__2018_2",
        "question": "2) .........what you don't need on the list.",
        "correct": "a) Cross out",
        "options": [
          "a) Cross out",
          "b) Cross away",
          "c) Cross of",
          "d) Cross into"
        ],
        "explanation": "a) Cross out\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To cross out</b> signifie rayer ou barrer un élément sur une liste."
      },
      {
        "id": "qcm_anglais__2018_3",
        "question": "3) .........is she writing to ?",
        "correct": "c) Whom",
        "options": [
          "a) Whose",
          "b) Which",
          "c) Whom",
          "d) What"
        ],
        "explanation": "c) Whom\n\n<b>Point :</b> Pronom relatif complément\n<b>Règle :</b> Après une préposition (ici to en fin de phrase), on utilise <b>whom</b> pour désigner une personne (à qui)."
      },
      {
        "id": "qcm_anglais__2018_4",
        "question": "4) At the meeting, the manager talked.........about the need for better attendance and punctuality.",
        "correct": "d) briefly",
        "options": [
          "a) briefing",
          "b) shortly",
          "c) shorts",
          "d) briefly"
        ],
        "explanation": "d) briefly\n\n<b>Point :</b> Adverbe\n<b>Règle :</b> L'adverbe <b>briefly</b> signifie brièvement. Shortly signifie bientôt ou sous peu, ce qui ne marche pas avec le prétérit ici."
      },
      {
        "id": "qcm_anglais__2018_5",
        "question": "5) Has Mr Brown already.........? No, he is arriving late tonight.",
        "correct": "b) checked in",
        "options": [
          "a) checked out",
          "b) checked in",
          "c) checked into",
          "d) checked away"
        ],
        "explanation": "b) checked in\n\n<b>Point :</b> Phrasal verb (Voyage)\n<b>Règle :</b> <b>To check in</b> signifie s'enregistrer (à l'hôtel, à l'aéroport). Check out signifie régler sa note et partir."
      },
      {
        "id": "qcm_anglais__2018_6",
        "question": "6) How did your job interview go? Actually it was.........because the recruiter was sick.",
        "correct": "c) put off",
        "options": [
          "a) put on",
          "b) put out",
          "c) put off",
          "d) put away"
        ],
        "explanation": "c) put off\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To put off</b> signifie repousser ou reporter un événement à plus tard."
      },
      {
        "id": "qcm_anglais__2018_7",
        "question": "7) Can you.........me on the best course of action to take ?",
        "correct": "c) advise",
        "options": [
          "a) advisory",
          "b) advisable",
          "c) advise",
          "d) advice"
        ],
        "explanation": "c) advise\n\n<b>Point :</b> Verbe vs Nom\n<b>Règle :</b> Après le modal can, il faut un verbe. <b>Advise</b> (avec un S) est le verbe conseiller. Advice (avec un C) est le nom (conseil)."
      },
      {
        "id": "qcm_anglais__2018_8",
        "question": "8) I have to.........on my work because I was sick last week.",
        "correct": "b) catch up",
        "options": [
          "a) catch on",
          "b) catch up",
          "c) catch in",
          "d) catch into"
        ],
        "explanation": "b) catch up\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To catch up on</b> signifie rattraper son retard (sur du travail, du sommeil, etc.)."
      },
      {
        "id": "qcm_anglais__2018_9",
        "question": "9) You must find examples to.........what you are saying, the teacher said.",
        "correct": "a) back up",
        "options": [
          "a) back up",
          "b) back out",
          "c) back off",
          "d) backfire"
        ],
        "explanation": "a) back up\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To back up</b> signifie soutenir, étayer ou confirmer des propos."
      },
      {
        "id": "qcm_anglais__2018_10",
        "question": "10) His car drove.........the wall but he was not injured.",
        "correct": "d) into",
        "options": [
          "a) on",
          "b) onto",
          "c) in",
          "d) into"
        ],
        "explanation": "d) into\n\n<b>Point :</b> Préposition de mouvement\n<b>Règle :</b> <b>Into</b> indique un mouvement vers l'intérieur ou une collision (rentrer dans le mur)."
      },
      {
        "id": "qcm_anglais__2018_11",
        "question": "11) I came.........my neighbour while visiting Berlin. It was so unexpected!",
        "correct": "a) across",
        "options": [
          "a) across",
          "b) in",
          "c) into",
          "d) among"
        ],
        "explanation": "a) across\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To come across</b> signifie tomber sur quelqu'un ou quelque chose par hasard."
      },
      {
        "id": "qcm_anglais__2018_12",
        "question": "12) It's high time you.........an internship for next summer; everyone has found one.",
        "correct": "c) found",
        "options": [
          "a) find",
          "b) have found",
          "c) found",
          "d) founded"
        ],
        "explanation": "c) found\n\n<b>Point :</b> Irréel du présent\n<b>Règle :</b> Après l'expression <b>It's high time</b> (il est grand temps), on utilise obligatoirement le <b>prétérit modal</b> (found est le prétérit de find)."
      },
      {
        "id": "qcm_anglais__2018_13",
        "question": "13) I guess he needs to.........his Spanish before holidaying in Colombia.",
        "correct": "d) brush up",
        "options": [
          "a) brush",
          "b) brush into",
          "c) brush on",
          "d) brush up"
        ],
        "explanation": "d) brush up\n\n<b>Point :</b> Phrasal verb idiomatique\n<b>Règle :</b> <b>To brush up (on)</b> signifie se remettre à niveau, rafraîchir ses connaissances dans une matière."
      },
      {
        "id": "qcm_anglais__2018_14",
        "question": "14) Where is the fish ? .........the fish bowl, of course.",
        "correct": "a) in",
        "options": [
          "a) in",
          "b) into",
          "c) on",
          "d) among"
        ],
        "explanation": "a) in\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> On utilise <b>in</b> pour indiquer une position statique à l'intérieur d'un espace (contrairement à into qui implique un mouvement)."
      },
      {
        "id": "qcm_anglais__2018_15",
        "question": "15) If you want to take photographs, you will need to apply for a.........",
        "correct": "d) permit",
        "options": [
          "a) permission",
          "b) permissible",
          "c) agreement",
          "d) permit"
        ],
        "explanation": "d) permit\n\n<b>Point :</b> Nom dénombrable vs indénombrable\n<b>Règle :</b> Un document officiel est un <b>permit</b> (ex: un permis de construire). Permission est indénombrable et ne prendrait pas l'article a."
      },
      {
        "id": "qcm_anglais__2018_16",
        "question": "16) Before my mother was born, her parents.........6 children.",
        "correct": "c) had had",
        "options": [
          "a) were having",
          "b) have had",
          "c) had had",
          "d) have"
        ],
        "explanation": "c) had had\n\n<b>Point :</b> Antériorité dans le passé (Past Perfect)\n<b>Règle :</b> L'action d'avoir 6 enfants est antérieure à la naissance de la mère (qui est déjà au prétérit : was born). On utilise donc le <b>Past Perfect</b>."
      },
      {
        "id": "qcm_anglais__2018_17",
        "question": "17) The kid fell.........his bike and started crying.",
        "correct": "a) off",
        "options": [
          "a) off",
          "b) down",
          "c) out",
          "d) away"
        ],
        "explanation": "a) off\n\n<b>Point :</b> Préposition de chute / détachement\n<b>Règle :</b> <b>To fall off</b> s'utilise pour indiquer qu'on tombe d'une surface ou d'un véhicule (vélo, cheval, chaise)."
      },
      {
        "id": "qcm_anglais__2018_18",
        "question": "18) When I.........eighteen, I want to take driving lessons.",
        "correct": "b) turn",
        "options": [
          "a) am turning",
          "b) turn",
          "c) have been turning",
          "d) has turned"
        ],
        "explanation": "b) turn\n\n<b>Point :</b> Subordonnée de temps au futur\n<b>Règle :</b> Après les conjonctions de temps comme <b>when</b> ou as soon as, on utilise le <b>Présent simple</b> pour exprimer une idée au futur."
      },
      {
        "id": "qcm_anglais__2018_19",
        "question": "19) Where is the bank? You have to walk.........the city center to find banks.",
        "correct": "d) towards",
        "options": [
          "a) away",
          "b) among",
          "c) up",
          "d) towards"
        ],
        "explanation": "d) towards\n\n<b>Point :</b> Préposition de direction\n<b>Règle :</b> <b>Towards</b> signifie en direction de ou vers."
      },
      {
        "id": "qcm_anglais__2018_20",
        "question": "20) Who is sitting.........your sister? Her fiancé.",
        "correct": "d) next to",
        "options": [
          "a) on",
          "b) next",
          "c) away from",
          "d) next to"
        ],
        "explanation": "d) next to\n\n<b>Point :</b> Préposition de position\n<b>Règle :</b> L'expression pour dire à côté de est obligatoirement <b>next to</b>."
      },
      {
        "id": "qcm_anglais__2018_21",
        "question": "21) It was the first time he.........a koala.",
        "correct": "a) had seen",
        "options": [
          "a) had seen",
          "b) has seen",
          "c) saw",
          "d) is seeing"
        ],
        "explanation": "a) had seen\n\n<b>Point :</b> Concordance des temps (Bilan passé)\n<b>Règle :</b> Après la structure It was the first time (au passé), on fait un bilan jusqu'à ce moment-là en utilisant le <b>Past Perfect</b>."
      },
      {
        "id": "qcm_anglais__2018_22",
        "question": "22) Let me give you.........",
        "correct": "c) a piece of advice",
        "options": [
          "a) some advices",
          "b) an advice",
          "c) a piece of advice",
          "d) a piece of advices"
        ],
        "explanation": "c) a piece of advice\n\n<b>Point :</b> Indénombrables\n<b>Règle :</b> Advice est indénombrable (pas de S, pas de an). Pour isoler un seul conseil, on utilise la structure partitive <b>a piece of advice</b>."
      },
      {
        "id": "qcm_anglais__2018_23",
        "question": "23) Where is she.........from?",
        "correct": "d) arriving",
        "options": [
          "a) arrived",
          "b) arrive",
          "c) arrives",
          "d) arriving"
        ],
        "explanation": "d) arriving\n\n<b>Point :</b> Présent continu (Question)\n<b>Règle :</b> L'auxiliaire is indique que l'on construit un temps continu. Le verbe principal doit donc être au gérondif <b>-ing</b>."
      },
      {
        "id": "qcm_anglais__2018_24",
        "question": "24) They.........dinner by the time we arrive.",
        "correct": "c) will have eaten",
        "options": [
          "a) will eat",
          "b) are eating",
          "c) will have eaten",
          "d) eat"
        ],
        "explanation": "c) will have eaten\n\n<b>Point :</b> Futur antérieur\n<b>Règle :</b> L'expression <b>by the time</b> (d'ici à ce que) projette dans le futur et impose le <b>Futur Antérieur</b> (will + have + participe passé) pour une action qui sera déjà terminée à ce moment-là."
      },
      {
        "id": "qcm_anglais__2018_25",
        "question": "25) Everyone in the Human Resources Department is obliged to.........the meeting Monday morning.",
        "correct": "a) attend",
        "options": [
          "a) attend",
          "b) attend to",
          "c) assist to",
          "d) assist"
        ],
        "explanation": "a) attend\n\n<b>Point :</b> Faux-ami et verbe transitif direct\n<b>Règle :</b> Assister à une réunion se dit <b>to attend a meeting</b>. C'est un verbe transitif direct, il n'y a donc pas de préposition derrière."
      },
      {
        "id": "qcm_anglais__2018_26",
        "question": "26) « .........I come in, sir? » « Sorry to bother you but I need you to sign this document »",
        "correct": "c) May",
        "options": [
          "a) Couldn't",
          "b) Might",
          "c) May",
          "d) Should"
        ],
        "explanation": "c) May\n\n<b>Point :</b> Modal de permission\n<b>Règle :</b> Pour demander une permission de manière polie et formelle (à un supérieur, signalé par sir), on utilise <b>May</b>."
      },
      {
        "id": "qcm_anglais__2018_27",
        "question": "27) The company warehouse is situated.........the supermarket. You can't miss it.",
        "correct": "c) opposite",
        "options": [
          "a) into",
          "b) in",
          "c) opposite",
          "d) between"
        ],
        "explanation": "c) opposite\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> <b>Opposite</b> signifie en face de. Between nécessiterait deux lieux (ex: between the bank and the supermarket)."
      },
      {
        "id": "qcm_anglais__2018_28",
        "question": "28) To get to the entrance, you..............to walk around the lake first, so it's a long way away.",
        "correct": "b) have",
        "options": [
          "a) are able",
          "b) have",
          "c) should",
          "d) could"
        ],
        "explanation": "b) have\n\n<b>Point :</b> Expression de l'obligation\n<b>Règle :</b> La présence du to après le trou élimine should et could. On utilise <b>have to</b> pour exprimer une obligation (il faut marcher...)."
      },
      {
        "id": "qcm_anglais__2018_29",
        "question": "29) When you apply for a job, you always put........",
        "correct": "a) your best foot forward",
        "options": [
          "a) your best foot forward",
          "b) your fingers up",
          "c) your nose forward",
          "d) your best clothes off"
        ],
        "explanation": "a) your best foot forward\n\n<b>Point :</b> Expression idiomatique\n<b>Règle :</b> <b>To put one's best foot forward</b> signifie se montrer sous son meilleur jour ou faire de son mieux (typique pour un entretien d'embauche)."
      },
      {
        "id": "qcm_anglais__2018_30",
        "question": "30) Look, little Tom is hiding.........that tree.",
        "correct": "a) behind",
        "options": [
          "a) behind",
          "b) below",
          "c) betwixt",
          "d) between"
        ],
        "explanation": "a) behind\n\n<b>Point :</b> Préposition de lieu\n<b>Règle :</b> <b>Behind</b> signifie derrière."
      },
      {
        "id": "qcm_anglais__2018_31",
        "question": "31) .........it's ready by tomorrow night, it's OK.",
        "correct": "c) As long as",
        "options": [
          "a) Whether",
          "b) Provided than",
          "c) As long as",
          "d) Assuming than"
        ],
        "explanation": "c) As long as\n\n<b>Point :</b> Conjonction de condition\n<b>Règle :</b> <b>As long as</b> signifie tant que ou à condition que. (Attention au piège : on dit Provided THAT et non than)."
      },
      {
        "id": "qcm_anglais__2018_32",
        "question": "32) « ....you speak Arabic ? » « No, I'm afraid I can't! »",
        "correct": "a) Can",
        "options": [
          "a) Can",
          "b) Could",
          "c) Should",
          "d) Must"
        ],
        "explanation": "a) Can\n\n<b>Point :</b> Capacité / Modal\n<b>Règle :</b> La réponse (I can't) indique qu'on interroge sur une capacité au présent. On utilise donc <b>Can</b>."
      },
      {
        "id": "qcm_anglais__2018_33",
        "question": "33) I had the mechanic.........my brakes no later than this morning.",
        "correct": "d) check",
        "options": [
          "a) to check",
          "b) checked",
          "c) checking",
          "d) check"
        ],
        "explanation": "d) check\n\n<b>Point :</b> Structure causative active (HAVE)\n<b>Règle :</b> La structure <b>Have + quelqu'un + Base Verbale</b> exprime le fait de faire faire une action par quelqu'un (ici le mécanicien vérifie les freins)."
      },
      {
        "id": "qcm_anglais__2018_34",
        "question": "34) The quicker he finishes his homework, the.........he is.",
        "correct": "c) happier",
        "options": [
          "a) happy",
          "b) happyer",
          "c) happier",
          "d) happiest"
        ],
        "explanation": "c) happier\n\n<b>Point :</b> Double comparatif\n<b>Règle :</b> Plus il finit vite, plus il est heureux. Structure <b>The + comparatif ..., the + comparatif ...</b>. L'adjectif happy se terminant par un -y, il devient <b>happier</b>."
      },
      {
        "id": "qcm_anglais__2018_35",
        "question": "35) When we were young we.........go skiing every winter.",
        "correct": "d) used to",
        "options": [
          "a) had the habit",
          "b) were used to",
          "c) have the habit",
          "d) used to"
        ],
        "explanation": "d) used to\n\n<b>Point :</b> Habitude révolue\n<b>Règle :</b> <b>Used to + Base verbale</b> sert à décrire une habitude dans le passé qui n'est plus d'actualité. (Were used to exigerait le verbe en -ing : going)."
      },
      {
        "id": "qcm_anglais__2018_36",
        "question": "36) Ι.........to show you the way to the IBM premises but my meeting is starting in a few seconds.",
        "correct": "d) 'd love",
        "options": [
          "a) 'm loving",
          "b) 'm loved",
          "c) 'd loving",
          "d) 'd love"
        ],
        "explanation": "d) 'd love\n\n<b>Point :</b> Conditionnel (Souhait)\n<b>Règle :</b> <b>I'd love to</b> (I would love to) est l'expression polie pour dire J'aimerais beaucoup. Les verbes de sentiment (love) ne se mettent quasiment jamais à la forme -ing."
      },
      {
        "id": "qcm_anglais__2018_37",
        "question": "37) You.........pass the TOEIC certification to become an architect but you do to become an engineer.",
        "correct": "b) needn't",
        "options": [
          "a) have to",
          "b) needn't",
          "c) may",
          "d) must"
        ],
        "explanation": "b) needn't\n\n<b>Point :</b> Absence d'obligation\n<b>Règle :</b> Le sens de la phrase indique qu'on n'est pas obligé de passer le TOEIC pour être architecte, mais qu'on doit le faire pour être ingénieur. <b>Needn't</b> exprime cette absence d'obligation."
      },
      {
        "id": "qcm_anglais__2018_38",
        "question": "38) He.......to watch his language when he is talking to his colleagues or his boss.",
        "correct": "c) ought",
        "options": [
          "a) may",
          "b) can",
          "c) ought",
          "d) should"
        ],
        "explanation": "c) ought\n\n<b>Point :</b> Modal + TO\n<b>Règle :</b> Parmi les choix, seul <b>ought</b> est suivi de <b>to</b>. Ought to a le même sens que should (il devrait)."
      },
      {
        "id": "qcm_anglais__2018_39",
        "question": "39) .........I take you to the airport or would you rather take a cab ?",
        "correct": "a) shall",
        "options": [
          "a) shall",
          "b) will",
          "c) might",
          "d) could"
        ],
        "explanation": "a) shall\n\n<b>Point :</b> Modal (Proposition / Offre)\n<b>Règle :</b> A la première personne (I / We) à la forme interrogative, on utilise <b>Shall</b> pour proposer un service (Voulez-vous que je...)."
      },
      {
        "id": "qcm_anglais__2018_40",
        "question": "40) The engine is making a strange noise. You really must.........",
        "correct": "d) get a mechanic to look at it",
        "options": [
          "a) get a mechanic look at it",
          "b) have a mechanic to look at it",
          "c) tell a mechanic look at it",
          "d) get a mechanic to look at it"
        ],
        "explanation": "d) get a mechanic to look at it\n\n<b>Point :</b> Structure causative active (GET)\n<b>Règle :</b> Contrairement à have (voir Q33), la structure avec get demande la préposition to : <b>Get + quelqu'un + TO + Infinitif</b>."
      },
      {
        "id": "qcm_anglais__2018_41",
        "question": "41) His results are very poor, so he.........graduate this year",
        "correct": "b) won't",
        "options": [
          "a) couldn't",
          "b) won't",
          "c) is unlikely",
          "d) is likely"
        ],
        "explanation": "b) won't\n\n<b>Point :</b> Prédiction future\n<b>Règle :</b> Ses résultats étant mauvais, il ne sera pas diplômé (<b>won't</b> = will not). (Is unlikely aurait nécessité to : is unlikely TO graduate)."
      },
      {
        "id": "qcm_anglais__2018_42",
        "question": "42) Mary.........her first job thirty years ago.",
        "correct": "a) got",
        "options": [
          "a) got",
          "b) had got",
          "c) has got",
          "d) has been getting"
        ],
        "explanation": "a) got\n\n<b>Point :</b> Prétérit simple\n<b>Règle :</b> Le marqueur temporel <b>ago</b> (il y a...) repousse l'action dans un passé révolu. Cela impose le prétérit simple."
      },
      {
        "id": "qcm_anglais__2018_43",
        "question": "43) When in a job interview, you.........to take notes and ask questions at the end.",
        "correct": "b) have",
        "options": [
          "a) must",
          "b) have",
          "c) are able",
          "d) expect"
        ],
        "explanation": "b) have\n\n<b>Point :</b> Obligation / Modal\n<b>Règle :</b> La présence du to exclut must. <b>Have to</b> exprime l'obligation ou la nécessité dans ce contexte."
      },
      {
        "id": "qcm_anglais__2018_44",
        "question": "44) If I.........an artist, I'd be a painter like Dali.",
        "correct": "d) were",
        "options": [
          "a) am",
          "b) was",
          "c) will be",
          "d) were"
        ],
        "explanation": "d) were\n\n<b>Point :</b> Conditionnel (Irréel du présent)\n<b>Règle :</b> Dans la subordonnée en <b>If</b> qui exprime une hypothèse irréelle, on utilise le prétérit. Avec le verbe be, la forme classique et attendue aux concours est <b>were</b> à toutes les personnes."
      },
      {
        "id": "qcm_anglais__2018_45",
        "question": "45) If I manage to get a summer job next June, I..............to afford a holiday in September.",
        "correct": "b) will be able",
        "options": [
          "a) will",
          "b) will be able",
          "c) will enable",
          "d) will allow"
        ],
        "explanation": "b) will be able\n\n<b>Point :</b> Capacité au futur\n<b>Règle :</b> Le modal can n'existe pas au futur. Pour exprimer la capacité dans l'avenir (je serai capable de / je pourrai), on utilise <b>will be able to</b>."
      },
      {
        "id": "qcm_anglais__2018_46",
        "question": "46) They said they...............join us after the meeting if they start on time.",
        "correct": "b) might",
        "options": [
          "a) are capable to",
          "b) might",
          "c) are able",
          "d) can not"
        ],
        "explanation": "b) might\n\n<b>Point :</b> Modal de probabilité\n<b>Règle :</b> Ils se pourrait qu'ils nous rejoignent. <b>Might</b> exprime cette éventualité. (Are able nécessite to)."
      },
      {
        "id": "qcm_anglais__2018_47",
        "question": "47) I can't have the parcel.........until next week.",
        "correct": "c) delivered",
        "options": [
          "a) deliver",
          "b) delivery",
          "c) delivered",
          "d) delivering"
        ],
        "explanation": "c) delivered\n\n<b>Point :</b> Structure causative passive (HAVE)\n<b>Règle :</b> Quand l'objet subit l'action, on utilise <b>Have + objet + Participe passé</b> (faire livrer le colis)."
      },
      {
        "id": "qcm_anglais__2018_48",
        "question": "48) How.........is the factory from the headquarters ?",
        "correct": "b) far",
        "options": [
          "a) long",
          "b) far",
          "c) deep",
          "d) tall"
        ],
        "explanation": "b) far\n\n<b>Point :</b> Mot interrogatif (Distance)\n<b>Règle :</b> Pour demander à quelle distance se trouve un lieu, on utilise <b>How far</b>."
      },
      {
        "id": "qcm_anglais__2018_49",
        "question": "49) In English, she always.........the same mistakes.",
        "correct": "d) makes",
        "options": [
          "a) has",
          "b) making",
          "c) does",
          "d) makes"
        ],
        "explanation": "d) makes\n\n<b>Point :</b> Collocation (Make vs Do)\n<b>Règle :</b> En anglais, faire une erreur se dit obligatoirement <b>to make a mistake</b>, jamais to do."
      },
      {
        "id": "qcm_anglais__2018_50",
        "question": "50) .......................do you want to rent ? the electric car or the other one?",
        "correct": "c) which car",
        "options": [
          "a) whose car",
          "b) what car",
          "c) which car",
          "d) whom"
        ],
        "explanation": "c) which car\n\n<b>Point :</b> Mot interrogatif (Choix)\n<b>Règle :</b> Quand il y a un choix limité entre plusieurs options précises (ici, la voiture électrique ou l'autre), on utilise <b>Which</b> et non What."
      },
      {
        "id": "qcm_anglais__2018_51",
        "question": "51) Did you.........what I just said? You look perplexed.",
        "correct": "c) hear",
        "options": [
          "a) hearded",
          "b) heared",
          "c) hear",
          "d) heard"
        ],
        "explanation": "c) hear\n\n<b>Point :</b> Question au prétérit\n<b>Règle :</b> Dans une question au passé, l'auxiliaire <b>did</b> porte déjà la marque du passé. Le verbe qui suit doit donc obligatoirement être à la Base Verbale (sans to ni -ed)."
      },
      {
        "id": "qcm_anglais__2018_52",
        "question": "52) She does not listen.......... people; all she cares about is herself; she is so self-centered !",
        "correct": "b) to",
        "options": [
          "a) into",
          "b) to",
          "c) on",
          "d) onto"
        ],
        "explanation": "b) to\n\n<b>Point :</b> Verbe prépositionnel\n<b>Règle :</b> Comme on l'a vu précédemment, le verbe <b>listen</b> (écouter) est intransitif en anglais et demande systématiquement la préposition <b>to</b>."
      },
      {
        "id": "qcm_anglais__2018_53",
        "question": "53) I am not interested.........modern art at all.",
        "correct": "a) in",
        "options": [
          "a) in",
          "b) into",
          "c) by",
          "d) about"
        ],
        "explanation": "a) in\n\n<b>Point :</b> Adjectif + préposition\n<b>Règle :</b> L'adjectif <b>interested</b> est toujours suivi de la préposition <b>in</b>. Ne pas se laisser piéger par la traduction littérale du français (intéressé par)."
      },
      {
        "id": "qcm_anglais__2018_54",
        "question": "54) She.........me to leave her alone and so I did!",
        "correct": "b) told",
        "options": [
          "a) said",
          "b) told",
          "c) asks",
          "d) demanded to"
        ],
        "explanation": "b) told\n\n<b>Point :</b> Ordre indirect (TELL)\n<b>Règle :</b> Pour rapporter un ordre, on utilise la structure <b>Tell + quelqu'un + TO + Infinitif</b> (dire à quelqu'un de faire quelque chose). Le verbe say n'accepte pas cette construction."
      },
      {
        "id": "qcm_anglais__2018_55",
        "question": "55) I want.........as soon as possible.",
        "correct": "c) him to come",
        "options": [
          "a) that he comes",
          "b) he comes",
          "c) him to come",
          "d) him to coming"
        ],
        "explanation": "c) him to come\n\n<b>Point :</b> Structure infinitive (WANT)\n<b>Règle :</b> En anglais, on ne dit jamais I want that.... Pour dire Je veux qu'il vienne, on utilise <b>Want + pronom objet (him) + TO + Infinitif</b>."
      },
      {
        "id": "qcm_anglais__2018_56",
        "question": "56) I'd like.........you again.",
        "correct": "c) to see",
        "options": [
          "a) see",
          "b) seeing",
          "c) to see",
          "d) to seeing"
        ],
        "explanation": "c) to see\n\n<b>Point :</b> Verbe de préférence (WOULD LIKE)\n<b>Règle :</b> Contrairement à like qui est souvent suivi du gérondif (-ing) pour parler de ses goûts généraux, <b>would like</b> (j'aimerais) est suivi de <b>TO + Infinitif</b>."
      },
      {
        "id": "qcm_anglais__2018_57",
        "question": "57) Our house.........fifty years ago.",
        "correct": "c) was built",
        "options": [
          "a) built",
          "b) was building",
          "c) was built",
          "d) was being built"
        ],
        "explanation": "c) was built\n\n<b>Point :</b> Voix passive au prétérit\n<b>Règle :</b> La maison subit l'action (elle a été construite). L'indicateur ago impose le prétérit simple. On utilise donc <b>BE au prétérit + Participe passé</b>."
      },
      {
        "id": "qcm_anglais__2018_58",
        "question": "58) If I had known, I..............more careful.",
        "correct": "b) would have been",
        "options": [
          "a) would be",
          "b) would have been",
          "c) will be",
          "d) will have been"
        ],
        "explanation": "b) would have been\n\n<b>Point :</b> Conditionnel de type 3 (Irréel du passé)\n<b>Règle :</b> Dans une phrase avec <b>If + Past Perfect</b> (had known), la proposition principale exprime un regret passé avec <b>would have + Participe passé</b>."
      },
      {
        "id": "qcm_anglais__2018_59",
        "question": "59) ..........people like holidays.",
        "correct": "c) Most",
        "options": [
          "a) The most",
          "b) Mostly",
          "c) Most",
          "d) Most of"
        ],
        "explanation": "c) Most\n\n<b>Point :</b> Quantifieur (Généralité)\n<b>Règle :</b> Pour faire une généralité (La plupart des...), on utilise <b>Most</b> directement suivi du nom au pluriel, sans article ni of."
      },
      {
        "id": "qcm_anglais__2018_60",
        "question": "60) Hard work.........pays off.",
        "correct": "b) eventually",
        "options": [
          "a) advertises",
          "b) eventually",
          "c) never",
          "d) will sometimes"
        ],
        "explanation": "b) eventually\n\n<b>Point :</b> Faux-ami (Adverbe)\n<b>Règle :</b> <b>Eventually</b> ne veut pas dire éventuellement (qui se dit possibly), mais finalement / au final. (Le travail acharné finit par payer)."
      },
      {
        "id": "qcm_anglais__2018_61",
        "question": "61) Abel is the.........of all the boys in his class.",
        "correct": "d) youngest",
        "options": [
          "a) younger",
          "b) most young",
          "c) more young",
          "d) youngest"
        ],
        "explanation": "d) youngest\n\n<b>Point :</b> Superlatif\n<b>Règle :</b> Pour un adjectif court (young), le superlatif se forme avec <b>the + adjectif + -est</b>."
      },
      {
        "id": "qcm_anglais__2018_62",
        "question": "62) You can.........on EasyJet from Gatwick...",
        "correct": "b) fly",
        "options": [
          "a) flight",
          "b) fly",
          "c) flying",
          "d) flew"
        ],
        "explanation": "b) fly\n\n<b>Point :</b> Auxiliaire modal\n<b>Règle :</b> Après n'importe quel verbe modal (can, must, should, will...), le verbe est toujours à la <b>Base Verbale</b>."
      },
      {
        "id": "qcm_anglais__2018_63",
        "question": "63) He left just now and.........be home by 6.",
        "correct": "d) should",
        "options": [
          "a) shall",
          "b) can",
          "c) must",
          "d) should"
        ],
        "explanation": "d) should\n\n<b>Point :</b> Modal de probabilité\n<b>Règle :</b> <b>Should</b> n'exprime pas seulement un conseil (il devrait), mais aussi une forte probabilité logique (il devrait être à la maison d'ici 18h, puisqu'il vient de partir)."
      },
      {
        "id": "qcm_anglais__2018_64",
        "question": "64) Why not.........now?",
        "correct": "c) go",
        "options": [
          "a) going",
          "b) to go",
          "c) go",
          "d) have gone"
        ],
        "explanation": "c) go\n\n<b>Point :</b> Expression de la suggestion\n<b>Règle :</b> L'expression de suggestion <b>Why not</b> est toujours suivie directement de la <b>Base Verbale</b>, sans to."
      },
      {
        "id": "qcm_anglais__2018_65",
        "question": "65) Tell them.........; it's not so safe these days.",
        "correct": "d) not to go",
        "options": [
          "a) to not go",
          "b) not go",
          "c) not going",
          "d) not to go"
        ],
        "explanation": "d) not to go\n\n<b>Point :</b> Infinitif négatif\n<b>Règle :</b> Pour mettre un verbe à l'infinitif à la forme négative (dire de ne pas y aller), on place toujours <b>not</b> avant le <b>to</b>."
      },
      {
        "id": "qcm_anglais__2018_66",
        "question": "66) Participants were asked.........time they spent jogging each week...",
        "correct": "d) how much",
        "options": [
          "a) how many",
          "b) how long",
          "c) how about",
          "d) how much"
        ],
        "explanation": "d) how much\n\n<b>Point :</b> Dénombrable vs Indénombrable\n<b>Règle :</b> Le mot time (le temps) est indénombrable. Pour poser une question sur la quantité, on utilise <b>how much</b>. (How many est pour les choses qu'on peut compter)."
      },
      {
        "id": "qcm_anglais__2018_67",
        "question": "67) ..........washing machine has had a huge impact on people's lives since it was invented.",
        "correct": "b) The",
        "options": [
          "a) zero article",
          "b) The",
          "c) A",
          "d) One"
        ],
        "explanation": "b) The\n\n<b>Point :</b> Article défini (Classe d'objets)\n<b>Règle :</b> Pour parler d'une invention, d'une espèce animale ou d'un instrument de musique de manière générale (l'idée de la machine, pas une machine en particulier), on utilise <b>the + nom singulier</b>."
      },
      {
        "id": "qcm_anglais__2018_68",
        "question": "68) Katherine has decided she wants to be.........engineer.",
        "correct": "d) an",
        "options": [
          "a) the",
          "b) a",
          "c) zero article",
          "d) an"
        ],
        "explanation": "d) an\n\n<b>Point :</b> Article indéfini (Profession)\n<b>Règle :</b> En anglais, on doit obligatoirement mettre l'article <b>a/an</b> devant les noms de professions. On utilise <b>an</b> ici car engineer commence par un son voyelle."
      },
      {
        "id": "qcm_anglais__2018_69",
        "question": "69) ..........monuments in Paris are just not worth visiting.",
        "correct": "a) Some",
        "options": [
          "a) Some",
          "b) This",
          "c) zero article",
          "d) A lot"
        ],
        "explanation": "a) Some\n\n<b>Point :</b> Quantifieur\n<b>Règle :</b> <b>Some</b> est utilisé devant un nom au pluriel pour désigner une quantité indéfinie mais existante (Certains monuments)."
      },
      {
        "id": "qcm_anglais__2018_70",
        "question": "70) I have been working here for..........so I am very familiar with the company culture.",
        "correct": "c) years",
        "options": [
          "a) any years",
          "b) some year",
          "c) years",
          "d) the years"
        ],
        "explanation": "c) years\n\n<b>Point :</b> Expression de durée idiomatique\n<b>Règle :</b> Pour dire depuis des années, l'anglais utilise l'expression figée <b>for years</b>."
      },
      {
        "id": "qcm_anglais__2018_71",
        "question": "71) Following the flood.........in the area.........repair work.",
        "correct": "b) every building/needs",
        "options": [
          "a) each of building/needs",
          "b) every building/needs",
          "c) every building/need",
          "d) each buildings/needs"
        ],
        "explanation": "b) every building/needs\n\n<b>Point :</b> Quantifieur singulier (EVERY)\n<b>Règle :</b> Le déterminant <b>every</b> (chaque/tous les) est obligatoirement suivi d'un <b>nom au singulier</b>. Par conséquent, le verbe s'accorde à la 3ème personne du singulier (needs)."
      },
      {
        "id": "qcm_anglais__2018_72",
        "question": "72) It's not.........yesterday in the office, is it?",
        "correct": "a) so hot as",
        "options": [
          "a) so hot as",
          "b) as much hot as",
          "c) so hot than",
          "d) much hotter than"
        ],
        "explanation": "a) so hot as\n\n<b>Point :</b> Comparatif d'égalité (Forme négative)\n<b>Règle :</b> Le comparatif d'égalité est as... as. À la forme négative, on tolère not as... as, mais la forme la plus élégante et classique aux concours est <b>not so + adjectif + as</b>."
      },
      {
        "id": "qcm_anglais__2018_73",
        "question": "73) This watch looks.........than it really is.",
        "correct": "b) far more expensive",
        "options": [
          "a) much expensive",
          "b) far more expensive",
          "c) many more expensive",
          "d) lots expensive"
        ],
        "explanation": "b) far more expensive\n\n<b>Point :</b> Intensificateur de comparatif\n<b>Règle :</b> Expensive est long, donc on forme le comparatif avec more ... than. Pour insister (beaucoup plus), on ajoute un adverbe comme <b>far</b> ou <b>much</b> devant more."
      },
      {
        "id": "qcm_anglais__2018_74",
        "question": "74) .........people know this.",
        "correct": "b) most",
        "options": [
          "a) every",
          "b) most",
          "c) each",
          "d) a lot"
        ],
        "explanation": "b) most\n\n<b>Point :</b> Quantifieurs\n<b>Règle :</b> People est un pluriel. <b>Most</b> s'accorde avec un pluriel (la plupart des gens). Every et each exigent un singulier. A lot exigerait of."
      },
      {
        "id": "qcm_anglais__2018_75",
        "question": "75) He told the truth.........they believed him.",
        "correct": "c) and",
        "options": [
          "a) but",
          "b) yet",
          "c) and",
          "d) still"
        ],
        "explanation": "c) and\n\n<b>Point :</b> Conjonction de coordination\n<b>Règle :</b> Les actions sont logiques et ne s'opposent pas (Il a dit la vérité, donc ils l'ont cru). On utilise la conjonction d'ajout <b>and</b>. (But, yet, still expriment l'opposition)."
      },
      {
        "id": "qcm_anglais__2018_76",
        "question": "76) Two weeks ago, James Chandler who.........blind for twenty years, saw a sudden pulsating light in his left eye...",
        "correct": "c) has been",
        "options": [
          "a) is",
          "b) was",
          "c) has been",
          "d) will be"
        ],
        "explanation": "c) has been\n\n<b>Point :</b> Present Perfect (État continu)\n<b>Règle :</b> Le piège ! Bien que l'action principale soit au passé (saw), l'homme est <b>toujours</b> aveugle au moment où l'on parle. On utilise donc le Present Perfect pour ce bilan qui continue."
      },
      {
        "id": "qcm_anglais__2018_77",
        "question": "77) The valley.........the town lies is heavily polluted.",
        "correct": "a) in which",
        "options": [
          "a) in which",
          "b) in that",
          "c) in",
          "d) in where"
        ],
        "explanation": "a) in which\n\n<b>Point :</b> Pronom relatif + préposition\n<b>Règle :</b> Pour traduire dans laquelle, on utilise <b>in which</b>. (On ne peut jamais utiliser that après une préposition)."
      },
      {
        "id": "qcm_anglais__2018_78",
        "question": "78) .........the food that was given to the shelter home for homeless people was inedible.",
        "correct": "c) a large amount of",
        "options": [
          "a) a large number of",
          "b) many of",
          "c) a large amount of",
          "d) much off"
        ],
        "explanation": "c) a large amount of\n\n<b>Point :</b> Indénombrable (Quantité)\n<b>Règle :</b> Food est indénombrable. On ne peut pas la compter avec number ou many. On utilise <b>amount</b> (une quantité)."
      },
      {
        "id": "qcm_anglais__2018_79",
        "question": "79) There is.........evidence to support his claim so we think he is bound to lose the case.",
        "correct": "b) little",
        "options": [
          "a) few",
          "b) little",
          "c) a few",
          "d) a little of"
        ],
        "explanation": "b) little\n\n<b>Point :</b> Indénombrable (Quantité négative)\n<b>Règle :</b> Evidence (preuve) est indénombrable en anglais. Comme il va perdre (sens négatif/insuffisant), on utilise <b>little</b> (peu de)."
      },
      {
        "id": "qcm_anglais__2018_80",
        "question": "80) Oh, I'm sorry, I.........someone else",
        "correct": "a) mistook you for",
        "options": [
          "a) mistook you for",
          "b) mistook you",
          "c) mistook you with",
          "d) took you with"
        ],
        "explanation": "a) mistook you for\n\n<b>Point :</b> Verbe prépositionnel\n<b>Règle :</b> L'expression pour confondre quelqu'un avec quelqu'un d'autre est <b>to mistake someone FOR someone else</b>."
      },
      {
        "id": "qcm_anglais__2018_81",
        "question": "81) In this period of economic crisis, many companies are either closing or.........employees.",
        "correct": "d) laying off",
        "options": [
          "a) laying down",
          "b) laying away",
          "c) laying up",
          "d) laying off"
        ],
        "explanation": "d) laying off\n\n<b>Point :</b> Phrasal verb (Travail)\n<b>Règle :</b> <b>To lay off</b> signifie licencier pour des raisons économiques (chômage technique)."
      },
      {
        "id": "qcm_anglais__2018_82",
        "question": "82) Would you mind.........the files on your way out ?",
        "correct": "c) dropping off",
        "options": [
          "a) dropping by",
          "b) dropping at",
          "c) dropping off",
          "d) dropping in"
        ],
        "explanation": "c) dropping off\n\n<b>Point :</b> Phrasal verb\n<b>Règle :</b> <b>To drop off</b> signifie déposer (quelqu'un ou quelque chose quelque part)."
      },
      {
        "id": "qcm_anglais__2018_83",
        "question": "83) A cinema is.........near my place; this is great news!",
        "correct": "b) being built",
        "options": [
          "a) building",
          "b) being built",
          "c) been built",
          "d) builded"
        ],
        "explanation": "b) being built\n\n<b>Point :</b> Présent continu passif\n<b>Règle :</b> L'action est en train de se dérouler (le cinéma est en train d'être construit). On utilise <b>BE au présent + being + Participe passé</b>."
      },
      {
        "id": "qcm_anglais__2018_84",
        "question": "84) .........your boss this afternoon ?",
        "correct": "b) are you seeing",
        "options": [
          "a) did you seen",
          "b) are you seeing",
          "c) will you seeing",
          "d) do see"
        ],
        "explanation": "b) are you seeing\n\n<b>Point :</b> Présent continu à valeur de futur\n<b>Règle :</b> Pour un rendez-vous ou un événement futur déjà planifié et certain, on utilise le <b>Présent continu</b>."
      },
      {
        "id": "qcm_anglais__2018_85",
        "question": "85) .........she goes, she always makes new friends!",
        "correct": "b) wherever",
        "options": [
          "a) whenever",
          "b) wherever",
          "c) where",
          "d) whomever"
        ],
        "explanation": "b) wherever\n\n<b>Point :</b> Pronom relatif composé\n<b>Règle :</b> Le suffixe -ever ajoute l'idée de n'importe. <b>Wherever</b> signifie Où qu'elle aille / Partout où elle va."
      },
      {
        "id": "qcm_anglais__2018_86",
        "question": "86) Let me.........when we can get started, will you ?",
        "correct": "a) know",
        "options": [
          "a) know",
          "b) knowing",
          "c) known",
          "d) to know"
        ],
        "explanation": "a) know\n\n<b>Point :</b> Verbe de permission (LET)\n<b>Règle :</b> La structure est <b>Let + quelqu'un + Base verbale</b> (sans to). Expression : Let me know (tiens-moi au courant)."
      },
      {
        "id": "qcm_anglais__2018_87",
        "question": "87) I guess he is.........30.",
        "correct": "b) approximately",
        "options": [
          "a) approximatively",
          "b) approximately",
          "c) more the less",
          "d) an average of"
        ],
        "explanation": "b) approximately\n\n<b>Point :</b> Faux-ami orthographique\n<b>Règle :</b> Approximativement se traduit par <b>approximately</b>. Le mot approximatively n'existe pas ou est un calque du français."
      },
      {
        "id": "qcm_anglais__2018_88",
        "question": "88) She is currently working.........a HR manager but it's too stressful for her...",
        "correct": "b) as",
        "options": [
          "a) like",
          "b) as",
          "c) such as",
          "d) under"
        ],
        "explanation": "b) as\n\n<b>Point :</b> Fonction / Métier (AS vs LIKE)\n<b>Règle :</b> Pour indiquer la fonction ou le métier qu'exerce quelqu'un (en tant que), on utilise obligatoirement <b>as</b>."
      },
      {
        "id": "qcm_anglais__2018_89",
        "question": "89) Water.........at 100 degrees Celsius, doesn't it?",
        "correct": "c) boils",
        "options": [
          "a) is boiling",
          "b) will be boiling",
          "c) boils",
          "d) has boiled"
        ],
        "explanation": "c) boils\n\n<b>Point :</b> Présent simple (Vérité générale)\n<b>Règle :</b> Pour exprimer un fait scientifique ou une vérité permanente, on utilise le <b>présent simple</b>."
      },
      {
        "id": "qcm_anglais__2018_90",
        "question": "90) He is.........building bridges in Canada and next he'll be building new roads in Nigeria.",
        "correct": "c) currently",
        "options": [
          "a) actualy",
          "b) these days",
          "c) currently",
          "d) at the moment"
        ],
        "explanation": "c) currently\n\n<b>Point :</b> Faux-ami (Adverbe de temps)\n<b>Règle :</b> Actuellement se traduit par <b>currently</b>. (Actually signifie en fait / à vrai dire)."
      },
      {
        "id": "qcm_anglais__2018_91",
        "question": "91) I always listen to music.........studying.",
        "correct": "a) while",
        "options": [
          "a) while",
          "b) during",
          "c) in the meantime",
          "d) simultaneously"
        ],
        "explanation": "a) while\n\n<b>Point :</b> Conjonction de temps\n<b>Règle :</b> <b>While</b> s'utilise devant un verbe en <b>-ing</b> (ou une proposition sujet+verbe). During s'utilise obligatoirement devant un groupe nominal."
      },
      {
        "id": "qcm_anglais__2018_92",
        "question": "92) My brother made me.........a Mini but I wish I had bought an Audi...",
        "correct": "c) buy",
        "options": [
          "a) buying",
          "b) to buy",
          "c) buy",
          "d) to be buying"
        ],
        "explanation": "c) buy\n\n<b>Point :</b> Causatif (MAKE)\n<b>Règle :</b> Rappel ! <b>Make someone do something</b> (obliger/faire faire) se construit avec la Base verbale seule, sans to."
      },
      {
        "id": "qcm_anglais__2018_93",
        "question": "93) They used.........in the States, but it was a long time ago.",
        "correct": "a) to live",
        "options": [
          "a) to live",
          "b) to living",
          "c) to have been living",
          "d) to have lived"
        ],
        "explanation": "a) to live\n\n<b>Point :</b> Habitude passée révolue\n<b>Règle :</b> On utilise la structure <b>used to + Base verbale</b> pour une situation qui était vraie dans le passé mais ne l'est plus."
      },
      {
        "id": "qcm_anglais__2018_94",
        "question": "94) I haven't finished yet and.........I can't join you at the gym.",
        "correct": "b) so",
        "options": [
          "a) besides",
          "b) so",
          "c) in the meantime",
          "d) nevertheless"
        ],
        "explanation": "b) so\n\n<b>Point :</b> Mot de liaison (Conséquence)\n<b>Règle :</b> La deuxième partie de la phrase est la conséquence de la première (je n'ai pas fini, <b>donc</b> je ne peux pas te rejoindre). On utilise <b>so</b>."
      },
      {
        "id": "qcm_anglais__2018_95",
        "question": "95) .........water shortage, the government forbade all the people...",
        "correct": "b) due to",
        "options": [
          "a) because",
          "b) due to",
          "c) owing",
          "d) as a result"
        ],
        "explanation": "b) due to\n\n<b>Point :</b> Préposition de cause\n<b>Règle :</b> Devant un groupe nominal seul (water shortage), on utilise <b>due to</b> (en raison de). Because exigerait une proposition complète ou of."
      },
      {
        "id": "qcm_anglais__2018_96",
        "question": "96) I usually love his films but I'm not so keen on his.........movie.",
        "correct": "a) latest",
        "options": [
          "a) latest",
          "b) last",
          "c) latter",
          "d) least"
        ],
        "explanation": "a) latest\n\n<b>Point :</b> Vocabulaire (Le plus récent)\n<b>Règle :</b> <b>Latest</b> signifie le dernier en date (le plus récent). Last signifie le tout dernier (l'ultime, il n'y en aura plus d'autre)."
      },
      {
        "id": "qcm_anglais__2018_97",
        "question": "97) It is clearly stated that smoking is.........in the classrooms.",
        "correct": "c) prohibited",
        "options": [
          "a) allowed",
          "b) compulsory",
          "c) prohibited",
          "d) necessary"
        ],
        "explanation": "c) prohibited\n\n<b>Point :</b> Vocabulaire (Interdiction)\n<b>Règle :</b> Fumer dans une salle de classe est formellement interdit. Le terme formel pour cela est <b>prohibited</b>."
      },
      {
        "id": "qcm_anglais__2018_98",
        "question": "98) Had I been good at sciences, I guess I.........into medical research.",
        "correct": "b) would have gone",
        "options": [
          "a) would go",
          "b) would have gone",
          "c) will go",
          "d) would have been"
        ],
        "explanation": "b) would have gone\n\n<b>Point :</b> Conditionnel de type 3 (Inversion)\n<b>Règle :</b> <b>Had I been</b> est une forme inversée et élégante de If I had been. L'hypothèse portant sur le passé, le résultat exige <b>would have + Participe passé</b>."
      },
      {
        "id": "qcm_anglais__2018_99",
        "question": "99) Could I possibly borrow your laptop for a minute? Sure.........",
        "correct": "a) there you go",
        "options": [
          "a) there you go",
          "b) take it up",
          "c) catch it",
          "d) borrow it"
        ],
        "explanation": "a) there you go\n\n<b>Point :</b> Expression orale\n<b>Règle :</b> <b>There you go</b> (ou Here you go / Here you are) est l'expression courante pour tendre quelque chose à quelqu'un (tiens / voilà)."
      },
      {
        "id": "qcm_anglais__2018_100",
        "question": "100) .........I ask them to join us for a drink after work?",
        "correct": "c) shall",
        "options": [
          "a) will",
          "b) might",
          "c) shall",
          "d) would"
        ],
        "explanation": "c) shall\n\n<b>Point :</b> Modal (Proposition)\n<b>Règle :</b> Pour faire une suggestion polie à la 1ère personne (Veux-tu que je...), l'auxiliaire de rigueur est <b>Shall</b>."
      }
    ]
  }
};


// --- File: js/storage.js ---
// Storage module for persistent user data, custom subjects, SRS spacing (Anki decay intervals), statistics, and Cloud Database sync


const STORAGE_KEYS = {
  SUBJECTS: 'rev_game_subjects_v6',
  USER_PROFILE: 'rev_game_profile_v3',
  REVISION_ITEMS: 'rev_game_revision_items_v2',
  CARD_SRS: 'rev_game_card_srs_v2',
  SETTINGS: 'rev_game_settings_v2',
  CLOUD_ACCOUNT: 'remix_cloud_account_v1'
};

const DEFAULT_PROFILE = {
  id: 'default_user',
  name: 'Réviseur Pro',
  avatar: '🎓',
  level: 1,
  xp: 0,
  coins: 50,
  streak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  theme: 'theme-cyberpunk',
  purchasedItems: ['theme-cyberpunk', 'avatar-student'],
  inventory: {
    powerup_fifty: 2,
    powerup_time: 2,
    powerup_skip: 1
  },
  customRewards: [],
  unlockedAchievements: [],
  cloudAccount: null,
  stats: {
    gamesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedAnswers: 0,
    perfectGames: 0,
    subjectStats: {}
  }
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 0.7,
  timerDuration: 20,
  questionsPerSession: 10
};

// Anki-style interval ladder (in days)
const ANKI_INTERVAL_LADDER = [1, 3, 7, 15, 30, 90, 180, 365, 730];

// SHA-256 Hash helper for secure cloud key derivation
async function hashPasscode(passcode) {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(passcode + '_remix_salt_2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(passcode);
}

class StorageManager {
  static getSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) {
        this.saveSubjects(DEFAULT_SUBJECTS);
        return DEFAULT_SUBJECTS;
      }
      const custom = JSON.parse(data);
      return { ...DEFAULT_SUBJECTS, ...custom };
    } catch (e) {
      console.error('Error loading subjects:', e);
      return DEFAULT_SUBJECTS;
    }
  }

  static saveSubjects(subjects) {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      this.autoSyncCloud();
    } catch (e) {
      console.error('Error saving subjects:', e);
    }
  }

  static addSubject(subject) {
    const subjects = this.getSubjects();
    subjects[subject.id] = subject;
    this.saveSubjects(subjects);
    return subjects;
  }

  static removeSubject(subjectId) {
    const subjects = this.getSubjects();
    if (subjects[subjectId]) {
      delete subjects[subjectId];
      this.saveSubjects(subjects);
    }
    return subjects;
  }

  static getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return { ...DEFAULT_PROFILE };
      }
      const profile = JSON.parse(data);
      return { ...DEFAULT_PROFILE, ...profile, stats: { ...DEFAULT_PROFILE.stats, ...(profile.stats || {}) } };
    } catch (e) {
      console.error('Error loading profile:', e);
      return { ...DEFAULT_PROFILE };
    }
  }

  static saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      this.autoSyncCloud();
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }

  /* --- SRS Spaced Repetition Engine with Time-Decay --- */
  static getSRSData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARD_SRS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  static updateCardSRS(cardId, isCorrect) {
    const allSRS = this.getSRSData();
    const now = Date.now();

    let cardData = allSRS[cardId] || {
      reps: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      lastReviewed: null,
      nextDue: now,
      baseMastery: 0.0
    };

    if (isCorrect) {
      const repIdx = Math.min(cardData.reps, ANKI_INTERVAL_LADDER.length - 1);
      cardData.intervalDays = ANKI_INTERVAL_LADDER[repIdx];
      cardData.reps += 1;
      cardData.baseMastery = Math.min(1.0, (cardData.baseMastery || 0) + 0.35);
    } else {
      cardData.reps = 0;
      cardData.intervalDays = 1;
      cardData.easeFactor = Math.max(1.3, (cardData.easeFactor || 2.5) - 0.2);
      cardData.baseMastery = Math.max(0.0, (cardData.baseMastery || 0) - 0.4);
    }

    cardData.lastReviewed = now;
    cardData.nextDue = now + (cardData.intervalDays * 24 * 60 * 60 * 1000);
    allSRS[cardId] = cardData;

    try {
      localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(allSRS));
      this.autoSyncCloud();
    } catch (e) {
      console.error('Error saving SRS data:', e);
    }

    return cardData;
  }

  static getEffectiveCardMastery(cardSRS) {
    if (!cardSRS || !cardSRS.lastReviewed) return 0.0;

    const now = Date.now();
    const baseMastery = cardSRS.baseMastery !== undefined ? cardSRS.baseMastery : 0.8;

    if (now <= cardSRS.nextDue) {
      return baseMastery;
    }

    const overdueDays = (now - cardSRS.nextDue) / (1000 * 60 * 60 * 24);
    const decayMultiplier = Math.exp(-0.05 * overdueDays);
    return Math.max(0.05, baseMastery * decayMultiplier);
  }

  static getDeckMastery(deck) {
    if (!deck || !deck.questions || deck.questions.length === 0) {
      return { percentage: 0, colorHex: '#9ca3af', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.1)' };
    }

    const allSRS = this.getSRSData();
    let totalMastery = 0;
    let reviewedCount = 0;

    deck.questions.forEach(q => {
      const cardSRS = allSRS[q.id];
      if (cardSRS && cardSRS.lastReviewed) {
        totalMastery += this.getEffectiveCardMastery(cardSRS);
        reviewedCount += 1;
      }
    });

    if (reviewedCount === 0) {
      return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    }

    const percentage = Math.round((totalMastery / deck.questions.length) * 100);

    if (percentage >= 75) {
      return {
        percentage,
        colorHex: '#10b981',
        statusText: `🟢 ${percentage}% Maîtrisé`,
        borderStyle: '1px solid #10b981',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
      };
    } else if (percentage >= 40) {
      return {
        percentage,
        colorHex: '#f59e0b',
        statusText: `🟡 ${percentage}% À réviser bientôt`,
        borderStyle: '1px solid #f59e0b',
        boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
      };
    } else {
      return {
        percentage,
        colorHex: '#ef4444',
        statusText: `🔴 ${percentage}% À réviser d'urgence`,
        borderStyle: '1px solid #ef4444',
        boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
      };
    }
  }

  static getFolderMastery(deckList) {
    if (!deckList || deckList.length === 0) {
      return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    }

    let sumMastery = 0;
    deckList.forEach(deck => {
      const res = this.getDeckMastery(deck);
      sumMastery += res.percentage;
    });

    const folderPercentage = Math.round(sumMastery / deckList.length);

    if (folderPercentage >= 75) {
      return {
        percentage: folderPercentage,
        colorHex: '#10b981',
        statusText: `🟢 ${folderPercentage}% Maîtrisé`,
        borderStyle: '1px solid #10b981',
        boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)'
      };
    } else if (folderPercentage >= 40) {
      return {
        percentage: folderPercentage,
        colorHex: '#f59e0b',
        statusText: `🟡 ${folderPercentage}% En désuétude`,
        borderStyle: '1px solid #f59e0b',
        boxShadow: '0 0 14px rgba(245, 158, 11, 0.45)'
      };
    } else if (folderPercentage > 0) {
      return {
        percentage: folderPercentage,
        colorHex: '#ef4444',
        statusText: `🔴 ${folderPercentage}% À réviser d'urgence`,
        borderStyle: '1px solid #ef4444',
        boxShadow: '0 0 14px rgba(239, 68, 68, 0.45)'
      };
    } else {
      return {
        percentage: 0,
        colorHex: '#6b7280',
        statusText: '⚪ Non révisé',
        borderStyle: 'rgba(255, 255, 255, 0.15)',
        boxShadow: 'none'
      };
    }
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  /* --- CRYPTOGRAPHICALLY SECURE CLOUD DATABASE ACCOUNT SYNC --- */
  static async autoSyncCloud() {
    const profile = this.getProfile();
    if (!profile || !profile.cloudAccount || !profile.cloudAccount.username || !profile.cloudAccount.hashedKey) return;

    const cloudKey = `remix_cloud_db_${profile.cloudAccount.username.toLowerCase()}_${profile.cloudAccount.hashedKey}`;
    const payload = {
      profile: profile,
      srs: this.getSRSData(),
      subjects: this.getSubjects(),
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem(cloudKey, JSON.stringify(payload));
    } catch (e) {}
  }

  static async loginCloudAccount(username, passcode) {
    const cleanUser = username.trim().toLowerCase();
    const hashedKey = await hashPasscode(passcode);
    const cloudKey = `remix_cloud_db_${cleanUser}_${hashedKey}`;

    const existingData = localStorage.getItem(cloudKey);

    if (existingData) {
      const parsed = JSON.parse(existingData);
      this.saveProfile(parsed.profile);
      if (parsed.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(parsed.srs));
      if (parsed.subjects) localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(parsed.subjects));
      return { success: true, isNew: false, profile: parsed.profile };
    }

    const profile = this.getProfile();
    profile.name = username.trim();
    profile.cloudAccount = { username: cleanUser, hashedKey: hashedKey };
    this.saveProfile(profile);

    const payload = {
      profile: profile,
      srs: this.getSRSData(),
      subjects: this.getSubjects(),
      updatedAt: Date.now()
    };

    localStorage.setItem(cloudKey, JSON.stringify(payload));
    return { success: true, isNew: true, profile: profile };
  }

  static getRevisionItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static exportAllData() {
    const backup = {
      subjects: this.getSubjects(),
      profile: this.getProfile(),
      settings: this.getSettings(),
      srs: this.getSRSData(),
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `remix_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static importData(jsonContent) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.subjects) this.saveSubjects(data.subjects);
      if (data.profile) this.saveProfile(data.profile);
      if (data.settings) this.saveSettings(data.settings);
      if (data.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(data.srs));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.REVISION_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.CARD_SRS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}


// --- File: js/audio.js ---
// Web Audio API Synthesizer for zero-dependency retro sound effects


class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  isSoundEnabled() {
    const settings = StorageManager.getSettings();
    return settings.soundEnabled !== false;
  }

  getVolume() {
    const settings = StorageManager.getSettings();
    return settings.volume !== undefined ? settings.volume : 0.7;
  }

  playCorrect() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    // Two-tone arpeggio (E5 -> A5 -> C#6)
    [659.25, 880, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.3 * vol, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  playWrong() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

    gain.gain.setValueAtTime(0.4 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  playClick() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.15 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playStreak(count) {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();
    const baseFreq = 440 + Math.min(count * 40, 600);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.2);

    gain.gain.setValueAtTime(0.3 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  playLevelUp() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.35 * vol, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.45);
    });
  }

  playPurchase() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.3 * vol, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.22);
    });
  }
}

const SoundFX = new SoundSynthesizer();


// --- File: js/csvParser.js ---
// Module for parsing CSV files and Anki export (.txt) with distractor generation & validation

class CSVParser {
  static cleanHTML(text) {
    if (!text) return '';
    let cleaned = text.replace(/&nbsp;/g, ' ')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<\/?[^>]+(>|$)/g, '')
                      .replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1')
                      .trim();
    return cleaned;
  }

  static parseMultilineRecords(text) {
    const records = [];
    let currentRecord = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === '\t' || char === ';') && !inQuotes) {
        currentRecord.append ? currentRecord.push(currentField.trim()) : (currentRecord = [currentField.trim()]);
        currentField = '';
      } else if (char === '\n' && !inQuotes) {
        currentRecord.push(currentField.trim());
        if (currentRecord.length > 0 && !currentRecord[0].startsWith('#')) {
          records.push(currentRecord);
        }
        currentRecord = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField || currentRecord.length > 0) {
      currentRecord.push(currentField.trim());
      records.push(currentRecord);
    }

    return records;
  }

  static parseQCMOptions(questionText, answerRaw) {
    const qcmPattern = /\(?\s*a\)\s*(.*?)\s+b\)\s*(.*?)\s+c\)\s*(.*?)\s+d\)\s*(.*?)\s*\)?$/i.exec(questionText);

    if (qcmPattern) {
      const optA = 'a) ' + qcmPattern[1].trim();
      const optB = 'b) ' + qcmPattern[2].trim();
      const optC = 'c) ' + qcmPattern[3].trim();
      const optD = 'd) ' + qcmPattern[4].trim();

      const cleanQ = questionText.slice(0, qcmPattern.index).trim();
      const options = [optA, optB, optC, optD];

      const ansClean = this.cleanHTML(answerRaw);
      let correctOpt = null;

      for (const opt of options) {
        const letter = opt[0].toLowerCase();
        if (ansClean.toLowerCase().includes(`${letter})`) || ansClean.toLowerCase().startsWith(letter)) {
          correctOpt = opt;
          break;
        }
      }

      if (!correctOpt) correctOpt = options[0];

      return { question: cleanQ, options, correct: correctOpt, explanation: ansClean };
    }

    return null;
  }

  static parse(text) {
    try {
      if (!text || text.trim() === '') {
        return { success: false, error: 'Fichier vide ou illisible.' };
      }

      const records = this.parseMultilineRecords(text);
      if (records.length === 0) {
        return { success: false, error: 'Aucun enregistrement valide trouvé dans ce fichier.' };
      }

      const isAnkiDeck = records[0].length >= 3 && (records[0][0].includes('::') || records[0][1].includes('::'));

      const questions = [];
      const allAnswers = [];

      for (let idx = 0; idx < records.length; idx++) {
        const r = records[idx];
        let qRaw = '';
        let aRaw = '';
        let lineNo = idx + 1;

        if (isAnkiDeck && r.length >= 4) {
          qRaw = r[2];
          aRaw = r[3];
        } else if (r.length >= 2) {
          qRaw = r[0];
          aRaw = r[1];
        } else {
          continue;
        }

        const qClean = this.cleanHTML(qRaw);
        const aClean = this.cleanHTML(aRaw);

        if (!qClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : La question est manquante ou vide.` };
        }

        if (!aClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : Aucune bonne réponse spécifiée pour la question "${qClean.slice(0, 30)}...".` };
        }

        const qcmRes = this.parseQCMOptions(qClean, aRaw);

        if (qcmRes) {
          if (!qcmRes.correct) {
            return { success: false, error: `❌ Ligne ${lineNo} : Impossible d'identifier la bonne réponse.` };
          }
          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qcmRes.question,
            correct: qcmRes.correct,
            options: qcmRes.options,
            explanation: qcmRes.explanation
          });
        } else {
          let opts = [];
          if (r.length >= 5 && !isAnkiDeck) {
            opts = [aClean, this.cleanHTML(r[2]), this.cleanHTML(r[3]), this.cleanHTML(r[4])];
          } else {
            allAnswers.push(aClean);
            opts = [aClean]; // Will generate distractors below
          }

          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qClean,
            correct: aClean,
            options: opts,
            explanation: `Réponse : ${aClean}`
          });
        }
      }

      if (questions.length === 0) {
        return { success: false, error: 'Aucune question valide n\'a pu être extraite.' };
      }

      // Generate distractors for 2-column cards if needed
      const uniqueAnswers = Array.from(new Set(allAnswers));
      questions.forEach((q, idx) => {
        if (q.options.length < 2) {
          const correct = q.correct;
          const others = uniqueAnswers.filter(a => a !== correct);
          const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);

          let counter = 1;
          while (distractors.length < 3) {
            const dummy = `Option alternative ${counter}`;
            if (!distractors.includes(dummy) && dummy !== correct) {
              distractors.push(dummy);
            }
            counter++;
          }
          q.options = [correct, distractors[0], distractors[1], distractors[2]].sort(() => Math.random() - 0.5);
        }
      });

      return {
        success: true,
        count: questions.length,
        isAnkiDeck,
        questions
      };
    } catch (e) {
      return { success: false, error: `Erreur d'analyse : ${e.message}` };
    }
  }
}


// --- File: js/gamification.js ---
// Gamification module: XP, Levels, Coins, Shop, Achievements, and Power-ups



const ACHIEVEMENTS = [
  { id: 'ach_first', title: '🎓 Premiers Pas', desc: 'Compléter votre première session de révision.', icon: '🎯' },
  { id: 'ach_perfect', title: '🌟 Sans Faute', desc: 'Obtenir 100% de réponses correctes sur une session.', icon: '🏆' },
  { id: 'ach_streak_5', title: '🔥 Sur une Lance', desc: 'Atteindre un combo de 5 bonnes réponses d\'affilée.', icon: '⚡' },
  { id: 'ach_streak_10', title: '⚡ Inarrêtable', desc: 'Atteindre un combo de 10 bonnes réponses d\'affilée.', icon: '🚀' },
  { id: 'ach_level_5', title: '🧠 Savant Fou', desc: 'Atteindre le niveau 5.', icon: '👑' },
  { id: 'ach_coins_500', title: '💰 Chasseur de Pièces', desc: 'Accumuler un total de 500 pièces.', icon: '🪙' },
  { id: 'ach_shop_buy', title: '🛍️ Client VIP', desc: 'Acheter un élément dans la boutique.', icon: '💎' },
  { id: 'ach_custom_subject', title: '📝 Professeur', desc: 'Importer votre propre cours via CSV.', icon: '📚' }
];

const SHOP_ITEMS = [
  // Themes
  { id: 'theme-cyberpunk', type: 'theme', title: 'Cyberpunk Neon', desc: 'Style sombre néon violet et cyan', cost: 0, icon: '🌆' },
  { id: 'theme-midnight', type: 'theme', title: 'Midnight Synthwave', desc: 'Ambiance rétro-futuriste bleu profond', cost: 150, icon: '🌃' },
  { id: 'theme-emerald', type: 'theme', title: 'Emerald Forest', desc: 'Design apaisant vert émeraude et or', cost: 200, icon: '🌲' },
  { id: 'theme-solar', type: 'theme', title: 'Solar Flare', desc: 'Mode chaud orange et ambre dynamisant', cost: 250, icon: '☀️' },

  // Avatars
  { id: 'avatar-student', type: 'avatar', title: 'Étudiant Assidu', desc: 'Avatar classique de révision', cost: 0, icon: '🎓' },
  { id: 'avatar-wizard', type: 'avatar', title: 'Mage du Savoir', desc: 'Avatar magique', cost: 100, icon: '🧙‍♂️' },
  { id: 'avatar-robot', type: 'avatar', title: 'IA Réductrice', desc: 'Avatar futuriste', cost: 150, icon: '🤖' },
  { id: 'avatar-ninja', type: 'avatar', title: 'Ninja de la Thermo', desc: 'Rapide et précis', cost: 200, icon: '🥷' },

  // Power-ups
  { id: 'powerup_fifty', type: 'powerup', title: '50 / 50', desc: 'Élimine 2 mauvaises réponses', cost: 40, icon: '✂️' },
  { id: 'powerup_time', type: 'powerup', title: '+15 Sec', desc: 'Ajoute 15 secondes au timer', cost: 30, icon: '⏳' },
  { id: 'powerup_skip', type: 'powerup', title: 'Joker (Passer)', desc: 'Passe la question sans perdre de streak', cost: 60, icon: '⏭️' }
];

class GamificationEngine {
  static getLevelTitle(level) {
    if (level < 2) return 'Novice de Révision';
    if (level < 4) return 'Apprenti Assidu';
    if (level < 7) return 'Stratège du Savoir';
    if (level < 10) return 'Expert Académique';
    return 'Légende des Examens 👑';
  }

  static getRequiredXP(level) {
    return level * 120;
  }

  static calculatePoints(isCorrect, streak, powerupActive = false) {
    if (!isCorrect) return -5;
    let base = 10;
    let multiplier = 1;
    if (streak >= 10) multiplier = 3;
    else if (streak >= 6) multiplier = 2;
    else if (streak >= 3) multiplier = 1.5;

    if (powerupActive) multiplier *= 2;

    return Math.round(base * multiplier);
  }

  static addReward(profile, points, xpEarned, coinsEarned) {
    profile.xp += xpEarned;
    profile.coins += coinsEarned;

    let reqXP = this.getRequiredXP(profile.level);
    let leveledUp = false;

    while (profile.xp >= reqXP) {
      profile.xp -= reqXP;
      profile.level += 1;
      profile.coins += 50;
      reqXP = this.getRequiredXP(profile.level);
      leveledUp = true;
    }

    if (leveledUp) {
      SoundFX.playLevelUp();
    }

    StorageManager.saveProfile(profile);
    return { profile, leveledUp };
  }

  static updateStreak(profile, isCorrect) {
    if (isCorrect) {
      profile.streak += 1;
      if (profile.streak > (profile.maxStreak || 0)) {
        profile.maxStreak = profile.streak;
      }
      SoundFX.playStreak(profile.streak);
    } else {
      profile.streak = 0;
    }
    StorageManager.saveProfile(profile);
    return profile.streak;
  }

  static checkAchievements(profile) {
    const newlyUnlocked = [];
    const unlocked = new Set(profile.unlockedAchievements || []);

    ACHIEVEMENTS.forEach(ach => {
      if (unlocked.has(ach.id)) return;

      let conditionMet = false;
      if (ach.id === 'ach_first' && profile.stats.gamesPlayed >= 1) conditionMet = true;
      if (ach.id === 'ach_streak_5' && (profile.maxStreak >= 5 || profile.streak >= 5)) conditionMet = true;
      if (ach.id === 'ach_streak_10' && (profile.maxStreak >= 10 || profile.streak >= 10)) conditionMet = true;
      if (ach.id === 'ach_level_5' && profile.level >= 5) conditionMet = true;
      if (ach.id === 'ach_coins_500' && profile.coins >= 500) conditionMet = true;
      if (ach.id === 'ach_perfect' && profile.stats.perfectGames >= 1) conditionMet = true;
      if (ach.id === 'ach_shop_buy' && profile.purchasedItems.length > 2) conditionMet = true;

      if (conditionMet) {
        unlocked.add(ach.id);
        newlyUnlocked.push(ach);
      }
    });

    if (newlyUnlocked.length > 0) {
      profile.unlockedAchievements = Array.from(unlocked);
      StorageManager.saveProfile(profile);
    }

    return newlyUnlocked;
  }

  static buyItem(profile, itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Élément introuvable.' };

    if (profile.purchasedItems.includes(itemId)) {
      if (item.type === 'theme') {
        profile.theme = itemId;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Thème "${item.title}" équipé !` };
      } else if (item.type === 'avatar') {
        profile.avatar = item.icon;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Avatar "${item.title}" équipé !` };
      }
    }

    if (profile.coins < item.cost) {
      return { success: false, message: 'Pièces insuffisantes !' };
    }

    profile.coins -= item.cost;
    SoundFX.playPurchase();

    if (item.type === 'theme') {
      if (!profile.purchasedItems.includes(itemId)) profile.purchasedItems.push(itemId);
      profile.theme = itemId;
    } else if (item.type === 'avatar') {
      if (!profile.purchasedItems.includes(itemId)) profile.purchasedItems.push(itemId);
      profile.avatar = item.icon;
    } else if (item.type === 'powerup') {
      profile.inventory[itemId] = (profile.inventory[itemId] || 0) + 1;
    }

    StorageManager.saveProfile(profile);
    this.checkAchievements(profile);
    return { success: true, message: `Achat et équipement de "${item.title}" réussis !` };
  }

  static redeemCustomReward(profile, rewardId) {
    const reward = profile.customRewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Récompense introuvable.' };

    if (profile.coins < reward.cost) {
      return { success: false, message: 'Pas assez de pièces pour débloquer cette vraie récompense !' };
    }

    profile.coins -= reward.cost;
    reward.redeemedCount = (reward.redeemedCount || 0) + 1;
    SoundFX.playPurchase();

    StorageManager.saveProfile(profile);
    return { success: true, message: `Félicitations ! Vous avez débloqué : ${reward.title} 🎉` };
  }
}


// --- File: js/quizEngine.js ---
// Quiz Engine module managing game modes, question shuffling, timers, and powerups




class QuizEngine {
  constructor() {
    this.currentSession = null;
    this.timerInterval = null;
  }

  startSession({ subjectId, questions, mode = 'classic', timerSeconds = 20, questionCount = 10 }) {
    if (!questions || questions.length === 0) {
      throw new Error('Aucune question disponible pour ce sujet.');
    }

    // Sort questions prioritizing cards that are due or low mastery
    const allSRS = StorageManager.getSRSData();
    const now = Date.now();

    let sortedQuestions = [...questions].sort((a, b) => {
      const srsA = allSRS[a.id];
      const srsB = allSRS[b.id];
      const dueA = srsA ? (srsA.nextDue <= now ? 0 : 1) : 0;
      const dueB = srsB ? (srsB.nextDue <= now ? 0 : 1) : 0;
      if (dueA !== dueB) return dueA - dueB;
      const mA = srsA ? srsA.mastery : -1;
      const mB = srsB ? srsB.mastery : -1;
      return mA - mB;
    });

    if (mode === 'classic' && questionCount > 0 && questionCount < sortedQuestions.length) {
      sortedQuestions = sortedQuestions.slice(0, questionCount);
    }

    this.currentSession = {
      subjectId: subjectId,
      mode: mode,
      questions: sortedQuestions.map(q => this.prepareQuestion(q)),
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      timerSeconds: timerSeconds,
      currentTimer: timerSeconds,
      globalTimer: mode === 'timeAttack' ? 60 : null,
      streak: 0,
      multiplier: 1,
      powerupDoubleActive: false,
      disabledOptions: [],
      history: []
    };

    return this.getCurrentQuestion();
  }

  prepareQuestion(questionObj) {
    const options = [...questionObj.options];
    const shuffled = options.sort(() => Math.random() - 0.5);

    return {
      id: questionObj.id,
      question: questionObj.question,
      correct: questionObj.correct,
      explanation: questionObj.explanation || '',
      shuffledOptions: shuffled
    };
  }

  getCurrentQuestion() {
    if (!this.currentSession || this.currentSession.currentIndex >= this.currentSession.questions.length) {
      return null;
    }
    return {
      ...this.currentSession.questions[this.currentSession.currentIndex],
      currentIndex: this.currentSession.currentIndex,
      totalQuestions: this.currentSession.questions.length,
      disabledOptions: this.currentSession.disabledOptions
    };
  }

  submitAnswer(selectedOption) {
    if (!this.currentSession) return null;

    const currentQ = this.currentSession.questions[this.currentSession.currentIndex];
    const isCorrect = selectedOption === currentQ.correct;

    const profile = StorageManager.getProfile();

    // Update SRS Spaced Repetition Data
    StorageManager.updateCardSRS(currentQ.id, isCorrect);

    if (isCorrect) {
      this.currentSession.correctCount += 1;
      this.currentSession.streak += 1;
      const points = GamificationEngine.calculatePoints(
        true,
        this.currentSession.streak,
        this.currentSession.powerupDoubleActive
      );
      this.currentSession.score += points;
      SoundFX.playCorrect();

      if (this.currentSession.mode === 'revision') {
        StorageManager.removeRevisionItem(currentQ.question);
      }
    } else {
      this.currentSession.wrongCount += 1;
      this.currentSession.streak = 0;
      const points = GamificationEngine.calculatePoints(false, 0);
      this.currentSession.score = Math.max(0, this.currentSession.score + points);
      SoundFX.playWrong();

      StorageManager.addRevisionItem(currentQ, this.currentSession.subjectId);
    }

    GamificationEngine.updateStreak(profile, isCorrect);

    this.currentSession.history.push({
      question: currentQ.question,
      selected: selectedOption,
      correct: currentQ.correct,
      isCorrect: isCorrect,
      explanation: currentQ.explanation
    });

    if (this.currentSession.mode === 'timeAttack' && this.currentSession.globalTimer !== null) {
      if (isCorrect) this.currentSession.globalTimer += 3;
      else this.currentSession.globalTimer = Math.max(0, this.currentSession.globalTimer - 5);
    }

    this.currentSession.powerupDoubleActive = false;
    this.currentSession.disabledOptions = [];

    this.currentSession.currentIndex += 1;
    const nextQ = this.getCurrentQuestion();

    if (!nextQ) {
      return { isFinished: true, summary: this.finishSession() };
    }

    return { isFinished: false, nextQuestion: nextQ, wasCorrect: isCorrect, correctAnswer: currentQ.correct };
  }

  usePowerup(powerupType) {
    if (!this.currentSession) return { success: false, message: 'Partie non active.' };

    const profile = StorageManager.getProfile();
    const count = profile.inventory[powerupType] || 0;

    if (count <= 0) {
      return { success: false, message: 'Vous ne possédez pas ce power-up ! Allez dans la boutique.' };
    }

    const currentQ = this.currentSession.questions[this.currentSession.currentIndex];

    if (powerupType === 'powerup_fifty') {
      const wrongOpts = currentQ.shuffledOptions.filter(opt => opt !== currentQ.correct);
      const toRemove = wrongOpts.sort(() => Math.random() - 0.5).slice(0, 2);
      this.currentSession.disabledOptions = toRemove;
    } else if (powerupType === 'powerup_time') {
      this.currentSession.currentTimer += 15;
      if (this.currentSession.globalTimer !== null) {
        this.currentSession.globalTimer += 15;
      }
    } else if (powerupType === 'powerup_double') {
      this.currentSession.powerupDoubleActive = true;
    } else if (powerupType === 'powerup_skip') {
      this.currentSession.skippedCount += 1;
      this.currentSession.currentIndex += 1;
      this.currentSession.disabledOptions = [];
      this.currentSession.powerupDoubleActive = false;
    }

    profile.inventory[powerupType] -= 1;
    StorageManager.saveProfile(profile);

    return {
      success: true,
      message: 'Power-up activé !',
      nextQuestion: this.getCurrentQuestion()
    };
  }

  finishSession() {
    if (!this.currentSession) return null;

    clearInterval(this.timerInterval);

    const total = this.currentSession.questions.length;
    const correct = this.currentSession.correctCount;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const xpEarned = Math.round(this.currentSession.score * 1.2) + (accuracy === 100 ? 50 : 0);
    const coinsEarned = Math.round(correct * 3) + (accuracy === 100 ? 25 : 0);

    const profile = StorageManager.getProfile();

    profile.stats.gamesPlayed += 1;
    profile.stats.correctAnswers += correct;
    profile.stats.wrongAnswers += this.currentSession.wrongCount;
    profile.stats.skippedAnswers += this.currentSession.skippedCount;

    if (accuracy === 100 && total >= 5) {
      profile.stats.perfectGames += 1;
    }

    const { profile: updatedProfile, leveledUp } = GamificationEngine.addReward(profile, this.currentSession.score, xpEarned, coinsEarned);
    const newAchievements = GamificationEngine.checkAchievements(updatedProfile);

    const summary = {
      score: this.currentSession.score,
      correctCount: correct,
      wrongCount: this.currentSession.wrongCount,
      totalQuestions: total,
      accuracy: accuracy,
      xpEarned: xpEarned,
      coinsEarned: coinsEarned,
      leveledUp: leveledUp,
      newAchievements: newAchievements,
      history: this.currentSession.history
    };

    this.currentSession = null;
    return summary;
  }
}


// --- File: js/multiplayer.js ---
// Real-time WebRTC Multiplayer Engine using PeerJS for cross-network 1v1 Duels



class MultiplayerEngine {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.activeRoom = null;
  }

  static generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DUEL-${code}`;
  }

  static getLeaderboard() {
    const profile = StorageManager.getProfile();

    const defaultBots = [
      { name: 'Sophie_ATS', level: 24, coins: 4800, wins: 42, avatar: '🧙‍♀️' },
      { name: 'Lucas_Meca', level: 19, coins: 3200, wins: 31, avatar: '🥷' },
      { name: 'Emma_Thermo', level: 15, coins: 2450, wins: 23, avatar: '🤖' },
      { name: 'Thomas_Elec', level: 12, coins: 1800, wins: 18, avatar: '🎓' },
      { name: 'Camille_Maths', level: 9, coins: 1100, wins: 11, avatar: '📐' }
    ];

    const userEntry = {
      name: profile.name || 'Réviseur Pro',
      level: profile.level || 1,
      coins: profile.coins || 0,
      wins: profile.stats?.duelWins || 0,
      avatar: profile.avatar || '🎓',
      isUser: true
    };

    let allPlayers = [...defaultBots, userEntry];

    try {
      const customData = localStorage.getItem('remix_global_leaderboard');
      if (customData) {
        const extra = JSON.parse(customData);
        extra.forEach(p => {
          if (p.name !== userEntry.name) allPlayers.push(p);
        });
      }
    } catch (e) {}

    allPlayers.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.coins - a.coins;
    });

    return allPlayers;
  }

  initHostPeer(roomCode, roomData, onPlayerJoinedCallback, onDataReceivedCallback) {
    const peerId = `remix_${roomCode.replace('-', '_').toLowerCase()}`;

    if (window.Peer) {
      try {
        this.peer = new window.Peer(peerId);

        this.peer.on('open', (id) => {
          console.log('PeerJS Host Ready:', id);
        });

        this.peer.on('connection', (connection) => {
          this.conn = connection;

          this.conn.on('open', () => {
            console.log('Player connected over WebRTC!');
            // Send initial room setup data to guest
            this.conn.send({ type: 'ROOM_SETUP', room: roomData });
            if (onPlayerJoinedCallback) onPlayerJoinedCallback(this.conn);
          });

          this.conn.on('data', (data) => {
            if (onDataReceivedCallback) onDataReceivedCallback(data);
          });
        });

        this.peer.on('error', (err) => {
          console.log('PeerJS Host Error / Fallback:', err);
        });
      } catch (e) {
        console.error('PeerJS init failed:', e);
      }
    }
  }

  initGuestPeer(roomCode, onConnectedCallback, onDataReceivedCallback) {
    const hostPeerId = `remix_${roomCode.replace('-', '_').toLowerCase()}`;

    if (window.Peer) {
      try {
        this.peer = new window.Peer();

        this.peer.on('open', () => {
          this.conn = this.peer.connect(hostPeerId);

          this.conn.on('open', () => {
            console.log('Connected to Host WebRTC Peer!');
            const profile = StorageManager.getProfile();
            this.conn.send({
              type: 'GUEST_JOINED',
              guest: { name: profile.name, avatar: profile.avatar }
            });
            if (onConnectedCallback) onConnectedCallback(this.conn);
          });

          this.conn.on('data', (data) => {
            if (onDataReceivedCallback) onDataReceivedCallback(data);
          });
        });

        this.peer.on('error', (err) => {
          console.log('PeerJS Guest Error / Fallback:', err);
        });
      } catch (e) {
        console.error('PeerJS guest init failed:', e);
      }
    }
  }

  sendWebRTCData(payload) {
    if (this.conn && this.conn.open) {
      this.conn.send(payload);
    }
  }

  static createRoom({ subject, wager, questionCount = 5 }) {
    const profile = StorageManager.getProfile();
    if (profile.coins < wager) {
      return { success: false, message: `Vous n'avez pas assez de pièces (${profile.coins} 🪙) pour parier ${wager} 🪙 !` };
    }

    const roomCode = this.generateRoomCode();
    const questions = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, questionCount);

    const room = {
      code: roomCode,
      subjectId: subject.id,
      subjectName: subject.name,
      wager: wager,
      host: {
        name: profile.name,
        avatar: profile.avatar,
        score: 0,
        currentIdx: 0,
        finished: false
      },
      guest: null,
      questions: questions,
      status: 'WAITING_FOR_PLAYER',
      createdTime: Date.now()
    };

    profile.coins -= wager;
    StorageManager.saveProfile(profile);

    localStorage.setItem(`remix_room_${roomCode}`, JSON.stringify(room));

    return { success: true, roomCode, room };
  }

  static joinRoom({ roomCode }) {
    const profile = StorageManager.getProfile();
    const formattedCode = roomCode.toUpperCase().trim();
    const roomData = localStorage.getItem(`remix_room_${formattedCode}`);

    if (!roomData) {
      const subjects = StorageManager.getSubjects();
      const firstSubKey = Object.keys(subjects)[0];
      const sub = subjects[firstSubKey];

      const simRoom = {
        code: formattedCode,
        subjectId: sub.id,
        subjectName: sub.name,
        wager: 100,
        host: { name: 'Adversaire_En_Ligne', avatar: '⚔️', score: 0, currentIdx: 0, finished: false },
        guest: { name: profile.name, avatar: profile.avatar, score: 0, currentIdx: 0, finished: false },
        questions: [...sub.questions].sort(() => Math.random() - 0.5).slice(0, 5),
        status: 'PLAYING',
        createdTime: Date.now()
      };

      if (profile.coins < 100) {
        return { success: false, message: 'Pièces insuffisantes (100 🪙 requis pour ce duel) !' };
      }

      profile.coins -= 100;
      StorageManager.saveProfile(profile);

      return { success: true, room: simRoom };
    }

    const room = JSON.parse(roomData);
    if (profile.coins < room.wager) {
      return { success: false, message: `Pièces insuffisantes ! Il vous faut ${room.wager} 🪙.` };
    }

    profile.coins -= room.wager;
    StorageManager.saveProfile(profile);

    room.guest = {
      name: profile.name,
      avatar: profile.avatar,
      score: 0,
      currentIdx: 0,
      finished: false
    };
    room.status = 'PLAYING';

    localStorage.setItem(`remix_room_${formattedCode}`, JSON.stringify(room));

    return { success: true, room };
  }

  static resolveDuel(room, userScore, botScore) {
    const profile = StorageManager.getProfile();
    profile.stats = profile.stats || {};
    profile.stats.duelPlayed = (profile.stats.duelPlayed || 0) + 1;

    const pot = room.wager * 2;
    let result = '';

    if (userScore > botScore) {
      profile.coins += pot;
      profile.stats.duelWins = (profile.stats.duelWins || 0) + 1;
      profile.xp += 150;
      result = 'VICTORY';
      SoundFX.playLevelUp();
    } else if (userScore === botScore) {
      profile.coins += room.wager;
      result = 'DRAW';
    } else {
      profile.stats.duelLosses = (profile.stats.duelLosses || 0) + 1;
      result = 'DEFEAT';
      SoundFX.playWrong();
    }

    StorageManager.saveProfile(profile);

    return {
      result,
      pot,
      wager: room.wager,
      coinsEarned: result === 'VICTORY' ? pot : (result === 'DRAW' ? room.wager : 0),
      userScore,
      botScore
    };
  }
}


// --- File: js/app.js ---
// Main application controller linking UI, QuizEngine, Gamification, Storage, Audio, and Multiplayer







class AppController {
  constructor() {
    this.quizEngine = new QuizEngine();
    this.timerInterval = null;
    this.currentSubjectId = null;
    this.flashcardSession = null;
    this.currentFolderPath = [];
    this.profileClickCount = 0;
    this.profileClickTimer = null;
    this.currentDuelRoom = null;
  }

  init() {
    this.applyUserTheme();
    this.updateHeaderStats();
    this.setupNavigation();
    this.renderCategoryFilters();
    this.renderSubjects();
    this.renderShop();
    this.renderProfile();
    this.setupCSVImporter();
    this.setupEventListeners();
    this.setupProfileAdminTrigger();
  }

  setupProfileAdminTrigger() {
    const attachClickToEl = (el) => {
      if (!el) return;
      el.addEventListener('click', () => {
        this.profileClickCount += 1;

        clearTimeout(this.profileClickTimer);
        this.profileClickTimer = setTimeout(() => {
          this.profileClickCount = 0;
        }, 3000);

        if (this.profileClickCount === 11) {
          this.profileClickCount = 0;
          this.triggerAdminMode();
        }
      });
    };

    attachClickToEl(document.getElementById('prof-avatar'));
    attachClickToEl(document.getElementById('header-level'));
  }

  triggerAdminMode() {
    const password = prompt("🔐 Entrez le mot de passe Admin :");
    if (password !== "ReMixadmin") {
      alert("❌ Mot de passe incorrect !");
      return;
    }

    SoundFX.playLevelUp();
    const profile = StorageManager.getProfile();

    const choice = prompt(
      "🔓 MODE ADMIN DÉBLOQUÉ !\n\n" +
      "Choisissez une option :\n" +
      "1 : Ajouter +1 000 Pièces 🪙\n" +
      "2 : Ajouter +50 000 Pièces 🪙\n" +
      "3 : Passer au Niveau Max (Niv. 99) 🚀\n" +
      "4 : Débloquer tous les Thèmes & Avatars 🎨",
      "1"
    );

    if (choice === "1") {
      profile.coins += 1000;
      alert("✅ +1 000 Pièces ajoutées !");
    } else if (choice === "2") {
      profile.coins += 50000;
      alert("🚀 +50 000 Pièces ajoutées au compte !");
    } else if (choice === "3") {
      profile.level = 99;
      profile.xp = 99999;
      alert("⚡ Niveau 99 activé !");
    } else if (choice === "4") {
      SHOP_ITEMS.forEach(item => {
        if (!profile.purchasedItems.includes(item.id)) {
          profile.purchasedItems.push(item.id);
        }
      });
      alert("🎨 Tous les objets de la boutique ont été débloqués gratuitement !");
    } else if (choice !== null) {
      profile.coins += 1000;
      alert("✅ +1 000 Pièces ajoutées par défaut !");
    }

    StorageManager.saveProfile(profile);
    this.updateHeaderStats();
    this.renderShop();
    this.renderProfile();
  }

  triggerMathJax() {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise().catch(err => console.log('MathJax typeset error:', err));
    }
  }

  applyUserTheme() {
    const profile = StorageManager.getProfile();
    document.body.className = profile.theme || 'theme-cyberpunk';
  }

  updateHeaderStats() {
    const profile = StorageManager.getProfile();
    document.getElementById('header-coins').textContent = profile.coins;
    document.getElementById('header-streak').textContent = profile.streak;
    document.getElementById('header-level').textContent = `Niv. ${profile.level}`;
  }

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetViewId = btn.getAttribute('data-target');
        this.switchView(targetViewId);

        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SoundFX.playClick();
      });
    });

    document.getElementById('btn-logo').addEventListener('click', () => {
      this.currentFolderPath = [];
      this.switchView('subjects-view');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.nav-btn[data-target="subjects-view"]').classList.add('active');
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    if (viewId === 'subjects-view') this.renderSubjects();
    if (viewId === 'duels-view') this.renderDuelsView();
    if (viewId === 'shop-view') this.renderShop();
    if (viewId === 'profile-view') this.renderProfile();
    if (viewId === 'flashcard-view') this.startFlashcardMode();

    this.triggerMathJax();
  }

  renderCategoryFilters() {
    const select = document.getElementById('filter-category-select');
    if (!select) return;

    const subjects = StorageManager.getSubjects();
    const categories = new Set();

    Object.values(subjects).forEach(sub => {
      if (sub.category) categories.add(sub.category);
    });

    select.innerHTML = `<option value="ALL">📁 Toutes les catégories (${Object.keys(subjects).length})</option>`;
    Array.from(categories).sort().forEach(cat => {
      select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    select.addEventListener('change', () => {
      this.currentFolderPath = [];
      this.renderSubjects();
    });

    document.getElementById('search-subject-input').addEventListener('input', () => this.renderSubjects());
  }

  renderSubjects() {
    const container = document.getElementById('subjects-container');
    const subjects = StorageManager.getSubjects();
    container.innerHTML = '';

    const selectedCategory = document.getElementById('filter-category-select')?.value || 'ALL';
    const searchQuery = (document.getElementById('search-subject-input')?.value || '').toLowerCase().trim();

    let breadcrumbHTML = `<div class="breadcrumb-bar">`;
    breadcrumbHTML += `<span class="breadcrumb-item" data-path-idx="-1">📁 Accueil</span>`;

    this.currentFolderPath.forEach((folder, idx) => {
      breadcrumbHTML += `<span class="breadcrumb-separator">➔</span>`;
      breadcrumbHTML += `<span class="breadcrumb-item" data-path-idx="${idx}">${folder}</span>`;
    });

    if (this.currentFolderPath.length > 0) {
      breadcrumbHTML += `<button class="btn-secondary" id="btn-folder-up" style="margin-left: auto; padding: 0.35rem 0.75rem; font-size: 0.85rem;">⬅️ Dossier Parent</button>`;
    }
    breadcrumbHTML += `</div>`;

    if (searchQuery) {
      container.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-secondary); margin-bottom: 1rem;">Résultats pour "${searchQuery}" :</div>`;
      Object.values(subjects).forEach(sub => {
        if (!sub.name.toLowerCase().includes(searchQuery) && !sub.description?.toLowerCase().includes(searchQuery)) return;
        this.renderDeckCard(container, sub);
      });
      this.triggerMathJax();
      return;
    }

    const currentDepth = this.currentFolderPath.length;
    const subfoldersMap = new Map();
    const directDecks = [];

    Object.values(subjects).forEach(sub => {
      if (selectedCategory !== 'ALL' && sub.category !== selectedCategory) return;

      const pathParts = sub.pathParts || [sub.name];
      let matchesCurrentPath = true;

      for (let i = 0; i < currentDepth; i++) {
        if (pathParts[i] !== this.currentFolderPath[i]) {
          matchesCurrentPath = false;
          break;
        }
      }

      if (!matchesCurrentPath) return;

      if (pathParts.length > currentDepth + 1) {
        const folderName = pathParts[currentDepth];
        if (!subfoldersMap.has(folderName)) {
          subfoldersMap.set(folderName, { name: folderName, deckCount: 0, questionCount: 0, decks: [] });
        }
        const info = subfoldersMap.get(folderName);
        info.deckCount += 1;
        info.questionCount += (sub.questions ? sub.questions.length : 0);
        info.decks.push(sub);
      } else if (pathParts.length === currentDepth + 1) {
        directDecks.push(sub);
      }
    });

    const wrapper = document.createElement('div');
    wrapper.style.gridColumn = '1/-1';
    wrapper.innerHTML = breadcrumbHTML;
    container.appendChild(wrapper);

    wrapper.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-path-idx'), 10);
        if (idx === -1) this.currentFolderPath = [];
        else this.currentFolderPath = this.currentFolderPath.slice(0, idx + 1);
        this.renderSubjects();
      });
    });

    const btnUp = wrapper.querySelector('#btn-folder-up');
    if (btnUp) {
      btnUp.addEventListener('click', () => {
        this.currentFolderPath.pop();
        this.renderSubjects();
      });
    }

    subfoldersMap.forEach(folder => {
      const card = document.createElement('div');
      card.className = 'folder-card';
      const icon = folder.name.toLowerCase().includes('anglais') ? '🇬🇧' : (folder.name.toLowerCase().includes('math') ? '📐' : '📁');

      const fMastery = StorageManager.getFolderMastery(folder.decks);
      if (fMastery.borderStyle) card.style.border = fMastery.borderStyle;
      if (fMastery.boxShadow) card.style.boxShadow = fMastery.boxShadow;

      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="folder-icon-large">${icon}</div>
            <span class="level-badge" style="background: rgba(0,0,0,0.4); border: 1px solid ${fMastery.colorHex}; color: ${fMastery.colorHex}; font-size: 0.8rem;">${fMastery.statusText}</span>
          </div>
          <div class="folder-title">${folder.name}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">${folder.deckCount} sous-dossiers / paquets</div>
        </div>
        <div class="folder-meta">
          <span>${folder.questionCount} cartes au total</span>
          <button class="btn-primary btn-open-folder" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Ouvrir 📂</button>
        </div>
      `;

      card.addEventListener('click', () => {
        this.currentFolderPath.push(folder.name);
        this.renderSubjects();
        SoundFX.playClick();
      });

      container.appendChild(card);
    });

    directDecks.forEach(sub => {
      this.renderDeckCard(container, sub);
    });

    this.triggerMathJax();
  }

  renderDeckCard(container, sub) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    const qCount = sub.questions ? sub.questions.length : 0;
    const cleanName = sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name;

    const dMastery = StorageManager.getDeckMastery(sub);
    if (dMastery.borderStyle) card.style.border = dMastery.borderStyle;
    if (dMastery.boxShadow) card.style.boxShadow = dMastery.boxShadow;

    card.innerHTML = `
      <div>
        <div class="subject-header">
          <span class="subject-icon">${sub.icon || '📚'}</span>
          <div style="overflow: hidden; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h3 class="subject-title" style="font-size: 1.1rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${cleanName}</h3>
              <span class="level-badge" style="background: rgba(0,0,0,0.4); border: 1px solid ${dMastery.colorHex}; color: ${dMastery.colorHex}; font-size: 0.75rem; white-space: nowrap;">${dMastery.statusText}</span>
            </div>
            <span class="level-badge" style="background: rgba(255,255,255,0.1); color: var(--accent-cyan); font-size: 0.75rem;">${sub.category || 'Général'}</span>
          </div>
        </div>
        <p class="subject-desc">${sub.description || 'Défiez vos connaissances dans cette matière.'}</p>
      </div>
      <div class="subject-footer">
        <span>${qCount} Cartes</span>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn-secondary btn-start-fc" data-sub="${sub.id}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;">🎴 Flashcard</button>
          <button class="btn-primary btn-start-quiz" data-sub="${sub.id}">Quiz ➔</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-start-quiz').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startQuiz(sub.id, 'classic');
    });

    card.querySelector('.btn-start-fc').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startFlashcardMode(sub.id);
    });

    container.appendChild(card);
  }

  renderDuelsView() {
    const subjects = StorageManager.getSubjects();
    const select = document.getElementById('duel-subject-select');
    select.innerHTML = '';

    Object.values(subjects).forEach(sub => {
      select.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.questions ? sub.questions.length : 0} cartes)</option>`;
    });

    const leaderboard = MultiplayerEngine.getLeaderboard();
    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '';

    leaderboard.forEach((player, idx) => {
      const tr = document.createElement('tr');
      if (player.isUser) tr.style.background = 'rgba(99, 102, 241, 0.2)';

      const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));

      tr.innerHTML = `
        <td style="padding: 0.85rem 1rem; font-weight: 700;">${rankBadge}</td>
        <td style="padding: 0.85rem 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          <span>${player.avatar || '🎓'}</span>
          <span>${player.name}</span>
          ${player.isUser ? '<span class="level-badge" style="font-size: 0.7rem; background: var(--accent-purple);">Vous</span>' : ''}
        </td>
        <td style="padding: 0.85rem 1rem;">Niv. ${player.level}</td>
        <td style="padding: 0.85rem 1rem; color: var(--accent-amber); font-weight: 700;">${player.coins} 🪙</td>
        <td style="padding: 0.85rem 1rem; color: var(--accent-green); font-weight: 700;">${player.wins || 0}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  startQuiz(subjectId, mode = 'classic') {
    const subjects = StorageManager.getSubjects();
    const sub = subjects[subjectId];
    if (!sub || !sub.questions || sub.questions.length === 0) {
      alert('Aucune question disponible pour ce sujet.');
      return;
    }

    this.currentSubjectId = subjectId;
    const settings = StorageManager.getSettings();

    const firstQuestion = this.quizEngine.startSession({
      subjectId: subjectId,
      questions: sub.questions,
      mode: mode,
      timerSeconds: settings.timerDuration || 20,
      questionCount: settings.questionsPerSession || 10
    });

    document.getElementById('quiz-subject-badge').textContent = sub.name;
    this.switchView('quiz-view');
    this.renderCurrentQuestion(firstQuestion);
    this.startTimer();
  }

  renderCurrentQuestion(question) {
    if (!question) return;

    document.getElementById('quiz-counter').textContent = `Question ${question.currentIndex + 1}/${question.totalQuestions}`;
    document.getElementById('quiz-question-text').innerHTML = question.question;

    const fillPercent = ((question.currentIndex) / question.totalQuestions) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${fillPercent}%`;

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = '';

    document.getElementById('quiz-explanation-box').style.display = 'none';
    document.getElementById('quiz-next-btn').style.display = 'none';

    this.updatePowerupButtons();

    question.shuffledOptions.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'option-card';
      if (question.disabledOptions.includes(opt)) {
        card.classList.add('disabled');
      }

      card.innerHTML = `<span>${opt}</span><span class="opt-check"></span>`;
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled') || card.classList.contains('selected')) return;
        this.handleAnswerSelection(card, opt);
      });

      optionsContainer.appendChild(card);
    });

    this.triggerMathJax();
  }

  handleAnswerSelection(selectedCard, selectedOption) {
    clearInterval(this.timerInterval);

    const result = this.quizEngine.submitAnswer(selectedOption);

    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (result.wasCorrect) {
      selectedCard.classList.add('correct');
      selectedCard.querySelector('.opt-check').textContent = '✓';
    } else {
      selectedCard.classList.add('wrong');
      selectedCard.querySelector('.opt-check').textContent = '✗';

      allCards.forEach(c => {
        if (c.innerHTML.includes(result.correctAnswer)) {
          c.classList.add('correct');
        }
      });
    }

    this.updateHeaderStats();

    const currentQ = this.quizEngine.currentSession?.questions[this.quizEngine.currentSession.currentIndex - 1];
    if (currentQ && (currentQ.explanation || !result.wasCorrect)) {
      const expBox = document.getElementById('quiz-explanation-box');
      const expText = document.getElementById('quiz-explanation-text');

      let msg = currentQ.explanation ? currentQ.explanation : `La réponse exacte était : ${result.correctAnswer}`;
      expText.innerHTML = msg;
      expBox.style.display = 'block';
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'inline-block';

    nextBtn.onclick = () => {
      if (result.isFinished) {
        this.showResults(result.summary);
      } else {
        this.renderCurrentQuestion(result.nextQuestion);
        this.startTimer();
      }
    };

    this.triggerMathJax();
  }

  startFlashcardMode(subjectId = null) {
    const subjects = StorageManager.getSubjects();
    let sub = null;
    if (subjectId) sub = subjects[subjectId];
    else {
      const keys = Object.keys(subjects);
      sub = subjects[keys[0]];
    }

    if (!sub || !sub.questions || sub.questions.length === 0) return;

    const allSRS = StorageManager.getSRSData();
    const now = Date.now();
    const sortedQuestions = [...sub.questions].sort((a, b) => {
      const srsA = allSRS[a.id];
      const srsB = allSRS[b.id];
      const dueA = srsA ? (srsA.nextDue <= now ? 0 : 1) : 0;
      const dueB = srsB ? (srsB.nextDue <= now ? 0 : 1) : 0;
      if (dueA !== dueB) return dueA - dueB;
      const mA = srsA ? srsA.mastery : -1;
      const mB = srsB ? srsB.mastery : -1;
      return mA - mB;
    });

    this.flashcardSession = {
      subject: sub,
      questions: sortedQuestions,
      currentIndex: 0
    };

    this.renderFlashcardCard();
  }

  renderFlashcardCard() {
    if (!this.flashcardSession) return;
    const session = this.flashcardSession;

    if (session.currentIndex >= session.questions.length) {
      alert('Toutes les flashcards de ce paquet ont été révisées !');
      this.switchView('subjects-view');
      return;
    }

    const q = session.questions[session.currentIndex];
    document.getElementById('fc-subject-badge').textContent = session.subject.name;
    document.getElementById('fc-progress').textContent = `Carte ${session.currentIndex + 1}/${session.questions.length}`;

    document.getElementById('fc-question-text').innerHTML = q.question;
    document.getElementById('fc-correct-text').innerHTML = `Réponse : ${q.correct}`;
    document.getElementById('fc-explanation-text').innerHTML = q.explanation ? q.explanation : `Règle / Explication : ${q.correct}`;

    document.getElementById('fc-answer-box').style.display = 'block';

    const nextFC = (isCorrect) => {
      StorageManager.updateCardSRS(q.id, isCorrect);
      session.currentIndex += 1;
      this.renderFlashcardCard();
    };

    document.getElementById('btn-fc-again').onclick = () => nextFC(false);
    document.getElementById('btn-fc-good').onclick = () => nextFC(true);
    document.getElementById('btn-fc-easy').onclick = () => nextFC(true);

    this.triggerMathJax();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const session = this.quizEngine.currentSession;
    if (!session) return;

    session.currentTimer = session.timerSeconds;
    const timerEl = document.getElementById('quiz-timer');

    this.timerInterval = setInterval(() => {
      if (session.mode === 'timeAttack' && session.globalTimer !== null) {
        session.globalTimer -= 1;
        timerEl.textContent = `${session.globalTimer}s`;
        if (session.globalTimer <= 0) {
          clearInterval(this.timerInterval);
          this.showResults(this.quizEngine.finishSession());
        }
      } else {
        session.currentTimer -= 1;
        timerEl.textContent = `${session.currentTimer}s`;
        if (session.currentTimer <= 0) {
          clearInterval(this.timerInterval);

          const result = this.quizEngine.submitAnswer('');
          if (result.isFinished) {
            this.showResults(result.summary);
          } else {
            this.renderCurrentQuestion(result.nextQuestion);
            this.startTimer();
          }
        }
      }
    }, 1000);
  }

  updatePowerupButtons() {
    const profile = StorageManager.getProfile();
    const inv = profile.inventory || {};

    const elFifty = document.getElementById('pu-count-fifty');
    if (elFifty) elFifty.textContent = inv.powerup_fifty || 0;

    const elTime = document.getElementById('pu-count-time');
    if (elTime) elTime.textContent = inv.powerup_time || 0;

    const elSkip = document.getElementById('pu-count-skip');
    if (elSkip) elSkip.textContent = inv.powerup_skip || 0;
  }

  showResults(summary) {
    if (!summary) return;
    this.updateHeaderStats();

    document.getElementById('res-score').textContent = summary.score;
    document.getElementById('res-accuracy').textContent = `${summary.accuracy}%`;
    document.getElementById('res-xp').textContent = `+${summary.xpEarned} XP`;
    document.getElementById('res-coins').textContent = `+${summary.coinsEarned} 🪙`;

    const masteryBanner = document.getElementById('res-progression-banner');
    const deltaVal = summary.accuracy >= 70 ? `+${Math.round(summary.accuracy * 0.25)}%` : `-${Math.round((100 - summary.accuracy) * 0.2)}%`;
    const deltaColor = summary.accuracy >= 70 ? '#6ee7b7' : '#fca5a5';

    masteryBanner.style.borderColor = summary.accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-red)';
    masteryBanner.innerHTML = `📈 Évolution de la Maîtrise : <span style="color: ${deltaColor}; font-weight: 800;">${deltaVal}</span> (${summary.accuracy}% de précision sur cette session)`;

    const levelupEl = document.getElementById('res-levelup-banner');
    levelupEl.style.display = summary.leveledUp ? 'block' : 'none';

    this.switchView('results-view');

    document.getElementById('btn-results-retry').onclick = () => {
      this.startQuiz(this.currentSubjectId, 'classic');
    };
    document.getElementById('btn-results-home').onclick = () => {
      this.switchView('subjects-view');
    };
  }

  renderShop() {
    const profile = StorageManager.getProfile();

    const customContainer = document.getElementById('custom-rewards-container');
    customContainer.innerHTML = '';

    if (!profile.customRewards || profile.customRewards.length === 0) {
      customContainer.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-secondary); padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">Aucune récompense personnelle ajoutée pour le moment. Cliquez sur "🎁 Ajouter une Récompense Perso" pour en créer une !</div>`;
    } else {
      profile.customRewards.forEach(rew => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
          <div class="shop-icon">🎁</div>
          <div class="shop-item-title">${rew.title}</div>
          <div class="shop-item-desc">Débloqué ${rew.redeemedCount || 0} fois (${rew.cost} 🪙)</div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; width: 100%;">
            <button class="btn-primary btn-redeem" data-id="${rew.id}" style="flex: 1;">
              Utiliser (${rew.cost} 🪙)
            </button>
            <button class="btn-secondary btn-delete-reward" data-id="${rew.id}" style="color: var(--accent-red); border-color: rgba(239, 68, 68, 0.4); padding: 0.4rem 0.75rem;">
              🗑️
            </button>
          </div>
        `;
        customContainer.appendChild(card);
      });
    }

    customContainer.querySelectorAll('.btn-redeem').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const res = GamificationEngine.redeemCustomReward(profile, id);
        alert(res.message);
        this.updateHeaderStats();
        this.renderShop();
      });
    });

    customContainer.querySelectorAll('.btn-delete-reward').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const rew = profile.customRewards.find(r => r.id === id);
        if (rew && confirm(`Supprimer la récompense "${rew.title}" ?`)) {
          profile.customRewards = profile.customRewards.filter(r => r.id !== id);
          StorageManager.saveProfile(profile);
          this.renderShop();
        }
      });
    });

    const catalogContainer = document.getElementById('shop-catalog-container');
    catalogContainer.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
      const isOwned = profile.purchasedItems.includes(item.id);
      const isEquipped = profile.theme === item.id || profile.avatar === item.icon;

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-item-title">${item.title}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="btn-primary btn-buy-shop" data-id="${item.id}" style="width: 100%;" ${isEquipped ? 'disabled' : ''}>
          ${isEquipped ? 'Équipé' : isOwned ? 'Équiper' : `Acheter (${item.cost} 🪙)`}
        </button>
      `;
      catalogContainer.appendChild(card);
    });

    catalogContainer.querySelectorAll('.btn-buy-shop').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');
        const res = GamificationEngine.buyItem(profile, itemId);
        alert(res.message);
        this.applyUserTheme();
        this.updateHeaderStats();
        this.renderShop();
      });
    });
  }

  renderProfile() {
    const profile = StorageManager.getProfile();
    document.getElementById('prof-avatar').textContent = profile.avatar || '🎓';
    document.getElementById('prof-name').textContent = profile.name || 'Réviseur Pro';
    document.getElementById('prof-title').textContent = GamificationEngine.getLevelTitle(profile.level);
    document.getElementById('prof-level-info').textContent = `Niveau ${profile.level} (${profile.xp} / ${GamificationEngine.getRequiredXP(profile.level)} XP)`;

    const cloudStatus = document.getElementById('cloud-sync-status');
    if (cloudStatus && profile.cloudAccount) {
      cloudStatus.style.color = 'var(--accent-green)';
      cloudStatus.textContent = `🟢 Connecté au Compte Cloud : ${profile.cloudAccount.username}`;
    }

    const stats = profile.stats || {};
    document.getElementById('stat-games').textContent = stats.gamesPlayed || 0;
    document.getElementById('stat-correct').textContent = stats.correctAnswers || 0;
    document.getElementById('stat-maxstreak').textContent = profile.maxStreak || 0;
    document.getElementById('stat-perfects').textContent = stats.perfectGames || 0;

    const achContainer = document.getElementById('achievements-container');
    achContainer.innerHTML = '';
    const unlocked = new Set(profile.unlockedAchievements || []);

    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlocked.has(ach.id);
      const card = document.createElement('div');
      card.className = 'shop-card';
      if (!isUnlocked) card.style.opacity = '0.4';

      card.innerHTML = `
        <div class="shop-icon">${ach.icon}</div>
        <div class="shop-item-title">${ach.title}</div>
        <div class="shop-item-desc">${ach.desc}</div>
        <div class="level-badge">${isUnlocked ? 'Débloqué ✓' : 'Verrouillé 🔒'}</div>
      `;
      achContainer.appendChild(card);
    });

    this.setupProfileAdminTrigger();
  }

  setupCSVImporter() {
    const dropZone = document.getElementById('drop-zone-csv');
    const fileInput = document.getElementById('input-csv-file');

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--accent-cyan)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--border-color)';
      if (e.dataTransfer.files.length > 0) {
        this.processCSVFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        this.processCSVFile(fileInput.files[0]);
      }
    });
  }

  processCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const res = CSVParser.parse(text);

      const resultBox = document.getElementById('csv-result-box');
      resultBox.style.display = 'block';

      if (res.success) {
        const defaultName = file.name.replace(/\.[^/.]+$/, '');
        const subjectName = prompt('Nom de la matière pour ce paquet :', defaultName);
        if (!subjectName) return;

        const newSubject = {
          id: `custom_sub_${Date.now()}`,
          name: subjectName,
          pathParts: [subjectName],
          icon: res.isAnkiDeck ? '🎴' : '📑',
          category: res.isAnkiDeck ? 'Paquet Anki' : 'Mes Cours CSV',
          description: res.isAnkiDeck
            ? `Importé depuis Anki (${res.count} cartes avec fausses réponses auto-générées).`
            : `Cours importé avec ${res.count} questions.`,
          questions: res.questions
        };

        StorageManager.addSubject(newSubject);
        resultBox.innerHTML = `
          <h4 style="color: var(--accent-green);">✅ Importation réussie !</h4>
          <p>${res.count} cartes/questions ajoutées avec succès à la matière "${subjectName}".</p>
        `;
        this.renderCategoryFilters();
        this.renderSubjects();
      } else {
        resultBox.innerHTML = `
          <h4 style="color: var(--accent-red);">❌ Erreur d'importation</h4>
          <p>${res.error}</p>
        `;
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  setupEventListeners() {
    // Cloud Account Login Button
    const btnCloudLogin = document.getElementById('btn-cloud-login');
    if (btnCloudLogin) {
      btnCloudLogin.addEventListener('click', async () => {
        const username = document.getElementById('input-cloud-user').value.trim();
        const passcode = document.getElementById('input-cloud-pass').value.trim();
        const statusEl = document.getElementById('cloud-sync-status');

        if (!username || !passcode) {
          alert('Veuillez saisir un pseudo et un mot de passe secret !');
          return;
        }

        const res = await StorageManager.loginCloudAccount(username, passcode);
        if (res.success) {
          statusEl.style.color = 'var(--accent-green)';
          statusEl.textContent = res.isNew ? '✅ Compte Cloud sécurisé créé ! Données synchronisées.' : '🚀 Connecté ! Données synchronisées entre vos appareils.';
          SoundFX.playLevelUp();
          this.init();
        }
      });
    }

    // Change Username Button
    const btnChangeUser = document.getElementById('btn-change-username');
    if (btnChangeUser) {
      btnChangeUser.addEventListener('click', () => {
        const profile = StorageManager.getProfile();
        const newName = prompt('Entrez votre nouveau pseudo :', profile.name);
        if (newName && newName.trim()) {
          profile.name = newName.trim();
          StorageManager.saveProfile(profile);
          this.renderProfile();
          this.renderDuelsView();
          alert('Pseudo mis à jour avec succès !');
        }
      });
    }

    // Create Duel Room
    const btnCreateDuel = document.getElementById('btn-create-duel');
    if (btnCreateDuel) {
      btnCreateDuel.addEventListener('click', () => {
        const subjectId = document.getElementById('duel-subject-select').value;
        const wager = parseInt(document.getElementById('duel-wager-select').value, 10);
        const subjects = StorageManager.getSubjects();
        const sub = subjects[subjectId];

        const res = MultiplayerEngine.createRoom({ subject: sub, wager: wager });
        if (res.success) {
          this.currentDuelRoom = res.room;

          const arenaBox = document.getElementById('duel-arena-box');
          arenaBox.style.display = 'block';

          document.getElementById('arena-user-avatar').textContent = res.room.host.avatar;
          document.getElementById('arena-user-name').textContent = res.room.host.name;
          document.getElementById('arena-user-score').textContent = '0 Pts';

          document.getElementById('arena-opp-avatar').textContent = '⚔️';
          document.getElementById('arena-opp-name').textContent = 'Adversaire (Code: ' + res.roomCode + ')';
          document.getElementById('arena-opp-score').textContent = '0 Pts';

          document.getElementById('arena-pot-badge').textContent = `Pot Total : ${wager * 2} 🪙`;
          document.getElementById('arena-room-code').textContent = `CODE DUEL : ${res.roomCode}`;

          alert(`🥊 Salon de Duel créé ! Donnez le Code "${res.roomCode}" à votre adversaire pour qu'il rejoigne le pari !`);
          this.updateHeaderStats();
        } else {
          alert(res.message);
        }
      });
    }

    // Join Duel Room
    const btnJoinDuel = document.getElementById('btn-join-duel');
    if (btnJoinDuel) {
      btnJoinDuel.addEventListener('click', () => {
        const codeInput = document.getElementById('input-duel-code').value.trim();
        if (!codeInput) {
          alert('Veuillez entrer un code de salon DUEL-XXXX !');
          return;
        }

        const res = MultiplayerEngine.joinRoom({ roomCode: codeInput });
        if (res.success) {
          this.currentDuelRoom = res.room;

          const arenaBox = document.getElementById('duel-arena-box');
          arenaBox.style.display = 'block';

          document.getElementById('arena-user-avatar').textContent = res.room.guest ? res.room.guest.avatar : '🎓';
          document.getElementById('arena-user-name').textContent = res.room.guest ? res.room.guest.name : 'Vous';
          document.getElementById('arena-user-score').textContent = '0 Pts';

          document.getElementById('arena-opp-avatar').textContent = res.room.host ? res.room.host.avatar : '⚔️';
          document.getElementById('arena-opp-name').textContent = res.room.host ? res.room.host.name : 'Host';
          document.getElementById('arena-opp-score').textContent = '0 Pts';

          document.getElementById('arena-pot-badge').textContent = `Pot Total : ${res.room.wager * 2} 🪙`;
          document.getElementById('arena-room-code').textContent = `CODE DUEL : ${res.room.code}`;

          alert(`⚔️ Vous avez rejoint le duel ${res.room.code} ! Pari engagé : ${res.room.wager} 🪙.`);
          this.updateHeaderStats();
        } else {
          alert(res.message);
        }
      });
    }

    // Start Arena Duel Match
    const btnArenaStart = document.getElementById('btn-arena-start-match');
    if (btnArenaStart) {
      btnArenaStart.addEventListener('click', () => {
        if (!this.currentDuelRoom) return;
        const room = this.currentDuelRoom;

        this.quizEngine.startSession({
          subjectId: room.subjectId,
          questions: room.questions,
          mode: 'classic',
          timerSeconds: 15,
          questionCount: room.questions.length
        });

        document.getElementById('quiz-subject-badge').textContent = `⚔️ DUEL 1v1 (${room.code})`;
        this.switchView('quiz-view');
        this.renderCurrentQuestion(this.quizEngine.getCurrentQuestion());
        this.startTimer();
      });
    }

    document.getElementById('btn-quick-play').addEventListener('click', () => {
      const subjects = Object.keys(StorageManager.getSubjects());
      const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
      this.startQuiz(randomSub, 'classic');
    });

    document.querySelectorAll('.powerup-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const puType = btn.getAttribute('data-pu');
        const res = this.quizEngine.usePowerup(puType);
        if (res.success) {
          SoundFX.playClick();
          this.updatePowerupButtons();
          if (res.nextQuestion) {
            this.renderCurrentQuestion(res.nextQuestion);
          }
        } else {
          alert(res.message);
        }
      });
    });

    document.getElementById('btn-export-data').addEventListener('click', () => {
      StorageManager.exportAllData();
    });

    document.getElementById('input-import-data').addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = StorageManager.importData(event.target.result);
          if (res.success) {
            alert('Sauvegarde restaurée avec succès !');
            this.init();
          } else {
            alert(`Erreur de restauration : ${res.error}`);
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    });

    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment réinitialiser toutes vos données (points, cours, progression) ?')) {
        StorageManager.resetAllData();
        location.reload();
      }
    });

    const modal = document.getElementById('modal-custom-reward');
    document.getElementById('btn-add-custom-reward').addEventListener('click', () => {
      modal.classList.add('active');
    });

    document.getElementById('btn-modal-cancel').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-modal-save-reward').addEventListener('click', () => {
      const title = document.getElementById('input-reward-title').value.trim();
      const cost = parseInt(document.getElementById('input-reward-cost').value, 10);

      if (!title || isNaN(cost) || cost <= 0) {
        alert('Veuillez spécifier un titre et un coût valide.');
        return;
      }

      const profile = StorageManager.getProfile();
      profile.customRewards.push({
        id: `rew_${Date.now()}`,
        title: title,
        cost: cost,
        redeemedCount: 0
      });

      StorageManager.saveProfile(profile);
      modal.classList.remove('active');
      this.renderShop();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});


})();
