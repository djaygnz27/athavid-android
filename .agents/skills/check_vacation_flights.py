#!/usr/bin/env python3
import json
import urllib.request
import urllib.parse
import re

def check_flight(origin, destination, dates):
    # Simplified search query for Google Flights
    query = f"flights from {origin} to {destination} {dates}"
    url = f"https://www.google.com/search?q={urllib.parse.quote(query)}"
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            # Look for price patterns
            prices = re.findall(r'\$[\s]?(\d{1,4}(?:,\d{3})?)', html)
            # Find the lowest reasonable price
            valid_prices = []
            for p in prices:
                val = int(p.replace(',', ''))
                if 100 <= val <= 1000: # Looking for under 400
                    valid_prices.append(val)
            return min(valid_prices) if valid_prices else None
    except Exception:
        return None

trips = [
    ("EWR", "NAS", "May 23-25"),
    ("EWR", "NAS", "Jun 19-21"),
    ("EWR", "NAS", "Jul 3-6"),
    ("EWR", "NAS", "Sep 5-7"),
    ("EWR", "NAS", "Oct 10-12"),
    ("EWR", "NAS", "Nov 11-13"),
    ("EWR", "AUA", "May 23-25"),
    ("EWR", "AUA", "Jun 19-21"),
    ("EWR", "AUA", "Jul 3-6"),
    ("EWR", "AUA", "Sep 5-7"),
    ("EWR", "AUA", "Oct 10-12"),
    ("EWR", "AUA", "Nov 11-13")
]

results = []
for trip in trips:
    price = check_flight(trip[0], trip[1], trip[2])
    if price and price <= 400:
        results.append({"dest": trip[1], "dates": trip[2], "price": price})

if results:
    msg = "Found flight deals for your long weekends! 🎉\n"
    for r in results:
        msg += f"- {r['dest']} ({r['dates']}): ${r['price']}/person\n"
    print(msg)
else:
    print("Checked weekend flights, no deals under $400/person today.")
