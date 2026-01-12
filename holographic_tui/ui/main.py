from __future__ import annotations

import asyncio
from datetime import datetime

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal
from textual.reactive import reactive
from textual.widgets import Button, Footer, Static, Input

from app.state import AppState, ActiveApp
from core import storage
from core.assistant import reply as assistant_reply
from core.calculator import evaluate
from core.dashboard import system_stats
from core.notes import load_notes, save_notes
from core.weather import fetch_weather


class StatusBar(Static):
    time_text: reactive[str] = reactive("")
    location_text: reactive[str] = reactive("Moradabad")

    def compose(self) -> ComposeResult:  # type: ignore[override]
        self.time_display = Static("", id="time")
        self.location_display = Static(self.location_text, id="location")
        yield Horizontal(
            self.time_display,
            Static("|", id="sep1"),
            self.location_display,
            Static("|", id="sep2"),
            Static("Holographic TUI", id="title"),
            id="status-row",
        )

    def on_mount(self) -> None:
        self.set_interval(1, self._tick)
        self._tick()

    def _tick(self) -> None:
        self.time_text = datetime.now().strftime("%H:%M")
        self.time_display.update(self.time_text)


class Dock(Static):
    def __init__(self, on_select: callable[[ActiveApp], None]) -> None:
        super().__init__()
        self.on_select = on_select

    def compose(self) -> ComposeResult:  # type: ignore[override]
        buttons = [
            ("1", "Dashboard", "dashboard"),
            ("2", "Weather", "weather"),
            ("3", "Notes", "notes"),
            ("4", "Music", "music"),
            ("5", "Calculator", "calculator"),
            ("6", "Assistant", "assistant"),
        ]
        yield Horizontal(
            *(Button(f"{key} {label}", id=app_id) for key, label, app_id in buttons),
            id="dock-row",
        )

    def on_button_pressed(self, event: Button.Pressed) -> None:  # type: ignore[override]
        app_id = event.button.id
        if app_id in {"dashboard", "weather", "notes", "music", "calculator", "assistant"}:
            self.on_select(app_id)  # type: ignore[arg-type]


class Body(Static):
    active: reactive[str] = reactive("dashboard")

    def __init__(self, state: AppState) -> None:
        super().__init__()
        self.state = state
        self.notes_input = Input(placeholder="Type notes here; press Ctrl+S to save", id="notes-input")
        self.assistant_input = Input(placeholder="Ask me anything", id="assistant-input")
        self.output = Static(id="main-output")

    def compose(self) -> ComposeResult:  # type: ignore[override]
        yield self.output
        yield self.notes_input
        yield self.assistant_input

    def on_mount(self) -> None:
        self.notes_input.display = False
        self.assistant_input.display = False
        self.refresh_body("dashboard")

    def refresh_body(self, app: ActiveApp) -> None:
        self.active = app
        self.notes_input.display = app == "notes"
        self.assistant_input.display = app == "assistant"
        if app == "dashboard":
            stats = system_stats()
            lines = [
                "Dashboard",
                f"Time: {stats.get('time','')} | OS: {stats.get('os','')}",
                f"CPU: {stats.get('cpu','')} | MEM: {stats.get('mem','')} | Disk: {stats.get('disk','')}",
            ]
            self.output.update("\n".join(lines))
        elif app == "weather":
            self.output.update("Loading weather…")
            self.call_later(self._load_weather)
        elif app == "notes":
            self.state.notes_buffer = load_notes()
            self.notes_input.value = self.state.notes_buffer
            self.output.update("Notes — edit below, Ctrl+S to save")
        elif app == "music":
            self.output.update("Music placeholder — queued for Phase 2 audio hooks")
        elif app == "calculator":
            self.output.update("Calculator: type expression and press Enter")
        elif app == "assistant":
            self.output.update("Assistant placeholder — type prompt and Enter")

    async def _load_weather(self) -> None:
        weather = await asyncio.to_thread(fetch_weather)
        self.output.update(
            f"Weather\nLocation: {weather.location}\nTemp: {weather.temperature:.1f}°C\n{weather.description}"
        )

    def on_input_submitted(self, event: Input.Submitted) -> None:  # type: ignore[override]
        if event.input is self.notes_input:
            self.state.notes_buffer = event.value
            save_notes(event.value)
            self.output.update("Notes saved.")
        elif event.input is self.assistant_input:
            self.output.update(assistant_reply(event.value))
        elif self.active == "calculator":
            self.output.update(evaluate(event.value))

    def key_ctrl_s(self) -> None:
        if self.active == "notes":
            save_notes(self.notes_input.value)
            self.output.update("Notes saved.")


class HolographicApp(App[None]):
    CSS_PATH = None
    BINDINGS = [
        Binding("1", "app('dashboard')", "Dashboard"),
        Binding("2", "app('weather')", "Weather"),
        Binding("3", "app('notes')", "Notes"),
        Binding("4", "app('music')", "Music"),
        Binding("5", "app('calculator')", "Calculator"),
        Binding("6", "app('assistant')", "Assistant"),
        Binding("ctrl+q", "quit", "Quit"),
    ]

    def __init__(self) -> None:
        super().__init__()
        self.state = AppState()
        storage.ensure_storage()

    def compose(self) -> ComposeResult:  # type: ignore[override]
        self.status = StatusBar(id="status")
        self.body = Body(self.state)
        self.dock = Dock(self._switch_app)
        yield Container(self.status, self.body, self.dock, Footer())

    def _switch_app(self, app: ActiveApp) -> None:
        self.state.set_active(app)
        self.body.refresh_body(app)

    def action_app(self, app: str) -> None:
        if app in {"dashboard", "weather", "notes", "music", "calculator", "assistant"}:
            self._switch_app(app)  # type: ignore[arg-type]


if __name__ == "__main__":
    app = HolographicApp()
    app.run()
