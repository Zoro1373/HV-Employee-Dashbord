import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';
import Dropdown from '../components/ui/dropdown';

const MODULES = {
  'hr-recruitment': ['Recruitment Pipeline', 'Manage candidates, interview stages and hiring milestones.', 'users', 'HR'],
  'hr-onboarding': ['Onboarding Tracker', 'Track new-hire tasks, compliance milestones and ownership.', 'check', 'HR'],
  'hr-performance': ['Performance Reviews', 'Coordinate review cycles, feedback and completion status.', 'table', 'HR'],
  'bda-leads': ['Lead Pipeline', 'Qualify, assign and move corporate opportunities through the funnel.', 'users', 'BDA'],
  'bda-reports': ['Performance Reports', 'Review activity, targets, deals and conversion performance.', 'table', 'BDA'],
  'bda-activities': ['Activity Tracker', 'Schedule follow-ups and surface urgent or overdue activities.', 'clock', 'BDA'],
  'bda-accounts': ['Account Portfolio', 'Manage corporate clients, deal details and commercial activity.', 'folder', 'BDA'],
  'bda-calendar': ['Meeting Calendar', 'Plan client meetings, follow-ups and proposal checkpoints.', 'clock', 'BDA'],
  'electrical-maint': ['Maintenance Queue', 'Track electrical equipment work orders and ownership.', 'file', 'Electrical'],
  'electrical-safety': ['Compliance Checklists', 'Review failed tests, investigations and safety approvals.', 'shield', 'Electrical'],
  'electrical-assets': ['Equipment Catalogue', 'Reserve instruments and manage the electrical equipment register.', 'folder', 'Electrical'],
  'electrical-incidents': ['Incident Log', 'Record failed-test investigations and corrective actions.', 'bell', 'Electrical'],
  'electrical-schedule': ['Inspection Schedule', 'Plan circuit inspections, hardware tests and compliance milestones.', 'clock', 'Electrical'],
  'dev-reviews': ['Pull Requests & Code Reviews', 'Review changes, approvals and engineering quality gates.', 'users', 'Developers'],
  'dev-pipeline': ['CI/CD Pipelines', 'Inspect build status, test suites and deployment checks.', 'lightning', 'Developers'],
  'dev-sprints': ['Development Tasks & Sprints', 'Search, filter and prioritize development work.', 'clock', 'Developers'],
  'dev-releases': ['Release Manager', 'Manage release approvals and deployment to the Download Vault.', 'send', 'Developers'],
  'dev-docs': ['Firmware & Technical Documents', 'Track firmware uploads, Gerber files and engineering activity logs.', 'folder', 'Developers'],
  'marketing-content': ['Content Calendar', 'Plan, schedule and publish marketing content.', 'file', 'Digital Marketing'],
  'marketing-analytics': ['Channel Analytics', 'Compare channel performance and lead attribution.', 'table', 'Digital Marketing'],
  'marketing-leads': ['Marketing Leads', 'Track attributed leads and campaign conversion activity.', 'users', 'Digital Marketing'],
  'marketing-social': ['Social Media Planner', 'Prepare, review and schedule social posts.', 'send', 'Digital Marketing'],
  'marketing-brand': ['Brand & Disclosure Records', 'Review assets, hardware disclosures and activity history.', 'folder', 'Digital Marketing'],
  'hr-directory': ['Employee Directory', 'Search, filter and maintain employee records within your authorized HR scope.', 'users', 'HR'],
  'hr-attendance': ['Attendance Management', 'Review attendance, absences, late arrivals and working-hour summaries.', 'clock', 'HR'],
  'hr-documents': ['Documents & Policies', 'Organize employee documents and organizational policy records.', 'folder', 'HR'],
  'hr-reports': ['HR Reports', 'Generate headcount, attendance, leave and department summaries.', 'table', 'HR'],
  'bda-pipeline': ['Sales Pipeline', 'Move opportunities through New, Contacted, Qualified, Proposal, Won and Lost stages.', 'table', 'BDA'],
  'bda-followups': ['Calls & Follow-ups', 'Record calls, meeting outcomes, reminders and overdue follow-up activity.', 'clock', 'BDA'],
  'bda-meetings': ['Meetings & Tasks', 'Schedule meetings, assign tasks and track next actions.', 'clock', 'BDA'],
  'bda-performance': ['Targets & Performance', 'Track targets, activity completion, conversion rates and verified outcomes.', 'table', 'BDA'],
  'bda-earnings': ['Incentives & Earnings', 'Review pending and approved incentives based on verified sales outcomes.', 'lightning', 'BDA'],
  'bda-daily-reports': ['Daily Activity Reports', 'Submit daily activity reports for manager review and approval.', 'file', 'BDA'],
  'bda-analytics': ['Sales Analytics', 'Review authorized sales metrics, conversion trends and exportable reports.', 'table', 'BDA'],
  'electrical-workorders': ['Maintenance & Work Orders', 'Create and manage asset work orders, priorities, technicians and resolutions.', 'file', 'Electrical'],
  'electrical-inspections': ['Inspection Checklists', 'Record inspection evidence and flag incomplete or overdue checks.', 'check', 'Electrical'],
  'electrical-faults': ['Faults & Incident Reports', 'Record electrical faults, safety incidents and corrective actions.', 'bell', 'Electrical'],
  'electrical-documents': ['Technical Documents', 'Maintain manuals, measurement logs and equipment-related documents.', 'folder', 'Electrical'],
  'electrical-reports': ['Operations Reports', 'Review maintenance history, work-order completion and equipment downtime.', 'table', 'Electrical'],
  'dev-builds': ['Repositories & Builds', 'Review repository and CI/CD records when integrations are available.', 'lightning', 'Developers'],
  'dev-issues': ['Bug & Issue Tracker', 'Track severity, reproduction steps, ownership, comments and resolution status.', 'bell', 'Developers'],
  'dev-calendar': ['Deadlines & Calendar', 'Coordinate engineering deadlines, sprint milestones and release windows.', 'clock', 'Developers'],
  'dev-submissions': ['Builds & File Submissions', 'Upload versioned build artifacts with metadata and submission receipts.', 'upload', 'Developers'],
  'dev-testing': ['Testing & Quality', 'Record test results, defects, quality checks and release readiness.', 'check', 'Developers'],
  'dev-documents': ['Technical Documentation', 'Manage engineering documentation and implementation references.', 'folder', 'Developers'],
  'dev-reports': ['Engineering Reports', 'Prepare engineering performance and delivery reports.', 'table', 'Developers'],
  'marketing-campaigns': ['Campaign Studio', 'Create campaigns with objectives, audiences, channels, budgets and dates.', 'sparkles', 'Digital Marketing'],
  'marketing-calendar': ['Content Calendar', 'Plan content through draft, review, approved, scheduled and published states.', 'clock', 'Digital Marketing'],
  'marketing-assets': ['Creative & Asset Library', 'Manage creative assets, versions and campaign associations.', 'folder', 'Digital Marketing'],
  'marketing-approvals': ['Marketing Tasks & Approvals', 'Assign marketing tasks and manage approval workflows.', 'check', 'Digital Marketing'],
  'marketing-audience': ['Audience & Leads', 'Track marketing leads and connect them to campaigns where authorized.', 'users', 'Digital Marketing'],
  'marketing-budget': ['Budget & Spend Tracking', 'Compare planned budgets, actual spend and budget variance.', 'table', 'Digital Marketing'],
  'marketing-seo': ['SEO & Website Performance', 'Review manual or connected website, keyword and landing-page metrics.', 'table', 'Digital Marketing'],
  'marketing-reports': ['Reports & Exports', 'Generate authorized marketing reports and CSV exports.', 'file', 'Digital Marketing'],
  'admin-users': ['User & Profile Management', 'Create, edit, activate and deactivate authorized user profiles.', 'users', 'Admin'],
  'admin-permissions': ['Roles & Permissions', 'Review module authorization and access rules without exposing credentials.', 'shield', 'Admin'],
  'admin-departments': ['Departments & Organisation', 'Maintain departments, reporting structure and organization settings.', 'table', 'Admin'],
  'admin-attendance': ['Attendance & Leave Administration', 'Review organization-wide attendance and leave information within scope.', 'clock', 'Admin'],
  'admin-reports': ['Organisation Reports', 'Generate organization-wide operational summaries and exports.', 'table', 'Admin'],
  'admin-settings': ['System Settings', 'Manage safe application configuration and integration settings.', 'sliders', 'Admin'],
};

const SEED = {
  'hr-recruitment': [['Aarav Mehta', 'Interview', 'Engineering'], ['Nisha Verma', 'Screening', 'BDA'], ['Omar Haq', 'Offer review', 'Electrical']],
  'hr-onboarding': [['Maya Chen', 'Compliance pending', '6 / 8 milestones'], ['Priya Nair', 'Complete', '8 / 8 milestones'], ['Daniel Okafor', 'In progress', '4 / 8 milestones']],
  'hr-performance': [['Q3 Engineering cycle', '12 / 18 complete', 'Due 24 Oct'], ['BDA quarterly reviews', '8 / 11 complete', 'Due 28 Oct'], ['Electrical safety reviews', '5 / 6 complete', 'Due 30 Oct']],
  'bda-leads': [['Atlas Manufacturing', 'Qualified', 'Rahul Varma'], ['Nova Systems', 'Needs follow-up', 'Priya Nair'], ['Vertex Mobility', 'Proposal sent', 'Rahul Varma']],
  'bda-reports': [['Lead generation', '128 completed', 'On target'], ['Discovery calls', '214 completed', 'Above target'], ['Qualified meetings', '38 booked', 'On target']],
  'bda-activities': [['Nova Systems follow-up', 'Overdue', 'Today · 10:00'], ['Atlas proposal review', 'Urgent', 'Today · 15:30'], ['Vertex Mobility demo', 'Scheduled', 'Tomorrow · 11:00']],
  'bda-accounts': [['Atlas Manufacturing', 'Active deal', '₹8.4L · Proposal'], ['Nova Systems', 'Negotiation', '₹4.2L · Follow-up'], ['Vertex Mobility', 'Discovery', '₹2.1L · Meeting']],
  'bda-calendar': [['Atlas Manufacturing', 'Proposal checkpoint', '18 Oct · 15:30'], ['Nova Systems', 'Commercial review', '19 Oct · 11:00'], ['Vertex Mobility', 'Discovery call', '20 Oct · 14:00']],
  'electrical-maint': [['UPS Bank · Lab 3', 'Inspection due', 'Suresh Pillai'], ['Motor controller · Line 2', 'Parts requested', 'Electrical team'], ['Panel A · Main distribution', 'Scheduled', 'Electrical team']],
  'electrical-safety': [['Earthing inspection', 'Awaiting approval', 'Failed test investigation'], ['Breaker test', 'Scheduled', 'Tomorrow · 10:00'], ['Lockout review', 'Approved', 'Verified 09 Oct']],
  'electrical-assets': [['Oscilloscope · Tektronix', 'Available', 'Reserve instrument'], ['Power analyser · Fluke', 'Reserved', 'Ravi Kumar · 16 Oct'], ['Thermal camera', 'Calibration due', 'Electrical team']],
  'electrical-incidents': [['INC-204 · Breaker trip', 'Open', 'Investigation assigned'], ['INC-203 · Failed test', 'Action pending', 'Upload measurement log'], ['INC-201 · Overheat alert', 'Closed', 'Corrective action verified']],
  'electrical-schedule': [['Panel A inspection', 'Due today', 'Circuit design review'], ['Hardware test queue', 'In progress', '3 devices waiting'], ['Compliance audit', 'Scheduled', '24 Oct · 09:00']],
  'dev-reviews': [['motor-ctrl · UART refactor', '2 approvals', 'Ravi Kumar'], ['telemetry-api · v2 contract', '1 approval', 'Meera Shah'], ['firmware · release notes', 'Changes requested', 'Dev Thomas']],
  'dev-pipeline': [['motor-ctrl / main', 'Passing', 'Release candidate'], ['telemetry-api / develop', 'Passing', 'Staging'], ['bench-tools / feature', 'Failed', 'Needs attention']],
  'dev-sprints': [['UART driver refactor', 'In progress', 'Priority: High'], ['Telemetry API contract', 'Ready', 'Priority: Medium'], ['Bench test runner', 'Blocked', 'Priority: High']],
  'dev-releases': [['Firmware 4.10.2', 'Approval pending', 'Deploy to vault'], ['Motor controller 2.4', 'Approved', 'Scheduled 20 Oct'], ['Telemetry API v2', 'In validation', 'Test suite running']],
  'dev-docs': [['firmware-4.10.2.bin', 'Uploaded', 'Activity log available'], ['motor-control-gerbers.zip', 'Uploaded', 'Technical document'], ['bench-measurements.csv', 'Needs review', 'Measurement log']],
  'marketing-content': [['Product launch · LinkedIn', 'Scheduled', '18 Oct · 10:00'], ['Firmware story · Blog', 'Draft', 'Needs approval'], ['Partner webinar · Email', 'In review', '20 Oct · 09:00']],
  'marketing-analytics': [['Organic search', '42% of traffic', 'Growing'], ['LinkedIn', '31% of traffic', 'Strong'], ['Email', '18% of traffic', 'Stable']],
  'marketing-leads': [['Enterprise launch campaign', '126 attributed', '18 qualified'], ['Firmware story', '84 attributed', '11 qualified'], ['Partner webinar', '52 attributed', '7 qualified']],
  'marketing-social': [['Product launch teaser', 'Approval pending', 'LinkedIn · 18 Oct'], ['Engineering story', 'Draft', 'X · 19 Oct'], ['Partner webinar reminder', 'Scheduled', 'Email · 20 Oct']],
  'marketing-brand': [['Product launch kit', 'Approved', 'Brand assets'], ['Hardware disclosure · Board A', 'Needs review', 'Compliance record'], ['Engineering photography', 'Approved', 'Asset library']],
};

const statusTone = (value) => {
  const text = value.toLowerCase();
  if (text.includes('complete') || text.includes('approved') || text.includes('passing') || text.includes('available') || text.includes('scheduled') || text.includes('active') || text.includes('strong') || text.includes('growing') || text.includes('uploaded')) return 'good';
  if (text.includes('overdue') || text.includes('urgent') || text.includes('failed') || text.includes('pending') || text.includes('blocked') || text.includes('due') || text.includes('review') || text.includes('draft') || text.includes('needs')) return 'warn';
  return 'info';
};

export default function DepartmentOptionsPage({ section, onToast }) {
  const module = MODULES[section] || [section, 'Role workspace controls and activity tracking.', 'folder', 'Workspace'];
  const seedRows = SEED[section] || [['Priority work item', 'In progress', 'Assigned to you'], ['Team follow-up', 'Due today', 'Role workspace'], ['Review queue', 'Ready', 'Department team']];
  const storageKey = `hv-module-${section}`;
  const [rows, setRows] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || seedRows; } catch { return seedRows; }
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', status: 'New', detail: '' });
  const [uploaded, setUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('workspace');
  const [approved, setApproved] = useState(new Set());
  const [scheduled, setScheduled] = useState(new Set());

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(rows)); } catch { /* local demo persistence is optional */ }
  }, [rows, storageKey]);

  const filtered = useMemo(() => rows.filter(([name, status, detail]) => {
    const matchesQuery = `${name} ${status} ${detail}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || status.toLowerCase().includes(filter.toLowerCase());
    return matchesQuery && matchesFilter;
  }), [rows, query, filter]);

  const notify = (message) => onToast && onToast(message);
  const addItem = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) return notify('Add a name or work item before saving.');
    setRows((current) => [[draft.name.trim(), draft.status, draft.detail || 'New role item'], ...current]);
    setDraft({ name: '', status: 'New', detail: '' });
    setFormOpen(false);
    notify(`${module[0]} item saved.`);
  };
  const updateRow = (row, action) => {
    const key = row[0];
    if (action === 'approve') setApproved((current) => new Set([...current, key]));
    if (action === 'schedule') setScheduled((current) => new Set([...current, key]));
    notify(`${action === 'approve' ? 'Approved' : action === 'schedule' ? 'Scheduled' : 'Updated'}: ${key}`);
  };
  const editRow = (row) => {
    const nextName = window.prompt('Update record name', row[0]);
    if (!nextName?.trim()) return;
    setRows((current) => current.map((item) => item[0] === row[0] ? [nextName.trim(), item[1], item[2]] : item));
    notify(`Updated: ${nextName.trim()}`);
  };
  const deleteRow = (row) => {
    if (!window.confirm(`Delete ${row[0]} from this local workspace?`)) return;
    setRows((current) => current.filter((item) => item[0] !== row[0]));
    notify(`Deleted: ${row[0]}`);
  };
  const exportCsv = () => {
    const csv = [['Record', 'Status', 'Details'], ...rows].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${section}-records.csv`; anchor.click(); URL.revokeObjectURL(url);
    notify('CSV export prepared from the authorized local workspace records.');
  };

  return <div className="operations-page">
    <div className="head rise"><div><h1>{module[0]}</h1><p className="sub">{module[1]}</p></div><div className="acts"><span className="pill info">{module[3]} MODULE</span><span className="pill mute">MANUAL WORKFLOW</span><button className="btn pri sm" onClick={() => setFormOpen((value) => !value)}><Icon name="file" />Create</button></div></div>
    <div className="stats-quad-grid">{[['OPEN ITEMS', String(rows.length), 'green'], ['IN PROGRESS', String(Math.max(1, rows.filter((row) => statusTone(row[1]) === 'info').length)), 'blue'], ['NEEDS ACTION', String(rows.filter((row) => statusTone(row[1]) === 'warn').length), 'amber'], ['COMPLETED', String(rows.filter((row) => statusTone(row[1]) === 'good').length), 'slate']].map(([label, value, tone]) => <SpotlightCard className="stat-v2" key={label}><div className="stat-v2-top"><div className={`stat-icon-box ${tone}`}><Icon name={module[2]} /></div></div><div className="stat-v2-body"><span className="stat-v2-label">{label}</span><strong className="stat-v2-val">{value}</strong><span className="stat-v2-note">Live role workspace view</span></div></SpotlightCard>)}</div>
    <div className="seg ops-seg module-tabs"><button className={activeTab === 'workspace' ? 'on' : ''} onClick={() => setActiveTab('workspace')}>Workspace</button><button className={activeTab === 'activity' ? 'on' : ''} onClick={() => setActiveTab('activity')}>Activity log</button><button className={activeTab === 'documents' ? 'on' : ''} onClick={() => setActiveTab('documents')}>Documents</button></div>
    {formOpen && <SpotlightCard className="overview-panel role-form-panel"><div className="panel-kicker">NEW ROLE ITEM</div><h2 className="panel-title">Create in {module[0]}</h2><form className="ops-form" onSubmit={addItem}><div className="form-row"><label>Name or work item<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Enter a record or task" /></label><label>Status<Dropdown items={['New', 'In progress', 'Needs review', 'Scheduled']} value={draft.status} onChange={(val) => setDraft({ ...draft, status: val })} aria-label="Status" size="sm" /></label></div><label>Details<input value={draft.detail} onChange={(event) => setDraft({ ...draft, detail: event.target.value })} placeholder="Owner, deadline or context" /></label><button className="btn pri" type="submit"><Icon name="check" />Save item</button></form></SpotlightCard>}
    {activeTab === 'documents' && <SpotlightCard className="overview-panel"><div className="panel-header"><div><div className="panel-kicker">DOCUMENTS & DELIVERABLES</div><h2 className="panel-title">Role files</h2></div><label className="btn out sm"><Icon name="upload" />{uploaded ? 'File attached' : 'Attach file'}<input type="file" hidden onChange={() => { setUploaded(true); notify('File attached to the role activity log.'); }} /></label></div><div className="ops-list-row"><div><b>{uploaded ? 'New role document' : 'No new files attached'}</b><small>Uploads are currently stored in this demo workspace.</small></div><span className="pill info">{uploaded ? 'Attached' : 'Ready'}</span></div></SpotlightCard>}
    {activeTab === 'activity' && <SpotlightCard className="overview-panel"><div className="panel-kicker">ACTIVITY LOG</div><h2 className="panel-title">Recent role activity</h2>{[['Workspace opened', 'Just now'], ['Filters updated', 'Today · 14:20'], ['Last record sync', 'Today · 13:55']].map(([event, time]) => <div className="ops-list-row" key={event}><div><b>{event}</b><small>{module[3]} · {time}</small></div><span className="pill info">Logged</span></div>)}</SpotlightCard>}
    {activeTab === 'workspace' && <SpotlightCard className="overview-panel"><div className="panel-header"><div><div className="panel-kicker">{module[3].toUpperCase()} WORK QUEUE</div><h2 className="panel-title">Search and manage records</h2></div><div className="acts"><button className="btn out sm" onClick={() => { setRows((current) => [...current]); notify('Role data refreshed.'); }}>Refresh</button><button className="btn out sm" onClick={exportCsv}>Export CSV</button></div></div><div className="table-tools"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records, owners or details…" /><Dropdown items={['All', 'New', 'In progress', 'Needs review', 'Pending', 'Scheduled', 'Approved', 'Complete']} value={filter} onChange={setFilter} aria-label="Filter records by status" size="sm" /></div>{filtered.map((row) => { const rowKey = row[0]; const isApproved = approved.has(rowKey); const isScheduled = scheduled.has(rowKey); return <div className="ops-list-row" key={rowKey}><div><b>{rowKey}</b><small>{row[2]}</small></div><div className="acts"><span className={`pill ${isApproved ? 'good' : isScheduled ? 'good' : statusTone(row[1])}`}>{isApproved ? 'Approved' : isScheduled ? 'Scheduled' : row[1]}</span><button className="btn ghost sm" onClick={() => editRow(row)}>Edit</button><button className="btn ghost sm" onClick={() => deleteRow(row)}>Delete</button><button className="btn ghost sm" onClick={() => updateRow(row, 'approve')}>Approve</button><button className="btn ghost sm" onClick={() => updateRow(row, 'schedule')}>Schedule</button></div></div>; })}{filtered.length === 0 && <div className="empty-state">No records match the current search and filter.</div>}</SpotlightCard>}
  </div>;
}
