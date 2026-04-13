# Claim System Testing Guide

## Test Email Bypass

For internal testing, use the email `test@californiawineryweddings.com` to bypass domain validation.

**This allows you to:**
- Test claiming any winery without owning a domain
- Verify the full claiming flow end-to-end
- Test multiple claims without setting up test domains

### How to Use

1. Navigate to any winery page (e.g., `/wineries/any-winery`)
2. Click "Claim Your Listing" button
3. Fill form with:
   - **Name:** Any name (e.g., "Test User")
   - **Email:** `test@californiawineryweddings.com`
   - **Role:** Any role
4. Submit
5. Check the Airtable "Claimed Listings" table for the new record
6. **Email verification:** Resend will send to test@californiawineryweddings.com
   - The email needs to be monitored in Resend dashboard
   - OR you can manually update the Airtable record to set `Verified = TRUE`

## Environment Variables Setup

### Option 1: `.env.local` (Local Development)

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```
AIRTABLE_API_KEY=patXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXX
RESEND_API_KEY=re_XXXXXXXXXXXX
```

Run locally:
```bash
npm run dev
```

### Option 2: Vercel Deployment

1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add three variables:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `RESEND_API_KEY`
4. Redeploy (or it will auto-deploy on next push)

**Note:** The `next.config.ts` now exposes these env vars for build time, so Vercel will automatically pick them up without needing special configuration.

## Testing Workflows

### Workflow 1: Test Basic Claiming (No Email)

1. Use `test@californiawineryweddings.com`
2. Claim a winery
3. Check Airtable for new record
4. Verify form clears and shows success message
5. Return to winery page → should still show "Claim" button (not verified yet)

### Workflow 2: Test Email Verification (Full Flow)

1. Use actual domain email (e.g., `owner@yourwinery.com`)
2. Claim winery
3. Check email for magic link
4. Click link with token
5. Should redirect to `/claim/success`
6. Return to winery page → should show "✓ Verified Owner" badge
7. Check Airtable record → `Verified = TRUE`

### Workflow 3: Test Domain Validation

**Should FAIL (show error):**
- `test@gmail.com`
- `test@yahoo.com`
- `test@hotmail.com`
- `test@outlook.com`
- `test@aol.com`
- `test@protonmail.com`
- `test@icloud.com`

**Should PASS:**
- `test@yourcompany.com`
- `owner@winery.com`
- `manager@tasting-room.co`
- `test@californiawineryweddings.com` (test bypass)

### Workflow 4: Test Duplicate Prevention

1. Claim winery A with `owner@winery.com`
2. Try to claim **same** winery with `different@winery.com`
3. Should get error: "This winery was already claimed on owner@winery.com"
4. Try to claim **different** winery with same email → should work

### Workflow 5: Test Region Page Sorting

1. Claim and verify 2-3 wineries in the same region
2. Go to region page (e.g., `/regions/temecula-winery-weddings`)
3. Should see "✓ Verified Owner Wineries" section
4. Verified wineries should appear before regular listings
5. Scroll through → all 3 verified should be grouped together

### Workflow 6: Test Badge Display

1. Verify a winery claim
2. Visit that winery's page
3. In header → should see green badge: "✓ Verified Owner"
4. Badge should appear next to ratings
5. Return to region page → should also see badge on card

## Debugging

### Check Airtable Records

1. Go to Airtable base
2. Open "Claimed Listings" table
3. Look for new records with:
   - `PlaceId` populated
   - `Token` is 32-char string
   - `Verified` checkbox (false until verified)
   - `ClaimedAt` has ISO timestamp

### Check Email Delivery

1. Go to Resend dashboard
2. Look for emails to `test@californiawineryweddings.com`
3. Check for template rendering issues
4. Verify magic link format: `/claim/verify?token=XXX`

### Check API Logs

Local development:
```bash
npm run dev
# Watch console for [CLAIM] logs
```

Vercel deployment:
1. Go to Vercel project
2. Click "Deployments"
3. Select latest deployment
4. Go to "Logs" tab
5. Filter for "claim" or "CLAIM"

### Common Issues

**Error: "Missing required fields"**
- Ensure all form fields are filled
- Check payload in network tab

**Error: "Please use your official winery domain email"**
- Email not being accepted by validator
- Try with `test@californiawineryweddings.com`
- Or use real domain email

**Error: "This winery was already claimed"**
- Use a different winery for testing
- Or manually delete record from Airtable

**Email not arriving**
- Check Resend dashboard for bounces
- Verify `RESEND_API_KEY` is correct
- Check spam folder for `no-reply@californiawineryweddings.com`

**Verification link not working**
- Copy full URL with token from email
- Ensure token matches Airtable record
- Check browser network tab for 303 redirect

## Test Data Cleanup

After testing, you may want to clean up test records:

1. Go to Airtable "Claimed Listings" table
2. Filter by `OwnerEmail = "test@californiawineryweddings.com"`
3. Delete records as needed
4. Go to winery pages → claim buttons should reappear

## Load Testing (Advanced)

To test multiple claims:

```bash
# Create 10 test records quickly
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/claim \
    -H "Content-Type: application/json" \
    -d '{
      "placeId": "place_'$i'",
      "wineryName": "Test Winery '$i'",
      "ownerName": "Tester",
      "ownerEmail": "test@californiawineryweddings.com",
      "role": "Manager"
    }'
  sleep 1
done
```

This will create 10 test records quickly without domain validation.

---

**Last Updated:** Session 5 | Test Bypass Added
