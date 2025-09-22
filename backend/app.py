import os
import requests
from flask import Flask, redirect, request, jsonify
from dotenv import load_dotenv
from urllib.parse import urlencode
from flask_cors import CORS

load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")
FRONTEND_URL = "http://localhost:3000"

AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE_URL = "https://api.spotify.com/v1/"

app = Flask(__name__)
CORS(app) # Ya no necesitamos credentials, pero CORS sigue siendo necesario

@app.route('/login')
def login():
    params = {
        'client_id': SPOTIPY_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': SPOTIPY_REDIRECT_URI,
        'scope': 'user-read-private user-read-email user-top-read',
    }
    auth_url = f"{AUTH_URL}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    req_body = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': SPOTIPY_REDIRECT_URI,
        'client_id': SPOTIPY_CLIENT_ID,
        'client_secret': SPOTIPY_CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()
    
    access_token = token_info['access_token']

    # ¡GRAN CAMBIO! Pasamos el token al frontend a través de la URL
    return redirect(f"{FRONTEND_URL}/dashboard#token={access_token}")

@app.route('/dashboard-data')
def dashboard_data():
    # ¡GRAN CAMBIO! Leemos el token desde el encabezado de la petición
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Authorization header faltante'}), 401
    
    access_token = auth_header.split(" ")[1]
    if not access_token:
        return jsonify({'error': 'Token faltante'}), 401

    headers = {'Authorization': f'Bearer {access_token}'}
    params = {'time_range': 'long_term', 'limit': 10}
    
    tracks_response = requests.get(f'{API_BASE_URL}me/top/tracks', headers=headers, params=params)
    artists_response = requests.get(f'{API_BASE_URL}me/top/artists', headers=headers, params=params)
    
    tracks_data = tracks_response.json()
    artists_data = artists_response.json()

    return jsonify({
        'tracks': tracks_data.get('items', []),
        'artists': artists_data.get('items', [])
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)