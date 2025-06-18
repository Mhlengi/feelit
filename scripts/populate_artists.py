import requests

# Define your base URL
base_url = "http://localhost:3000"  # Change if needed
endpoint = f"{base_url}/users"  # Or /artists if that's your endpoint

# Sample artist data
sample_artists = [
    {
        "email": "chris2.brown@gmail.com",
        "username": "chris_brown2",
        "password": "Passw0rd!",
        "firstName": "Chris",
        "lastName": "Brown",
        "role": "artist"
    },
    {
        "email": "adele.music@gmail.com",
        "username": "adele_uk",
        "password": "SingIt2025!",
        "firstName": "Adele",
        "lastName": "Adkins",
        "role": "artist"
    },
    {
        "email": "kendrick.lamar@gmail.com",
        "username": "kendrick_l",
        "password": "Humble@2025",
        "firstName": "Kendrick",
        "lastName": "Lamar",
        "role": "artist"
    },
    {
        "email": "rihanna.nav@gmail.com",
        "username": "rihanna_fenty",
        "password": "Diamonds#123",
        "firstName": "Rihanna",
        "lastName": "Fenty",
        "role": "artist"
    },
    {
        "email": "john.mayer@gmail.com",
        "username": "john_mayer",
        "password": "Gravity!2025",
        "firstName": "John",
        "lastName": "Mayer",
        "role": "artist"
    }
]

# Post each artist to the API
for artist in sample_artists:
    try:
        response = requests.post(endpoint, json=artist)
        if response.status_code == 201:
            print(f"✅ Created artist: {artist['username']}")
        else:
            print(f"❌ Failed to create {artist['username']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"🚨 Exception for {artist['username']}: {e}")
