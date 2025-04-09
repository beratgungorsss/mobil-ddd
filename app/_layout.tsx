import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { initializeWordListStore } from "@/store/wordlist-store";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Initialize stores with mock data
      initializeWordListStore();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="list/[id]" 
        options={{ 
          title: "List Details",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="list/create" 
        options={{ 
          title: "Create New List",
          animation: "slide_from_bottom",
        }} 
      />
      <Stack.Screen 
        name="list/edit/[id]" 
        options={{ 
          title: "Edit List",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="word/add/[listId]" 
        options={{ 
          title: "Add Word",
          animation: "slide_from_bottom",
        }} 
      />
      <Stack.Screen 
        name="word/edit/[listId]/[wordId]" 
        options={{ 
          title: "Edit Word",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="learn/[listId]" 
        options={{ 
          title: "Learning Mode",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="quiz/[listId]" 
        options={{ 
          title: "Quiz Mode",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="quiz/results/[listId]" 
        options={{ 
          title: "Quiz Results",
          animation: "slide_from_bottom",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}