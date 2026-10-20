# Role feature research applied to HV Vertex

## BDA reference dashboard inspected

The authenticated BDA reference dashboard exposed these concrete workflows: active leads, pending verified conversions, total earnings with per-UTR incentive context, a shareable employee client-payment link, timed attendance windows and daily logout, hot-lead status tracking, a course catalogue with demo links, daily performance reporting, and leave application. These are now represented in the HV Vertex BDA Console while preserving its existing card, panel, form and table styling.

## Other role expansions

The HR menu now includes employee documents, compliance reports and a people audit log in addition to directory, attendance, leave, recruitment, onboarding and performance reviews.

The BDA menu now includes proposal desk, commercial documents and pipeline forecast in addition to the reference-dashboard flows and existing lead, account, activity and calendar modules.

The Electrical menu now includes electrical projects, hardware test queue, instrument reservations and test results/logs in addition to maintenance, safety, incidents, assets and inspections.

The Developers menu now includes requirements traceability, defect/risk register and build artifacts in addition to delivery, code review, CI/CD, sprint, release and engineering-document modules.

The Digital Marketing menu now includes campaign manager, asset approvals and funnel attribution in addition to content, analytics, leads, social planning and brand assets.

## Research sources

- HR workflows and employee lifecycle: Microsoft Dynamics 365 Human Resources documentation and SHRM onboarding guidance.
- BDA/CRM workflows: HubSpot pipeline, sales activity, permissions and account-activity documentation.
- Electrical operations: NFPA 70B guidance, Oracle Maintenance work-order documentation and Dataverse auditing guidance.
- Software/firmware development: IBM requirements management, Atlassian approvals/audit documentation and GitLab permissions.
- Digital marketing: Adobe Workfront proofing/approvals, Google Analytics Data API, Google Ads reporting and AMA strategy guidance.

The current project remains a frontend-only Vite/React application. These role modules provide interactive UI state, search/filtering, creation, approvals, scheduling, document attachment state and audit-style activity views. Production persistence, backend authentication, server-side RBAC, real file storage, CRM/HR/CI/CD/calendar/social integrations and authoritative analytics still require backend/API integration.
