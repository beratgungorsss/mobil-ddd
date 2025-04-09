import { Stack } from "expo-router";
import { colors } from "@/constants/colors";

export default function AuthLayout() {
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
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Welcome to WordPecker",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Log In",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Create Account",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: "Reset Password",
          animation: "slide_from_right",
        }} 
      />
    </Stack>
  );
}