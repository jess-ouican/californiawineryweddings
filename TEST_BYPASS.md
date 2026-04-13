# Test Bypass Quick Reference

## Email Test Bypass

**Email:** `test@californiawineryweddings.com`

**Use this email to:**
- Claim any winery without owning a domain
- Test the full claiming flow
- Test multiple claims without setup
- QA internal features

## How to Test

### 1. Basic Claim Test
```
1. Go to any winery page
2. Click "Claim Your Listing"
3. Enter:
   - Name: Any name
   - Email: test@califoniawineryweddings.com
   - Role: Any role
4. Submit
5. Check Airtable → new record created with Verified=false
```

### 2. Full Verification Test
```
After claiming with test email:
1. Go to Airtable "Claimed Listings" table
2. Find your test record
3. Manually update Verified to TRUE
4. Refresh winery page
5. Should see green "✓ Verified Owner" badge
```

### 3. Test Multiple Claims
```
- Use same test email to claim different wineries
- Each gets separate record in Airtable
- Test shows they're independent
```

## Email Validation Tests

**These should FAIL (show error):**
```
test@gmail.com
test@yahoo.com
test@hotmail.com
test@outlook.com
test@aol.com
test@protonmail.com
test@icloud.com
```

**These should PASS:**
```
test@yourcompany.com
owner@winery.com
manager@tasting.com
test@californiawineryweddings.com  ← test bypass
```

## Airtable Inspection

After claiming with test email:

1. Open Airtable base
2. Go to "Claimed Listings" table
3. Look for row with:
   - `OwnerEmail = "test@californiawineryweddings.com"`
   - `Verified = FALSE` (until you verify)
   - `Token = "32-character-string"`
   - `ClaimedAt = "ISO timestamp"`

## Environment Setup

### Local Development
```bash
# Copy template
cp .env.local.example .env.local

# Fill in values:
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
RESEND_API_KEY=re_...

# Run
npm run dev
```

### Vercel Deployment
1. Project Settings → Environment Variables
2. Add 3 variables:
   - AIRTABLE_API_KEY
   - AIRTABLE_BASE_ID
   - RESEND_API_KEY
3. Redeploy

**Note:** The `next.config.ts` now auto-exposes these vars during build. No manual config needed!

## Cleanup

To remove test records:

1. Go to Airtable "Claimed Listings" table
2. Filter: `OwnerEmail = "test@californiawineryweddings.com"`
3. Delete matching rows
4. Refresh winery pages → "Claim" buttons reappear

## Debugging

**Check build logs:**
```bash
# Local
npm run build

# Vercel: Project → Deployments → [latest] → Logs
# Search for "CLAIM"
```

**Check claim email validation:**
- Use test email with any winery → succeeds
- Use Gmail → fails with error message
- Use domain email → succeeds

**Check Airtable sync:**
- After claiming → check table for new row
- After verification → check `Verified` column

---

**Test Email:** test@californiawineryweddings.com
**Docs:** See TESTING.md for full workflow guide
