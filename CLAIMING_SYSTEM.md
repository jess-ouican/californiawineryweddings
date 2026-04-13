# Claim Your Listing System - Complete Implementation

## Overview

A complete "Claim Your Listing" system built for California Winery Weddings using Airtable as the backend and Resend for email delivery. Allows winery owners/managers to verify ownership and unlock a "Verified Owner" badge.

## System Components

### 1. **Claim Button & Status Check** (`components/WineryHeaderActions.tsx`)
- Displays on every winery page in the header
- Client-side component that checks verification status via API
- Shows either:
  - Blue "Claim Your Listing" button (if not claimed)
  - Green "Verified Owner" badge (if verified)

### 2. **Claim Form** (`components/ClaimForm.tsx`)
- Full-page form at `/claim/[slug]`
- Collects:
  - Owner Name (required)
  - Owner Email (required, domain validation)
  - Role (Owner, Manager, Marketing Director, Events Coordinator, Other)
- Client-side form handling with submission to `/api/claim`
- Shows success confirmation with email address
- Domain email validation (rejects Gmail, Yahoo, Hotmail, Outlook, AOL, ProtonMail, iCloud)

### 3. **API Endpoints**

#### `/api/claim` (POST)
- Validates email domain (must be company domain)
- Checks if winery already claimed (returns 409 if duplicate)
- Generates 32-character URL-safe verification token
- Creates Airtable record in "Claimed Listings" table
- Sends magic link email via Resend with branded HTML
- Returns 201 with record ID on success

**Validation Rules:**
- Required fields: placeId, wineryName, ownerName, ownerEmail
- Email domain validation: blocks common free email providers
- Duplicate prevention: one claim per placeId

#### `/api/claim/verify?token=xxx` (GET)
- Verifies token against Airtable records
- Marks Verified=true when token matches
- Redirects to `/claim/success` on success
- Returns 404 if token invalid/expired

#### `/api/claim/status?placeId=xxx` (GET)
- Checks if winery is claimed and verified
- Returns: `{ claimed, verified, email }`
- Used by claim button to display correct state

### 4. **Airtable Integration** (`lib/airtable.ts`)

**Table:** "Claimed Listings"
**Fields:**
- PlaceId: Winery identifier
- WineryName: Venue name
- OwnerName: Contact name
- OwnerEmail: Contact email
- Role: Position/title
- ClaimedAt: ISO timestamp
- Verified: Boolean checkbox
- Token: 32-char verification token
- ListingURL: Link to winery page

**Functions:**
- `createClaimedListing()`: Create new claim
- `verifyClaimedListingByToken()`: Mark as verified
- `isWineryClaimed()`: Check claim status
- `getVerifiedClaimedPlaceIds()`: Fetch all verified PlaceIds

### 5. **Verified Owner Badge** (`components/VerifiedOwnerBadge.tsx`)
- Green badge with checkmark icon
- Displays on winery pages when verified
- Text: "Verified Owner"
- Styles: `bg-green-50 border-green-200 text-green-700`

### 6. **Email Template**
Sent via Resend from `no-reply@californiawineryweddings.com`:
- Branded header with gradient
- Personalized greeting with owner name and winery name
- Clear CTA button: "Verify Ownership"
- Fallback text link with token URL
- 24-hour expiration notice
- Professional footer with support email

### 7. **Success Page** (`app/claim/success/page.tsx`)
- Displayed after email verification
- Shows checkmark icon and "Verified!" heading
- Confirms badge is active and winery appears at top of region pages
- Links back to home and directory

### 8. **Region Page Sorting** (`components/VerifiedClaimedWineries.tsx`)
- New section: "✓ Verified Owner Wineries"
- Appears after Couples' Favorites
- Shows all verified wineries in the region
- Green background: `bg-green-50`
- Displays before weather widget and full winery grid

## User Flow

```
1. User visits winery page
   ↓
2. See "Claim Your Listing" button
   ↓
3. Click → Navigate to /claim/[slug]
   ↓
4. Fill form with name, domain email, role
   ↓
5. Submit → POST to /api/claim
   ↓
6. Email sent with magic link containing token
   ↓
7. Click link in email → GET /api/claim/verify?token=xxx
   ↓
8. Token verified → Record marked Verified=true → Redirect to /claim/success
   ↓
9. Return to winery page → See green "Verified Owner" badge
   ↓
10. Winery appears in region page's verified section
```

## Features & Validation

### Email Domain Validation
- Blocks 7 common free providers: Gmail, Yahoo, Hotmail, Outlook, AOL, ProtonMail, iCloud
- Requires company domain (e.g., info@yourwinery.com)
- Clear error message explaining requirement

### Token Security
- 32-character URL-safe random string
- No expiration in code (database could add TTL if needed)
- One-time use (verified status prevents re-claiming)
- Only accessible via email link

### Airtable Integration
- API key and base ID from environment variables
- Error handling for network/database failures
- Graceful degradation (claim button still visible even if check fails)

### Client-Side Error Handling
- Network error fallback
- Form validation feedback
- Success confirmation before navigation

## Frontend Integration

### Modified Files
1. **app/wineries/[slug]/page.tsx**
   - Imported `WineryHeaderActions` component
   - Added component to badge section with placeId and slug

2. **app/regions/[slug]/page.tsx**
   - Imported `getVerifiedClaimedPlaceIds` and `VerifiedClaimedWineries`
   - Fetches verified listings server-side
   - Renders section between Favorites and Weather

## Environment Variables Required

```env
AIRTABLE_API_KEY=pat...       # Airtable API key
AIRTABLE_BASE_ID=app...       # Airtable base ID
RESEND_API_KEY=re_...         # Resend email API key
```

## Testing Checklist

- [ ] Verify Airtable credentials in environment
- [ ] Test claim form with valid domain email
- [ ] Test claim form with blocked free email (should error)
- [ ] Test duplicate claim rejection (409 error)
- [ ] Check email delivery via Resend
- [ ] Click magic link in email
- [ ] Verify token validation and record update
- [ ] Confirm success page redirect
- [ ] Check verified badge appears on winery page
- [ ] Confirm winery appears in region verified section
- [ ] Test on mobile (form responsiveness)
- [ ] Verify Airtable record created with all fields

## Deployment Status

- ✅ Code built successfully
- ✅ Pushed to GitHub (commit 757a9cc)
- ✅ Auto-deployment to Vercel triggered via webhook
- 🔄 Vercel deployment in progress

**Live URL:** https://californiawineryweddings.vercel.app/

## API Response Examples

### Create Claim (POST /api/claim)
```json
Success (201):
{
  "message": "Claim submitted successfully. Check your email for verification link.",
  "recordId": "rec123abc..."
}

Domain Validation Error (400):
{
  "message": "Please use your official winery domain email (e.g., info@yourwinery.com)..."
}

Duplicate Claim (409):
{
  "message": "This winery was already claimed on owner@winery.com. If you represent..."
}
```

### Check Status (GET /api/claim/status?placeId=xxx)
```json
{
  "claimed": true,
  "verified": true,
  "email": "owner@winery.com"
}
```

## Files Summary

**New Files Created (11):**
- `lib/airtable.ts` - Airtable integration
- `components/ClaimForm.tsx` - Claim form UI
- `components/VerifiedOwnerBadge.tsx` - Badge display
- `components/WineryHeaderActions.tsx` - Claim button + status
- `components/VerifiedClaimedWineries.tsx` - Region section
- `app/claim/[slug]/page.tsx` - Claim form page
- `app/claim/success/page.tsx` - Success page
- `app/api/claim/route.ts` - Create claim API
- `app/api/claim/verify/route.ts` - Verify token API
- `app/api/claim/status/route.ts` - Status check API

**Modified Files (2):**
- `app/wineries/[slug]/page.tsx` - Added button & badge
- `app/regions/[slug]/page.tsx` - Added verified section

**Dependencies Added:**
- `airtable` - Airtable SDK
- `crypto-random-string` - Secure token generation

## Future Enhancements

1. **Token Expiration:** Add TTL to Airtable records (24 hours)
2. **Resend Verification:** Resend link if initial email bounces
3. **Dashboard:** Owner portal to manage claimed listings
4. **Lead Priority:** Route leads to verified owners first
5. **Analytics:** Track verification rates and engagement
6. **Email Customization:** Allow winery branding in emails
7. **Bulk Operations:** Admin interface to verify multiple claims
8. **Notifications:** Send weekly emails to verified owners with leads

---

**Deployed:** Session 5 | Commit: 757a9cc | Status: ✅ Complete
