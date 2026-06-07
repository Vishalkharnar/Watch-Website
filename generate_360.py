import os
from PIL import Image, ImageDraw
import math

OUTPUT_DIR = "V:/NEW/assets/360"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SIZE = 600
CENTER = SIZE // 2
FRAMES = 36

def draw_dial(angle_offset):
    # Create transparent image
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Base dark carbon case
    draw.ellipse((20, 20, SIZE-20, SIZE-20), fill="#121212", outline="#2a2a2a", width=6)
    
    # Outer gold bezel
    draw.ellipse((40, 40, SIZE-40, SIZE-40), outline="#c5a880", width=12)
    
    # Bezel screws (not rotating, they belong to case, wait no, let's rotate the whole watch)
    for i in range(8):
        angle = math.radians(i * 45 + angle_offset)
        dist = (SIZE // 2) - 30
        x = CENTER + math.cos(angle) * dist
        y = CENTER + math.sin(angle) * dist
        draw.ellipse((x-6, y-6, x+6, y+6), fill="#888888")
        # screw slot
        draw.line((x-4, y-4, x+4, y+4), fill="#333333", width=2)
        
    # Inner dark dial
    draw.ellipse((60, 60, SIZE-60, SIZE-60), fill="#0b0b0c")
    
    # Inner mechanics (gears)
    for i in range(12):
        angle = math.radians(i * 30 - angle_offset * 1.5) # counter rotate
        dist = 120
        x = CENTER + math.cos(angle) * dist
        y = CENTER + math.sin(angle) * dist
        draw.ellipse((x-30, y-30, x+30, y+30), outline="#444", width=4)
        draw.line((CENTER, CENTER, x, y), fill="#333", width=2)
        
    # Central tourbillon bridge
    bridge_angle = math.radians(angle_offset * 2)
    bx1 = CENTER + math.cos(bridge_angle) * 150
    by1 = CENTER + math.sin(bridge_angle) * 150
    bx2 = CENTER + math.cos(bridge_angle + math.pi) * 150
    by2 = CENTER + math.sin(bridge_angle + math.pi) * 150
    draw.line((bx1, by1, bx2, by2), fill="#c5a880", width=16)
    
    # Center jewel
    draw.ellipse((CENTER-15, CENTER-15, CENTER+15, CENTER+15), fill="#ff0055")
    
    # Hour indices
    for i in range(12):
        angle = math.radians(i * 30 + angle_offset)
        r1 = (SIZE // 2) - 60
        r2 = (SIZE // 2) - 80
        x1 = CENTER + math.cos(angle) * r1
        y1 = CENTER + math.sin(angle) * r1
        x2 = CENTER + math.cos(angle) * r2
        y2 = CENTER + math.sin(angle) * r2
        draw.line((x1, y1, x2, y2), fill="#ffffff", width=6)
        
    # Hands (pointing to 10:10) - hands should rotate with the watch body!
    hour_angle = math.radians(300 + angle_offset)
    min_angle = math.radians(60 + angle_offset)
    
    hx = CENTER + math.cos(hour_angle) * 130
    hy = CENTER + math.sin(hour_angle) * 130
    draw.line((CENTER, CENTER, hx, hy), fill="#c5a880", width=12)
    
    mx = CENTER + math.cos(min_angle) * 190
    my = CENTER + math.sin(min_angle) * 190
    draw.line((CENTER, CENTER, mx, my), fill="#ffffff", width=8)

    return img

print("Generating 360 sequence (36 frames)...")
for frame in range(FRAMES):
    # Rotate by 10 degrees each frame
    degrees = frame * (360 / FRAMES)
    img = draw_dial(degrees)
    filename = f"frame_{frame + 1:02d}.png"
    img.save(os.path.join(OUTPUT_DIR, filename))
    if frame % 9 == 0:
        print(f"Generated {filename}")

print("Done! Generated 36 images in assets/360/")
