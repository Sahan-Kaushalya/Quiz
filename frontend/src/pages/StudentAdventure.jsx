import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Trophy,
  CircleUser,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Timer,
  Users,
  Lightbulb,
  Map,
  Medal,
  Sailboat,
  X,
  Calculator,
  FlaskConical,
  Swords,
  Heart,
  RotateCcw,
  AlertCircle,
  Award,
  ArrowRight,
  Trees,
  Gem,
  Flame,
  Loader2
} from 'lucide-react';

import { clearAuthSession } from '../services/authService';
import { StudentHeader, StudentSidebar, useToast } from '../ui';
import Footer from '../ui/Footer';
import logoicon from '../assets/icons/logo.png';
import {
  getAdventureQuests,
  submitAdventureQuest,
  getDailyTrials,
  submitDailyTrial,
  getDailyBonusStatus,
  claimDailyBonus,
  getAdventureLeaderboard,
  getHearts,
  deductHeart
} from '../services/appService';

// ─── Nav Items (same shape as StudentDashboard) ───────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Quizzes', icon: BookOpen, to: '/quizzes' },
  { label: 'Past Papers', icon: FileText, to: '/past-papers' },
  { label: 'Adventure', icon: Map, active: true },
  { label: 'Leading', icon: Trophy, to: '/leading' },
  { label: 'Profile', icon: CircleUser, to: '/profile' },
];

// ─── Zone Metadata ────────────────────────────────────────────────────────────
const DEFAULT_ZONES = [
  {
    id: 'grasslands',
    name: 'Zone 1: The Grasslands',
    shortName: 'Grasslands',
    xp: 300,
    gradient: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-300',
    shadowColor: 'shadow-emerald-200',
    bgLight: 'bg-emerald-50',
    icon: Trees,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAPwAsqYXSqgRrDSbL2Vtz_JdOi3q-ezfH_HOuDUWuL-GY9kM9hMBGroA4efJ0RFELkTWVdXyJnABoE8QY3K-gh6bZdp5_w2zPrjrDYHoW7saiLdqN3OUDTHEmlvMnj26HPLtdkaP5KBu8e5CdZ05XxU_aB9GBZk0flcc-HHn3rDp6guiDS8nMij_bF2UBTLM_e6TAqdCA7pI7mdKr-C4fMUVi5dsG7eYn_4X3RQS1Syn7WZKd8_9O5lNZsYLbrgyV4wToKwMl-AM',
    style: { bottom: '180px', left: '60px' },
    delay: '0s',
  },
  {
    id: 'crystal',
    name: 'Zone 2: Crystal Peaks',
    shortName: 'Crystal Peaks',
    xp: 500,
    gradient: 'from-blue-500 to-indigo-600',
    borderColor: 'border-primary',
    shadowColor: 'shadow-indigo-200',
    bgLight: 'bg-blue-50',
    icon: Gem,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgWyJjog-y8BnwZRVF23NUl8Xy-6uku7L-75LpmyGnye2UuNKD1reLAFRlPRGqef6c9utqqZgoxfbclSBmCQSTF6BAw7NGE6RBNoBoO98RO1_BAs4BgvCXAR_uhNejcYM5HsaNYZLvkbGCio215dOUTUBcFOL11ky0bbGYnsKU2_0kv1uX_Sb-DIJ2wDNnz3XEBBBPiAk-1qsdaz55H1ecu-IaAIDp8BDzoiXAk0C-ffbwYK8_ioFwPnvoenWiyYBuWKwtO1xoQFE',
    style: { bottom: '360px', left: '420px' },
    delay: '1.5s',
  },
  {
    id: 'volcanic',
    name: 'Zone 3: Volcanic Forge',
    shortName: 'Volcanic Forge',
    xp: 800,
    gradient: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-200',
    shadowColor: 'shadow-orange-100',
    bgLight: 'bg-orange-50',
    icon: Flame,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASgZju6Ac6ixylRarqD6PBtzNJi0Pwd_SSNJjpg03vwUnZStFwL6TzG0YvBi1NYuaemZjlDLrE7m61uRCX7103B8FxzYyXILlkf3t2VhmDzJl8SrhqXRELv7jGrZ-8vOuvA-cTLjYDCu9weQGKPyZWPqYaum-6R2c5gTApeFQ3qYTxWdRBjR3X1v-m67ONk-58AU8x6durwat_Y8onSB-GvzgX-OmGW33A1pFfnsBuGzAHASYVGrdTQGLqxs0jXHy2bIaeWGGlx3s',
    style: { top: '150px', right: '240px' },
    delay: '3s',
  },
];

// ─── Island SVG Illustrations ─────────────────────────────────────────────────
function IslandIllustration({ zone }) {
  const isCurrent = zone.status === 'current';
  const isLocked = zone.status === 'locked';
  const isCompleted = zone.status === 'completed';

  const dim = isCurrent ? 'w-64 h-44' : 'w-56 h-36';
  const borderCls = isCurrent
    ? 'border-4 border-indigo-600 shadow-2xl scale-105'
    : isCompleted
    ? 'border-2 border-emerald-400 shadow-lg'
    : 'border-2 border-slate-300 shadow-md';

  return (
    <div className={`${dim} ${borderCls} rounded-3xl flex items-center justify-center overflow-hidden relative bg-slate-100 transition-all duration-300`}>
      <img
        src={zone.imageUrl}
        alt={zone.name}
        className={`w-full h-full object-cover transition-all ${
          isLocked ? 'filter grayscale opacity-45' : 'opacity-90 group-hover:opacity-100'
        }`}
      />

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
          <div className="bg-emerald-500 text-white p-2 rounded-full shadow-md animate-pulse">
            <CheckCircle2 size={24} strokeWidth={3} />
          </div>
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white/80 p-3 rounded-full shadow-md text-slate-700">
            <Lock size={32} strokeWidth={2.5} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quest Detail Modal ───────────────────────────────────────────────────────
function QuestModal({ zone, onClose, onStartQuest, hearts, toast }) {
  if (!zone) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[550px] rounded-[2rem] border border-slate-200 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="text-[#a16207] font-bold uppercase tracking-widest text-xs">Mega Zone Challenge</span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">{zone.shortName} Quest</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black mb-5 shadow-xs">
          <Star size={13} strokeWidth={0} fill="white" />
          {zone.xp} XP Reward
        </div>

        <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
          Conquer this zone by completing all subject trials. Earn the{' '}
          <span className="text-[#c26200] font-black">"{zone.shortName} Champion"</span>{' '}
          badge and a massive XP boost!
        </p>

        {zone.trials.length > 0 ? (
          <div className="space-y-3 mb-6">
            {zone.trials.map((trial) => {
              const TrialIcon = trial.icon;
              const isCompleted = trial.status === 'completed';
              const isLocked = trial.status === 'locked';
              const isActive = trial.status === 'active';

              return (
                <div
                  key={trial.id}
                  className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-600'
                          : isLocked
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={18} strokeWidth={2.25} />
                      ) : (
                        <TrialIcon size={18} strokeWidth={2.25} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">{trial.name}</div>
                      <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${trial.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        ✓ Completed
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                        Locked
                      </span>
                    )}
                    {isActive && (
                      <button
                        disabled={hearts === 0}
                        onClick={() => {
                          if (hearts === 0) {
                            toast.error("No hearts left! Wait for recovery.");
                            return;
                          }
                          onStartQuest(zone.id, trial);
                        }}
                        className={`font-black text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                          hearts === 0 
                            ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed border border-slate-200' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_2.5px_0_0_#9a3412] active:translate-y-0.5 active:shadow-none'
                        }`}
                      >
                        <Swords size={12} strokeWidth={2.5} />
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
            <Lock size={20} className="text-slate-400" />
            <p className="text-xs text-slate-500">Complete previous zones to unlock this challenge.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Animated Path SVG ───────────────────────────────────────────────────────
function QuestPath({ mergedZones, mapWidth }) {
  const getZonePoint = (z) => ({
    x: z.pos_x + 112,
    y: 800 - z.pos_y - 56
  });

  const points = [
    { x: 80, y: 660 },
    ...mergedZones.map(getZonePoint)
  ];

  // Helper to generate S-curve between two points
  const getBezierPath = (p1, p2) => {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    const dx = x2 - x1;
    const cx1 = x1 + dx * 0.5;
    const cy1 = y1;
    const cx2 = x1 + dx * 0.5;
    const cy2 = y2;
    return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
  };

  return (
    <svg 
      className="absolute inset-0 z-0 pointer-events-none" 
      style={{ width: `${mapWidth}px`, height: '800px' }}
      viewBox={`0 0 ${mapWidth} 800`}
    >
      <defs>
        <style>{`
          .path-dash-anim {
            stroke-dasharray: 16, 12;
            animation: pathOffsetAnim 15s linear infinite;
          }
          @keyframes pathOffsetAnim {
            to { stroke-dashoffset: -200; }
          }
          .wave-motion {
            animation: waveWiggle 4s ease-in-out infinite alternate;
          }
          @keyframes waveWiggle {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(4px, 2px) scale(1.05); }
          }
        `}</style>
        
        <g id="map-wave" stroke="#7dd3fc" strokeWidth="2.5" fill="none" strokeLinecap="round" className="wave-motion">
          <path d="M 0,5 Q 10,0 20,5 T 40,5" />
          <path d="M 5,12 Q 15,7 25,12 T 45,12" opacity="0.6" />
        </g>
        
        <g id="map-tree">
          <ellipse cx="0" cy="-12" rx="7" ry="10" fill="#22c55e" />
          <ellipse cx="-4" cy="-10" rx="5" ry="7" fill="#4ade80" />
          <rect x="-1.5" y="-3" width="3" height="8" fill="#78350f" />
        </g>

        <g id="starfish" fill="#f43f5e" opacity="0.7">
          <path d="M 0,-6 L 2,-2 L 6,-2 L 3,1 L 5,5 L 0,3 L -5,5 L -3,1 L -6,-2 L -2,-2 Z" />
        </g>
      </defs>

      <g stroke="#0284c7" strokeWidth="1" strokeDasharray="3, 15" opacity="0.12">
        <line x1="150" y1="0" x2="150" y2="800" />
        <line x1="350" y1="0" x2="350" y2="800" />
        <line x1="550" y1="0" x2="550" y2="800" />
        <line x1="750" y1="0" x2="750" y2="800" />
        <line x1="950" y1="0" x2="950" y2="800" />
        <line x1="1150" y1="0" x2="1150" y2="800" />

        <line x1="0" y1="150" x2="1200" y2="150" />
        <line x1="0" y1="350" x2="1200" y2="350" />
        <line x1="0" y1="550" x2="1200" y2="550" />
        <line x1="0" y1="750" x2="1200" y2="750" />
      </g>

      <g transform="translate(100, 110)" opacity="0.35">
        <circle cx="0" cy="0" r="36" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="2, 4" />
        <circle cx="0" cy="0" r="44" fill="none" stroke="#0284c7" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="#0284c7" />
        <polygon points="0,-36 4,-8 0,0" fill="#0284c7" />
        <polygon points="0,-36 -4,-8 0,0" fill="#0369a1" />
        <polygon points="0,36 4,8 0,0" fill="#0284c7" />
        <polygon points="0,36 -4,8 0,0" fill="#0369a1" />
        <polygon points="36,0 8,4 0,0" fill="#0284c7" />
        <polygon points="36,0 8,-4 0,0" fill="#0369a1" />
        <polygon points="-36,0 -8,4 0,0" fill="#0284c7" />
        <polygon points="-36,0 -8,-4 0,0" fill="#0369a1" />
        <text x="-4" y="-40" fill="#0284c7" fontSize="10" fontWeight="bold">N</text>
        <text x="-3" y="48" fill="#0284c7" fontSize="10" fontWeight="bold">S</text>
      </g>

      {/* Render segments dynamically */}
      {mergedZones.map((zone, idx) => {
        const p1 = points[idx];
        const p2 = points[idx + 1];
        if (!p1 || !p2) return null;
        
        const pathData = getBezierPath(p1, p2);
        const isActive = zone.status === 'completed' || zone.status === 'current';

        return (
          <g key={zone.id}>
            {isActive ? (
              <>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="opacity-15"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#fea619"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="opacity-80"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="path-dash-anim"
                />
              </>
            ) : (
              <>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="opacity-40"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="8, 10"
                />
              </>
            )}
          </g>
        );
      })}

      <use href="#map-wave" x="250" y="220" />
      <use href="#map-wave" x="700" y="580" />
      <use href="#map-wave" x="180" y="440" />
      <use href="#map-wave" x="1050" y="480" />
      <use href="#map-wave" x="420" y="680" opacity="0.5" />
      <use href="#map-wave" x="880" y="140" opacity="0.5" />

      <use href="#starfish" x="310" y="630" />
      <use href="#starfish" x="620" y="490" />
      
      <use href="#map-tree" x="110" y="580" />
      <use href="#map-tree" x="190" y="590" />
      <use href="#map-tree" x="480" y="320" />
      <use href="#map-tree" x="520" y="310" />
      <use href="#map-tree" x="800" y="270" />
    </svg>
  );
}

// ─── Floating Island Card ─────────────────────────────────────────────────────
function IslandCard({ zone, index, onSelect }) {
  const isLocked = zone.status === 'locked';
  const isCurrent = zone.status === 'current';
  const isCompleted = zone.status === 'completed';

  const labelText = isLocked 
    ? `Zone ${index + 1}: Locked` 
    : zone.name;

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ ...zone.style, animationDelay: zone.delay }}
    >
      {isCurrent && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full font-black text-[11px] tracking-wider uppercase animate-bounce whitespace-nowrap shadow-lg z-25">
          CURRENT QUEST
        </div>
      )}

      <button
        onClick={() => !isLocked && onSelect(zone)}
        className={`group relative flex flex-col items-center island-float transition-all duration-300 ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
        }`}
        style={{ animationDelay: zone.delay }}
        title={isLocked ? 'Complete previous zones to unlock' : zone.name}
        aria-label={zone.name}
      >
        {!isLocked && (
          <div className="absolute -top-3 -right-3 z-20 bg-amber-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-black shadow-md">
            <Star size={11} strokeWidth={0} fill="white" />
            {zone.xp} XP
          </div>
        )}

        <IslandIllustration zone={zone} />

        <div
          className={`mt-4 px-5 py-2 rounded-full shadow-md font-label-lg text-label-lg whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
            isCurrent
              ? 'bg-white border-2 border-indigo-600 text-indigo-700 font-headline-md text-headline-md shadow-indigo-100'
              : isCompleted
              ? 'bg-white border border-emerald-300 text-emerald-700 font-bold'
              : 'bg-slate-50 border border-slate-200 text-slate-400 font-medium'
          }`}
        >
          {!isLocked && <zone.icon size={14} className="shrink-0" />}
          {labelText}
        </div>
      </button>
    </div>
  );
}

// ─── Quest Play Arena View ───────────────────────────────────────────────────
function QuestPlayArena({ activeQuest, onFinish, onCancel, hearts, onIncorrectAnswer }) {
  const questions = activeQuest.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(hearts);
  const [showHint, setShowHint] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Keep lives in sync with parent hearts if changed
  useEffect(() => {
    setLives(hearts);
  }, [hearts]);

  const currentQuestion = questions[currentIndex];
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      const optionsCopy = [...currentQuestion.options];
      for (let i = optionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
      }
      setShuffledOptions(optionsCopy);
    } else {
      setShuffledOptions([]);
    }
  }, [currentIndex, currentQuestion]);

  const handleSelectOption = (opt) => {
    if (isChecked) return;
    setSelectedOption(opt);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption.isCorrect;
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setUserAnswers(prev => [...prev, selectedOption.label]);
    } else {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      
      onIncorrectAnswer().then((updatedHearts) => {
        setLives(updatedHearts);
        if (updatedHearts <= 0) {
          setIsFailed(true);
        }
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish(activeQuest, userAnswers);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setLives(hearts);
    setShowHint(false);
    setIsFailed(false);
    setUserAnswers([]);
  };

  if (isFailed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'radial-gradient(circle, #fef2f2 0%, #fee2e2 70%, #fecaca 100%)' }}>
        <div className="bg-white/80 backdrop-blur-md w-full max-w-5xl rounded-[2.5rem] p-8 border border-red-200 shadow-2xl animate-[popIn_0.3s_ease-out]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto mb-6">
            <Heart size={44} className="fill-red-500 animate-pulse" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-headline-lg text-red-700 mb-2">No Lives Left!</h2>
          <p className="text-body-md text-on-surface-variant mb-8 font-medium">
            Don't worry, scholar! Every mistake is a step towards mastery. Let's try this challenge again.
          </p>
          <div className="space-y-3">
            <button
              disabled={hearts === 0}
              onClick={handleRetry}
              className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                hearts === 0 
                  ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed border border-slate-200' 
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_0_0_#7f1d1d] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              <RotateCcw size={20} strokeWidth={2.5} />
              Try Again
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Return to Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Zone specific themes
  let bgGradient = 'from-violet-500 to-purple-600';
  let themeTitleColor = 'text-purple-700';
  let accentColor = 'bg-purple-600';
  let shadowBtn = '#3b0764';
  let challengeTitle = activeQuest.isTrial ? 'Daily Trial' : 'Adventure Quest';

  if (activeQuest.zoneId === 'grasslands') {
    bgGradient = 'from-emerald-400 to-teal-500';
    themeTitleColor = 'text-emerald-700';
    accentColor = 'bg-emerald-600';
    shadowBtn = '#064e3b';
  } else if (activeQuest.zoneId === 'crystal') {
    bgGradient = 'from-blue-500 to-indigo-600';
    themeTitleColor = 'text-blue-700';
    accentColor = 'bg-blue-600';
    shadowBtn = '#1d1092';
  } else if (activeQuest.zoneId === 'volcanic') {
    bgGradient = 'from-orange-400 to-red-500';
    themeTitleColor = 'text-orange-700';
    accentColor = 'bg-orange-600';
    shadowBtn = '#7f1d1d';
  }

  const progressPercentage = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className={`flex-1 flex flex-col min-h-full overflow-y-auto p-4 md:p-8 bg-linear-to-br ${bgGradient} relative`}>
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className={`w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-5 md:p-8 shadow-2xl my-auto transition-transform ${shakeCard ? 'animate-shake' : ''}`}>
        
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div>
              <span className={`text-xs font-black uppercase tracking-wider ${themeTitleColor}`}>{challengeTitle}</span>
              <h3 className="font-black text-slate-800 text-xl md:text-2xl mt-0.5">{activeQuest.name}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-4 py-2 rounded-full shadow-xs shrink-0">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={18}
                className={i < lives ? 'fill-red-500 text-red-500' : 'text-slate-300'}
                strokeWidth={2.25}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className={themeTitleColor}>Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-slate-500">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${accentColor}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-snug">
              {currentQuestion?.text}
            </h1>
            {currentQuestion?.hint && (
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100 cursor-pointer shadow-xs shrink-0"
              >
                <Lightbulb size={13} className={showHint ? 'fill-amber-400 text-amber-500' : 'text-amber-500'} />
                {showHint ? 'Hide Hint' : 'Hint'}
              </button>
            )}
          </div>

          {showHint && currentQuestion?.hint && (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 p-4 text-sm leading-relaxed text-amber-900 flex items-start gap-2.5 animate-[popIn_0.2s_ease-out]">
              <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-amber-800">Challenge Hint:</p>
                <p className="mt-0.5 font-medium">{currentQuestion.hint}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {shuffledOptions.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === option;
              
              let optStyle = 'border-slate-200 bg-white text-slate-800 hover:border-indigo-600 hover:-translate-y-0.5 shadow-sm';
              let letterStyle = 'bg-slate-100 text-slate-500';

              if (isChecked) {
                if (option.isCorrect) {
                  optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_4px_0_0_#10b981]';
                  letterStyle = 'bg-emerald-500 text-white';
                } else if (isSelected) {
                  optStyle = 'border-rose-500 bg-rose-50 text-rose-900 shadow-[0_4px_0_0_#ef4444]';
                  letterStyle = 'bg-rose-500 text-white';
                } else {
                  optStyle = 'border-slate-200 bg-white text-slate-300 opacity-50 pointer-events-none';
                  letterStyle = 'bg-slate-100 text-slate-300';
                }
              } else if (isSelected) {
                optStyle = `border-indigo-600 bg-indigo-50 text-indigo-900 shadow-[0_4px_0_0_#4f46e5]`;
                letterStyle = 'bg-indigo-600 text-white';
              }

              return (
                <button
                  key={idx}
                  disabled={isChecked}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center gap-3.5 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150 cursor-pointer ${optStyle}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black text-sm transition-colors ${letterStyle}`}>
                    {optionLetter}
                  </span>
                  <span className="text-lg font-black">{option.label}</span>
                </button>
              );
            })}
          </div>

          {isChecked && (
            <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed border-l-4 animate-[popIn_0.2s_ease-out] ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-rose-50 text-rose-800 border-rose-500'}`}>
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Correct!
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-rose-500" />
                    Incorrect!
                  </>
                )}
              </div>
              <p className="font-semibold text-xs opacity-90">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 pt-5 flex justify-end">
          {!isChecked ? (
            <button
              disabled={!selectedOption}
              onClick={handleCheck}
              className={`w-full md:w-auto px-10 py-4 text-base font-black rounded-full text-white transition-all shadow-[0_4px_0_0_${shadowBtn}] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer ${accentColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={isCorrect ? handleNext : () => { setIsChecked(false); setSelectedOption(null); }}
              className={`w-full md:w-auto px-10 py-4 text-base font-black rounded-full text-white transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_0_0_${shadowBtn}] ${accentColor}`}
            >
              {isCorrect ? (
                <>
                  Next Question
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              ) : (
                <>
                  <RotateCcw size={18} strokeWidth={2.5} />
                  Try Again
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Quest Success Screen Component ──────────────────────────────────────────
function QuestSuccessScreen({ activeQuest, onClaim }) {
  let bgGradient = 'from-violet-500 to-purple-600';
  let textAccent = 'text-purple-600';
  let badgeBorder = 'border-purple-200';
  let btnShadow = '#3b0764';
  let btnBg = 'bg-purple-600';
  const ZoneIcon = activeQuest.zoneId === 'grasslands' ? Trees : (activeQuest.zoneId === 'crystal' ? Gem : (activeQuest.zoneId === 'volcanic' ? Flame : Award));

  if (activeQuest.zoneId === 'grasslands') {
    bgGradient = 'from-emerald-400 to-teal-500';
    textAccent = 'text-emerald-600';
    badgeBorder = 'border-emerald-200';
    btnShadow = '#064e3b';
    btnBg = 'bg-emerald-600';
  } else if (activeQuest.zoneId === 'crystal') {
    bgGradient = 'from-blue-500 to-indigo-600';
    textAccent = 'text-indigo-600';
    badgeBorder = 'border-indigo-200';
    btnShadow = '#1d1092';
    btnBg = 'bg-indigo-600';
  } else if (activeQuest.zoneId === 'volcanic') {
    bgGradient = 'from-orange-400 to-red-500';
    textAccent = 'text-red-600';
    badgeBorder = 'border-red-200';
    btnShadow = '#7f1d1d';
    btnBg = 'bg-red-600';
  }

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-linear-to-br ${bgGradient} relative overflow-hidden min-h-full`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;
          const scale = 0.5 + Math.random() * 1;
          const rotate = Math.random() * 360;
          return (
            <div
              key={i}
              className="absolute w-4 h-4 bg-white/30 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
              }}
            />
          );
        })}
      </div>

      <div className="bg-white/95 backdrop-blur-md w-full max-w-5xl rounded-[3rem] p-6 md:p-8 border border-white/20 shadow-2xl text-center relative z-10 animate-[popIn_0.35s_ease-out]">
        
        <div className={`w-24 h-24 rounded-full border-4 ${badgeBorder} bg-linear-to-br from-amber-300 via-yellow-400 to-amber-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl relative animate-[islandFloat_3s_infinite_alternate]`}>
          <Award size={56} className="text-white drop-shadow-md" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 bg-white text-amber-500 p-1 rounded-full shadow-md">
            <ZoneIcon size={20} />
          </div>
        </div>

        <span className={`text-xs font-black uppercase tracking-widest ${textAccent} bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100`}>
          Challenge Cleared!
        </span>

        <h1 className="text-3xl md:text-4xl font-headline-lg text-slate-900 mt-4 mb-2">
          Awesome Job, Scholar!
        </h1>
        
        <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
          You conquered the <span className="font-black text-slate-900">{activeQuest.name}</span> challenge successfully!
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-black text-amber-700 mt-1">+{activeQuest.xpReward} XP</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Level Boost</span>
          </div>
          <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl">🏆</span>
            <span className="text-xl font-black text-indigo-700 mt-1">+1 Star</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Zone Token</span>
          </div>
        </div>

        {activeQuest.badgeAwarded && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8 text-left flex items-start gap-3 animate-bounce">
            <Award size={24} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-sm text-emerald-800">Badge Earned!</h4>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                Congratulations! You unlocked the **{activeQuest.badgeAwarded.name}** badge!
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClaim}
          style={{ boxShadow: `0 4px 0 0 ${btnShadow}` }}
          className={`w-full ${btnBg} text-white font-black py-4 rounded-2xl hover:scale-105 active:scale-95 active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer text-lg`}
        >
          Claim Rewards & Return
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentAdventure() {
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const mapRef = useRef(null);

  // DB backed states
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [dbAdventureData, setDbAdventureData] = useState(null);
  const [dailyTrials, setDailyTrials] = useState([]);
  const [bonusState, setBonusState] = useState({ canClaim: true, secondsRemaining: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [sideTab, setSideTab] = useState('trials'); // 'trials' | 'ranks'
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);

  const [hearts, setHearts] = useState(3);
  const [regenSeconds, setRegenSeconds] = useState(0);

  const [activeQuest, setActiveQuest] = useState(null);
  const [successQuest, setSuccessQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const questRes = await getAdventureQuests();
      if (questRes.status === 'success') {
        setDbAdventureData(questRes.data);
        setHearts(questRes.data?.hearts !== undefined ? questRes.data.hearts : 3);
        setRegenSeconds(questRes.data?.nextHeartRegenInSeconds || 0);

        if (questRes.data?.zonesList) {
          const mappedDbZones = questRes.data.zonesList.map(z => {
            let icon = Trees;
            if (z.id === 'crystal') icon = Gem;
            else if (z.id === 'volcanic') icon = Flame;

            return {
              id: z.id,
              name: z.name,
              shortName: z.short_name,
              xp: z.xp,
              gradient: z.gradient,
              borderColor: z.border_color,
              shadowColor: z.shadow_color,
              bgLight: z.bg_light,
              icon,
              imageUrl: z.image_url,
              style: { bottom: `${z.pos_y}px`, left: `${z.pos_x}px` },
              delay: z.delay,
              pos_x: z.pos_x,
              pos_y: z.pos_y
            };
          });
          setZones(mappedDbZones);
        }
      }

      const trialsRes = await getDailyTrials();
      if (trialsRes.status === 'success') {
        setDailyTrials(trialsRes.data || []);
      }

      const bonusRes = await getDailyBonusStatus();
      if (bonusRes.status === 'success') {
        setBonusState(bonusRes.data);
      }

      const lbRes = await getAdventureLeaderboard();
      if (lbRes.status === 'success') {
        setLeaderboard(lbRes.data || []);
      }
    } catch (err) {
      console.error('Error loading database adventure map:', err);
      toast.error('Could not connect to adventure data service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncorrectAnswer = async () => {
    try {
      const res = await deductHeart();
      if (res.status === 'success') {
        setHearts(res.data.hearts);
        setRegenSeconds(res.data.nextHeartRegenInSeconds);
        return res.data.hearts;
      }
    } catch (err) {
      console.error("Error deducting heart:", err);
    }
    return hearts - 1;
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Heart recovery timer ticking
  useEffect(() => {
    if (regenSeconds <= 0) return;

    const timer = setInterval(() => {
      setRegenSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          loadAllData();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [regenSeconds]);

  // Daily bonus timer ticking
  useEffect(() => {
    if (bonusState.secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setBonusState(prev => {
        if (prev.secondsRemaining <= 1) {
          clearInterval(timer);
          return { canClaim: true, secondsRemaining: 0 };
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bonusState.secondsRemaining]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Center map on the active/current quest island on mount
  useEffect(() => {
    const el = mapRef.current;
    if (el) {
      el.scrollLeft = 80;
    }
  }, [activeQuest, successQuest, dbAdventureData]);

  const handleStartQuest = (zoneId, trial) => {
    setSelectedZone(null);
    setActiveQuest({ zoneId, ...trial });
  };

  const handleFinishQuest = async (quest, answers) => {
    setActiveQuest(null);
    try {
      let res;
      if (quest.isTrial) {
        res = await submitDailyTrial(quest.id, { answers });
      } else {
        res = await submitAdventureQuest(quest.id, { answers });
      }

      if (res.status === 'success') {
        setSuccessQuest({
          ...quest,
          xpReward: res.data?.xpGained || quest.xp_reward || 150,
          badgeAwarded: res.data?.badgeAwarded
        });
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        toast.error(res.message || 'Verification failed. Try again!');
      }
    } catch (err) {
      toast.error(err.message || 'Validation error occured.');
    }
  };

  const handleClaimRewards = () => {
    setSuccessQuest(null);
    loadAllData();
  };

  const handleClaimDailyBonus = async () => {
    if (isClaimingBonus || !bonusState.canClaim) return;
    setIsClaimingBonus(true);
    try {
      const res = await claimDailyBonus();
      if (res.status === 'success') {
        toast.success('🎉 claimed daily bonus (+10 XP)!');
        window.dispatchEvent(new Event('profileUpdated'));
        loadAllData();
      } else {
        toast.error(res.message || 'Daily bonus claim rejected.');
      }
    } catch (err) {
      toast.error(err.message || 'Error claiming bonus.');
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Merge state status with definitions
  const mergedZones = zones.map(zone => {
    const zoneState = dbAdventureData?.[zone.id] || { status: 'locked', trials: [] };
    const dbTrials = zoneState.trials || [];
    const totalDbXp = dbTrials.reduce((sum, t) => sum + (t.xp_reward || 0), 0);
    const displayXp = totalDbXp > 0 ? totalDbXp : zone.xp;

    const trialsWithIcons = dbTrials.map(staticTrial => {
      let icon = BookOpen;
      const lowerName = staticTrial.name?.toLowerCase() || '';
      if (lowerName.includes('math') || lowerName.includes('number') || lowerName.includes('slope')) icon = Calculator;
      else if (lowerName.includes('science') || lowerName.includes('eco') || lowerName.includes('thermal') || lowerName.includes('chem')) icon = FlaskConical;
      
      return {
        ...staticTrial,
        icon
      };
    });

    return {
      ...zone,
      xp: displayXp,
      status: zoneState.status,
      trials: trialsWithIcons
    };
  });

  const maxZoneX = zones.reduce((max, z) => Math.max(max, z.pos_x || 0), 0);
  const mapWidth = Math.max(1200, maxZoneX + 250);

  if (activeQuest) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white font-body-md animate-[popIn_0.25s_ease-out]">
        <QuestPlayArena
          activeQuest={activeQuest}
          onFinish={handleFinishQuest}
          onCancel={() => setActiveQuest(null)}
          hearts={hearts}
          onIncorrectAnswer={handleIncorrectAnswer}
        />
      </div>
    );
  }

  if (successQuest) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white font-body-md animate-[popIn_0.25s_ease-out]">
        <QuestSuccessScreen
          activeQuest={successQuest}
          onClaim={handleClaimRewards}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800 font-body-md">
      <StudentSidebar
        items={NAV_ITEMS}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex flex-col min-h-screen ml-0 md:ml-64">
        <StudentHeader
          onMenuClick={() => setSidebarOpen((v) => !v)}
          onLogout={handleLogout}
        />

        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Map Section */}
          <div className="relative flex-1 overflow-hidden" style={{ background: 'radial-gradient(circle, #f0f9ff 0%, #e0f2fe 70%, #bae6fd 100%)' }}>
            {/* Hearts recovery widget */}
            {!isLoading && (
              <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-3xl p-3 px-5 shadow-xl flex items-center gap-4 transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((num) => (
                    <Heart
                      key={num}
                      size={20}
                      className={`transition-all duration-300 ${
                        num <= hearts
                          ? 'text-red-500 fill-red-500 animate-pulse'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {hearts < 3 && (
                  <div className="flex flex-col justify-center border-l border-slate-100 pl-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Next Heart</span>
                    <span className="text-xs font-black text-slate-700 font-mono mt-1">{formatTime(regenSeconds)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-8 left-10 w-32 h-20 bg-white rounded-full blur-xl opacity-60" />
              <div className="absolute top-36 right-16 w-48 h-28 bg-white rounded-full blur-2xl opacity-50" />
              <div className="absolute bottom-24 left-1/3 w-64 h-32 bg-white rounded-full blur-3xl opacity-40" />
              <div className="absolute bottom-10 right-1/4 w-40 h-24 bg-white rounded-full blur-2xl opacity-45" />
            </div>

            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-white/40 backdrop-blur-xs z-30">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="mt-3 text-sm font-black">Loading Database Quests Map...</p>
              </div>
            ) : (
              <div
                ref={mapRef}
                className="relative w-full h-full overflow-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#fea619 transparent' }}
              >
                <div className="relative shrink-0" style={{ width: `${mapWidth}px`, height: '800px' }}>
                  <QuestPath
                    mergedZones={mergedZones}
                    mapWidth={mapWidth}
                  />

                  <div className="absolute z-10 opacity-40" style={{ top: '420px', left: '160px' }}>
                    <Sailboat size={56} className="text-blue-400 animate-pulse" strokeWidth={1.5} />
                  </div>

                  {mergedZones.map((zone, index) => (
                    <IslandCard
                      key={zone.id}
                      zone={zone}
                      index={index}
                      onSelect={(z) => {
                        if (z.status === 'completed') {
                          toast.success("🏆 You have already completed this zone quest!");
                          return;
                        }
                        setSelectedZone(z);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Panel - Tab system */}
          <aside className="hidden xl:flex flex-col w-80 shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-6">
              {/* Tab Header */}
              <div className="flex border-b border-slate-100 mb-5">
                <button
                  onClick={() => setSideTab('trials')}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition border-b-2 ${
                    sideTab === 'trials' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Daily Trials
                </button>
                <button
                  onClick={() => setSideTab('ranks')}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition border-b-2 ${
                    sideTab === 'ranks' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Adventure Ranks
                </button>
              </div>

              {sideTab === 'trials' ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700 text-sm">Today's Challenges</h3>
                    {dailyTrials.length > 0 && (
                      <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        {dailyTrials.filter(t => !t.isCompleted).length} NEW
                      </span>
                    )}
                  </div>

                  {dailyTrials.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No daily trials active for today.</p>
                  ) : (
                    dailyTrials.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          if (ch.isCompleted) {
                            toast.success("🎉 You have already completed this daily trial today!");
                            return;
                          }
                          setSelectedTrial(ch);
                        }}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-primary/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 bg-indigo-100 rounded-xl text-indigo-700`}>
                            <Timer size={18} strokeWidth={2.25} />
                          </div>
                          {ch.isCompleted ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Completed</span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Active</span>
                          )}
                        </div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                          {ch.title}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 mb-3 line-clamp-2">{ch.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-[#b45309] uppercase tracking-wider">{ch.type} Challenge</span>
                          <span className="text-xs font-black text-primary">+{ch.xp_reward} XP</span>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Pro Tip Strategy */}
                  <div className="mt-8 p-5 bg-[#e0e7ff] rounded-2xl text-[#1e1b4b] relative overflow-hidden shadow-xs border border-indigo-100">
                    <div className="relative z-10">
                      <div className="font-black text-sm uppercase tracking-wider mb-1">Explorer Tips</div>
                      <p className="text-xs opacity-90 mb-4 leading-relaxed font-semibold">
                        Complete weekly zone adventure quests to unlock special champion badges!
                      </p>
                      <button
                        onClick={() => setIsStrategyOpen(true)}
                        className="bg-white hover:bg-slate-100 text-indigo-700 font-black py-2 px-4 rounded-xl text-xs transition-transform shadow-xs cursor-pointer"
                      >
                        View Strategy
                      </button>
                    </div>
                    <Lightbulb
                      size={100}
                      strokeWidth={1}
                      className="absolute -bottom-4 -right-4 text-indigo-500/10 -rotate-12"
                    />
                  </div>
                </div>
              ) : (
                // Leaderboard Tab
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700 text-sm">Zone Rankings</h3>
                    <Trophy size={14} className="text-amber-500" />
                  </div>

                  {leaderboard.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Leaderboard calculations in progress...</p>
                  ) : (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {leaderboard.map((student, sIdx) => {
                        const isTop3 = student.rank <= 3;
                        let rankStyle = "bg-slate-100 text-slate-600";
                        if (student.rank === 1) rankStyle = "bg-amber-500 text-white shadow-xs font-black";
                        else if (student.rank === 2) rankStyle = "bg-slate-400 text-white font-black";
                        else if (student.rank === 3) rankStyle = "bg-amber-700 text-white font-black";

                        return (
                          <div
                            key={student.id}
                            className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border ${
                              student.name === dbAdventureData?.currentUserName
                                ? 'bg-indigo-50 border-indigo-200'
                                : 'bg-slate-50 border-transparent hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${rankStyle}`}>
                                {student.rank}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                                <img
                                  src={student.profile_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
                                  alt={student.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{student.name}</p>
                                <p className="text-[9px] text-slate-500 font-semibold uppercase">Lvl {student.level}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-indigo-700 whitespace-nowrap">{student.xp} XP</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Sidebar bottom – Claim Daily Bonus */}
              <button
                disabled={isClaimingBonus || !bonusState.canClaim}
                onClick={handleClaimDailyBonus}
                className={`w-full mt-6 text-white font-black py-4 rounded-xl shadow-[0_4px_0_0_#9a3412] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  bonusState.canClaim
                    ? 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02]'
                    : 'bg-slate-300 shadow-none translate-y-0.5 cursor-not-allowed opacity-75'
                }`}
              >
                <Star size={18} strokeWidth={0} fill="currentColor" />
                {bonusState.canClaim ? 'Claim Daily Bonus (+10 XP)' : `Bonus Claimed (${formatTime(bonusState.secondsRemaining)})`}
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Quest Modal */}
      {selectedZone && (
        <QuestModal
          zone={mergedZones.find(z => z.id === selectedZone.id)}
          onClose={() => setSelectedZone(null)}
          onStartQuest={handleStartQuest}
          hearts={hearts}
          toast={toast}
        />
      )}

      {/* Daily Trial Modal Overlay */}
      {selectedTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs" onClick={() => setSelectedTrial(null)}>
          <div className="bg-white w-full max-w-[480px] rounded-[2rem] border border-slate-200 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">Daily Micro Trial</span>
                <h3 className="text-xl font-black text-slate-800 mt-2">{selectedTrial.title}</h3>
              </div>
              <button onClick={() => setSelectedTrial(null)} className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-5">
              {selectedTrial.description}
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reward Amount</span>
                <span className="text-sm font-black text-primary">{selectedTrial.xp_reward} XP</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions count</span>
                <span className="text-sm font-black text-slate-700">{selectedTrial.questions?.length || 0} Challenges</span>
              </div>
            </div>

            {selectedTrial.isCompleted ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-500 font-bold py-4 rounded-2xl cursor-not-allowed text-center text-sm border border-slate-300"
              >
                Already Completed Today
              </button>
            ) : (
              <button
                disabled={hearts === 0}
                onClick={() => {
                  if (hearts === 0) {
                    toast.error("No hearts left! Wait for recovery.");
                    return;
                  }
                  const challengeObj = {
                    id: selectedTrial.id,
                    name: selectedTrial.title,
                    questions: selectedTrial.questions,
                    xp_reward: selectedTrial.xp_reward,
                    isTrial: true
                  };
                  setSelectedTrial(null);
                  setActiveQuest(challengeObj);
                }}
                className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                  hearts === 0 
                    ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed border border-slate-200' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_4px_0_0_#4a044e] hover:scale-[1.02] active:translate-y-1 active:shadow-none'
                }`}
              >
                <Swords size={16} strokeWidth={2.5} />
                Enter Trial Arena
              </button>
            )}
          </div>
        </div>
      )}

      {/* Strategy Popup Modal */}
      {isStrategyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs" onClick={() => setIsStrategyOpen(false)}>
          <div className="bg-white w-full max-w-[480px] rounded-[2rem] border border-slate-200 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Lightbulb size={20} className="text-amber-500" />
                Adventure Strategy Tips
              </h3>
              <button onClick={() => setIsStrategyOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-500">
                <X size={18} />
              </button>
            </div>
            
            <ul className="space-y-3.5 my-6 text-xs text-slate-600 font-medium leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full shrink-0 font-extrabold text-[10px]">1</span>
                <span>Complete **Daily Trials** first to build a learning habit and gain quick, consistent XP.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full shrink-0 font-extrabold text-[10px]">2</span>
                <span>If you get stuck on a quest, click the **💡 Hint** button. It won't affect your final rewards!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full shrink-0 font-extrabold text-[10px]">3</span>
                <span>Track the **Adventure Ranks** daily to compare your learning progress and compete with other top students.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full shrink-0 font-extrabold text-[10px]">4</span>
                <span>Try to finish zones sequentially to unlock exclusive badges like the **Grasslands Champion** badge!</span>
              </li>
            </ul>

            <button
              onClick={() => setIsStrategyOpen(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl border border-slate-300 transition-all cursor-pointer text-xs text-center"
            >
              Close Strategy Panel
            </button>
          </div>
        </div>
      )}

      {/* Floating animations style */}
      <style>{`
        .island-float {
          animation: islandFloat 6s ease-in-out infinite;
        }
        @keyframes islandFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        div[style*="scrollbarColor"]::-webkit-scrollbar { width: 6px; height: 6px; }
        div[style*="scrollbarColor"]::-webkit-scrollbar-track { background: transparent; }
        div[style*="scrollbarColor"]::-webkit-scrollbar-thumb { background: #fea619; border-radius: 10px; }
      `}</style>
    </div>
  );
}
