import requests

# Replace with your actual base URL
base_url = "http://localhost:3000"
endpoint = f"{base_url}/playlists"

# Sample playlist data
sample_playlists = [
    {
        "name": "Best Songs 2025",
        "creatorId": 1,
        "trackIds": [1, 2]
    },
    {
        "name": "Chill Vibes",
        "creatorId": 2,
        "trackIds": [3, 4, 5]
    },
    {
        "name": "Workout Anthems",
        "creatorId": 3,
        "trackIds": [6, 7, 8]
    },
    {
        "name": "Late Night Jams",
        "creatorId": 1,
        "trackIds": [9, 10]
    },
    {
        "name": "Summer Hits",
        "creatorId": 2,
        "trackIds": [11, 12, 13]
    }
]

# POST each playlist
for playlist in sample_playlists:
    try:
        response = requests.post(endpoint, json=playlist)
        if response.status_code == 201:
            print(f"✅ Playlist '{playlist['name']}' created successfully.")
        else:
            print(f"❌ Failed to create playlist '{playlist['name']}': {response.status_code} - {response.text}")
    except Exception as e:
        print(f"⚠️ Error creating playlist '{playlist['name']}': {e}")
