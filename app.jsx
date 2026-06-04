import React, { useState, useEffect } from 'react';
import {
  KanbanSquare, ListTodo, Calendar as CalendarIcon, BarChart3,
  Sparkles, Settings, Users, Search, Plus, CheckSquare, AlertCircle,
  Clock, User, Shield, Bell, Trash2, Edit3, Check, MessageSquare,
  ArrowUpDown, ChevronRight, Moon, Sun, Filter, UserPlus, BookOpen,
  HelpCircle, TrendingUp, Brain, Share2, ChevronLeft, X, Info,
  Layers, CheckCircle2, ArrowRight, Menu
} from 'lucide-react';

const TEAM_MEMBERS = [
  { id: '1', name: 'Alex Rivera',   role: 'Administrator',   avatar: 'AR', color: 'bg-indigo-600',  permissions: 'all'  },
  { id: '2', name: 'Diana Chen',    role: 'Project Manager', avatar: 'DC', color: 'bg-emerald-500', permissions: 'edit' },
  { id: '3', name: 'Dave Miller',   role: 'Developer',       avatar: 'DM', color: 'bg-amber-500',   permissions: 'edit' },
  { id: '4', name: 'Valerie Smith', role: 'Guest Viewer',    avatar: 'VS', color: 'bg-slate-400',   permissions: 'read' },
];

const INITIAL_TASKS = [
  {
    id: 'task-1', title: 'Design Landing Page Hero Section',
    description: 'Craft high-fidelity mockups emphasizing the value proposition and core interactive showcase.',
    status: 'To Do', priority: 'High', dueDate: '2026-06-15', assignee: 'Diana Chen',
    category: 'Design', tags: ['Figma', 'UI/UX'], estimatedHours: 8,
    comments: [{ id: 'c1', author: 'Alex Rivera', text: 'Make sure we match the new brand gradients!', date: '2026-06-02' }],
    subtasks: [
      { id: 'sub-1', text: 'Create initial wireframe', completed: true },
      { id: 'sub-2', text: 'Define color palette variants', completed: false },
      { id: 'sub-3', text: 'Test contrast ratios', completed: false },
    ], createdAt: '2026-06-01',
  },
  {
    id: 'task-2', title: 'Implement OAuth Authentication Flow',
    description: 'Integrate secure login with Google, GitHub, and email/password with JWT session configs.',
    status: 'In Progress', priority: 'High', dueDate: '2026-06-08', assignee: 'Dave Miller',
    category: 'Development', tags: ['Security', 'Backend'], estimatedHours: 12,
    comments: [{ id: 'c2', author: 'Dave Miller', text: 'Finished setting up credentials on Google Console.', date: '2026-06-03' }],
    subtasks: [
      { id: 'sub-4', text: 'Set up database schema', completed: true },
      { id: 'sub-5', text: 'Configure OAuth callbacks', completed: true },
      { id: 'sub-6', text: 'Add token refresh mechanics', completed: false },
    ], createdAt: '2026-06-02',
  },
  {
    id: 'task-3', title: 'Review Marketing Content Strategy',
    description: 'Assess content schedules, visual standards, and SEO outlines for the product announcement.',
    status: 'In Review', priority: 'Medium', dueDate: '2026-06-12', assignee: 'Alex Rivera',
    category: 'Marketing', tags: ['SEO', 'Content'], estimatedHours: 4,
    comments: [],
    subtasks: [{ id: 'sub-7', text: 'Consolidate keywords spreadsheet', completed: true }],
    createdAt: '2026-06-01',
  },
  {
    id: 'task-4', title: 'Resolve Responsive Navigation Bugs',
    description: 'Fix visual glitches with hamburger menus, dropdown animations, and touch targets.',
    status: 'Completed', priority: 'Low', dueDate: '2026-06-04', assignee: 'Dave Miller',
    category: 'Development', tags: ['CSS', 'Bugfix'], estimatedHours: 3,
    comments: [],
    subtasks: [{ id: 'sub-8', text: 'Verify tap targets on iPhone 13 Pro', completed: true }],
    createdAt: '2026-06-01',
  },
];

const COLUMNS   = ['To Do', 'In Progress', 'In Review', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Design', 'Development', 'Marketing', 'Management', 'Other'];

export default function App() {
  /* ── State ── */
  const [tasks, setTasks] = useState(() => {
    try { const s = localStorage.getItem('tm_tasks'); return s ? JSON.parse(s) : INITIAL_TASKS; }
    catch { return INITIAL_TASKS; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { const s = localStorage.getItem('tm_user'); return s ? JSON.parse(s) : TEAM_MEMBERS[0]; }
    catch { return TEAM_MEMBERS[0]; }
  });

  const [activeTab,            setActiveTab]            = useState('board');
  const [searchQuery,          setSearchQuery]          = useState('');
  const [filterPriority,       setFilterPriority]       = useState('All');
  const [filterCategory,       setFilterCategory]       = useState('All');
  const [sortBy,               setSortBy]               = useState('dueDate');
  const [isDarkMode,           setIsDarkMode]           = useState(false);
  const [mobileMenuOpen,       setMobileMenuOpen]       = useState(false);
  const [toasts,               setToasts]               = useState([]);
  const [quickAddColumn,       setQuickAddColumn]       = useState(null);
  const [quickAddTitle,        setQuickAddTitle]        = useState('');
  const [showTaskModal,        setShowTaskModal]        = useState(false);
  const [editingTask,          setEditingTask]          = useState(null);
  const [selectedTask,         setSelectedTask]         = useState(null);
  const [notifications,        setNotifications]        = useState([]);
  const [showNotifications,    setShowNotifications]    = useState(false);
  const [activityFeed,         setActivityFeed]         = useState([
    { id: 1, text: 'Alex Rivera added "Review Marketing Content Strategy"', time: '1 hour ago' },
    { id: 2, text: 'Diana Chen completed "Resolve Responsive Navigation Bugs"', time: '2 hours ago' },
  ]);
  const [aiGoal,      setAiGoal]      = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage,   setAiMessage]   = useState({ text: '', type: '' });

  // Form
  const [formTitle,    setFormTitle]    = useState('');
  const [formDesc,     setFormDesc]     = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formCategory, setFormCategory] = useState('Development');
  const [formAssignee, setFormAssignee] = useState(TEAM_MEMBERS[0].name);
  const [formDueDate,  setFormDueDate]  = useState('');
  const [formTags,     setFormTags]     = useState('');
  const [formSubtasks, setFormSubtasks] = useState('');

  /* ── Persistence ── */
  useEffect(() => { localStorage.setItem('tm_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('tm_user',  JSON.stringify(currentUser)); }, [currentUser]);

  /* ── Helpers ── */
  const toast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const logActivity = (text) =>
    setActivityFeed(p => [{ id: Date.now(), text, time: 'Just now' }, ...p]);

  const resetForm = () => {
    setFormTitle(''); setFormDesc(''); setFormPriority('Medium');
    setFormCategory('Development'); setFormAssignee(TEAM_MEMBERS[0].name);
    setFormDueDate(''); setFormTags(''); setFormSubtasks('');
    setEditingTask(null);
  };

  /* ── CRUD ── */
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (currentUser.permissions === 'read') { toast('Read-only access.', 'error'); return; }
    if (!formTitle.trim()) { toast('Title is required.', 'error'); return; }

    const tags      = formTags ? formTags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const subtaskArr = formSubtasks
      ? formSubtasks.split('\n').map((t, i) => ({ id: `sub-${Date.now()}-${i}`, text: t.trim(), completed: false })).filter(s => s.text)
      : [];

    if (editingTask) {
      setTasks(p => p.map(t => t.id === editingTask.id
        ? { ...t, title: formTitle, description: formDesc, priority: formPriority,
            category: formCategory, assignee: formAssignee,
            dueDate: formDueDate || t.dueDate,
            tags: tags.length ? tags : t.tags,
            subtasks: subtaskArr.length ? [...t.subtasks, ...subtaskArr] : t.subtasks }
        : t));
      toast('Task updated.', 'success');
      logActivity(`${currentUser.name} updated "${formTitle}"`);
    } else {
      const newTask = {
        id: `task-${Date.now()}`, title: formTitle, description: formDesc,
        status: 'To Do', priority: formPriority, category: formCategory,
        dueDate: formDueDate || new Date().toISOString().split('T')[0],
        assignee: formAssignee, tags: tags.length ? tags : ['General'],
        estimatedHours: 4, comments: [], subtasks: subtaskArr,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks(p => [newTask, ...p]);
      toast('Task created.', 'success');
      logActivity(`${currentUser.name} created "${formTitle}"`);
    }
    resetForm(); setShowTaskModal(false);
  };

  const handleQuickAdd = (col) => {
    if (currentUser.permissions === 'read') { toast('Read-only.', 'error'); return; }
    if (!quickAddTitle.trim()) { setQuickAddColumn(null); return; }
    const t = {
      id: `task-${Date.now()}`, title: quickAddTitle, description: '',
      status: col, priority: 'Medium', category: 'Development',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: currentUser.name, tags: ['QuickAdd'],
      estimatedHours: 2, comments: [], subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(p => [t, ...p]);
    toast('Task added.', 'success');
    setQuickAddTitle(''); setQuickAddColumn(null);
  };

  const handleDelete = (id) => {
    if (currentUser.role !== 'Administrator') { toast('Admins only.', 'error'); return; }
    setTasks(p => p.filter(t => t.id !== id));
    toast('Deleted.', 'success'); setSelectedTask(null);
  };

  const handleStatusChange = (id, status) => {
    if (currentUser.permissions === 'read') { toast('Read-only.', 'error'); return; }
    setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
    if (selectedTask && selectedTask.id === id) setSelectedTask(p => ({ ...p, status }));
    toast(`Moved to ${status}`, 'success');
  };

  const handleToggleSubtask = (taskId, subId) => {
    if (currentUser.permissions === 'read') { toast('Read-only.', 'error'); return; }
    setTasks(p => {
      const updated = p.map(t => t.id === taskId
        ? { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s) }
        : t);
      const found = updated.find(t => t.id === taskId);
      if (found) setSelectedTask(found);
      return updated;
    });
  };

  const handleAddComment = (taskId, text) => {
    if (!text.trim()) return;
    if (currentUser.permissions === 'read') { toast('Read-only.', 'error'); return; }
    setTasks(p => {
      const updated = p.map(t => t.id === taskId
        ? { ...t, comments: [...t.comments, { id: `c-${Date.now()}`, author: currentUser.name, text, date: new Date().toISOString().split('T')[0] }] }
        : t);
      const found = updated.find(t => t.id === taskId);
      if (found) setSelectedTask(found);
      return updated;
    });
    toast('Comment added.', 'success');
  };

  const handleEditClick = (task) => {
    if (currentUser.permissions === 'read') { toast('Read-only.', 'error'); return; }
    setEditingTask(task);
    setFormTitle(task.title); setFormDesc(task.description);
    setFormPriority(task.priority); setFormCategory(task.category);
    setFormAssignee(task.assignee); setFormDueDate(task.dueDate);
    setFormTags(task.tags.join(', ')); setFormSubtasks('');
    setShowTaskModal(true); setSelectedTask(null);
  };

  const generateAI = () => {
    if (!aiGoal.trim()) { setAiMessage({ text: 'Enter a project goal first.', type: 'error' }); return; }
    setIsAiLoading(true);
    setAiMessage({ text: 'Generating tasks…', type: 'info' });
    setTimeout(() => {
      const mocks = [
        { title: `Configure DB Schema for ${aiGoal}`, description: 'Implement migrations & indexes.', priority: 'High', category: 'Development', estimatedHours: 6 },
        { title: `Design Component Library for ${aiGoal}`, description: 'Typography & color tokens.', priority: 'Medium', category: 'Design', estimatedHours: 8 },
        { title: 'Conduct Security Audit', description: 'Token endpoints & integration tests.', priority: 'Low', category: 'Development', estimatedHours: 4 },
      ];
      const mapped = mocks.map((t, i) => ({
        id: `ai-${Date.now()}-${i}`, ...t,
        status: 'To Do',
        dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
        assignee: TEAM_MEMBERS[i % TEAM_MEMBERS.length].name,
        tags: ['AI-Generated'], comments: [], subtasks: [], createdAt: new Date().toISOString().split('T')[0],
      }));
      setTasks(p => [...mapped, ...p]);
      setAiMessage({ text: `Generated ${mapped.length} tasks!`, type: 'success' });
      setAiGoal(''); setIsAiLoading(false);
    }, 1500);
  };

  /* ── Derived ── */
  const filteredTasks = tasks.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q));
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchSearch && matchPriority && matchCategory;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'priority') { const w = { High: 3, Medium: 2, Low: 1 }; return (w[b.priority] || 0) - (w[a.priority] || 0); }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressRatio  = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const highRiskCount  = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const totalHours     = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  /* ── Colour helpers ── */
  const colColour = (col) => col === 'To Do' ? 'bg-slate-400' : col === 'In Progress' ? 'bg-indigo-500' : col === 'In Review' ? 'bg-amber-500' : 'bg-emerald-500';
  const priBadge  = (p)   => p === 'High' ? 'bg-rose-500/15 text-rose-500' : p === 'Medium' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500';
  const staBadge  = (s)   => s === 'Completed' ? 'bg-emerald-500/15 text-emerald-500' : s === 'In Review' ? 'bg-amber-500/15 text-amber-500' : s === 'In Progress' ? 'bg-indigo-500/15 text-indigo-500' : 'bg-slate-400/15 text-slate-400';
  const initials  = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const dk = isDarkMode;
  const card   = `rounded-2xl border p-5 transition-colors duration-200 ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;
  const inputCl = `w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${dk ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`;

  /* ════════════════════════════════
     NAV ITEMS
  ════════════════════════════════ */
  const NAV = [
    { id: 'board',     icon: KanbanSquare,  label: 'Kanban Board'    },
    { id: 'list',      icon: ListTodo,      label: 'List View'       },
    { id: 'calendar',  icon: CalendarIcon,  label: 'Calendar'        },
    { id: 'dashboard', icon: BarChart3,     label: 'Dashboard'       },
    { id: 'ai',        icon: Sparkles,      label: 'AI Copilot'      },
    { id: 'team',      icon: Users,         label: 'Team Members'    },
    { id: 'settings',  icon: Settings,      label: 'Settings'        },
  ];

  /* ════════════════════════════════
     KANBAN BOARD
  ════════════════════════════════ */
  function KanbanBoard() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col);
          const isAdding = quickAddColumn === col;
          return (
            <div key={col} className={`rounded-3xl border flex flex-col h-[82vh] transition-colors duration-200 ${dk ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/70 border-slate-200'}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between p-5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${colColour(col)}`} />
                  <h3 className="font-black text-xs uppercase tracking-widest">{col}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg ${dk ? 'bg-slate-800 text-slate-400' : 'bg-white shadow-sm text-slate-500'}`}>{colTasks.length}</span>
                </div>
                {currentUser.permissions !== 'read' && (
                  <button
                    onClick={() => setQuickAddColumn(isAdding ? null : col)}
                    className={`p-1.5 rounded-lg transition-all hover:scale-105 ${dk ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-white text-slate-500 shadow-sm'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Add */}
              {isAdding && (
                <div className="px-4 pb-3 animate-pulse-once">
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Task title…"
                      value={quickAddTitle}
                      onChange={e => setQuickAddTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(col); if (e.key === 'Escape') { setQuickAddColumn(null); setQuickAddTitle(''); } }}
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                    />
                    <button onClick={() => handleQuickAdd(col)} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setQuickAddColumn(null); setQuickAddTitle(''); }} className={`p-2 rounded-xl ${dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'}`}><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}

              {/* Cards */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-24 border border-dashed rounded-2xl flex items-center justify-center text-xs text-slate-400 font-semibold border-slate-300 dark:border-slate-700">
                    No tasks here
                  </div>
                ) : colTasks.map(task => {
                  const done  = task.subtasks.filter(s => s.completed).length;
                  const total = task.subtasks.length;
                  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`rounded-2xl border p-4 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 relative group ${dk ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 hover:border-indigo-400/60'}`}
                    >
                      {/* Move buttons (hover) */}
                      <div
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity z-10 bg-white dark:bg-slate-900 rounded-lg p-1 shadow border border-slate-200 dark:border-slate-700"
                        onClick={e => e.stopPropagation()}
                      >
                        {COLUMNS.filter(c => c !== task.status).map(c => (
                          <button
                            key={c}
                            title={c}
                            onClick={() => handleStatusChange(task.id, c)}
                            className={`w-3.5 h-3.5 rounded-full hover:scale-125 transition-all ${colColour(c)}`}
                          />
                        ))}
                      </div>

                      {/* Priority badge */}
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${priBadge(task.priority)} mb-2 inline-block`}>{task.priority}</span>

                      <p className="font-bold text-xs leading-snug mb-2 pr-10">{task.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{task.description}</p>

                      {/* Progress */}
                      {total > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1">
                            <span>Progress</span><span>{pct}%</span>
                          </div>
                          <div className={`w-full h-1 rounded-full ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div className="bg-indigo-500 h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 2).map(tag => (
                          <span key={tag} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>#{tag}</span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-rose-500 font-black' : ''}>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.comments.length > 0 && (
                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                              <MessageSquare className="w-3 h-3" /><span>{task.comments.length}</span>
                            </div>
                          )}
                          <div className={`w-6 h-6 rounded-lg ${TEAM_MEMBERS.find(m => m.name === task.assignee)?.color || 'bg-indigo-500'} text-white flex items-center justify-center text-[9px] font-black`}>
                            {initials(task.assignee)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ════════════════════════════════
     LIST VIEW
  ════════════════════════════════ */
  function ListView() {
    return (
      <div className={`rounded-3xl border overflow-hidden ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase text-slate-400 tracking-wider ${dk ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Assignee</th>
                <th className="py-4 px-4">Due Date</th>
                <th className="py-4 px-4">Progress</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${dk ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredTasks.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">No tasks found.</td></tr>
              ) : filteredTasks.map(task => {
                const done  = task.subtasks.filter(s => s.completed).length;
                const total = task.subtasks.length;
                const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <tr key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer hover:bg-indigo-50/10 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-xs">{task.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{task.description}</p>
                    </td>
                    <td className="py-3.5 px-4"><span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase ${staBadge(task.status)}`}>{task.status}</span></td>
                    <td className="py-3.5 px-4"><span className={`text-[9px] font-black uppercase ${task.priority === 'High' ? 'text-rose-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{task.priority}</span></td>
                    <td className="py-3.5 px-4 text-[10px] font-bold text-slate-400 uppercase">{task.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded ${TEAM_MEMBERS.find(m => m.name === task.assignee)?.color || 'bg-indigo-500'} text-white flex items-center justify-center text-[9px] font-black`}>{initials(task.assignee)}</div>
                        <span className="font-semibold">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">{task.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-1.5 rounded-full ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} /></div>
                        <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEditClick(task)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     CALENDAR VIEW
  ════════════════════════════════ */
  function CalendarView() {
    const today = new Date();
    const days  = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
    return (
      <div className={`rounded-3xl border p-6 ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="font-black text-lg mb-6">Upcoming 14 Days</h2>
        <div className="space-y-3">
          {days.map((day, i) => {
            const dateStr  = day.toISOString().split('T')[0];
            const dayTasks = tasks.filter(t => t.dueDate === dateStr);
            const isToday  = i === 0;
            return (
              <div key={dateStr} className={`flex gap-4 rounded-2xl p-4 ${isToday ? (dk ? 'bg-indigo-950/40 border border-indigo-700/40' : 'bg-indigo-50 border border-indigo-200') : (dk ? 'bg-slate-800/30' : 'bg-slate-50')}`}>
                <div className="w-16 flex-shrink-0 text-center">
                  <div className={`text-2xl font-black ${isToday ? 'text-indigo-500' : ''}`}>{day.getDate()}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{day.toLocaleDateString('en', { weekday: 'short' })}</div>
                </div>
                <div className="flex-1">
                  {dayTasks.length === 0
                    ? <p className="text-xs text-slate-400 mt-1">No tasks due</p>
                    : dayTasks.map(t => (
                      <div key={t.id} onClick={() => setSelectedTask(t)} className="flex items-center gap-2 mb-1.5 cursor-pointer hover:opacity-80">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colColour(t.status)}`} />
                        <span className="text-xs font-semibold">{t.title}</span>
                        <span className={`text-[9px] font-black uppercase ml-auto ${priBadge(t.priority)} px-2 py-0.5 rounded-md`}>{t.priority}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     DASHBOARD
  ════════════════════════════════ */
  function Dashboard() {
    const byStatus   = COLUMNS.map(c => ({ label: c, count: tasks.filter(t => t.status === c).length }));
    const byPriority = PRIORITIES.map(p => ({ label: p, count: tasks.filter(t => t.priority === p).length }));
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Tasks',     value: tasks.length,      icon: CheckSquare, color: 'text-indigo-500' },
            { label: 'Completed',       value: completedCount,    icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'High Risk',       value: highRiskCount,     icon: AlertCircle, color: 'text-rose-500' },
            { label: 'Total Hours',     value: `${totalHours}h`,  icon: Clock, color: 'text-amber-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={card}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-slate-400">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-3xl font-black">{value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className={card}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-sm">Overall Progress</h3>
            <span className="text-2xl font-black text-indigo-500">{progressRatio}%</span>
          </div>
          <div className={`w-full h-3 rounded-full ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressRatio}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* By Status */}
          <div className={card}>
            <h3 className="font-black text-sm mb-4">Tasks by Status</h3>
            <div className="space-y-3">
              {byStatus.map(({ label, count }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>{label}</span><span>{count}</span></div>
                  <div className={`w-full h-2 rounded-full ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`h-2 rounded-full ${colColour(label)}`} style={{ width: tasks.length ? `${(count / tasks.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Priority */}
          <div className={card}>
            <h3 className="font-black text-sm mb-4">Tasks by Priority</h3>
            <div className="space-y-3">
              {byPriority.map(({ label, count }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>{label}</span><span>{count}</span></div>
                  <div className={`w-full h-2 rounded-full ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`h-2 rounded-full ${label === 'High' ? 'bg-rose-500' : label === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: tasks.length ? `${(count / tasks.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className={card}>
          <h3 className="font-black text-sm mb-4">Activity Feed</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activityFeed.map(item => (
              <div key={item.id} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">{item.text}</p>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     AI COPILOT
  ════════════════════════════════ */
  function AICopilot() {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={card}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base">AI Copilot</h2>
              <p className="text-xs text-slate-400">Generate tasks from a project goal</p>
            </div>
          </div>
          <textarea
            value={aiGoal}
            onChange={e => setAiGoal(e.target.value)}
            placeholder="Describe your project goal… e.g. 'Build a real-time chat app with React and Node.js'"
            rows={4}
            className={inputCl + ' resize-none'}
          />
          <button
            onClick={generateAI}
            disabled={isAiLoading}
            className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isAiLoading ? 'Generating…' : '✨ Generate Tasks'}
          </button>
          {aiMessage.text && (
            <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-semibold ${aiMessage.type === 'error' ? 'bg-rose-500/10 text-rose-500' : aiMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
              {aiMessage.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     TEAM
  ════════════════════════════════ */
  function Team() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TEAM_MEMBERS.map(member => {
          const memberTasks = tasks.filter(t => t.assignee === member.name);
          const done        = memberTasks.filter(t => t.status === 'Completed').length;
          return (
            <div key={member.id} className={`${card} text-center`}>
              <div className={`w-16 h-16 rounded-2xl ${member.color} text-white flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-lg`}>{member.avatar}</div>
              <h3 className="font-black text-sm">{member.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{member.role}</p>
              <div className="flex justify-around text-center mb-4">
                <div><div className="font-black text-lg">{memberTasks.length}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Tasks</div></div>
                <div><div className="font-black text-lg text-emerald-500">{done}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Done</div></div>
              </div>
              <button
                onClick={() => { setCurrentUser(member); toast(`Switched to ${member.name}`, 'success'); }}
                className={`w-full py-2 text-xs font-black rounded-xl transition-all ${currentUser.id === member.id ? 'bg-indigo-600 text-white' : (dk ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}`}
              >
                {currentUser.id === member.id ? '✓ Active' : 'Switch Role'}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  /* ════════════════════════════════
     SETTINGS
  ════════════════════════════════ */
  function SettingsView() {
    return (
      <div className="max-w-xl space-y-5">
        <div className={card}>
          <h3 className="font-black text-sm mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div><p className="font-bold text-sm">Dark Mode</p><p className="text-xs text-slate-400">Toggle dark/light theme</p></div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
        <div className={card}>
          <h3 className="font-black text-sm mb-4">Filters & Sorting</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={inputCl}>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Priority Filter</label>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className={inputCl}>
                <option value="All">All</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category Filter</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={inputCl}>
                <option value="All">All</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     TASK DETAIL DRAWER
  ════════════════════════════════ */
  function TaskDrawer() {
    if (!selectedTask) return null;
    const [commentText, setCommentText] = useState('');
    const done  = selectedTask.subtasks.filter(s => s.completed).length;
    const total = selectedTask.subtasks.length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
        <div className={`w-full max-w-md h-full overflow-y-auto flex flex-col shadow-2xl transition-colors duration-200 ${dk ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
          {/* Header */}
          <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} z-10`}>
            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${priBadge(selectedTask.priority)}`}>{selectedTask.priority}</span>
            <div className="flex gap-2">
              {currentUser.permissions !== 'read' && (
                <>
                  <button onClick={() => handleEditClick(selectedTask)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500"><Edit3 className="w-4 h-4" /></button>
                  {currentUser.role === 'Administrator' && <button onClick={() => handleDelete(selectedTask.id)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>}
                </>
              )}
              <button onClick={() => setSelectedTask(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <div>
              <h2 className="font-black text-lg leading-snug mb-2">{selectedTask.title}</h2>
              <p className="text-sm text-slate-400">{selectedTask.description}</p>
            </div>

            {/* Status selector */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Move to Status</label>
              <div className="flex gap-2 flex-wrap">
                {COLUMNS.map(c => (
                  <button
                    key={c}
                    onClick={() => handleStatusChange(selectedTask.id, c)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${selectedTask.status === c ? `${colColour(c)} text-white` : (dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks */}
            {total > 0 && (
              <div>
                <div className="flex justify-between text-xs font-black uppercase text-slate-400 mb-2"><span>Subtasks</span><span>{done}/{total} · {pct}%</span></div>
                <div className={`w-full h-1.5 rounded-full mb-3 ${dk ? 'bg-slate-800' : 'bg-slate-200'}`}><div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                <div className="space-y-2">
                  {selectedTask.subtasks.map(s => (
                    <button key={s.id} onClick={() => handleToggleSubtask(selectedTask.id, s.id)} className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${s.completed ? 'bg-indigo-500 border-indigo-500' : (dk ? 'border-slate-700' : 'border-slate-300')}`}>
                        {s.completed && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-xs font-semibold ${s.completed ? 'line-through text-slate-400' : ''}`}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Assignee', value: selectedTask.assignee },
                { label: 'Due Date', value: selectedTask.dueDate },
                { label: 'Category', value: selectedTask.category },
                { label: 'Hours',    value: `${selectedTask.estimatedHours}h` },
              ].map(({ label, value }) => (
                <div key={label} className={`rounded-xl p-3 ${dk ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{label}</div>
                  <div className="text-xs font-bold">{value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedTask.tags.map(t => (
                <span key={t} className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${dk ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>#{t}</span>
              ))}
            </div>

            {/* Comments */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-3">Comments ({selectedTask.comments.length})</label>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {selectedTask.comments.map(c => (
                  <div key={c.id} className={`rounded-xl p-3 ${dk ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-black text-indigo-500">{c.author}</span>
                      <span className="text-[9px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs">{c.text}</p>
                  </div>
                ))}
              </div>
              {currentUser.permissions !== 'read' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { handleAddComment(selectedTask.id, commentText); setCommentText(''); } }}
                    placeholder="Add a comment…"
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                  <button onClick={() => { handleAddComment(selectedTask.id, commentText); setCommentText(''); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black">Post</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     TASK MODAL
  ════════════════════════════════ */
  function TaskModal() {
    if (!showTaskModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowTaskModal(false); resetForm(); }} />
        <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center justify-between p-6 border-b ${dk ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="font-black text-base">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={() => { setShowTaskModal(false); resetForm(); }} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSaveTask} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Title *</label><input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} className={inputCl} placeholder="Task title" required /></div>
            <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Description</label><textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} className={inputCl + ' resize-none'} rows={3} placeholder="Task description" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Priority</label>
                <select value={formPriority} onChange={e => setFormPriority(e.target.value)} className={inputCl}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Category</label>
                <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className={inputCl}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Assignee</label>
                <select value={formAssignee} onChange={e => setFormAssignee(e.target.value)} className={inputCl}>
                  {TEAM_MEMBERS.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Due Date</label><input type="date" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} className={inputCl} /></div>
            </div>
            <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Tags (comma separated)</label><input type="text" value={formTags} onChange={e => setFormTags(e.target.value)} className={inputCl} placeholder="React, API, UI" /></div>
            <div><label className="text-xs font-black uppercase text-slate-400 mb-1 block">Subtasks (one per line)</label><textarea value={formSubtasks} onChange={e => setFormSubtasks(e.target.value)} className={inputCl + ' resize-none'} rows={3} placeholder="Write tests&#10;Deploy to staging" /></div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowTaskModal(false); resetForm(); }} className={`flex-1 py-2.5 rounded-xl font-black text-sm border transition-all ${dk ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-opacity">{editingTask ? 'Update Task' : 'Create Task'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  const tabContent = () => {
    switch (activeTab) {
      case 'board':     return <KanbanBoard />;
      case 'list':      return <ListView />;
      case 'calendar':  return <CalendarView />;
      case 'dashboard': return <Dashboard />;
      case 'ai':        return <AICopilot />;
      case 'team':      return <Team />;
      case 'settings':  return <SettingsView />;
      default:          return <KanbanBoard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${dk ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Toast Portal */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border font-semibold text-sm transition-all ${t.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-indigo-600 border-transparent text-white'}`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 py-4 border-b transition-colors duration-200 ${dk ? 'bg-slate-900/95 border-slate-800 backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur'}`}>
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">ApexTask</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Global Agile System</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search tasks, tags…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${dk ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200'}`} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Dark mode */}
          <button onClick={() => setIsDarkMode(!dk)} className={`p-2.5 rounded-xl border hover:scale-105 transition-all ${dk ? 'border-slate-700 text-amber-400 bg-slate-900' : 'border-slate-200 text-indigo-600 bg-white shadow-sm'}`}>
            {dk ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2.5 rounded-xl border relative hover:scale-105 transition-all ${dk ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white shadow-sm text-slate-600'}`}>
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />}
            </button>
            {showNotifications && (
              <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border p-5 z-50 ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-black text-xs uppercase text-slate-400">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400"><X className="w-3.5 h-3.5" /></button>
                </div>
                {notifications.length === 0
                  ? <p className="text-xs text-slate-400 text-center py-6">All caught up!</p>
                  : notifications.slice(0, 5).map(n => (
                    <div key={n.id} className={`p-3 rounded-xl mb-2 text-xs ${n.unread ? (dk ? 'bg-indigo-950/30' : 'bg-indigo-50') : ''}`}>
                      <p className="font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* New Task */}
          {currentUser.permissions !== 'read' && (
            <button onClick={() => setShowTaskModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-black text-xs hover:opacity-90 transition-opacity shadow-lg shadow-indigo-600/25">
              <Plus className="w-4 h-4" /><span>New Task</span>
            </button>
          )}

          {/* User */}
          <div className={`w-9 h-9 rounded-xl ${currentUser.color} text-white flex items-center justify-center font-black text-xs shadow-md`}>{currentUser.avatar}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex w-64 flex-shrink-0 flex-col border-r transition-colors duration-200 ${dk ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <nav className="p-5 space-y-1 flex-1">
            <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 px-3 mb-3">Workspace</p>
            {NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : (dk ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar footer — current user */}
          <div className={`p-5 border-t ${dk ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${currentUser.color} text-white flex items-center justify-center font-black text-[10px]`}>{currentUser.avatar}</div>
              <div>
                <p className="text-xs font-black">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Toolbar */}
          <div className={`sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b transition-colors duration-200 ${dk ? 'bg-slate-950/80 border-slate-800 backdrop-blur' : 'bg-slate-50/80 border-slate-200 backdrop-blur'}`}>
            <div>
              <h2 className="font-black text-base capitalize">{NAV.find(n => n.id === activeTab)?.label}</h2>
              <p className="text-[10px] text-slate-400">{filteredTasks.length} tasks matching current filters</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority filter */}
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className={`text-xs rounded-xl border px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${dk ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                <option value="All">All Priority</option>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
              {/* Category filter */}
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={`text-xs rounded-xl border px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${dk ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`text-xs rounded-xl border px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${dk ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                <option value="dueDate">Sort: Due Date</option>
                <option value="priority">Sort: Priority</option>
                <option value="title">Sort: Title</option>
              </select>
              {currentUser.permissions !== 'read' && (
                <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs transition-colors">
                  <Plus className="w-3.5 h-3.5" /><span>New Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {tabContent()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <TaskModal />
      <TaskDrawer />
    </div>
  );
}