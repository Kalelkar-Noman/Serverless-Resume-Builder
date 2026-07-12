
# chmod +x release.sh
#!/usr/bin/env bash
#
# release.sh — Universal semantic version release script
#
# Usage:
#   ./release.sh --patch              Bump patch version (1.0.0 → 1.0.1)
#   ./release.sh --minor              Bump minor version (1.0.0 → 1.1.0)
#   ./release.sh --major              Bump major version (1.0.0 → 2.0.0)
#   ./release.sh --patch --dry-run    Preview changes without applying
#   ./release.sh --patch -r origin    Push to specific remote
#
# The script reads the current version from version.txt, bumps it,
# updates any detected version references in source files, commits,
# tags, and pushes.
#
# Supported auto-detection:
#   - Go:     const version = "X.Y.Z"
#   - Python: __version__ = "X.Y.Z"
#   - Node:   "version": "X.Y.Z" in package.json
#   - Rust:   version = "X.Y.Z" in Cargo.toml
#
# Drop this script into any project that has a version.txt file.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Argument parsing ──────────────────────────────────────────────

BUMP=""
DRY_RUN=false
REMOTE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -j|--major)   BUMP="major";  shift ;;
        -n|--minor)   BUMP="minor";  shift ;;
        -p|--patch)   BUMP="patch";  shift ;;
        -d|--dry-run) DRY_RUN=true;  shift ;;
        -r|--remote)  REMOTE="$2";   shift 2 ;;
        -h|--help)
            echo "Usage: $0 [--major|--minor|--patch] [--dry-run] [--remote <name>]"
            echo ""
            echo "Options:"
            echo "  -j, --major      Bump major version (X.0.0)"
            echo "  -n, --minor      Bump minor version (0.X.0)"
            echo "  -p, --patch      Bump patch version (0.0.X)"
            echo "  -d, --dry-run    Preview changes without applying"
            echo "  -r, --remote     Git remote to push to (interactive if omitted)"
            echo "  -h, --help       Show this help"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run '$0 --help' for usage."
            exit 1
            ;;
    esac
done

if [[ -z "$BUMP" ]]; then
    echo -e "${RED}Error: specify --major, --minor, or --patch${NC}"
    echo "Run '$0 --help' for usage."
    exit 1
fi

# ── Read current version ──────────────────────────────────────────

VERSION_FILE="version.txt"

if [[ ! -f "$VERSION_FILE" ]]; then
    echo -e "${RED}Error: $VERSION_FILE not found.${NC}"
    echo "Create one with your current version, e.g.:"
    echo '  echo "v1.0.0" > version.txt'
    exit 1
fi

# Read and strip 'v' prefix if present
CURRENT=$(cat "$VERSION_FILE" | tr -d '[:space:]')
CURRENT="${CURRENT#v}"

# Validate semver format
if ! [[ "$CURRENT" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: '$CURRENT' is not a valid semver (expected X.Y.Z)${NC}"
    exit 1
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# ── Bump version ──────────────────────────────────────────────────

case $BUMP in
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    patch) PATCH=$((PATCH + 1)) ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Release: ${YELLOW}v${CURRENT}${CYAN} → ${GREEN}v${NEW_VERSION}${CYAN}  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

if $DRY_RUN; then
    echo -e "${YELLOW}[DRY RUN] No changes will be made.${NC}"
    echo ""
fi

# ── Update version.txt ────────────────────────────────────────────

echo -e "${GREEN}→${NC} Updating $VERSION_FILE"
if ! $DRY_RUN; then
    echo "v${NEW_VERSION}" > "$VERSION_FILE"
fi

# ── Auto-detect and update source files ───────────────────────────

update_file() {
    local file="$1"
    local pattern="$2"
    local replacement="$3"
    local label="$4"

    if [[ -f "$file" ]]; then
        if grep -q "$pattern" "$file" 2>/dev/null; then
            echo -e "${GREEN}→${NC} Updating $label in ${CYAN}${file}${NC}"
            if ! $DRY_RUN; then
                sed -i "s|${pattern}|${replacement}|g" "$file"
            fi
        fi
    fi
}

# Go: const version = "X.Y.Z"
for gofile in *.go; do
    [[ -f "$gofile" ]] || continue
    update_file "$gofile" \
        "const version = \"${CURRENT}\"" \
        "const version = \"${NEW_VERSION}\"" \
        "Go version"
done

# Python: __version__ = "X.Y.Z"
for initfile in */__init__.py; do
    [[ -f "$initfile" ]] || continue
    update_file "$initfile" \
        "__version__ = \"${CURRENT}\"" \
        "__version__ = \"${NEW_VERSION}\"" \
        "Python version"
done

# Node: "version": "X.Y.Z" in package.json
update_file "package.json" \
    "\"version\": \"${CURRENT}\"" \
    "\"version\": \"${NEW_VERSION}\"" \
    "Node version"

# Rust: version = "X.Y.Z" in Cargo.toml (first occurrence only)
if [[ -f "Cargo.toml" ]]; then
    if grep -q "version = \"${CURRENT}\"" "Cargo.toml" 2>/dev/null; then
        echo -e "${GREEN}→${NC} Updating Rust version in ${CYAN}Cargo.toml${NC}"
        if ! $DRY_RUN; then
            sed -i "0,/version = \"${CURRENT}\"/s|version = \"${CURRENT}\"|version = \"${NEW_VERSION}\"|" "Cargo.toml"
        fi
    fi
fi

# Inno Setup: AppVersion=X.Y.Z
for issfile in *.iss; do
    [[ -f "$issfile" ]] || continue
    update_file "$issfile" \
        "AppVersion=${CURRENT}" \
        "AppVersion=${NEW_VERSION}" \
        "Inno Setup version"
done

echo ""

# ── Git operations ────────────────────────────────────────────────

if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    echo -e "${RED}Error: not inside a git repository${NC}"
    exit 1
fi

# Commit
COMMIT_MSG="Release v${NEW_VERSION}"
echo -e "${GREEN}→${NC} Git commit: ${CYAN}${COMMIT_MSG}${NC}"
if ! $DRY_RUN; then
    git add -A
    git commit -m "$COMMIT_MSG"
fi

# Tag
echo -e "${GREEN}→${NC} Git tag: ${CYAN}v${NEW_VERSION}${NC}"
if ! $DRY_RUN; then
    git tag -a "v${NEW_VERSION}" -m "Released v${NEW_VERSION}"
fi

# Push
if [[ -z "$REMOTE" ]]; then
    echo ""
    echo "Available git remotes:"
    INDEX=1
    REMOTES=()
    while IFS= read -r remote; do
        REMOTES+=("$remote")
        echo "  ${INDEX}) ${remote}"
        INDEX=$((INDEX + 1))
    done < <(git remote)

    if [[ ${#REMOTES[@]} -eq 0 ]]; then
        echo -e "${RED}No git remotes configured.${NC}"
        exit 1
    elif [[ ${#REMOTES[@]} -eq 1 ]]; then
        REMOTE="${REMOTES[0]}"
        echo -e "Auto-selected: ${CYAN}${REMOTE}${NC}"
    else
        read -rp "Select remote (1-${#REMOTES[@]}): " CHOICE
        REMOTE="${REMOTES[$((CHOICE - 1))]}"
        if [[ -z "$REMOTE" ]]; then
            echo -e "${RED}Invalid selection, defaulting to 'origin'${NC}"
            REMOTE="origin"
        fi
    fi
fi

echo -e "${GREEN}→${NC} Git push: ${CYAN}${REMOTE}${NC} (with tags)"
if ! $DRY_RUN; then
    git push "$REMOTE" --follow-tags
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Released v${NEW_VERSION} successfully!  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
