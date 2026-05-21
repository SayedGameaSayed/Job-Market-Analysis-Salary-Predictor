"""
Image → Structured Markdown Pipeline

Pipeline:
1. Preprocess (upscale, sharpen, contrast, invert for dark mode)
2. Layout detection (OpenCV contour analysis)
3. OCR per region (pytesseract)
4. Region classification (heuristic)
5. Structured markdown generation

Requires: opencv-python, pytesseract, numpy
Requires system: Tesseract OCR engine installed
"""

import os
import cv2
import numpy as np
from typing import List, Dict, Optional

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

# ---------------------------------------------------------------------------
# STEP 1: Image Preprocessing
# ---------------------------------------------------------------------------

def preprocess_image(img: np.ndarray) -> np.ndarray:
    """Upscale, sharpen, denoise, invert dark backgrounds."""
    # Upscale 2x for small text
    h, w = img.shape[:2]
    if h < 800 and w < 1200:
        img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img

    # Check if dark mode (mean pixel value < 127)
    is_dark = np.mean(gray) < 127
    if is_dark:
        # Invert to make text dark on light background
        gray = cv2.bitwise_not(gray)

    # Increase contrast via CLAHE
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Sharpen
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
    sharpened = cv2.filter2D(enhanced, -1, kernel)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(sharpened, h=10)

    # Binarize (Otsu)
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return binary


# ---------------------------------------------------------------------------
# STEP 2: Layout Detection (contour-based region segmentation)
# ---------------------------------------------------------------------------

def detect_layout_blocks(binary: np.ndarray, min_area: int = 500) -> List[Dict]:
    """Find rectangular content regions using contour detection."""
    # Morphological dilation to merge nearby text into blocks
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 5))
    dilated = cv2.dilate(binary, kernel, iterations=1)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    blocks = []
    h_img, w_img = binary.shape

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area:
            continue

        x, y, w, h = cv2.boundingRect(cnt)
        # Filter out full-width blocks (likely background)
        if w > w_img * 0.95 and h > h_img * 0.95:
            continue
        # Filter out tiny noise
        if w < 30 or h < 10:
            continue

        blocks.append({
            "x": int(x), "y": int(y), "w": int(w), "h": int(h),
            "area": int(area),
            "cx": int(x + w / 2),
            "cy": int(y + h / 2),
        })

    # Sort top-to-bottom, then left-to-right
    blocks.sort(key=lambda b: (b["y"] // 30, b["x"]))
    return blocks


# ---------------------------------------------------------------------------
# STEP 3: OCR per region
# ---------------------------------------------------------------------------

def ocr_region(binary: np.ndarray, block: Dict) -> str:
    """Run OCR on a single cropped region."""
    try:
        import pytesseract
    except ImportError:
        return "[OCR not available — install pytesseract]"

    x, y, w, h = block["x"], block["y"], block["w"], block["h"]
    crop = binary[y:y + h, x:x + w]

    # Pad slightly for better OCR
    crop = cv2.copyMakeBorder(crop, 5, 5, 5, 5, cv2.BORDER_CONSTANT, value=255)

    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;!?@#$%^&*()_+-=[]{}|/\\ \'"-"' 
    try:
        text = pytesseract.image_to_string(crop, config=custom_config)
    except Exception:
        return "[Tesseract not installed — install Tesseract OCR engine]"

    # Clean up
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    return "\n".join(lines) if lines else ""


# ---------------------------------------------------------------------------
# STEP 4: Classify each block
# ---------------------------------------------------------------------------

def classify_block(text: str, block: Dict) -> str:
    """Determine block type: heading, metric, chart, table, sidebar, etc."""
    lines = text.split("\n")
    first_line = lines[0] if lines else ""

    # Heuristics
    if len(lines) == 1 and len(first_line) < 60:
        # Could be a heading — check font size via block height
        if block["h"] > 30:
            return "heading"
        return "label"

    if any(c.isdigit() for c in text) and len(lines) <= 3:
        # Numbers present — likely a metric card
        return "metric"

    # Check for common chart axis patterns
    chart_indicators = ["k", "%", "$", "0", "500", "1000", "1500"]
    chart_score = sum(1 for ind in chart_indicators if ind in text)
    if chart_score >= 2:
        return "chart_axis"

    if len(lines) >= 4:
        return "table"

    return "text"


# ---------------------------------------------------------------------------
# STEP 5: Generate Structured Markdown
# ---------------------------------------------------------------------------

def blocks_to_markdown(blocks: List[Dict]) -> str:
    """Convert classified blocks into hierarchy-aware markdown."""
    md_lines = []
    has_h1 = False

    for i, block in enumerate(blocks):
        text = block.get("text", "").strip()
        block_type = block.get("type", "text")

        if not text:
            continue

        if block_type == "heading":
            if not has_h1:
                md_lines.append(f"# {text}")
                has_h1 = True
            else:
                # Check if it's a sub-heading (shorter text)
                if len(text) < 40:
                    md_lines.append(f"\n## {text}")
                else:
                    md_lines.append(f"### {text}")
            continue

        if block_type == "metric":
            md_lines.append(f"- {text}")
            continue

        if block_type == "chart_axis":
            # Extract labels (non-numeric tokens)
            tokens = text.replace(",", "").split()
            labels = [t for t in tokens if not any(c.isdigit() for c in t) and len(t) > 1]
            if labels:
                for lbl in labels:
                    md_lines.append(f"  - {lbl}")
            continue

        if block_type == "table":
            md_lines.append("")
            for line in text.split("\n"):
                cells = [c.strip() for c in line.split() if c.strip()]
                if cells:
                    md_lines.append(f"| {' | '.join(cells)} |")
            md_lines.append("")
            continue

        # Default: text block
        md_lines.append(text)

    return "\n".join(md_lines)


# ---------------------------------------------------------------------------
# MAIN PIPELINE
# ---------------------------------------------------------------------------

def image_to_markdown(image_path: str) -> str:
    """Full pipeline: image → preprocess → layout → OCR → classify → markdown."""
    if not os.path.exists(image_path):
        return f"Error: file not found at {image_path}"

    img = cv2.imread(image_path)
    if img is None:
        return f"Error: could not read image at {image_path}"

    h_orig, w_orig = img.shape[:2]

    # Step 1: Preprocess
    binary = preprocess_image(img)
    h_proc, w_proc = binary.shape

    # Scale factor for coordinate mapping
    scale_x = w_orig / w_proc if w_proc != w_orig else 1
    scale_y = h_orig / h_proc if h_proc != h_orig else 1

    # Step 2: Detect layout
    blocks = detect_layout_blocks(binary)
    if not blocks:
        return "No content blocks detected — the image may be blank or unreadable."

    # Step 3: OCR each block
    for block in blocks:
        text = ocr_region(binary, block)
        block["text"] = text

    # Step 4: Classify blocks
    for block in blocks:
        block["type"] = classify_block(block.get("text", ""), block)

    # Step 5: Generate markdown
    markdown = blocks_to_markdown(blocks)

    # Add metadata header
    header = f"""---
source: {os.path.basename(image_path)}
dimensions: {w_orig}x{h_orig}
blocks_detected: {len(blocks)}
---

"""
    return header + markdown


def image_bytes_to_markdown(image_bytes: bytes, filename: str = "screenshot.png") -> str:
    """Full pipeline from raw bytes (e.g. uploaded file)."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(image_bytes)
    result = image_to_markdown(filepath)
    os.remove(filepath)
    return result
