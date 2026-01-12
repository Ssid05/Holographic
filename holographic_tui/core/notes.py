from core.storage import load_notes as _load, save_notes as _save


def load_notes() -> str:
    return _load()


def save_notes(content: str) -> None:
    _save(content)
