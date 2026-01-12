#!/bin/bash
# This script concatenates the CSS files in the correct order to create a bundled version.
cat css/animate.css css/icomoon.css css/bootstrap.css css/flexslider.css css/owl.carousel.min.css css/owl.theme.default.min.css css/style.css css/custom.css > css/bundle.css
echo "CSS bundle created successfully at css/bundle.css"
