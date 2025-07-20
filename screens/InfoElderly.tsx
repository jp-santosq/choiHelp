import React, { useLayoutEffect } from "react";
import { SafeAreaView, SectionList, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";

/* --------------------  Dummy data  -------------------- */

type PersonalInfo = {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Unknown";
};
const personalInfo: PersonalInfo = {
  name: "Janssen, Marie",
  age: 82,
  gender: "Female",
};

type AddressContact = {
  address: string;
  room: string;
  phone: string;
  contactPerson: string;
  contactPhone: string;
};
const addressContact: AddressContact = {
  address: "Parkzicht Care Center, Dorpsstraat 12",
  room: "Apartment B12",
  phone: "+31 6 1234 5678",
  contactPerson: "Janssen, Peter (son)",
  contactPhone: "+31 6 8765 4321",
};

type MedicalInfo = {
  allergies: string[];
  medication: string[];
  diagnoses: string[];
  mobility: string;
  aids: string[];
};
const medicalInfo: MedicalInfo = {
  allergies: ["Penicillin"],
  medication: ["Metformin (2× daily)", "Lisinopril (1× daily)"],
  diagnoses: ["Type 2 Diabetes", "Hypertension"],
  mobility: "Walker – fall risk",
  aids: ["Hearing aid", "Glasses"],
};

/* --------------------  Component  -------------------- */

export default function InfoElderly() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // pencil icon in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="pencil"
          size={24}
          color="#2F80ED"
          style={{ marginRight: 12 }}
          onPress={() =>
            navigation.navigate("AddEditMember", {
              userId: "1",
            })
          }
        />
      ),
    });
  }, [navigation]);

  const sections = [
    {
      title: "Personal Information",
      data: [
        `Name: ${personalInfo.name}`,
        `Age: ${personalInfo.age}`,
        `Gender: ${personalInfo.gender}`,
      ],
    },
    {
      title: "Address & Contact",
      data: [
        addressContact.address,
        addressContact.room,
        `Phone: ${addressContact.phone}`,
        `Emergency contact: ${addressContact.contactPerson}`,
        `Emergency phone: ${addressContact.contactPhone}`,
      ],
    },
    {
      title: "Medical Information",
      data: [
        `Allergies: ${medicalInfo.allergies.join(", ")}`,
        `Medication: ${medicalInfo.medication.join("; ")}`,
        `Diagnoses: ${medicalInfo.diagnoses.join(", ")}`,
        `Mobility: ${medicalInfo.mobility}`,
        `Aids: ${medicalInfo.aids.join(", ")}`,
      ],
    },
    {
      title: "Mental State & Behavior",
      data: ["Mild memory problems", "Sleeps poorly; often active at night"],
    },
    {
      title: "Warnings",
      data: [
        "Fall risk",
        "Should not consume grapefruit juice due to medication",
      ],
    },
    {
      title: "Daily Routine",
      data: [
        "08:00 Breakfast",
        "12:00 Lunch + medication",
        "15:00 Walk",
        "18:00 Dinner",
      ],
    },
    {
      title: "Personal Preferences",
      data: [
        "Likes classical music",
        "Prefers herbal tea",
        "Enjoys talking about gardening",
      ],
    },
    {
      title: "Additional Notes",
      data: ["Calms down with piano music", "Responds better to right ear"],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}

/* --------------------  Styles  -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    fontSize: 17,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 24,
    fontSize: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
});
