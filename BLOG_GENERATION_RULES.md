# Blog Post Generation Rules for californiawineryweddings.com

## Core Rules (MANDATORY for all future blog posts)

### 1. Length & Structure (500 words maximum)
- **Hard limit**: 500 words per post
- **Lead with the answer**: First paragraph answers the core question
- **Content**: 3-5 specific winery recommendations with real data
- **No fluff**: No generic wine country descriptions or travel brochure language

### 2. Winery Data Requirements (CRITICAL)
**Every winery mentioned MUST:**
- ✅ Come from `/root/wineries-verified.json` (verified data only)
- ✅ Include real statistics: rating (stars), review count, city
- ✅ Be linked to the winery listing page format: `<a href="/wineries/[slug]">Winery Name</a>`
  - Slug format: winery title slugified (lowercase, spaces→hyphens, special chars removed)
  - Example: "Maria Concetto Winery Tasting Room" → `maria-concetto-winery-tasting-room`

**Validation checklist:**
- [ ] Each winery's slug matches the slugified title from wineries-verified.json
- [ ] Rating is actual data (e.g., 5.0★, 4.8★, not generic "highly rated")
- [ ] Review count is included (e.g., "473 reviews", not "hundreds of reviews")
- [ ] City is specified (e.g., "Calistoga", not generic "Napa Valley")

### 3. End with Region Page CTA
**Every post ends with:**
```html
<a href="/regions/[region-slug]">Explore [Region Name]</a>
```

Region slugs (from app/regions/[slug]/page.tsx):
- `napa-valley` → Napa Valley
- `sonoma-county` → Sonoma County
- `paso-robles-slo` → Paso Robles & SLO
- `temecula-southern-california` → Temecula & Southern California
- `central-coast` → Central Coast
- `sierra-foothills` → Sierra Foothills
- Other regions follow: lowercase, spaces→hyphens

### 4. Tone & Voice
**Write like a knowledgeable local friend:**
- ✅ Use contractions ("you're", "it's", "don't")
- ✅ Direct and conversational ("Go here if...", "Perfect for...")
- ✅ Honest assessment ("the cost is real", "Napa pricing", etc.)
- ✅ Specific details over hype (actual star ratings, review counts, prices)
- ❌ NO travel brochure language ("exquisite", "enchanting", "unforgettable")
- ❌ NO generic descriptions of wine country
- ❌ NO fluff sentences

### 5. HTML Format
Posts are stored as JSON with HTML content strings. Use only these tags:
- `<p>` - Paragraphs
- `<h2>` - Section headers
- `<h3>` - Subsection headers (rare)
- `<a href="/...">` - Links to wineries and regions
- `<ul>` / `<li>` - Lists (when applicable)
- `<strong>` - Emphasis (winery names are often wrapped: `<strong><a>...</a></strong>`)

**Escape quotes** in JSON: use `\"` for quotes inside content

---

## Blog Post JSON Format

```json
{
  "slug": "post-title-lowercase-hyphens",
  "title": "Post Title: Readable for Humans",
  "description": "One-sentence meta description (60 chars max)",
  "publishedDate": "2026-04-13",
  "author": "California Winery Weddings",
  "content": "<p>Lead paragraph...</p><h2>Section</h2><p>Content...</p>"
}
```

**Filed in:** `/public/blog-content/[slug].json`

---

## Post Types & Templates

### Regional Guide (e.g., Napa, Paso Robles)
1. **Why this region matters** — answer immediately (don't bury the lead)
2. **3-5 venue recommendations** — each with:
   - Winery name (linked)
   - Star rating + review count
   - City
   - 1-2 sentences on what makes it unique
3. **Real talk section** — honest assessment (cost, drawbacks, advantages)
4. **Region CTA link**

**Word count: 280-350 words**

### Outdoor/Venue-Type Posts (e.g., Outdoor Venues, Intimate Celebrations)
1. **Why this type works** — explain the advantage immediately
2. **3-5 specific venues** from the relevant region
   - Each includes rating, reviews, city
   - Why it works for this specific category (intimate, outdoor, budget, etc.)
3. **Practical tips** — real advice (heating, timing, logistics)
4. **Region CTA link**

**Word count: 280-350 words**

---

## Data Sources & Validation

### Where to pull winery data:
```bash
jq '.[] | select(.region == "Napa Valley") | {title, totalScore, reviewsCount, city}' /root/wineries-verified.json
```

### Required fields from wineries-verified.json:
- `title` → Winery name
- `totalScore` → Rating (e.g., 5.0)
- `reviewsCount` → Review count (e.g., 473)
- `city` → City name
- `region` → Region (matches /regions/[slug])

### How to generate slug from title:
```typescript
// From lib/utils.ts slugify function:
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

Example: "Maria Concetto Winery Tasting Room" → `maria-concetto-winery-tasting-room`

---

## Quality Checklist for New Posts

Before publishing a new blog post:

- [ ] **Word count**: 250-500 words maximum
- [ ] **Winery data**: All wineries from /root/wineries-verified.json
- [ ] **Slugs match**: Each winery slug matches slugified title
- [ ] **Stats included**: Every winery has rating (★) and review count
- [ ] **City mentioned**: Every winery includes city name
- [ ] **Links work**: All winery links format: `/wineries/[slug]`
- [ ] **Region CTA**: Post ends with `/regions/[region-slug]` link
- [ ] **No fluff**: First paragraph leads with the answer
- [ ] **Tone**: Read aloud—sounds like knowledgeable friend, not brochure
- [ ] **No generic wine**: No unsubstantiated claims about wine quality
- [ ] **HTML valid**: JSON properly escaped, `\"` for quotes
- [ ] **Description**: Meta description is 60 chars or less
- [ ] **Slug unique**: Slug doesn't match existing posts

---

## Cron Job Generation

### For future auto-generated posts:

```
Model: claude-3-5-sonnet-20241022
Task: "Using the rules in BLOG_GENERATION_RULES.md, generate a new blog post about [topic]. Pull winery data from /root/wineries-verified.json. Format as JSON and save to /root/californiawineryweddings/public/blog-content/[slug].json"
Frequency: Weekly
Delivery: Git commit and push to main (auto-deploy)
```

---

## Examples from Existing Posts

### Winery Recommendation (Good):
```html
<p><strong><a href="/wineries/maria-concetto-winery-tasting-room">Maria Concetto Winery Tasting Room</a></strong> in Calistoga is the crowd favorite. 5.0★ across 473 reviews—that's not luck, that's consistency. The vibe is relaxed but polished, perfect if you want your guests actually enjoying themselves instead of performing formality.</p>
```

### Region CTA (Good):
```html
<p><a href="/regions/napa-valley">Explore Napa Valley Wineries</a> to find your perfect venue.</p>
```

### Real Talk Section (Good):
```html
<h2>Real Talk About Temecula</h2>
<p>Southern California wine country has matured. The wineries take weddings seriously, the food quality is legitimate, and your budget stretches further.</p>
```

---

## Common Pitfalls to Avoid

❌ **Pitfall**: Generic opening ("Napa Valley is a world-famous wine region...")
✅ **Fix**: Lead with the specific value ("Napa isn't the cheapest, but it delivers...")

❌ **Pitfall**: Unlinked winery mentions ("Visit Rockin' Wine Tours")
✅ **Fix**: Always link: `<a href="/wineries/rockin-wine-tours-temecula">Rockin' Wine Tours</a>`

❌ **Pitfall**: Made-up stats ("consistently rated among the best")
✅ **Fix**: Use actual data: "5.0★ with 556 reviews"

❌ **Pitfall**: Flowery descriptions ("enchanting vineyards bathed in golden light")
✅ **Fix**: Specific benefits ("hilltop location means better views and a more intimate feel")

❌ **Pitfall**: Missing CTA or wrong region slug
✅ **Fix**: Every post ends with `<a href="/regions/[correct-slug]">Explore [Region]</a>`

---

## Last Updated
- **Date**: April 13, 2026
- **Enforced**: All future blog posts generated after this date
- **Model**: Claude Sonnet (claude-3-5-sonnet-20241022)
