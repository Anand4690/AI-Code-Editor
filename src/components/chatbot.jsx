import React, { useState } from "react";

const Chatbot = () => {
  const [prompt, setPrompt] = useState(""); // State to store user input
  const [response, setResponse] = useState(""); // State to store API response
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [isCode, setIsCode] = useState(false); // State to determine if the response is code

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Access the API key from environment variables

  const handleInputChange = (e) => {
    setPrompt(e.target.value); // Update prompt state on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!prompt) return; // Return if prompt is empty

    setIsLoading(true); // Set loading state
    setIsCode(false); // Reset code state

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }], // Use the user's input as prompt
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Error fetching response from Gemini API");
      }

      const data = await response.json();
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        const responseText = data.candidates[0].content.parts[0].text;

        if (responseText.includes("```")) {
          setIsCode(true); // Set the response as code
          const codeSnippet = responseText.match(
            /```(?:[a-z]*\n)?([\s\S]*?)```/
          );
          setResponse(codeSnippet ? codeSnippet[1].trim() : responseText);
        } else {
          setResponse(responseText || "No output returned");
        }
      } else {
        setResponse("No valid response from the API");
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setPrompt(""); // Clear input after submission
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response); // Copy the response to clipboard
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg w-full h-full max-w-lg mx-auto flex flex-col justify-between">
      <h1 className="text-2xl font-medium text-center bg-black text-white  w-full p-3  rounded-t-xl ">
        AI Chatbot
      </h1>
      <div>
      <h2 className="text-black my-4  text-center font-bold text-xl">Hey ,How can I help you today? </h2>
      <p className="text-gray-600 mb-4 text-center text-lg">
        Ask me anything!
      </p>
      </div>
      {response && (
        <div className=" px-2">
          {/* <h2 className="px-2 text-lg font-medium text-gray-800">Response:</h2> */}
          <pre
            className={`p-4 mt-2 border rounded-lg overflow-x-auto ${
              isCode ? "bg-slate-100 " : " text-gray-600"
            }`}
          >
            {response}
          </pre>
          {isCode && (
            <button
              onClick={handleCopy}
              className=" bg-blue-500 text-white px-4 py-2 my-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Copy Code
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative">
        
  <input
    type="text"
    placeholder="Enter your prompt"
    value={prompt}
    onChange={handleInputChange}
    className="border border-gray-300 w-full px-4 py-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
    required
  />
  <button
    type="submit"
    className="absolute inset-y-0 right-0 flex items-center pr-4 focus:outline-none"
    disabled={isLoading}
  >
    {isLoading ? (
      "Loading..."
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M13.417 14H6.32184M6.12073 14.9301L4.94851 18.4317C4.30649 20.3495 3.98549 21.3084 4.21586 21.8988C4.4159 22.4117 4.84558 22.8004 5.37577 22.9485C5.9863 23.1188 6.90843 22.7038 8.7527 21.874L20.5762 16.5534C22.3763 15.7432 23.2764 15.3383 23.5545 14.7756C23.7963 14.2868 23.7963 13.7131 23.5545 13.2243C23.2764 12.6617 22.3763 12.2567 20.5762 11.4466L8.7323 6.11688C6.89359 5.28947 5.97424 4.87576 5.36432 5.04547C4.83463 5.19286 4.40501 5.5806 4.20426 6.09245C3.9731 6.68184 4.29067 7.63865 4.92584 9.55229L6.12301 13.1592C6.23209 13.4878 6.28664 13.6522 6.30817 13.8202C6.32728 13.9694 6.32708 14.1204 6.3076 14.2695C6.28563 14.4375 6.23067 14.6017 6.12073 14.9301Z" stroke="#6C737F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </button>
</form>

    
    </div>
  );
};

export default Chatbot;
  