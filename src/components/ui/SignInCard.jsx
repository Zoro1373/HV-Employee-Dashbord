import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Icon from '../Icon';
import authService from '../../services/authService';

/**
 * HV Monogram Vector Mark
 * Clean, geometric aerospace/hardware identity mark for HV Vertex
 */
export function HvBrandMark({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`hv-brand-mark ${className}`}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#041b12" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" stroke="rgba(16, 185, 129, 0.35)" />
      {/* Precision Geometric H and V Interlock */}
      <path
        d="M10 11V29M10 20H18M18 11V29"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 11L27 25L32 11"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="27.5" r="1.5" fill="#10b981" />
    </svg>
  );
}

/**
 * SignInCard Component
 * Official production-grade login card for HV VERTEX ELECTRONICS
 * Enhanced with Framer Motion animations:
 * - 3D Interactive Card Tilt on Mouse Move (with perspective)
 * - Perimeter Traveling Light Beams (Top, Right, Bottom, Left with delay)
 * - Corner Pulsing Glow Dots
 * - Ambient Card Box-Shadow Breathing Pulse
 * - Input Micro-Scaling on Focus & Hover
 * - Sign In Button Light Shimmer Beam Sweep
 * - Spring Logo Entrance
 */
export default function SignInCard({
  onLoginSuccess,
  onForgotPassword,
  onNeedAccess,
  defaultEmail = '',
}) {
  const [email, setEmail] = useState(() => defaultEmail || authService.getRememberedEmail() || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(authService.getRememberedEmail()));
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation and server error states
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // 1. Interactive 3D Card Tilt Motion Values (from sign-in-card-2)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [7, -7]);
  const rotateY = useTransform(mouseX, [-300, 300], [-7, 7]);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Reset previous errors
    setEmailError(null);
    setPasswordError(null);
    setApiError(null);

    // Client-side validation
    const emailErr = authService.validateEmail(email);
    const passErr = authService.validatePassword(password);

    if (emailErr || passErr) {
      setEmailError(emailErr);
      setPasswordError(passErr);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(email, password, rememberMe);

      if (result.success && result.user) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user, result.token);
        }
      } else if (result.validationErrors) {
        setEmailError(result.validationErrors.email || null);
        setPasswordError(result.validationErrors.password || null);
      } else {
        setApiError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setApiError('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hv-login-card-container" style={{ perspective: 1500 }}>
      {/* 3D Tilt Wrapper with Card Hover & Scale */}
      <motion.div
        className="hv-login-card-tilt-wrapper"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hv-card-tilt-inner relative group">
          {/* Card Ambient Glow Pulse Effect (from sign-in-card-2) */}
          <motion.div
            className="hv-card-glow-pulse"
            animate={{
              boxShadow: [
                "0 0 12px 2px rgba(16, 185, 129, 0.06)",
                "0 0 24px 6px rgba(16, 185, 129, 0.18)",
                "0 0 12px 2px rgba(16, 185, 129, 0.06)"
              ],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
            aria-hidden="true"
          />

          {/* Traveling Light Beam Circuit Perimeter Trace (from sign-in-card-2) */}
          <div className="hv-perimeter-beams-container" aria-hidden="true">
            {/* Top Beam */}
            <motion.div
              className="hv-beam-top"
              initial={{ filter: "blur(1.5px)" }}
              animate={{
                left: ["-50%", "100%"],
                opacity: [0.3, 0.9, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" }
              }}
            />

            {/* Right Beam */}
            <motion.div
              className="hv-beam-right"
              initial={{ filter: "blur(1.5px)" }}
              animate={{
                top: ["-50%", "100%"],
                opacity: [0.3, 0.9, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 }
              }}
            />

            {/* Bottom Beam */}
            <motion.div
              className="hv-beam-bottom"
              initial={{ filter: "blur(1.5px)" }}
              animate={{
                right: ["-50%", "100%"],
                opacity: [0.3, 0.9, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 }
              }}
            />

            {/* Left Beam */}
            <motion.div
              className="hv-beam-left"
              initial={{ filter: "blur(1.5px)" }}
              animate={{
                bottom: ["-50%", "100%"],
                opacity: [0.3, 0.9, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 }
              }}
            />

            {/* 4 Corner Pulsing Glow Dots */}
            <motion.div
              className="hv-corner-glow top-left"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
              className="hv-corner-glow top-right"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            />
            <motion.div
              className="hv-corner-glow bottom-right"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1.0 }}
            />
            <motion.div
              className="hv-corner-glow bottom-left"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
            />
          </div>

          {/* Main Card Surface */}
          <div className="hv-login-card">
            {/* Brand Header */}
            <div className="hv-login-header">
              <div className="hv-login-brand-row">
                <div className="hv-brand-left">
                  {/* Spring Logo Entrance Animation (from sign-in-card-2) */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <HvBrandMark size={38} />
                  </motion.div>
                  <div className="hv-brand-title-wrap">
                    <div className="hv-brand-name">HV VERTEX</div>
                    <div className="hv-brand-sub">ELECTRONICS</div>
                  </div>
                </div>
                <div className="hv-security-badge" title="Access is encrypted and monitored">
                  <span className="hv-pulse-dot" aria-hidden="true" />
                  <span>SECURE WORKSPACE</span>
                </div>
              </div>

              <div className="hv-login-welcome">
                <div className="hv-eyebrow">EMPLOYEE ACCESS PORTAL</div>
                <h1 className="hv-welcome-title">Welcome back.</h1>
                <p className="hv-welcome-desc">
                  Sign in to access your engineering workspace.
                </p>
              </div>
            </div>

            {/* Global API / Network Error Alert */}
            {apiError && (
              <motion.div
                className="hv-login-alert-banner"
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Icon name="alert" className="hv-login-alert-icon" />
                <div className="hv-login-alert-content">
                  <strong className="hv-login-alert-title">Authentication Notice</strong>
                  <p className="hv-login-alert-text">{apiError}</p>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="hv-login-form" noValidate>
              {/* Work Email Field */}
              <div className="hv-form-group">
                <label htmlFor="hv-work-email" className="hv-form-label">
                  Work email
                </label>
                {/* Micro-scale interaction on focus & hover (from sign-in-card-2) */}
                <motion.div
                  className={`hv-input-wrapper ${emailError ? 'has-error' : ''}`}
                  whileHover={{ scale: 1.008 }}
                  whileFocus={{ scale: 1.012 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="hv-input-icon" aria-hidden="true">
                    <Icon name="mail" />
                  </span>
                  <input
                    id="hv-work-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                      if (apiError) setApiError(null);
                    }}
                    placeholder="name@hvvertex.com"
                    autoComplete="email"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'hv-email-error' : undefined}
                    className="hv-form-input"
                  />
                </motion.div>
                {emailError && (
                  <p id="hv-email-error" className="hv-field-error" role="alert">
                    <Icon name="alert" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="hv-form-group">
                <label htmlFor="hv-password" className="hv-form-label">
                  Password
                </label>
                {/* Micro-scale interaction on focus & hover (from sign-in-card-2) */}
                <motion.div
                  className={`hv-input-wrapper ${passwordError ? 'has-error' : ''}`}
                  whileHover={{ scale: 1.008 }}
                  whileFocus={{ scale: 1.012 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="hv-input-icon" aria-hidden="true">
                    <Icon name="lock" />
                  </span>
                  <input
                    id="hv-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                      if (apiError) setApiError(null);
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'hv-password-error' : undefined}
                    className="hv-form-input"
                  />
                  <button
                    type="button"
                    className="hv-password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} />
                  </button>
                </motion.div>
                {passwordError && (
                  <p id="hv-password-error" className="hv-field-error" role="alert">
                    <Icon name="alert" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="hv-form-options">
                <label className="hv-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="hv-checkbox"
                  />
                  <span className="hv-checkbox-custom" aria-hidden="true" />
                  <span className="hv-checkbox-text">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="hv-forgot-btn"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Submit Button with Traveling Shimmer Beam (from sign-in-card-2) */}
              <motion.button
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={isLoading}
                className={`hv-submit-btn ${isLoading ? 'is-loading' : ''}`}
                aria-busy={isLoading}
              >
                {/* Shimmer Light Beam sweep effect */}
                <motion.div
                  className="hv-btn-shimmer-sweep"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.8
                  }}
                  aria-hidden="true"
                />

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hv-btn-content"
                    >
                      <span className="hv-btn-spinner" aria-hidden="true" />
                      <span>Signing in...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hv-btn-content"
                    >
                      <span>Sign in</span>
                      <Icon name="arrow-right" className="hv-btn-arrow" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            {/* Card Footer: Need Access */}
            <div className="hv-login-card-footer">
              <span>Need access? </span>
              <button
                type="button"
                onClick={onNeedAccess}
                className="hv-footer-action-btn"
              >
                Contact your administrator
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
