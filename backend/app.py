from flask import Flask, redirect, request, session, url_for
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')  
CORS(app)

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
LINKEDIN_API_URL = 'https://api.linkedin.com/v2/me'
LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo'

@app.route('/')
def home():
    return '<a href="/login">Login with LinkedIn</a>'

@app.route('/login')
def login():
    params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'scope': 'openid profile email' 
    }
    auth_url = f"{LINKEDIN_AUTH_URL}?{requests.compat.urlencode(params)}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    # Retrieve the authorization code
    code = request.args.get('code')
    if not code:
        return {"error": "No authorization code provided."}, 400

    # Exchange the authorization code for an access token
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    token_response = requests.post(LINKEDIN_TOKEN_URL, data=token_data)
    token_response_data = token_response.json()

    if token_response.status_code != 200 or 'access_token' not in token_response_data:
        return {"error": "Could not retrieve access token."}, 500

    access_token = token_response_data['access_token']

    # Fetch user info from the /userinfo endpoint
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    userinfo_response = requests.get(LINKEDIN_USERINFO_URL, headers=headers)
    userinfo_data = userinfo_response.json()

    if userinfo_response.status_code != 200:
        return {"error": "Could not retrieve user information."}, 500

    # Extract the user's name
    first_name = userinfo_data.get('given_name', 'No first name found')
    last_name = userinfo_data.get('family_name', 'No last name found')

    return redirect(f"http://localhost:5173?first_name={first_name}&last_name={last_name}")

if __name__ == '__main__':
    app.run(debug=True)