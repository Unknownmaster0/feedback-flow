// "use client";
// import { useState } from "react";

// export default function SuggestMessageUI() {

//   return (
//     <div className="p-4 border rounded-md">
//       <button
//         onClick={fetchStreamedMessages}
//         className="px-4 py-2 bg-blue-500 text-white rounded-md"
//       >
//         Get AI suggestd Messages
//       </button>

//       <div className="mt-4 p-2 border rounded-md">
//         <strong>Messages</strong>
//         <div className="text-center">
//           {messages.split("|").map((msg, idx) => (
//             <MessageRenderer msg={msg} key={idx} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MessageRenderer({ msg }: { msg: string }) {
//   return (
//     <div className="text-lg font-mono text-wrap text-zinc-800 shadow-md p-2">
//       {msg}
//     </div>
//   );
// }
