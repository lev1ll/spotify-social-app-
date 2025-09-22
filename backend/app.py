import os
import requests
from flask import Flask, redirect, request, jsonify
from dotenv import load_dotenv
from urllib.parse import urlencode, quote # Importamos 'quote'
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
CORS(app)

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
    return redirect(f"{FRONTEND_URL}/dashboard#token={access_token}")

@app.route('/dashboard-data')
def dashboard_data():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'No autorizado'}), 401
    access_token = auth_header.split(" ")[1]

    headers = {'Authorization': f'Bearer {access_token}'}
    params = {'time_range': 'long_term', 'limit': 10}
    
    tracks_response = requests.get(f'{API_BASE_URL}me/top/tracks', headers=headers, params=params)
    artists_response = requests.get(f'{API_BASE_URL}me/top/artists', headers=headers, params=params)
    
    return jsonify({
        'tracks': tracks_response.json().get('items', []),
        'artists': artists_response.json().get('items', [])
    })

# --- ¡NUEVA RUTA! ---
@app.route('/search')
def search():
    # 1. Obtener el token de autorización del frontend
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'No autorizado'}), 401
    access_token = auth_header.split(" ")[1]

    # 2. Obtener el término de búsqueda de la URL (ej: /search?q=daft+punk)
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Falta el parámetro de búsqueda "q"'}), 400

    # 3. Preparar y hacer la petición a la API de búsqueda de Spotify
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Le decimos a Spotify que busque álbumes que contengan el 'query'
    # Usamos 'quote' para asegurarnos de que el texto es seguro para una URL (ej: espacios -> %20)
    search_url = f"{API_BASE_URL}search?q={quote(query)}&type=album&limit=10"
    
    response = requests.get(search_url, headers=headers)
    
    if response.status_code != 200:
        return jsonify({'error': 'Error en la búsqueda de Spotify'}), response.status_code

    # 4. Devolver los resultados en formato JSON
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True, port=5000)