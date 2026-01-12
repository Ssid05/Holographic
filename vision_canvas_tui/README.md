# Vision Canvas TUI (Phase 1)

Terminal-first simulator (no browser) with a Vision Pro–style dock and apps.

## Run
```bash
cd vision_canvas_tui
pip install -r requirements.txt
python -m ui.main
```

## Apps
- Dashboard: time, OS, CPU/MEM/Disk (psutil; otherwise shows hint)
- Weather: Open-Meteo API; defaults to Moradabad if geocode fails/offline
- Notes: edit and save locally (Ctrl+S or Enter). Stored under ~/.vision_canvas/data/notes.txt
- Music: placeholder
- Calculator: type expression, Enter to evaluate
- Assistant: placeholder echo

## Controls
- Number keys 1-6 switch apps
- Ctrl+Q to quit
- Notes: Enter or Ctrl+S saves

## Architecture
- core/: UI-agnostic logic (weather, notes, calculator, assistant, dashboard, storage)
- app/: shared state
- ui/: TUI built with textual

## Dependencies
- textual, requests, psutil

## Constraints
- No browser, no web server. Runs entirely in terminal/VS Code terminal.
- Phase 2 (native SwiftUI/visionOS) can reuse core logic.
