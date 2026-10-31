#!/bin/sh
# out/demo.mp4 → ../docs/demo.gif (README용). 크기를 줄이려고 960px, 초당 15장, 색 128개로 만든다.
set -e
IN=${1:-out/demo.mp4}
OUT=${2:-../docs/demo.gif}
W=${GIF_WIDTH:-960}
FPS=${GIF_FPS:-15}
ffmpeg -y -v error -i "$IN" -vf "fps=$FPS,scale=$W:-1:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" out/palette.png
ffmpeg -y -v error -i "$IN" -i out/palette.png -lavfi "fps=$FPS,scale=$W:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" "$OUT"
ls -lh "$OUT"
