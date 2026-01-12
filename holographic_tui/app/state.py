from dataclasses import dataclass
from typing import Literal

ActiveApp = Literal["weather", "notes", "music", "calculator", "assistant", "dashboard"]


@dataclass
class AppState:
    active: ActiveApp = "dashboard"
    notes_buffer: str = ""

    def set_active(self, app: ActiveApp) -> None:
        self.active = app
