// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import apiClient from "@/lib/api-client";
// import {
//   FETCH_ALL_MESSAGES_ROUTE,
//   GET_CHANNEL_MESSAGES,
//   HOST,
//   MESSAGE_TYPES,
// } from "@/lib/constants";
// import { getColor } from "@/lib/utils";
// import { useAppStore } from "@/store";
// import moment from "moment";
// import { useEffect, useRef, useState } from "react";
// import { IoMdArrowRoundDown } from "react-icons/io";
// import { IoCloseSharp } from "react-icons/io5";
// import { MdFolderZip } from "react-icons/md";

// const MessageContainer = () => {
//   const [showImage, setShowImage] = useState(false);
//   const [imageURL, setImageURL] = useState(null);
//   const {
//     selectedChatData,
//     setSelectedChatMessages,
//     selectedChatMessages,
//     selectedChatType,
//     userInfo,
//     setDownloadProgress,
//     setIsDownloading,
//   } = useAppStore();
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     // Function to fetch messages for one-on-one chats
//     const getMessages = async () => {
//       const response = await apiClient.post(
//         // Sends a POST request to fetch messages
//         FETCH_ALL_MESSAGES_ROUTE, // API endpoint for fetching messages
//         {
//           id: selectedChatData._id, // Sends the selected chat's ID in the request body
//         },
//         { withCredentials: true } // Ensures credentials (cookies, tokens) are sent with the request
//       );

//       if (response.data.messages) {
//         // Checks if messages exist in the response
//         setSelectedChatMessages(response.data.messages); // Updates state with fetched messages
//       }
//     };

//     // Function to fetch messages for a channel chat
//     const getChannelMessages = async () => {
//       const response = await apiClient.get(
//         // Sends a GET request to fetch channel messages
//         `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, // API endpoint with chat ID
//         { withCredentials: true } // Ensures credentials are sent
//       );

//       if (response.data.messages) {
//         // Checks if messages exist in the response
//         setSelectedChatMessages(response.data.messages); // Updates state with fetched messages
//       }
//     };

//     // Ensures fetching only if a chat is selected
//     if (selectedChatData._id) {
//       if (selectedChatType === "contact")
//         getMessages(); // Fetches messages for one-on-one chats
//       else if (selectedChatType === "channel") getChannelMessages(); // Fetches messages for a channel
//     }
//   }, [selectedChatData, selectedChatType, setSelectedChatMessages]); // Dependencies: Runs when these values change

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [selectedChatMessages]);

//   const checkIfImage = (filePath) => {
//     // Define a regular expression to match common image file extensions
//     const imageRegex =
//       /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

//     // Test if the given filePath matches any of the image extensions
//     return imageRegex.test(filePath);
//     // Example usage
//     console.log(checkIfImage("photo.jpg")); // true (valid image file)
//     console.log(checkIfImage("document.pdf")); // false (not an image)
//   };

  
//   const downloadFile = async (url) => {
//     setIsDownloading(true);
//     setDownloadProgress(0);
//     const response = await apiClient.get(`${HOST}/${url}`, {
//       responseType: "blob",
//       onDownloadProgress: (progressEvent) => {
//         const { loaded, total } = progressEvent;
//         const percentCompleted = Math.round((loaded * 100) / total);
//         setDownloadProgress(percentCompleted);
//       },
//     });
//     const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = urlBlob;
//     link.setAttribute("download", url.split("/").pop()); // Optional: Specify a file name for the download
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(urlBlob); // Clean up the URL object
//     setIsDownloading(false);
//     setDownloadProgress(0);
//   };
//   // Function to render messages in the chat window
//   const renderMessages = () => {
//     let lastDate = null; // Variable to store the last processed message's date

//     // Loop through all selected chat messages and render them
//     return selectedChatMessages.map((message, index) => {
//       // Extract and format the date of the current message (YYYY-MM-DD format)
//       const messageDate = moment(message.timestamp).format("YYYY-MM-DD");

//       // Check if the date is different from the last message's date
//       const showDate = messageDate !== lastDate;

//       // Update lastDate to the current message's date for the next iteration
//       lastDate = messageDate;

//       return (
//         <div key={index} className="">
//           {/* If the date has changed, display the date as a separator */}
//           {showDate && (
//             <div className="text-center text-gray-500 my-2">
//               {/* Display the formatted date (e.g., "February 18, 2025") */}
//               {moment(message.timestamp).format("LL")}
//             </div>
//           )}

//           {/* If the selected chat type is 'contact' (one-on-one chat), render personal messages */}
//           {selectedChatType === "contact" && renderPersonalMessages(message)}

//           {/* If the selected chat type is 'channel' (group chat), render channel messages */}
//           {selectedChatType === "channel" && renderChannelMessages(message)}
//         </div>
//       );
//     });
//   };

//   const renderPersonalMessages = (message) => {
//     return (
//       <div
//         className={`message  ${
//           message.sender === selectedChatData._id ? "text-left" : "text-right"
//         }`}
//       >
//         {message.messageType === MESSAGE_TYPES.TEXT && (
//           <div
//             className={`${
//               message.sender !== selectedChatData._id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
//             } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
//           >
//             {message.content}
//           </div>
//         )}
//         {message.messageType === MESSAGE_TYPES.FILE && (
//           <div
//             className={`${
//               message.sender !== selectedChatData._id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
//             } border inline-block p-4 rounded my-1 lg:max-w-[50%] break-words`}
//           >
//             {checkIfImage(message.fileUrl) ? (
//               <div
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setShowImage(true);
//                   setImageURL(message.fileUrl);
//                 }}
//               >
//                 <img
//                   src={`${HOST}/${message.fileUrl}`}
//                   alt=""
//                   height={300}
//                   width={300}
//                 />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center gap-5">
//                 <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
//                   <MdFolderZip />
//                 </span>
//                 <span>{message.fileUrl.split("/").pop()}</span>
//                 <span
//                   className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//                   onClick={() => downloadFile(message.fileUrl)}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="text-xs text-gray-600">
//           {moment(message.timestamp).format("LT")}
//         </div>
//       </div>
//     );
//   };

//   const renderChannelMessages = (message) => {
//     return (
//       <div
//         className={`mt-5  ${
//           message.sender._id !== userInfo.id ? "text-left" : "text-right"
//         }`}
//       >
//         {message.messageType === MESSAGE_TYPES.TEXT && (
//           <div
//             className={`${
//               message.sender._id === userInfo.id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
//             } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
//           >
//             {message.content}
//           </div>
//         )}
//         {message.messageType === MESSAGE_TYPES.FILE && (
//           <div
//             className={`${
//               message.sender._id === userInfo.id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
//             } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
//           >
//             {checkIfImage(message.fileUrl) ? (
//               <div
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setShowImage(true);
//                   setImageURL(message.fileUrl);
//                 }}
//               >
//                 <img
//                   src={`${HOST}/${message.fileUrl}`}
//                   alt=""
//                   height={300}
//                   width={300}
//                 />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center gap-5">
//                 <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
//                   <MdFolderZip />
//                 </span>
//                 <span>{message.fileUrl.split("/").pop()}</span>
//                 <span
//                   className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//                   onClick={() => downloadFile(message.fileUrl)}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//         {message.sender._id !== userInfo.id ? (
//           <div className="flex items-center justify-start gap-3">
//             <Avatar className="h-8 w-8">
//               {message.sender.image && (
//                 <AvatarImage
//                   src={`${HOST}/${message.sender.image}`}
//                   alt="profile"
//                   className="rounded-full"
//                 />
//               )}
//               <AvatarFallback
//                 className={`uppercase h-8 w-8 flex ${getColor(
//                   message.sender.color
//                 )} items-center justify-center rounded-full`}
//               >
//                 {message.sender.firstName.split("").shift()}
//               </AvatarFallback>
//             </Avatar>
//             <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

//             <div className="text-xs text-white/60">
//               {moment(message.timestamp).format("LT")}
//             </div>
//           </div>
//         ) : (
//           <div className="text-xs text-white/60 mt-1">
//             {moment(message.timestamp).format("LT")}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
//       {renderMessages()}
//       <div ref={messageEndRef} />
//       {showImage && (
//         <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
//           <div>
//             <img
//               src={`${HOST}/${imageURL}`}
//               className="h-[80vh] w-full bg-cover"
//               alt=""
//             />
//           </div>
//           <div className="flex gap-5 fixed top-0 mt-5">
//             <button
//               className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//               onClick={() => downloadFile(imageURL)}
//             >
//               <IoMdArrowRoundDown />
//             </button>
//             <button
//               className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//               onClick={() => {
//                 setShowImage(false);
//                 setImageURL(null);
//               }}
//             >
//               <IoCloseSharp />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageContainer;




import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/lib/api-client";
import {
  FETCH_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
  MESSAGE_TYPES,
} from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const {
    selectedChatData,
    setSelectedChatMessages,
    selectedChatMessages,
    selectedChatType,
    userInfo,
    setDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const messageEndRef = useRef(null);

  // ✅ Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await apiClient.delete(
        `http://localhost:8747/api/messages/delete/${messageId}`,
        { withCredentials: true }
      );

      const updatedMessages = selectedChatMessages.map((msg) =>
        msg._id === messageId
          ? { ...msg, content: "This message was deleted", deleted: true }
          : msg
      );
      setSelectedChatMessages(updatedMessages);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      const response = await apiClient.post(
        FETCH_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };

    const getChannelMessages = async () => {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} className="">
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderPersonalMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  // ✅ Personal (1:1 chat) messages
  const renderPersonalMessages = (message) => {
    const isSender = message.sender !== selectedChatData._id;

    return (
      <div
        className={`flex w-full my-2 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`relative p-1.5 break-words w-[80%] sm:w-[75%] md:w-[70%] lg:w-[60%] ${
            isSender
              ? "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          }`}
        >
          {message.deleted ? (
            <span className="italic text-gray-400">
              This message was deleted
            </span>
          ) : message.messageType === MESSAGE_TYPES.TEXT ? (
            message.content
          ) : (
            renderFileMessage(message)
          )}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {moment(message.timestamp).format("LT")}
          </div>
        </div>

        {/* 🗑 delete button */}
        {isSender && !message.deleted && (
          <button
            className="text-red-500 hover:text-red-700 ml-2"
            onClick={() => handleDeleteMessage(message._id)}
          >
            <MdDelete size={18} />
          </button>
        )}
      </div>
    );
  };

  // ✅ File messages
  const renderFileMessage = (message) => {
    return checkIfImage(message.fileUrl) ? (
      <div
        className="cursor-pointer"
        onClick={() => {
          setShowImage(true);
          setImageURL(message.fileUrl);
        }}
      >
        <img
          src={`${HOST}/${message.fileUrl}`}
          alt=""
          className="max-h-[250px] w-full object-cover rounded-lg"
        />
      </div>
    ) : (
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
          <MdFolderZip />
        </span>
        <span className="truncate">{message.fileUrl.split("/").pop()}</span>
        <span
          className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
          onClick={() => downloadFile(message.fileUrl)}
        >
          <IoMdArrowRoundDown />
        </span>
      </div>
    );
  };

  //✅ Channel messages
  // const renderChannelMessages = (message) => {
  //   const isSender = message.sender._id === userInfo.id;

  //   return (
  //     <div
  //       className={`flex w-full my-2 ${
  //         isSender ? "justify-end" : "justify-start"
  //       }`}
  //     >
  //       <div
  //         className={`relative p-3 rounded-lg border break-words w-[80%] sm:w-[75%] md:w-[70%] lg:w-[60%] ${
  //           isSender
  //             ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
  //             : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
  //         }`}
  //       >
  //         {message.deleted ? (
  //           <span className="italic text-gray-400">
  //             This message was deleted
  //           </span>
  //         ) : message.messageType === MESSAGE_TYPES.TEXT ? (
  //           message.content
  //         ) : (
  //           renderFileMessage(message)
  //         )}
  //         <div className="text-xs text-gray-500 mt-1 text-right">
  //           {moment(message.timestamp).format("LT")}
  //         </div>
  //       </div>

  //       {/* 🗑 delete button */}
  //       {isSender && !message.deleted && (
  //         <button
  //           className="text-red-500 hover:text-red-700 ml-2"
  //           onClick={() => handleDeleteMessage(message._id)}
  //         >
  //           <MdDelete size={18} />
  //         </button>
  //       )}

  //       {/* receiver info */}
  //       {!isSender && (
  //         <div className="flex items-center justify-start gap-2 ml-2">
  //           <Avatar className="h-8 w-8">
  //             {message.sender.image && (
  //               <AvatarImage
  //                 src={`${HOST}/${message.sender.image}`}
  //                 alt="profile"
  //                 className="rounded-full"
  //               />
  //             )}
  //             <AvatarFallback
  //               className={`uppercase h-8 w-8 flex ${getColor(
  //                 message.sender.color
  //               )} items-center justify-center rounded-full`}
  //             >
  //               {message.sender.firstName.split("").shift()}
  //             </AvatarFallback>
  //           </Avatar>
  //           <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  // ✅ Channel messages
const renderChannelMessages = (message) => {
  const isSender = message.sender._id === userInfo.id;

  return (
    <div
      className={`flex w-full my-2 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative p-3  break-words w-[80%] sm:w-[75%] md:w-[70%] lg:w-[60%] ${
          isSender
            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
        }`}
      >
        {/* 👤 Author info at the top */}
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            {message.sender.image ? (
              <AvatarImage
                src={`${HOST}/${message.sender.image}`}
                alt="profile"
                className="rounded-full"
              />
            ) : (
              <AvatarFallback
                className={`uppercase h-6 w-6 flex ${getColor(
                  message.sender.color
                )} items-center justify-center rounded-full text-xs`}
              >
                {message.sender.firstName.split("").shift()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-semibold text-white/70">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
        </div>

        {/* 💬 Message content */}
        {message.deleted ? (
          <span className="italic text-gray-400">
            This message was deleted
          </span>
        ) : message.messageType === MESSAGE_TYPES.TEXT ? (
          message.content
        ) : (
          renderFileMessage(message)
        )}

        {/* ⏰ Timestamp */}
        <div className="text-xs text-gray-500 mt-1 text-right">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>

      {/* 🗑 delete button */}
      {isSender && !message.deleted && (
        <button
          className="text-red-500 hover:text-red-700 ml-2"
          onClick={() => handleDeleteMessage(message._id)}
        >
          <MdDelete size={18} />
        </button>
      )}
    </div>
  );
};



  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 md:p-4 lg:px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={messageEndRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
              alt=""
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
