from pathlib import Path

APP_DIR = Path.home() / ".holographic"
DATA_DIR = APP_DIR / "data"
NOTES_FILE = DATA_DIR / "notes.txt"


def ensure_storage() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_notes() -> str:
    ensure_storage()
    if NOTES_FILE.exists():
        return NOTES_FILE.read_text(encoding="utf-8")
    return ""


def save_notes(content: str) -> None:
    ensure_storage()
    NOTES_FILE.write_text(content, encoding="utf-8")
