import numpy as np
from PIL import Image

def clean_logo(input_path, output_path):
    # Load image
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img)
    
    # 1. Crop 40 pixels from all edges to definitely remove any border frame
    h, w, c = arr.shape
    crop_pixels = 40
    arr = arr[crop_pixels:h-crop_pixels, crop_pixels:w-crop_pixels]
    
    # 2. Make near-white completely transparent
    # pixels where R, G, B are all > 210
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    near_white = (r > 210) & (g > 210) & (b > 210)
    arr[near_white, 3] = 0
    
    # Make light-gray transparent (RGB close to each other and bright)
    light_gray = (np.abs(r.astype(int) - g.astype(int)) < 15) & (np.abs(r.astype(int) - b.astype(int)) < 15) & (r > 180)
    arr[light_gray, 3] = 0
    
    # 3. Crop to bounding box
    non_empty_columns = np.where(arr[:,:,3].max(axis=0) > 0)[0]
    non_empty_rows = np.where(arr[:,:,3].max(axis=1) > 0)[0]
    
    if len(non_empty_columns) > 0 and len(non_empty_rows) > 0:
        crop_box = (min(non_empty_rows), max(non_empty_rows), min(non_empty_columns), max(non_empty_columns))
        arr = arr[crop_box[0]:crop_box[1]+1, crop_box[2]:crop_box[3]+1]
        
    final_img = Image.fromarray(arr)
    final_img.save(output_path, "PNG")
    print(f"Saved {output_path} Cleaned up.")

clean_logo('logo-horizontal.jpg', 'logo-horizontal.png')
