#!/usr/bin/env bash

set -euo pipefail

ENV_FILE=".envrc"
KEY_VAR="VITE_YOUVERSION_APP_KEY"

# Always run from the script's directory so designers can launch it from anywhere.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Bible Plugin: starting development environment..."

ensure_pnpm_installed() {
  if command -v pnpm >/dev/null 2>&1; then
    return
  fi

  echo "Error: pnpm is not installed."
  echo "Install it with: npm install -g pnpm"
  exit 1
}

install_dependencies_if_needed() {
  if [ -d "node_modules" ]; then
    return
  fi

  echo "Installing dependencies (first run)..."
  pnpm install
}

write_api_key_to_env_file() {
  local escaped_key="$1"
  local tmp_file="${ENV_FILE}.tmp"

  if [ -f "$ENV_FILE" ]; then
    if grep -Eq "^[[:space:]]*export[[:space:]]+${KEY_VAR}=" "$ENV_FILE"; then
      awk -v key="$escaped_key" -v key_var="$KEY_VAR" '
        BEGIN { replaced=0 }
        $0 ~ "^[[:space:]]*export[[:space:]]+" key_var "=" {
          if (!replaced) {
            print "export " key_var "='\''" key "'\''"
            replaced=1
          }
          next
        }
        { print }
        END {
          if (!replaced) {
            print "export " key_var "='\''" key "'\''"
          }
        }
      ' "$ENV_FILE" > "$tmp_file"
      mv "$tmp_file" "$ENV_FILE"
    else
      printf "\nexport %s='%s'\n" "$KEY_VAR" "$escaped_key" >> "$ENV_FILE"
    fi
  else
    printf "export %s='%s'\n" "$KEY_VAR" "$escaped_key" > "$ENV_FILE"
  fi
}

ensure_youversion_api_key() {
  local api_key=""
  local escaped_key=""

  if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1091
    . "$ENV_FILE"
    api_key="${VITE_YOUVERSION_APP_KEY:-}"
  fi

  if [ -n "$api_key" ]; then
    export VITE_YOUVERSION_APP_KEY="$api_key"
    return
  fi

  echo "YouVersion API key is required."
  if [ ! -t 0 ]; then
    echo "Error: Cannot prompt for API key in non-interactive mode."
    echo "Create .envrc with: export VITE_YOUVERSION_APP_KEY=your_api_key"
    exit 1
  fi

  while [ -z "$api_key" ]; do
    read -r -p "Enter your YouVersion API key (input is visible, paste allowed): " api_key
    if [ -z "$api_key" ]; then
      echo "API key cannot be empty."
    fi
  done

  escaped_key=$(printf "%s" "$api_key" | sed "s/'/'\\\\''/g")
  write_api_key_to_env_file "$escaped_key"

  export VITE_YOUVERSION_APP_KEY="$api_key"
  echo "Saved VITE_YOUVERSION_APP_KEY to .envrc"
}

ensure_pnpm_installed
install_dependencies_if_needed
ensure_youversion_api_key

echo "Starting dev servers at http://localhost:5173"
echo "Press Ctrl+C to stop."
source .envrc
pnpm run dev
