# Sachi Keystore Secrets
**KEEP THIS PRIVATE — DO NOT SHARE**

## Keystore File
- File: `sachi-upload-key.jks`
- Location: `/app/sachi-upload-key.jks`

## GitHub Secrets (for build-signed-aab.yml workflow)
- **KEYSTORE_PASSWORD:** Sachi2026!
- **KEY_ALIAS:** upload
- **KEY_PASSWORD:** Sachi2026!
- **KEYSTORE_BASE64:** (generated from sachi-upload-key.jks via base64)

## Notes
- If build fails with wrong password, try: sachi2026, Sachi2026, ldna2026
- Keystore created for Google Play upload signing
- App package: com.ldna.sachi
- Repo: github.com/djaygnz27/athavid-android
