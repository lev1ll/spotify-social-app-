# ... (Todas las importaciones y configuraciones iniciales se mantienen) ...
import os
import requests
# ... (el resto de importaciones) ...
from flask import Flask, redirect, request, jsonify
from dotenv import load_dotenv
from urllib.parse import urlencode, quote
from flask_cors import CORS

load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")
FRONTEND_URL = "http://localhost:3000"

# ... (El resto de constantes se mantienen) ...
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE_URL = "https://api.spotify.com/v1/"

app = Flask(__name__)
CORS(app)

# ... (Las rutas /login, /callback, /dashboard-data y /search se mantienen igual) ...
@app.route('/login')
def login():
    # ... (código sin cambios) ...
    params = { 'client_id': SPOTIPY_CLIENT_ID, 'response_type': 'code', 'redirect_uri': SPOTIPY_REDIRECT_URI, 'scope': 'user-read-private user-read-email user-top-read', }
    auth_url = f"{AUTH_URL}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    # ... (código sin cambios) ...
    code = request.args.get('code')
    req_body = { 'grant_type': 'authorization_code', 'code': code, 'redirect_uri': SPOTIPY_REDIRECT_URI, 'client_id': SPOTIPY_CLIENT_ID, 'client_secret': SPOTIPY_CLIENT_SECRET }
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()
    access_token = token_info['access_token']
    return redirect(f"{FRONTEND_URL}/dashboard#token={access_token}")

@app.route('/dashboard-data')
def dashboard_data():
    # ... (código sin cambios) ...
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'No autorizado'}), 401
    access_token = auth_header.split(" ")[1]
    headers = {'Authorization': f'Bearer {access_token}'}
    params = {'time_range': 'long_term', 'limit': 10}
    tracks_response = requests.get(f'{API_BASE_URL}me/top/tracks', headers=headers, params=params)
    artists_response = requests.get(f'{API_BASE_URL}me/top/artists', headers=headers, params=params)
    return jsonify({ 'tracks': tracks_response.json().get('items', []), 'artists': artists_response.json().get('items', []) })

@app.route('/search')
def search():
    # ... (código sin cambios) ...
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'No autorizado'}), 401
    access_token = auth_header.split(" ")[1]
    query = request.args.get('q')
    if not query: return jsonify({'error': 'Falta el parámetro de búsqueda "q"'}), 400
    headers = {'Authorization': f'Bearer {access_token}'}
    search_url = f"{API_BASE_URL}search?q={quote(query)}&type=album&limit=10"
    response = requests.get(search_url, headers=headers)
    if response.status_code != 200: return jsonify({'error': 'Error en la búsqueda de Spotify'}), response.status_code
    return jsonify(response.json())

# --- ¡NUEVA RUTA! ---
@app.route('/album-tracks/<album_id>')
def get_album_tracks(album_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'No autorizado'}), 401
    access_token = auth_header.split(" ")[1]

    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Hacemos la petición al endpoint de Spotify para obtener las canciones de un álbum
    response = requests.get(f'{API_BASE_URL}albums/{album_id}/tracks', headers=headers)

    if response.status_code != 200:
        return jsonify({'error': 'Error al obtener las canciones del álbum'}), response.status_code
    
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True, port=5000)