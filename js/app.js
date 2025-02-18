document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const resultDiv = document.getElementById('product-info');
    let isScanning = false;

    startButton.addEventListener('click', function() {
        if (isScanning) {
            Quagga.stop();
            startButton.textContent = 'Start Scanner';
            isScanning = false;
        } else {
            startScanner();
            startButton.textContent = 'Stop Scanner';
            isScanning = true;
        }
    });

    function startScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector("#interactive"),
                constraints: {
                    facingMode: "environment",
                    width: 1280,
                    height: 720,
                },
            },
            locate: true,
            numOfWorkers: navigator.hardwareConcurrency || 4,
            decoder: {
                readers: [
                    "ean_reader",
                    "ean_8_reader",
                    "upc_reader",
                    "upc_e_reader"
                ],
                debug: {
                    drawBoundingBox: true,
                    showFrequency: true,
                    drawScanline: true,
                    showPattern: true
                },
                multiple: false
            },
            frequency: 10,
            locator: {
                patchSize: "medium",
                halfSample: true
            }
        }, function(err) {
            if (err) {
                console.error(err);
                alert("Error starting scanner: " + err);
                return;
            }
            Quagga.start();
        });

        Quagga.onProcessed(function(result) {
            const drawingCtx = Quagga.canvas.ctx.overlay;
            const drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                    result.boxes.filter(function(box) {
                        return box !== result.box;
                    }).forEach(function(box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "yellow", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: "red", lineWidth: 3 });
                }
            }
        });

        let lastResult = null;
        Quagga.onDetected(function(result) {
            const code = result.codeResult.code;
            
            // Prevent duplicate scans
            if (lastResult !== code) {
                lastResult = code;
                
                // Provide feedback
                navigator.vibrate && navigator.vibrate(100);
                
                // Check code format
                if (code.length >= 8) {
                    fetchProductInfo(code);
                } else {
                    resultDiv.innerHTML = "Invalid barcode detected. Please try scanning again.";
                }
            }
        });
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