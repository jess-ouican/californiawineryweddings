# Error Debugging & Improvements - Complete

## What We Fixed

### 1. **Enhanced Error Logging in /api/claim**

**Before:**
```typescript
catch (error) {
  console.error('Error creating claim:', error);
  return { message: 'An error occurred. Please try again.' };
}
```

**After:**
```typescript
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('[CLAIM] Error creating claim:', {
    message: errorMessage,
    stack: error instanceof Error ? error.stack : null,
    error,
  });
  
  // More specific error messages
  if (errorMessage.includes('Resend')) {
    return { message: 'Failed to send verification email. Please try again.' };
  }
  if (errorMessage.includes('Airtable')) {
    return { message: 'Failed to create listing record. Please try again.' };
  }
  return { message: 'An error occurred. Please try again.' };
}
```

**Benefits:**
- Full error stack traces logged
- Errors categorized (Resend vs Airtable)
- User gets more specific error messages
- All tagged with `[CLAIM]` for easy filtering

### 2. **Airtable Integration Logging**

Added comprehensive logging to `lib/airtable.ts`:

```typescript
console.log('[AIRTABLE] Creating claimed listing:', { placeId, wineryName, ownerEmail });
const record = await claimedListingsTable.create({...});
console.log('[AIRTABLE] ✓ Record created:', record.id);
```

**Logs:**
- When record creation starts
- PlaceId, WineryName, OwnerEmail for context
- Record ID when successful
- Full error if failed

### 3. **Health Check Endpoint**

New endpoint: `GET /api/claim/health`

Returns:
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

**Use it to:**
1. Check if env vars are set
2. Test Airtable connection
3. Test Resend configuration
4. Get specific error messages

## Debugging Guide

### Quick Start

**Live:** https://californiawineryweddings.vercel.app/api/claim/health

This will tell you:
- ✓ or ✗ for each env var
- ✓ or ✗ for Airtable connection
- ✓ or ✗ for Resend config

### Most Common Issue

**Env vars not set in Vercel:**

1. Go to Vercel Project Settings
2. Click "Environment Variables"
3. Add three variables:
   - `AIRTABLE_API_KEY` = your key
   - `AIRTABLE_BASE_ID` = your base ID
   - `RESEND_API_KEY` = your key
4. Redeploy or next deploy will pick them up

### Check Logs

**Local development:**
```bash
npm run dev
# Watch console for [CLAIM] and [AIRTABLE] tags
```

**Vercel (production):**
1. Vercel Dashboard → Project
2. Click "Deployments"
3. Click latest deployment
4. Go to "Logs" tab
5. Filter for "CLAIM" or "AIRTABLE"
6. Try claiming again
7. Watch logs for errors

## Files Modified

**Updated:**
- `app/api/claim/route.ts` - Enhanced error logging
- `lib/airtable.ts` - Added logging to all functions

**Created:**
- `app/api/claim/health/route.ts` - Health check endpoint
- `DEBUG.md` - Comprehensive debugging guide

## New Documentation

### `DEBUG.md` (Comprehensive)
- Quick diagnosis steps
- Common issues and solutions
- Expected vs error logs
- Test flow checklist
- Possible causes listed

### Key Sections
- **Quick Diagnosis** - Check health endpoint
- **Common Issues** - Missing env vars, invalid keys, etc.
- **Enhanced Logging** - Where to find logs
- **Expected Logs** - What success looks like
- **Test Flow** - Step-by-step testing
- **Possible Causes** - 6 common problems

## Testing the Fix

### Step 1: Check Health
```
https://californiawineryweddings.vercel.app/api/claim/health
```

Look for any `✗ Missing` or errors.

### Step 2: Fix Issues
If health check shows ✗:
1. Add missing env vars to Vercel
2. Redeploy
3. Check health endpoint again

### Step 3: Test Claiming
```
Go to: https://californiawineryweddings.vercel.app/claim/[any-slug]
Email: test@californiawineryweddings.com
Submit
```

### Step 4: Check Logs
**Local:**
```bash
npm run dev
# Look for [CLAIM] and [AIRTABLE] logs
```

**Vercel:**
1. Deployments → Latest → Logs
2. Filter for "CLAIM"
3. Should see:
   - `[CLAIM] Test bypass active: test@californiawineryweddings.com`
   - `[AIRTABLE] Creating claimed listing: {...}`
   - `[AIRTABLE] ✓ Record created: rec...`

## Commits

```
51a31a4 docs: Add comprehensive debugging guide for claim errors
89688ed fix: Improve error logging and add health check endpoint
```

## What This Solves

✅ **User sees generic "An error occurred" message**
- Now they get specific error (Resend failure? Airtable failure?)

✅ **Hard to diagnose issues on production**
- Health endpoint tells you exactly what's wrong
- Logs are now detailed with context

✅ **Missing env vars cause silent failures**
- Health endpoint catches missing vars
- Logs show exactly what's missing

✅ **Can't tell if Airtable or Resend is the problem**
- Error messages now distinguish between them
- Logs are tagged for easy filtering

## Next Steps

1. **Check:** https://californiawineryweddings.vercel.app/api/claim/health
2. **Report:** What does it show?
3. **Fix:** Any ✗ issues?
4. **Test:** Try claiming again
5. **Monitor:** Check logs with [CLAIM] tag

---

**Status:** ✅ Enhanced | Commits: 2 | Docs: Complete | Tests: Ready
