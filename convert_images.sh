#!/bin/bash
cd public
echo "Converting images..."
for file in *.jpg *.png; do
  [ -e "$file" ] || continue
  filename="${file%.*}"
  echo "Converting $file to $filename.webp"
  npx -y cwebp-bin "$file" -o "$filename.webp"
done
echo "Done."
