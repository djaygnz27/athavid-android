#!/usr/bin/env python3
"""
Send JMUX project alert notification via WhatsApp and web channels
"""

import os
import sys
import json

def send_jmux_alert():
    """Send the JMUX alert message"""
    
    message = """🚨 **JMUX PROJECT ALERT** — New Meeting Analysis Email (Mar 23, 2:00 PM EDT)

**Subject:** JMUX Project Meeting Analysis — Action Items & Summary

**KEY UPDATES FROM VIC:**

💰 **Labor Costs** — Worst case $150K–$160K
• Confirm exact field rate with Chad ($65 vs $66 vs $70)
• Get Burns & Mac breakdown: relay % vs supervisor % of 1,056 hours
• Ask about overtime vs regular time split
• Can work be scheduled 9-to-5 to avoid OT?
• Confirm Phase 2 vs Phase 3 split & timeline
• Stephen updated: 144 → 150 hours per substation (validate)

📡 **Melville Antenna** — OUT OF SCOPE
• New control center build requires new antenna
• NOT covered under current project scope
• You're implementing 93 sites under original scope
• This becomes a separate project with separate funding
• Action: Document formally & tell Vinny clearly

📊 **CIO Presentation Feedback**
• Add "Deployment & Application Cutover" to Slide 1 Goals
• Slide 2: Clearly distinguish Phase 1 vs Phase 2
• Keep it minimal — 10 minutes is fine
• Vic provided new Status Table format

**Project Status:** Active & on track. Critical next step: BGP Configuration (Mar 24-28). ILO console cables still being sourced.

👉 Full email in your Gmail — jaygnz27@gmail.com"""

    # Print message in structured format for platform to pick up
    notification = {
        "type": "automation_message",
        "message": message,
        "channels": ["web", "whatsapp"],
        "priority": "high",
        "source": "gmail_project_monitor"
    }
    
    print(json.dumps(notification, indent=2))
    return notification

if __name__ == "__main__":
    send_jmux_alert()
