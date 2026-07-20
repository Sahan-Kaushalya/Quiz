import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  LayoutDashboard,
  Map,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
  Loader2,
  Trees,
  Gem,
  FlameKindling,
  Award
} from 'lucide-react';
import Footer from '../../ui/Footer';
import { AdminHeader, AdminSidebar, ButtonPrimary, Card, useToast } from '../../ui';
import { getAuthSession } from '../../services/authService';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Quizzes', icon: FileText, to: '/admin/quizzes' },
  { label: 'Past Papers', icon: ShieldCheck, to: '/admin/past-papers' },
  { label: 'Users', icon: Users, to: '/admin/users' },
  { label: 'Adventure', icon: Map, to: '/admin/adventure', active: true },
  { label: 'AI Assistant', icon: Sparkles, to: '/admin/ai-assistant' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function AdminAdventure() {
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('quests'); // 'quests' | 'trials'
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lists
  const [quests, setQuests] = useState([]);
  const [trials, setTrials] = useState([]);

  // Modal states
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  // Form states - Quests
  const [questForm, setQuestForm] = useState({
    zone_id: 'grasslands',
    name: '',
    description: '',
    quest_type: 'weekly',
    xp_reward: 150,
    start_date: '',
    end_date: '',
    questions: []
  });

  // Form states - Trials
  const [trialForm, setTrialForm] = useState({
    title: '',
    description: '',
    xp_reward: 100,
    type: 'vocab',
    active_date: '',
    questions: []
  });

  const [expandedQuestId, setExpandedQuestId] = useState(null);
  const [expandedTrialId, setExpandedTrialId] = useState(null);

  const fetchAdventureData = async () => {
    const session = getAuthSession();
    if (!session?.tokens?.accessToken) {
      navigate('/admin/login');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch Quests
      const questsRes = await fetch(`${API_BASE_URL}/admin/adventure/quests`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const questsJson = await questsRes.json();
      if (!questsRes.ok) throw new Error(questsJson.message || 'Failed to fetch adventure quests');
      setQuests(questsJson.data || []);

      // Fetch Trials
      const trialsRes = await fetch(`${API_BASE_URL}/admin/adventure/daily-trials`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const trialsJson = await trialsRes.json();
      if (!trialsRes.ok) throw new Error(trialsJson.message || 'Failed to fetch daily trials');
      setTrials(trialsJson.data || []);

    } catch (err) {
      toast.error(err.message || 'An error occurred while loading adventure panel data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdventureData();
  }, []);

  const handleQuestSubmit = async (e) => {
    e.preventDefault();
    if (!questForm.name || !questForm.start_date || !questForm.end_date || questForm.questions.length === 0) {
      toast.error('Please fill all required fields and add at least one question.');
      return;
    }

    // Verify all questions have a correct answer
    for (let i = 0; i < questForm.questions.length; i++) {
      const q = questForm.questions[i];
      if (!q.text) {
        toast.error(`Question ${i + 1} text is required.`);
        return;
      }
      const hasCorrect = q.options.some(opt => opt.isCorrect);
      if (!hasCorrect) {
        toast.error(`Please select a correct answer for question ${i + 1}.`);
        return;
      }
      if (q.options.some(opt => !opt.label)) {
        toast.error(`Please provide text for all options of question ${i + 1}.`);
        return;
      }
    }

    const session = getAuthSession();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/adventure/quests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify(questForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create quest.');

      toast.success('Adventure quest created successfully!');
      setIsQuestModalOpen(false);
      setQuestForm({
        zone_id: 'grasslands',
        name: '',
        description: '',
        quest_type: 'weekly',
        xp_reward: 150,
        start_date: '',
        end_date: '',
        questions: []
      });
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving quest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    if (!trialForm.title || !trialForm.active_date || trialForm.questions.length === 0) {
      toast.error('Please fill all required fields and add at least one question.');
      return;
    }

    // Verify all questions have a correct answer
    for (let i = 0; i < trialForm.questions.length; i++) {
      const q = trialForm.questions[i];
      if (!q.text) {
        toast.error(`Question ${i + 1} text is required.`);
        return;
      }
      const hasCorrect = q.options.some(opt => opt.isCorrect);
      if (!hasCorrect) {
        toast.error(`Please select a correct answer for question ${i + 1}.`);
        return;
      }
      if (q.options.some(opt => !opt.label)) {
        toast.error(`Please provide text for all options of question ${i + 1}.`);
        return;
      }
    }

    const session = getAuthSession();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/adventure/daily-trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify(trialForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create daily trial.');

      toast.success('Daily trial created successfully!');
      setIsTrialModalOpen(false);
      setTrialForm({
        title: '',
        description: '',
        xp_reward: 100,
        type: 'vocab',
        active_date: '',
        questions: []
      });
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving daily trial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestQuestion = () => {
    setQuestForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: [
            { label: '', isCorrect: false },
            { label: '', isCorrect: false },
            { label: '', isCorrect: false },
            { label: '', isCorrect: false }
          ],
          explanation: '',
          hint: ''
        }
      ]
    }));
  };

  const addTrialQuestion = () => {
    setTrialForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: [
            { label: '', isCorrect: false },
            { label: '', isCorrect: false },
            { label: '', isCorrect: false },
            { label: '', isCorrect: false }
          ],
          explanation: '',
          hint: ''
        }
      ]
    }));
  };

  const removeQuestQuestion = (index) => {
    setQuestForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const removeTrialQuestion = (index) => {
    setTrialForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestQuestionChange = (qIndex, field, value) => {
    setQuestForm(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleTrialQuestionChange = (qIndex, field, value) => {
    setTrialForm(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleQuestOptionChange = (qIndex, oIndex, field, value) => {
    setQuestForm(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      
      if (field === 'isCorrect') {
        // Set all to false first, since only one option can be correct
        updatedOptions.forEach((opt, idx) => {
          opt.isCorrect = idx === oIndex ? value : false;
        });
      } else {
        updatedOptions[oIndex] = { ...updatedOptions[oIndex], [field]: value };
      }

      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleTrialOptionChange = (qIndex, oIndex, field, value) => {
    setTrialForm(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      
      if (field === 'isCorrect') {
        // Set all to false first, since only one option can be correct
        updatedOptions.forEach((opt, idx) => {
          opt.isCorrect = idx === oIndex ? value : false;
        });
      } else {
        updatedOptions[oIndex] = { ...updatedOptions[oIndex], [field]: value };
      }

      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const getZoneBadgeIcon = (zoneId) => {
    if (zoneId === 'grasslands') return <Trees className="text-emerald-500" size={20} />;
    if (zoneId === 'crystal') return <Gem className="text-blue-500" size={20} />;
    return <FlameKindling className="text-orange-500" size={20} />;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800 font-body-md">
      <AdminSidebar items={NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen pb-12 md:ml-72">
        <AdminHeader onMenuClick={() => setSidebarOpen((value) => !value)} />

        {/* Header Title */}
        <section className="p-4 md:p-8 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                <Map className="text-indigo-600" size={28} />
                Adventure Quests & Trials
              </h2>
              <p className="mt-2 text-slate-600">
                Manage student adventure maps, zones, daily trials, and custom learning journeys.
              </p>
            </div>
            <div className="flex gap-3">
              {activeTab === 'quests' ? (
                <ButtonPrimary
                  onClick={() => setIsQuestModalOpen(true)}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Quest
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  onClick={() => setIsTrialModalOpen(true)}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Daily Trial
                </ButtonPrimary>
              )}
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="px-4 md:px-10 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('quests')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all ${
                activeTab === 'quests'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Adventure Quests ({quests.length})
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all ${
                activeTab === 'trials'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Daily Trials ({trials.length})
            </button>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="px-4 md:px-10">
          {isLoading ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-slate-500">
              <Loader2 className="animate-spin text-indigo-600" size={36} />
              <p className="mt-3 text-sm font-semibold">Loading adventure database...</p>
            </div>
          ) : activeTab === 'quests' ? (
            quests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Map className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Adventure Quests Found</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  Get started by creating your first quest in one of the adventure zones (Grasslands, Crystal Peaks, Volcanic Forge).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quests.map(quest => (
                  <Card key={quest.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl shrink-0">
                          {getZoneBadgeIcon(quest.zone_id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900">{quest.name}</h3>
                            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase">
                              {quest.quest_type}
                            </span>
                            {quest.is_active && (
                              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{quest.description || 'No description provided.'}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2.5">
                            <span>Zone: <strong className="text-slate-700 capitalize">{quest.zone_id}</strong></span>
                            <span>Reward: <strong className="text-amber-600">{quest.xp_reward} XP</strong></span>
                            <span>Questions: <strong className="text-indigo-600">{quest.questions?.length || 0}</strong></span>
                            <span>Dates: <strong className="text-slate-600">{new Date(quest.start_date).toLocaleDateString()} - {new Date(quest.end_date).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedQuestId(expandedQuestId === quest.id ? null : quest.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer self-start md:self-auto"
                      >
                        {expandedQuestId === quest.id ? (
                          <>
                            Hide Questions
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            View Questions
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Question details dropdown */}
                    {expandedQuestId === quest.id && (
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                        <h4 className="font-bold text-slate-800 text-sm">Quest Challenges ({quest.questions?.length || 0}):</h4>
                        {quest.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                            <p className="font-black text-slate-800 text-sm">Q{qIdx + 1}: {q.text}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center justify-between ${
                                  opt.isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}>
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt.label}</span>
                                  {opt.isCorrect && <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Correct</span>}
                                </div>
                              ))}
                            </div>
                            {q.hint && <p className="text-[11px] text-amber-700 font-bold mt-3">💡 Hint: {q.hint}</p>}
                            {q.explanation && <p className="text-[11px] text-slate-500 font-medium mt-1">📖 Explanation: {q.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          ) : (
            trials.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Daily Trials Found</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  Create daily micro-challenges to keep students engaged and reward active learning.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trials.map(trial => (
                  <Card key={trial.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl shrink-0">
                          <Award className="text-amber-500" size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900">{trial.title}</h3>
                            <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-xs font-bold uppercase">
                              {trial.type}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{trial.description || 'No description provided.'}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2.5">
                            <span>Reward: <strong className="text-amber-600">{trial.xp_reward} XP</strong></span>
                            <span>Questions: <strong className="text-indigo-600">{trial.questions?.length || 0}</strong></span>
                            <span>Active Date: <strong className="text-slate-600">{new Date(trial.active_date).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedTrialId(expandedTrialId === trial.id ? null : trial.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer self-start md:self-auto"
                      >
                        {expandedTrialId === trial.id ? (
                          <>
                            Hide Questions
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            View Questions
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Question details dropdown */}
                    {expandedTrialId === trial.id && (
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                        <h4 className="font-bold text-slate-800 text-sm">Trial Challenges ({trial.questions?.length || 0}):</h4>
                        {trial.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                            <p className="font-black text-slate-800 text-sm">Q{qIdx + 1}: {q.text}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center justify-between ${
                                  opt.isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}>
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt.label}</span>
                                  {opt.isCorrect && <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Correct</span>}
                                </div>
                              ))}
                            </div>
                            {q.hint && <p className="text-[11px] text-amber-700 font-bold mt-3">💡 Hint: {q.hint}</p>}
                            {q.explanation && <p className="text-[11px] text-slate-500 font-medium mt-1">📖 Explanation: {q.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          )}
        </section>
      </main>

      {/* Quest Creation Modal */}
      {isQuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create Adventure Quest</h3>
                <p className="text-slate-500 text-sm">Add a new structured quest challenge to a map zone.</p>
              </div>
              <button
                onClick={() => setIsQuestModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuestSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Zone Identifier</label>
                  <select
                    value={questForm.zone_id}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, zone_id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="grasslands">Zone 1: Grasslands</option>
                    <option value="crystal">Zone 2: Crystal Peaks</option>
                    <option value="volcanic">Zone 3: Volcanic Forge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Quest Type</label>
                  <select
                    value={questForm.quest_type}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, quest_type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Quest Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basic Sinhala Vowels"
                  value={questForm.name}
                  onChange={(e) => setQuestForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Quest Description</label>
                <textarea
                  placeholder="Summarize the learning scope of this quest..."
                  value={questForm.description}
                  onChange={(e) => setQuestForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">XP Reward *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={questForm.xp_reward}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, xp_reward: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={questForm.start_date}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={questForm.end_date}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              {/* Questions Setup */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-headline-sm text-[#4a39e2] font-extrabold text-sm uppercase tracking-wide">Questions & Challenge Set ({questForm.questions.length})</h4>
                  <button
                    type="button"
                    onClick={addQuestQuestion}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questForm.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-50 border border-slate-200 rounded-3xl p-5 relative animate-in slide-in-from-bottom-2">
                      <button
                        type="button"
                        onClick={() => removeQuestQuestion(qIndex)}
                        className="absolute top-4 right-4 p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Remove question"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Question {qIndex + 1} Text *</label>
                          <input
                            type="text"
                            required
                            placeholder="Type the challenge question here..."
                            value={q.text}
                            onChange={(e) => handleQuestQuestionChange(qIndex, 'text', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Options (Select the correct one) *</label>
                          <div className="grid gap-3 md:grid-cols-2">
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2 px-3">
                                <input
                                  type="radio"
                                  name={`quest_q_${qIndex}`}
                                  checked={opt.isCorrect}
                                  onChange={(e) => handleQuestOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                  className="w-4 h-4 accent-indigo-600 shrink-0 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={opt.label}
                                  onChange={(e) => handleQuestOptionChange(qIndex, oIndex, 'label', e.target.value)}
                                  className="w-full border-none outline-none text-xs font-semibold"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Hint / Clue</label>
                            <input
                              type="text"
                              placeholder="Add a helpful hint..."
                              value={q.hint}
                              onChange={(e) => handleQuestQuestionChange(qIndex, 'hint', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Explanation</label>
                            <input
                              type="text"
                              placeholder="Explain the correct answer..."
                              value={q.explanation}
                              onChange={(e) => handleQuestQuestionChange(qIndex, 'explanation', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuestModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#312e81] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Creating...' : 'Save Quest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trial Creation Modal */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create Daily Trial</h3>
                <p className="text-slate-500 text-sm">Add a new daily vocabulary or science quiz challenge.</p>
              </div>
              <button
                onClick={() => setIsTrialModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTrialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Trial Category</label>
                  <select
                    value={trialForm.type}
                    onChange={(e) => setTrialForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="vocab">Vocabulary (Vocab)</option>
                    <option value="science">Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">XP Reward *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={trialForm.xp_reward}
                    onChange={(e) => setTrialForm(prev => ({ ...prev, xp_reward: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Trial Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Synonyms & Vowels Blitz"
                    value={trialForm.title}
                    onChange={(e) => setTrialForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Active Date *</label>
                  <input
                    type="date"
                    required
                    value={trialForm.active_date}
                    onChange={(e) => setTrialForm(prev => ({ ...prev, active_date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Trial Description</label>
                <textarea
                  placeholder="Explain what the students must accomplish in this trial..."
                  value={trialForm.description}
                  onChange={(e) => setTrialForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none h-20"
                />
              </div>

              {/* Questions Setup */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-headline-sm text-[#4a39e2] font-extrabold text-sm uppercase tracking-wide">Questions & Options ({trialForm.questions.length})</h4>
                  <button
                    type="button"
                    onClick={addTrialQuestion}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {trialForm.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-50 border border-slate-200 rounded-3xl p-5 relative animate-in slide-in-from-bottom-2">
                      <button
                        type="button"
                        onClick={() => removeTrialQuestion(qIndex)}
                        className="absolute top-4 right-4 p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Remove question"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Question {qIndex + 1} Text *</label>
                          <input
                            type="text"
                            required
                            placeholder="Type the challenge question here..."
                            value={q.text}
                            onChange={(e) => handleTrialQuestionChange(qIndex, 'text', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Options (Select the correct one) *</label>
                          <div className="grid gap-3 md:grid-cols-2">
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2 px-3">
                                <input
                                  type="radio"
                                  name={`trial_q_${qIndex}`}
                                  checked={opt.isCorrect}
                                  onChange={(e) => handleTrialOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                  className="w-4 h-4 accent-indigo-600 shrink-0 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={opt.label}
                                  onChange={(e) => handleTrialOptionChange(qIndex, oIndex, 'label', e.target.value)}
                                  className="w-full border-none outline-none text-xs font-semibold"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Hint / Clue</label>
                            <input
                              type="text"
                              placeholder="Add a helpful hint..."
                              value={q.hint}
                              onChange={(e) => handleTrialQuestionChange(qIndex, 'hint', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Explanation</label>
                            <input
                              type="text"
                              placeholder="Explain the correct answer..."
                              value={q.explanation}
                              onChange={(e) => handleTrialQuestionChange(qIndex, 'explanation', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold focus:border-indigo-500 transition outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTrialModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#312e81] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Creating...' : 'Save Daily Trial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
