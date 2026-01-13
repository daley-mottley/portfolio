#!/bin/bash
# This script bundles all the CSS files into a single file to reduce HTTP requests.
cat css/animate.css \
    css/icomoon.css \
    css/bootstrap.css \
    css/flexslider.css \
    css/owl.carousel.min.css \
    css/owl.theme.default.min.css \
    css/style.css \
    css/custom.css > css/bundle.css
