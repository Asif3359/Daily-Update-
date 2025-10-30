import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

export const handleGoogleLogin = async (
  setError: (arg0: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  try {
    // 1. Check if Play Services are available
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // 2. Sign in the user
    const userInfo = await GoogleSignin.signIn();

    // 3. Get the ID token from the userInfo
    const idToken = userInfo.data?.idToken;
    if (!idToken) {
      throw new Error("No ID token received from Google Sign-In");
    }

    // 4. Create a Firebase credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // 5. Sign-in the user with the credential
    await signInWithCredential(getAuth(), googleCredential);

    console.log("Signed in with Google!");

    console.log(userInfo.data?.user?.name);
    console.log(userInfo.data?.user?.photo);
    console.log(userInfo.data?.user?.email);
    console.log(userInfo.data?.user?.id);

    router.replace("/(tabs)/home" as any);
  } catch (error) {
    setError("Login with google Faield ");
    console.log("Google sign-in error: ", error);
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
};

export const handleLogin = async (
  setEmail: (arg0: string) => void,
  setPassword: (arg0: string) => void,
  setError: (arg0: string) => void,
  email: string,
  password: string,
  setIsLoading?: (loading: boolean) => void
) => {
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
    console.log("User signed in!");
    console.log(email);
    console.log(password);
    setEmail("");
    setPassword("");
    router.replace("/(tabs)/home" as any);
  } catch (error) {
    setError("Login with Faield ");
    console.log(error);
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
};

export const handleSignup = async (
  setName: (arg0: string) => void,
  setEmail: (arg0: string) => void,
  setPassword: (arg0: string) => void,
  setError: (arg0: string) => void,
  name: string,
  email: string,
  password: string,
  setIsLoading?: (loading: boolean) => void
) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    console.log("✅ User created:", user.email);
    console.log("👤 Name set to:", name);
    setName("");
    setEmail("");
    setPassword("");
    router.replace("/(tabs)/home" as any);
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      setError("That email address is already in use!");
    } else if (error.code === "auth/invalid-email") {
      setError("That email address is invalid!");
    } else {
      setError(error.message);
    }

    console.error("Signup error:", error);
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
};

export const handleLogout = async () => {
  signOut(getAuth()).then(() => {
    router.replace("/(auth)/login");
    console.log("User signed out!");
  });
};

export const updateUserProfile = async (
  newDisplayName: string, 
  setError?: (error: string) => void, 
  setSuccess?: (msg: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  try {
    if (setIsLoading) setIsLoading(true);
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error("No user currently logged in");
    }
    await updateProfile(user, { displayName: newDisplayName });
    if (setSuccess) setSuccess("Profile updated");
  } catch (err: any) {
    setError && setError(err.message || "Something went wrong");
    console.error("Profile update failed", err);
  } finally {
    setIsLoading && setIsLoading(false);
  }
};
