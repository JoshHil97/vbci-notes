#!/usr/bin/env bash
set -e

FILE="app/globals.css"

# replace :global(.Something) with .Something
perl -pi -e 's/:global\(([^)]+)\)/$1/g' "$FILE"

echo "Fixed :global() usage inside $FILE"
