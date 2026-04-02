#!/usr/bin/env python3
"""
Check Gmail for Google Play developer account verification approval.
Alerts user when approval is found.
"""

import os
import sys
import json
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.auth.oauthlib.flow import InstalledAppFlow
from google.mail.v1 import gmail_v1
import googleapiclient.discovery as discovery

def get_gmail_service():
    """Get Gmail API service using OAuth token"""
    token = os.getenv('GMAIL_ACCESS_TOKEN')
    if not token:
        print("ERROR: GMAIL_ACCESS_TOKEN not found")
        sys.exit(1)
    
    # Create a simple auth object with the token
    from google.auth.transport.requests import Request
    from google.oauth2 import service_account
    import google.auth
    
    # Use the token directly
    creds = Credentials(token=token)
    service = discovery.build('gmail', 'v1', credentials=creds)
    return service

def check_for_approval():
    """Check Gmail for Google Play verification approval email"""
    try:
        service = get_gmail_service()
        
        # Search for emails from Google (google.com) about verification/approval
        query = 'from:google.com (subject:verification OR subject:approved OR subject:"account has been approved" OR subject:"developer account")'
        
        results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
        messages = results.get('messages', [])
        
        if not messages:
            print("No verification emails found yet")
            return False
        
        # Check the most recent message
        latest = messages[0]
        msg = service.users().messages().get(userId='me', id=latest['id'], format='full').execute()
        headers = msg['payload'].get('headers', [])
        
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'Unknown')
        from_addr = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
        date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
        
        print(f"Found email: {subject}")
        print(f"From: {from_addr}")
        print(f"Date: {date}")
        
        # Check if it's an approval email
        if any(keyword in subject.lower() for keyword in ['approved', 'verified', 'verification complete', 'account activated']):
            print("✅ APPROVAL EMAIL DETECTED!")
            return True
        
        return False
        
    except Exception as e:
        print(f"Error checking Gmail: {e}")
        return False

if __name__ == '__main__':
    if check_for_approval():
        print("ALERT: Google Play developer account has been approved!")
        sys.exit(0)
    else:
        print("Still waiting for approval...")
        sys.exit(1)
