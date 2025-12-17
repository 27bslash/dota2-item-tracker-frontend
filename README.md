# Dota 2 High‑MMR Guide Frontend

React + TypeScript frontend for visualising high‑MMR Dota 2 data
[Live Site](https://dota2itemtracker.vercel.app)
---

This frontend provides a structured way to explore the data produced by the [backend](https://github.com/27bslash/dota2-pro-item-tracker) API hosted on AWS API gateway.

## Features

* **Hero‑based colour scheme**
  The theme updates dynamically based on the selected hero. Primary and accent colours are derived from hero ability colors to improve visual separation when switching between heroes.
  <img width="556" height="717" alt="image" src="https://github.com/user-attachments/assets/48e1514c-0264-4435-9f38-fce4c9f7f7de" />
  <img width="556" height="629" alt="image" src="https://github.com/user-attachments/assets/c9306236-756c-435a-855b-44b25e72a9a3" />


* **Patch‑aware views**
  Data is grouped and filtered by game patch to avoid mixing metas.


## Tech stack

* **React**
* **Material UI**
* **TypeScript**
* **Vite**
---
