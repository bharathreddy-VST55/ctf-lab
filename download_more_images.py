
import requests
import time
import os
import json

CHARACTERS = [
    # Straw Hats (Already have most, ensuring complete)
    {"name": "Monkey D. Luffy", "filename": "luffy.jpg"},
    {"name": "Roronoa Zoro", "filename": "zoro.jpg"},
    {"name": "Vinsmoke Sanji", "filename": "sanji.jpg"},
    {"name": "Nami", "filename": "nami.jpg"},
    {"name": "Usopp", "filename": "usopp.jpg"},
    {"name": "Tony Tony Chopper", "filename": "chopper.jpg"},
    {"name": "Nico Robin", "filename": "robin.jpg"},
    {"name": "Franky", "filename": "franky.jpg"},
    {"name": "Brook", "filename": "brook.jpg"},
    {"name": "Jinbe", "filename": "jinbe.jpg"},
    
    # Marines
    {"name": "Sakazuki", "filename": "akainu.jpg"}, # Akainu
    {"name": "Borsalino", "filename": "kizaru.jpg"}, # Kizaru
    {"name": "Kuzan", "filename": "aokiji.jpg"}, # Aokiji
    {"name": "Monkey D. Garp", "filename": "garp.jpg"},
    {"name": "Sengoku", "filename": "sengoku.jpg"},
    {"name": "Smoker", "filename": "smoker.jpg"},
    {"name": "Tashigi", "filename": "tashigi.jpg"},
    {"name": "Koby", "filename": "koby.jpg"},
    {"name": "Fujitora", "filename": "fujitora.jpg"},
    {"name": "Ryokugyu", "filename": "ryokugyu.jpg"}
]

os.makedirs("public/images", exist_ok=True)

def fetch_image(char_name, filename):
    if os.path.exists(f"public/images/{filename}"):
        print(f"Skipping {char_name}, already exists.")
        return

    print(f"Searching for {char_name}...")
    try:
        # Search Jikan API
        search_url = f"https://api.jikan.moe/v4/characters?q={char_name}&limit=1"
        resp = requests.get(search_url)
        data = resp.json()
        
        if "data" in data and len(data["data"]) > 0:
            image_url = data["data"][0]["images"]["jpg"]["image_url"]
            print(f"Found URL: {image_url}")
            
            # Download Image
            img_data = requests.get(image_url).content
            with open(f"public/images/{filename}", 'wb') as f:
                f.write(img_data)
            print(f"Saved to public/images/{filename}")
            return True
        else:
            print(f"No results for {char_name}")
            return False
            
    except Exception as e:
        print(f"Error fetching {char_name}: {e}")
        return False

for char in CHARACTERS:
    fetch_image(char["name"], char["filename"])
    time.sleep(1.0) # Rate limit respect

print("Download complete.")
