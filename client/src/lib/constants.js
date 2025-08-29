// Define the base host URL for API requests, fetched from environment variables in Vite
export const HOST = import.meta.env.VITE_SERVER_URL;

// Define the WebSocket server URL, usually the same as the HOST
export const SOCKET_HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth"; 
// Defines a constant named AUTH_ROUTES with the string value "api/auth". 
// This represents the base route for authentication-related API endpoints.


// Define specific authentication routes by appending to the base AUTH_ROUTES

// export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`; // API route for user login
export const LOGIN_ROUTE = `${HOST}/${AUTH_ROUTES}/login`;
export const SIGNUP_ROUTE = `${HOST}/${AUTH_ROUTES}/signup`; // API route for user signup
export const GET_USERINFO_ROUTE = `${AUTH_ROUTES}/userinfo`; // API route to fetch user info
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`; // API route for logging out
export const UPDATE_PROFLE_ROUTE = `${AUTH_ROUTES}/update-profile`; // API route to update profile details
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`; // AUTH_ROUTES is a constant string that holds the base URL for authentication-related API endpoints.,,,,API route to upload a profile image
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`; // API route to remove profile image

// Base route for messages-related API endpoints
export const MESSAGES_ROUTES = "/api/messages";

// Define specific message-related routes
export const FETCH_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`; // API route to fetch all messages
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-file`; // API route to upload files within messages

// Base route for channel-related API endpoints
export const CHANNEL_ROUTES = "/api/channel";

// Define specific channel-related routes
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`; // API route to create a new chat channel
export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`; // API route to fetch all channels a user is part of
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`; // API route to fetch messages in a specific channel

// Base route for contacts-related API endpoints
export const CONTACTS_ROTUES = "/api/contacts";

// Define specific contacts-related routes
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROTUES}/search`; // API route to search for contacts
export const GET_CONTACTS_WITH_MESSAGES_ROUTE = `${CONTACTS_ROTUES}/get-contacts-for-list`; // API route to fetch contacts that have messages
export const GET_ALL_CONTACTS = `${CONTACTS_ROTUES}/all-contacts`; // API route to fetch all contacts

// Define message types for categorizing different types of messages
export const MESSAGE_TYPES = {
  TEXT: "text", // Represents a text message
  FILE: "file", // Represents a file attachment in a message
};

// export const HOST = import.meta.env.VITE_SERVER_URL;
// export const SOCKET_HOST = import.meta.env.VITE_SERVER_URL;

// export const AUTH_ROUTES = "api/auth";
// export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
// export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
// export const GET_USERINFO_ROUTE = `${AUTH_ROUTES}/userinfo`;
// export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
// export const UPDATE_PROFLE_ROUTE = `${AUTH_ROUTES}/update-profile`;
// export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
// export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;

// export const MESSAGES_ROUTES = "/api/messages";
// export const FETCH_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
// export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-file`;

// export const CHANNEL_ROUTES = "/api/channel";
// export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
// export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`;
// export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;

// export const CONTACTS_ROTUES = "/api/contacts";
// export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROTUES}/search`;
// export const GET_CONTACTS_WITH_MESSAGES_ROUTE = `${CONTACTS_ROTUES}/get-contacts-for-list`;
// export const GET_ALL_CONTACTS = `${CONTACTS_ROTUES}/all-contacts`;

// export const MESSAGE_TYPES = {
//   TEXT: "text",
//   FILE: "file",
// };
