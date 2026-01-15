#!/bin/bash
# This script bundles all necessary CSS files into a single file for performance.

# The order is important, based on index.html
cat css/animate.css \
    css/icomoon.css \
    css/bootstrap.css \
    css/flexslider.css \
    css/owl.carousel.min.css \
    css/owl.theme.default.min.css \
    css/style.css \
    css/custom.css \
    > css/bundle.css
