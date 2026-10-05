"""Check that the published DFS installer files match the updater manifest."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "updates" / "drive-folder-sync.json"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    version = manifest.get("version", "")
    require(bool(re.fullmatch(r"\d+\.\d+\.\d+", version)), "Invalid manifest version")
    expected_name = f"DriveFolderSync-Setup-{version}.exe"
    installer_url = urlparse(manifest.get("installer_url", ""))
    require(installer_url.scheme == "https" and installer_url.netloc == "norrisstand.com", "Unexpected installer URL host")
    require(installer_url.path == f"/downloads/{expected_name}", "Installer URL does not match manifest version")
    release_notes_url = urlparse(manifest.get("release_notes_url", ""))
    require(release_notes_url.scheme == "https" and release_notes_url.netloc == "norrisstand.com", "Unexpected release notes URL host")
    notes_path = ROOT / release_notes_url.path.lstrip("/")
    require(notes_path.is_file(), "Release notes page is missing")
    expected_hash = manifest.get("sha256", "").lower()
    require(bool(re.fullmatch(r"[0-9a-f]{64}", expected_hash)), "Invalid manifest SHA-256")
    for name in (expected_name, "DriveFolderSync-Setup-latest.exe"):
        installer = ROOT / "downloads" / name
        checksum = ROOT / "downloads" / f"{name.removesuffix('.exe')}.sha256.txt"
        require(installer.is_file(), f"Missing {name}")
        require(checksum.is_file(), f"Missing checksum for {name}")
        require(sha256(installer) == expected_hash, f"Installer hash mismatch: {name}")
        require(checksum.read_text(encoding="utf-8").strip().lower() == expected_hash, f"Checksum file mismatch: {name}")
    print(f"Validated DFS {version} versioned/latest installers and manifest: {expected_hash}")


if __name__ == "__main__":
    main()
