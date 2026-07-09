#!/usr/bin/env python3
"""
Google Analytics 4 Authentication Utility for Pomegroup Studio
Launches local OAuth 2.0 flow to authorize access to GA4 and saves credentials/token.json.
"""

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WEBSITE_DIR = os.path.dirname(SCRIPT_DIR)
CLIENT_SECRETS_PATH = os.path.join(WEBSITE_DIR, "credentials", "client_secrets.json")
TOKEN_PATH = os.path.join(WEBSITE_DIR, "credentials", "token.json")

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

def main():
    if not os.path.exists(CLIENT_SECRETS_PATH):
        print(f"❌ Error: client_secrets.json not found at {CLIENT_SECRETS_PATH}")
        print("Please copy your client_secrets.json to the credentials/ directory.")
        return

    print("🔑 Initializing Google Analytics 4 OAuth Flow...")
    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_PATH,
        scopes=SCOPES
    )
    
    # Run the local server on port 8085 (redirect URI in client_secrets.json is http://localhost)
    print("\nStarting local server on http://localhost:8085...")
    print("Please open the URL that appears below in your browser and authorize the application.")
    
    try:
        creds = flow.run_local_server(
            host="localhost",
            port=8085,
            authorization_prompt_message="Go to the following link in your browser: {url}",
            success_message="Success! You can close this window now.",
            open_browser=True
        )
        
        # Ensure credentials directory exists
        os.makedirs(os.path.dirname(TOKEN_PATH), exist_ok=True)
        
        # Save the credentials to token.json
        print("\nSaving credentials to credentials/token.json...")
        with open(TOKEN_PATH, "w") as f:
            f.write(creds.to_json())
            
        print("✅ Successfully updated credentials/token.json! Google Analytics is now connected.")
    except Exception as e:
        print(f"❌ Error during authentication: {e}")
        print("Tip: Make sure you have 'google-auth-oauthlib' installed: pip install google-auth-oauthlib")

if __name__ == "__main__":
    main()
