import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base_url
TRACKS_ENDPOINT = f"{BASE_URL}/tracks"

# Sample real-world track data
tracks = [
    {
        "name": "I Got You (I Feel Good)",
        "userId": 1,
        "duration": 170,
        "genre": "Soul",
        "releaseDate": "1965-08-01",
        "artwork": "https://example.com/artwork/i-got-you.jpg",
        "audio": "https://example.com/audio/i-got-you.mp3",
        "albumId": 1
    },
    {
        "name": "Rolling in the Deep",
        "userId": 1,
        "duration": 228,
        "genre": "Pop",
        "releaseDate": "2010-11-29",
        "artwork": "https://example.com/artwork/rolling-deep.jpg",
        "audio": "https://example.com/audio/rolling-deep.mp3",
        "albumId": 1
    },
    {
        "name": "HUMBLE.",
        "userId": 3,
        "duration": 177,
        "genre": "Hip-Hop",
        "releaseDate": "2017-03-30",
        "artwork": "https://example.com/artwork/humble.jpg",
        "audio": "https://example.com/audio/humble.mp3",
        "albumId": 2
    },
    {
        "name": "Diamonds",
        "userId": 4,
        "duration": 231,
        "genre": "Pop",
        "releaseDate": "2012-09-26",
        "artwork": "https://example.com/artwork/diamonds.jpg",
        "audio": "https://example.com/audio/diamonds.mp3",
        "albumId": 2
    },
    {
        "name": "Gravity",
        "userId": 5,
        "duration": 245,
        "genre": "Blues Rock",
        "releaseDate": "2006-09-12",
        "artwork": "https://example.com/artwork/gravity.jpg",
        "audio": "https://example.com/audio/gravity.mp3",
        "albumId": 3
    }
]

# Send tracks to the system
for track in tracks:
    try:
        response = requests.post(TRACKS_ENDPOINT, json=track)
        if response.status_code == 201:
            print(f"✅ Successfully added: {track['name']}")
        else:
            print(f"❌ Failed to add {track['name']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"🔥 Error posting {track['name']}: {e}")
