/**
 * HV VERTEX ELECTRONICS — Authentication Service Adapter
 * 
 * Formal API Contract:
 * Endpoint: POST /api/auth/login (or VITE_AUTH_API_URL)
 * 
 * Request Headers:
 *   Content-Type: application/json
 *   Accept: application/json
 * 
 * Request Payload:
 *   {
 *     "email": "user@hvvertex.com",
 *     "password": "...",
 *     "rememberMe": boolean
 *   }
 * 
 * Expected Response on HTTP 200:
 *   {
 *     "success": true,
 *     "user": {
 *       "id": "HV-1042",
 *       "name": "Maya Chen",
 *       "email": "maya.chen@hvvertex.in",
 *       "role": "developers" | "hr" | "bda" | "electrical" | "marketing" | "admin",
 *       "department": "Engineering Delivery",
 *       "title": "Senior Systems Engineer"
 *     },
 *     "token": "..." // optional if using httpOnly session cookies
 *   }
 * 
 * Expected Error on HTTP 401 / 403:
 *   { "success": false, "error": "Invalid email or password" }
 */

const STORAGE_SESSION_KEY = 'hv_auth_session';
const STORAGE_REMEMBERED_EMAIL_KEY = 'hv_remembered_email';
const DEFAULT_AUTH_ENDPOINT = '/api/auth/login';

export const authService = {
  /**
   * Get the configured authentication API endpoint
   */
  getEndpoint() {
    return (
      (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.VITE_AUTH_API_URL) ||
      DEFAULT_AUTH_ENDPOINT
    );
  },

  /**
   * Client-side email format validation
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return 'Work email is required.';
    const trimmed = email.trim();
    if (!trimmed) return 'Work email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid work email address.';
    }
    return null;
  },

  /**
   * Client-side password validation
   */
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return 'Password is required.';
    }
    if (password.length < 1) {
      return 'Password is required.';
    }
    return null;
  },

  /**
   * Determine whether the temporary local development bypass is enabled.
   * STRICT SECURITY GUARD:
   * - Must be running in Vite local dev (import.meta.env.DEV === true && !import.meta.env.PROD)
   * - It is strictly impossible to execute in production builds, even if env flags are set.
   * - Configurable via VITE_DEV_LOGIN_BYPASS or NEXT_PUBLIC_DEV_LOGIN_BYPASS.
   */
  isDevBypassEnabled() {
    if (typeof import.meta === 'undefined' || !import.meta.env) return false;
    const isLocalDev = Boolean(
      import.meta.env.DEV &&
      !import.meta.env.PROD &&
      import.meta.env.MODE === 'development'
    );
    if (!isLocalDev) return false;

    const flag =
      import.meta.env.VITE_DEV_LOGIN_BYPASS ??
      import.meta.env.NEXT_PUBLIC_DEV_LOGIN_BYPASS;

    if (flag === 'false' || flag === false) {
      return false;
    }
    return true;
  },

  /**
   * Execute authentication against the configured backend endpoint.
   * When local development bypass is active, validates non-empty fields and grants
   * temporary employee UI preview access without fake JWTs or backend simulation.
   */
  async login(email, password, rememberMe = false) {
    // 1. Client-side input validation
    const emailError = this.validateEmail(email);
    const passwordError = this.validatePassword(password);
    if (emailError || passwordError) {
      return {
        success: false,
        validationErrors: {
          email: emailError,
          password: passwordError,
        },
      };
    }

    // 2. Temporary local development bypass
    if (this.isDevBypassEnabled()) {
      // Brief loading delay (300ms) to ensure smooth button & spinner transition
      await new Promise((resolve) => setTimeout(resolve, 300));

      const trimmedEmail = email.trim();
      const emailPrefix = trimmedEmail.split('@')[0] || 'Employee';
      const formattedName = emailPrefix
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');

      // Determine an employee department profile (strictly employee, never admin)
      let role = 'hr';
      const lower = trimmedEmail.toLowerCase();
      if (lower.includes('dev') || lower.includes('software') || lower.includes('eng')) {
        role = 'developers';
      } else if (lower.includes('bda') || lower.includes('sales')) {
        role = 'bda';
      } else if (lower.includes('elec') || lower.includes('hardware')) {
        role = 'electrical';
      } else if (lower.includes('market') || lower.includes('mkt')) {
        role = 'marketing';
      }

      // Explicit temporary development-only preview identity:
      // - Keeps entered email for UI display
      // - NEVER stores or logs the password
      // - Does NOT generate fake JWTs or pretend a real backend session exists
      // - Strictly restricted to employee workspace, NEVER grants admin privileges
      const devUser = {
        id: 'DEV-PREVIEW',
        name: formattedName || 'Employee (Dev Preview)',
        email: trimmedEmail,
        role,
        department: `${role.toUpperCase()} Workspace`,
        title: 'Development Preview',
        isDevBypass: true,
      };

      if (rememberMe) {
        this.setRememberedEmail(trimmedEmail);
      } else {
        this.clearRememberedEmail();
      }

      this.setStoredSession(devUser, false);

      return {
        success: true,
        user: devUser,
        targetRoute: 'dash', // Existing employee dashboard route
        isDevBypass: true,
      };
    }

    // 3. Real Production Authentication API Flow
    const endpoint = this.getEndpoint();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe: Boolean(rememberMe),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP error statuses
      if (!response.ok) {
        let serverMessage = '';
        try {
          const errorJson = await response.json();
          serverMessage = errorJson?.error || errorJson?.message || '';
        } catch {
          // Response was not JSON
        }

        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error:
              serverMessage ||
              'Invalid credentials. Please verify your work email and password.',
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error:
              'Too many sign-in attempts. Please wait a few minutes before retrying.',
          };
        }

        if (response.status === 404) {
          return {
            success: false,
            error: `Authentication endpoint (${endpoint}) was not found on the server. Please verify backend routing.`,
          };
        }

        return {
          success: false,
          error:
            serverMessage ||
            `Authentication service error (HTTP ${response.status}). Please contact IT Support.`,
        };
      }

      // Successful response
      const data = await response.json();
      if (!data || !data.success || !data.user) {
        return {
          success: false,
          error:
            data?.error ||
            'Authentication service returned an unexpected response format.',
        };
      }

      // Handle Remember Me for email convenience
      if (rememberMe) {
        this.setRememberedEmail(email.trim());
      } else {
        this.clearRememberedEmail();
      }

      // Persist session
      this.setStoredSession(data.user, rememberMe);

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        return {
          success: false,
          error:
            'Connection timed out while reaching the authentication service. Please check your network or server latency.',
        };
      }

      // Network error, connection refused, or no backend server running
      return {
        success: false,
        error: `Authentication service is currently unavailable. Unable to connect to ${endpoint}. Please ensure the authentication server is running.`,
      };
    }
  },

  /**
   * Session Management: Read stored session
   */
  getStoredSession() {
    try {
      const stored =
        sessionStorage.getItem(STORAGE_SESSION_KEY) ||
        localStorage.getItem(STORAGE_SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Session Management: Save session
   */
  setStoredSession(user, persist = false) {
    try {
      const payload = JSON.stringify(user);
      if (persist) {
        localStorage.setItem(STORAGE_SESSION_KEY, payload);
      } else {
        sessionStorage.setItem(STORAGE_SESSION_KEY, payload);
      }
    } catch {
      // Storage unavailable or disabled
    }
  },

  /**
   * Session Management: Clear session
   */
  clearSession() {
    try {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // Ignore
    }
  },

  /**
   * Remembered Email Helpers
   */
  getRememberedEmail() {
    try {
      return localStorage.getItem(STORAGE_REMEMBERED_EMAIL_KEY) || '';
    } catch {
      return '';
    }
  },

  setRememberedEmail(email) {
    try {
      localStorage.setItem(STORAGE_REMEMBERED_EMAIL_KEY, email);
    } catch {
      // Ignore
    }
  },

  clearRememberedEmail() {
    try {
      localStorage.removeItem(STORAGE_REMEMBERED_EMAIL_KEY);
    } catch {
      // Ignore
    }
  },
};

export default authService;
