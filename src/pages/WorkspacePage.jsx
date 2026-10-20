import React, { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';
import Dropdown from '../components/ui/dropdown';

const EMPLOYEE_ROLES = ['BDA', 'Developers', 'Electrical', 'Digital Marketing'];
const ROSTER = [
  { name: 'Maya Chen', email: 'maya.chen@hvvertex.in', role: 'Developers', department: 'Developers', status: 'Active' },
  { name: 'Rahul Varma', email: 'rahul.varma@hvvertex.in', role: 'BDA', department: 'BDA', status: 'Active' },
  { name: 'Suresh Pillai', email: 'suresh.pillai@hvvertex.in', role: 'Electrical', department: 'Electrical', status: 'Active' },
  { name: 'Ananya Das', email: 'ananya.das@hvvertex.in', role: 'Digital Marketing', department: 'Digital Marketing', status: 'Active' },
  { name: 'Ravi Kumar', email: 'ravi.kumar@hvvertex.in', role: 'Developers', department: 'Developers', status: 'Active' },
];
const DEPARTMENT_LINKS = {
  BDA: [['Lead Management', 'bda-leads'], ['Sales Pipeline', 'bda-pipeline'], ['Targets & Performance', 'bda-targets']],
  Electrical: [['Equipment & Maintenance', 'elec-assets'], ['Work Orders & Inspections', 'elec-workorders'], ['Safety & Technical Reports', 'elec-safety']],
  Developers: [['Projects & Tasks', 'dev-projects-tasks'], ['Bugs & Code Reviews', 'dev-issues'], ['Builds & Releases', 'dev-releases']],
  'Digital Marketing': [['Campaigns & Content', 'mkt-calendar'], ['Creative Files & Approvals', 'mkt-assets'], ['Marketing Analytics', 'mkt-analytics']],
};
const FILES = [
  { name: 'Firmware release checklist.xlsx', department: 'Developers', type: 'Spreadsheet', size: '840 KB', date: '15 Oct 2026', note: 'Release readiness checklist for version 4.10.' },
  { name: 'Product launch key visual.png', department: 'Digital Marketing', type: 'Image', size: '4.1 MB', date: '14 Oct 2026', note: 'Approved creative asset for the product launch.' },
  { name: 'UPS service manual.pdf', department: 'Electrical', type: 'PDF', size: '6.7 MB', date: '12 Oct 2026', note: 'Technical reference for UPS Bank maintenance.' },
  { name: 'Northstar proposal.pdf', department: 'BDA', type: 'PDF', size: '1.2 MB', date: '11 Oct 2026', note: 'Proposal draft for Northstar Systems.' },
];
const INITIAL_TASKS = [
  { id: 1, title: 'Review assigned work queue', due: 'Today', category: 'Work', status: 'In progress' },
  { id: 2, title: 'Weekly team sync', due: 'Tomorrow · 10:00', category: 'Meeting', status: 'Scheduled' },
  { id: 3, title: 'Submit weekly progress update', due: '20 Oct', category: 'Task', status: 'Pending' },
];
const INITIAL_APPROVALS = [
  { id: 1, title: 'Annual leave · Rahul Varma', department: 'BDA', detail: '27–28 Oct · 2 days', status: 'Pending' },
  { id: 2, title: 'Creative review · Product launch', department: 'Digital Marketing', detail: 'Key visual v3', status: 'Pending' },
  { id: 3, title: 'Maintenance purchase · Lab 3', department: 'Electrical', detail: 'UPS service parts', status: 'In review' },
  { id: 4, title: 'Firmware build submission', department: 'Developers', detail: 'Release 4.10.2 candidate', status: 'Approved' },
];
const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: 'Quarterly all-hands meeting', body: 'Join us Friday at 11:00 for a company update and team questions.', audience: 'Everyone', date: '16 Oct 2026' },
  { id: 2, title: 'Planned maintenance window', body: 'Shared file access may be briefly unavailable on Sunday morning.', audience: 'Everyone', date: '14 Oct 2026' },
];

function useDemoState(key, initial) {
  return useState(() => {
    try { return JSON.parse(localStorage.getItem(`hv-demo-${key}`)) ?? initial; } catch { return initial; }
  });
}
function saveDemo(key, value) {
  try { localStorage.setItem(`hv-demo-${key}`, JSON.stringify(value)); } catch { /* Browser storage may be disabled. */ }
}

export default function WorkspacePage({ section, profile, onToast, onNavigate, theme = 'system', onThemeChange, accent = 'forest', onAccentChange }) {
  const notify = (text, kind) => onToast?.(text, kind);
  if (section === 'files' || section === 'files-admin') return <FilesPage admin={section === 'files-admin'} onToast={notify} />;
  if (section === 'calendar') return <CalendarPage onToast={notify} />;
  if (section === 'profile') return <ProfilePage profile={profile} onToast={notify} />;
  if (section === 'people-admin') return <PeoplePage onToast={notify} />;
  if (section === 'announcements') return <AnnouncementsPage onToast={notify} />;
  if (section === 'approvals') return <ApprovalsPage onToast={notify} />;
  if (section === 'reports-admin') return <ReportsPage onToast={notify} />;
  if (section === 'settings') return <SettingsPage theme={theme} onThemeChange={onThemeChange} accent={accent} onAccentChange={onAccentChange} onToast={notify} />;
  if (section === 'admin-departments') return <DepartmentsPage onNavigate={onNavigate} />;
  return <CalendarPage onToast={notify} />;
}

function PageHeading({ eyebrow, title, subtitle, actions }) {
  return <div className="head rise workspace-heading"><div><div className="panel-kicker">{eyebrow}</div><h1>{title}</h1><p className="sub">{subtitle}</p></div>{actions && <div className="acts">{actions}</div>}</div>;
}
function EmptyState({ title, detail }) {
  return <div className="workspace-empty"><Icon name="folder" /><b>{title}</b><span>{detail}</span></div>;
}

function FilesPage({ admin, onToast }) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All departments');
  const [files, setFiles] = useDemoState('files', FILES);
  const [selectedFile, setSelectedFile] = useState(null);
  const filtered = useMemo(() => files.filter((file) => (department === 'All departments' || file.department === department) && file.name.toLowerCase().includes(query.toLowerCase())), [files, query, department]);
  const addFiles = (event) => {
    const incoming = [...(event.target.files || [])];
    if (!incoming.length) return;
    const newFiles = incoming.map((file) => ({ name: file.name, department: 'My files', type: file.type || 'File', size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, date: 'Just now', note: 'Selected locally in this browser demo.', local: true, url: URL.createObjectURL(file) }));
    const next = [...newFiles, ...files];
    setFiles(next); saveDemo('files', next.map(({ url: _url, ...file }) => file)); onToast(`${incoming.length} file${incoming.length === 1 ? '' : 's'} added to this browser demo.`); event.target.value = '';
  };
  const download = (file) => {
    const link = document.createElement('a');
    link.href = file.url || URL.createObjectURL(new Blob([`${file.name}\n${file.note}`], { type: 'text/plain' }));
    link.download = file.name; link.click();
    if (!file.url) URL.revokeObjectURL(link.href);
    onToast(`Prepared ${file.name} for download in this demo.`);
  };
  const remove = (file) => { const next = files.filter((item) => item !== file); setFiles(next); saveDemo('files', next.map(({ url: _url, ...item }) => item)); setSelectedFile(null); onToast(`${file.name} removed from the demo list.`); };
  return <div className="workspace-page">
    <PageHeading eyebrow={admin ? 'ADMIN · FILE CONTROL' : 'SHARED WORKSPACE'} title={admin ? 'File Management' : 'Shared Files'} subtitle={admin ? 'Review shared assets across teams. These controls affect demo data only.' : 'Browse shared team files, inspect details, and simulate a local upload.'} actions={<label className="btn pri workspace-upload-btn"><Icon name="upload" />Add files<input type="file" multiple onChange={addFiles} /></label>} />
    <SpotlightCard className="overview-panel workspace-panel">
      <div className="panel-header"><div><div className="panel-kicker">{filtered.length} ITEMS</div><h2 className="panel-title">Workspace library</h2></div><span className="pill info">LOCAL DEMO</span></div>
      <div className="workspace-toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" aria-label="Search files" /><Dropdown items={['All departments', ...new Set(files.map((file) => file.department))]} value={department} onChange={setDepartment} aria-label="Filter files by department" size="sm" /></div>
      {filtered.length ? <div className="workspace-file-list">{filtered.map((file, index) => <div className="workspace-file-row" key={`${file.name}-${index}`}><div className="workspace-file-icon"><Icon name={file.type === 'Image' ? 'image' : 'file'} /></div><div className="workspace-file-meta"><b>{file.name}</b><small>{file.department} · {file.type} · {file.size} · {file.date}</small></div><div className="acts"><button className="btn out sm" onClick={() => setSelectedFile(file)}>Preview</button><button className="btn out sm" onClick={() => download(file)}><Icon name="download" />Download</button>{admin && <button className="btn ghost sm" aria-label={`Remove ${file.name}`} onClick={() => remove(file)}><Icon name="trash" /></button>}</div></div>)}</div> : <EmptyState title="No matching files" detail="Try another search or department." />}
      <p className="workspace-disclaimer"><Icon name="info" />Demo only: selected files are held in this browser session; no server upload or shared storage occurs.</p>
    </SpotlightCard>
    {selectedFile && <div className="workspace-preview"><div><div className="panel-kicker">FILE PREVIEW</div><h2>{selectedFile.name}</h2><p>{selectedFile.note}</p><small>{selectedFile.department} · {selectedFile.type} · {selectedFile.size}</small></div><div className="acts"><button className="btn out sm" onClick={() => download(selectedFile)}><Icon name="download" />Download</button><button className="btn ghost sm" onClick={() => setSelectedFile(null)} aria-label="Close file preview"><Icon name="x" /></button></div></div>}
  </div>;
}

function CalendarPage({ onToast }) {
  const [tasks, setTasks] = useDemoState('tasks', INITIAL_TASKS);
  const [draft, setDraft] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [due, setDue] = useState('Tomorrow');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visible = tasks.filter((task) => (filter === 'All' || task.status === filter) && task.title.toLowerCase().includes(query.toLowerCase()));
  const addTask = (event) => { event.preventDefault(); if (draft.trim().length < 3) return onToast('Enter a task name with at least 3 characters.', 'bad'); const next = [{ id: Date.now(), title: draft.trim(), due, category: 'Task', status: 'Pending' }, ...tasks]; setTasks(next); saveDemo('tasks', next); setDraft(''); onToast('Task added to your local demo list.'); };
  const update = (task, status) => { const next = tasks.map((item) => item.id === task.id ? { ...item, status } : item); setTasks(next); saveDemo('tasks', next); onToast(`“${task.title}” marked ${status.toLowerCase()}.`); };
  const saveEdit = (event, task) => { event.preventDefault(); if (editDraft.trim().length < 3) return onToast('Task names must contain at least 3 characters.', 'bad'); const next = tasks.map((item) => item.id === task.id ? { ...item, title: editDraft.trim() } : item); setTasks(next); saveDemo('tasks', next); setEditingTask(null); onToast('Task updated in the local demo.'); };
  return <div className="workspace-page">
    <PageHeading eyebrow="MY SCHEDULE" title="Calendar & Tasks" subtitle="Keep upcoming meetings, deadlines, and assigned work visible." actions={<span className="pill info">{tasks.filter((task) => task.status !== 'Complete').length} open</span>} />
    <div className="overview-main-columns workspace-columns">
      <SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">UPCOMING</div><h2 className="panel-title">Tasks & events</h2></div><div className="seg workspace-filter">{['All', 'Pending', 'In progress', 'Complete'].map((item) => <button key={item} className={filter === item ? 'on' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="workspace-toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" aria-label="Search tasks" /></div>
        {visible.length ? <div className="workspace-task-list">{visible.map((task) => <div className="workspace-task-row" key={task.id}><button className={`workspace-check ${task.status === 'Complete' ? 'done' : ''}`} onClick={() => update(task, task.status === 'Complete' ? 'Pending' : 'Complete')} aria-label={`Mark ${task.title} ${task.status === 'Complete' ? 'incomplete' : 'complete'}`}><Icon name="check" /></button>{editingTask === task.id ? <form className="workspace-edit-task" onSubmit={(event) => saveEdit(event, task)}><input value={editDraft} onChange={(event) => setEditDraft(event.target.value)} aria-label="Edit task title" autoFocus /><button className="btn pri sm" type="submit">Save</button><button className="btn ghost sm" type="button" onClick={() => setEditingTask(null)}>Cancel</button></form> : <div className="workspace-task-meta"><b>{task.title}</b><small>{task.category} · Due {task.due}</small></div>}<span className={`pill ${task.status === 'Complete' ? 'good' : task.status === 'Pending' ? 'warn' : 'info'}`}>{task.status}</span>{editingTask !== task.id && <button className="btn ghost sm" onClick={() => { setEditingTask(task.id); setEditDraft(task.title); }}>Edit</button>}</div>)}</div> : <EmptyState title="Nothing matches this view" detail="Clear your search or select another status." />}
      </SpotlightCard>
      <SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">QUICK ADD</div><h2 className="panel-title">Create a task</h2><form className="ops-form" onSubmit={addTask}><label>Task name<input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Prepare weekly update" /></label><label>Due date<Dropdown items={['Today', 'Tomorrow', '20 Oct', 'Next week']} value={due} onChange={setDue} aria-label="Due date" size="sm" /></label><button className="btn pri" type="submit"><Icon name="plus" />Add task</button></form><p className="workspace-disclaimer"><Icon name="info" />Tasks are saved in local browser storage for this demo.</p></SpotlightCard>
    </div>
  </div>;
}

function ProfilePage({ profile, onToast }) {
  const initial = { name: profile === 'admin' ? 'Rhea Menon' : profile === 'hr' ? 'Maya Chen' : profile === 'bda' ? 'Rahul Varma' : profile === 'electrical' ? 'Suresh Pillai' : profile === 'marketing' ? 'Neha Kapoor' : 'Ananya Das', email: profile === 'admin' ? 'rhea.menon@hvvertex.in' : profile === 'hr' ? 'maya.chen@hvvertex.in' : profile === 'bda' ? 'rahul.varma@hvvertex.in' : profile === 'electrical' ? 'suresh.pillai@hvvertex.in' : profile === 'marketing' ? 'neha.kapoor@hvvertex.in' : 'ananya.das@hvvertex.in', department: profile === 'admin' ? 'Administration' : profile === 'hr' ? 'People Operations' : profile === 'bda' ? 'BDA' : profile === 'electrical' ? 'Electrical' : profile === 'marketing' ? 'Digital Marketing' : 'Developers', title: profile === 'admin' ? 'Workspace administrator' : 'Team member' };
  const [value, setValue] = useDemoState(`profile-${profile}`, initial);
  const [draft, setDraft] = useState(value);
  const save = (event) => { event.preventDefault(); if (draft.name.trim().length < 2 || !draft.email.includes('@')) return onToast('Enter a valid name and email address.', 'bad'); setValue(draft); saveDemo(`profile-${profile}`, draft); onToast('Profile updated in this browser demo.'); };
  return <div className="workspace-page"><PageHeading eyebrow="ACCOUNT" title="My Profile" subtitle="Review your workspace identity and update the editable demo fields." />
    <SpotlightCard className="overview-panel workspace-profile-card"><div className="workspace-profile-banner"><div className="workspace-profile-avatar">{value.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><div className="panel-kicker">{profile === 'admin' ? 'ADMIN DEMO PROFILE' : `${value.department.toUpperCase()} WORKSPACE`}</div><h2>{value.name}</h2><p>{value.title}</p></div></div><form className="ops-form workspace-profile-form" onSubmit={save}><div className="form-row"><label>Display name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label><label>Email address<input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label></div><div className="form-row"><label>Department<input value={draft.department} readOnly /></label><label>Workspace role<input value={PROFILE_LABELS[profile] || 'Employee'} readOnly /></label></div><button className="btn pri" type="submit"><Icon name="check" />Save profile</button></form><p className="workspace-disclaimer"><Icon name="info" />This is a frontend demo profile. Changes remain in this browser only.</p></SpotlightCard>
  </div>;
}
const PROFILE_LABELS = { bda: 'BDA', electrical: 'Electrical', developers: 'Developers', marketing: 'Digital Marketing', admin: 'Admin' };

function PeoplePage({ onToast }) {
  const [people, setPeople] = useDemoState('people', ROSTER);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState({ name: '', email: '', role: 'BDA' });
  const visible = people.filter((person) => `${person.name} ${person.email} ${person.role}`.toLowerCase().includes(search.toLowerCase()));
  const updateRole = (person, role) => { const next = people.map((item) => item.email === person.email ? { ...item, role, department: role === 'BDA' ? 'BDA' : role === 'Electrical' ? 'Electrical' : role === 'Developers' ? 'Developers' : 'Digital Marketing' } : item); setPeople(next); saveDemo('people', next); onToast(`${person.name} assigned to ${role} in demo data.`); };
  const editProfile = (person) => { const name = window.prompt('Edit employee name', person.name); if (name === null) return; const email = window.prompt('Edit employee email', person.email); if (email === null) return; if (name.trim().length < 2 || !email.includes('@')) return onToast('A valid name and email are required.', 'bad'); const next = people.map((item) => item.email === person.email ? { ...item, name: name.trim(), email: email.trim() } : item); setPeople(next); saveDemo('people', next); onToast('Demo employee profile updated.'); };
  const toggleStatus = (person) => { const next = people.map((item) => item.email === person.email ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item); setPeople(next); saveDemo('people', next); onToast(`${person.name} is now ${person.status === 'Active' ? 'inactive' : 'active'} in the demo.`); };
  const add = (event) => { event.preventDefault(); if (draft.name.trim().length < 2 || !draft.email.includes('@')) return onToast('Add a name and valid email to create a demo employee.', 'bad'); const department = draft.role === 'BDA' ? 'BDA' : draft.role === 'Electrical' ? 'Electrical' : draft.role === 'Developers' ? 'Developers' : 'Digital Marketing'; const next = [{ ...draft, name: draft.name.trim(), email: draft.email.trim(), department, status: 'Active' }, ...people]; setPeople(next); saveDemo('people', next); setDraft({ name: '', email: '', role: 'BDA' }); onToast('Demo employee added.'); };
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · PEOPLE" title="People & Roles" subtitle="Review sample employee records and demonstrate department assignment. Role changes are local demo state." actions={<span className="pill info">{people.length} people</span>} />
    <SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">DIRECTORY</div><h2 className="panel-title">Employees</h2></div><span className="pill mute">ADMIN DEMO</span></div><div className="workspace-toolbar"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people…" aria-label="Search people" /></div><div className="ops-table workspace-table people-table"><div className="ops-table-head"><span>Employee</span><span>Department</span><span>Workspace role</span><span>Status</span></div>{visible.map((person) => <div className="ops-table-row" key={person.email}><span className="people-name-cell"><b>{person.name}</b><small>{person.email}</small><button className="btn ghost sm" onClick={() => editProfile(person)}>Edit profile</button></span><span>{person.department}</span><span><Dropdown items={EMPLOYEE_ROLES} value={person.role} onChange={(val) => updateRole(person, val)} aria-label={`Assign role for ${person.name}`} size="sm" /></span><span><button className={`pill ${person.status === 'Active' ? 'good' : 'mute'}`} onClick={() => toggleStatus(person)}>{person.status}</button></span></div>)}</div><form className="workspace-inline-form" onSubmit={add}><label>Add demo employee</label><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Full name" /><input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email address" /><Dropdown items={EMPLOYEE_ROLES} value={draft.role} onChange={(val) => setDraft({ ...draft, role: val })} aria-label="Role" size="sm" /><button className="btn pri sm" type="submit"><Icon name="plus" />Add person</button></form><p className="workspace-disclaimer"><Icon name="info" />Frontend-only role simulation. It is not authentication or production access control.</p></SpotlightCard>
  </div>;
}

function AnnouncementsPage({ onToast }) {
  const [items, setItems] = useDemoState('announcements', INITIAL_ANNOUNCEMENTS);
  const [draft, setDraft] = useState({ title: '', body: '', audience: 'Everyone' });
  const [preview, setPreview] = useState(null);
  const publish = (event) => { event.preventDefault(); if (draft.title.trim().length < 4 || draft.body.trim().length < 10) return onToast('Add a clear title and a message of at least 10 characters.', 'bad'); const next = [{ ...draft, id: Date.now(), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }, ...items]; setItems(next); saveDemo('announcements', next); setDraft({ title: '', body: '', audience: 'Everyone' }); onToast('Announcement published in this browser demo.'); };
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · COMMUNICATIONS" title="Announcements" subtitle="Draft, preview, and publish company notices in the demo workspace." />
    <div className="overview-main-columns workspace-columns"><SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">COMPOSE</div><h2 className="panel-title">New announcement</h2><form className="ops-form" onSubmit={publish}><label>Headline<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Announcement title" /></label><label>Audience<Dropdown items={['Everyone', ...EMPLOYEE_ROLES]} value={draft.audience} onChange={(val) => setDraft({ ...draft, audience: val })} aria-label="Audience" size="sm" /></label><label>Message<textarea rows="5" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Write a concise update…" /></label><div className="acts"><button className="btn out" type="button" onClick={() => setPreview(draft.title.trim() ? draft : null)}>Preview</button><button className="btn pri" type="submit"><Icon name="send" />Publish demo notice</button></div></form></SpotlightCard><div className="overview-right-column">{preview && <SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">PREVIEW · {preview.audience}</div><h2 className="panel-title">{preview.title}</h2><p className="workspace-preview-text">{preview.body || 'Your message preview will appear here.'}</p></SpotlightCard>}<SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">RECENT POSTS</div><h2 className="panel-title">Published announcements</h2>{items.map((item) => <div className="ops-list-row" key={item.id}><div><b>{item.title}</b><small>{item.audience} · {item.date}</small></div><button className="btn ghost sm" onClick={() => { setItems(items.filter((row) => row.id !== item.id)); saveDemo('announcements', items.filter((row) => row.id !== item.id)); onToast('Demo announcement removed.'); }} aria-label={`Remove ${item.title}`}><Icon name="trash" /></button></div>)}</SpotlightCard></div></div>
  </div>;
}

function ApprovalsPage({ onToast }) {
  const [items, setItems] = useDemoState('approvals', INITIAL_APPROVALS);
  const [filter, setFilter] = useState('All');
  const visible = items.filter((item) => filter === 'All' || item.status === filter);
  const update = (item, status) => { const next = items.map((row) => row.id === item.id ? { ...row, status } : row); setItems(next); saveDemo('approvals', next); onToast(`${item.title}: ${status.toLowerCase()} in demo state.`); };
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · REVIEW QUEUE" title="Approvals & Requests" subtitle="Review sample requests and record a simulated approval decision." actions={<span className="pill warn">{items.filter((item) => item.status === 'Pending').length} pending</span>} />
    <SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">CROSS-DEPARTMENT QUEUE</div><h2 className="panel-title">Requests</h2></div><div className="seg workspace-filter">{['All', 'Pending', 'In review', 'Approved', 'Rejected'].map((status) => <button key={status} className={filter === status ? 'on' : ''} onClick={() => setFilter(status)}>{status}</button>)}</div></div>{visible.length ? <div className="workspace-approval-list">{visible.map((item) => <div className="workspace-approval-row" key={item.id}><div className="workspace-approval-icon"><Icon name="file" /></div><div className="workspace-file-meta"><b>{item.title}</b><small>{item.department} · {item.detail}</small></div><span className={`pill ${item.status === 'Approved' ? 'good' : item.status === 'Rejected' ? 'bad' : 'warn'}`}>{item.status}</span>{['Pending', 'In review'].includes(item.status) ? <div className="acts"><button className="btn pri sm" onClick={() => update(item, 'Approved')}>Approve</button><button className="btn out sm" onClick={() => update(item, 'Rejected')}>Reject</button></div> : <button className="btn out sm" onClick={() => update(item, 'Pending')}>Reopen</button>}</div>)}</div> : <EmptyState title="No requests in this filter" detail="Choose another status to review the sample queue." />}<p className="workspace-disclaimer"><Icon name="info" />Decisions update sample data in this browser only.</p></SpotlightCard>
  </div>;
}

function ReportsPage({ onToast }) {
  const rows = [['BDA', '18 closed deals', '60%', '07', '18.6%'], ['Developers', '78%', '94%', '14', '87%'], ['Electrical', '24 assets', '98.6%', '03', '94%'], ['Digital Marketing', '08 campaigns', '84.2K reach', '03', '3.4% CTR']];
  const exportCsv = () => { const csv = [['Department', 'Primary metric', 'Performance', 'Open items', 'Quality'], ...rows].map((line) => line.map((item) => `"${item}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'hv-vertex-demo-report.csv'; link.click(); URL.revokeObjectURL(link.href); onToast('Demo report exported as CSV.'); };
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · ORGANIZATION INSIGHTS" title="Reports & Analytics" subtitle="Compare concise department snapshots and export a sample report." actions={<button className="btn out" onClick={exportCsv}><Icon name="download" />Export CSV</button>} />
    <div className="stats-quad-grid workspace-report-stats">{[['DEPARTMENTS', '04', 'BDA, Developers, Electrical, Digital Marketing'], ['EMPLOYEES', '128', 'Sample directory count'], ['OPEN REQUESTS', '25', 'Across role modules']].map(([label, value, note]) => <SpotlightCard className="stat-v2" key={label}><div className="stat-v2-body"><span className="stat-v2-label">{label}</span><strong className="stat-v2-val">{value}</strong><span className="stat-v2-note">{note}</span></div></SpotlightCard>)}</div>
    <SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">DEPARTMENT SUMMARY</div><h2 className="panel-title">Operational snapshot</h2></div><span className="pill info">SAMPLE DATA</span></div><div className="ops-table workspace-table report-table"><div className="ops-table-head"><span>Department</span><span>Primary metric</span><span>Performance</span><span>Open items</span><span>Quality / result</span></div>{rows.map((row) => <div className="ops-table-row" key={row[0]}>{row.map((cell, index) => <span key={`${row[0]}-${index}`}>{index === 0 ? <b>{cell}</b> : cell}</span>)}</div>)}</div><p className="workspace-disclaimer"><Icon name="info" />Illustrative department metrics for the frontend preview; no live data source is connected.</p></SpotlightCard>
  </div>;
}

function SettingsPage({ theme, onThemeChange, accent, onAccentChange, onToast }) {
  const [options, setOptions] = useDemoState('settings', { reducedMotion: false, compactTables: false, notifications: true });
  React.useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(options.reducedMotion);
    document.documentElement.dataset.compactTables = String(options.compactTables);
    document.documentElement.dataset.notifications = String(options.notifications);
  }, [options]);
  const toggle = (key) => { const next = { ...options, [key]: !options[key] }; setOptions(next); saveDemo('settings', next); onToast('Demo preference updated.'); };
  const setTheme = (value) => { onThemeChange?.(value); onToast(`Theme changed to ${value}.`); };
  const setAccent = (value) => { onAccentChange?.(value); onToast(`Accent changed to ${value}.`); };
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · PREFERENCES" title="Website Settings" subtitle="Adjust the dashboard appearance and demo preferences." />
    <div className="overview-main-columns workspace-columns"><SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">APPEARANCE</div><h2 className="panel-title">Workspace display</h2><div className="workspace-setting-row"><div><b>Theme</b><small>Choose how the workspace appears.</small></div><Dropdown items={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} value={theme} onChange={setTheme} aria-label="Theme" size="sm" /></div><div className="workspace-setting-row"><div><b>Brand accent</b><small>Apply an accent across dashboard highlights.</small></div><Dropdown items={[{ value: 'forest', label: 'Forest' }, { value: 'emerald', label: 'Emerald' }, { value: 'blue', label: 'Blue' }, { value: 'violet', label: 'Violet' }, { value: 'amber', label: 'Amber' }]} value={accent} onChange={setAccent} aria-label="Brand accent" size="sm" /></div><div className="workspace-setting-row"><div><b>Reduced motion</b><small>Store this local demo preference.</small></div><button className={`toggle-switch ${options.reducedMotion ? 'on' : ''}`} onClick={() => toggle('reducedMotion')} aria-pressed={options.reducedMotion}><span /></button></div><div className="workspace-setting-row"><div><b>Compact tables</b><small>Preference preview for dense data views.</small></div><button className={`toggle-switch ${options.compactTables ? 'on' : ''}`} onClick={() => toggle('compactTables')} aria-pressed={options.compactTables}><span /></button></div><div className="workspace-setting-row"><div><b>Notifications</b><small>Show in-app notification indicators.</small></div><button className={`toggle-switch ${options.notifications ? 'on' : ''}`} onClick={() => toggle('notifications')} aria-pressed={options.notifications}><span /></button></div></SpotlightCard><SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">DEMO LIMITATION</div><h2 className="panel-title">Settings apply in this browser</h2><p className="workspace-preview-text">These controls update the active frontend theme and save lightweight preferences locally. They do not change organization-wide settings or server configuration.</p><button className="btn out" onClick={() => { const defaults = { reducedMotion: false, compactTables: false, notifications: true }; localStorage.removeItem('hv-demo-settings'); setOptions(defaults); onToast('Local demo preferences reset.'); }}><Icon name="refresh" />Reset demo preferences</button></SpotlightCard></div>
  </div>;
}

function DepartmentsPage({ onNavigate }) {
  const [department, setDepartment] = useState('BDA');
  const links = DEPARTMENT_LINKS[department] || DEPARTMENT_LINKS.BDA;
  return <div className="workspace-page"><PageHeading eyebrow="ADMIN · DEPARTMENT ACCESS" title="Department Modules" subtitle="Select a department to access its existing focused workspace modules." actions={<span className="pill info">4 departments</span>} />
    <SpotlightCard className="overview-panel workspace-panel"><div className="panel-kicker">DEPARTMENT SWITCHER</div><h2 className="panel-title">Choose a team</h2><div className="workspace-department-switcher">{Object.keys(DEPARTMENT_LINKS).map((name) => <button key={name} className={department === name ? 'active' : ''} onClick={() => setDepartment(name)}>{name}</button>)}</div><div className="workspace-department-links">{links.map(([label, page]) => <button className="role-dashboard-link" key={page} onClick={() => onNavigate(page)}><span><b>{label}</b><small>Open {department} workspace</small></span><Icon name="chevron-right" /></button>)}</div><p className="workspace-disclaimer"><Icon name="info" />Admin portal demo: department access is simulated in frontend state.</p></SpotlightCard>
  </div>;
}
