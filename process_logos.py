from PIL import Image
import os

def process_logo(input_path, output_path, is_icon=False):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is near-white (background artifact), make it transparent
        if r > 240 and g > 240 and b > 240:
            new_data.append((255, 255, 255, 0))
        elif r > 220 and g > 220 and b > 220:
            # Feather the edges
            alpha = int((255 - ((r + g + b) / 3)) * (a / 255) * 3)
            alpha = max(0, min(255, alpha))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    
    # Save optimized transparent PNG
    img.save(output_path, "PNG")
    print(f"Successfully processed: {output_path}")

# Output into Next.js public directory
os.makedirs("storefront/public", exist_ok=True)
process_logo("logo.png", "storefront/public/younoya_logo.png")
process_logo("small_logo.png", "storefront/public/younoya_icon.png", is_icon=True)
process_logo("small_logo.png", "storefront/src/app/favicon.ico", is_icon=True)
