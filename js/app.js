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
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
            }
        }, function(err) {
            if (err) {
                console.error(err);
                alert("Error starting scanner: " + err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function(result) {
            const code = result.codeResult.code;
            fetchProductInfo(code);
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