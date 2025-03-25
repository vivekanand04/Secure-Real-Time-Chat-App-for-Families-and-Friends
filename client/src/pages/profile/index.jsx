// Importing necessary hooks, components, and utilities from the project
import { useAppStore } from "@/store"; // Importing the global state management hook for user data
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Importing Avatar components for profile picture display
import { Button } from "@/components/ui/button"; // Importing reusable Button component
import { Input } from "@/components/ui/input"; // Importing Input component for text fields
import apiClient from "@/lib/api-client"; // Importing API client to make HTTP requests

// Importing constants for API routes and the base host URL
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFLE_ROUTE,
} from "@/lib/constants";

// Importing React hooks and icons
import { useState, useRef, useEffect } from "react"; // useState for state management, useRef for file input reference, useEffect for lifecycle management
import { FaPlus, FaTrash } from "react-icons/fa"; // Importing icons for adding and deleting images
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import { toast } from "sonner"; // Importing toast notifications to display success/error messages
import { IoArrowBack } from "react-icons/io5"; // Importing back arrow icon for navigation
import { colors } from "@/lib/utils"; // Importing predefined color options for profile customization

// Defining the Profile component
const Profile = () => {
  // Extracting user information and function to update user info from global state management
  const { userInfo, setUserInfo } = useAppStore();

  // Defining state variables for managing profile data
  const [firstName, setFirstName] = useState(""); // State for storing the user's first name
  const [lastName, setLastName] = useState(""); // State for storing the user's last name
  const [image, setImage] = useState(null); // State to store the profile image URL
  const [hovered, setHovered] = useState(false); // State to track if the image is hovered for displaying delete/upload options
  const fileInputRef = useRef(null); // useRef for handling file input (hidden file upload button)
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [selectedColor, setSelectedColor] = useState(0); // State to store the selected profile color

  // useEffect runs when userInfo changes, updating the component state with user data
  useEffect(() => {
    if (userInfo.profileSetup) {
      // Checking if profile setup is completed
      setFirstName(userInfo.firstName); // Setting first name
      setLastName(userInfo.lastName); // Setting last name
      setSelectedColor(userInfo.color); // Setting selected color
    }
    if (userInfo.image) {
      // If an image exists in userInfo, set it as the profile picture
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]); // Dependency array ensures this effect runs only when userInfo changes

  // Function to validate if the required fields are filled before saving the profile
  const validateProfile = () => {
    if (!firstName) {
      // Checking if first name is empty
      toast.error("First Name is Required."); // Displaying error message
      return false; // Returning false to stop further execution
    }
    if (!lastName) {
      // Checking if last name is empty
      toast.error("Last Name is Required."); // Displaying error message
      return false; // Returning false to stop further execution
    }
    return true; // If all fields are valid, return true
  };

  // Function to save profile changes
  const saveChanges = async () => {
    if (validateProfile()) {
      // Proceed only if validation passes
      try {
        const response = await apiClient.post(
          // Sending profile update request to server
          UPDATE_PROFLE_ROUTE,
          { firstName, lastName, color: selectedColor }, // Sending updated user data
          { withCredentials: true } // Ensuring credentials are included in the request
        );
        if (response.status === 200 && response.data) {
          // Checking if response is successful
          setUserInfo({ ...response.data }); // Updating user info in global store
          toast.success("Profile Updated Successfully."); // Display success message
          navigate("/chat"); // Redirecting to chat page
        }
      } catch (error) {
        console.log(error); // Logging any errors
      }
    }
  };

  // Function to handle profile image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0]; // Getting the selected file from input
    if (file) {
      const formData = new FormData(); // Creating a FormData object, FormData object is a built-in JavaScript API that allows you to create and manipulate form data
      formData.append("profile-image", file); // Appending the selected image
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true, // Including credentials in request
      });
      if (response.status === 200 && response.data.image) {
        // If image upload is successful
        setUserInfo({ ...userInfo, image: response.data.image }); // Updating global store with new image
        toast.success("Image updated successfully."); // Displaying success message
      }
      const reader = new FileReader(); // Creating a file reader to preview the image
      reader.onloadend = () => {
        setImage(reader.result); // Setting image preview
      };
      reader.readAsDataURL(file); // Converting file to data URL
    }
  };

  // Function to remove profile image
  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true, // Sending request with credentials
      });
      if (response.status === 200) {
        // If request is successful
        setUserInfo({ ...userInfo, image: null }); // Removing image from global state
        toast.success("Image Removed Successfully."); // Display success message
        setImage(undefined); // Reset image state
      }
    } catch (error) {
      console.log({ error }); // Logging any errors
    }
  };

  // Function to open the hidden file input when user clicks on the profile image
  const handleFileInputClick = () => {
    fileInputRef.current.click(); // Triggering the hidden file input field
  };

  // Function to navigate back to chat page if profile is set up
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat"); // Redirecting to chat
    } else {
      toast.error("Please setup profile."); // Showing error message
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      {/* Main profile container */}
      <div className="w-[80vw] md:w-max flex flex-col gap-10">
        {/* Back button */}
        <IoArrowBack
          className="text-4xl text-white cursor-pointer"
          onClick={handleNavigate}
        />

        {/* Profile image and input fields */}
        <div className="grid grid-cols-2">
          {/* Profile image section */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar>
              {image ? (
                <AvatarImage src={image} alt="profile" />
              ) : (
                <div>{firstName ? firstName[0] : userInfo.email[0]}</div>
              )}
            </Avatar>
            {hovered && (
              <div onClick={image ? handleDeleteImage : handleFileInputClick}>
                {image ? <FaTrash /> : <FaPlus />}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* User input fields */}
          <div>
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
            />
            <Input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Save button */}
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;

// import { useAppStore } from "@/store";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import apiClient from "@/lib/api-client";
// import {
//   ADD_PROFILE_IMAGE_ROUTE,
//   HOST,
//   REMOVE_PROFILE_IMAGE_ROUTE,
//   UPDATE_PROFLE_ROUTE,
// } from "@/lib/constants";
// import { useState, useRef, useEffect } from "react";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { IoArrowBack } from "react-icons/io5";
// import { colors } from "@/lib/utils";

// const Profile = () => {
//   const { userInfo, setUserInfo } = useAppStore();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [image, setImage] = useState(null);
//   const [hovered, setHovered] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();
//   const [selectedColor, setSelectedColor] = useState(0);

//   useEffect(() => {
//     if (userInfo.profileSetup) {
//       setFirstName(userInfo.firstName);
//       setLastName(userInfo.lastName);
//       setSelectedColor(userInfo.color);
//     }
//     if (userInfo.image) {
//       setImage(`${HOST}/${userInfo.image}`);
//     }
//   }, [userInfo]);

//   const validateProfile = () => {
//     if (!firstName) {
//       toast.error("First Name is Required.");
//       return false;
//     }
//     if (!lastName) {
//       toast.error("Last Name is Required.");
//       return false;
//     }
//     return true;
//   };

//   const saveChanges = async () => {
//     if (validateProfile()) {
//       try {
//         const response = await apiClient.post(
//           UPDATE_PROFLE_ROUTE,
//           {
//             firstName,
//             lastName,
//             color: selectedColor,
//           },
//           { withCredentials: true }
//         );
//         if (response.status === 200 && response.data) {
//           setUserInfo({ ...response.data });
//           toast.success("Profile Updated Successfully.");
//           navigate("/chat");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("profile-image", file);
//       const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
//         withCredentials: true,
//       });
//       if (response.status === 200 && response.data.image) {
//         setUserInfo({ ...userInfo, image: response.data.image });
//         toast.success("Image updated successfully.");
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = async () => {
//     try {
//       const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         setUserInfo({ ...userInfo, image: null });
//         toast.success("Image Removed Successfully.");
//         setImage(undefined);
//       }
//     } catch (error) {
//       console.log({ error });
//     }
//   };

//   const handleFileInputClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleNavigate = () => {
//     if (userInfo.profileSetup) {
//       navigate("/chat");
//     } else {
//       toast.error("Please setup profile.");
//     }
//   };

//   return (
//     <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
//       <div className=" w-[80vw] md:w-max flex flex-col gap-10">
//         <div className="">
//           <IoArrowBack
//             className="text-4xl lg:text-6xl text-white text-opacity-90 cursor-pointer"
//             onClick={handleNavigate}
//           />
//         </div>
//         <div className=" grid grid-cols-2">
//           <div
//             className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
//             onMouseEnter={() => setHovered(true)}
//             onMouseLeave={() => setHovered(false)}
//           >
//             <Avatar className="h-32 w-32 md:w-48 md:h-48  rounded-full overflow-hidden">
//               {image ? (
//                 <AvatarImage
//                   src={image}
//                   alt="profile"
//                   className="object-cover w-full h-full bg-black"
//                 />
//               ) : (
//                 <div
//                   className={`uppercase h-32 w-32 md:w-48 md:h-48  text-5xl bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center rounded-full`}
//                 >
//                   {firstName
//                     ? firstName.split("").shift()
//                     : userInfo.email.split("").shift()}
//                 </div>
//               )}
//             </Avatar>
//             {hovered && (
//               <div
//                 className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
//                 onClick={image ? handleDeleteImage : handleFileInputClick}
//               >
//                 {image ? (
//                   <FaTrash className="text-white text-3xl cursor-pointer" />
//                 ) : (
//                   <FaPlus className="text-white text-3xl cursor-pointer" />
//                 )}
//               </div>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               onChange={handleImageChange}
//               accept=".png, .jpg, .jpeg, .svg, .webp"
//               name="profile-image"
//             />
//           </div>
//           <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
//             <div className="w-full">
//               <Input
//                 placeholder="Email"
//                 type="email"
//                 className="rounded-lg  p-6 bg-[#2c2e3b] border-none"
//                 disabled
//                 value={userInfo.email}
//               />
//             </div>
//             <div className="w-full">
//               <Input
//                 placeholder="First Name"
//                 type="text"
//                 className="rounded-lg p-6 bg-[#2c2e3b] border-none"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//               />
//             </div>
//             <div className="w-full">
//               <Input
//                 placeholder="Last Name"
//                 type="text"
//                 className="rounded-lg p-6 bg-[#2c2e3b] border-none"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//               />
//             </div>
//             <div className="w-full flex gap-5">
//               {colors.map((color, index) => (
//                 <div
//                   className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-100 ${
//                     selectedColor === index
//                       ? " outline outline-white outlin4"
//                       : ""
//                   }`}
//                   key={index}
//                   onClick={() => setSelectedColor(index)}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="w-full">
//           <Button
//             className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
//             onClick={saveChanges}
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
