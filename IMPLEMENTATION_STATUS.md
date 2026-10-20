# HV Vertex role-based migration status

## Implemented in the current project

The project is a Vite/React frontend and does not contain a server, database, authentication provider, API client, or route backend. The following functionality is implemented in the existing HV Vertex UI and local React state:

- Profile-specific navigation for HR, BDA, Electrical, Developers, Digital Marketing and Admin.
- Shared employee features in every department profile: overview dashboard, deadline-controlled uploads, restricted download vault, team chat, Vertex AI assistant entry point, notifications and preferences.
- HR: people hub, attendance monitor, leave approval workflow, employee directory, recruitment pipeline, onboarding tracker and performance review workspace.
- BDA: performance metrics, lead/deal pipeline, client/account portfolio, activity/follow-up tracker, meeting calendar and reporting workspace.
- Electrical: control room, maintenance queue, safety/compliance checks, equipment catalogue, incident log and inspection schedule.
- Developers: delivery board, code reviews, CI/CD/build pipeline, sprint planning, release manager and firmware/technical document activity workspace.
- Digital Marketing: campaign studio, content calendar, channel analytics, attributed leads, social planner and brand/disclosure asset review workspace.
- Admin: existing overview, sessions/security/submissions/defaulters, deadline controls, upload/download controls, organization pages and access to all role modules.
- Interactive frontend behavior: search, status filters, create-item forms, approve/schedule actions, activity tabs, document attachment state and toast feedback.
- Client-side route guard: non-admin profiles cannot navigate to another department's configured module through the app navigation. Admin can access all configured modules.
- Existing theme, spacing, layout, upload, vault, chat and assistant UI preserved.

## Requires backend/API support before production use

These areas cannot be made truly server-backed from this source tree because no backend or API integration is present:

- Persistent employee records, candidates, accounts, deals, tasks, assets, proposals, releases, campaigns and activity logs.
- Real authentication/session identity and server-side authorization middleware.
- Server-side enforcement for direct URLs/API calls. The current guard is client-side only and must be duplicated in backend middleware/RBAC.
- Real database reads/writes, audit trails, approvals, notifications and synchronization.
- Real file storage, virus scanning, file metadata, Gerber/firmware/document processing and Download Vault deployment.
- Real CI/CD status, test suite inspection, release approvals and deployment to the vault.
- Real calendar integration, email/social publishing, CRM integration, HR/payroll/attendance systems and analytics attribution.
- CSV export and server-generated reports if those are expected to include authoritative production data.

## Recommended backend contract

Add an authenticated API layer with role claims such as `hr`, `bda`, `electrical`, `developers`, `marketing` and `admin`. Enforce authorization on every module endpoint, not only in the React navigation. Suggested resources include `/employees`, `/attendance`, `/leave-requests`, `/candidates`, `/deals`, `/activities`, `/proposals`, `/electrical-assets`, `/tests`, `/incidents`, `/tasks`, `/pipelines`, `/pull-requests`, `/releases`, `/documents`, `/campaigns`, `/analytics`, `/submissions`, `/security-incidents` and `/role-modules`.
