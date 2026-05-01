# SACHI STREAM — Entity Schemas for New App
# Paste each schema into Base44 entity editor when recreating entities
# Auto-generated fields (id, created_date, updated_date, created_by) are excluded — Base44 adds these automatically
# All fields are optional unless marked REQUIRED

---

## 1. User (built-in — add extra fields only)
Base44 User entity has built-in: email, full_name, role
Add these extra fields:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| username | string | — | Unique handle |
| display_name | string | — | Display name |
| bio | string | — | Profile bio |
| avatar_url | string | — | CDN URL |
| phone | string | — | |
| date_of_birth | string | — | ISO date |
| is_verified | boolean | — | Blue check |
| is_18_plus | boolean | — | Age gate |
| location | string | — | City, Country |
| followers_count | number | — | Denormalized |
| following_count | number | — | Denormalized |
| videos_count | number | — | Denormalized |
| status | string | enum: active, suspended, pending_verification | |
| post_country | string | — | |
| post_region | string | — | |
| post_city | string | — | |

---

## 2. SachiVideo
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| display_name | string | — | Denormalized |
| avatar_url | string | — | Denormalized |
| video_url | string | — | Cloudflare Stream URL |
| thumbnail_url | string | — | |
| caption | string | — | Post text |
| hashtags | array(string) | — | |
| likes_count | number | — | |
| comments_count | number | — | |
| views_count | number | — | |
| shares_count | number | — | |
| hype_count | number | — | Hype reactions |
| is_archived | boolean | — | Soft delete |
| is_ai_detected | boolean | — | AI moderation flag |
| is_approved | boolean | — | Default true |
| archive_date | string | — | ISO datetime |
| duration_seconds | number | — | |
| sound_title | string | — | |
| sound_artist | string | — | |
| sound_url | string | — | |
| is_mature | boolean | — | 18+ content |
| mature_reason | string | — | |
| is_photo | boolean | — | Photo carousel post |
| photo_urls | array(string) | — | For photo posts |
| post_country | string | — | |
| post_region | string | — | |
| post_city | string | — | |
| post_location_name | string | — | |
| post_visibility | string | enum: public, followers, private | |
| is_text_post | boolean | — | Text-only post |
| annotations | array(object) | — | [{time: 3.5, text: "hello!"}] |

---

## 3. SachiComment
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| video_id | string | — | FK → SachiVideo.id |
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| avatar_url | string | — | Denormalized |
| comment_text | string | — | |
| likes_count | number | — | |
| thumbs_up | number | — | |
| hearts | number | — | |
| thumbs_down | number | — | |
| emoji_reactions | object | — | {emoji: count} map |
| replies | array | — | Nested reply array |
| parent_id | string | — | FK → SachiComment.id (self-ref, for threading) |

---

## 4. Follow
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| follower_id | string | — | FK → User.id |
| follower_username | string | — | Denormalized |
| following_id | string | — | FK → User.id |
| following_username | string | — | Denormalized |

---

## 5. SachiPodcast
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| title | string | — | |
| host_name | string | — | Denormalized |
| host_user_id | string | — | FK → User.id |
| host_username | string | — | Denormalized |
| host_avatar_url | string | — | Denormalized |
| description | string | — | |
| category | string | enum: News & Politics, Business, True Crime, Comedy, Sports, Technology, Health & Wellness, Society & Culture, Entertainment, Education, Other | |
| cover_image_url | string | — | |
| is_live | boolean | — | Currently streaming |
| live_stream_url | string | — | HLS playback URL |
| listener_count | number | — | |
| episode_count | number | — | |
| follower_count | number | — | |
| status | string | enum: Active, Inactive, Pending | |
| cf_input_id | string | — | Cloudflare Stream input UID |
| rtmp_url | string | — | RTMP ingest URL |
| stream_key | string | — | ⚠️ Sensitive — RTMP stream key |

---

## 6. SachiPodcastEpisode
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| podcast_id | string | — | FK → SachiPodcast.id |
| title | string | — | |
| description | string | — | |
| audio_url | string | — | |
| video_url | string | — | |
| thumbnail_url | string | — | |
| duration_seconds | number | — | |
| is_live | boolean | — | |
| live_stream_url | string | — | |
| listener_count | number | — | |
| like_count | number | — | |
| comment_count | number | — | |
| episode_number | number | — | |
| status | string | enum: Live, Recorded, Scheduled, Draft | |

---

## 7. SachiLike
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| video_id | string | — | FK → SachiVideo.id |
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| display_name | string | — | Denormalized |
| avatar_url | string | — | Denormalized |

---

## 8. SachiHype
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| video_id | string | — | FK → SachiVideo.id |
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |

---

## 9. SachiBookmark
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| video_id | string | — | FK → SachiVideo.id |

---

## 10. SachiBlock
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| blocker_id | string | — | FK → User.id |
| blocker_username | string | — | Denormalized |
| blocked_id | string | — | FK → User.id |
| blocked_username | string | — | Denormalized |

---

## 11. SachiReport
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| video_id | string | — | FK → SachiVideo.id |
| reporter_id | string | — | FK → User.id |
| reporter_username | string | — | Denormalized |
| video_caption | string | — | Snapshot of reported caption |
| video_username | string | — | Snapshot of reported creator |
| reason | string | — | |
| status | string | enum: pending, reviewed, dismissed, actioned | Default: pending |
| notes | string | — | Moderator notes |

---

## 12. SachiNotification
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| recipient_id | string | — | FK → User.id |
| sender_id | string | — | FK → User.id |
| sender_username | string | — | Denormalized |
| sender_avatar | string | — | Denormalized |
| type | string | enum: like, comment, follow, mention, hype, gift, live | |
| video_id | string | — | FK → SachiVideo.id (nullable) |
| video_thumbnail | string | — | Snapshot |
| text | string | — | Notification body |
| is_read | boolean | — | Default false |

---

## 13. SachiMessage
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| sender_id | string | — | FK → User.id |
| sender_username | string | — | Denormalized |
| sender_avatar | string | — | Denormalized |
| recipient_id | string | — | FK → User.id |
| recipient_username | string | — | Denormalized |
| text | string | — | Message body |
| is_read | boolean | — | Default false |
| thread_id | string | — | Composite: sorted(sender_id, recipient_id) |

---

## 14. UserInterest
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → User.id |
| hashtag | string | — | |
| score | number | — | Engagement score |
| last_updated | string | — | ISO datetime |

---

## 15. SachiLiveRoom
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| host_id | string | — | FK → User.id |
| host_username | string | — | Denormalized |
| host_avatar | string | — | Denormalized ← was missing in v1 script |
| title | string | — | |
| category | string | — | |
| is_live | boolean | — | |
| viewer_count | number | — | |
| stream_type | string | enum: rtmp, webrtc | |
| rtmp_url | string | — | |
| stream_key | string | — | ⚠️ Sensitive |
| hls_url | string | — | |

---

## 16. SachiLiveComment
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| room_id | string | — | FK → SachiLiveRoom.id |
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| avatar_url | string | — | Denormalized |
| text | string | — | Comment text |

---

## 17. SachiGuestRequest
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| room_id | string | — | FK → SachiLiveRoom.id |
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| avatar_url | string | — | Denormalized |
| status | string | enum: pending, approved, rejected | |

---

## 18. SachiCoinWallet
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| coins | number | — | Current balance |
| total_purchased | number | — | Lifetime purchased |
| total_spent | number | — | Lifetime spent on gifts |

---

## 19. SachiGift
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| room_id | string | — | FK → SachiLiveRoom.id |
| sender_id | string | — | FK → User.id |
| sender_username | string | — | Denormalized |
| sender_avatar | string | — | Denormalized |
| host_id | string | — | FK → User.id |
| host_username | string | — | Denormalized |
| gift_id | string | — | Gift type identifier |
| gift_name | string | — | Display name |
| gift_emoji | string | — | |
| gift_value_coins | number | — | Coin cost |
| gift_value_usd | number | — | USD value to host (50% of face) |

---

## 20. SachiHostEarning
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| host_id | string | — | FK → User.id |
| host_username | string | — | Denormalized |
| total_coins_received | number | — | |
| total_usd_earned | number | — | Lifetime earnings |
| pending_payout_usd | number | — | Awaiting payout |
| paid_out_usd | number | — | Already paid |
| stripe_account_id | string | — | For Stripe Connect payouts |
| payout_status | string | enum: active, pending, paused | |

---

## 21. SachiCoinPurchase
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → User.id |
| username | string | — | Denormalized |
| stripe_session_id | string | — | Stripe checkout session ID |
| stripe_payment_intent | string | — | Stripe PI ID |
| coins_purchased | number | — | |
| amount_paid_usd | number | — | |
| status | string | enum: pending, completed, failed, refunded | |

---

## 22. FoundingCreator
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| full_name | string | — | |
| email | string | — | |
| phone | string | — | |
| location | string | — | |
| content_type | string | — | |
| social_links | string | — | |
| follower_count | string | — | |
| why_sachi | string | — | Application essay |
| content_description | string | — | |
| status | string | enum: Applied, Under Review, Approved, Rejected | |
| notes | string | — | Internal notes |

---

## 23. PasswordReset
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| email | string | — | User email |
| code | string | — | 6-digit OTP |
| expiry | string | — | ISO datetime (15 min TTL) |

---

## 24. BetaTester
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| name | string | — | |
| email | string | — | |
| phone | string | — | |
| device | string | enum: iPhone, Android, Both, Unknown | |
| invite_sent | boolean | — | |
| status | string | enum: Invited, Signed Up, Active, No Response | |
| notes | string | — | |

---

## 25. AthaVidUser (Legacy)
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| username | string | — | |
| display_name | string | — | |
| bio | string | — | |
| avatar_url | string | — | |
| email | string | — | |
| phone | string | — | |
| date_of_birth | string | — | |
| is_verified | boolean | — | |
| is_18_plus | boolean | — | |
| location | string | — | |
| followers_count | number | — | |
| following_count | number | — | |
| videos_count | number | — | |
| status | string | enum: active, suspended, pending_verification | |

---

## 26. AthaVidVideo (Legacy)
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | string | — | FK → AthaVidUser.id |
| username | string | — | |
| display_name | string | — | |
| avatar_url | string | — | |
| video_url | string | — | |
| thumbnail_url | string | — | |
| caption | string | — | |
| hashtags | array(string) | — | |
| likes_count | number | — | |
| comments_count | number | — | |
| views_count | number | — | |
| shares_count | number | — | |
| is_archived | boolean | — | |
| is_ai_detected | boolean | — | |
| is_approved | boolean | — | |
| archive_date | string | — | |
| duration_seconds | number | — | |
| sound_title | string | — | |
| sound_artist | string | — | |
| sound_url | string | — | |

---

## 27. AthaVidComment (Legacy)
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| video_id | string | — | FK → AthaVidVideo.id |
| user_id | string | — | FK → AthaVidUser.id |
| username | string | — | |
| avatar_url | string | — | |
| comment_text | string | — | |
| likes_count | number | — | |

---

## CREATION ORDER (respects FK dependencies)
Create entities in this order in Base44 editor:
1. User (modify built-in)
2. PasswordReset
3. AthaVidUser
4. AthaVidVideo
5. AthaVidComment
6. SachiVideo
7. SachiComment
8. SachiLike
9. SachiHype
10. SachiBookmark
11. SachiBlock
12. SachiReport
13. SachiPodcast
14. SachiPodcastEpisode
15. Follow
16. UserInterest
17. SachiNotification
18. SachiMessage
19. SachiLiveRoom
20. SachiLiveComment
21. SachiGuestRequest
22. SachiCoinWallet
23. SachiGift
24. SachiHostEarning
25. SachiCoinPurchase
26. FoundingCreator
27. BetaTester
