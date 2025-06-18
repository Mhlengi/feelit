import requests

# Base URL of your API
base_url = "http://localhost:3000"  # Change this to match your system's base URL
endpoint = f"{base_url}/albums"

# Sample album data to post
albums = [
    {
        "name": "Live at the Apollo",
        "releaseDate": "1963-05-01",
        "artistId": 2
    },
    {
        "name": "21",
        "releaseDate": "2011-01-24",
        "artistId": 3
    },
    {
        "name": "To Pimp a Butterfly",
        "releaseDate": "2015-03-15",
        "artistId": 4
    },
    {
        "name": "ANTI",
        "releaseDate": "2016-01-28",
        "artistId": 5
    },
    {
        "name": "Continuum",
        "releaseDate": "2006-09-12",
        "artistId": 6
    }
]

# Loop through each album and post to the API
for album in albums:
    try:
        response = requests.post(endpoint, json=album)
        if response.status_code == 201:
            print(f"✅ Album '{album['name']}' created successfully.")
        else:
            print(f"❌ Failed to create '{album['name']}': {response.status_code} - {response.text}")
    except Exception as e:
        print(f"🚨 Exception while creating '{album['name']}': {e}")
