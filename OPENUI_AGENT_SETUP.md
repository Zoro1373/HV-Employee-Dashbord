# OpenUI Generative UI agent setup

The HV Vertex dashboard remains the existing React + Vite application. OpenUI's recommended CLI creates a separate Next.js agent project, so it should be scaffolded alongside this app rather than replacing the dashboard or putting Next.js files into the Vite source tree.

## 1. Requirements

- Node.js 20 or later (Node 22 is fine)
- npm
- Internet access for npm package installation
- An OpenUI/Thesys Gateway API key for model-backed generation

## 2. Scaffold the agent

Open a terminal in this project root and run:

```bash
npx @openuidev/cli@latest create hv-vertex-generative-ui --no-interactive --no-immediate
cd hv-vertex-generative-ui
npx @openuidev/cli@latest generate-api-key
```

Complete browser sign-in when the key-generation command asks for it. Keep the key in the generated server-side `.env` file. Never paste it into React code or commit it to Git.

## 3. Start and test the agent

```bash
npm run dev
```

Open the local URL printed by the terminal (the starter commonly uses `http://localhost:3000`). Send this first message:

> Build an interactive HV Vertex Electronics employee dashboard with KPI cards, a task table, a status filter, and a chart showing task completion. Use realistic sample data and make the filter interactive.

Check the terminal for the actual request/response or error logs. If the server reports a missing API key, complete step 2. If it reports an installation or network error, rerun the scaffold command after network access is available.

## 4. Run the existing HV Vertex dashboard

In a separate terminal at the project root:

```bash
npm install
npm run dev
```

The existing dashboard uses the Vite dev server (normally `http://localhost:5173`). The OpenUI agent is a separate app and may run on port 3000. Keeping them separate avoids breaking the current app's routing and styling while the integration is evaluated.

## Integration note

OpenUI is not silently represented as already connected in this ZIP. The role-specific pages in the main dashboard are implemented locally and persist demo records in the browser. The model-backed OpenUI agent requires its own scaffold, package installation, and API-key setup as described above. Once the agent is running, it can be embedded or connected through a deliberate authenticated integration; do not expose the Gateway key in browser code.
