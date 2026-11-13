# JosephMary Onyenaucheya's Profile

**CSC 106 – Introduction to Web Technologies · Practical Term Project**
**Student:** JosephMary Onyenaucheya · B.Sc. Cybersecurity, 100 Level · MIVA Open University

A responsive, multi-page personal portfolio and academic management site built with HTML, CSS and JavaScript (no frameworks).

- **Live site:** https://jonyenaucheya2279-sudo.github.io/student-portfolio/
- **Repository:** https://github.com/jonyenaucheya2279-sudo/student-portfolio

## Pages

| Page | File | What it contains |
|---|---|---|
| Home | `index.html` | Name, photo, time-based welcome, navigation, biography, intro video, GPA summary, course progress |
| About | `about.html` | Education, career aspirations, skills, hobbies, table of this semester's courses |
| Projects | `projects.html` | Three project cards with a category filter; selecting one opens a details window with a description, feature list, screenshot gallery and a "Test it now" link |
| Academic Planner | `planner.html` | Add, complete and delete tasks; filter, progress bar, overdue flags, saved in localStorage |
| Contact | `contact.html` | Name, email, phone and message form with JavaScript validation; GitHub and LinkedIn |

## Folder structure

```
student-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/style.css        ← single external stylesheet
├── js/main.js           ← nav menu, active link, scroll reveal, skill bars, project filter
├── js/planner.js        ← task manager
├── js/contact.js        ← form validation
├── js/projects.js       ← project data array + details window and screenshot gallery
├── images/              ← profile photo, video poster; images/shots/ holds project screenshots
└── media/               ← intro.mp4 (intro video)
```

## How each requirement is met

### HTML
- **Semantic elements:** `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `figcaption`, `footer`
- **Forms:** contact form (`contact.html`) and task form (`planner.html`)
- **Tables:** semester course table with `caption`, `thead`, `tbody`, `tfoot` (`about.html`)
- **Images:** profile photo and project screenshots
- **Hyperlinks:** navigation, project links, GitHub/LinkedIn links
- **Lists:** `ul` (nav, hobbies, tags), `ol` (education timeline)
- **Multimedia:** intro `<video>` on Home

### CSS
- **External stylesheet:** `css/style.css` linked from every page
- **Responsive design:** media queries at 900px and 720px, fluid `clamp()` type, no horizontal scroll at phone width
- **Flexbox & Grid:** Grid for hero, cards, two-column and planner layouts; Flexbox for nav, stats, footer, tasks
- **Navigation styling:** sticky header, animated underline, active-page highlight, hamburger menu on mobile
- **Animations & transitions:** animated network canvas in the hero, typing role headline, count-up stats, portrait scan sweep, scroll-driven section reveals and progress-bar fills, header shrink on scroll, scroll progress bar, back-to-top button, theme-toggle icon swap, button light sweep, card hover lift, image zoom, project filter pop-in, planner counter bump, invalid-field shake
- **Consistent colour scheme:** navy + signal-red palette defined once as CSS variables, with a dark theme
- **Mobile-friendly:** collapsible menu, stacked layouts, touch-sized controls

### JavaScript
- **Event handling:** click, submit, change, input and blur listeners
- **DOM manipulation:** task items built with `createElement`, classes toggled, text updated
- **Form validation:** no empty fields, valid email format (regex), digits-only phone number
- **Dynamic content updates:** greeting by time of day, rotating role text, count-up statistics, light/dark theme toggle, scroll progress, task counters, progress bar, footer year, project filter
- **Arrays & functions:** `tasks` array managed with `push`, `map`, `filter`, `forEach`; validators stored in an array of field objects
- **Interactive task management:** add, mark complete, delete, filter and clear completed tasks, persisted with `localStorage`

## Run locally
Open `index.html` in any modern browser. No installation needed.

## Deploy with GitHub Pages
1. Create a new public repository on GitHub (e.g. `student-portfolio`).
2. Upload all files and folders in this project (keep `index.html` at the top level).
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
4. After a minute, the site is live at `https://jonyenaucheya2279-sudo.github.io/student-portfolio/`.
5. Update the two links at the top of this README and submit both.
