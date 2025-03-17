import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';

interface TimePickerProps {
  initialTime: string; // format: "HH:MM"
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ 
  initialTime, 
  onConfirm, 
  onCancel 
}) => {
  const { colors } = useTheme();
  
  // Parse the initial time string to create a Date object
  const [hours, minutes] = initialTime.split(':').map(Number);
  const initialDate = new Date();
  initialDate.setHours(hours);
  initialDate.setMinutes(minutes);
  
  const [date, setDate] = useState<Date>(initialDate);
  
  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        onCancel();
        return;
      }
    }
    
    const currentDate = selectedDate || date;
    setDate(currentDate);
    
    if (Platform.OS === 'android') {
      // On Android, we confirm immediately after selection
      handleConfirm(currentDate);
    }
  };
  
  const handleConfirm = (selectedDate: Date = date) => {
    const hours = selectedDate.getHours().toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
    onConfirm(`${hours}:${minutes}`);
  };
  
  // For iOS, we show a modal with the picker and confirm/cancel buttons
  if (Platform.OS === 'ios') {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onCancel}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Time
            </Text>
            
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={onChange}
              style={styles.picker}
              textColor={colors.text}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                onPress={onCancel}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={() => handleConfirm()}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  
  // For Android, we just show the native picker
  return (
    <DateTimePicker
      value={date}
      mode="time"
      is24Hour={true}
      display="default"
      onChange={onChange}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    elevation: 2,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TimePicker; 