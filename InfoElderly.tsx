import React, { useLayoutEffect } from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';

/* --------------------  Dummy data  -------------------- */

type PersonalInfo = { name: string; age: number; gender: 'Man' | 'Vrouw' | 'Onbekend' };
const personalInfo: PersonalInfo = { name: 'Janssen, Marie', age: 82, gender: 'Vrouw' };

type AddressContact = { address: string; room: string; phone: string; contactPerson: string; contactPhone: string };
const addressContact: AddressContact = {
  address: 'Parkzicht Zorgcentrum, Dorpsstraat 12',
  room: 'Appartement B12',
  phone: '+31 6 1234 5678',
  contactPerson: 'Janssen, Peter (zoon)',
  contactPhone: '+31 6 8765 4321',
};

type MedicalInfo = { allergies: string[]; medication: string[]; diagnoses: string[]; mobility: string; aids: string[] };
const medicalInfo: MedicalInfo = {
  allergies: ['Penicilline'],
  medication: ['Metformine (2× daags)', 'Lisinopril (1× daags)'],
  diagnoses: ['Diabetes type 2', 'Hypertensie'],
  mobility: 'Rollator – valgevaar',
  aids: ['Hoortoestel', 'Bril'],
};

/* --------------------  Component  -------------------- */

export default function InfoElderly() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /* potlood-icoon in de header */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="pencil"
          size={24}
          color="#2F80ED"
          style={{ marginRight: 12 }}
          onPress={() =>
            navigation.navigate('Edit', {
              userId: '1', // later dynamisch
              userName: personalInfo.name,
            })
          }
        />
      ),
    });
  }, [navigation]);

  const sections = [
    {
      title: 'Persoonsgegevens',
      data: [
        `Naam: ${personalInfo.name}`,
        `Leeftijd: ${personalInfo.age}`,
        `Geslacht: ${personalInfo.gender}`,
      ],
    },
    {
      title: 'Adres & Contact',
      data: [
        addressContact.address,
        addressContact.room,
        `Tel: ${addressContact.phone}`,
        `Contactpersoon: ${addressContact.contactPerson}`,
        `Contact-tel: ${addressContact.contactPhone}`,
      ],
    },
    {
      title: 'Medische informatie',
      data: [
        `Allergieën: ${medicalInfo.allergies.join(', ')}`,
        `Medicatie: ${medicalInfo.medication.join('; ')}`,
        `Diagnoses: ${medicalInfo.diagnoses.join(', ')}`,
        `Mobiliteit: ${medicalInfo.mobility}`,
        `Hulpmiddelen: ${medicalInfo.aids.join(', ')}`,
      ],
    },
    { title: 'Mentale toestand & Gedrag', data: ['Geheugenproblemen: licht', 'Slaapt slecht; vaak nachtactief'] },
    { title: 'Waarschuwingen', data: ['Valgevaar', 'Mag geen grapefruit-sap i.v.m. medicatie'] },
    { title: 'Dagelijkse routine', data: ['08:00 Ontbijt', '12:00 Lunch + medicatie', '15:00 Wandeling', '18:00 Avondeten'] },
    { title: 'Persoonlijke voorkeuren', data: ['Houdt van klassieke muziek', 'Graag kruidenthee', 'Praat graag over tuinieren'] },
    { title: 'Overige notities', data: ['Wordt rustig van pianomuziek', 'Praat rechts-oor duidelijk'] },
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    fontSize: 17,
    fontWeight: '600',
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 24,
    fontSize: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
});
