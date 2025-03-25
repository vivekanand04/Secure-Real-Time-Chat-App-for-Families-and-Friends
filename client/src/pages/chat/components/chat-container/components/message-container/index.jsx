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

  useEffect(() => {
    // Function to fetch messages for one-on-one chats
    const getMessages = async () => {
      const response = await apiClient.post(
        // Sends a POST request to fetch messages
        FETCH_ALL_MESSAGES_ROUTE, // API endpoint for fetching messages
        {
          id: selectedChatData._id, // Sends the selected chat's ID in the request body
        },
        { withCredentials: true } // Ensures credentials (cookies, tokens) are sent with the request
      );

      if (response.data.messages) {
        // Checks if messages exist in the response
        setSelectedChatMessages(response.data.messages); // Updates state with fetched messages
      }
    };

    // Function to fetch messages for a channel chat
    const getChannelMessages = async () => {
      const response = await apiClient.get(
        // Sends a GET request to fetch channel messages
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, // API endpoint with chat ID
        { withCredentials: true } // Ensures credentials are sent
      );

      if (response.data.messages) {
        // Checks if messages exist in the response
        setSelectedChatMessages(response.data.messages); // Updates state with fetched messages
      }
    };

    // Ensures fetching only if a chat is selected
    if (selectedChatData._id) {
      if (selectedChatType === "contact")
        getMessages(); // Fetches messages for one-on-one chats
      else if (selectedChatType === "channel") getChannelMessages(); // Fetches messages for a channel
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]); // Dependencies: Runs when these values change

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    // Define a regular expression to match common image file extensions
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    // Test if the given filePath matches any of the image extensions
    return imageRegex.test(filePath);
    // Example usage
    console.log(checkIfImage("photo.jpg")); // true (valid image file)
    console.log(checkIfImage("document.pdf")); // false (not an image)
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
    link.setAttribute("download", url.split("/").pop()); // Optional: Specify a file name for the download
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob); // Clean up the URL object
    setIsDownloading(false);
    setDownloadProgress(0);
  };
  // Function to render messages in the chat window
  const renderMessages = () => {
    let lastDate = null; // Variable to store the last processed message's date

    // Loop through all selected chat messages and render them
    return selectedChatMessages.map((message, index) => {
      // Extract and format the date of the current message (YYYY-MM-DD format)
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");

      // Check if the date is different from the last message's date
      const showDate = messageDate !== lastDate;

      // Update lastDate to the current message's date for the next iteration
      lastDate = messageDate;

      return (
        <div key={index} className="">
          {/* If the date has changed, display the date as a separator */}
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {/* Display the formatted date (e.g., "February 18, 2025") */}
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {/* If the selected chat type is 'contact' (one-on-one chat), render personal messages */}
          {selectedChatType === "contact" && renderPersonalMessages(message)}

          {/* If the selected chat type is 'channel' (group chat), render channel messages */}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderPersonalMessages = (message) => {
    return (
      <div
        className={`message  ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 lg:max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
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
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5  ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {checkIfImage(message.fileUrl) ? (
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
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 flex ${getColor(
                  message.sender.color
                )} items-center justify-center rounded-full`}
              >
                {message.sender.firstName.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

            <div className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
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
