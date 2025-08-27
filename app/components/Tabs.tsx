"use client"

import { useState, useEffect } from "react";
import { buildSingleFileHTML, type ExportTab } from "./ExportHTML";

interface Tab {
  id: number;
  title: string;
  content: string;
}

export default function Tabs(){
  const [tabs, setTabs ] = useState<Tab[]>([]); {/* Tabs type and State starts as list  */}
  const [activeTab , setActiveTab] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);
  const [exportHtml, setExportHtml] = useState<string>("");

  //Load from localStorage on first render
  useEffect( () => {
    const saved = localStorage.getItem("tabs");
    if(saved){
      const parsed : Tab[] = JSON.parse(saved); //convert back to JS object
      setTabs(parsed);
      if (parsed.length > 0) setActiveTab(parsed[0].id)
    }

  } , [] ) // Empty [] = run only once when component mounts

  useEffect( () => {
    localStorage.setItem("tabs" , JSON.stringify(tabs)); // convert to JSON string and store it 
  } , [tabs]); // run every time "tabs" array changes


//Add a new tab
  const addTab = () =>{ 
  if(tabs.length >= 15) return alert("Maximum 15 tabs allowed");
  const newTab : Tab = {
    id: counter,
    title: `Tab ${tabs.length + 1}`,
    content: '',
  };
  setTabs([...tabs, newTab]);
  setActiveTab(newTab.id);
  setCounter(counter + 1);
};


// Remove a tab by its ID
  const removeTab = (id:number) => {
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    // Id the active tab was removed -> switch to another
    if(activeTab === id && newTabs.length > 0){
      setActiveTab(newTabs[0].id);
    }
    else if (newTabs.length === 0){
      setActiveTab(null);
    }
  };

// Update the content of a specific tab
  const updateContent = (id: number, content: string) => {
    setTabs(tabs.map((t) => (t.id === id ? {...t,content} : t )));
  };

  const handleGenerate = () => {
  const html = buildSingleFileHTML(tabs as ExportTab[]);
  setExportHtml(html);
}

  const handleCopy = async() => {
    if(!exportHtml) return;
    await navigator.clipboard.writeText(exportHtml);
    alert("Copied");
  };

return (
    <div className="grid grid-cols-5 h-screen">
        {/* Tab Header */}
        <div className = "col-span-1 flex flex-col h-screen   ">
            <p 
            className ="p-4 font-bold text-center top-0 z-20 rounded">
              Tab Header
              </p>
            <div>
                {/* Button And Tab List */}
              <div className="flex flex-row flex-grow">
                {/* Button */}
                <div className="flex flex-col items-center p-2 space-y-2 sticky top-[64px]">
                    {/* Add button */}
                    <button 
                    className="block px-3 py-1 bg-green-500 text-white rounded"
                    onClick={addTab}
                    > Add
                    </button>

                    {/* Remove button */}
                    <button
                    className="block px-1 py-1 bg-red-500 text-white rounded"
                    onClick={() => {
                      if(activeTab !== null) removeTab(activeTab);
                    }}
                    > Delete
                    </button>
                </div>

            {/* Tab List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 ">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded cursor-pointer text-center transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground "
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
          </div>
        </div>
               
            </div>
        </div>
        
        {/* Tab Content */} 
        <div className="col-span-1 flex flex-col top-0 items-center p-4">
        <h1 className="font-bold pb-6">Tab Content</h1>
        {activeTab !== null && (
        <textarea
            className="w-full h-40 p-2 border rounded"
            placeholder="Write your content here..."
            value={tabs.find((t) => t.id === activeTab)?.content || ""}
            onChange={(e) => updateContent(activeTab, e.target.value)}
        />
        )}
        </div>

        {/* Output */}
        <div className="col-span-3 flex flex-col items-center" >
            <h1 className="font-bold text-center"> Output Code </h1>
            <div className="flex gap-3 p-1" >
              <button className={`px-3 py-1 rounded text-white ${
                tabs.length === 0 ? "bg-black/60 cursor-not-allowed" : "bg-black"}`} 
                  onClick={handleGenerate}
                  disabled={tabs.length === 0}
                  title={tabs.length === 0 ? "Add at least one tab first" : "Generate a single-file HTML"}
                  >
            Generate HTML
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
            onClick={handleCopy}
            disabled={!exportHtml}
          >
            Copy
          </button>
            </div>
            {tabs.length === 0 ? (
              <p className="mt-3 text-sm opacity-70">Add at least one tab to enable export.</p>
              ) : exportHtml ? (
            <textarea
            readOnly
            className="w-[95%] h-[420px] p-3 rounded border"
            placeholder="Click “Generate HTML” to produce code…"
            value={exportHtml}
            />
      ) : (
        <p className="mt-3 text-sm opacity-70">Click “Generate HTML” to produce code.</p>
      )}
        </div>
    </div>
)
};