#!/bin/bash
directory="C:\Users\fireb\Downloads\APL 2025"

for file in "$directory"/*; do
  [ -f "$file" ] || continue  # Skip if not a file
  ext="${file##*.}"
  if [[ "$ext" != "jpg" ]]; then
    base="${file%.*}"
    new_file="${base}.jpg"
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
  fi
done