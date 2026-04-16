import { useEffect } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/Screen";
import { colors, radius, spacing } from "../../utils/theme";
import { ListingFormValues, ListingCategory, PropertyType } from "../../types";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { FilterChip } from "../../components/FilterChip";
import { useCreatePropertyMutation, useProperty, useUpdatePropertyMutation } from "../../hooks/useProperties";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";
import { LoadingState } from "../../components/LoadingState";
import { useAuthStore } from "../../store/authStore";

const propertyTypes: PropertyType[] = ["Apartment", "Villa", "Townhouse", "Studio", "Penthouse", "Office"];
const categories: ListingCategory[] = ["rent", "sale"];

const schema = Yup.object({
  title: Yup.string().min(5, "Enter a stronger title").required("Title is required"),
  price: Yup.number().positive().required("Price is required"),
  description: Yup.string().min(20, "Add at least 20 characters").required("Description is required"),
  location: Yup.string().min(3, "Location is required").required("Location is required"),
  type: Yup.string().oneOf(propertyTypes).required("Choose a property type"),
  category: Yup.string().oneOf(categories).required("Choose a category"),
  bedrooms: Yup.number().min(0).required("Bedrooms is required"),
  bathrooms: Yup.number().min(0).required("Bathrooms is required"),
  area: Yup.number().positive().required("Area is required"),
  images: Yup.array().of(Yup.string().required()).min(1, "Add at least one image").required()
});

const initialValues: ListingFormValues = {
  title: "",
  price: "",
  description: "",
  location: "",
  type: "",
  category: "rent",
  bedrooms: "1",
  bathrooms: "1",
  area: "80",
  images: []
};

export const CreateEditListingScreen = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const params = useLocalSearchParams<{ propertyId?: string }>();
  const propertyId = typeof params.propertyId === "string" ? params.propertyId : undefined;
  const { data: existing, isLoading: loadingProperty } = useProperty(propertyId);
  const showLoading = useMinimumDisplay(loadingProperty, 3000);
  const createMutation = useCreatePropertyMutation();
  const updateMutation = useUpdatePropertyMutation(propertyId);

  useEffect(() => {
    if ((createMutation.isError || updateMutation.isError) && (createMutation.error || updateMutation.error)) {
      const message =
        (createMutation.error || updateMutation.error) instanceof Error
          ? (createMutation.error || updateMutation.error)?.message
          : "Could not save listing.";

      Alert.alert("Save failed", message ?? "Could not save listing.");
    }
  }, [createMutation.error, createMutation.isError, updateMutation.error, updateMutation.isError]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (propertyId && showLoading) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Loading listing..." />
      </Screen>
    );
  }

  const mappedInitialValues: ListingFormValues = existing
    ? {
        title: existing.title,
        price: String(existing.price),
        description: existing.description,
        location: `${existing.location}`,
        type: existing.type,
        category: existing.category,
        bedrooms: String(existing.bedrooms),
        bathrooms: String(existing.bathrooms),
        area: String(existing.area),
        images: existing.images
      }
    : initialValues;

  return (
    <Screen>
      <Formik
        initialValues={mappedInitialValues}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          if (propertyId) {
            await updateMutation.mutateAsync(values);
          } else {
            await createMutation.mutateAsync(values);
          }
          router.back();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <Input
              label="Title"
              placeholder="Modern apartment near the city center"
              value={values.title}
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              error={touched.title ? errors.title : undefined}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="Price"
                  placeholder="1200"
                  keyboardType="numeric"
                  value={values.price}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  error={touched.price ? errors.price : undefined}
                />
              </View>
              <View style={styles.half}>
                <Input
                  label="Area (m²)"
                  placeholder="120"
                  keyboardType="numeric"
                  value={values.area}
                  onChangeText={handleChange("area")}
                  onBlur={handleBlur("area")}
                  error={touched.area ? errors.area : undefined}
                />
              </View>
            </View>

            <Input
              label="Description"
              placeholder="Describe the property, amenities, and neighborhood"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              error={touched.description ? errors.description : undefined}
              style={styles.multiline}
            />

            <Input
              label="Location"
              placeholder="Bole, Addis Ababa"
              value={values.location}
              onChangeText={handleChange("location")}
              onBlur={handleBlur("location")}
              error={touched.location ? errors.location : undefined}
            />

            <Text style={styles.groupLabel}>Listing type</Text>
            <View style={styles.chips}>
              {categories.map((item) => (
                <FilterChip
                  key={item}
                  label={item === "rent" ? "For rent" : "For sale"}
                  selected={values.category === item}
                  onPress={() => setFieldValue("category", item)}
                />
              ))}
            </View>
            {touched.category && errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

            <Text style={styles.groupLabel}>Property type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {propertyTypes.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  selected={values.type === item}
                  onPress={() => setFieldValue("type", item)}
                />
              ))}
            </ScrollView>
            {touched.type && errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}

            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="Bedrooms"
                  placeholder="2"
                  keyboardType="numeric"
                  value={values.bedrooms}
                  onChangeText={handleChange("bedrooms")}
                  onBlur={handleBlur("bedrooms")}
                  error={touched.bedrooms ? errors.bedrooms : undefined}
                />
              </View>
              <View style={styles.half}>
                <Input
                  label="Bathrooms"
                  placeholder="2"
                  keyboardType="numeric"
                  value={values.bathrooms}
                  onChangeText={handleChange("bathrooms")}
                  onBlur={handleBlur("bathrooms")}
                  error={touched.bathrooms ? errors.bathrooms : undefined}
                />
              </View>
            </View>

            <Text style={styles.groupLabel}>Images</Text>
            <Button
              title="Add photos"
              variant="secondary"
              onPress={async () => {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                  Alert.alert("Permission required", "We need photo access to upload listing images.");
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsMultipleSelection: true,
                  quality: 0.8
                });

                if (!result.canceled) {
                  const uris = result.assets.map((asset) => asset.uri);
                  setFieldValue("images", [...values.images, ...uris]);
                }
              }}
            />
            {touched.images && errors.images ? <Text style={styles.error}>{errors.images as string}</Text> : null}

            <View style={styles.imageGrid}>
              {values.images.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.imageWrap}>
                  <Image source={{ uri }} style={styles.image} />
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => setFieldValue("images", values.images.filter((_, imageIndex) => imageIndex !== index))}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </View>

            <View style={styles.saveAction}>
              <Button
                title={propertyId ? "Update listing" : "Publish listing"}
                loading={createMutation.isPending || updateMutation.isPending}
                onPress={() => handleSubmit()}
              />
            </View>
          </>
        )}
      </Formik>
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md
  },
  half: {
    flex: 1
  },
  multiline: {
    minHeight: 120
  },
  groupLabel: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  error: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600"
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  imageWrap: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted
  },
  image: {
    width: "100%",
    height: "100%"
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(15,23,42,0.72)",
    alignItems: "center",
    justifyContent: "center"
  },
  saveAction: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl
  }
});
