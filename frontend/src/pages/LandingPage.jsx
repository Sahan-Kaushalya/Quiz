import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";import {
  LogIn, UserPlus, Trophy, ChevronLeft, ChevronRight,
  Calculator, Globe, Leaf, Brain, Zap, FileText,
  Quote, ArrowRight, Mail, Phone, MapPin, Check, Star, Award ,
  BookOpen, Diamond, Sparkles,
} from "lucide-react";

import logoicon from "../assets/icons/logo.png";
import aimimg from "../assets/images/Learning-cuate.png";
import books from "../assets/images/books.png";
import exam from "../assets/images/exam.png";
import prize from "../assets/images/prize.png";
import Footer from '../ui/Footer';

const SLIDES = [
  {
    id: 1,
    title: "Master Every Subject",
    sinhala: "විෂය සියල්ල ජය ගන්න",
    desc: "Comprehensive practice for Mathematics, Sinhala, Environment & IQ — all in one place.",
    cta: "Start Practicing",
    ctaGo: "/quizzes",
    bg: "from-indigo-50 via-blue-50 to-purple-50",
    accent: "#4F46E5",
    emoji: <img src={books} alt="books" className="object-contain w-auto h-26" />,
  },
  {
    id: 2,
    title: "Real Past Papers",
    sinhala: "පසුගිය ප්‍රශ්න පත්‍ර",
    desc: "Practice with years of authentic Grade 5 scholarship exam papers in a timed environment.",
    cta: "Try Past Papers",
    ctaGo: "/past-papers",
    bg: "from-orange-50 via-amber-50 to-yellow-50",
    accent: "#D97706",
    emoji: <img src={exam} alt="exam" className="object-contain w-auto h-26" />,
  },
  {
    id: 3,
    title: "Climb the Leaderboard",
    sinhala: "ශ්‍රේණි ගත වන්න",
    desc: "Compete with students across Sri Lanka, earn badges and see your rank rise every day.",
    cta: "Join Now",
    ctaGo: "/leading",
    bg: "from-emerald-50 via-teal-50 to-cyan-50",
    accent: "#059669",
    emoji: <img src={prize} alt="prize" className="object-contain w-auto h-26" />,
  },
];

const SUBJECTS = [
  {
    icon: Calculator,
    label: "Mathematics",
    sinhala: "ගණිතය",
    desc: "Numbers, geometry, and problem-solving skills.",
    gradient: "from-indigo-500 to-blue-600",
    softBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    glow: "hover:shadow-indigo-100",
    questions: "142 Questions",
  },
  {
    icon: Globe,
    label: "Sinhala",
    sinhala: "සිංහල",
    desc: "Grammar, comprehension, and vocabulary practice.",
    gradient: "from-orange-400 to-amber-500",
    softBg: "bg-orange-50",
    iconColor: "text-orange-500",
    badge: "bg-orange-100 text-orange-700",
    glow: "hover:shadow-orange-100",
    questions: "98 Questions",
  },
  {
    icon: Leaf,
    label: "Environment",
    sinhala: "පරිසරය",
    desc: "Nature, society, and general knowledge topics.",
    gradient: "from-emerald-500 to-teal-600",
    softBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    glow: "hover:shadow-emerald-100",
    questions: "120 Questions",
  },
  {
    icon: Brain,
    label: "IQ",
    sinhala: "සාමාන්‍ය දැනීම",
    desc: "Logic puzzles, patterns, and critical thinking.",
    gradient: "from-purple-500 to-violet-600",
    softBg: "bg-purple-50",
    iconColor: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    glow: "hover:shadow-purple-100",
    questions: "85 Questions",
  },
];

const WHY_CARDS = [
  {
    icon: Zap,
    label: "Fun Quizzes",
    desc: "Interactive questions for Grade 5 syllabus to make learning feel like a game.",
    gradient: "from-indigo-500 to-blue-600",
    softBg: "from-indigo-50 to-blue-50",
    iconRing: "ring-indigo-200",
    number: "01",
  },
  {
    icon: FileText,
    label: "Past Papers",
    desc: "Access years of real scholarship exam past papers in a timed, realistic environment.",
    gradient: "from-emerald-500 to-teal-600",
    softBg: "from-emerald-50 to-teal-50",
    iconRing: "ring-emerald-200",
    number: "02",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    desc: "Compete across Sri Lanka. Earn stars, badges, and climb to the top!",
    gradient: "from-amber-400 to-orange-500",
    softBg: "from-amber-50 to-orange-50",
    iconRing: "ring-amber-200",
    number: "03",
  },
];

const TESTIMONIALS = [
  {
    name: "Kavindi Perera",
    school: "Ananda Balika Vidyalaya, Colombo",
    text: "Quiz Master නිසා පාඩම් කරන එක ගොඩක් විනෝදජනක වුණා! මාස දෙකක් එක දිගට පුහුණු වෙලා මගේ ලකුණු 60 ඉඳන් 88 දක්වා වැඩි කරගන්න මට පුළුවන් වුණා.",
    stars: 5,
    initials: "KP",
    gradient: "from-indigo-500 to-purple-600",
    score: "88/100",
  },
  {
    name: "Thisura Jayasinghe",
    school: "Nalanda College, Kandy",
    text: "පසුගිය විභාග ප්‍රශ්න පත්‍ර (Past Papers) කොටස ඉතාමත් විශිෂ්ටයි. විභාගයේ නියම ආකෘතිය තේරුම් ගන්න සහ විභාග දවසේදී කාලය නිවැරදිව කළමනාකරණය කරගන්න ඒක මට ගොඩක් උදව් වුණා.",
    stars: 5,
    initials: "TJ",
    gradient: "from-emerald-500 to-teal-600",
    score: "92/100",
  },
  {
    name: "Amaya Silva",
    school: "Visakha Vidyalaya, Colombo",
    text: "මම leaderboard එකට ගොඩක් ආසයි! අනෙක් සිසුන් එක්ක තරඟ කරන එක, මට හැමදාම වැරදීමකින් තොරව පුහුණු වෙන්න ලොකු උනන්දුවක් දෙනවා",
    stars: 5,
    initials: "AS",
    gradient: "from-amber-400 to-orange-500",
    score: "95/100",
  },
  {
    name: "Dineth Rathnayake",
    school: "Richmond College, Galle",
    text: "The IQ section really sharpened my thinking. I went from struggling with logic puzzles to solving them in seconds!",
    stars: 5,
    initials: "DR",
    gradient: "from-pink-500 to-rose-500",
    score: "90/100",
  },
  {
    name: "Sachini Fernando",
    school: "Musaeus College, Colombo",
    text: "Both Sinhala and English support made it so easy for me. My parents could help me study using the Sinhala interface.",
    stars: 5,
    initials: "SF",
    gradient: "from-blue-500 to-indigo-600",
    score: "87/100",
  },
  {
    name: "Anura Rathnayake",
    school: "Richmond College, Galle",
    text: "IQ කොටස නිසා මගේ හිතන්න පුළුවන් හැකියාව ගොඩක් වැඩි වුණා. ඉස්සර තර්කන ගැටලු (logic puzzles) විසඳන්න අමාරු වුණත්, දැන් මට ඒවා තත්පර කිහිපයකින් විසඳන්න පුළුවන්!",
    stars: 5,
    initials: "DR",
    gradient: "from-pink-500 to-rose-500",
    score: "98/100",
  },
  {
    name: "Ayodhya Fernando",
    school: "Musaeus College, Colombo",
    text: "සිංහල සහ ඉංග්‍රීසි භාෂා දෙකෙන්ම සහය දක්වන නිසා මට වැඩේ ගොඩක් ලේසි වුණා. සිංහල interface එක නිසා මගේ දෙමව්පියන්ටත් මට පාඩම් වැඩවලට උදව් කරන්න පුළුවන් වුණා.",
    stars: 5,
    initials: "SF",
    gradient: "from-blue-500 to-indigo-600",
    score: "97/100",
  },
];

const themeColors = {
  indigo: {
    primaryText: "text-indigo-700",
    hoverText: "text-indigo-600",
    bgLight: "bg-indigo-100",
    bgSoft: "bg-indigo-50",
    bgGradient: "from-indigo-600 to-purple-700",
    shadow: "shadow-indigo-100/60",
    accentGlow: "hover:shadow-indigo-100",
    border: "border-indigo-600",
    buttonBg: "bg-indigo-700",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
    loaderColor: "text-indigo-600"
  },
  emerald: {
    primaryText: "text-emerald-700",
    hoverText: "text-emerald-600",
    bgLight: "bg-emerald-100",
    bgSoft: "bg-emerald-50",
    bgGradient: "from-emerald-600 to-teal-700",
    shadow: "shadow-emerald-100/60",
    accentGlow: "hover:shadow-emerald-100",
    border: "border-emerald-600",
    buttonBg: "bg-emerald-700",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    loaderColor: "text-emerald-600"
  },
  violet: {
    primaryText: "text-violet-700",
    hoverText: "text-violet-600",
    bgLight: "bg-violet-100",
    bgSoft: "bg-violet-50",
    bgGradient: "from-violet-600 to-indigo-700",
    shadow: "shadow-violet-100/60",
    accentGlow: "hover:shadow-violet-100",
    border: "border-violet-600",
    buttonBg: "bg-violet-700",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    loaderColor: "text-violet-600"
  },
  rose: {
    primaryText: "text-rose-700",
    hoverText: "text-rose-600",
    bgLight: "bg-rose-100",
    bgSoft: "bg-rose-50",
    bgGradient: "from-rose-600 to-pink-700",
    shadow: "shadow-rose-100/60",
    accentGlow: "hover:shadow-rose-100",
    border: "border-rose-600",
    buttonBg: "bg-rose-700",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    loaderColor: "text-rose-600"
  },
  sky: {
    primaryText: "text-sky-700",
    hoverText: "text-sky-600",
    bgLight: "bg-sky-100",
    bgSoft: "bg-sky-50",
    bgGradient: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-100/60",
    accentGlow: "hover:shadow-sky-100",
    border: "border-sky-600",
    buttonBg: "bg-sky-600",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    loaderColor: "text-sky-600"
  }
};

function PageBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#F0EEFF] via-[#FAF9FF] to-[#F0FFF8]" />

      {/* Blobs */}
      <div className="absolute left-[-10%] top-[-5%] h-125 w-125 rounded-full bg-indigo-200 opacity-20 blur-[100px]" />
      <div className="absolute right-[-8%] top-[15%] h-112.5 w-112.5 rounded-full bg-amber-200 opacity-25 blur-[90px]" />
      <div className="absolute bottom-[-5%] left-[30%] h-100 w-100 rounded-full bg-emerald-200 opacity-20 blur-[80px]" />
      <div className="absolute right-[20%] top-[40%] h-80 w-80 rounded-full bg-orange-100 opacity-30 blur-[80px]" />

      {/* Decorative icons ΓÇö Stars (amber outline) */}
      <Star
        size={60}
        strokeWidth={1.5}
        className="absolute left-[8%] top-[12%] rotate-[-15deg] text-amber-300 opacity-50"
        fill="none"
      />
      <Star
        size={36}
        strokeWidth={1.5}
        className="absolute left-[12%] top-[20%] rotate-10 text-amber-300 opacity-35"
        fill="none"
      />
      <Star
        size={48}
        strokeWidth={1.5}
        className="absolute right-[10%] top-[8%] rotate-20 text-amber-300 opacity-40"
        fill="none"
      />
      <Star
        size={28}
        strokeWidth={1.5}
        className="absolute right-[16%] top-[18%] rotate-[-8deg] text-amber-200 opacity-50"
        fill="none"
      />
      <Star
        size={44}
        strokeWidth={1.5}
        className="absolute left-[5%] top-[55%] rotate-12 text-amber-200 opacity-30"
        fill="none"
      />
      <Star
        size={32}
        strokeWidth={1.5}
        className="absolute right-[6%] top-[60%] rotate-[-20deg] text-amber-300 opacity-35"
        fill="none"
      />

      {/* Decorative icons ΓÇö Book (lavender/purple) */}
      <BookOpen
        size={70}
        strokeWidth={1.2}
        className="absolute bottom-[18%] left-[4%] rotate-[-10deg] text-indigo-300 opacity-30"
        fill="none"
      />
      <BookOpen
        size={42}
        strokeWidth={1.2}
        className="absolute right-[8%] top-[45%] rotate-15 text-purple-300 opacity-25"
        fill="none"
      />

      {/* Decorative icons Diamond/Gem (green) */}
      <Diamond
        size={50}
        strokeWidth={1.2}
        className="absolute left-[45%] top-[30%] rotate-12 text-emerald-300 opacity-25"
        fill="none"
      />
      <Diamond
        size={30}
        strokeWidth={1.2}
        className="absolute right-[22%] top-[70%] rotate-[-15deg] text-teal-300 opacity-30"
        fill="none"
      />

      {/* Sparkles */}
      <Sparkles
        size={38}
        strokeWidth={1.2}
        className="absolute left-[25%] top-[8%] text-indigo-200 opacity-40"
      />
      <Sparkles
        size={26}
        strokeWidth={1.2}
        className="absolute right-[30%] top-[85%] text-purple-200 opacity-35"
      />
    </div>
  );
}


function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}


function HeroCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const go = (idx) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrent((idx + SLIDES.length) % SLIDES.length);
      setFading(false);
    }, 280);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(current + 1), 4500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden border shadow-2xl rounded-3xl border-white/70 shadow-indigo-100/60" style={{ minHeight: 350 }}>
      <div className={`absolute inset-0 bg-linear-to-br ${slide.bg} transition-all duration-500`} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -right-10 -top-10 h-44 w-44 opacity-20 blur-2xl" style={{ background: slide.accent }} />
        <div className="absolute rounded-full -bottom-8 -left-8 h-36 w-36 opacity-15 blur-2xl" style={{ background: slide.accent }} />
      </div>

      <div
        className="relative z-10 flex flex-col items-center gap-6 px-8 py-10 transition-opacity duration-300 md:flex-row md:px-10 md:py-12"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="flex-1 text-left">
          <p className="mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: slide.accent }}>Quiz Master</p>
          <h2 className="mb-1 text-2xl font-black leading-tight text-gray-900 md:text-3xl">{slide.title}</h2>
          <p className="mb-2 text-base font-bold" style={{ color: slide.accent }}>{slide.sinhala}</p>
          <p className="mb-6 text-xs leading-relaxed text-gray-600 max-w-svh ">{slide.desc}</p>
          <button onClick={() => navigate(slide.ctaGo)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            style={{ background: slide.accent, boxShadow: `0 5px 0 0 ${slide.accent}88` }}
          >
            {slide.cta} <ArrowRight size={15} />
          </button>
        </div>
        <div className="flex items-center justify-center text-6xl border shadow-inner select-none shrink-0 h-28 w-28 rounded-2xl border-white/60 bg-white/50 backdrop-blur-sm md:h-36 md:w-36 md:text-7xl">
          {slide.emoji}   
        </div>
      </div>

      <button onClick={() => go(current - 1)} className="absolute z-20 flex items-center justify-center w-6 h-6 text-gray-600 transition-all -translate-y-1/2 rounded-full shadow-md left-3 top-1/2 bg-white/80 backdrop-blur-sm hover:scale-110 hover:bg-white">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => go(current + 1)} className="absolute z-20 flex items-center justify-center w-6 h-6 text-gray-600 transition-all -translate-y-1/2 rounded-full shadow-md right-3 top-1/2 bg-white/80 backdrop-blur-sm hover:scale-110 hover:bg-white">
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === current ? 22 : 7, background: i === current ? slide.accent : "#CBD5E1" }} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCarousel({ testimonials = [] }) {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const timerRef = useRef(null);

  const go = (idx) => {
    if (sliding || testimonials.length <= 1) return;
    setSliding(true);
    setTimeout(() => {
      setCurrent((idx + testimonials.length) % testimonials.length);
      setSliding(false);
    }, 300);
  };

  useEffect(() => {
    if (testimonials.length <= 3) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  // If testimonials count <= 3, show them statically without a slider
  if (testimonials.length <= 3) {
    return (
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-3 justify-center max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={t.name + i}
            className="relative overflow-hidden rounded-md border border-white/80 bg-white/70 p-6 shadow-lg shadow-indigo-100/40 backdrop-blur-sm transition-all"
          >
            {/* Top accent */}
            <div className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${t.gradient}`} />

            <Quote size={28} className="absolute text-indigo-100 right-4 top-4" />

            <StarRating count={t.stars} />

            <p className="my-4 text-sm leading-relaxed text-gray-600">"{t.text}"</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {t.profile_url ? (
                  <img
                    src={t.profile_url}
                    alt={t.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{ display: t.profile_url ? 'none' : 'flex' }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-xs font-black text-white shadow-md`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.school}</p>
                </div>
              </div>
              {t.score && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
                  {t.score}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Build visible 3 (for carousel when count > 3)
  const visible = [0, 1, 2].map((offset) => testimonials[(current + offset) % testimonials.length]);

  return (
    <div className="relative">
      {/* Cards */}
      <div
        className="grid gap-5 transition-opacity duration-300 sm:grid-cols-1 md:grid-cols-3"
        style={{ opacity: sliding ? 0 : 1 }}
      >
        {visible.map((t, i) => (
          <div
            key={t.name + i}
            className={`relative overflow-hidden rounded-md border border-white/80 bg-white/70 p-6 shadow-lg shadow-indigo-100/40 backdrop-blur-sm transition-all ${i === 1 ? "md:scale-[1.03] md:shadow-xl md:shadow-indigo-100/60" : ""}`}
          >
            {/* Top accent */}
            <div className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${t.gradient}`} />

            <Quote size={28} className="absolute text-indigo-100 right-4 top-4" />

            <StarRating count={t.stars} />

            <p className="my-4 text-sm leading-relaxed text-gray-600">"{t.text}"</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {t.profile_url ? (
                  <img
                    src={t.profile_url}
                    alt={t.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{ display: t.profile_url ? 'none' : 'flex' }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-xs font-black text-white shadow-md`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.school}</p>
                </div>
              </div>
              {t.score && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
                  {t.score}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => go(current - 1)}
          className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-all border border-indigo-200 rounded-full shadow-sm bg-white/80 backdrop-blur-sm hover:bg-indigo-50 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="h-2 transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                background: i === current ? "#4F46E5" : "#C7D2FE",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(current + 1)}
          className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-all border border-indigo-200 rounded-full shadow-sm bg-white/80 backdrop-blur-sm hover:bg-indigo-50 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}



export default function LandingPage() {
  const navigate = useNavigate();
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [activeSpotlightTab, setActiveSpotlightTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);

  const [config, setConfig] = useState({
    logo_url: null,
    icon_url: null,
    theme_color: 'indigo',
    hero_title: 'Master Every Subject',
    hero_sinhala: 'විෂය සියල්ල ජය ගන්න',
    hero_desc: 'Comprehensive practice for Mathematics, Sinhala, Environment & IQ — all in one place.',
    hero_design: 'design1',
    subjects_design: 'design1',
    features_design: 'design1',
    testimonials_design: 'design1',
  });

  const fetchConfig = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${base}/app/config/landing-page`);
      if (res.ok) {
        const json = await res.json();
        if (json?.status === 'success' && json.data) {
          setConfig(json.data);
          
          if (json.data.icon_url) {
            let favUrl = json.data.icon_url;
            if (favUrl.startsWith('/')) {
              const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
              favUrl = `${apiBase.replace('/api/v1', '')}${favUrl}`;
            }
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = favUrl;
          }
        }
      }
    } catch (err) {
      console.error("Failed to load landing page config: ", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${base}/app/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (json?.status === 'success' && json.data && json.data.length > 0) {
          const ACCENT_GRADIENTS = [
            "from-indigo-500 to-purple-600",
            "from-emerald-500 to-teal-600",
            "from-amber-400 to-orange-500",
            "from-pink-500 to-rose-500",
            "from-blue-500 to-indigo-600"
          ];
          const mappedReviews = json.data.map((r, idx) => {
            const nameParts = r.name.split(' ');
            const initials = nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const gradient = ACCENT_GRADIENTS[idx % ACCENT_GRADIENTS.length];
            
            let profileUrl = r.profile_url;
            if (profileUrl && profileUrl.startsWith('/')) {
              const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
              const baseUrl = apiBase.replace('/api/v1', '');
              profileUrl = `${baseUrl}${profileUrl}`;
            }

            return {
              name: r.name,
              school: r.school,
              text: r.text,
              stars: r.stars || 5,
              initials: initials || 'S',
              gradient: gradient,
              score: r.score,
              profile_url: profileUrl,
            };
          });
          setTestimonialsList(mappedReviews);
        } else {
          setTestimonialsList(TESTIMONIALS);
        }
      } else {
        setTestimonialsList(TESTIMONIALS);
      }
    } catch (err) {
      console.error("Failed to fetch reviews: ", err);
      setTestimonialsList(TESTIMONIALS);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchReviews();
    window.addEventListener('landingPageConfigUpdated', fetchConfig);
    return () => {
      window.removeEventListener('landingPageConfigUpdated', fetchConfig);
    };
  }, []);

  const getLogoSrc = () => {
    if (config.logo_url) {
      if (config.logo_url.startsWith('http')) return config.logo_url;
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      return `${apiBase.replace('/api/v1', '')}${config.logo_url}`;
    }
    return logoicon;
  };

  const tc = themeColors[config.theme_color] || themeColors.indigo;
  
  return (
    <div className="relative min-h-screen antialiased text-gray-800">
      <PageBackground />

      {/* All content above the fixed bg */}
      <div className="relative z-10">

        {/* HEADER */}
        <header className="sticky top-0 z-50 w-full border-b shadow-sm border-white/60 bg-white/75 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-6xl px-5 py-3 mx-auto md:px-10">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center text-2xl ${tc.badgeBg} rounded-full shadow-sm h-11 w-11 overflow-hidden p-1 bg-white`}>
                <img
                src={getLogoSrc()}
                alt="QM logo"
                className="w-full h-full object-contain"
              />
              </div>
              <span className={`text-xl font-black tracking-tight ${tc.primaryText} md:text-2xl`}>Quiz Master</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="flex h-10 min-w-25 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 text-sm font-extrabold text-white shadow-[0_4px_0_0_#b45309] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#b45309] active:translate-y-1 active:shadow-none">
                <LogIn size={15} /> Login
              </button>
              <button onClick={() => navigate('/registration')} className={`flex items-center justify-center h-10 gap-2 px-5 text-sm font-extrabold transition-all border-2 rounded-full shadow-sm min-w-25 bg-white/80 backdrop-blur-sm hover:bg-slate-50 ${tc.border} ${tc.primaryText}`}>
                <UserPlus size={15} /> Register
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="max-w-6xl px-5 pt-12 mx-auto pb-14 md:px-10 md:pb-20 md:pt-16">
          {config.hero_design === 'design2' ? (
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7 text-center md:text-left">
                <span className={`inline-block px-4 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full ${tc.bgLight} ${tc.primaryText}`}>
                  Grade 5 Scholarship
                </span>
                <h1 className={`mb-2 text-5xl font-black leading-tight tracking-tight ${tc.primaryText} md:text-6xl`}>
                  {config.hero_title}
                </h1>
                <h2 className="mb-4 text-2xl font-bold text-amber-600 md:text-3xl">
                   {config.hero_sinhala}
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-gray-500">
                  {config.hero_desc}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                  <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_#b45309] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_0_#b45309] active:translate-y-1 active:shadow-none">
                    <LogIn size={18} /> Login
                  </button>
                  <button onClick={() => navigate('/registration')} className={`flex items-center justify-center gap-2 rounded-full border-2 bg-white/70 px-8 py-3.5 text-base font-extrabold backdrop-blur-sm transition-all hover:bg-white hover:shadow-md ${tc.border} ${tc.primaryText}`}>
                    <UserPlus size={18} /> Register
                  </button>
                </div>
              </div>
              <div className="md:col-span-5 relative flex justify-center items-center">
                <div className={`relative p-8 overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/60 shadow-2xl ${tc.shadow} max-w-full`}>
                  <div className={`absolute top-0 left-0 w-full h-2 bg-linear-to-r ${tc.bgGradient}`} />
                  <div className="relative z-10 text-center">
                    <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br ${tc.bgGradient} shadow-lg shadow-indigo-100`}>
                      <Award size={48} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Sri Lanka's #1 Preparation Platform</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6 font-semibold">Master Mathematics, Sinhala, Environment, and IQ with thousands of other students today!</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className={`text-xl font-black ${tc.primaryText}`}>10k+</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Active Students</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className={`text-xl font-black ${tc.primaryText}`}>500+</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : config.hero_design === 'design3' ? (
            <div className="text-center max-w-full mx-auto py-10 md:py-16">
              <span className={`inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full ${tc.bgLight} ${tc.primaryText} shadow-xs`}>
                Prep Smarter, Score Higher
              </span>
              <h1 className={`mb-3 text-5xl font-black leading-tight tracking-tight ${tc.primaryText} md:text-7xl`}>
                {config.hero_title}
              </h1>
              <h2 className="mb-6 text-2xl font-bold text-amber-600 md:text-4xl">
                 {config.hero_sinhala}
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-slate-600 max-w-full mx-auto font-semibold">
                {config.hero_desc}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-10 py-4 text-base font-extrabold text-white shadow-[0_5px_0_0_#b45309] transition-all hover:scale-105 active:scale-95">
                  Get Started Now <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/registration')} className={`flex items-center justify-center gap-2 rounded-full border-2 bg-white/70 px-10 py-4 text-base font-extrabold backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 ${tc.border} ${tc.primaryText}`}>
                  Create Free Account
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="text-center md:text-left">
                <span className={`inline-block px-4 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full ${tc.bgLight} ${tc.primaryText}`}>
                  Grade 5 Scholarship
                </span>
                <h1 className={`mb-2 text-5xl font-black leading-tight tracking-tight ${tc.primaryText} md:text-6xl`}>
                  {config.hero_title}
                </h1>
                <h2 className="mb-4 text-2xl font-bold text-amber-600 md:text-3xl">
                   {config.hero_sinhala}
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-gray-500">
                  {config.hero_desc}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                  <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_#b45309] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_0_#b45309] active:translate-y-1 active:shadow-none">
                    <LogIn size={18} /> Login
                  </button>
                  <button onClick={() => navigate('/registration')} className={`flex items-center justify-center gap-2 rounded-full border-2 bg-white/70 px-8 py-3.5 text-base font-extrabold backdrop-blur-sm transition-all hover:bg-white hover:shadow-md ${tc.border} ${tc.primaryText}`}>
                    <UserPlus size={18} /> Register
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-10 md:justify-start">
                  {[["10,000+", "Students"], ["500+", "Quizzes"], ["4.9★", "Rating"]].map(([val, lbl]) => (
                    <div key={lbl} className="text-center">
                      <p className={`text-2xl font-black ${tc.primaryText}`}>{val}</p>
                      <p className="text-xs font-semibold text-gray-400">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
              <HeroCarousel />
            </div>
          )}

          {/* Ready to start card */}
        <div className="pt-22">
            <div className="relative p-8 mx-auto overflow-hidden text-center border shadow-xl max-w-svh mt-14 rounded-xl border-white/70 bg-white/60 shadow-indigo-100/40 backdrop-blur-md">
            <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${tc.bgGradient}`} />
            <div className={`absolute flex items-center justify-center mt-8 text-white rounded-full shadow-lg me-8 -right-4 -top-5 h-14 w-14 bg-linear-to-br ${tc.bgGradient}`}>
              <Trophy size={26} />
            </div>
            <div className="absolute w-16 h-20 pointer-events-none -bottom-3 right-8 rotate-6 opacity-15">
              <div className="absolute inset-0 border-4 border-indigo-400 rounded-xl" />
              <div className="absolute w-10 h-12 border-4 border-indigo-300 rounded-lg left-2 top-2" />
            </div>
            <h3 className="mt-5 mb-3 text-2xl font-black text-indigo-700">Ready to start?</h3>
            <p className="mb-10 text-base leading-relaxed text-gray-500">
              Start your scholarship exam journey with interactive quizzes and practice papers designed to make learning easy and enjoyable.
            </p>
          </div>
        </div>
        </section>

        {/*FEATURED SUBJECTS*/}
        <section className="py-20">
          <div className="max-w-6xl px-5 mx-auto md:px-10">
            <div className="mb-12 text-center">
              <span className={`inline-block px-4 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full ${tc.bgLight} ${tc.primaryText}`}>
                Subjects
              </span>
              <h2 className="mb-3 text-3xl font-black text-gray-900 md:text-4xl">Featured Subjects</h2>
              <p className="mx-auto text-base text-gray-500 max-w-fit font-semibold">
                Master the core syllabus with focused practice tests designed for scholarship success.
              </p>
            </div>

            {config.subjects_design === 'design2' ? (
              <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
                {SUBJECTS.map(({ icon: Icon, label, sinhala, desc, gradient }) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white"
                  >
                    <div className={`absolute left-0 top-0 h-full w-2 bg-linear-to-b ${gradient}`} />
                    <div className="flex gap-4 items-center">
                      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} text-white shadow-md`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">{label}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">{sinhala}</p>
                        <p className="text-sm text-gray-500 mt-2 font-semibold">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : config.subjects_design === 'design3' ? (
              <div className="max-w-5xl mx-auto rounded-3xl border border-white bg-white/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
                <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-4 mb-6">
                  {SUBJECTS.map((sub, idx) => {
                    const TabIcon = sub.icon;
                    return (
                      <button
                        key={sub.label}
                        onClick={() => setActiveSubTab(idx)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition cursor-pointer ${
                          activeSubTab === idx
                            ? `bg-linear-to-br ${sub.gradient} text-white shadow-md`
                            : 'bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <TabIcon size={16} />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
                {SUBJECTS[activeSubTab] && (() => {
                  const activeSub = SUBJECTS[activeSubTab];
                  const ActiveIcon = activeSub.icon;
                  return (
                    <div className="grid gap-6 md:grid-cols-2 md:items-center">
                      <div className="text-left">
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{activeSub.label}</h3>
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${activeSub.badge} mb-4`}>
                          {activeSub.sinhala}
                        </span>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-semibold">{activeSub.desc}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <BookOpen size={14} className={activeSub.iconColor} /> {activeSub.questions} Practice Bank
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className={`flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-linear-to-br ${activeSub.gradient} text-white shadow-2xl transition-transform duration-500 hover:rotate-3`}>
                          <ActiveIcon size={72} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {SUBJECTS.map(({ icon: Icon, label, sinhala, desc, gradient, softBg, iconColor, badge, glow, questions }) => (
                  <div
                    key={label}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg border border-white/70 bg-white/65 p-6 shadow-lg shadow-indigo-50/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white/85 ${glow}`}
                  >
                    {/* Top color bar */}
                    <div className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${gradient}`} />

                    {/* Icon bubble */}
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={26} className="text-white" />
                    </div>

                    <h3 className="mb-0.5 text-lg font-black text-gray-900">{label}</h3>
                    <p className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${badge}`}>{sinhala}</p>
                    <p className="mb-4 text-sm leading-relaxed text-gray-500 font-semibold">{desc}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">{questions}</span>
                      <button className={`flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br ${gradient} text-white shadow-sm transition-all group-hover:scale-110`}>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/*WHY LEARN WITH US */}
        <section className="py-20">
          <div className="max-w-6xl px-5 mx-auto md:px-10">
            <div className="mb-12 text-center">
              <span className="inline-block px-4 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full bg-amber-100/80 text-amber-700 backdrop-blur-sm font-semibold">
                Features
              </span>
              <h2 className="mb-3 text-3xl font-black text-gray-900 md:text-4xl">Why Learn With Us?</h2>
              <p className="mx-auto text-base text-gray-500 max-w-fit font-semibold">
                Everything you need to ace the Grade 5 scholarship exam, in one place.
              </p>
            </div>

            {config.features_design === 'design2' ? (
              <div className="grid gap-6 md:grid-cols-12 max-w-5xl mx-auto">
                <div className={`md:col-span-8 rounded-3xl border border-white bg-linear-to-br ${WHY_CARDS[0].softBg} p-8 shadow-md relative overflow-hidden group hover:shadow-lg transition`}>
                  <span className="absolute text-7xl font-black select-none right-6 top-6 text-black/5">01</span>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${WHY_CARDS[0].gradient} text-white shadow-md`}>
                    <Zap size={26} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{WHY_CARDS[0].label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-full font-semibold">{WHY_CARDS[0].desc}</p>
                </div>
                <div className={`md:col-span-4 rounded-3xl border border-white bg-linear-to-br ${WHY_CARDS[1].softBg} p-8 shadow-md relative overflow-hidden group hover:shadow-lg transition`}>
                  <span className="absolute text-7xl font-black select-none right-6 top-6 text-black/5">02</span>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${WHY_CARDS[1].gradient} text-white shadow-md`}>
                    <FileText size={26} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{WHY_CARDS[1].label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">{WHY_CARDS[1].desc}</p>
                </div>
                <div className={`md:col-span-4 rounded-3xl border border-white bg-linear-to-br ${WHY_CARDS[2].softBg} p-8 shadow-md relative overflow-hidden group hover:shadow-lg transition`}>
                  <span className="absolute text-7xl font-black select-none right-6 top-6 text-black/5">03</span>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${WHY_CARDS[2].gradient} text-white shadow-md`}>
                    <Trophy size={26} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{WHY_CARDS[2].label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">{WHY_CARDS[2].desc}</p>
                </div>
                <div className="md:col-span-8 rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 shadow-xs flex flex-col justify-center items-center text-center">
                  <h3 className={`text-xl font-black ${tc.primaryText} mb-2`}>Join 10,000+ Happy Students</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-full font-semibold">Practice under a timed environment with real past papers, earn achievements, and secure your place on the leading board!</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3">
                {WHY_CARDS.map(({ icon: Icon, label, desc, gradient, softBg, iconRing, number }) => (
                  <div
                    key={label}
                    className={`group relative overflow-hidden rounded-2xl border border-white/70 bg-linear-to-br ${softBg} p-8 shadow-lg shadow-indigo-50/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/80`}
                  >
                    {/* Number watermark */}
                    <span className="absolute text-5xl font-black select-none right-5 top-4 text-black/5">{number}</span>

                    {/* Icon */}
                    <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} shadow-xl ring-4 ${iconRing} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon size={30} className="text-white" />
                    </div>

                    <h3 className="mb-3 text-xl font-black text-gray-900">{label}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 font-semibold">{desc}</p>

                    <div className={`flex items-center gap-1 mt-5 text-xs font-bold transition-opacity opacity-0 group-hover:opacity-100 ${tc.primaryText}`}>
                      Explore <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Checklist panel */}
            <div className="p-8 mt-12 overflow-hidden border shadow-xl rounded-3xl border-white/70 bg-white/60 shadow-indigo-100/30 backdrop-blur-md md:p-12">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className={`mb-6 text-2xl font-black ${tc.primaryText}`}>Everything in one platform</h3>
                  <ul className="space-y-3">
                    {[
                      "4 core subjects with 500+ questions",
                      "Timed past paper simulator",
                      "Real-time leaderboard",
                      "Progress tracking & analytics",
                      "Available in Sinhala & English",
                      "100% free for all students",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full shrink-0 bg-emerald-100">
                          <Check size={12} className="text-emerald-600" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`relative flex items-center justify-center shadow-2xl h-52 w-52 rounded-3xl bg-linear-to-br ${tc.bgGradient}`}>
                    <span className="text-8xl"><img
                    src={aimimg}
                    alt="QM logo"
                    className="w-auto h-45"
                  /></span>
                    <div className="absolute flex items-center justify-center text-2xl shadow-lg -right-4 -top-4 h-14 w-14 rounded-2xl bg-amber-400"> <Star size={26} className="text-white"/></div>
                    <div className="absolute flex items-center justify-center w-12 h-12 text-xl shadow-lg -bottom-4 -left-4 rounded-2xl bg-emerald-400"> <Award size={26} className="text-white"/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*TESTIMONIALS CAROUSEL*/}
        <section className="py-20">
          <div className="max-w-6xl px-5 mx-auto md:px-10">
            <div className="mb-12 text-center">
              <span className={`inline-block px-4 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full ${tc.bgLight} ${tc.primaryText}`}>
                Stories
              </span>
              <h2 className="mb-3 text-3xl font-black text-gray-900 md:text-4xl">
                Student Success Stories
              </h2>
              <p className="mx-auto text-base text-gray-500 font-semibold">
                Thousands of students across Sri Lanka have improved their scores with Quiz Master.
              </p>
            </div>
            
            {config.testimonials_design === 'design2' ? (
              <div className="columns-1 md:columns-3 gap-6 max-w-5xl mx-auto space-y-6">
                {testimonialsList.map((t, i) => (
                  <div
                    key={t.name + i}
                    className="break-inside-avoid relative overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-md hover:shadow-lg transition"
                  >
                    <div className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${t.gradient}`} />
                    <Quote size={20} className="absolute text-indigo-100 right-4 top-4" />
                    <StarRating count={t.stars} />
                    <p className="my-4 text-sm leading-relaxed text-gray-600 font-semibold">"{t.text}"</p>
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        {t.profile_url ? (
                          <img
                            src={t.profile_url}
                            alt={t.name}
                            className="h-8 w-8 shrink-0 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: t.profile_url ? 'none' : 'flex' }}
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-[10px] font-black text-white`}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900">{t.name}</p>
                          <p className="text-[10px] text-gray-400">{t.school}</p>
                        </div>
                      </div>
                      {t.score && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                          {t.score}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : config.testimonials_design === 'design3' ? (
              <div className="max-w-6xl mx-auto rounded-3xl border border-white bg-white/70 p-8 text-center relative shadow-xl backdrop-blur-sm">
                {testimonialsList[activeSpotlightTab] && (
                  <>
                    <div className={`absolute left-0 top-0 h-1.5 w-full bg-linear-to-r ${testimonialsList[activeSpotlightTab].gradient}`} />
                    <Quote size={40} className="mx-auto text-indigo-100/50 mb-4" />
                    <div className="flex justify-center mb-4">
                      <StarRating count={testimonialsList[activeSpotlightTab].stars} />
                    </div>
                    <p className="text-lg md:text-xl font-bold leading-relaxed text-slate-800 mb-8">
                      "{testimonialsList[activeSpotlightTab].text}"
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      {testimonialsList[activeSpotlightTab].profile_url ? (
                        <img
                          src={testimonialsList[activeSpotlightTab].profile_url}
                          alt={testimonialsList[activeSpotlightTab].name}
                          className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md mb-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        style={{ display: testimonialsList[activeSpotlightTab].profile_url ? 'none' : 'flex' }}
                        className={`flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br ${testimonialsList[activeSpotlightTab].gradient} text-lg font-black text-white shadow-md mb-2`}
                      >
                        {testimonialsList[activeSpotlightTab].initials}
                      </div>
                      <h4 className="text-base font-black text-slate-900">{testimonialsList[activeSpotlightTab].name}</h4>
                      <p className="text-xs text-slate-400">{testimonialsList[activeSpotlightTab].school}</p>
                      {testimonialsList[activeSpotlightTab].score && (
                        <span className="mt-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                          Score: {testimonialsList[activeSpotlightTab].score}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={() => setActiveSpotlightTab((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 cursor-pointer"
                      >
                        <ChevronLeft size={20} className={tc.primaryText} />
                      </button>
                      <button
                        onClick={() => setActiveSpotlightTab((prev) => (prev + 1) % testimonialsList.length)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 cursor-pointer"
                      >
                        <ChevronRight size={20} className={tc.primaryText} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <TestimonialCarousel testimonials={testimonialsList} />
            )}
          </div>
        </section>

        {/*CTA BANNER */}
        <section className="py-16">
          <div className="px-5 mx-auto md:px-10">
            <div className={`relative p-10 overflow-hidden text-center text-white shadow-2xl rounded-3xl bg-linear-to-br ${tc.bgGradient} md:p-14`}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-48 h-48 bg-white rounded-full -right-10 -top-10 opacity-5 blur-2xl" />
                <div className="absolute w-48 h-48 rounded-full -bottom-10 -left-10 bg-amber-400 opacity-10 blur-2xl" />
                <Star size={80} strokeWidth={1} className="absolute text-white -left-4 top-6 opacity-5" fill="none" />
                <Star size={50} strokeWidth={1} className="absolute text-white right-8 bottom-4 opacity-5" fill="none" />
              </div>
              <p className="mb-2 text-sm font-bold tracking-widest text-indigo-200 uppercase">Get Started Free</p>
              <h2 className="mb-4 text-3xl font-extrabold text-indigo-200  md:text-4xl">Start your scholarship journey today!</h2>
              <p className="mb-8 text-base text-indigo-200">
                ශිෂ්‍යත්ව ජය මග — Join over 10,000 students already preparing smarter.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button onClick={() => navigate('/registration')} className="rounded-full bg-amber-400 px-8 py-3.5 text-base font-extrabold text-gray-900 shadow-[0_5px_0_0_#b45309] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_0_#b45309] active:translate-y-1 active:shadow-none">
                  Register Free
                </button>
                <button className="rounded-full border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/*FOOTER*/}
        <footer className="border-t border-white/60 bg-white/70 backdrop-blur-xl">
          <div className="max-w-6xl px-5 py-12 mx-auto md:px-10">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-2xl ${tc.badgeBg} h-8 w-8 rounded-full flex items-center justify-center overflow-hidden p-0.5 bg-white shadow-xs`}><img
                src={getLogoSrc()}
                alt="QM logo"
                className="w-full h-full object-contain"
              /></span>
                  <span className={`text-xl font-black ${tc.primaryText}`}>Quiz Master</span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-500 font-semibold">
                  The fun way to prepare for the Grade 5 scholarship exam. ශිෂ්‍යත්ව ජය මග.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-black tracking-widest text-gray-900 uppercase">Subjects</h4>
                <ul className="space-y-2">
                  {["Mathematics", "Sinhala", "Environment", "IQ Tests"].map((s) => (
                    <li key={s}><a href="#" className={`text-sm text-gray-500 transition-colors ${tc.hoverText} font-semibold`}>{s}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-black tracking-widest text-gray-900 uppercase">Company</h4>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Help Center", "Contact Us"].map((s) => (
                    <li key={s}><a href="#" className={`text-sm text-gray-500 transition-colors ${tc.hoverText} font-semibold`}>{s}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-black tracking-widest text-gray-900 uppercase">Contact</h4>
                <ul className="space-y-3">
                  {[[Mail, "hello@quizmaster.lk"], [Phone, "+94 77 123 4567"], [MapPin, "Colombo, Sri Lanka"]].map(([Icon, val]) => (
                    <li key={val} className="flex items-start gap-2 text-sm text-gray-500 font-semibold">
                      <Icon size={14} className="mt-0.5 shrink-0 text-indigo-400" />{val}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 pt-6 mt-10 border-t border-gray-100 md:flex-row">
              <p className="text-sm text-gray-400 font-semibold">© 2026 Quiz Master Adventure. All rights reserved.</p>
              <p className={`text-sm font-semibold ${tc.primaryText}`}>Made for Sri Lankan students</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
