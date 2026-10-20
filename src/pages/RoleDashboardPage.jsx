import React from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';

const TODAY_LABEL = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();

const DASHBOARDS = {
  hr: {
    name: 'Maya', title: 'People operations at a glance', subtitle: 'Employee movement, attendance and requests that need attention.',
    stats: [['TEAM MEMBERS', '128', 'Across 4 departments', 'users'], ['PRESENT TODAY', '94%', '4 check-ins to review', 'clock'], ['OPEN REQUESTS', '08', '3 need a decision', 'file']],
    kicker: 'PEOPLE PRIORITIES', panel: 'HR work queue',
    rows: [['Leave requests awaiting review', '3 requests · oldest received 09:42', 'Pending', 'hr'], ['New joiner setup · HV-1512', 'Equipment and access checklist', 'In progress', 'hr-reports'], ['Attendance exceptions', '4 records need confirmation', 'Review', 'hr']],
    links: [['Employee directory', 'Browse people and departments', 'org'], ['Attendance & leave', 'Review today’s attendance and requests', 'hr'], ['HR requests & reports', 'Open HR actions and reporting', 'hr-reports']],
  },
  bda: {
    name: 'Rahul', title: 'Your growth pipeline', subtitle: 'Prioritize follow-ups and keep opportunities moving toward close.',
    stats: [['ACTIVE LEADS', '42', '9 added this week', 'users'], ['PIPELINE VALUE', '₹8.4L', '6 proposals in progress', 'sparkles'], ['TARGET PROGRESS', '60%', '18 of 30 conversions', 'check']],
    kicker: 'TODAY’S PRIORITIES', panel: 'Sales follow-ups',
    rows: [['Call Northstar procurement', 'Northstar Systems · next step due today', 'Due today', 'bda-leads'], ['Send Apex case study', 'Apex Automation · qualified lead', 'In progress', 'bda-pipeline'], ['Review monthly conversion target', '18 closed deals · 12 remaining', 'On track', 'bda-targets']],
    links: [['Lead management', 'Review prospects and next steps', 'bda-leads'], ['Sales pipeline', 'Track opportunities and close stages', 'bda-pipeline'], ['Targets & performance', 'Check goal progress and activity', 'bda-targets']],
  },
  electrical: {
    name: 'Suresh', title: 'Electrical operations overview', subtitle: 'Equipment health, work orders and safety actions for your shift.',
    stats: [['EQUIPMENT HEALTH', '98.6%', '24 assets monitored', 'lightning'], ['OPEN WORK ORDERS', '03', '2 due today', 'check'], ['INSPECTIONS DUE', '06', '1 safety review overdue', 'shield']],
    kicker: 'SHIFT PRIORITIES', panel: 'Operations queue',
    rows: [['UPS Bank · Lab 3', 'Preventive service · due 16:00', 'Due today', 'elec-workorders'], ['Panel A thermal check', 'Main distribution · capture inspection', 'Pending', 'elec-assets'], ['Lockout/tagout review', 'Evidence required before sign-off', 'Review', 'elec-safety']],
    links: [['Equipment & maintenance', 'Review assets and service history', 'elec-assets'], ['Work orders & inspections', 'Assign and record maintenance work', 'elec-workorders'], ['Safety & technical reports', 'Resolve safety actions and view reports', 'elec-safety']],
  },
  developers: {
    name: 'Ananya', title: 'Engineering delivery', subtitle: 'Keep sprint work moving and surface build or review risks early.',
    stats: [['SPRINT COMPLETION', '78%', '4 days remain', 'grid'], ['OPEN ISSUES', '14', '3 high severity', 'bell'], ['BUILD HEALTH', '94%', '1 recent failure', 'check']],
    kicker: 'SPRINT PRIORITIES', panel: 'Engineering queue',
    rows: [['Motor startup race', 'Critical · Firmware · owner Maya Chen', 'Blocked', 'dev-issues'], ['UART driver refactor', 'PR #184 · reviewer needed', 'In review', 'dev-issues'], ['Firmware 4.10.2', 'Release candidate · verify gates', 'Ready', 'dev-releases']],
    links: [['Projects & tasks', 'Review sprint milestones and assignments', 'dev-projects-tasks'], ['Bugs & code reviews', 'Triage defects and pending reviews', 'dev-issues'], ['Builds & releases', 'Check build health and release gates', 'dev-releases']],
  },
  marketing: {
    name: 'Neha', title: 'Campaign workbench', subtitle: 'Coordinate campaign timing, approvals and performance in one view.',
    stats: [['ACTIVE CAMPAIGNS', '08', '3 channels in market', 'sparkles'], ['PENDING APPROVALS', '03', 'Oldest waiting 1 day', 'check'], ['CAMPAIGN REACH', '84.2K', 'CTR 3.4% this month', 'users']],
    kicker: 'CAMPAIGN PRIORITIES', panel: 'Content & approvals',
    rows: [['Product launch · LinkedIn', 'Social post · scheduled 17 Oct', 'Scheduled', 'mkt-calendar'], ['Partner webinar banner', 'Creative asset · brand review', 'In review', 'mkt-assets'], ['October channel performance', 'Reach, CTR and attributed leads', 'Updated', 'mkt-analytics']],
    links: [['Campaigns & content', 'Manage publishing dates and drafts', 'mkt-calendar'], ['Creative files & approvals', 'Review assets and approvals', 'mkt-assets'], ['Marketing analytics', 'Compare campaign results', 'mkt-analytics']],
  },
};

export default function RoleDashboardPage({ profile, onNavigate }) {
  const data = DASHBOARDS[profile] || DASHBOARDS.bda;
  return (
    <div className="role-dashboard-page">
      <div className="head rise">
        <div>
          <div className="panel-kicker">MY WORKSPACE · {TODAY_LABEL}</div>
          <h1>Good morning, {data.name}.</h1>
          <p className="sub">{data.subtitle}</p>
        </div>
        <div className="acts">
          <button className="btn out" onClick={() => onNavigate('chat')}><Icon name="chat" />Messages</button>
          <button className="btn pri" onClick={() => onNavigate('calendar')}><Icon name="clock" />My tasks</button>
        </div>
      </div>
      <div className="stats-quad-grid role-dashboard-stats">
        {data.stats.map(([label, value, note, icon], index) => (
          <SpotlightCard className="stat-v2" key={label}>
            <div className="stat-v2-top"><div className={`stat-icon-box ${['green', 'blue', 'amber'][index]}`}><Icon name={icon} /></div></div>
            <div className="stat-v2-body"><span className="stat-v2-label">{label}</span><strong className="stat-v2-val">{value}</strong><span className="stat-v2-note">{note}</span></div>
          </SpotlightCard>
        ))}
      </div>
      <div className="overview-main-columns role-dashboard-columns">
        <SpotlightCard className="overview-panel">
          <div className="panel-header"><div><div className="panel-kicker">{data.kicker}</div><h2 className="panel-title">{data.panel}</h2></div><button className="panel-link-action" onClick={() => onNavigate('calendar')}>View tasks <Icon name="chevron-right" /></button></div>
          {data.rows.map(([title, detail, status, page]) => <div className="ops-list-row" key={title}><div><b>{title}</b><small>{detail}</small></div><button className={`pill ${status === 'Blocked' ? 'bad' : status === 'Due today' || status === 'Pending' || status === 'Review' || status === 'In review' ? 'warn' : 'good'}`} onClick={() => onNavigate(page)}>{status}</button></div>)}
        </SpotlightCard>
        <SpotlightCard className="overview-panel">
          <div className="panel-kicker">QUICK ACCESS</div><h2 className="panel-title">Your department</h2>
          <div className="role-dashboard-links">{data.links.map(([title, detail, page]) => <button className="role-dashboard-link" key={page} onClick={() => onNavigate(page)}><span><b>{title}</b><small>{detail}</small></span><Icon name="chevron-right" /></button>)}</div>
          <div className="role-demo-note"><Icon name="info" />Dashboard activity uses sample data for this frontend demo.</div>
        </SpotlightCard>
      </div>
    </div>
  );
}
