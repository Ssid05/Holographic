import platform
import shutil
from datetime import datetime
from typing import Dict

try:
    import psutil  # type: ignore
    PSUTIL = True
except ImportError:  # pragma: no cover
    PSUTIL = False


def system_stats() -> Dict[str, str]:
    stats = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "os": platform.platform(),
    }
    if PSUTIL:
        stats["cpu"] = f"{psutil.cpu_percent(interval=0.1):.1f}%"
        mem = psutil.virtual_memory()
        stats["mem"] = f"{mem.percent:.1f}%"
        disk = shutil.disk_usage(".")
        stats["disk"] = f"{disk.free / (1024**3):.1f} GB free"
    else:
        stats["cpu"] = "psutil not installed"
        stats["mem"] = "psutil not installed"
        stats["disk"] = "psutil not installed"
    return stats
