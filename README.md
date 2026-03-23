# Join — Project Management Board

A Kanban-style task management web app built with vanilla HTML, CSS, and JavaScript, backed by Firebase Realtime Database.

> Built as part of the Developer Akademie curriculum and included in my web development portfolio.

---

## Live Demo

[View Live Demo](#) <!-- Replace with your deployed URL -->

---

## Screenshots

> *(Add screenshots of the login page, board, and contacts page here)*

---

## Features

- **Login & Sign Up** — User authentication with guest login support
- **Summary Dashboard** — Overview of all task counts by status, upcoming urgent deadline, and a time-based greeting
- **Kanban Board** — Tasks organized into To Do, In Progress, Await Feedback, and Done columns
- **Drag & Drop** — Move tasks between columns by dragging
- **Add Task** — Create tasks via a modal with title, description, due date, priority, category, assigned contacts, and subtasks
- **Contacts** — Full contact management with add, edit, and delete functionality
- **Responsive Design** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom, no framework) |
| Logic | Vanilla JavaScript (ES6+) |
| Database | Firebase Realtime Database |
| Hosting | *(e.g. Firebase Hosting / GitHub Pages)* |

No libraries. No frameworks. No build tools.

---

## Project Structure

```
join/
├── index.html                  # Login / Sign Up
├── style.css                   # Global styles
└── src/
    ├── features/
    │   ├── add-task/           # Add Task page & modal
    │   ├── board/              # Kanban board & drag-and-drop
    │   ├── contacts/           # Contact list & detail view
    │   ├── summary/            # Summary dashboard
    │   └── auth/               # Login & sign up logic
    └── shared/
        ├── scripts/            # Shared utilities (app, header, dropdown, task model)
        ├── styles/             # Shared CSS (navbar, header)
        └── fragments/          # Reusable HTML fragments (navbar, header)
```

---

## Getting Started

No installation or build step required.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/join.git
   ```
2. Serve the project from the root with any local server, for example:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000` in your browser.

> The app connects to a live Firebase Realtime Database. No additional configuration is needed to run it.

---

## What I Learned

- Structuring a multi-page vanilla JS app without a framework
- Working with a real-time REST API (Firebase) using `fetch`
- Implementing drag and drop with native browser events
- Building reusable HTML fragments loaded dynamically via `fetch`
- Responsive layout with CSS without any utility framework

---

## Author

**Your Name**
- Portfolio: [your-portfolio.com](#)
- LinkedIn: [linkedin.com/in/your-profile](#)
- GitHub: [github.com/your-username](#)
