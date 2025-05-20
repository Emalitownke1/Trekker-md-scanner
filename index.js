<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CYPHER-X PAIR</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    /* Body Styling */
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      color: #ffffff;
      overflow: hidden;
      background: linear-gradient(
        45deg, 
        #ff9a9e, #fad0c4, #fbc2eb, 
        #a18cd1, #fbc2eb, #43c6ac, 
        #f8ffae, #ff9a9e, #b8d8ba
      );
      background-size: 400% 400%;
      animation: gradientAnimation 15s ease infinite;
    }

    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Outer Shadowed Container */
    .outer-container {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      padding: 15px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    /* Main Container */
    .container {
      background: rgba(0, 0, 0, 0.7);
      border-radius: 15px;
      padding: 30px;
      width: 320px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), inset 0 3px 6px rgba(255, 255, 255, 0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .container:hover {
      transform: scale(1.02);
    }

    /* Header Text */
    .container h3 {
      margin: 0 0 10px;
      font-size: 22px;
      color: #ffffff;
    }

    .container h6 {
      margin: 10px 0;
      font-size: 14px;
      color: #dcdcdc;
    }

    /* Input Section */
    .input-container {
      display: flex;
      margin: 20px 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.15);
    }

    .input-container input {
      width: 70%;
      padding: 10px;
      font-size: 13px;
      border: none;
      outline: none;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
    }

  /* Placeholder Styling */
   .input-container input::placeholder {
      color: #DCDCDC; /* Light gray*/
}

    .input-container input:focus {
      background: rgba(0, 0, 0, 0.8);
    }

    .input-container button {
      width: 30%;
      background: #e63946;
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 13px;
      font-weight: bold;
    }

    .input-container button:hover {
      background: #f77f00;
    }

    /* Result Section */
    .result {
      margin-top: 10px;
      font-size: 14px;
    }

    /* Copy Button */
    .copy-btn {
      margin-top: 8px;
      padding: 7px 12px;
      background: #06d6a0;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 13px;
    }

    .copy-btn:hover {
      background: #02c39a;
    }

    /* Copied State */
    .copied {
      background: #f4a261 !important;
    }

    /* Loading Spinner */
    #loading-spinner {
      display: none;
      margin: 15px auto;
    }

    .fa-spinner {
      font-size: 20px;
      animation: spin 1.5s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>
<body>
  <div class="outer-container">
    <div class="container">
      <h3>CYPHER-X BOT PAIR</h3>
      <h6>Enter your WhatsApp number with country code</h6>
      <div class="input-container">
        <input type="number" id="number" placeholder="2547xxxxxxxx">
        <button id="submit">Request Code</button>
      </div>
      <div id="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <div class="result" id="pair"></div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js"></script>
  <script>
    const pairOutput = document.getElementById("pair");
    const submitButton = document.getElementById("submit");
    const numberInput = document.getElementById("number");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Function to copy text silently and update button
    async function copyToClipboard(text, button) {
      try {
        await navigator.clipboard.writeText(text);
        button.innerText = "Copied!";
        button.classList.add("copied");
        setTimeout(() => {
          button.innerText = "Copy";
          button.classList.remove("copied");
        }, 1500);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }

    submitButton.addEventListener("click", async () => {
      const number = numberInput.value.trim();
      if (!number) {
        pairOutput.innerHTML = `<p style="color: #e63946;">Please enter your WhatsApp number.</p>`;
        return;
      }
      if (number.length < 11) {
        pairOutput.innerHTML = `<p style="color: #e63946;">Invalid number format. Try again.</p>`;
        return;
      }

      pairOutput.innerHTML = ""; // Clear previous result
      loadingSpinner.style.display = "block";

      try {
        const response = await axios.get(`/code?number=${number}`);
        const code = response.data.code || "Service Unavailable";

        pairOutput.innerHTML = `
          <p><strong>Code:</strong> <span id="generated-code">${code}</span></p>
          <button class="copy-btn" onclick="copyToClipboard('${code}', this)">Copy</button>
        `;
      } catch (error) {
        pairOutput.innerHTML = `<p style="color: #e63946;">Failed to fetch code. Try again later.</p>`;
      } finally {
        loadingSpinner.style.display = "none";
      }
    });
  </script>
</body>
</html>
