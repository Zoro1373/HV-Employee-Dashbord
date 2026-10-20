import React, { useState, useEffect } from 'react';
import SignInCard from '../components/ui/SignInCard';
import Icon from '../components/Icon';
import LoginAnimatedBackground from '../components/login/LoginAnimatedBackground';
import './LoginPage.css';

/**
 * Enterprise Protocol Modal for Forgot Password & Account Access
 */
function SecurityModal({ isOpen, onClose, title, icon = 'shield', children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="hv-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hv-modal-dialog-title"
    >
      <div className="hv-modal-box">
        <div className="hv-modal-header">
          <div className="hv-modal-title-row">
            <div className="hv-modal-icon-badge" aria-hidden="true">
              <Icon name={icon} />
            </div>
            <h2 id="hv-modal-dialog-title" className="hv-modal-title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="hv-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="hv-modal-body">{children}</div>

        <div className="hv-modal-footer">
          <button
            type="button"
            className="hv-modal-btn primary"
            onClick={onClose}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Official HV VERTEX ELECTRONICS Login Page
 */
export default function LoginPage({ onLoginSuccess }) {
  const [modalType, setModalType] = useState(null); // 'forgot' | 'access' | null

  return (
    <main className="hv-login-page">
      {/* Cinematic Multi-Layered Animated Background (Layers A-E) */}
      <LoginAnimatedBackground />

      {/* Main Authentication Card */}
      <SignInCard
        onLoginSuccess={onLoginSuccess}
        onForgotPassword={() => setModalType('forgot')}
        onNeedAccess={() => setModalType('access')}
      />

      {/* Subtle Aerospace Footer */}
      <footer className="hv-login-page-footer">
        <div>© HV VERTEX ELECTRONICS · Secure Employee Workspace</div>
        <div className="hv-footer-security">
          <span className="hv-security-dot" aria-hidden="true" />
          <span>Protected access for authorized personnel.</span>
        </div>
      </footer>

      {/* Forgot Password Security Notice Modal */}
      <SecurityModal
        isOpen={modalType === 'forgot'}
        onClose={() => setModalType(null)}
        title="Credential Recovery Policy"
        icon="lock"
      >
        <p>
          Self-service password recovery is disabled under HV Vertex Electronics
          enterprise security protocols.
        </p>
        <p>To request a credential rotation or emergency reset:</p>
        <ul className="hv-modal-list">
          <li>Contact your department manager or IT Operations Desk.</li>
          <li>Submit a ticket from your verified corporate channel.</li>
          <li>Have your Employee Identification Number (e.g. HV-1042) ready.</li>
        </ul>
        <p>
          Support email: <b>itsupport@hvvertex.in</b>
        </p>
      </SecurityModal>

      {/* Need Access Security Notice Modal */}
      <SecurityModal
        isOpen={modalType === 'access'}
        onClose={() => setModalType(null)}
        title="Workspace Provisioning"
        icon="users"
      >
        <p>
          Access to the HV Vertex Employee Workspace and Admin Control Portal is
          restricted to authorized engineering, operations, and administrative staff.
        </p>
        <p>To request an account provisioning:</p>
        <ul className="hv-modal-list">
          <li>Reach out to HR People Operations (hr@hvvertex.in).</li>
          <li>Consult your project lead for role-based system assignment.</li>
        </ul>
      </SecurityModal>
    </main>
  );
}
