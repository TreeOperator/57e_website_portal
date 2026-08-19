/**
 * Content transcribed verbatim from the regiment's Fandom wiki page:
 * https://napoleonic-wars-rblx.fandom.com/wiki/57ème_Régiment_d'Infanterie_de_Ligne
 *
 * Wiki markup ([[File:...]], '''bold''', etc.) has been stripped for
 * display, but the wording itself is preserved exactly as written on
 * the wiki, including any inconsistencies in spelling/capitalisation.
 */

export interface InfoTable {
  title?: string
  headers: string[]
  rows: string[][]
}

export const infobox = {
  commandingOfficers: ['Colonel Vurellis', 'Général de Brigade. DullPuppyDog'],
  notableCommanders: [
    'Vycosis', 'Crusader1965', 'PorcusDoria', 'DullPuppyDog', 'cuhrabs',
    'Vurellis', 'Chrothium', 'Jake122410', 'fzmom',
  ],
  // Blacklisted per HICOM (Aug 2026) — kept separate from the active/historical
  // notable-commanders list, not removed from the record entirely.
  blacklistedCommanders: ['Zoldonn', 'Ender_Ragnar', 'KorbynODuffy', 'Howa0804'],
  periodOfActivity: 'Mid 2020 (presumed) - Present',
  nation: 'Empire Français',
  brigadeDivisionCorps: 'Deuxième Corps (Ex. Troisième Corps)',
  typeOfUnit: 'Line Infantry',
  numberOfLinesFielded: '1-8 (4 Fusilier lines, 4 Specialist lines)',
  nickname: "'Les Terribles'",
}

export const introParagraph =
  "The 57e Régiment d'Infanterie de Ligne (English: 57th Line Infantry Regiment), is one of the oldest " +
  "regiments within Troisième Corps (Now under Deuxième Corps) under General Gory's Empire Français. This " +
  "skilled regiment was led by Colonel HunnterHyper and Colonel AQEEP_vbn, successor to previous Colonel " +
  "Jake122410 and before him, Colonel Zoldon and Maréchal Chrothium. Now Lead by the beloved Colonel " +
  "Vurellis. The 57e Regiment historically is a line infantry regiment fighting with Napoleon in his " +
  "conquests throughout Europe and Africa. The 57e regiment supports time zones for Asia (AS/OC)."

export const realLifeHistoryIntro =
  '57th Line Infantry Regiment (57e Régiment d\'Infanterie de Ligne), nicknamed "Les Terribles", was a ' +
  'renowned unit of the French Grande Armée during the Napoleonic Wars. Known for its discipline, bravery, ' +
  'and resilience, the regiment earned its place in history through its exceptional performance in several ' +
  'key battles, including Austerlitz.'

export const realLifeHistory: { heading: string; text: string }[] = [
  {
    heading: 'Early History',
    text:
      "The regiment traces its origins to the amalgamations of the French Revolutionary Wars, when it was " +
      "initially organized as part of the revolutionary forces. By the time of Napoleon's reign, it had " +
      "become a seasoned and highly respected unit within the Grande Armée.",
  },
  {
    heading: 'Battle of Austerlitz (1805)',
    text:
      "The regiment played a pivotal role at the Battle of Austerlitz, often considered Napoleon's greatest " +
      "victory. As part of Marshal Soult's IV Corps, the 57th was positioned near the center of the French " +
      "line. It participated in the assault on the Pratzen Heights, a strategically vital position held by " +
      "the combined Austro-Russian forces. The regiment's actions helped break the enemy center, leading to " +
      "a decisive French victory. The battle cemented the regiment's reputation as a formidable fighting force.",
  },
  {
    heading: 'Peninsular War (1808–1814)',
    text:
      "During the Peninsular War, elements of the 57th were deployed in Spain, where they faced intense " +
      "opposition from British-led forces and Spanish guerrillas. The regiment endured arduous campaigns and " +
      "proved its mettle in several engagements, despite the challenging terrain and guerilla tactics " +
      "employed by the enemy.",
  },
  {
    heading: 'Russian Campaign (1812)',
    text:
      "The 57th was part of the French invasion of Russia, where it suffered severe losses during the " +
      "catastrophic retreat from Moscow. Despite the hardships of the campaign, the regiment retained its " +
      "cohesion and discipline, continuing to serve as a key component of Napoleon's forces.",
  },
  {
    heading: 'German Campaign (1813)',
    text:
      "The regiment fought at both the Spring and Autumn Campaigns in Germany in 1813, participating in " +
      "battles such as Dresden, however after Dresden, Vandamme and I Corps, of which the 57th were in, were " +
      "heavily engaged and defeated at Kulm, I Corps did NOT participate at Leipzig, and thus the 57th did " +
      "not see action there.",
  },
  {
    heading: 'Rhine Campaign (1815)',
    text:
      "Following Napoleon's return from exile during the Hundred Days, the 57th once again joined his " +
      "forces. The regiment participated in the Rhine Campaign, continuing to fight valiantly even as the " +
      "French army faced its ultimate defeat at the Battle of Waterloo, taking part in the victory at La " +
      "Suffel under Jean Rapp.",
  },
  {
    heading: 'Legacy',
    text:
      "The 57th Line Infantry Regiment remains one of the most celebrated units of the Napoleonic era. Its " +
      "nickname, \u201cLes Terrible\u201d, reflects the respect and fear it commanded on the battlefield. The " +
      "regiment is remembered for its steadfastness, skill, and unwavering loyalty to France during one of " +
      "the most tumultuous periods in European history.",
  },
]

export const nwGenreHistory: string[] = [
  'Pre-NW',
  'Prior to the First Battle of Waterloo',
  "In February 2024, the EU/NA parts of 57e split off to create the 45e Régiment d'Infanterie de Ligne. " +
    'After the spilt 45e stayed in Troisième Corps (EU/NA) while 57e moved to Deuxième Corps (AS/OC), ' +
    'joining their 9e and Irish (now Leib-Regiment von Hessen-Darmstadt) counterparts.',
  'The 57e had battles that only them alone fought a nation, at Smohain they fought Sweden with a victory, ' +
    'at Waterloo they fought Russia four times and won four times, and at the Asian Grand Battle, they ' +
    'fought Naples and the British Army alone they won a stunning 6K VICTORY with no eagles lost and no ' +
    'standards (flags) lost. "Many thought this battle was to be a blunder, but instead, the warriors of ' +
    '57è defied all and brought a valuable victory to France without losing a single eagle." - FireeAtWill, ' +
    "Commandant of the ARMÉE DE L'ORIENT",
]

export const orgIntro =
  "The regiment consists of 4 battalions, 7 companies, and 5 auxiliary departments in total. The first " +
  "battalion is the 3eme de Bataillon Auxiliaire which houses 5 departments to manage logistical work for " +
  "57e, secondly the 2/3eme Battalion du Fusiliers which houses 4 separate fusilier companies and 1 depot " +
  "company with their very own commanders, executives, and Non-commissioned officers, this battalion is " +
  "responsible for the backbone of the entire regiment as this one battalion can reach up to 100 fusiliers " +
  "strong which granted them a stronger fighting capability in large battles with excellent coordination " +
  "between commanders. Thirdly the 1er Bataillon de Spécialistes houses 4 seperate elite companies, which " +
  "are the Voltigeurs and Grenadiers. They were born to counter stronger lines in other nations where the " +
  "fusiliers couldn't handle and are heavily celebrated for their excellent battle performance. Each " +
  'company has 1 sub-company known as the "Flag defence Department" consisting of 1-3 flag guards and 1 ' +
  "flag bearer/supervisor."

export const etatMajorRegimentaireIntro =
  "These four individuals listed below are responsible for overseeing all operations of 57e. If any server " +
  "rules are violated or major issues occur, they are the ones who will address and solve these problems. " +
  "Additionally, they manage communication between regiments and nations to ensure that 57e runs smoothly. " +
  "Without them, the entire regiment would be in shambles with battles being inconsistent and administration " +
  "work being wrecked apart. Their reputation and demeanour within NW France are one of the cleanest with " +
  "basically no issues since 57e's origins from 2020."

export const etatMajorRegimentaireTable: InfoTable = {
  headers: ['Position', 'Rank', 'Username', 'Date of position assigned'],
  rows: [
    ['Surveillante du Régiment', 'Général de Brigade', 'Dullqd', 'December, 2024'],
    ['Commandant de Regiment', 'Général de Brigade', 'Vurellis', 'December, 2023'],
    ['Exécutif du Regiment', 'Major', 'JustinTheGreat2006', 'October, 2024'],
    ['Adjoint du Régiment', 'Adjudant', 'Alynum', 'March, 2026'],
  ],
}

export interface Department {
  name: string
  intro: string
  table: InfoTable
}

export const departments: Department[] = [
  {
    name: 'Département des Propagande',
    intro:
      "This department specialises in persuaing personnel from any infantry companies in 57e, then members " +
      "can create pieces of art that is used for propaganda purposes, medals are also awarded to those who " +
      "create high quality artwork. The table below displays the current staff members running this " +
      "department.\n\nTo join this department, you must have joined 57e and be any rank, the department is " +
      "advertised very frequently in the 57e Shouts channel every day. After joining you must enlist " +
      "yourself like how you did to join 57e. Ask the staff listed below in the table about information and " +
      "how to upload artworks. AI art is strictly forbidden in this department as it promotes authenticity, " +
      "artworks can be in paper and digital form, also artworks can be videos, drawings, and modelling of " +
      "characters (also known as GFXs). To become a staff member in this department, you will either ask " +
      "the staff members or wait until a position opens up, a notification in the department server would " +
      "pop up rarely as it's positions are constantly full.",
    table: {
      headers: ['Département', 'Commandant de Département', 'Executif de Département'],
      rows: [['Département des Propagande', 'Sgt-M. tobuyas', 'Cpl-F. Lovelyrules12']],
    },
  },
  {
    name: 'Département des Recrutement',
    intro:
      "This department focuses on the process of recruiting new people into 57e, recruiters are paid " +
      "handsomely, medals are also awarded to those who recruit enough people. They are also trained to " +
      "retain rankers, this means if a ranker is having problems with attendance during events or any other " +
      "problem, they can consult their recruiter or other trained staff members. The table below displays " +
      "the current staff members running this department.\n\nTo join this department of recruitment which " +
      "is highly reccomended, you must check the 57e Shouts channel, they drop a shout everyday so there's " +
      "no worry about it being too full, having too much members in this department is a good thing. Once " +
      "joined, you will be taught how to properly recruit a person with all procedures to avoid crucial " +
      "mistakes that takes other staff like the Dépôt de Montbéliard to do more excessive work. To become " +
      "staff in this department, you can check their shouts channel there and wait for an application that " +
      "would ping everyone, it is rare that it comes out though, you must follow through the process that " +
      "the application does, it would normally send you a link to a Microsoft forms to answer questions, " +
      "some are single answers and some would be longer.",
    table: {
      headers: ['Département', 'Commandant de Département', 'Executif de Département'],
      rows: [['Département des Recrutement', 'Sgt-M. nexxustheirinco', 'Adj. Pop_SamBlade']],
    },
  },
  {
    name: 'Département des Administration',
    intro:
      "This department within 57e specialises in logistical work that upkeeps the entirety of the regiment, " +
      "without it, advanced spreadsheets wouldn't exist to help with the management of rankers, medals, " +
      "ranks, etc. to join this department you must be in 57e for a while and achieve a rank of Caporal+ " +
      "then wait for an application which is rare and saught-after. After being accepted, you will be " +
      "taught on how to operate spreadsheets and other systems in the server too. The table below displays " +
      "the current staff members running this department. You can also join the department by already " +
      "being a staff member in another department or company that relies on spreadsheet work.",
    table: {
      headers: ['Département', 'Commandant de Département', 'Executif de Département'],
      rows: [['Département des Administration', 'Adj. Alynum', 'Adj. S_Cormac']],
    },
  },
  {
    name: 'Département des Drapeaux',
    intro:
      "Département des Drapeaux, also known as the Flag Defense Department is specialised in training new " +
      "members on how to properly protect and bear the company flag, becoming more proficient in this field " +
      "of work will grant medals and faster promotions. It is a tough job to take on within 57e, over time " +
      "it will become a piece of cake. The table below displays the current staff members running this " +
      "department.\n\nTo join this Department, you must have attended at least 1 battle and have the rank " +
      "of Soldat, look in the 57e shouts channel on the Deuxieme Discord server, the staff members there " +
      "release applications very regularly. Once joined, you can achieve a high FD rank by flag " +
      "guarding/bearing for a long time and earn medals such as the Médaille du Mérite Porte-Aigle (Bronze, " +
      "Silver, and Gold). To become a staff member you must do what was said before and wait for an " +
      "application that releases not very often, so keep an eye out if you are wanting to secure a spot as " +
      "an FD staff member.",
    table: {
      headers: ['Département', 'Commandant de Département', 'Executif de Département'],
      rows: [['Département des drapeaux', 'Adj-S. 1Tanyaaaaa', 'Adj. ahkdedn']],
    },
  },
]

export const fusiliersDepotParagraph =
  "Welcome to the Dépôt de Montbéliard, you are assigned to once you joined 57e, here Depot instructors are " +
  "always at the ready from Tuesday to Sunday, 30 minutes before rally time happens, the basic training " +
  "will be conducted to help new players adapt quicker to the genre by instructing them to understand key " +
  "instructions such as ping usage by officers, proper shooting techniques, melee drills (blobbing), " +
  "chanting, morale, company strength, and basic flag defense. After completing the 30-minute course, you " +
  "will be sent off to one of the fusilier companies to face head-on in a real battle with over 150 players " +
  "minimum! Instructors and fusilier staff are taught to become guardians for the new conscripts to guide " +
  "them through their journey in 57e until they become fully independent! The table below displays the " +
  "current staff members running this department.\n\nTo join this department, you must have the rank of " +
  "Caporal+. You must be able to listen and improve on your skills to become a depot instructor, you must " +
  "also have a professional demeanour at times that conscripts are present in the game, there will be an " +
  "instruction lesson and guides to follow. trolling during the physical examination of instructing " +
  "conscripts (Which would be staff members) will automatically grant you a fail. It's important to always " +
  "improve on instructing skills as lacking in it will also be another reason for a kick. Look out for a " +
  "special Depot instructor application in the 57e shouts channel on the Deuxieme Discord server. This " +
  "department is the rarest one to join out of the 5 Departments as it has only has 0-1 open slots at most " +
  "times. Now moving onto the fusilier companies! (Currently closed due to company reforms)"

export const fusiliersBattalionsParagraph =
  'The backbone battalions of the 57e, the most important one. These fusilier battalions is crucial to the ' +
  'development of the regiment as they are home to the 4 spectacular fusilier companies. The first fusilier ' +
  'battalion also known as "1er Battailon des Fusiliers de Alsace", home to the 1èr Fusiliers "Les ' +
  'Terribles" and 2ème Fusiliers "Martinique." They fit themselves with the iconic French blue uniforms ' +
  'within the Napoleonic Era with the only difference being the brass plate showing the regimental number ' +
  'of 57e and a short red plume on their blue pompoms, they now are the second level in the fusiliers with ' +
  'fewer rankers in their companies but it is made up of the highest attendance and kills, they are known ' +
  'to be the Fusilier Specialists. The second battalion, known as the "2eme Battailon des Fusiliers de ' +
  'Gironde" houses the third company known as 3ème Fusiliers "Rivoli" and forth, the 4ème Fusiliers ' +
  '"Borodino." They wear the standardised french infantry uniform with no differences to any other regiment ' +
  'except the 57e brass plate. the "2eme Battailon des Fusiliers de Gironde" will be the first home to ' +
  'newly graduated conscripts from the Dépôt de Montbéliard. these 2 battalions combined rally more than 80 ' +
  'fusiliers on weekdays and could be 100 on weekends, making the combined battalion larger than some ' +
  'nations and corps. (Below are the commanders, executive officers, and Etat majors of each company)'

export const voltigeursParagraph =
  'The 57e Voltigeurs are the middle child of 57e, they have 2 separate companies with the same looks, ' +
  'their names are 1er Voltigeurs des Liévin "Austerlitz" and 2eme Voltigeurs des Liévin "Arcole", their ' +
  'uniforms are the same as the fusilier but with green epaulettes and green and yellow accents in some ' +
  'areas, then a modified shako with a tall plume with green and yellow accents, their ammunition pouch is ' +
  'also different to the Fusiliers by having a bugle symbol, which represents skirmishing. their doctrine ' +
  'is similar to the other companies, but they are more reserved, sticking to good marksmanship over ' +
  'dangerous close-quarters melee combat, which gives them the upper hand when chasing weakened lines. To ' +
  'join this company, you must be able to get at least 45 or more kills per battle while being in one of ' +
  'the fusilier companies, you will be given a choice to be sent to the Voltigeurs or stay in Fusiliers.'

export const grenadiersParagraph =
  'The 57e Grenadiers are the best Company that 57e has to offer, whenever a tough matchup arises, they are ' +
  'responsible with dealing with the threat. 100% of Grenadiers were drafted from the Voltigeurs due to ' +
  'their outstanding performance as an ex-Voltigeur of 65 or more KPE, they are put through intense trials ' +
  'and training to prove that they belong there, once they become a full-time Grenadier, they will get ' +
  'access to more important battles. Historically, grenadiers of any line are known as frontline infantry ' +
  'that are made to spearhead an attack. Just like in real life, they also do this in game by committing to ' +
  'close-range engagements with enemies, with charges and shots so devastating, foes would pull and the ' +
  'Grenadiers would then focus on another line to support their allies, regardless of company strength. ' +
  'Their uniforms are a heavily modified Fusilier uniform, with red accents on their shakos, a pure red ' +
  "pair of epaulettes to cover the nakedness of their shoulders, a tall red plume similar to the " +
  "Voltigeur's, and an ammo pouch with a grenade symbol on it, not to mention that they have a height " +
  'increase by around 3-5%. The Grenadiers of 57e are a true force to not be reckoned with as they are ' +
  'known to be one of the best in NW France.'

export const grenadiersEliteParagraph =
  "To achieve this temporary position of Pendantif d'Elite you first be in the Grenadiers company which " +
  "takes months of being on the top of leaderboards for kills or flag guarding abilities and discipline " +
  "then you must keep striving to serve 57e and then HICOM will decide if you deserve this award which is " +
  "one of the hardest to achieve. Current limits for Pendantif d'Elites is 16."

export const sapeursParagraph =
  "The Sapeurs (Sappers) are one of the most prized positions within the regiment. There are usually have " +
  "only 5 members at a time, to be able to join this position, you must be in one of the three Fusilier " +
  "companies, Voltigeur, or Grenadier companies and be handpicked by the regimental COs, you must also " +
  "show extreme battle performance (High KPE, High Discipline, and High attendance) over all your peers."

export const commandStructureDate = '12th, August 2026'

export const commandStructureHQTable: InfoTable = {
  title: 'Quartier Général du 57ème',
  headers: ['Position', 'Rank', 'Username'],
  rows: [
    ['Surveillante du Régiment', 'GdB.', 'Dullqd'],
    ['Commandant de Regiment', 'GdB.', 'Vurellis'],
    ['Exécutif du Regiment', 'Maj.', 'JustinTheGreat2006'],
    ['Quartier Maître de Régiment', 'Adj.', 'Alynum'],
  ],
}

export const trivia: string[] = [
  'The 57e Grenadiers was the company that had the highest DPP and points in the French Side in one of the Northern German Campaign battles.',
  "The 57e Asia is one of the regiments that has never lost an Aigle (Eagle) ever in Empire Français, during a grand battle, a very rarely used flag which dons the Empire's glorious Eagle, Marcus. Along with its regimental number below the plate, the flag is blessed by Emperor Gory himself and losing it to enemy hands brings great shame.",
  "The 57e was one of General Gory's most loved regiments, the 57e has a special place in the Emperor's heart.",
  "The 57e was a super regiment back then in Maréchal Crusader's era, rallying around 100+ on weekdays.",
  'Despite being called "57e Grenadiers "Leipzig"" the Regiment did not fight at the actual Battle of Leipzig, and certainly meaning they were not in fact, a steel wall at Leipzig.',
  'Puppywad2, is the current main editor of this wiki page and was a sapeur in the past.',
  '57e is also featured in another Roblox game called "Blackpowder", costing 500 coins to unlock at tier 2.',
  '57e as of 16/06/2026 (DD/MM/YYYY), is the biggest regiment in the entirety of all Napoleonic Wars related genres, boasting 210+ active members in 1 campaign battle.',
]
