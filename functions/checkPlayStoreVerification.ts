/**
 * Check Gmail for Google Play developer account verification approval
 * Triggered by automation every 3 hours
 */

export async function checkPlayStoreVerification() {
  try {
    // Get Gmail access token via connector
    const gmailToken = process.env.GMAIL_ACCESS_TOKEN;
    
    if (!gmailToken) {
      return {
        status: "error",
        message: "Gmail token not available",
      };
    }

    // Query Gmail for approval emails from Google
    const query = encodeURIComponent(
      'from:google.com (subject:verification OR subject:approved OR subject:"account has been approved" OR subject:"developer account" OR subject:"identity verified")'
    );

    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=5`,
      {
        headers: {
          Authorization: `Bearer ${gmailToken}`,
        },
      }
    );

    const data = await response.json();
    const messages = data.messages || [];

    if (messages.length === 0) {
      console.log("No verification emails found yet");
      return {
        status: "waiting",
        message: "No approval email detected yet. Keep monitoring...",
      };
    }

    // Get the latest message details
    const latestId = messages[0].id;
    const msgResponse = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${latestId}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${gmailToken}`,
        },
      }
    );

    const msgData = await msgResponse.json();
    const headers = msgData.payload?.headers || [];
    const subject =
      headers.find((h: any) => h.name === "Subject")?.value || "Unknown";
    const from = headers.find((h: any) => h.name === "From")?.value || "Unknown";

    console.log(`Email found: ${subject}`);
    console.log(`From: ${from}`);

    // Check if it's an approval email
    const isApproved = [
      "approved",
      "verified",
      "verification complete",
      "account activated",
      "identity verified",
    ].some((keyword) => subject.toLowerCase().includes(keyword));

    if (isApproved) {
      console.log("✅ APPROVAL DETECTED!");
      
      // Send alert to user via broadcast
      await base44.broadcast({
        message: `🎉 **Google Play Developer Account APPROVED!**\n\nSubject: ${subject}\n\nTime to upload the Sachi AAB to Google Play Console! Download Build #5 from:\ngithub.com/djaygnz27/athavid-android/actions/runs/23868887501\n\nSteps:\n1. Play Console → Sachi app\n2. Production → Releases → Create new release\n3. Upload Sachi-release-aab.aab\n4. Review and publish`,
      });

      return {
        status: "approved",
        message: "Google Play account approved! Alert sent to user.",
        subject,
        from,
      };
    }

    return {
      status: "waiting",
      message: "Email found but not an approval yet.",
      subject,
      from,
    };
  } catch (error: any) {
    console.error("Error checking Gmail:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}
