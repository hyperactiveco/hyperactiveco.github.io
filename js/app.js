document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const video = document.getElementById('video');
    const resultDiv = document.getElementById('product-info');
    let isScanning = false;
    let codeReader;

    startButton.addEventListener('click', function() {
        if (isScanning) {
            stopScanner();
            startButton.textContent = 'Start Scanner';
            isScanning = false;
        } else {
            startScanner();
            startButton.textContent = 'Stop Scanner';
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
                            await fetchProductInfo(barcode);
                        }
                    }
                    if (error && !(error instanceof ZXing.NotFoundException)) {
                        console.error(error);
                    }
                }
            );
        } catch (error) {
            console.error('Error starting scanner:', error);
            alert('Error starting scanner: ' + error.message);
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
            resultDiv.innerHTML = `Searching for barcode: ${barcode}...`;
            
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                resultDiv.innerHTML = `
                    <h3>${product.product_name || 'Unknown Product'}</h3>
                    <p>Brand: ${product.brands || 'Unknown'}</p>
                    <p>Quantity: ${product.quantity || 'Unknown'}</p>
                    ${product.image_url ? `<img src="${product.image_url}" alt="${product.product_name}" style="max-width: 200px;">` : ''}
                `;
            } else {
                resultDiv.innerHTML = `Product not found for barcode: ${barcode}`;
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            resultDiv.innerHTML = `Error fetching product information: ${error.message}`;
        }
    }
}); 