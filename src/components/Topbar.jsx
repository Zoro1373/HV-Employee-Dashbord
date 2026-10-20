import React, { useState } from 'react';
import Icon from './Icon';
import Dropdown from './ui/dropdown';
import { fmtT } from '../utils/time';
import { EMPLOYEE_PROFILES, PROFILE_LIST } from '../profileConfig';

export default function Topbar({
  profile = 'hr',
  onProfileChange,
  onEnterAdmin,
  onExitAdmin,
  role,
  onRoleChange,
  serverTime,
  unreadCount,
  onNavigate,
  onToggleAppearance,
  onToast,
  currentUser,
  onSignOut,
}) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const v = query.trim().toLowerCase();
    const map = {
      upload: 'uploads',
      vault: 'vault',
      download: 'vault',
      chat: 'chat',
      alert: 'alerts',
      submission: 'subs',
      security: 'sec',
      file: 'files',
      calendar: 'calendar',
      task: 'calendar',
      profile: 'profile',
    };

    const matchedKey = Object.keys(map).find((x) => v.includes(x));
    if (matchedKey) {
      const targetPage = map[matchedKey];
      const isAdminPage = ['subs', 'sec', 'people-admin', 'announcements', 'files-admin', 'approvals', 'reports-admin', 'settings', 'admin-departments'].includes(targetPage);

      if (role === 'adm' || !isAdminPage) {
        onNavigate(targetPage);
        setQuery('');
      } else {
        onToast('That page belongs to the other view');
      }
    } else {
      onToast('No match. Try dashboard, messages, files, tasks, or notifications.');
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  return (
    <header className="top">
      <label className="search">
        <Icon name="search" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search uploads, vault, chat"
          autoComplete="off"
          aria-label="Search"
        />
        <kbd>Enter</kbd>
      </label>

      {profile === 'admin' ? (
        <button className="profile-switcher profile-admin-return" onClick={onExitAdmin} title="Exit Admin demo portal">
          <Icon name="shield" />
          <span>Admin Portal</span>
          <b>Exit</b>
        </button>
      ) : (
        <div className="profile-switcher-wrap" title="Switch employee demo profile">
          <Dropdown
            items={EMPLOYEE_PROFILES.map((item) => ({
              value: item.key,
              label: item.label,
              icon: item.icon,
            }))}
            value={profile}
            onChange={(val) => onProfileChange ? onProfileChange(val) : onRoleChange(val === 'admin' ? 'hr' : val)}
            aria-label="Active employee profile"
            size="sm"
            className="topbar-profile-dropdown"
          />
        </div>
      )}

      {profile !== 'admin' && (
        <button className="top-admin-entry" onClick={onEnterAdmin} title="Open the separate Admin demo portal">
          <Icon name="shield" />
          <span>Admin demo</span>
        </button>
      )}

      <div className="topbar-right-controls">
        <span
          className="chip"
          title="Every deadline check uses server time. Your device clock is ignored."
        >
          <Icon name="clock" />
          <span>
            Server <b className="mono">{fmtT(serverTime)}</b> IST
          </span>
        </span>

        <button
          className="ibtn"
          onClick={() => onNavigate('alerts')}
          aria-label="Alerts"
        >
          <Icon name="bell" />
          {role === 'emp' && unreadCount > 0 && <i className="dot" />}
        </button>

        <button
          className="ibtn"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <Icon name={isFullscreen ? 'minimize' : 'maximize'} />
        </button>

        <button
          className="ibtn"
          onClick={onToggleAppearance}
          aria-label="Appearance"
        >
          <Icon name="palette" />
        </button>

        <button
          className="me topbar-profile-button"
          type="button"
          onClick={() => onNavigate('profile')}
          title={currentUser?.email ? `${currentUser.name || 'User'} (${currentUser.email})` : 'Open My Profile'}
          aria-label="Open My Profile"
        >
          <div className="ava">
            {currentUser?.name
              ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : profile === 'admin'
              ? 'AD'
              : profile.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <b>
              {currentUser?.name || PROFILE_LIST.find((item) => item.key === profile)?.name || 'Profile Workspace'}
              {currentUser?.isDevBypass && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: '9px',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                  title="Running in local development preview mode"
                >
                  DEV
                </span>
              )}
            </b>
            <span>
              {currentUser?.title || PROFILE_LIST.find((item) => item.key === profile)?.subtitle || 'Department workspace'}
            </span>
          </div>
        </button>

        {onSignOut && (
          <button
            className="ibtn topbar-signout-btn"
            onClick={onSignOut}
            aria-label="Sign out of workspace"
            title="Sign out of HV Vertex Workspace"
          >
            <Icon name="log-out" />
          </button>
        )}
      </div>
    </header>
  );
}
