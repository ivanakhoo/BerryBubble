from flask import Flask, redirect, request, session, url_for
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')  
CORS(app)


# LinkedIn App Credentials
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
LINKEDIN_API_URL = 'https://api.linkedin.com/v2/me'

@app.route('/')
def home():
    return '<a href="/login">Login with LinkedIn</a>'

@app.route('/login')
def login():
    # Redirect user to LinkedIn for authorization
    params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'scope': 'profile email'  # Correct permissions for LinkedIn OAuth
    }
    auth_url = f"{LINKEDIN_AUTH_URL}?{requests.compat.urlencode(params)}"
    return redirect(auth_url)

@app.route('/auth/callback')
def auth_callback():
    # Get the authorization code from LinkedIn
    code = request.args.get('code')
    if not code:
        return 'Authorization failed.'

    # Exchange the authorization code for an access token
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    token_response = requests.post(LINKEDIN_TOKEN_URL, data=token_data)
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    if not access_token:
        return 'Failed to get access token.'

    session['access_token'] = access_token  # Save token in session
    return redirect(url_for('profile'))

@app.route('/profile')
def profile():
    # Fetch user profile data
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('login'))

    headers = {'Authorization': f'Bearer {access_token}'}
    profile_response = requests.get(LINKEDIN_API_URL, headers=headers)
    profile_data = profile_response.json()

    return f"<h1>Welcome {profile_data.get('localizedFirstName')} {profile_data.get('localizedLastName')}</h1>"

if __name__ == '__main__':
    app.run(debug=True)