#!/bin/bash
# ⚡ Bolt: JavaScript Bundler
# This script concatenates multiple JS files into a single bundle to reduce HTTP requests.
# The order is critical for correct functionality, especially for jQuery plugins.

# Ensure the script is run from the repository root
if [ ! -f "index.html" ]; then
    echo "Please run this script from the repository root."
    exit 1
fi

# Define the output file
OUTPUT_FILE="js/bundle.js"

# List of JS files to bundle, in order
# Note: modernizr.js is excluded as it's in the <head>
FILES_TO_BUNDLE=(
    "js/jquery.min.js"
    "js/jquery.easing.1.3.js"
    "js/bootstrap.min.js"
    "js/jquery.waypoints.min.js"
    "js/jquery.flexslider-min.js"
    "js/owl.carousel.min.js"
    "js/jquery.countTo.js"
    "js/main.js"
    "js/i18n.js"
    "js/custom.js"
    "js/preloader.js"
)

# Create/clear the output file
> "$OUTPUT_FILE"

# Concatenate each file into the bundle
for file in "${FILES_TO_BUNDLE[@]}"; do
    if [ -f "$file" ]; then
        echo "/* --- Appending $file --- */" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        # Add a semicolon to prevent issues with file concatenation
        echo -e ";\n" >> "$OUTPUT_FILE"
    else
        echo "Warning: $file not found. Skipping."
    fi
done

echo "✅ JavaScript bundle created successfully at $OUTPUT_FILE"
