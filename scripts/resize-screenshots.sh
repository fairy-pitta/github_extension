#!/bin/bash

# Resize screenshots for Chrome Web Store
# Requirements:
# - Size: 1,280 x 800 or 640 x 400
# - Format: JPEG or 24-bit PNG (no alpha)

SCREENSHOT_DIR="public"
OUTPUT_DIR="public/screenshots-store"
TARGET_SIZE="1280x800"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Resizing screenshots for Chrome Web Store..."
echo "Target size: $TARGET_SIZE"
echo ""

# Process each screenshot
for file in "$SCREENSHOT_DIR"/screenshot_*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        output_file="$OUTPUT_DIR/${filename%.png}_store.png"
        
        echo "Processing: $filename"
        
        # Get original dimensions
        width=$(sips -g pixelWidth "$file" | awk '{print $2}')
        height=$(sips -g pixelHeight "$file" | awk '{print $2}')
        echo "  Original: ${width}x${height}"
        
        # Resize to 1280x800 (maintaining aspect ratio, then crop if needed)
        # First, resize to fit within 1280x800
        sips -Z 800 "$file" --out "$output_file" > /dev/null 2>&1
        
        # Then resize to exact 1280x800 (this will crop if needed)
        sips --resampleHeightWidthMax 800 --setProperty format png --setProperty formatOptions normal "$output_file" --out "$output_file" > /dev/null 2>&1
        
        # Convert to 24-bit PNG (remove alpha channel)
        sips -s format png -s formatOptions normal "$output_file" --out "$output_file" > /dev/null 2>&1
        
        # Get new dimensions
        new_width=$(sips -g pixelWidth "$output_file" | awk '{print $2}')
        new_height=$(sips -g pixelHeight "$output_file" | awk '{print $2}')
        echo "  Resized: ${new_width}x${new_height}"
        
        # Also create JPEG version
        jpeg_file="$OUTPUT_DIR/${filename%.png}_store.jpg"
        sips -s format jpeg -s formatOptions high "$output_file" --out "$jpeg_file" > /dev/null 2>&1
        echo "  Created JPEG: $(basename "$jpeg_file")"
        echo ""
    fi
done

echo "Done! Screenshots are in: $OUTPUT_DIR"
echo ""
echo "Files created:"
ls -lh "$OUTPUT_DIR"
