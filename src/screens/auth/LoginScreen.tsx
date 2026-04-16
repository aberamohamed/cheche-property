import { useEffect } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { colors, fontSizes, radius, spacing } from "../../utils/theme";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useLoginMutation } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required")
});

export const LoginScreen = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const mutation = useLoginMutation();

  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [router, token]);

  useEffect(() => {
    if (mutation.isError && mutation.error instanceof Error) {
      Alert.alert("Login failed", mutation.error.message);
    }
  }, [mutation.error, mutation.isError]);

  return (
    <Screen
      scrollable
      keyboardAvoiding
      keyboardShouldPersistTaps="handled"
      contentStyle={styles.screenContent}
    >
      <LinearGradient
        colors={["#ffffffff", "#ffffffff", "#ffffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <View style={styles.logoBadge}>
              <Image source={require("../../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
          <View style={styles.copyBlock}>
            {/* <View style={styles.pill}>
              <Text style={styles.pillText}>Relty Ethiopia</Text>
            </View> */}
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.subtitle}>
              Sign in to browse premium rentals, trusted agents, and carefully curated property listings.
            </Text>
          </View>

        </View>

        <View style={styles.cardShell}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign in</Text>
            <Text style={styles.cardSubtitle}>Use your email and password to continue.</Text>
            <Formik
              initialValues={{ email: "abera@cheche.et", password: "password123" }}
              validationSchema={schema}
              onSubmit={(values) => mutation.mutate(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
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
                    placeholder="Enter your password"
                    secureTextEntry
                    autoComplete="password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password ? errors.password : undefined}
                  />
                  <Button title="Sign in" loading={mutation.isPending} onPress={() => handleSubmit()} />
                </>
              )}
            </Formik>

            <Pressable onPress={() => router.push("/register")} style={styles.switchLink}>
              <Text style={styles.switchText}>
                New here? <Text style={styles.switchTextStrong}>Create an account</Text>
              </Text>
            </Pressable>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureChip}>
              <Text style={styles.featureChipText}>ETB pricing</Text>
            </View>
            <View style={styles.featureChip}>
              <Text style={styles.featureChipText}>Verified agents</Text>
            </View>
            <View style={styles.featureChip}>
              <Text style={styles.featureChipText}>Fast chat</Text>
            </View>
          </View>
        </View>

      </LinearGradient>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
    paddingBottom: spacing.xl
  },
  background: {
    flex: 1
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg
  },
  logoWrap: {
    alignItems: "center",
    // marginBottom: spacing.lg
  },
  logoBadge: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.text,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 6
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 20,
  },
  copyBlock: {
    alignItems: "flex-start"
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.lg
  },
  pillText: {
    color: colors.primary,
    fontWeight: "800",
    letterSpacing: 0.4,
    fontSize: 12
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 38,
    marginTop: spacing.md,
    alignItems: "center",
    alignSelf: "center"
  },
  subtitle: {
    marginTop: spacing.md,
    color: colors.textSoft,
    fontSize: fontSizes.md,
    lineHeight: 23,
    maxWidth: 340
  },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  featureChip: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(227, 0, 116, 0.12)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 999
  },
  featureChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },
  cardShell: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: colors.text,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)"
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4
  },
  cardSubtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg
  },
  switchLink: {
    alignItems: "center",
    marginTop: spacing.lg,
    paddingBottom: spacing.xs
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
