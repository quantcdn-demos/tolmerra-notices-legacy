#!/bin/sh
# Draws the demo site's small GIF images with ImageMagick (run once; the output is kept in git).
set -eu
cd "$(dirname "$0")/../site/assets"
FONT_BOLD="/System/Library/Fonts/Supplemental/Verdana Bold.ttf"
MONO="/System/Library/Fonts/Supplemental/Courier New Bold.ttf"

# Logo: a white ring and a teal water drop on the banner navy.
magick -size 56x56 xc:'#1f3d73' -fill none -stroke white -strokewidth 3 -draw 'circle 28,28 28,4' \
  -stroke none -fill '#7fd3d3' -draw 'path "M 28,12 C 34,22 40,28 40,34 C 40,41 34,46 28,46 C 22,46 16,41 16,34 C 16,28 22,22 28,12 Z"' \
  -fill white -draw 'path "M 22,34 C 22,38 25,41 28,41 L 28,39 C 26,39 24,37 24,34 Z"' twa-logo.gif

# Visitor counter: seven green digits on black cells.
magick -size 91x19 xc:'#000000' -font "$MONO" -pointsize 16 -fill '#33ff33' -gravity center -annotate +0+1 '0042817' \
  -stroke '#555555' -fill none -draw 'rectangle 0,0 90,18' counter.gif

# NEW! badge.
magick -size 28x11 xc:'#cc0000' -font "$FONT_BOLD" -pointsize 8 -fill white -gravity center -annotate +0+0 'NEW!' new.gif

# Twisties: right (collapsed) and down (expanded).
magick -size 11x11 xc:none -fill '#2b9a9a' -draw 'polygon 3,1 8,5 3,9' expand.gif
magick -size 11x11 xc:none -fill '#2b9a9a' -draw 'polygon 1,3 9,3 5,8' collapse.gif

# Spacer.
magick -size 1x1 xc:none ecblank.gif

# View icon: a small page with lines.
magick -size 13x11 xc:none -fill white -stroke '#6b7f99' -draw 'rectangle 2,0 10,10' -stroke '#4a78b0' \
  -draw 'line 4,3 8,3' -draw 'line 4,5 8,5' -draw 'line 4,7 7,7' vwicn004.gif

# Attachment icon: a page with a red band.
magick -size 16x16 xc:none -fill white -stroke '#6b7f99' -draw 'rectangle 3,1 12,14' -stroke none -fill '#cc2222' \
  -draw 'rectangle 4,9 11,12' fileatt.gif
