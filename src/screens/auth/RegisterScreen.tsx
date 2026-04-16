import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { colors, fontSizes, radius, spacing } from "../../utils/theme";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useRegisterMutation } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";

const schema = Yup.object({
  name: Yup.string().min(2, "Enter your full name").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password")
});

export const RegisterScreen = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const mutation = useRegisterMutation();

  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [router, token]);

  useEffect(() => {
    if (mutation.isError && mutation.error instanceof Error) {
      Alert.alert("Account creation failed", mutation.error.message);
    }
  }, [mutation.error, mutation.isError]);

  return (
    <Screen scrollable keyboardAvoiding keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Text style={styles.title}>Create your Relty account.</Text>
        <Text style={styles.subtitle}>
          Start saving listings, publishing properties, and managing conversations in one place.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Register</Text>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={schema}
          onSubmit={(values) =>
            mutation.mutate({
              name: values.name,
              email: values.email,
              password: values.password
            })
          }
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                label="Full name"
                placeholder="Enter your full name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name ? errors.name : undefined}
              />
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email ? errors.email : undefined}
              />
              <Input
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                autoComplete="password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password ? errors.password : undefined}
              />
              <Input
                label="Confirm password"
                placeholder="Repeat password"
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />
              <Button title="Create account" loading={mutation.isPending} onPress={() => handleSubmit()} />
            </>
          )}
        </Formik>

        <Pressable onPress={() => router.push("/login")} style={styles.switchLink}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchTextStrong}>Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingBottom: spacing.xxl
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: "900",
    lineHeight: 36
  },
  subtitle: {
    marginTop: spacing.md,
    color: colors.textSoft,
    fontSize: fontSizes.md,
    lineHeight: 22
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.lg
  },
  switchLink: {
    alignItems: "center",
    marginTop: spacing.lg
  },
  switchText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600"
  },
  switchTextStrong: {
    color: colors.primary,
    fontWeight: "800"
  }
});
