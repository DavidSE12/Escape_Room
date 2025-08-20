"use client"

import { useState, useEffect } from "react";

interface Tab {
  id: number;
  title: string;
  content: string;
}

export default function Tabs(){
  const [tabs, setTabs ] = useState<Tab[]>([]); {/* Tabs type and State starts as list  */}
  const [activeTab , setActiveTab] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);

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
  localStorage.setItem("tabss" , JSON.stringify(tabs)); // convert to JSON string and store it 
} , [tabs]); // run every time "tabs" array changes


//Add a new tab
  const addTab = () =>{
  if(tabs.length >= 15) return alert("Maximum 15 tabs allowed");
  const newTab : Tab = {
    id: counter,
    title: `Tab ${tabs.length + 1}`,
    content: "New Content",
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


return (
    <div className="grid grid-cols-5 h-screen">
        {/* Tab Header */}
        <div className = "col-span-1 flex items-center justify-center">
            <h1 className ="bg-amber-300 text-">Tab Header</h1>
            <div>
                {/* Button */}
                <div className="flex flex-col space-y-2">
                    {/* Add button */}
                    <button 
                    className="block px-3 py-1 bg-green-500 text-white rounded"
                    onClick={addTab}
                    > +
                    </button>

                    {/* Remove button */}
                    <button
                    className="block px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => {
                      if(activeTab !== null) removeTab(activeTab);
                    }}
                    > -
                    </button>
                </div>

            {/* Tab List */}
            <div className="mt-4 space-y-2 w-full">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded cursor-pointer text-center ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
        </div>
               
            </div>
        </div>
        
        {/* Tab Content */}
        <div className="col-span-1 flex items-center justify-center bg-green-300">
            TabContent
        </div>

        {/* Output */}
        <div className="col-span-3 flex items-center justify-center bg-blue-300" >
            OutPut
        </div>
    </div>
)




};