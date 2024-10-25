import React from "react";
import Navbar from "./navbar";
import CodeEditor from "./codeditor";
import Chatbot from "./chatbot";

const Layout = () => {
  return (
    <div className="h-screen bg-gray-50">
      <Navbar />
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CodeEditor />
          {/* <Terminal /> */}
        </div>
        <div>
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Layout;
