# Project Instructions

## Project

This is Carson Kipkalya's personal website and portfolio.

The goal is to build a simple, fast, thoughtful V1 rather than an unnecessarily complex portfolio or application.

## Stack

Use:

- Astro
- TypeScript
- Plain CSS
- Astro content collections/local content where appropriate
- Native HTML and CSS interactions where possible

Do not introduce React, Tailwind, UI component libraries, state-management libraries, or other frameworks unless explicitly requested.

## Architecture

Prefer Astro's static-first approach.

Keep components small and purposeful.

Do not create abstractions unless they solve a real repeated problem.

Keep content separate from presentation when content naturally forms an independent collection, such as projects or writing.

Prefer semantic HTML and accessible native elements before introducing JavaScript.

## Design system

Colors:

- Background: #162521
- Text: #E5F4E3
- Muted: #678D58
- Accent: #B7410E
- Button hover orange: #E45011

Typography:

- Headings: Fraunces
- Body and small text: IBM Plex Sans

Do not introduce additional colors or fonts without an explicit design decision.

Buttons use the burnt-orange accent as their normal background with text-colored text. Hover should use the brighter orange and a subtle movement/expansion animation.

Section headings use:

1. a small muted section label corresponding to the navigation destination
2. a larger H2 containing the actual section title

Example:

About
A Little Context

## Development approach

Build the simplest implementation that satisfies the current V1 requirement.

Do not add dependencies when native HTML, CSS, Astro, or TypeScript already solve the problem.

Do not redesign existing visual decisions without being asked.

Before changing architecture, check the existing project structure and conventions.

After making changes, run the relevant validation command, especially:

- npm run build

Avoid leaving knowingly broken code or configuration behind.

## Content

The site should distinguish between:

- what Carson is currently doing
- what he is exploring
- projects and artifacts that demonstrate his thinking
- freelance services as a secondary practical offering

Avoid generic portfolio language, unsupported claims, unnecessary buzzwords, and artificial complexity.