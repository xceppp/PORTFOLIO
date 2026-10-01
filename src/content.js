/** All visible French copy — edit here, not in components. */

export const site = {
  lang: 'fr',
  title: 'Zakaria CHALH · Directeur de l\'EST de Meknès',
  description:
    'Professeur d\'enseignement supérieur et Directeur de l\'École Supérieure de Technologie de Meknès. Automatique, systèmes, génie industriel et gouvernance universitaire.',
  ogImage: '/hero-industrial.png',
};

export const identity = {
  name: 'Zakaria CHALH',
  wordmark: 'Zakaria CHALH',
  academicTitle: 'Professeur d\'enseignement supérieur',
  role: 'Directeur de l\'École Supérieure de Technologie de Meknès',
  university: 'Université Moulay Ismaïl',
  universityShort: 'UMI',
  field: 'Génie industriel · Automatique · Systèmes',
  lab: 'LISA (Laboratoire d\'Ingénierie, Systèmes et Applications)',
  labDetail: 'ENSA Fès',
};

export const contacts = {
  email: 'zakaria.chalh@usmba.ac.ma',
  linkedin: 'https://www.linkedin.com/in/zakaria-chalh-50792981/',
  orcid: 'https://orcid.org/0000-0003-0838-4152',
  orcidId: '0000-0003-0838-4152',
  scopusId: '24172407700',
  scopus: 'https://www.scopus.com/authid/detail.uri?authorId=24172407700',
  sciprofiles: 'https://sciprofiles.com/profile/3252178',
};

export const announcement = {
  text: 'Directeur de l\'EST de Meknès depuis 2026 · Découvrir les projets structurants',
  href: '#pilotage',
};

export const nav = {
  links: [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Manifeste', href: '#manifeste' },
    { label: 'Trajectoire', href: '#trajectoire' },
    { label: 'Système', href: '#systeme' },
    { label: 'Transmission', href: '#transmission' },
    { label: 'Production', href: '#production' },
    { label: 'Pilotage', href: '#pilotage' },
    { label: 'Contact', href: '#contact' },
  ],
  orcid: 'ORCID',
  contact: 'Contact',
  contextMenu: {
    copyEmail: 'Copier l\'email',
    copyOrcid: 'Copier l\'identifiant ORCID',
    openOrcid: 'Ouvrir ORCID',
    copied: 'Copié',
  },
};

export const hero = {
  eyebrow: 'Professeur d\'enseignement supérieur · Université Moulay Ismaïl',
  name: 'Zakaria CHALH',
  title: 'Directeur de l\'École Supérieure de Technologie de Meknès',
  rotating: [
    {
      label: 'Enseignement',
      support: 'Plus de 15 ans d\'enseignement supérieur, en France et au Maroc.',
    },
    {
      label: 'Recherche',
      support: 'Automatique, systèmes 2D, énergie et robotique : 84 travaux recensés sur ORCID.',
    },
    {
      label: 'Gouvernance universitaire',
      support: 'À la tête de l\'EST de Meknès depuis 2026.',
    },
  ],
  ctaPrimary: 'Ouvrir le dossier',
  ctaPrimaryHref: '#manifeste',
  ctaSecondary: 'Contact',
  ctaSecondaryHref: '#contact',
  image: '/hero-industrial.png',
  imageFallback: '/hero-industrial.svg',
  imageAlt: 'Campus technologique et atmosphère industrielle',
};

export const manifeste = {
  id: 'manifeste',
  quote:
    'Enseignement, recherche et gouvernance universitaire : une expérience construite en France et au Maroc.',
  bio: 'Docteur en Automatique et Informatique Industrielle de l\'École Centrale de Lille (2008), Zakaria CHALH a exercé dans l\'enseignement supérieur en France et la recherche industrielle chez PSA avant de rejoindre l\'ENSA Fès en 2011. Professeur d\'enseignement supérieur depuis 2021, il dirige l\'EST de Meknès depuis 2026.',
  positioning:
    'À l\'intersection de l\'enseignement supérieur, de l\'ingénierie des systèmes et de la transformation institutionnelle. Un parcours de génie industriel construit entre la France et le Maroc.',
  portrait: '/portrait.png',
  portraitFallback: '/portrait.svg',
  portraitAlt: 'Pr Zakaria CHALH au pupitre',
};

/**
 * Same order as Trajectoire stops (first appearance, newest → oldest).
 * Real logos in /public/logos (rendered monochrome).
 */
export const establishments = [
  {
    id: 'umi-est',
    name: 'Université Moulay Ismaïl · EST de Meknès',
    logo: '/logos/umi-est.png',
    logos: ['/logos/umi-mark.png', '/logos/est-mark.png'],
    wide: true,
  },
  { id: 'ensa', name: 'ENSA Fès', logo: '/logos/ensa.png', tone: 'plate' },
  { id: 'usmba', name: 'Université Sidi Mohamed Ben Abdellah', logo: '/logos/usmba.png' },
  { id: 'lisa', name: 'Laboratoire LISA', logo: '/logos/lisa.png' },
  { id: 'psa', name: 'PSA Paris-Saclay', logo: '/logos/psa.svg' },
  { id: 'dijon', name: 'Université de Dijon', logo: '/logos/bourgogne.svg' },
  { id: 'utc', name: 'Université de technologie de Compiègne', logo: '/logos/utc.svg' },
  { id: 'ecl', name: 'École Centrale de Lille', logo: '/logos/centrale.png' },
  { id: 'lille', name: 'Université de Lille', logo: '/logos/lille.svg' },
];

export const instruments = {
  title: 'Repères',
  items: [
    { numeric: 15, prefix: '+', suffix: '', label: 'ans d\'enseignement supérieur', detail: 'France et Maroc' },
    { numeric: 84, prefix: '', suffix: '', label: 'travaux recensés sur ORCID', detail: 'Automatique, systèmes, énergie' },
    { numeric: 6, prefix: '', suffix: '', label: 'thèses soutenues', detail: '2018–2024' },
    { numeric: 79, prefix: '', suffix: '', label: 'projets de fin d\'études encadrés', detail: '2011–2022' },
    { numeric: 4, prefix: '', suffix: '', label: 'projets structurants', detail: 'Mandat EST de Meknès' },
    { numeric: 4, prefix: '', suffix: '', label: 'partenariats de coopération', detail: 'CNAM, ULCO, ENSIM et al.' },
  ],
};

export const keywords = [
  'Automatique',
  'Informatique industrielle',
  'Systèmes',
  'Gouvernance',
  'Génie industriel',
  'Industrie 4.0',
  'Mécatronique',
  'Systèmes 2D',
  'Commande robuste',
  'Énergie',
  'Robotique',
];

export const trajectoire = {
  id: 'trajectoire',
  title: 'Trajectoire',
  subtitle: 'Ligne du parcours — sélectionnez un arrêt pour lire le détail.',
  stations: [
    {
      years: 'Depuis 2026',
      role: 'Directeur de l\'EST de Meknès',
      institution: 'Université Moulay Ismaïl',
      place: 'Meknès',
      detail: 'Direction académique, administrative et transformation numérique.',
      current: true,
    },
    {
      years: '2020 — 2026',
      role: 'Chef du Département Génie Industriel',
      institution: 'ENSA Fès',
      place: 'Fès',
      detail: 'Coordination des équipes et des formations.',
      current: false,
    },
    {
      years: 'Depuis 2021',
      role: 'Professeur d\'enseignement supérieur',
      institution: 'ENSA Fès, Université Sidi Mohamed Ben Abdellah (USMBA)',
      place: 'Fès',
      detail: 'Professeur habilité de 2015 à 2021 ; professeur assistant de 2011 à 2015.',
      current: false,
    },
    {
      years: '2016 — 2018',
      role: 'Directeur adjoint du laboratoire LISA',
      institution: 'Laboratoire d\'Ingénierie, Systèmes et Applications',
      place: 'Fès',
      detail: 'Membre fondateur. Responsable de l\'équipe Mécatronique, Modélisation et Contrôle de 2018 à 2022.',
      current: false,
    },
    {
      years: '2012 — 2018',
      role: 'Coordonnateur de la filière Génie Industriel',
      institution: 'ENSA Fès',
      place: 'Fès',
      detail: 'Ingénierie pédagogique et suivi de la formation.',
      current: false,
    },
    {
      years: '2009 — 2011',
      role: 'Chargé de recherche — test et validation',
      institution: 'PSA, Paris-Saclay, France',
      place: 'Paris-Saclay',
      detail: 'Recherche industrielle.',
      current: false,
    },
    {
      years: '2007 — 2009',
      role: 'Attaché temporaire d\'enseignement et de recherche (ATER)',
      institution: 'Université de Dijon, puis Université de technologie de Compiègne',
      place: 'Dijon · Compiègne',
      detail: 'Université de Dijon (2007–2008), puis UTC (2008–2009).',
      current: false,
    },
    {
      years: '2004 — 2008',
      role: 'Doctorat en Automatique et Informatique Industrielle',
      institution: 'École Centrale de Lille',
      place: 'Lille',
      detail: 'Soutenance en mars 2008 — mention très honorable. Allocataire de recherche de 2004 à 2007.',
      current: false,
    },
    {
      years: '2004',
      role: 'DEA en Automatique et Informatique Industrielle',
      institution: 'Université de Lille',
      place: 'Lille',
      detail: 'Formation doctorale préparatoire.',
      current: false,
    },
    {
      years: '2003 · 2001',
      role: 'Maîtrises EEA et IEEA',
      institution: 'Université de Lille · FST de Fès',
      place: 'Lille · Fès',
      detail: 'Maîtrise EEA, option Automatique et Informatique Industrielle (2003) ; maîtrise IEEA, option Électronique, FST de Fès (2001).',
      current: false,
    },
    {
      years: '1999 · 1996',
      role: 'Formation scientifique initiale',
      institution: 'FST de Fès · lycée Ibn Elhaitem, Fès',
      place: 'Fès',
      detail: 'DEUG Physique-Chimie, option Physique (1999) ; baccalauréat scientifique (1996).',
      current: false,
    },
  ],
};

export const systeme = {
  id: 'systeme',
  title: 'Des systèmes intelligents, robustes et utiles.',
  sentence:
    'Les travaux s\'inscrivent dans le champ de l\'automatique et de l\'ingénierie, avec une attention particulière portée à la modélisation, la stabilité et la transformation industrielle.',
  annotations: 'modélisation · stabilité · mesure',
  loop: ['COMMANDE', 'SYSTÈME', 'MESURE', 'RETOUR'],
  tabs: [
    {
      id: 'automatique',
      label: 'Automatique',
      axis: 'Analyse & commande des systèmes',
      description:
        'Commande des systèmes sous-actionnés, approches graphiques et stabilisation des pendules sphériques inversés.',
      highlights: ['COMMANDE'],
    },
    {
      id: 'systemes',
      label: 'Systèmes',
      axis: 'Stabilité & réseaux',
      description:
        'Stabilité, commande et filtrage des systèmes bidimensionnels et multidimensionnels, notamment les systèmes 2D à retard.',
      highlights: ['SYSTÈME'],
    },
    {
      id: 'industrie',
      label: 'Industrie',
      axis: 'Énergie & robotique',
      description:
        'Systèmes hybrides solaires, systèmes à commutations, Power-to-X et asservissement visuel des robots manipulateurs.',
      highlights: ['MESURE', 'RETOUR'],
    },
  ],
};

export const transmission = {
  id: 'transmission',
  title: 'Transmission',
  teaching: [
    {
      title: 'Automatique et mécatronique',
      body: 'Automatique et systèmes, modélisation des systèmes dynamiques, électronique non linéaire, robotique industrielle, identification des systèmes et traitement du signal.',
    },
    {
      title: 'Informatique industrielle',
      body: 'Réseaux de Petri, modélisation et simulation de flux, bus CAN, LabVIEW et automates programmables industriels. Cours, TD et TP.',
    },
    {
      title: 'Ingénierie des formations',
      body: 'Contribution aux filières Mécatronique (2011), Génie Industriel et Génie Mécanique et Systèmes Automatisés (2014), Génie Énergétique et Systèmes Intelligents (2021). Renouvellement pédagogique du Génie Industriel en 2014 et 2024.',
    },
    {
      title: 'Formation continue & évaluation',
      body: 'Coordination du programme Bac+5 Management Industriel et Ingénierie. Expertise des projets de formation continue à l\'USMBA (2018–2020), auto-évaluation des filières et préparation des accréditations.',
    },
  ],
  interventions: 'Interventions : ENSA Fès, ENCG, FST, EuroMed, ESI2A.',
  pfe: {
    total: 79,
    segments: [
      { label: 'GMSA', count: 31 },
      { label: 'Génie Industriel', count: 29 },
      { label: 'Mécatronique', count: 15 },
      { label: 'Master IoT', count: 4 },
    ],
  },
  theses: {
    title: 'Thèses soutenues',
    rows: [
      {
        year: '2024',
        doctor: 'Narjiss Tilioua',
        subject: 'Les systèmes PLM (Product Lifecycle Management)',
      },
      {
        year: '2023',
        doctor: 'Mohamed Oubaidi',
        subject: 'Stabilité et commande des systèmes 2D',
      },
      {
        year: '2022',
        doctor: 'Boutaina Elkinany',
        subject: 'Commande des systèmes sous-actionnés',
      },
      {
        year: '2020',
        doctor: 'Khalid Badie',
        subject: 'Stabilité, commande et filtrage des systèmes bidimensionnels',
      },
      {
        year: '2019',
        doctor: 'Soukaina Krafes',
        subject: 'Contribution au développement des stratégies de stabilisation des pendules sphériques inversés',
      },
      {
        year: '2018',
        doctor: 'Abderrahim Frih',
        subject: 'Contribution par l\'approche graphique : de l\'analyse à la commande',
      },
    ],
    otherTopics:
      'Autres sujets doctoraux : microréseaux AC/DC, diagnostic photovoltaïque, navigation robotique, cobotique, hydrogène et ammoniac solaires, commande éolienne par IA, gestion énergétique des villes intelligentes.',
    jurys:
      'Participation à des jurys de doctorat et d\'habilitation (président, rapporteur ou examinateur).',
  },
};

export const production = {
  id: 'production',
  title: 'Production',
  conveyor: [
    'Delay-dependent H∞ filtering for 2D continuous state-delayed systems',
    'Comparative Assessment of Temporal Deep Learning Architectures for Photovoltaic–Thermal System Thermal Efficiency Forecasting',
    'Robust H∞ Filter Design for Uncertain 2-D Singular Continuous Systems With State-Varying Delay',
    'Robust Secure Tracking Control for Uncertain 2-D Discrete Systems in a Networked Environment',
    'A Sliding Mode MPPT for Photovoltaic Applications: Case of Storage Systems',
  ],
  shipped: {
    terminal: {
      command: 'orcid works --author 0000-0003-0838-4152',
      result: '✓ 84 travaux recensés',
      href: 'https://orcid.org/0000-0003-0838-4152',
    },
    latest: {
      year: '2026',
      title: 'Delay-dependent H∞ filtering for 2D continuous state-delayed systems',
      journal: 'International Journal of System of Systems Engineering',
    },
    sustainability: {
      year: '2026',
      title:
        'Comparative Assessment of Temporal Deep Learning Architectures for Photovoltaic–Thermal System Thermal Efficiency Forecasting',
      journal: 'Sustainability',
      authors: 'Z. Tadlaoui, S. Handa, B. Elkari, M. Malvoni et Y. Chaibi',
    },
  },
  publications: [
    {
      year: '2026',
      title: 'Delay-dependent H∞ filtering for 2D continuous state-delayed systems',
      journal: 'International Journal of System of Systems Engineering',
      authors: 'avec Laila Dami et Khalid Badie',
      doi: 'https://doi.org/10.1504/ijsse.2026.10065584',
    },
    {
      year: '2026',
      title:
        'Comparative Assessment of Temporal Deep Learning Architectures for Photovoltaic–Thermal System Thermal Efficiency Forecasting',
      journal: 'Sustainability',
      authors: 'avec Z. Tadlaoui, S. Handa, B. Elkari, M. Malvoni et Y. Chaibi',
      doi: 'https://doi.org/10.3390/su18136588',
    },
    {
      year: '2025',
      title:
        'Robust H∞ Filter Design for Uncertain 2-D Singular Continuous Systems With State-Varying Delay',
      journal: 'Mathematical Methods in the Applied Sciences',
      authors: null,
      doi: 'https://doi.org/10.1002/mma.10673',
    },
    {
      year: '2025',
      title:
        'Robust Secure Tracking Control for Uncertain 2-D Discrete Systems in a Networked Environment',
      journal: 'International Journal of Adaptive Control and Signal Processing',
      authors: null,
      doi: 'https://doi.org/10.1002/acs.3930',
    },
    {
      year: '2024',
      title: 'A Sliding Mode MPPT for Photovoltaic Applications: Case of Storage Systems',
      journal: 'IEEE GPECOM 2024',
      authors: null,
      doi: 'https://doi.org/10.1109/GPECOM61896.2024.10582752',
    },
  ],
  orcidLinkLabel: 'Consulter les 84 travaux sur ORCID',
};

export const pilotage = {
  id: 'pilotage',
  title: 'Pilotage',
  tabs: [
    {
      id: 'projets',
      label: 'Projets structurants',
      projects: [
        {
          name: 'Smart Digital EST',
          category: 'Transformation numérique',
          body: 'Écosystème intégré pour les notes, les délibérations, les ressources humaines, l\'inventaire et l\'infrastructure réseau.',
          featured: true,
        },
        {
          name: 'Industrie 4.0 & formations professionnalisantes',
          category: 'Formation',
          body: 'Développement de parcours alignés sur les mutations industrielles et les besoins du territoire.',
          featured: false,
        },
        {
          name: 'Management Industriel & Ingénierie',
          category: 'Formation continue',
          body: 'Programme Bac+5 conçu pour renforcer les compétences des cadres et professionnels de l\'industrie.',
          featured: false,
        },
        {
          name: 'Qualité et réussite étudiante',
          category: 'Gouvernance',
          body: 'Processus académiques lisibles, suivi régulier et culture de décision fondée sur les données.',
          featured: false,
        },
      ],
    },
    {
      id: 'gouvernance',
      label: 'Gouvernance',
      blocks: [
        {
          title: 'Conseils & commissions',
          body: 'Membre du Conseil de l\'Université USMBA (2018–2020 et 2025–2026), des commissions des affaires académiques et pédagogiques, et de la recherche et de la coopération. Membre élu du conseil de gestion en 2018 et 2019.',
        },
        {
          title: 'Gouvernance de l\'ENSA Fès',
          body: 'Participation au conseil d\'établissement, aux commissions pédagogique, scientifique et de suivi du budget, aux comités paritaires (2021–2026), ainsi qu\'à l\'élaboration des règlements intérieurs en 2021–2022.',
        },
        {
          title: 'Animation scientifique',
          body: 'Chair de CIMSI 2016, des journées de recherche inter-laboratoires et du Workshop on Complex Systems Engineering 2018. Organisation des congrès ICECS en 2021 et 2023 ; activités éditoriales et évaluation de manuscrits.',
        },
        {
          title: 'Engagement associatif',
          body: 'Participation aux associations AMID et AMTI, à l\'Association des Œuvres Sociales de l\'ENSA Fès et à la fondation du Centre de réflexion, de recherche et de proposition (2022).',
        },
      ],
    },
    {
      id: 'partenariats',
      label: 'Partenariats',
      entries: [
        {
          title: 'Coopération maroco-tunisienne',
          years: '2017–2019',
          body: 'Ingénierie des systèmes multiphysiques appliquée aux énergies renouvelables multisources (éolien, photovoltaïque).',
        },
        {
          title: 'Smart Medina & intelligence artificielle',
          years: '2020–2022',
          body: 'Projet Alkhawarizmi Smart Medina ; projet d\'IA pour la gestion de la thérapie nutritionnelle appliquée au diabète de type 2.',
        },
        {
          title: 'Double diplomation avec le CNAM',
          years: null,
          body: 'Double diplomation de formation continue Bac+3 avec le Conservatoire national des arts et métiers ; coordination de la formation de coordinateur technique pour l\'optimisation des énergies renouvelables.',
        },
        {
          title: 'Échanges & doubles diplômes',
          years: null,
          body: 'Conventions avec l\'école d\'ingénieurs de l\'Université du Littoral Côte d\'Opale (ULCO) et l\'École Nationale Supérieure d\'Ingénieurs du Mans (ENSIM).',
        },
      ],
    },
  ],
};

export const contact = {
  id: 'contact',
  title: 'Échanger avec la direction de l\'EST de Meknès',
  writeEmail: 'Écrire un email',
  copyEmail: 'Copier l\'email',
  copied: 'Copié',
};

export const footer = {
  columns: [
    {
      title: 'Dossier',
      links: [
        { label: 'Accueil', href: '#accueil' },
        { label: 'Manifeste', href: '#manifeste' },
        { label: 'Trajectoire', href: '#trajectoire' },
        { label: 'Système', href: '#systeme' },
        { label: 'Transmission', href: '#transmission' },
        { label: 'Production', href: '#production' },
        { label: 'Pilotage', href: '#pilotage' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Recherche',
      links: [
        { label: 'Système', href: '#systeme' },
        { label: 'Production', href: '#production' },
        { label: 'ORCID', href: 'https://orcid.org/0000-0003-0838-4152', external: true },
      ],
    },
    {
      title: 'Profils scientifiques',
      links: [
        { label: 'ORCID', href: 'https://orcid.org/0000-0003-0838-4152', external: true },
        {
          label: 'Scopus',
          href: 'https://www.scopus.com/authid/detail.uri?authorId=24172407700',
          external: true,
        },
        { label: 'SciProfiles', href: 'https://sciprofiles.com/profile/3252178', external: true },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/zakaria-chalh-50792981/',
          external: true,
        },
      ],
    },
    {
      title: 'Institution',
      links: [
        { label: 'EST de Meknès', href: '#pilotage' },
        { label: 'Université Moulay Ismaïl', href: '#accueil' },
        { label: 'Laboratoire LISA', href: '#systeme' },
      ],
    },
  ],
  copyright: '© Zakaria CHALH',
  theme: {
    system: 'Système',
    light: 'Clair',
    dark: 'Sombre',
  },
};

export const a11y = {
  skip: 'Aller au contenu',
  newTab: '(nouvel onglet)',
};
