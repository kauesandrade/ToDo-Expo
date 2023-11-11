import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native"
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import metadata from '../storage.medata.json';

const Add_EditTaskScreen = ({ route, navigation }) => {

    const [IDTask, setIDTask] = useState();
    const [taskName, setTaskName] = useState("");
    const [tasks, setTasks] = useState([]);

    const focus = useIsFocused();
    useEffect(() => { setNameTask() }, [focus]);

    const handleClick = () => {
        saveName();
    }

    const setNameTask = async () => {
        const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
        setTasks([...existingTaksJSON]);
        if (route.params) {
            const { idTask } = route.params;
            setIDTask(idTask);
            setTaskName(existingTaksJSON[idTask].taskName);

        }

    }

    const saveName = async () => {

        if (IDTask >= 0) {
            if (tasks[IDTask].taskName != taskName) {
                tasks[IDTask].date = new Date();
                tasks[IDTask].taskName = taskName;
                await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
            }
            voltar();

        }
        else {
            if (taskName) {
                const newTask = {
                    taskName: taskName,
                    itens: [],
                    date: new Date()
                };
                try {
                    const jsonData = (newTask);
                    const updatedTaks = [...tasks, jsonData];
                    await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(updatedTaks));
                    voltar();

                } catch (e) {
                    console.log(e);
                }
            } else {
                Alert.alert("Inexistent name", "Enter a name to add the task");
            }


        }

    }

    const voltar = () => {
        navigation.navigate("Home");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Add/Edit Task
            </Text>
            <TextInput style={styles.textInput} placeholder="Name from My new Task" value={taskName} onChangeText={setTaskName} />
            <Pressable style={styles.button} onPress={() => { handleClick() }}>
                <Text style={styles.buttonText}>{IDTask >= 0 ? "Edit" : "Add"} task</Text>
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

export default Add_EditTaskScreen;