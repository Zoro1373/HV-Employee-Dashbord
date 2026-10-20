# HV Vertex Workspace Update

## Role-specific workspaces added

Expanded the existing profile configuration while preserving the five employee profiles and separate Admin profile:

- **HR:** dashboard, People Hub, employee directory, attendance, leave approvals, recruitment/onboarding, documents/policies, HR reports.
- **BDA:** dashboard, BDA console, leads, pipeline, follow-ups, meetings/tasks, targets, incentives, daily reports, sales analytics.
- **Electrical:** dashboard, control room, work orders, asset register, inspections, safety/compliance, incidents, maintenance schedule, technical documents, operations reports.
- **Developers:** dashboard, delivery board, code reviews, repositories/builds, issue tracker, deadlines/calendar, build submissions, testing/quality, releases, technical docs, engineering reports.
- **Digital Marketing:** dashboard, campaign studio, content calendar, creative assets, approvals, audience/leads, campaign analytics, budget/spend, SEO/website performance, reports/exports.
- **Admin:** existing separate Admin Control Portal retained.

## Functional role modules

- Added `src/pages/RoleModulePage.jsx` as a reusable, role-specific work area for modules that did not have a dedicated page.
- New module pages include KPI cards, searchable records, status filters, status updates, add-record forms, CSV export, empty states and responsive layouts.
- Demo records persist in browser local storage and are explicitly labeled as local demo data.
- Existing specialized pages and workflows (such as HR People Hub, BDA console, Electrical Control Room, Developer Delivery Board and Campaign Studio) remain in place.

## OpenUI

Added `OPENUI_AGENT_SETUP.md` with the official OpenUI CLI workflow and first-message test. OpenUI's CLI could not be downloaded in the execution environment because the `npx` command timed out, so this ZIP does not falsely claim that a model-backed agent was installed or that a server response was tested. The guide explains how to scaffold the agent locally and configure the required server-side API key without replacing the existing Vite dashboard.

## Data and security note

This remains a frontend demo. Role-specific module records use local browser storage, not a shared database. Real multi-user persistence, backend authorization and live integrations require a backend and provider credentials.
