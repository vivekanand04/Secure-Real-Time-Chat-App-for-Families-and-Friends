// import Background from "../../assets/login2.png";
// import Victory from "../../assets/victory.svg";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import apiClient from "@/lib/api-client";
// import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "@/store";

// const Auth = () => {
//   const navigate = useNavigate();
//   const { setUserInfo } = useAppStore();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const validateLogin = () => {
//     if (!email.length) {
//       toast.error("Email is required.");
//       return false;
//     }
//     if (!password.length) {
//       toast.error("Password is required.");
//       return false;
//     }
//     return true;
//   };
//   const validateSignup = () => {
//     if (!email.length) {
//       toast.error("Email is required.");
//       return false;
//     }
//     if (!password.length) {
//       toast.error("Password is required.");
//       return false;
//     }
//     if (password !== confirmPassword) {
//       toast.error("Password and Confirm Password should be same.");
//       return false;
//     }
//     return true;
//   };
//   const handleLogin = async () => {
//     try {
//       if (validateLogin()) {
//         const response = await apiClient.post(
//           LOGIN_ROUTE,
//           { email, password },
//           { withCredentials: true }
//         );
//         if (response.data.user.id) {
//           setUserInfo(response.data.user);
//           if (response.data.user.profileSetup) navigate("/chat");
//           else navigate("/profile");
//         } else {
//           console.log("error");
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleSignup = async () => {
//     try {
//       // Check if the signup form inputs are valid before making a request
//       if (validateSignup()) {
//         // Send a POST request to the signup route with email and password
//         const response = await apiClient.post(
//           SIGNUP_ROUTE, // API endpoint for signup
//           {
//             email, // User's email input
//             password, // User's password input
//           },
//           { withCredentials: true } // Include cookies for authentication purposes
//         );

//         // Check if the signup request was successful (HTTP status 201: Created)
//         if (response.status === 201) {
//           // Store the returned user data in state
//           setUserInfo(response.data.user);
//           // Navigate to the profile page after successful signup
//           navigate("/profile");
//         }
//       }
//     } catch (error) {
//       // Log any errors that occur during the signup process
//       console.log(error);
//     }
//   };


//   return (
//     <div className="h-[100vh] w-[100vw] flex items-center justify-center">
//       <div className="h-[80vh] bg-white  border-2 border-white  text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
//         <div className="flex flex-col gap-10 items-center justify-center">
//           <div className="flex  items-center justify-center flex-col">
//             <div className="flex  items-center justify-center">
//               <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
//               <img src={Victory} className="h-[100px]" />
//             </div>
//             <p className="font-medium text-center">
//               Fill in the details to get started with the best chat app!
//             </p>
//           </div>
//           <div className="flex items-center justify-center w-full ">
//             <Tabs defaultValue="login" className="w-3/4">
//               {" "}
//               {/* </Tabs>:Acts as a container for all tab-related components. */}
//               <TabsList className="bg-transparent rounded-none w-full ">
//                 {" "}
//                 {/* </TabsList>:Functions like a navigation bar for switching between tabs. */}
//                 <TabsTrigger
//                   className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2    rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
//                   value="login"
//                 >
//                   {/* TabsTrigger: The clickable button that switches tabs. Login */}{" "}
//                 </TabsTrigger>
//                 <TabsTrigger
//                   className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2   rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
//                   value="signup"
//                 >
//                   Signup
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="login" className="flex flex-col gap-5 mt-10">
//                 {" "}
//                 {/* <TabsContent>:Holds the content for a specific tab. */}
//                 <Input
//                   placeholder="Email"
//                   type="email"
//                   className="rounded-full p-6"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <Input
//                   placeholder="Password"
//                   type="password"
//                   className="rounded-full p-6"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Button className="rounded-full p-6" onClick={handleLogin}>
//                   Login
//                 </Button>
//               </TabsContent>
//               <TabsContent value="signup" className="flex flex-col gap-5 ">
//                 <Input
//                   placeholder="Email"
//                   type="email"
//                   className="rounded-full p-6"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <Input
//                   placeholder="Password"
//                   type="password"
//                   className="rounded-full p-6"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Input
//                   placeholder="Confirm Password"
//                   type="password"
//                   className="rounded-full p-6"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <Button className="rounded-full p-6" onClick={handleSignup}>
//                   Signup
//                 </Button>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//         <div className="hidden xl:flex justify-center items-center ">
//           <img src={Background} className="h-[700px] " />
//         </div>

//         {/* Login Signup COmponent */}
//         {/* Branding */}
//       </div>
//     </div>
//   );
// };

// export default Auth;





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";

import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ textAlign: "center", p: 5 }}>
            <Avatar
              sx={{ bgcolor: "primary.main", mx: "auto", mb: 2, width: 56, height: 56 }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Sign in or create an account to continue
            </Typography>

            {/* Tabs for login/signup */}
            <Tabs value={tab} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Signup" />
            </Tabs>

            {tab === 0 && (
              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 3 }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Box>
            )}

            {tab === 1 && (
              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 3 }}
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Auth;
