import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import moment from 'moment';
import ActionBar from './ActionBar';
import AddBirthday from './AddBirthday';
import firebase from '../utils/firebase';
import Birthday from './Birthday';
import 'firebase/firestore';

firebase.firestore().settings({experimentalForceLongPolling: true});
const db = firebase.firestore(firebase);

export default function ListBirthday(props) {
  const {user} = props;
  const [showList, setShowList] = useState(false);
  const [birthday, setBirthday] = useState([]);
  const [pasatBirthday, setPasatBirthday] = useState([]);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    setBirthday([]);
    setPasatBirthday([]);
    db.collection(user.uid)
      .orderBy('dateBirth', 'asc')
      .get()
      .then(response => {
        const itemsArray = [];
        response.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          itemsArray.push(data);
        });
        formatData(itemsArray);
      });
    setReloadData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);

  const formatData = items => {
    const currentDate = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const birthdayTempArray = [];
    const pasatBirthdayTempArray = [];

    items.forEach(items => {
      const dateBirth = new Date(items.dateBirth.seconds * 1000); //obtenemos la fecha actual del cumpleaños que nos llega
      const dateBirthday = moment(dateBirth); //hemos creado el objeto fecha con moment
      const currentYear = moment().get('year'); //hemos obtenido el año actual
      dateBirthday.set({year: currentYear}); //y lo hemos colocado en el cumpleaños introducido
      const diffDate = currentDate.diff(dateBirthday, 'days');
      const itemTemp = items;
      itemTemp.dateBirth = dateBirthday;
      itemTemp.days = diffDate;

      if (diffDate <= 0) {
        birthdayTempArray.push(itemTemp);
      } else {
        pasatBirthdayTempArray.push(itemTemp);
      }
    });
    setBirthday(birthdayTempArray);
    setPasatBirthday(pasatBirthdayTempArray);
  };

  const deleteBirthday = birthday => {
    Alert.alert(
      'Eliminar cumpleaños',
      `¿Estas seguro de eliminar el cumpleaños de ${birthday.name} ${
        birthday.lastname
      }`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            db.collection(user.uid)
              .doc(birthday.id)
              .delete()
              .then(() => {
                setReloadData();
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      {showList ? (
        <ScrollView style={styles.ScrollView}>
          {birthday.map((item, index) => (
            <Birthday
              key={index}
              birthday={item}
              deleteBirthday={deleteBirthday}
            />
          ))}
          {pasatBirthday.map((item, index) => (
            <Birthday
              key={index}
              birthday={item}
              deleteBirthday={deleteBirthday}
            />
          ))}
        </ScrollView>
      ) : (
        <AddBirthday
          setShowList={setShowList}
          user={user}
          setReloadData={setReloadData}
        />
      )}
      <ActionBar showList={showList} setShowList={setShowList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
  ScrollView: {
    marginBottom: 50,
    width: '100%',
  },
});
