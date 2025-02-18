document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const video = document.getElementById('video');
    const resultDiv = document.getElementById('product-info');
    const statusDiv = document.getElementById('status');
    let isScanning = false;
    let codeReader;

    startButton.addEventListener('click', function() {
        if (isScanning) {
            stopScanner();
            startButton.textContent = 'Start Scanner';
            statusDiv.textContent = 'Ready to scan';
            statusDiv.className = 'status';
            isScanning = false;
        } else {
            startScanner();
            startButton.textContent = 'Stop Scanner';
            statusDiv.textContent = 'Scanning...';
            statusDiv.className = 'status scanning';
            isScanning = true;
        }
    });

    async function startScanner() {
        try {
            codeReader = new ZXing.BrowserMultiFormatReader();
            const videoConstraints = {
                facingMode: 'environment'
            };

            // Start continuous scanning
            codeReader.decodeFromConstraints(
                { video: videoConstraints },
                video,
                async (result, error) => {
                    if (result) {
                        // Provide feedback
                        navigator.vibrate && navigator.vibrate(100);
                        
                        const barcode = result.getText();
                        if (barcode && barcode.length >= 8) {
                            statusDiv.textContent = `Recognized barcode: ${barcode}`;
                            statusDiv.className = 'status recognized';
                            await fetchProductInfo(barcode);
                        }
                    }
                    if (error && !(error instanceof ZXing.NotFoundException)) {
                        console.error(error);
                        statusDiv.textContent = 'Error: ' + error.message;
                        statusDiv.className = 'status';
                    }
                }
            );
        } catch (error) {
            console.error('Error starting scanner:', error);
            alert('Error starting scanner: ' + error.message);
            statusDiv.textContent = 'Error: ' + error.message;
            statusDiv.className = 'status';
        }
    }

    function stopScanner() {
        if (codeReader) {
            codeReader.reset();
            video.srcObject = null;
        }
    }

    async function fetchProductInfo(barcode) {
        try {
            resultDiv.innerHTML = `<div class="searching">Searching for barcode: ${barcode}...</div>`;
            
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                resultDiv.innerHTML = `
                    <div class="product-found">
                        <h3>${product.product_name || 'Unknown Product'}</h3>
                        <p class="barcode">Barcode: ${barcode}</p>
                        <p class="brand">Brand: ${product.brands || 'Unknown'}</p>
                        <p class="quantity">Quantity: ${product.quantity || 'Unknown'}</p>
                        ${product.image_url ? `<img src="${product.image_url}" alt="${product.product_name}" style="max-width: 200px;">` : ''}
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="product-not-found">
                        <p>Product not found for barcode: ${barcode}</p>
                        <p class="tip">Tip: Try scanning again or make sure the barcode is clear and well-lit.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            resultDiv.innerHTML = `
                <div class="error">
                    <p>Error fetching product information: ${error.message}</p>
                    <p class="tip">Please check your internet connection and try again.</p>
                </div>
            `;
        }
    }
}); 