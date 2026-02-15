#!/usr/bin/env bash
set -euo pipefail

# Ensure Remotion can find ffmpeg/ffprobe on Oracle Linux 9 (arm64)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FFMPEG_BIN="$REPO_DIR/.mamba/env/bin"

if [[ ! -x "$FFMPEG_BIN/ffmpeg" ]]; then
  echo "ffmpeg not found at $FFMPEG_BIN/ffmpeg" >&2
  echo "Install via micromamba: tools/micromamba/micromamba create -p .mamba/env -c conda-forge ffmpeg" >&2
  exit 1
fi

export PATH="$FFMPEG_BIN:$PATH"
exec "$@"
