# Kosovo Price Checker

A simple web-based barcode scanner that uses the device's camera to scan product barcodes and fetch product information from the Open Food Facts database.

## How to Use

1. Open the app in your mobile browser
2. Click the "Start Scanner" button
3. Allow camera access when prompted
4. Point your camera at a product barcode
5. The app will automatically scan and display product information

## Technical Details

- Uses QuaggaJS for barcode scanning
- Fetches product data from Open Food Facts API
- Works on modern mobile browsers
- No installation required

## Running Locally

Simply serve the files using any HTTP server. For example, using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Notes

- The app works best with good lighting and clear barcodes
- Requires camera permission and HTTPS for camera access
- Supports EAN-13, EAN-8, UPC-A, and UPC-E barcodes 