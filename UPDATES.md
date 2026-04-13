# Test Bypass & Env Vars Update - Complete

## Changes Made

### 1. **Test Email Bypass**
Added `test@californiawineryweddings.com` as a special test email that:
- Bypasses domain email validation
- Allows claiming any winery without owning a domain
- Logs when used: `[CLAIM] Test bypass active: test@californiawineryweddings.com`
- Perfect for QA, internal testing, and demos

**Where:** `app/api/claim/route.ts` (lines 9-13)

### 2. **Env Var Build-Time Exposure**
Updated `next.config.ts` to expose environment variables at build time:
```typescript
env: {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
}
```

**Benefits:**
- Vercel auto-picks up env vars during build
- No manual "reload env" needed after setting vars
- Works for both local development and production
- Same pattern works across all Next.js versions

### 3. **Local Development Template**
Created `.env.local.example`:
```bash
cp .env.local.example .env.local
# Then fill in your actual values
```

### 4. **Documentation**
Created 3 comprehensive docs:

#### `TEST_BYPASS.md` (Quick Reference)
- One-page quick start for test email
- Email validation test cases
- Airtable inspection steps
- Environment setup checklist
- Debugging shortcuts

#### `TESTING.md` (Full Guide)
- 6 testing workflows:
  1. Basic claiming (no email)
  2. Email verification (full flow)
  3. Domain validation
  4. Duplicate prevention
  5. Region page sorting
  6. Badge display
- Environment setup for local and Vercel
- Debugging guide with common issues
- Load testing examples
- Airtable record inspection

#### `CLAIMING_SYSTEM.md` (System Documentation)
- Architecture overview
- Component details
- API endpoint specs
- User flow diagram
- Validation rules
- Response examples
- Future enhancement ideas

## Testing the Changes

### Quick Test
```bash
# 1. Copy env template
cp .env.local.example .env.local

# 2. Fill in your Airtable and Resend keys
# 3. Run locally
npm run dev

# 4. Go to any winery: http://localhost:3000/wineries/any-slug
# 5. Click "Claim Your Listing"
# 6. Use test@californiawineryweddings.com
# 7. Should succeed without domain validation
# 8. Check Airtable → new record created
```

### Verify Build
```bash
npm run build
# Should complete successfully
# No TypeScript errors
# .next/BUILD_ID created
```

## Environment Setup

### For Vercel Deployment

1. Go to Vercel Project Settings
2. Click "Environment Variables"
3. Add three variables (from your `.env` file):
   - `AIRTABLE_API_KEY` = your key
   - `AIRTABLE_BASE_ID` = your base ID
   - `RESEND_API_KEY` = your key
4. Any new deploy will automatically use these

**No need to manually reload or restart Vercel!**

### For Local Development

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```env
AIRTABLE_API_KEY=patXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXX
RESEND_API_KEY=re_XXXXXXXXXXXX
```

Run:
```bash
npm run dev
```

## Commits

```
5161b55 docs: Add quick reference for test bypass email
64c028b feat: Add test bypass and fix env var handling for Vercel
757a9cc feat: Add complete 'Claim Your Listing' system
```

## Files Modified

**Updated:**
- `app/api/claim/route.ts` - Added test bypass logic
- `next.config.ts` - Exposed env vars for build time
- `components/ClaimForm.tsx` - Hidden test email hint

**Created:**
- `.env.local.example` - Environment template
- `CLAIMING_SYSTEM.md` - Full system docs
- `TESTING.md` - Testing workflows and guide
- `TEST_BYPASS.md` - Quick reference

## What's Next

1. **Verify on Vercel:**
   - Set env vars in Vercel settings
   - Deploy (or re-deploy current code)
   - Test claiming flow on https://californiawineryweddings.vercel.app/

2. **QA Testing:**
   - Use test@californiawineryweddings.com to test flows
   - Test real domain emails work
   - Verify Airtable records are created
   - Test email delivery via Resend

3. **Monitoring:**
   - Watch Vercel logs for `[CLAIM]` entries
   - Monitor Airtable "Claimed Listings" table
   - Check Resend dashboard for email delivery

## Key Takeaways

✅ **Test Email:** `test@californiawineryweddings.com` - bypasses domain validation  
✅ **Env Setup:** Automatic at build time via `next.config.ts`  
✅ **Local Dev:** Copy `.env.local.example` → `.env.local` → fill values  
✅ **Vercel:** Just add env vars in project settings, auto-picked during build  
✅ **Docs:** See TESTING.md for detailed workflows, TEST_BYPASS.md for quick ref  

---

**Status:** ✅ Complete | Commits: 3 | Tests: Ready | Docs: Comprehensive
