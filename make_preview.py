"""
Create a small preview MP4 from generated 360 frames.
Usage:
  1. Ensure frames exist in `assets/360/frame_01.png` ... `frame_36.png`.
  2. Install dependencies: `pip install -r requirements.txt`.
  3. Run: `python make_preview.py`.

This script uses moviepy to assemble an MP4 (H.264) at low bitrate for a small demo.
"""

import os
from moviepy.editor import ImageSequenceClip

FRAMES_DIR = os.path.join(os.path.dirname(__file__), 'assets', '360')
OUTPUT = os.path.join(FRAMES_DIR, 'preview.mp4')
FPS = 12
BITRATE = '500k'

# collect frames
frames = []
for i in range(1, 100):
    fname = f'frame_{i:02d}.png'
    path = os.path.join(FRAMES_DIR, fname)
    if os.path.exists(path):
        frames.append(path)
    else:
        break

if not frames:
    print('No frames found in', FRAMES_DIR)
    print('Run generate_360.py first to create frame_01..frame_36.png')
    raise SystemExit(1)

print(f'Creating preview from {len(frames)} frames -> {OUTPUT}')
clip = ImageSequenceClip(frames, fps=FPS)
clip.write_videofile(OUTPUT, codec='libx264', bitrate=BITRATE, audio=False, threads=0)
print('Done:', OUTPUT)
