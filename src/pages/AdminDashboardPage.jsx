import React from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';

const departments = [
  ['BDA', '42 active leads', '60% target progress', 'bda-leads', 'blue'],
  ['Electrical', '24 registered assets', '3 open work orders', 'elec-assets', 'amber'],
  ['Developers', '78% sprint progress', '14 open issues', 'dev-issues', 'slate'],
  ['Digital Marketing', '8 active campaigns', '3 approvals waiting', 'mkt-calendar', 'green'],
];
const queue = [
  ['Leave request · Rahul Varma', 'BDA · 27–28 Oct', 'Pending'],
  ['Product launch key visual', 'Digital Marketing · v3 review', 'Pending'],
  ['UPS service parts', 'Electrical · purchase request', 'In review'],
];

export default function AdminDashboardPage({ onNavigate }) {
  return <div className="workspace-page admin-dashboard-page">
    <div className="head rise workspace-heading"><div><div className="panel-kicker">ADMIN CONTROL PORTAL · DEMO MODE</div><h1>Organization Dashboard</h1><p className="sub">A focused overview of departments, requests, and recent company updates.</p></div><div className="acts"><button className="btn out" onClick={() => onNavigate('admin-departments')}><Icon name="table" />Departments</button><button className="btn pri" onClick={() => onNavigate('people-admin')}><Icon name="users" />Manage people</button></div></div>
    <div className="stats-quad-grid workspace-report-stats">
      {[["EMPLOYEE PROFILES", '128', 'Across four departments', 'users'], ['PENDING REVIEWS', '08', 'Requests and approvals', 'check'], ['ACTIVE WORKSPACES', '04', 'All departments represented', 'grid']].map(([label, value, note, icon], index) => <SpotlightCard className="stat-v2" key={label}><div className="stat-v2-top"><div className={`stat-icon-box ${['green', 'amber', 'blue'][index]}`}><Icon name={icon} /></div></div><div className="stat-v2-body"><span className="stat-v2-label">{label}</span><strong className="stat-v2-val">{value}</strong><span className="stat-v2-note">{note}</span></div></SpotlightCard>)}
    </div>
    <div className="overview-main-columns workspace-columns admin-dashboard-columns">
      <SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">CROSS-DEPARTMENT VIEW</div><h2 className="panel-title">Department summaries</h2></div><button className="panel-link-action" onClick={() => onNavigate('reports-admin')}>View reports <Icon name="chevron-right" /></button></div><div className="admin-department-list">{departments.map(([name, metric, signal, page, tone]) => <button className="admin-department-row" key={name} onClick={() => onNavigate(page)}><span className={`admin-department-mark ${tone}`}><Icon name="grid" /></span><span className="admin-department-copy"><b>{name}</b><small>{metric} · {signal}</small></span><Icon name="chevron-right" /></button>)}</div></SpotlightCard>
      <div className="overview-right-column"><SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">ACTION REQUIRED</div><h2 className="panel-title">Pending approvals</h2></div><span className="pill warn">08 open</span></div>{queue.map(([title, detail, status]) => <div className="ops-list-row" key={title}><div><b>{title}</b><small>{detail}</small></div><span className={`pill ${status === 'Pending' ? 'warn' : 'info'}`}>{status}</span></div>)}<button className="btn out sm" onClick={() => onNavigate('approvals')}>Review requests <Icon name="chevron-right" /></button></SpotlightCard><SpotlightCard className="overview-panel workspace-panel"><div className="panel-header"><div><div className="panel-kicker">COMPANY UPDATE</div><h2 className="panel-title">Latest announcement</h2></div><button className="panel-link-action" onClick={() => onNavigate('announcements')}>Manage <Icon name="chevron-right" /></button></div><b>Quarterly all-hands meeting</b><p className="workspace-preview-text">Join us Friday at 11:00 for a company update and team questions.</p><span className="pill good">Published · Everyone</span></SpotlightCard></div>
    </div>
    <p className="workspace-disclaimer"><Icon name="info" />Admin controls are frontend simulations. This demo does not enforce authentication or change server data.</p>
  </div>;
}
