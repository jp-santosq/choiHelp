import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { User } from './types/User';
import { loadUsers, addUser, updateUser } from '../data/mockData';

type AddEditMemberScreenProps = NativeStackScreenProps<RootStackParamList, 'AddEditMember'>;

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .matches(/^\d{7,15}$/, 'Invalid phone number format')
    .optional(),
  emergencyContactName: Yup.string().when('emergencyContactPhone', {
    is: (val: string | undefined | null) => val != null && val.length > 0,
    then: (schema) => schema.required('Name is required if emergency phone is provided'),
    otherwise: (schema) => schema.optional(),
  }).nullable(),
});

export default function AddEditMemberScreen({ route, navigation }: AddEditMemberScreenProps) {
  const { userId } = route.params || {};

  const [initialValues, setInitialValues] = useState<User | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const users = await loadUsers();
          const userToEdit = users.find(u => u.id === userId);
          if (userToEdit) {
            setInitialValues(userToEdit);
          } else {
            Alert.alert('Error', 'Could not find the user to edit.');
            navigation.goBack();
          }
        } else {
          setInitialValues({
            id: uuidv4(),
            fullName: '',
            dateOfBirth: '',
            gender: 'Prefer not to say',
            // ... other properties
          });
        }
      } catch (error) {
        console.error("Error during useEffect:", error);
        Alert.alert("Critical Error", "An error occurred while preparing data.");
      }
    };
    fetchUser();
  }, [userId, navigation]);

  const pickImage = async (setFieldValue: (field: string, value: any) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library access is required to choose a photo.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFieldValue('photoUri', result.assets[0].uri);
    }
  };

  const handleSubmit = async (values: User) => {
    try {
      if (userId) {
        await updateUser(values);
        Alert.alert('Success', 'Member information updated successfully!');
      } else {
        await addUser(values);
        Alert.alert('Success', 'New member added successfully!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving member:', error);
      Alert.alert('Error', 'Failed to save member information.');
    }
  };

  if (!initialValues) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading form...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>{userId ? 'Edit Member Profile' : 'Add New Member'}</Text>
      <Formik
        key={initialValues.id}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TextInput style={styles.input} placeholder="Full Name" onChangeText={handleChange('fullName')} onBlur={handleBlur('fullName')} value={values.fullName} />
            {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>
                Date of Birth: {values.dateOfBirth ? values.dateOfBirth : 'Select a date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={values.dateOfBirth ? new Date(values.dateOfBirth) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFieldValue('dateOfBirth', selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
            {errors.dateOfBirth && touched.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={values.gender} onValueChange={handleChange('gender')} style={styles.picker}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
                <Picker.Item label="Prefer not to say" value="Prefer not to say" />
              </Picker>
            </View>
            {errors.gender && touched.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

            <Text style={styles.label}>Photo (Optional)</Text>
            <TouchableOpacity onPress={() => pickImage(setFieldValue)} style={styles.imagePickerButton}>
              {values.photoUri && typeof values.photoUri === 'string' ? (
                <Image source={{ uri: values.photoUri }} style={styles.pickedImage} />
              ) : (
                <MaterialCommunityIcons name="camera-plus-outline" size={50} color={Colors.gray} />
              )}
              <Text style={styles.imagePickerButtonText}>Select/Change Photo</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Address and Contact</Text>
            <TextInput style={styles.input} placeholder="Address" onChangeText={handleChange('address')} onBlur={handleBlur('address')} value={values.address} />
            <TextInput style={styles.input} placeholder="Room Number (e.g., Apt B12)" onChangeText={handleChange('room')} onBlur={handleBlur('room')} value={values.room} />
            <TextInput style={styles.input} placeholder="Phone Number" onChangeText={handleChange('phoneNumber')} onBlur={handleBlur('phoneNumber')} value={values.phoneNumber} keyboardType="phone-pad" />
            {errors.phoneNumber && touched.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            <TextInput style={styles.input} placeholder="Emergency Contact Name" onChangeText={handleChange('emergencyContactName')} onBlur={handleBlur('emergencyContactName')} value={values.emergencyContactName} />
            <TextInput style={styles.input} placeholder="Emergency Contact Phone" onChangeText={handleChange('emergencyContactPhone')} onBlur={handleBlur('emergencyContactPhone')} value={values.emergencyContactPhone} keyboardType="phone-pad" />
            {errors.emergencyContactName && touched.emergencyContactName && <Text style={styles.errorText}>{errors.emergencyContactName}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
              <Text style={styles.submitButtonText}>{userId ? 'Update Member' : 'Add Member'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, },
  contentContainer: { padding: Layout.padding, },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: Layout.margin, textAlign: 'center', },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: Layout.margin, marginBottom: 10, },
  label: { fontSize: 16, color: Colors.text, marginBottom: 5, marginTop: 10, },
  input: { backgroundColor: Colors.white, borderRadius: Layout.borderRadius, padding: Layout.padding, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, },
  datePickerButton: { backgroundColor: Colors.white, borderRadius: Layout.borderRadius, padding: Layout.padding, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', height: 50, },
  datePickerButtonText: { fontSize: 16, color: Colors.text, },
  pickerContainer: { backgroundColor: Colors.white, borderRadius: Layout.borderRadius, borderWidth: 1, borderColor: Colors.border, marginBottom: 10, overflow: 'hidden', },
  picker: { height: 50, },
  imagePickerButton: { backgroundColor: Colors.white, borderRadius: Layout.borderRadius, padding: Layout.padding, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', height: 150, },
  imagePickerButtonText: { fontSize: 16, color: Colors.primary, marginTop: 8, },
  pickedImage: { width: '100%', height: '100%', borderRadius: Layout.borderRadius - 1, position: 'absolute', },
  errorText: { fontSize: 12, color: Colors.alert, marginBottom: 5, marginTop: -5, },
  submitButton: { backgroundColor: Colors.primary, borderRadius: Layout.borderRadius, padding: Layout.padding, alignItems: 'center', marginTop: Layout.margin, },
  submitButtonText: { color: Colors.white, fontSize: 18, fontWeight: 'bold', },
});