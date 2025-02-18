# Kosovo Price Comparison - Web Demo

## Core Functions
1. Access phone camera through web browser
2. Scan barcode using QuaggaJS (free JavaScript barcode scanner)
3. Fetch product info from Open Food Facts API
4. Display results

## Minimal Architecture
1. **Frontend Only**: 
Single HTML page with JavaScript
- HTML5 Camera API
- QuaggaJS for barcode scanning
- Fetch API for Open Food Facts calls

## Tech Stack
- HTML, CSS, JavaScript
- QuaggaJS (or zxing-js) for barcode scanning
- No backend needed
- No build process needed

## Sample Code Structure
```html
<!DOCTYPE html>
<html>
<head>
    <title>Kosovo Price Checker</title>
    <script src="quagga.min.js"></script>
</head>
<body>
    <div id="interactive" class="viewport"></div>
    <div id="result"></div>
</body>
</html>
```

This is the simplest possible version that could work as a proof of concept. You could:
1. Host it on GitHub Pages (free)
2. Access it from any phone's browser
3. Demonstrate the core functionality

The entire demo could be built in about 100 lines of code and deployed in a couple of hours. This would be perfect for validating the concept before investing in a more robust mobile app solution.

Key benefits of this approach:
- No app store approval needed
- Works on both Android and iOS
- Instant updates (no app downloads)
- Can be built and deployed very quickly
- Easy to share (just send a URL)

The only downside is that the barcode scanning might not be as reliable as a native app, but it should be good enough for demo purposes.
