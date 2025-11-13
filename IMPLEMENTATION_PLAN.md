# Implementation Plan: Better AI Models for Blueprint Analysis

## Phase 1: Switch to Claude 3.5 Sonnet (Immediate - 1 day)

### Step 1: Install Dependencies
```bash
npm install @anthropic-ai/sdk
```

### Step 2: Update Environment Variables
```env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Step 3: Update API Routes
- Replace GPT-4 Vision with Claude 3.5 Sonnet in:
  - `app/api/chat/route.ts`
  - `app/api/analyze/route.ts`
  - `app/api/compare/route.ts`

### Benefits:
- ✅ Better technical document understanding
- ✅ More accurate measurements
- ✅ Better structured data extraction
- ✅ Lower cost
- ✅ Faster responses

## Phase 2: Add OCR Support (Short-term - 3-5 days)

### Option A: AWS Textract (Recommended)
```bash
npm install @aws-sdk/client-textract
```

**Setup:**
1. Create AWS account
2. Set up IAM user with Textract permissions
3. Add credentials to `.env`

**Benefits:**
- Best accuracy for technical documents
- Extracts tables and forms
- Identifies measurements automatically
- $1.50 per 1,000 pages

### Option B: Tesseract OCR (Free Alternative)
```bash
npm install tesseract.js
```

**Benefits:**
- Free and open-source
- Good for basic text extraction
- No API costs

## Phase 3: CAD Parser Support (Medium-term - 1 week)

### For DWG/DXF Files:
```bash
npm install dwg
# OR use Python service with ezdxf
```

**Implementation:**
- Create API endpoint that converts DWG to structured data
- Extract layers, dimensions, blocks directly
- More accurate than image analysis

## Phase 4: Image Preprocessing (Short-term - 2-3 days)

### Using OpenCV (via sharp or canvas)
- Deskew images
- Enhance contrast
- Remove noise
- Improve OCR accuracy

## Recommended Migration Path

### Week 1:
1. ✅ Switch to Claude 3.5 Sonnet
2. ✅ Add Tesseract OCR (free)
3. ✅ Test and compare results

### Week 2:
1. ✅ Integrate AWS Textract
2. ✅ Add image preprocessing
3. ✅ Improve measurement extraction

### Week 3-4:
1. ✅ Add CAD parser
2. ✅ Fine-tune extraction pipeline
3. ✅ Add validation layer

## Cost Analysis

### Current (GPT-4 Vision):
- ~$0.01-0.03 per analysis
- ~$0.01 per chat message

### With Claude 3.5 Sonnet:
- ~$0.003-0.015 per analysis (50% cheaper)
- ~$0.003 per chat message (70% cheaper)

### With AWS Textract:
- $1.50 per 1,000 pages
- ~$0.0015 per blueprint

### Total Savings:
- **60-70% cost reduction**
- **Better accuracy**
- **Faster responses**

## Next Steps

1. **Today**: Install Anthropic SDK and test Claude
2. **This Week**: Replace GPT-4 with Claude in all routes
3. **Next Week**: Add OCR support
4. **Month 2**: Add CAD parser

