import sys
from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=240):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is white or near white
        # item is (R, G, B, A)
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            # Change all white (also shades of whites)
            # pixels to transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Optionally crop to bounding box of non-transparent areas
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved {output_path} with transparent background.")

remove_white_bg('logo-horizontal.jpg', 'logo-horizontal.png', tolerance=245)
