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
  Award,
  Edit,
  Eye,
  EyeOff,
  Upload
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
  const [activeTab, setActiveTab] = useState('quests'); // 'quests' | 'trials' | 'expired' | 'badges'
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lists
  const [quests, setQuests] = useState([]);
  const [trials, setTrials] = useState([]);
  const [badges, setBadges] = useState([]);

  // Modal states
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // Editing state trackers
  const [editingQuestId, setEditingQuestId] = useState(null);
  const [editingBadgeId, setEditingBadgeId] = useState(null);

  // Form states - Quests
  const [questForm, setQuestForm] = useState({
    zone_id: 'grasslands',
    name: '',
    description: '',
    quest_type: 'weekly',
    xp_reward: 150,
    badge_id: '',
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

  // Form states - Badges
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon_url: '',
    badge_type: 'achievement',
    xp_required: '',
    target_type: 'none',
    target_value: '',
    time_limit: '',
    score_limit: ''
  });

  const [dbQuizzes, setDbQuizzes] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [selectedAwardBadge, setSelectedAwardBadge] = useState(null);
  const [awardUserId, setAwardUserId] = useState('');
  const [expandedQuestId, setExpandedQuestId] = useState(null);
  const [expandedTrialId, setExpandedTrialId] = useState(null);

  // Zone management states
  const [zones, setZones] = useState([]);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [zoneForm, setZoneForm] = useState({
    id: '',
    name: '',
    short_name: '',
    xp: 300,
    gradient: 'from-emerald-400 to-teal-500',
    border_color: 'border-emerald-300',
    shadow_color: 'shadow-emerald-200',
    bg_light: 'bg-emerald-50',
    image_url: '',
    pos_x: 100,
    pos_y: 100,
    delay: '0s',
    is_active: true,
    sort_order: 1
  });

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

      // Fetch Badges
      const badgesRes = await fetch(`${API_BASE_URL}/admin/adventure/badges`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const badgesJson = await badgesRes.json();
      if (!badgesRes.ok) throw new Error(badgesJson.message || 'Failed to fetch badges');
      setBadges(badgesJson.data || []);

      // Fetch Quizzes
      const quizzesRes = await fetch(`${API_BASE_URL}/admin/quizzes`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const quizzesJson = await quizzesRes.json();
      if (quizzesRes.ok) {
        setDbQuizzes(quizzesJson.data?.quizzes || quizzesJson.data || []);
      }

      // Fetch Users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const usersJson = await usersRes.json();
      if (usersRes.ok) {
        setDbUsers(usersJson.data || []);
      }
      
      // Fetch Zones
      const zonesRes = await fetch(`${API_BASE_URL}/admin/adventure/zones`, {
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const zonesJson = await zonesRes.json();
      if (!zonesRes.ok) throw new Error(zonesJson.message || 'Failed to fetch zones');
      setZones(zonesJson.data || []);

    } catch (err) {
      toast.error(err.message || 'An error occurred while loading adventure panel data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdventureData();
  }, []);

  const handleZoneSubmit = async (e) => {
    e.preventDefault();
    if (!zoneForm.id || !zoneForm.name || !zoneForm.short_name) {
      toast.error('ID, Name and Short Name are required.');
      return;
    }

    const session = getAuthSession();
    setIsSubmitting(true);
    try {
      const url = editingZoneId
        ? `${API_BASE_URL}/admin/adventure/zones/${editingZoneId}`
        : `${API_BASE_URL}/admin/adventure/zones`;
      const method = editingZoneId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify(zoneForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save zone.');

      toast.success(editingZoneId ? 'Zone updated successfully!' : 'Adventure Zone created successfully!');
      setIsZoneModalOpen(false);
      setEditingZoneId(null);
      setZoneForm({
        id: '',
        name: '',
        short_name: '',
        xp: 300,
        gradient: 'from-emerald-400 to-teal-500',
        border_color: 'border-emerald-300',
        shadow_color: 'shadow-emerald-200',
        bg_light: 'bg-emerald-50',
        image_url: '',
        pos_x: 100,
        pos_y: 100,
        delay: '0s',
        is_active: true,
        sort_order: 1
      });
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving zone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleZoneActive = async (zoneId) => {
    const session = getAuthSession();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/adventure/zones/${zoneId}/toggle-active`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.tokens.accessToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to toggle zone visibility.');
      toast.success(data.message || 'Zone visibility status updated!');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error occurred while toggling zone visibility.');
    }
  };

  const handleEditZone = (zone) => {
    setEditingZoneId(zone.id);
    setZoneForm({
      id: zone.id,
      name: zone.name,
      short_name: zone.short_name,
      xp: zone.xp,
      gradient: zone.gradient,
      border_color: zone.border_color,
      shadow_color: zone.shadow_color,
      bg_light: zone.bg_light,
      image_url: zone.image_url || '',
      pos_x: zone.pos_x,
      pos_y: zone.pos_y,
      delay: zone.delay,
      is_active: zone.is_active !== undefined ? zone.is_active : true,
      sort_order: zone.sort_order !== undefined ? zone.sort_order : 1
    });
    setIsZoneModalOpen(true);
  };

  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm('Are you sure you want to delete this zone? This action cannot be undone.')) return;
    const session = getAuthSession();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/adventure/zones/${zoneId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete zone.');

      toast.success('Zone deleted successfully!');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error deleting zone.');
    }
  };

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
      const url = editingQuestId
        ? `${API_BASE_URL}/admin/adventure/quests/${editingQuestId}`
        : `${API_BASE_URL}/admin/adventure/quests`;
      const method = editingQuestId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify(questForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save quest.');

      toast.success(editingQuestId ? 'Quest updated successfully!' : 'Adventure quest created successfully!');
      setIsQuestModalOpen(false);
      setEditingQuestId(null);
      setQuestForm({
        zone_id: 'grasslands',
        name: '',
        description: '',
        quest_type: 'weekly',
        xp_reward: 150,
        badge_id: '',
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

  const handleDeleteQuest = async (questId) => {
    if (!window.confirm('Are you sure you want to delete this adventure quest?')) return;
    const session = getAuthSession();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/adventure/quests/${questId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete quest');
      toast.success('Quest deleted successfully');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error deleting quest');
    }
  };

  const handleToggleQuestActive = async (questId) => {
    const session = getAuthSession();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/adventure/quests/${questId}/toggle-active`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to toggle quest visibility');
      toast.success(data.message || 'Quest visibility toggled');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error toggling quest visibility');
    }
  };

  const startEditQuest = (quest) => {
    setEditingQuestId(quest.id);
    setQuestForm({
      zone_id: quest.zone_id,
      name: quest.name,
      description: quest.description || '',
      quest_type: quest.quest_type || 'weekly',
      xp_reward: quest.xp_reward || 150,
      badge_id: quest.badge_id || '',
      start_date: quest.start_date ? quest.start_date.split('T')[0] : '',
      end_date: quest.end_date ? quest.end_date.split('T')[0] : '',
      questions: quest.questions || []
    });
    setIsQuestModalOpen(true);
  };

  const handleBadgeIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('badges', file);

    const session = getAuthSession();
    try {
      const res = await fetch(`${API_BASE_URL}/uploads/badges`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      setBadgeForm(prev => ({ ...prev, icon_url: data.data.url }));
      toast.success('Badge icon uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Error uploading image');
    }
  };

  const handleBadgeSubmit = async (e) => {
    e.preventDefault();
    if (!badgeForm.name || !badgeForm.description || !badgeForm.icon_url) {
      toast.error('Name, description, and icon are required.');
      return;
    }

    const session = getAuthSession();
    setIsSubmitting(true);
    try {
      const url = editingBadgeId 
        ? `${API_BASE_URL}/admin/adventure/badges/${editingBadgeId}`
        : `${API_BASE_URL}/admin/adventure/badges`;
      const method = editingBadgeId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify(badgeForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save badge');

      toast.success(editingBadgeId ? 'Badge updated successfully' : 'Badge created successfully');
      setIsBadgeModalOpen(false);
      setEditingBadgeId(null);
      setBadgeForm({
        name: '',
        description: '',
        icon_url: '',
        badge_type: 'achievement',
        xp_required: '',
        target_type: 'none',
        target_value: '',
        time_limit: '',
        score_limit: ''
      });
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error saving badge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditBadge = (badge) => {
    setEditingBadgeId(badge.id);
    setBadgeForm({
      name: badge.name,
      description: badge.description || '',
      icon_url: badge.icon_url || '',
      badge_type: badge.badge_type || 'achievement',
      xp_required: badge.xp_required !== null ? badge.xp_required : '',
      target_type: badge.target_type || 'none',
      target_value: badge.target_value || '',
      time_limit: badge.time_limit !== null ? badge.time_limit : '',
      score_limit: badge.score_limit !== null ? badge.score_limit : ''
    });
    setIsBadgeModalOpen(true);
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!window.confirm('Are you sure you want to delete this badge?')) return;
    const session = getAuthSession();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/adventure/badges/${badgeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.tokens.accessToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete badge');
      toast.success('Badge deleted successfully');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error deleting badge');
    }
  };

  const handleManualAwardBadgeSubmit = async (e) => {
    e.preventDefault();
    if (!awardUserId || !selectedAwardBadge) {
      toast.error('Please select a student user.');
      return;
    }

    const session = getAuthSession();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/adventure/badges/${selectedAwardBadge.id}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokens.accessToken}`
        },
        body: JSON.stringify({ userId: awardUserId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to award badge');

      toast.success(data.message || 'Badge awarded successfully!');
      setIsAwardModalOpen(false);
      setSelectedAwardBadge(null);
      setAwardUserId('');
      fetchAdventureData();
    } catch (err) {
      toast.error(err.message || 'Error awarding badge');
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

  const getBadgeIconUrl = (iconUrl, seedName = 'badge') => {
    if (!iconUrl) return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seedName)}`;
    if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) return iconUrl;
    // Prefix if relative to upload path
    if (iconUrl.startsWith('/api/v1/uploads/')) {
      return `${API_BASE_URL.replace('/api/v1', '')}${iconUrl}`;
    }
    if (iconUrl.startsWith('/uploads/')) {
      return `${API_BASE_URL.replace('/api/v1', '')}/api/v1${iconUrl}`;
    }
    if (iconUrl.startsWith('/badges/')) {
      return `${API_BASE_URL.replace('/api/v1', '')}/api/v1/uploads${iconUrl}`;
    }
    return `${API_BASE_URL.replace('/api/v1', '')}/api/v1/uploads/badges/${iconUrl}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeQuests = quests.filter(q => q.is_active && new Date(q.end_date) >= new Date());
  const activeTrials = trials.filter(t => t.active_date >= todayStr);
  const expiredQuests = quests.filter(q => !q.is_active || new Date(q.end_date) < new Date());
  const expiredTrials = trials.filter(t => t.active_date < todayStr);

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
              {activeTab === 'quests' && (
                <ButtonPrimary
                  onClick={() => {
                    setEditingQuestId(null);
                    setQuestForm({
                      zone_id: 'grasslands',
                      name: '',
                      description: '',
                      quest_type: 'weekly',
                      xp_reward: 150,
                      badge_id: '',
                      start_date: '',
                      end_date: '',
                      questions: []
                    });
                    setIsQuestModalOpen(true);
                  }}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Quest
                </ButtonPrimary>
              )}
              {activeTab === 'trials' && (
                <ButtonPrimary
                  onClick={() => {
                    setIsTrialModalOpen(true);
                  }}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Daily Trial
                </ButtonPrimary>
              )}
              {activeTab === 'badges' && (
                <ButtonPrimary
                  onClick={() => {
                    setEditingBadgeId(null);
                    setBadgeForm({
                      name: '',
                      description: '',
                      icon_url: '',
                      badge_type: 'achievement',
                      xp_required: '',
                      target_type: 'none',
                      target_value: ''
                    });
                    setIsBadgeModalOpen(true);
                  }}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Badge
                </ButtonPrimary>
              )}
              {activeTab === 'zones' && (
                <ButtonPrimary
                  onClick={() => {
                    setEditingZoneId(null);
                    setZoneForm({
                      id: '',
                      name: '',
                      short_name: '',
                      xp: 300,
                      gradient: 'from-emerald-400 to-teal-500',
                      border_color: 'border-emerald-300',
                      shadow_color: 'shadow-emerald-200',
                      bg_light: 'bg-emerald-50',
                      image_url: '',
                      pos_x: 100,
                      pos_y: 100,
                      delay: '0s',
                      is_active: true,
                      sort_order: zones.length + 1
                    });
                    setIsZoneModalOpen(true);
                  }}
                  className="flex items-center gap-2 py-3 px-6 text-sm cursor-pointer rounded-2xl animate-in zoom-in-95"
                >
                  <Plus size={16} />
                  New Zone
                </ButtonPrimary>
              )}
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="px-4 md:px-10 mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('quests')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === 'quests'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Active Quests ({activeQuests.length})
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === 'trials'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Daily Trials ({activeTrials.length})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === 'expired'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Expired/Inactive ({expiredQuests.length + expiredTrials.length})
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Manage Badges ({badges.length})
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === 'zones'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Manage Zones ({zones.length})
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
            activeQuests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Map className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Active Adventure Quests Found</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  Get started by creating your first quest.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeQuests.map(quest => (
                  <Card key={quest.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl shrink-0">
                          {getZoneBadgeIcon(quest.zone_id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-slate-900">{quest.name}</h3>
                            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase">
                              {quest.quest_type}
                            </span>
                            {quest.badge && (
                              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                                🏆 {quest.badge.name}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{quest.description || 'No description provided.'}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2.5 flex-wrap">
                            <span>Zone: <strong className="text-slate-700 capitalize">{quest.zone_id}</strong></span>
                            <span>Reward: <strong className="text-amber-600">{quest.xp_reward} XP</strong></span>
                            <span>Questions: <strong className="text-indigo-600">{quest.questions?.length || 0}</strong></span>
                            <span>Dates: <strong className="text-slate-600">{new Date(quest.start_date).toLocaleDateString()} - {new Date(quest.end_date).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                        <button
                          onClick={() => startEditQuest(quest)}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                          title="Edit Quest"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleQuestActive(quest.id)}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition cursor-pointer"
                          title="Hide Quest (Deactivate)"
                        >
                          <EyeOff size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuest(quest.id)}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-500 transition cursor-pointer"
                          title="Delete Quest"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setExpandedQuestId(expandedQuestId === quest.id ? null : quest.id)}
                          className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer"
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
          ) : activeTab === 'trials' ? (
            activeTrials.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Active Daily Trials Found</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  Create daily micro-challenges to keep students engaged.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTrials.map(trial => (
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
          ) : activeTab === 'expired' ? (
            expiredQuests.length === 0 && expiredTrials.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <ShieldCheck className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Expired or Inactive Challenges</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  All items are active and within their dates.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {expiredQuests.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-200 pb-2">Expired or Inactive Quests</h3>
                    {expiredQuests.map(quest => (
                      <Card key={quest.id} className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 shadow-xs opacity-75 hover:opacity-100 transition">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-100 rounded-2xl shrink-0">
                              {getZoneBadgeIcon(quest.zone_id)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-black text-slate-900">{quest.name}</h3>
                                <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-xs font-bold uppercase">
                                  {quest.quest_type}
                                </span>
                                {!quest.is_active ? (
                                  <span className="px-2.5 py-0.5 bg-slate-200 border border-slate-300 text-slate-600 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                    <EyeOff size={11} /> Hidden
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-full text-xs font-bold uppercase">
                                    Expired
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-sm mt-1">{quest.description}</p>
                              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2.5 flex-wrap">
                                <span>Zone: <strong className="text-slate-700 capitalize">{quest.zone_id}</strong></span>
                                <span>Reward: <strong className="text-slate-600">{quest.xp_reward} XP</strong></span>
                                <span>Questions: <strong className="text-indigo-600">{quest.questions?.length || 0}</strong></span>
                                <span>Dates: <strong className="text-slate-600">{new Date(quest.start_date).toLocaleDateString()} - {new Date(quest.end_date).toLocaleDateString()}</strong></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                            <button
                              onClick={() => startEditQuest(quest)}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                              title="Edit Quest"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleQuestActive(quest.id)}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-indigo-600 hover:text-slate-600 transition cursor-pointer"
                              title="Activate Quest"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuest(quest.id)}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-500 transition cursor-pointer"
                              title="Delete Quest"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => setExpandedQuestId(expandedQuestId === quest.id ? null : quest.id)}
                              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer"
                            >
                              {expandedQuestId === quest.id ? 'Hide Questions' : 'View Questions'}
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {expiredTrials.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-200 pb-2">Expired Daily Trials</h3>
                    {expiredTrials.map(trial => (
                      <Card key={trial.id} className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 shadow-xs opacity-75 hover:opacity-100 transition">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-100 rounded-2xl shrink-0">
                              <Award className="text-slate-400" size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-slate-900">{trial.title}</h3>
                                <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-xs font-bold uppercase">
                                  {trial.type}
                                </span>
                                <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-full text-xs font-bold uppercase">
                                  Expired
                                </span>
                              </div>
                              <p className="text-slate-500 text-sm mt-1">{trial.description}</p>
                              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2.5">
                                <span>Reward: <strong className="text-slate-600">{trial.xp_reward} XP</strong></span>
                                <span>Questions: <strong className="text-indigo-600">{trial.questions?.length || 0}</strong></span>
                                <span>Active Date: <strong className="text-slate-600">{new Date(trial.active_date).toLocaleDateString()}</strong></span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setExpandedTrialId(expandedTrialId === trial.id ? null : trial.id)}
                            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer self-start md:self-auto"
                          >
                            {expandedTrialId === trial.id ? 'Hide Questions' : 'View Questions'}
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : activeTab === 'badges' ? (
            badges.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <Award className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">No Badges Found</h3>
                <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                  Create achievements and special learning reward badges.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                {badges.map(badge => (
                  <Card key={badge.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={getBadgeIconUrl(badge.icon_url, badge.name)}
                          alt={badge.name}
                          className="h-12 w-12 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(badge.name)}`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-black text-slate-900 truncate">{badge.name}</h4>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase">
                          {badge.badge_type}
                        </span>
                        <p className="text-xs font-semibold text-slate-500 mt-2 line-clamp-3 leading-relaxed">{badge.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                          {badge.target_type === 'xp' ? `🏆 Reach ${badge.target_value} XP` :
                           badge.target_type === 'quest' ? `⚔️ Complete Quest ID: ${badge.target_value}` :
                           badge.target_type === 'zone' ? `🗺️ Complete Zone: ${badge.target_value}` :
                           badge.target_type === 'daily_trial' ? `📅 Complete ${badge.target_value} Trials` :
                           badge.target_type === 'quiz' ? `📝 Complete Quiz ID: ${badge.target_value}` :
                           badge.target_type === 'quiz_count' ? `📝 Complete ${badge.target_value} Quizzes` :
                           badge.target_type === 'adventure_count' ? `⚔️ Complete ${badge.target_value} Quests` :
                           badge.xp_required !== null ? `🏆 Reach ${badge.xp_required} XP` : 'Special Award (Manual)'}
                          {badge.time_limit && ` (under ${badge.time_limit}s)`}
                          {badge.score_limit && ` with >= ${badge.score_limit}% score`}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEditBadge(badge)}
                            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                            title="Edit Badge"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBadge(badge.id)}
                            className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-500 transition cursor-pointer"
                            title="Delete Badge"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[11px] font-extrabold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                          👥 Claimed: <strong className="text-slate-800">{badge.earnedCount || 0} students</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAwardBadge(badge);
                            setAwardUserId('');
                            setIsAwardModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Award Badge to Selected User"
                        >
                          <Award size={13} />
                          <span>Award Student</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
          ) ) : (
              // zones list Tab
              zones.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <Map className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-lg font-bold text-slate-700">No Adventure Zones Found</h3>
                  <p className="text-slate-500 mt-1 max-w-full mx-auto text-sm">
                    Create your first adventure map zone using the "New Zone" button.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {zones.map((zone) => (
                    <Card key={zone.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col">
                      <div className="h-40 relative bg-slate-100 overflow-hidden">
                        {zone.image_url ? (
                          <img
                            src={zone.image_url}
                            alt={zone.name}
                            className="w-full h-full object-cover opacity-90"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <Map size={48} strokeWidth={1} />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-md">
                          ⭐ {zone.xp} XP
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-slate-900 text-lg">{zone.name}</h4>
                          {zone.is_active === false ? (
                            <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded-full text-[10px] font-black uppercase flex items-center gap-0.5">
                              <EyeOff size={10} /> Hidden
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[10px] font-black uppercase flex items-center gap-0.5">
                              <Eye size={10} /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-1">Short Name: {zone.short_name}</p>
                        
                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 flex-1">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Gradient:</span>
                            <span className="font-mono bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">{zone.gradient}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Position X/Y:</span>
                            <span className="font-bold text-slate-800">{zone.pos_x}px, {zone.pos_y}px</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Animation Delay:</span>
                            <span className="font-bold text-slate-800">{zone.delay}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Progression Order:</span>
                            <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px]">Zone {zone.sort_order}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-4">
                          <button
                            onClick={() => handleToggleZoneActive(zone.id)}
                            className={`p-2 border rounded-xl transition cursor-pointer flex items-center justify-center ${
                              zone.is_active === false
                                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-emerald-600'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-red-500'
                            }`}
                            title={zone.is_active === false ? "Show Zone (Activate)" : "Hide Zone (Deactivate)"}
                          >
                            {zone.is_active === false ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleEditZone(zone)}
                            className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteZone(zone.id)}
                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            )
          }
        </section>
      </main>

      {/* Quest Creation Modal */}
      {isQuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingQuestId ? 'Edit Adventure Quest' : 'Create Adventure Quest'}</h3>
                <p className="text-slate-500 text-sm">{editingQuestId ? 'Modify this structured quest challenge.' : 'Add a new structured quest challenge to a map zone.'}</p>
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
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.name} {z.is_active === false ? ' (Hidden)' : ''}
                      </option>
                    ))}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Reward Badge</label>
                  <select
                    value={questForm.badge_id || ''}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, badge_id: e.target.value || null }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="">No Badge</option>
                    {badges.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
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
                  {isSubmitting ? 'Saving...' : editingQuestId ? 'Update Quest' : 'Create Quest'}
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

      {/* Badge Creation/Edit Modal */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingBadgeId ? 'Edit Reward Badge' : 'Create Reward Badge'}</h3>
                <p className="text-slate-500 text-sm">Reward badges for learning achievements and quest milestones.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBadgeSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Badge Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grasslands Champion"
                  value={badgeForm.name}
                  onChange={(e) => setBadgeForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Description *</label>
                <textarea
                  required
                  placeholder="Explain how students earn this badge..."
                  value={badgeForm.description}
                  onChange={(e) => setBadgeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Badge Type</label>
                  <select
                    value={badgeForm.badge_type}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, badge_type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="achievement">Achievement</option>
                    <option value="milestone">Milestone</option>
                    <option value="streak">Streak</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">XP Required (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={badgeForm.xp_required}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, xp_required: e.target.value === '' ? '' : Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Award Condition Type</label>
                  <select
                    value={badgeForm.target_type || 'none'}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, target_type: e.target.value, target_value: '' }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  >
                    <option value="none">Manual / Special (No Rule)</option>
                    <option value="xp">Reach XP Threshold</option>
                    <option value="quest">Complete a Specific Quest</option>
                    <option value="zone">Complete a Specific Zone</option>
                    <option value="daily_trial">Complete Daily Trials Count</option>
                    <option value="quiz">Complete a Specific Quiz</option>
                    <option value="quiz_count">Complete Quizzes Count</option>
                    <option value="adventure_count">Complete Adventure Quests Count</option>
                  </select>
                </div>
                {badgeForm.target_type && badgeForm.target_type !== 'none' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                      {badgeForm.target_type === 'xp' && 'Target XP Value *'}
                      {badgeForm.target_type === 'quest' && 'Target Quest *'}
                      {badgeForm.target_type === 'zone' && 'Target Zone *'}
                      {badgeForm.target_type === 'daily_trial' && 'Required Daily Trials Completed *'}
                      {badgeForm.target_type === 'quiz' && 'Target Quiz *'}
                      {badgeForm.target_type === 'quiz_count' && 'Required Quizzes Completed *'}
                      {badgeForm.target_type === 'adventure_count' && 'Required Adventure Quests Completed *'}
                    </label>
                    {badgeForm.target_type === 'zone' ? (
                      <select
                        required
                        value={badgeForm.target_value}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, target_value: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                      >
                        <option value="">Select Zone</option>
                        <option value="grasslands">Zone 1: Grasslands</option>
                        <option value="crystal">Zone 2: Crystal Peaks</option>
                        <option value="volcanic">Zone 3: Volcanic Forge</option>
                      </select>
                    ) : badgeForm.target_type === 'quest' ? (
                      <select
                        required
                        value={badgeForm.target_value}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, target_value: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                      >
                        <option value="">Select Quest</option>
                        {quests.map(q => (
                          <option key={q.id} value={q.id}>{q.name} (ID: {q.id})</option>
                        ))}
                      </select>
                    ) : badgeForm.target_type === 'quiz' ? (
                      <select
                        required
                        value={badgeForm.target_value}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, target_value: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                      >
                        <option value="">Select Quiz</option>
                        {dbQuizzes.map(qz => (
                          <option key={qz.id} value={qz.id}>{qz.title || qz.quiz_name} (ID: {qz.id})</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={['xp', 'daily_trial', 'quiz_count', 'adventure_count'].includes(badgeForm.target_type) ? 'number' : 'text'}
                        required
                        placeholder={
                          badgeForm.target_type === 'xp' ? 'e.g. 500' :
                          badgeForm.target_type === 'daily_trial' ? 'e.g. 10' :
                          badgeForm.target_type === 'quiz_count' ? 'e.g. 5' :
                          badgeForm.target_type === 'adventure_count' ? 'e.g. 5' :
                          'Enter target value'
                        }
                        value={badgeForm.target_value}
                        onChange={(e) => setBadgeForm(prev => ({ ...prev, target_value: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Optional Speed/Time limit and Score limit checks */}
              {['quiz', 'quiz_count'].includes(badgeForm.target_type) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Max Seconds Allowed (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 120 (seconds)"
                      value={badgeForm.time_limit || ''}
                      onChange={(e) => setBadgeForm(prev => ({ ...prev, time_limit: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Min Score % Required (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 100 (100% correct)"
                      value={badgeForm.score_limit || ''}
                      onChange={(e) => setBadgeForm(prev => ({ ...prev, score_limit: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Badge Icon Upload */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Badge Icon Image *</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={getBadgeIconUrl(badgeForm.icon_url, badgeForm.name || 'badge')}
                      alt="Preview"
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(badgeForm.name || 'badge')}`;
                      }}
                    />
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 p-4 rounded-2xl cursor-pointer transition">
                    <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs">
                      <Upload size={16} />
                      <span>Upload Custom Icon File</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">PNG, JPG or SVG (Max 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBadgeIconUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBadgeModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#312e81] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Saving...' : editingBadgeId ? 'Update Badge' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zone Creation / Editing Modal */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto animate-[popIn_0.2s_ease-out]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingZoneId ? 'Edit Adventure Zone' : 'Create Adventure Zone'}</h3>
                <p className="text-slate-500 text-sm">{editingZoneId ? 'Modify this adventure quest map zone.' : 'Add a new adventure quest map zone.'}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoneModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleZoneSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Zone Unique ID *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingZoneId}
                    placeholder="e.g. grasslands (lowercase, no spaces)"
                    value={zoneForm.id}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Short Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grasslands"
                    value={zoneForm.short_name}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, short_name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Zone Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zone 1: The Grasslands"
                  value={zoneForm.name}
                  onChange={(e) => setZoneForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Progression Order (Sort Order) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={zoneForm.sort_order}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Default XP Reward</label>
                  <input
                    type="number"
                    required
                    value={zoneForm.xp}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Position X (left coordinate) *</label>
                  <input
                    type="number"
                    required
                    value={zoneForm.pos_x}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, pos_x: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Position Y (bottom coordinate) *</label>
                  <input
                    type="number"
                    required
                    value={zoneForm.pos_y}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, pos_y: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Gradient CSS classes</label>
                  <input
                    type="text"
                    placeholder="from-emerald-400 to-teal-500"
                    value={zoneForm.gradient}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, gradient: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Animation Delay</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5s"
                    value={zoneForm.delay}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, delay: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Border CSS class</label>
                  <input
                    type="text"
                    placeholder="border-emerald-300"
                    value={zoneForm.border_color}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, border_color: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Shadow CSS class</label>
                  <input
                    type="text"
                    placeholder="shadow-emerald-200"
                    value={zoneForm.shadow_color}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, shadow_color: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Background Light CSS class</label>
                  <input
                    type="text"
                    placeholder="bg-emerald-50"
                    value={zoneForm.bg_light}
                    onChange={(e) => setZoneForm(prev => ({ ...prev, bg_light: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 font-black">Island Image URL</label>
                <input
                  type="text"
                  placeholder="Paste a direct image URL for the floating island"
                  value={zoneForm.image_url}
                  onChange={(e) => setZoneForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  id="zone_is_active"
                  checked={zoneForm.is_active !== false}
                  onChange={(e) => setZoneForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <div>
                  <label htmlFor="zone_is_active" className="text-sm font-bold text-slate-800 cursor-pointer block">
                    Active / Visible to students
                  </label>
                  <span className="text-xs text-slate-500">
                    If unchecked, this zone and its quests will be hidden from the student adventure map.
                  </span>
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#312e81] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Saving...' : editingZoneId ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Award Badge Modal */}
      {isAwardModalOpen && selectedAwardBadge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline-lg font-black text-slate-955 flex items-center gap-2">
                <Award className="text-emerald-500" size={24} />
                <span>Award Special Badge</span>
              </h3>
              <button
                onClick={() => setIsAwardModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="h-12 w-12 bg-white rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={getBadgeIconUrl(selectedAwardBadge.icon_url, selectedAwardBadge.name)}
                  alt={selectedAwardBadge.name}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{selectedAwardBadge.name}</h4>
                <p className="text-[11px] text-slate-500 font-semibold">{selectedAwardBadge.description}</p>
              </div>
            </div>

            <form onSubmit={handleManualAwardBadgeSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Select Student *</label>
                <select
                  required
                  value={awardUserId}
                  onChange={(e) => setAwardUserId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition outline-none"
                >
                  <option value="">-- Select Student / User --</option>
                  {dbUsers
                    .filter(u => u.role !== 'admin')
                    .map(usr => (
                      <option key={usr.id} value={usr.id}>
                        {usr.fullname} ({usr.email || usr.username})
                      </option>
                    ))}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Awarding...' : 'Grant Badge'}
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
