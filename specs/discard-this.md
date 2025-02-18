# Kosovo Supermarket Price Comparison App

Functions (From User's Perspective)
1. Point the camera at a product to instantly recognize it and show a price comparison.
2. See the local price vs. the EU price side by side, with the percentage difference highlighted.
3. Manually input a product's name or price if the camera fails to recognize it.
4. Contribute local price data by uploading photos of price tags for missing items.
5. Receive actionable feedback, like why the price difference exists or how to spread awareness.

# Architecture Breakdown
1. **Frontend**: 
Built using Flutter for cross-platform support (Android & iOS).
- Responsibilities: Camera-based scanning, fallback manual input, and price comparison UI.
2. **Backend**: 
Built with Node.js or Python (Flask/Django).
- Responsibilities: Handle image recognition, match local products with EU price data, and
manage user-contributed data.
3. **Database**: 
Firebase or PostgreSQL for data storage.
- Responsibilities: Store EU price data, user-contributed prices, and product information. Enable
offline caching for common EU prices.
4. **Image Recognition**: 
Using Google Vision API or OpenCV for identifying products.
- Responsibilities: Recognize items via barcodes or image analysis, including reading price tags.
5. **Price Data APIs**: 
Starting with Open Food Facts or supermarket-specific APIs like Rewe
(Germany) or Tesco (UK).
- Responsibilities: Fetch EU prices for comparison.
6. **Offline Functionality**: 
Preloading EU prices for common items to ensure the app works without
an internet connection.
7. **Fallback and User Contribution**:
- Manual input for unrecognized items or prices.
- User-contributed price uploads to crowdsource and expand the local database.