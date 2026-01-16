#!/bin/bash
# ⚡ Bolt: CSS Bundler
# This script concatenates multiple CSS files into a single bundle to reduce HTTP requests.
# The order is critical for correct styling.

# Ensure the script is run from the repository root
if [ ! -f "index.html" ]; then
    echo "Please run this script from the repository root."
    exit 1
fi

# Define the output file
OUTPUT_FILE="css/bundle.css"

# List of CSS files to bundle, in order
FILES_TO_BUNDLE=(
    "css/animate.css"
    "css/icomoon.css"
    "css/bootstrap.css"
    "css/flexslider.css"
    "css/owl.carousel.min.css"
    "css/owl.theme.default.min.css"
    "css/style.css"
    "css/custom.css"
)

# Create/clear the output file
> "$OUTPUT_FILE"

# Concatenate each file into the bundle
for file in "${FILES_TO_BUNDLE[@]}"; do
    if [ -f "$file" ]; then
        echo "/* --- Appending $file --- */" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n" >> "$OUTPUT_FILE"
    else
        echo "Warning: $file not found. Skipping."
    fi
done

echo "✅ CSS bundle created successfully at $OUTPUT_FILE"
