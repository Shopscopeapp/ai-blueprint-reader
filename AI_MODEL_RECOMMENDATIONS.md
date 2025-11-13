# AI Model Recommendations for Blueprint Analysis

## Current State
- **Using**: GPT-4 Vision (general-purpose vision model)
- **Issues**: 
  - Not specialized for technical drawings
  - May miss precise measurements
  - Struggles with CAD-specific elements
  - Limited understanding of construction standards

## Recommended Hybrid Approach

### 1. **Primary Vision Model: Claude 3.5 Sonnet with Vision** ⭐ BEST CHOICE
**Why:**
- Superior technical document understanding
- Better at structured data extraction
- Longer context window (200K tokens)
- More accurate with measurements and technical details
- Better JSON/structured output
- More cost-effective than GPT-4

**Implementation:**
```typescript
// Use Anthropic Claude 3.5 Sonnet
// Better for technical analysis, measurements, compliance
```

### 2. **Specialized OCR + Text Extraction**
**Tools:**
- **AWS Textract** - Best for technical documents, tables, forms
- **Google Document AI** - Excellent for structured documents
- **Tesseract OCR** (open-source) - For basic text extraction

**Why:**
- Extracts text, dimensions, labels with high accuracy
- Identifies tables and structured data
- Better than vision models for precise text extraction
- Can extract measurements directly from PDFs

### 3. **Computer Vision for Shape/Room Detection**
**Tools:**
- **OpenCV** - For image preprocessing and shape detection
- **YOLO/Detectron2** - For object detection (rooms, doors, windows)
- **Custom trained models** - For architectural elements

**Why:**
- Identifies rooms, walls, doors, windows automatically
- Measures areas and perimeters
- Detects architectural patterns

### 4. **CAD-Specific Parsers**
**Tools:**
- **DWG/DXF Parsers**:
  - `dwg` npm package (JavaScript)
  - `ezdxf` (Python, can be wrapped)
  - **AutoCAD API** (if available)

**Why:**
- Direct access to CAD data (layers, dimensions, blocks)
- More accurate than image analysis
- Preserves original measurements

### 5. **Structured Data Extraction Pipeline**

```
Blueprint Upload
    ↓
1. File Type Detection
    ↓
2. If PDF → OCR (Textract/Document AI) → Extract text, dimensions, tables
    ↓
3. If DWG/DXF → CAD Parser → Extract layers, dimensions, blocks
    ↓
4. If Image → Preprocessing (deskew, enhance) → Computer Vision
    ↓
5. Combine all data → Claude 3.5 Sonnet for analysis
    ↓
6. Structured output (JSON)
```

## Recommended Implementation Stack

### Tier 1: Best Performance (Recommended)
1. **Claude 3.5 Sonnet** - Primary analysis and Q&A
2. **AWS Textract** - OCR and text extraction
3. **OpenCV** - Image preprocessing
4. **CAD Parser** - For DWG/DXF files

### Tier 2: Cost-Effective
1. **Claude 3.5 Sonnet** - Primary analysis
2. **Tesseract OCR** - Free OCR
3. **OpenCV** - Image preprocessing
4. **PDF.js** - PDF text extraction (already using)

### Tier 3: Premium (Best Accuracy)
1. **Claude 3.5 Sonnet** - Analysis
2. **AWS Textract** - OCR
3. **Google Document AI** - Structured extraction
4. **Custom ML Model** - Fine-tuned on blueprints
5. **CAD Parser** - Native CAD support

## Specific Model Comparisons

### For Analysis & Q&A:
1. **Claude 3.5 Sonnet** ⭐ (Best for technical docs)
2. **GPT-4o** (Newer, better vision)
3. **Gemini Pro Vision** (Good alternative)
4. **GPT-4 Vision** (Current, but not optimal)

### For OCR:
1. **AWS Textract** ⭐ (Best for technical documents)
2. **Google Document AI** (Excellent for forms/tables)
3. **Azure Form Recognizer** (Good alternative)
4. **Tesseract** (Free, but less accurate)

### For CAD Files:
1. **Native CAD Parsers** ⭐ (Direct data access)
2. **Convert to PDF first** (Current approach)
3. **Image conversion** (Loses precision)

## Implementation Priority

### Phase 1: Quick Wins (1-2 days)
1. Switch to **Claude 3.5 Sonnet** for analysis
2. Add **Tesseract OCR** for text extraction
3. Improve image preprocessing with **OpenCV**

### Phase 2: Enhanced Accuracy (1 week)
1. Integrate **AWS Textract** for PDFs
2. Add **CAD parser** for DWG/DXF
3. Implement structured extraction pipeline

### Phase 3: Advanced Features (2-4 weeks)
1. Fine-tune custom model on blueprints
2. Add computer vision for room detection
3. Implement measurement validation

## Cost Comparison

| Service | Cost per 1K pages | Accuracy | Speed |
|---------|------------------|----------|-------|
| Claude 3.5 Sonnet | $3-15 | ⭐⭐⭐⭐⭐ | Fast |
| GPT-4 Vision | $10-30 | ⭐⭐⭐⭐ | Medium |
| AWS Textract | $1.50 | ⭐⭐⭐⭐⭐ | Fast |
| Tesseract | Free | ⭐⭐⭐ | Slow |
| Google Doc AI | $1.50 | ⭐⭐⭐⭐⭐ | Fast |

## Recommended Next Steps

1. **Immediate**: Switch to Claude 3.5 Sonnet
2. **Short-term**: Add AWS Textract for OCR
3. **Medium-term**: Add CAD parser support
4. **Long-term**: Fine-tune custom model

## Code Structure Recommendation

```
lib/
  ├── ai/
  │   ├── claude.ts      # Claude 3.5 Sonnet
  │   ├── openai.ts      # Keep as fallback
  │   └── anthropic.ts   # Anthropic client
  ├── ocr/
  │   ├── textract.ts    # AWS Textract
  │   ├── tesseract.ts   # Tesseract OCR
  │   └── document-ai.ts # Google Doc AI
  ├── cad/
  │   └── parser.ts      # CAD file parser
  └── vision/
      └── preprocessing.ts # OpenCV preprocessing
```

