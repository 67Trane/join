# Join — Projektmanagement Board

Eine Kanban-basierte Aufgabenverwaltungs-App, entwickelt mit reinem HTML, CSS und JavaScript – ohne Frameworks oder Build-Tools – und Firebase Realtime Database als Backend.


---

## Live Demo

[https://mehmet-deliaci.net/join/](https://mehmet-deliaci.net/join/)

---

## Screenshots

![Board](https://mehmet-deliaci.net/join/assets/screenshots/join.png)

---

## Features

- **Login & Registrierung** — Benutzeranmeldung mit Gast-Login-Funktion
- **Summary Dashboard** — Übersicht aller Aufgaben nach Status, nächste dringende Deadline und zeitbasierte Begrüßung
- **Kanban Board** — Aufgaben in den Spalten „To Do", „In Progress", „Await Feedback" und „Done"
- **Drag & Drop** — Aufgaben per Drag & Drop zwischen den Spalten verschieben
- **Aufgabe hinzufügen** — Aufgaben über ein Modal erstellen mit Titel, Beschreibung, Fälligkeitsdatum, Priorität, Kategorie, zugewiesenen Kontakten und Unteraufgaben
- **Kontakte** — Vollständige Kontaktverwaltung mit Hinzufügen, Bearbeiten und Löschen
- **Responsives Design** — Funktioniert auf Desktop und Mobilgeräten

---

## Technologien

| Bereich | Technologie |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (ohne Framework) |
| Logik | Vanilla JavaScript (ES6+) |
| Datenbank | Firebase Realtime Database |
| Hosting | *(z. B. AllInkl / GitHub Pages)* |

Keine Bibliotheken. Keine Frameworks. Keine Build-Tools.

---

## Projektstruktur

```
join/
├── index.html                  # Login / Registrierung
├── style.css                   # Globale Styles
└── src/
    ├── features/
    │   ├── add-task/           # Aufgabe hinzufügen (Seite & Modal)
    │   ├── board/              # Kanban Board & Drag-and-Drop
    │   ├── contacts/           # Kontaktliste & Detailansicht
    │   ├── summary/            # Summary Dashboard
    │   └── auth/               # Login & Registrierung
    └── shared/
        ├── scripts/            # Gemeinsame Skripte (App, Header, Dropdown, Task-Model)
        ├── styles/             # Gemeinsame CSS-Dateien (Navbar, Header)
        └── fragments/          # Wiederverwendbare HTML-Fragmente (Navbar, Header)
```

---

## Installation & Start

Kein Build-Schritt erforderlich.

1. Repository klonen:
   ```bash
   git clone https://github.com/dein-benutzername/join.git
   ```
2. Projekt vom Root-Verzeichnis mit einem lokalen Server starten, z. B.:
   ```bash
   npx serve .
   ```
3. `http://localhost:3000` im Browser öffnen.

> Die App verbindet sich mit einer live Firebase Realtime Database. Es ist keine weitere Konfiguration notwendig.

---

## Was ich gelernt habe

- Strukturierung einer mehrseitigen Vanilla-JS-App ohne Framework
- Arbeiten mit einer REST-API in Echtzeit (Firebase) über `fetch`
- Implementierung von Drag & Drop mit nativen Browser-Events
- Dynamisches Laden wiederverwendbarer HTML-Fragmente via `fetch`
- Responsives Layout mit reinem CSS ohne Utility-Framework

---

## Autor

**Mehmet Deliaci**
- Portfolio: [https://mehmet-deliaci.net/](#)
- LinkedIn: [https://www.linkedin.com/in/mehmet-deliaci-24285535a/](#)
