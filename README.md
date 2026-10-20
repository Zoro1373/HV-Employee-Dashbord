# HV Vertex Employee Workspace

A responsive React workspace for HV Vertex Electronics, built on the existing dashboard design and navigation. It provides five employee-role views and a separate Admin demo portal, with interactive sample workflows across desktop, tablet, and mobile layouts.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup. To create and preview a production build:

```bash
npm run build
npm run preview
```

Run the project's Oxlint check with:

```bash
npm run lint
```

## Demo profiles and navigation

Use the employee profile selector in the top bar to switch among **HR**, **BDA**, **Electrical**, **Developers**, and **Digital Marketing**. Each employee view shares Dashboard, Messages & Groups, Shared Files, Calendar & Tasks, Notifications, and My Profile, followed by exactly three sections for that department.

The separate **Admin demo** button opens an organization portal with an organization dashboard, people and role controls, conversations, files, tasks, notifications, announcements, approvals, reports, settings, profile, and a department-module switcher. Use the department switcher to open the existing role-specific pages for any of the four departments.

## Interactive demo data

The frontend includes sample records and local interactions for messages and group creation, file selection and preview, task creation/editing/status changes, notification states, profile editing, employee role assignment, announcements, approval decisions, report CSV export, and display preferences. Some changes are kept in this browser's local storage to make the demo easier to explore. Uploaded file content is not sent to a service or shared with other users.

## Frontend-only scope and limitations

This project intentionally contains **no backend, database, API, server-side authentication, or server-side authorization**. The Admin portal and employee role switching are client-side demo controls only; they are not production security. Sample information is not live company data and local changes are not shared across users or devices. Do not use this demo to store confidential employee, customer, or business information.

## Production build

`npm run build` writes static production files to `dist/`. Deploy that directory to a static hosting provider configured to serve `index.html` for application routes. The Vite development server is for local development and previewing, not production hosting.

## Project structure

```text
public/                 Static icons and favicon
src/components/         Shared interface components
src/pages/              Dashboards and workspace pages
src/data/               Sample workspace data
src/utils/              Shared utilities
src/App.jsx              Existing app shell and navigation state
src/profileConfig.js     Employee and Admin demo navigation
src/index.css            Theme tokens, components, and responsive styles
index.html               Browser entry point and page metadata
```
