import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native"
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import metadata from '../storage.medata.json';

const Add_EditItemScreen = ({ route, navigation }) => {

    const [IDItem, setIDItem] = useState();
    const [IDTask, setIDTask] = useState();
    const [itemName, setItemName] = useState('');
    const [tasks, setTasks] = useState([]);

    const focus = useIsFocused();
    useEffect(() => { setNameTask() }, [focus]);

    const handleClick = () => {
        saveName();
    }

    const setNameTask = async () => {
        if (route.params) {
            const { idTask, idItem } = route.params;
            const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
            setTasks([...existingTaksJSON]);
            setIDItem(idItem);
            setIDTask(idTask);
            if (idItem >= 0) {
                setItemName(existingTaksJSON[idTask].itens[idItem].itemName);
            }
        }
    }

    const saveName = async () => {
        if (itemName) {
            if (IDItem >= 0) {

                if (tasks[IDTask].itens[IDItem].itemName != itemName) {
                    tasks[IDTask].itens[IDItem].itemName = itemName;
                    tasks[IDTask].itens[IDItem].date = new Date();
                    tasks[IDTask].date = new Date();
                    await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
                }
                voltar();

            }
            else {
                const newItem = {
                    itemName: itemName,
                    date: new Date()
                };
                try {
                    const jsonData = (newItem);
                    tasks[IDTask].itens = [...tasks[IDTask].itens, jsonData];
                    tasks[IDTask].date = new Date();
                    await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
                    voltar();

                } catch (e) {
                    console.log(e);
                }

            }
        } else {
            Alert.alert("Inexistent name", "Enter a name to add/edit the item");
        }
    }

    const voltar = () => {
        navigation.navigate("Task", { idTask: IDTask });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Add/Edit Item
            </Text>
            <TextInput style={styles.textInput} placeholder="Name from My new Item" value={itemName} onChangeText={setItemName} />
            <Pressable style={styles.button} onPress={() => { handleClick() }}>
                <Text style={styles.buttonText}>{IDItem >= 0 ? "Edit" : "Add"} item</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        padding: 15,
        backgroundColor: '#cce3de',
        alignItems: 'center',
        width: '100%'
    },
    text: {
        color: '#0f0f0f',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textInput: {
        width: '90%',
        borderWidth: 3,
        borderColor: 'transparent',
        borderStyle: 'solid',
        padding: 20,
        overflow: 'hidden',
        backgroundColor: '#F3F3F3',
        borderRadius: 10
    },
    button: {
        width: '50%',
        borderWidth: 3,
        borderColor: 'transparent',
        borderStyle: 'solid',
        padding: 10,
        overflow: 'hidden',
        backgroundColor: '#6b9080',
        borderRadius: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
    }
});

export default Add_EditItemScreen;