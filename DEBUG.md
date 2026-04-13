# Debugging the Claim Error

## Quick Diagnosis

There's now a health check endpoint to diagnose issues:

```
GET /api/claim/health
```

This will return:
```json
{
  "env": {
    "AIRTABLE_API_KEY": "✓ Set" or "✗ Missing",
    "AIRTABLE_BASE_ID": "✓ Set" or "✗ Missing",
    "RESEND_API_KEY": "✓ Set" or "✗ Missing"
  },
  "airtable": "✓ Connected" or "✗ Error message",
  "resend": "✓ Configured" or "✗ Error message"
}
```

**Check this first:**
1. Go to https://californiawineryweddings.vercel.app/api/claim/health
2. Look for any "✗ Missing" or "✗ Error"
3. Report results

## Common Issues

### "✗ Missing" for AIRTABLE_API_KEY or AIRTABLE_BASE_ID

**Solution:** Add to Vercel environment variables
1. Go to Vercel project settings
2. Click "Environment Variables"
3. Add (from your `.env` file):
   - Key: `AIRTABLE_API_KEY` → Value: `pat...`
   - Key: `AIRTABLE_BASE_ID` → Value: `app...`
   - Key: `RESEND_API_KEY` → Value: `re_...`
4. Redeploy

### "✗ Missing" for RESEND_API_KEY

**Solution:** Add to Vercel environment variables (see above)

### "✗ Airtable" connection error

Check:
1. Is API key valid? (Copy fresh from Airtable)
2. Is Base ID correct? (Copy fresh from Airtable URL: airtable.com/appXXXXXXXXXXXXXX)
3. Does the API key have access to that base?
4. Is there a "Claimed Listings" table in that base?

### "✗ Resend" configuration error

Check:
1. Is API key valid? (Copy fresh from Resend)
2. Is it not expired?
3. Does it have email sending permissions?

## Enhanced Logging

After fixing env vars, try claiming again and check logs:

**Local Development:**
```bash
npm run dev
# Then go to http://localhost:3000/claim/[any-slug]
# Watch console for [CLAIM] and [AIRTABLE] logs
```

**Vercel:**
1. Go to Vercel project
2. Click "Deployments" → latest deployment
3. Go to "Logs" tab
4. Try claiming on live site
5. Filter logs for "CLAIM" or "AIRTABLE"

## Expected Logs

**Successful claim:**
```
[CLAIM] Test bypass active: test@californiawineryweddings.com
[AIRTABLE] Creating claimed listing: { placeId: '...', wineryName: '...', ownerEmail: '...' }
[AIRTABLE] ✓ Record created: recXXXXXXXXXXXXXX
[Resend sends email]
```

**Failed - missing Airtable:**
```
[AIRTABLE] ✗ Failed to create record: Invalid Base ID
[CLAIM] Error creating claim: { message: '...Airtable...', ... }
```

**Failed - missing Resend:**
```
[AIRTABLE] ✓ Record created: recXXXXXXXXXXXXXX
[CLAIM] Error creating claim: { message: '...Resend...', ... }
```

## Test Flow

**Step 1: Check health**
```
https://californiawineryweddings.vercel.app/api/claim/health
```

**Step 2: Try claiming**
```
https://californiawineryweddings.vercel.app/claim/nelson-family-vineyards
```

Use: `test@californiawineryweddings.com`

**Step 3: Check logs**
- Local: `npm run dev` console
- Vercel: Deployments → Logs

**Step 4: Verify in Airtable**
- Check "Claimed Listings" table for new record
- Should have your PlaceId, WineryName, OwnerEmail, Token

## Possible Causes of "An error occurred" Message

1. **❌ Env vars not set in Vercel**
   - Fix: Add to Environment Variables, redeploy

2. **❌ Airtable API key is invalid/expired**
   - Fix: Get fresh key from Airtable Account Settings

3. **❌ Base ID is wrong**
   - Fix: Copy from Airtable URL (airtable.com/appXXXXXXXXXXXXXX)

4. **❌ No "Claimed Listings" table exists**
   - Fix: Create table in that Airtable base

5. **❌ Resend API key is invalid**
   - Fix: Get fresh key from Resend dashboard

6. **❌ Missing from domain on test email**
   - Fix: Use exactly: `test@californiawineryweddings.com`

## Next Steps

1. **Check health endpoint** `/api/claim/health`
2. **Report results** (what shows ✓ or ✗?)
3. **Fix any missing** env vars in Vercel
4. **Redeploy** if you made changes
5. **Try claiming again** and check logs
6. **Report** what you see in logs

---

**Need help?** Check `/api/claim/health` first for specific issues!
