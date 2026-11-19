# Tour Guide Passport — Quiz Adventure

A fun, mobile-friendly, travel-themed quiz game in English built with plain HTML, CSS, and JavaScript — ready to deploy directly to **GitHub Pages** with zero build steps.

## Features
- **120 curated questions** covering Czech History, Art & Czech Heritage, European History & Art, European Geography, and Tourism & Guide Law.
- **Custom quiz length**: Choose 10, 20, 30, 50, All, or any exact number of questions, plus filter by topic.
- **Shuffled questions & answers** every round so you truly learn the content.
- **Instant feedback, streaks & celebrations**: Animated travel progress route, live streak counter, confetti bursts, and Tour Guide Passport rank stamps.
- **Study Log (Mistakes Review)**: Clear breakdown of every missed question (your pick vs. the correct answer) plus a one-click **Practice Missed Questions** mode.
- **Mobile-first design**: Large touch targets and responsive layout for phones and desktops.

## Adding More Questions
All questions live in a single plain file: `questions.js` (`window.QUIZ_QUESTIONS`).
Just append new question objects to the array and push to GitHub — the game automatically updates counts and topics.

## Publishing on GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, and click **Save**.
