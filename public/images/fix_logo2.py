import sys
from PIL import Image

def clean_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Crop 40 pixels from all edges to definitely remove any border frame
    w, h = img.size
    img = img.crop((40, 40, w - 40, h - 40))
    
    # 2. Make near-white completely transparent
    datas = img.getdata()
    newData = []
    for item in datas:
        r, g, b, a = item
        # If it's very light (near white) or light gray, make it transparent
        if r > 210 and g > 210 and b > 210:
            newData.append((255, 255, 255, 0))
        # Optional: also remove exact match light grays if they exist
        elif abs(r-g) < 15 and abs(r-b) < 15 and r > 180:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # 3. Crop to the new bounding box of actual visible elements
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved {output_path} Cleaned up.")

clean_logo('logo-horizontal.jpg', 'logo-horizontal.png')
