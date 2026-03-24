import os
import requests
import json
from datetime import datetime

# WhatsApp notification message
message = """🚨 JMUX UPDATE — Mar 24 @ 11:43 AM EDT

✅ NSP Hicksville Equipment Wiring — COMPLETED TODAY (03/24)
Equipment now ready for Nokia configuration. Critical blocker resolved.

📚 Nokia Training Courses Selected with Shelton
Awaiting confirmed dates from Glenn Leaming (back 03/25)
Final confirmation expected by 03/27

📎 Revised one-pager attached to email (PRJ13797_JMUX_OnePager_Mar24.pptx)

— Sachi"""

print("JMUX Update notification prepared and ready to send")
print(f"Timestamp: {datetime.now().isoformat()}")
print(f"Message length: {len(message)} chars")
