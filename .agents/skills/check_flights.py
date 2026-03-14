#!/usr/bin/env python3
"""
Flight price monitor: Newark (EWR) to Brisbane (BNE)
Checks United Airlines pricing via Google Flights search
"""

import os
import sys
import json
import urllib.request
import urllib.parse

def check_flight_price():
    """Check current flight prices for EWR to BNE in May 2026"""
    
    # We'll scrape Google search results for current pricing
    query = "United Airlines Newark EWR to Brisbane BNE May 2026 round trip price"
    url = f"https://www.google.com/search?q={urllib.parse.quote(query)}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
        # Look for price patterns in the HTML
        import re
        prices = re.findall(r'\$[\s]?(\d{1,4}(?:,\d{3})?)', html)
        
        # Filter to reasonable flight prices (800-3000)
        flight_prices = []
        for p in prices:
            try:
                price = int(p.replace(',', ''))
                if 800 <= price <= 3000:
                    flight_prices.append(price)
            except:
                pass
        
        if flight_prices:
            min_price = min(flight_prices)
            print(json.dumps({
                "status": "success",
                "min_price": min_price,
                "all_prices": sorted(set(flight_prices))[:10],
                "threshold": 1200,
                "alert": min_price < 1200
            }))
        else:
            print(json.dumps({
                "status": "no_prices_found",
                "min_price": None,
                "alert": False
            }))
            
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": str(e),
            "alert": False
        }))

if __name__ == "__main__":
    check_flight_price()
