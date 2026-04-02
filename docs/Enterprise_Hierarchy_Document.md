\# Enterprise Page-by-Page Hierarchy Breakdown

This document extends the architecture audit by exhaustively mapping all 20 pages in the application stack based strictly on verifiable source code imports, layout hooks, and observed native styling structures.

\---

\## PAGE → FULL HIERARCHY BREAKDOWN

\### 1. LandingPage

\*\*Route:\*\* `/`

\*\*Purpose:\*\* High-conversion public entry point showcasing features and driving users to auth flows via interactive 3D elements.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Public Canvas (Unwrapped from AppShell)

\- \*\*Structure:\*\*

`  `- Header (Fixed Navbar handled natively via Absolute/Relative positioning)

`  `- Main Container (Full `100vh` Hero bounding box, overflow restricted)

`  `- Footer

\#### Sections:

\*\*Hero 3D Section:\*\*

\- \*\*Description:\*\* Immersive interactive header with animated elements.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `GLSLHills`

`  `- \*\*Type:\*\* Presentational

`  `- \*\*Responsibility:\*\* Canvas-based animated gradient hills background.

\- \*\*Component Name:\*\* `FloatingTags`

`  `- \*\*Type:\*\* Presentational

`  `- \*\*Responsibility:\*\* Parallax floating skill tags using `framer-motion`.

\- \*\*Component Name:\*\* `InteractiveRobotSpline`

`  `- \*\*Type:\*\* Presentational

`  `- \*\*Responsibility:\*\* Spline runtime execution for 3D element rendering.

\*\*Value Proposition Sections:\*\*

\- \*\*Description:\*\* Trust building matrices and routing points.

\- \*\*Component Name:\*\* `PathToHired`, `StatsSection`, `BenefitsSection`, `FeaturedJobs`, `CategoriesSection`.

`  `- \*\*Type:\*\* Containers / Presentational

`  `- \*\*Responsibility:\*\* Structural grids mapping to application domains visually.

\*\*UI Primitives Used:\*\*

\- Animated CTA Buttons (`.animated-button` custom CSS)

\- Ghost Buttons

\- Typography (`text-6xl`, `font-display`, `tracking-tighter`)

\- Icons (Lucide)

\---

\### 2. LoginPage

\*\*Route:\*\* `/login`

\*\*Purpose:\*\* Authentication gateway resolving User Context schemas.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Public Canvas (Unwrapped)

\- \*\*Structure:\*\* Full-screen centered Flex/Grid container bounding Auth forms.

\#### Sections:

\*\*Auth Portal:\*\*

\- \*\*Description:\*\* Email/Password input block with OAuth options.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `LoginForm` (Inline State)

`  `- \*\*Type:\*\* Stateful Container

`  `- \*\*Responsibility:\*\* Handshakes `supabase.auth.signInWithPassword`, triggers `AuthContext` hydration.

`  `- \*\*Sub-components:\*\*

`    `- `EmailInput`, `PasswordInput` (Inline): Controlled input triggers.

\*\*UI Primitives Used:\*\*

\- Icons (`Briefcase`, `Eye`, `EyeOff` for password toggles)

\- Form `inputs` (`border-2 border-black focus:ring-4`)

\- Button Primitive (Primary loading state)

\---

\### 3. RegisterPage

\*\*Route:\*\* `/register`

\*\*Purpose:\*\* Account creation engine for Seekers and Providers.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Public Canvas (Unwrapped)

\#### Sections:

\*\*Registration Flow:\*\*

\- \*\*Description:\*\* Step-based or long-form schema for role assignment and data ingress.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `RegisterForm` (Inline State)

`  `- \*\*Type:\*\* Stateful Form Container

`  `- \*\*Responsibility:\*\* Captures meta, enforces Supabase `signUp` execution.

\*\*UI Primitives Used:\*\*

\- Button (Primary block type)

\- Form Inputs

\- Icons (`Briefcase`)

\---

\### 4. JobFeedPage

\*\*Route:\*\* `/jobs`

\*\*Purpose:\*\* Primary seeker dashboard streaming indexed roles with heavy client-side filtering and real-time metadata normalization.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell (`Navbar`, `Sidebar` conditionally, `Footer`)

\#### Sections:

\*\*Control Header:\*\*

\- \*\*Description:\*\* High contrast multi-select parameter area with dynamic options derivation.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `JobFeedFilters` (Inline hook `useMemo/useState`)

`  `- \*\*Type:\*\* Container / Stateful

`  `- \*\*Responsibility:\*\* Evaluates filtering logic against JSON arrays. Derives unique locations and categories from live data.

\*\*Results Grid:\*\*

\- \*\*Description:\*\* Grid mapping resulting `JobCard` primitives.

\- \*\*Component Name:\*\* `JobCard`

`  `- \*\*Type:\*\* Presentational Wrapper

`  `- \*\*Responsibility:\*\* Standardized modular tile formatting jobs.

\- \*\*Component Name:\*\* `Loader`

`  `- \*\*Type:\*\* Primitive

`  `- \*\*Responsibility:\*\* Async Wait State blocking grid.

\#### Core Logic (Data Ingestion):

\- \*\*Normalization:\*\* Natively cleans scraped job data; mapping titles to city-level locations and enforcing strict category/experience level categorization.

\*\*UI Primitives Used:\*\*

\- JobCard

\- Buttons

\- Badges (for Skills visually active)

\- Icons (`Search`, `Sparkles`, `MapPin`, `Filter`)

\- Loader

\---

\### 5. JobDetailPage

\*\*Route:\*\* `/jobs/:id`

\*\*Purpose:\*\* High-resolution breakdown of job metadata triggering contextual Seeker tools.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Job Header & Meta:\*\*

\- \*\*Description:\*\* Title parsing and immediate metadata (salary, location).

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `DetailHeader` (Inline)

`  `- \*\*Type:\*\* Presentational

\- \*\*Component Name:\*\* `ActionMenu` (Inline)

`  `- \*\*Type:\*\* Container

`  `- \*\*Responsibility:\*\* Bridges `/match`, `/tailor`, routing workflows.

\*\*UI Primitives Used:\*\*

\- Button

\- Icons (`Briefcase`, `Clock`, `Radio`, `Lock`, `Building2`)

\---

\### 6. MatchPage

\*\*Route:\*\* `/jobs/:id/match`

\*\*Purpose:\*\* Data visualization page contrasting active internal Seeker Resume vs specific Job ID.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Match Analytics:\*\*

\- \*\*Description:\*\* Scoring interfaces and factor breakdowns.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `Scorecard` / `MetricsBlock` (Inline/Modular)

`  `- \*\*Type:\*\* Presentational

`  `- \*\*Responsibility:\*\* Generates percentage donuts based on `matchingApi` numbers.

\*\*UI Primitives Used:\*\*

\- Motion primitives (`framer-motion` for graph rendering)

\- Loader

\- Icons (`Target`, `Shield`, `Zap`, `CheckCircle`)

\---

\### 7. TailorResumePage

\*\*Route:\*\* `/jobs/:id/tailor`

\*\*Purpose:\*\* AI-assistant wizard generating optimized resume strings.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Editor & Action Bar:\*\*

\- \*\*Description:\*\* Suggestion panels alongside action hooks (Download, Replace).

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `TailorWizard` (Inline State)

`  `- \*\*Type:\*\* Container

`  `- \*\*Responsibility:\*\* Maps API feedback to editable text chunks.

\*\*UI Primitives Used:\*\*

\- Icons (`BrainCircuit`, `Upload`, `RefreshCw`, `Download`)

\- Button (Secondary/Primary pairs)

\---

\### 8. MockInterviewPage

\*\*Route:\*\* `/jobs/:id/mock-interview` or `/mock-interview`

\*\*Purpose:\*\* AI-powered real-time voice and text simulation sandbox.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Entry & Configuration:\*\*

\- \*\*Description:\*\* Session setup (Technical vs HR), Duration selection, and Proctoring configuration.

\*\*Live Interview Interface:\*\*

\- \*\*Description:\*\* Real-time communication portal with voice visualizers and transcript history.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `SiriVisualizer` (Inline)

`  `- \*\*Type:\*\* Canvas-based Presentational

`  `- \*\*Responsibility:\*\* Multi-layered sine wave animation reacting to AI speech output.

\- \*\*Component Name:\*\* `InterviewInterface` (Inline)

`  `- \*\*Type:\*\* Stateful Container

`  `- \*\*Responsibility:\*\* Bridges WebSocket audio buffers and transcript JSONs to the DOM.

\- \*\*Component Name:\*\* `EvalReport` (Inline)

`  `- \*\*Type:\*\* Data Visualizer

`  `- \*\*Responsibility:\*\* Detailed post-session breakdown with scoring, strengths, and improvement metrics.

\*\*UI Primitives Used:\*\*

\- Motion containers

\- Text Inputs

\- Buttons

\- Icons (`Mic`, `MicOff`, `StopCircle`, `Play`, `Radio`)

\---

\### 9. ProfilePage

\*\*Route:\*\* `/profile`

\*\*Purpose:\*\* Seeker master settings.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Metadata Panels:\*\*

\- \*\*Description:\*\* Segmented data chunks parsing specific database fields.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `ProfileForm` (Inline)

`  `- \*\*Type:\*\* Stateful Container

`  `- \*\*Sub-components:\*\* `Card` nested wrappers for sections (Skills, Bio, Education).

\*\*UI Primitives Used:\*\*

\- Card

\- Button (Danger/Primary)

\- Icons (`FileText`, `AlertCircle`)

\---

\### 10. CoursesPage

\*\*Route:\*\* `/courses`

\*\*Purpose:\*\* Educational routing.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Course Grids:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `CourseList` (Inline)

`  `- \*\*Type:\*\* Presentational Array

`  `- \*\*Responsibility:\*\* Renders outbound learning material via map functions.

\*\*UI Primitives Used:\*\*

\- Motion items

\- Icons (`ExternalLink`)

\---

\### 11. ChatPage

\*\*Route:\*\* `/chat`

\*\*Purpose:\*\* Socket/Polling communication bridge.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell (Footer historically hidden conditionally)

\#### Sections:

\*\*Thread Lists / Live Window:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `ThreadsList` (Inline)

`  `- \*\*Type:\*\* Navigational List

\- \*\*Component Name:\*\* `LiveChatBox` (Inline)

`  `- \*\*Type:\*\* Data Stream Container

`  `- \*\*Responsibility:\*\* Hooks logic updating DOM without hard reloads via payload states.

\*\*UI Primitives Used:\*\*

\- Card

\- Loader

\- Inputs

\- Icons (`Send`, `Bot`, `Shield`, `Plus`)

\---

\### 12. CreateJobPage

\*\*Route:\*\* `/provider/create`

\*\*Purpose:\*\* Root ingestion panel for Providers.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell (Provider Segment)

\#### Sections:

\*\*Form Body:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `JobDraftForm` (Inline)

`  `- \*\*Type:\*\* Container

`  `- \*\*Responsibility:\*\* Translates Provider UI schema to backend JSON model constraint natively.

\*\*UI Primitives Used:\*\*

\- Card

\- Button

\- Forms/Select

\- Icons (`Info`, `Sparkles`)

\---

\### 13. MyListingsPage

\*\*Route:\*\* `/provider/listings`

\*\*Purpose:\*\* Audit interface managing live roles.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Audit Grid:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `ListingTable` / Mapped Grid

`  `- \*\*Type:\*\* Container

`  `- \*\*Responsibility:\*\* Displays data from Provider ownership.

\- \*\*Component Name:\*\* `StatusBadge` (Inline / `Badge`)

`  `- \*\*Type:\*\* Primitive Call

`  `- \*\*Responsibility:\*\* Signals Open/Closed job activity.

\*\*UI Primitives Used:\*\*

\- Card (as rows/lists)

\- Button

\- Badge

\- Icons (`Eye`, `PlusCircle`)

\---

\### 14. MarketPage

\*\*Route:\*\* `/market-intelligence`

\*\*Purpose:\*\* Protected aggregated reporting.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell

\#### Sections:

\*\*Analytics Graph Boards:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `GraphWidgets` (Inline utilizing charting tools)

`  `- \*\*Type:\*\* Presentational Visualizer

\*\*UI Primitives Used:\*\*

\- Loader

\- Motion Views

\- Icons (`TrendingUp`, `Users`, `DollarSign`, `Globe`)

\---

\### 15. BlogLandingPage & 16. BlogPostPage

\*\*Routes:\*\* `/blogs`, `/blogs/:slug`

\*\*Purpose:\*\* Publicly accessible documentation and thought leadership structure.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* AppShell (Navbar enabled, Sidebar bypassed conditionally).

\#### Sections:

\*\*Hero/Index:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `BlogList` & `BlogReader` (Inline)

\*\*UI Primitives Used:\*\*

\- Card, Loader

\- Icons (`BookOpen`, `Cpu`, `Share2`)

\---

\### 17. ControlTowerPage, 18. IngestionPage, 19. HelpDeskPage

\*\*Routes:\*\* `/admin/tower`, `/admin/ingest`, `/admin/helpdesk`

\*\*Purpose:\*\* Backend administration suite.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Protected AppShell (Admin Segregation)

\#### Sections:

\*\*Dashboard Matrices:\*\*

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `AdminModules` (Inline blocks)

`  `- \*\*Type:\*\* Restricted Access Containers

`  `- \*\*Responsibility:\*\* Fetching core global `adminApi` roots.

\*\*UI Primitives Used:\*\*

\- Card (Critical bounding tool)

\- Button

\- Loader

\---

\### 20. NotFoundPage

\*\*Route:\*\* `\*`

\*\*Purpose:\*\* Fallback Catch-all Route.

\#### Layout Wrapper:

\- \*\*Layout Name:\*\* Public Canvas

\#### Sections:

\*\*404 Visualizer:\*\*

\- \*\*Description:\*\* Simple error redirector UI.

\##### Components (ALL levels):

\- \*\*Component Name:\*\* `ErrorBlock` (Inline)

\*\*UI Primitives Used:\*\*

\- Motion primitives, Buttons mapping generic `<Link>` tags.

\---

\### LOGIC & STATE ENGINE (React Hooks)

\*\*Directory:\*\* `src/hooks/`

This layer governs the application's intelligence, abstracting complex DOM and network interactions from the UI components.

\- \*\*Hook Name:\*\* `useAuth`
`  `- \*\*Scope:\*\* Global
`  `- \*\*Responsibility:\*\* Bridges `AuthContext` to components; exposes user profile, session tokens, and role-validation logic.

\- \*\*Hook Name:\*\* `useWebSocket`
`  `- \*\*Scope:\*\* Real-time (Mock Interview, Chat)
`  `- \*\*Responsibility:\*\* Manages persistent binary/text socket connections with auto-reconnection and heartbeat logic.

\- \*\*Hook Name:\*\* `useMicrophone`
`  `- \*\*Scope:\*\* Media (Mock Interview)
`  `- \*\*Responsibility:\*\* Handles Browser Audio API access, PCM chunking for transmission, and forced-mute states.

\- \*\*Hook Name:\*\* `usePlayback`
`  `- \*\*Scope:\*\* Media (Mock Interview)
`  `- \*\*Responsibility:\*\* Decodes and queues binary PCM audio chunks for low-latency AI speech reproduction.

\- \*\*Hook Name:\*\* `useBlogPosts`
`  `- \*\*Scope:\*\* Data (Marketing)
`  `- \*\*Responsibility:\*\* Encapsulates slug-based fetching and list management for the public intelligence portal.

\---

\### DATA TRANSMISSION LAYER (API Infrastructure)

\*\*Directory:\*\* `src/api/`

\#### 1. Core Fetcher (`client.js`)
The specialized foundation for all outbound signals.
\- \*\*Method:\*\* Axios wrapper with Supabase-native authorization interceptors.
\- \*\*Responsibility:\*\* Dynamically injects `Authorization: Bearer <JWT>` for all protected endpoints.

\#### 2. Domain Specific Modules
\- `authApi.js`: Login, Registration, and Password management.
\- `jobsApi.js`: Feed fetching, Detail retrieval, and Listing management.
\- `mockInterviewApi.js`: Webhook/HTTP handshakes for starting AI sessions and retrieving evaluations.
\- `analyticsApi.js`: Market metrics and system tower status.

\---

\### GLOBAL BRIDGING UTILITIES

\*\*Directory:\*\* `src/utils/`

\- \*\*Utility:\*\* `cn.js` (Class Variance Authority / Tailwind Merge)
`  `- \*\*Role:\*\* Facilitates conditional logic for Tailwind utility strings without collision.

\- \*\*Utility:\*\* `constants.js`
`  `- \*\*Role:\*\* Single point of truth for application constants including `ROLES` (SEEKER, PROVIDER, ADMIN).

\---

\### CSS STRUCTURE OVERVIEW (Applied Globally across all above pages)

\#### Method:

Tailwind v4 PostCSS + Global index overrides (`@theme`)

\#### Layout Structuring (`flex`, `grid`):

\- All AppShell pages utilize `min-h-screen flex flex-col`. Main bodies shift right via `md:pl-64` dynamically when Sidebar is loaded.

\- Component layouts utilize `gap-x`, `items-center` universally for semantic flex-boxing. Cards trigger flex grids (`grid sm:grid-cols-2 lg:grid-cols-3 gap-10`).

\#### Colors / Architecture Logic:

\- Surfaces are strictly defined to `--bg-primary` (`#FFFFFF`) pushing a hyper-monochrome structural rule.

\- Modals, pop-ups, and sticky Navbars use `.glass-panel` backdrop utility enforcing blur properties.

\- CTA/Highlights route exclusively through `#000000` text-blocks or `.text-gradient` (`linear-gradient(135deg, #000000, #404040)`).

\#### States & Interaction:

\- Hover rules are defined per primitive but follow strict guidelines (e.g., Cards translate `-translate-y-0.5`, Buttons `scale-1.02`).

\- Focus rings enforce visibility exclusively via `focus:ring-black/5` disabling default browser outlines (`focus:outline-none`).

