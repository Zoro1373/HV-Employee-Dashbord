const commonEmployeeItems = [
  { key: 'dash', label: 'Dashboard', icon: 'grid' },
  { key: 'chat', label: 'Messages & Groups', icon: 'chat' },
  { key: 'files', label: 'Shared Files', icon: 'folder' },
  { key: 'calendar', label: 'Calendar & Tasks', icon: 'clock' },
  { key: 'alerts', label: 'Notifications', icon: 'bell' },
];

export const PROFILE_CONFIG = {
  hr: {
    label: 'HR', name: 'HR Workspace', subtitle: 'People operations', home: 'dash', icon: 'users',
    sections: [
      { id: 'common', title: 'Workspace', items: commonEmployeeItems },
      { id: 'department', title: 'HR', items: [
        { key: 'org', label: 'Employee Directory', icon: 'table' },
        { key: 'hr', label: 'Attendance & Leave', icon: 'clock' },
        { key: 'hr-reports', label: 'HR Requests & Reports', icon: 'file' },
      ] },
    ],
  },
  bda: {
    label: 'BDA', name: 'BDA Workspace', subtitle: 'Business development', home: 'dash', icon: 'lightning',
    sections: [
      { id: 'common', title: 'Workspace', items: commonEmployeeItems },
      { id: 'department', title: 'BDA', items: [
        { key: 'bda-leads', label: 'Lead Management', icon: 'users' },
        { key: 'bda-pipeline', label: 'Sales Pipeline', icon: 'sparkles' },
        { key: 'bda-targets', label: 'Targets & Performance', icon: 'check' },
      ] },
    ],
  },
  electrical: {
    label: 'Electrical', name: 'Electrical Workspace', subtitle: 'Electrical operations', home: 'dash', icon: 'lightning',
    sections: [
      { id: 'common', title: 'Workspace', items: commonEmployeeItems },
      { id: 'department', title: 'Electrical', items: [
        { key: 'elec-assets', label: 'Equipment & Maintenance', icon: 'lightning' },
        { key: 'elec-workorders', label: 'Work Orders & Inspections', icon: 'check' },
        { key: 'elec-safety', label: 'Safety & Technical Reports', icon: 'shield' },
      ] },
    ],
  },
  developers: {
    label: 'Developers', name: 'Developer Workspace', subtitle: 'Engineering delivery', home: 'dash', icon: 'file',
    sections: [
      { id: 'common', title: 'Workspace', items: commonEmployeeItems },
      { id: 'department', title: 'Developers', items: [
        { key: 'dev-projects-tasks', label: 'Projects & Tasks', icon: 'grid' },
        { key: 'dev-issues', label: 'Bugs & Code Reviews', icon: 'bell' },
        { key: 'dev-releases', label: 'Builds & Releases', icon: 'check' },
      ] },
    ],
  },
  marketing: {
    label: 'Digital Marketing', name: 'Marketing Workspace', subtitle: 'Campaign operations', home: 'dash', icon: 'sparkles',
    sections: [
      { id: 'common', title: 'Workspace', items: commonEmployeeItems },
      { id: 'department', title: 'Digital Marketing', items: [
        { key: 'mkt-calendar', label: 'Campaigns & Content', icon: 'clock' },
        { key: 'mkt-assets', label: 'Creative Files & Approvals', icon: 'folder' },
        { key: 'mkt-analytics', label: 'Marketing Analytics', icon: 'sparkles' },
      ] },
    ],
  },
  admin: {
    label: 'Admin', name: 'Admin Control Portal', subtitle: 'Demo administration', home: 'adash', icon: 'shield',
    sections: [
      { id: 'admin-control', title: 'Organization', items: [
        { key: 'adash', label: 'Organization Dashboard', icon: 'grid' },
        { key: 'people-admin', label: 'People & Roles', icon: 'users' },
        { key: 'chat', label: 'Messages & Groups', icon: 'chat' },
        { key: 'files-admin', label: 'Shared Files & Management', icon: 'folder' },
        { key: 'calendar', label: 'Calendar & Tasks', icon: 'clock' },
        { key: 'alerts', label: 'Notifications', icon: 'bell' },
        { key: 'announcements', label: 'Announcements', icon: 'send' },
        { key: 'approvals', label: 'Approvals & Requests', icon: 'check' },
        { key: 'reports-admin', label: 'Reports & Analytics', icon: 'sparkles' },
        { key: 'settings', label: 'Website Settings', icon: 'sliders' },
      ] },
      { id: 'admin-departments', title: 'Department access', items: [
        { key: 'admin-departments', label: 'Department modules', icon: 'table' },
      ] },
    ],
  },
};

export const PROFILE_LIST = Object.entries(PROFILE_CONFIG).map(([key, value]) => ({ key, ...value }));
export const EMPLOYEE_PROFILES = PROFILE_LIST.filter((profile) => profile.key !== 'admin');
