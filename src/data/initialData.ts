import { CoachPersona, LifeQualityPillar, EvidenceEntry, LimitingBelief, DailyRitual, LifeQualityCheckpoint } from '../types';

export const COACH_PERSONAS: CoachPersona[] = [
  {
    id: 'cbt-mentor',
    name: 'Dr. Maya Vance',
    title: 'Cognitive & Mindset Mentor',
    avatarIcon: 'Brain',
    badge: 'CBT & Inner Critic',
    tagline: 'Dismantle limiting beliefs with evidence, compassion, and psychological flexibility.',
    systemInstruction:
      'You are Dr. Maya Vance, a world-class mentor in Cognitive Behavioral Psychology and self-compassion. ' +
      'Your role is to help users identify irrational negative self-talk, imposter feelings, and catastrophic predictions. ' +
      'Always respond warmly, validate emotional difficulty, help them separate facts from feelings, and guide them into constructive, realistic reframes. ' +
      'Never preach or use toxic positivity. Keep advice practical, research-backed, and concise.',
    promptStarters: [
      'I feel like an imposter and don’t deserve my current role.',
      'I made a mistake today and my inner critic is spiraling.',
      'Why do I constantly compare my progress to others on social media?',
      'How do I silence the voice that says "you are going to fail"?'
    ]
  },
  {
    id: 'courage-catalyst',
    name: 'Leo Brooks',
    title: 'Courage & Self-Trust Catalyst',
    avatarIcon: 'Flame',
    badge: 'Confidence & Action',
    tagline: 'Transform hesitation into bold action and build unshakeable trust in your own voice.',
    systemInstruction:
      'You are Leo Brooks, an executive courage and confidence coach. ' +
      'You believe self-belief is not a feeling you wait for—it is a muscle built through taking uncomfortable action. ' +
      'You are energetic, direct, deeply encouraging, and focused on helping the user step into their strength. ' +
      'Guide users to prepare for hard conversations, take calculated risks, and forgive past setbacks.',
    promptStarters: [
      'I have an intimidating meeting tomorrow and I feel unprepared.',
      'How do I stop seeking approval and trust my own decisions?',
      'I have a big dream but fear what friends/family will think.',
      'How do I step out of my comfort zone without feeling paralyzed?'
    ]
  },
  {
    id: 'life-quality-architect',
    name: 'Elena Chen',
    title: 'Life Quality & Balance Architect',
    avatarIcon: 'Sparkles',
    badge: 'Holistic Vitality',
    tagline: 'Harmonize your energy, boundaries, relationships, and daily peace of mind.',
    systemInstruction:
      'You are Elena Chen, a holistic life-quality strategist and burnout prevention specialist. ' +
      'You help people elevate their daily living standard: deep restorative sleep, emotional peace, clear boundaries, meaningful work, and intentional play. ' +
      'You ask thoughtful clarifying questions and design sustainable rhythms that honor human energy cycles.',
    promptStarters: [
      'I feel constantly drained and exhausted even after sleeping.',
      'How can I set firm boundaries with work without feeling guilty?',
      'I have lost touch with my passions and sense of play.',
      'Help me design an energizing morning routine that takes under 15 mins.'
    ]
  },
  {
    id: 'habit-strategist',
    name: 'Marcus Ray',
    title: '1% Habit & Momentum Strategist',
    avatarIcon: 'Target',
    badge: 'Consistency & Focus',
    tagline: 'Turn massive goals into effortless micro-actions that guarantee momentum.',
    systemInstruction:
      'You are Marcus Ray, an expert in behavioral economics, habit loops, and atomic consistency. ' +
      'You specialize in helping users overcome procrastination and paralysis by reducing friction and designing 2-minute starter habits. ' +
      'Keep your suggestions hyper-concrete, sequenced, and rewarding.',
    promptStarters: [
      'I struggle with procrastination on important tasks.',
      'How do I stay consistent when motivation disappears after a week?',
      'Help me break down writing a book / starting a project into 1% steps.',
      'What is the highest-leverage habit for building self-discipline?'
    ]
  }
];

export const INITIAL_PILLARS: LifeQualityPillar[] = [
  {
    id: 'mindset',
    name: 'Mindset & Self-Belief',
    score: 7,
    description: 'Internal dialogue, resilience under stress, self-compassion, and confidence in your potential.',
    iconName: 'ShieldCheck',
    color: 'emerald'
  },
  {
    id: 'vitality',
    name: 'Physical Vitality & Sleep',
    score: 6,
    description: 'Energy levels, restorative sleep quality, nourishing nutrition, and daily movement.',
    iconName: 'Activity',
    color: 'amber'
  },
  {
    id: 'purpose',
    name: 'Purpose & Meaningful Work',
    score: 8,
    description: 'Alignment between daily actions and core values, deep focus, and feeling of contribution.',
    iconName: 'Compass',
    color: 'blue'
  },
  {
    id: 'relationships',
    name: 'Relationships & Belonging',
    score: 7,
    description: 'Depth of close friendships, vulnerable communication, mutual support, and healthy boundaries.',
    iconName: 'Heart',
    color: 'rose'
  },
  {
    id: 'peace',
    name: 'Peace of Mind & Calm',
    score: 6,
    description: 'Ability to disconnect, lower anxiety, practice presence, and maintain financial clarity.',
    iconName: 'CloudSun',
    color: 'indigo'
  },
  {
    id: 'joy',
    name: 'Joy, Play & Renewal',
    score: 5,
    description: 'Time allocated for curiosity, unstructured fun, creativity, laughter, and hobbies.',
    iconName: 'SunMedium',
    color: 'violet'
  }
];

export const INITIAL_EVIDENCE: EvidenceEntry[] = [
  {
    id: 'ev-1',
    title: 'Completed a demanding project under strict deadline',
    category: 'resilience',
    description: 'Even when unexpected roadblocks occurred, I remained calm, prioritized essentials, and delivered on time.',
    date: 'Yesterday',
    strengthTag: 'Composure Under Pressure'
  },
  {
    id: 'ev-2',
    title: 'Spoke up honestly in a team meeting',
    category: 'courage',
    description: 'Voiced a different perspective instead of quietly agreeing. The team appreciated the fresh angle.',
    date: '3 days ago',
    strengthTag: 'Authentic Courage'
  },
  {
    id: 'ev-3',
    title: 'Maintained calm boundary with overtime requests',
    category: 'growth',
    description: 'Protected my evening rest without aggressive defensiveness or unnecessary apology.',
    date: 'Last week',
    strengthTag: 'Self-Respect'
  }
];

export const INITIAL_REFRAMES: LimitingBelief[] = [
  {
    id: 'ref-1',
    originalThought: 'I am way behind where I should be at this age.',
    situation: 'Seeing peers announce promotions and milestones on LinkedIn.',
    identifiedTrap: 'Social Comparison & Arbitrary Timelines',
    compassionateValidation: 'It is natural for the brain to scan for rank and status. However, comparing an unedited internal life to someone else\'s highlight reel is a false metric.',
    counterEvidenceQuestions: [
      'What unique hardships or pivots have shaped my wisdom that others never faced?',
      'Has my definition of a meaningful life evolved beyond mere superficial checkpoints?'
    ],
    empoweredReframe: 'I am not running anyone else’s race. Every challenge I have navigated has built specific depth and resilience that is unfolding on my own timeline.',
    microActionStep: 'Write down 3 things I know or can handle today that I couldn’t 2 years ago.',
    actionCompleted: true,
    createdAt: '2 days ago'
  }
];

export const INITIAL_RITUALS: DailyRitual[] = [
  {
    id: 'rit-1',
    title: 'Morning Anchor: 1 Self-Belief Proof & Intention',
    category: 'belief',
    streak: 4,
    completedToday: false
  },
  {
    id: 'rit-2',
    title: 'One 2-Minute Courageous Action (Uncomfortable thing first)',
    category: 'focus',
    streak: 3,
    completedToday: false
  },
  {
    id: 'rit-3',
    title: '3-Minute Physiological Reset (4-7-8 Breathing)',
    category: 'vitality',
    streak: 5,
    completedToday: false
  },
  {
    id: 'rit-4',
    title: 'Evening Win Log: Record 1 genuine victory of the day',
    category: 'gratitude',
    streak: 6,
    completedToday: false
  }
];

export const DAILY_WISDOM_QUOTES = [
  {
    quote: "You have been criticizing yourself for years and it hasn't worked. Try approving of yourself and see what happens.",
    author: "Louise Hay"
  },
  {
    quote: "Confidence is not 'they will like me.' Confidence is 'I'll be fine even if they don't.'",
    author: "Christina Grimmie"
  },
  {
    quote: "The quality of your life is directly proportional to the quality of your internal dialogue.",
    author: "Marcus Aurelius"
  },
  {
    quote: "Self-belief does not come from declarations in a mirror; it comes from having an undeniable stack of proof that you are who you say you are.",
    author: "Alex Hormozi"
  }
];

export const INITIAL_CHECKPOINTS: LifeQualityCheckpoint[] = [
  {
    id: 'chk-1',
    date: '6 Wks Ago',
    overallScore: 50,
    pillars: {
      mindset: 4,
      vitality: 4,
      purpose: 5,
      relationships: 6,
      peace: 4,
      joy: 3,
    },
    reflectionNote: 'Struggling with self-doubt and feeling overwhelmed by deadlines.',
  },
  {
    id: 'chk-2',
    date: '4 Wks Ago',
    overallScore: 56,
    pillars: {
      mindset: 5,
      vitality: 5,
      purpose: 6,
      relationships: 6,
      peace: 5,
      joy: 4,
    },
    reflectionNote: 'Began practicing daily gratitude and logging small wins.',
  },
  {
    id: 'chk-3',
    date: '3 Wks Ago',
    overallScore: 61,
    pillars: {
      mindset: 6,
      vitality: 5,
      purpose: 7,
      relationships: 7,
      peace: 5,
      joy: 4,
    },
    reflectionNote: 'Spoke up in meetings; started noticing imposter syndrome triggers.',
  },
  {
    id: 'chk-4',
    date: '2 Wks Ago',
    overallScore: 65,
    pillars: {
      mindset: 6,
      vitality: 6,
      purpose: 7,
      relationships: 7,
      peace: 6,
      joy: 5,
    },
    reflectionNote: 'Established firm work boundaries and protected evening sleep.',
  },
  {
    id: 'chk-5',
    date: '1 Wk Ago',
    overallScore: 68,
    pillars: {
      mindset: 7,
      vitality: 6,
      purpose: 8,
      relationships: 7,
      peace: 6,
      joy: 5,
    },
    reflectionNote: 'Reframed major inner critic fear before key client review.',
  },
];

