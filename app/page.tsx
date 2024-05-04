"use client"
import Tree from "@/app/components/tree";
import Data from "@/app/components/data";

export default function Home() {
  return (
   <div className={"p-4"}>
       <div className={"h-20 flex items-center text-xl"}>
           <h2>React Tailwind Organisation Tree</h2>
       </div>
       <Tree data={Data}/>
   </div>
  );
}
