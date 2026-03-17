import os
import requests

def run():
    token = os.environ.get("GMAIL_ACCESS_TOKEN")
    if not token:
        print("No token")
        return
    url = "https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=2365408&historyTypes=messageAdded"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers)
    print(resp.json())

if __name__ == "__main__":
    run()
