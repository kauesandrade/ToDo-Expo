import { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native"
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import metadata from './../storage.medata.json';

const AddTaskScreen = ({ route, navigation }) => {

    const [taskName, setTaskName] = useState('');
    const [ID, setID] = useState(0);

    const focus = useIsFocused();
    useEffect(() => { setNameTask() }, [focus]);

    useEffect(() => {
        console.log(taskName)

    }, [taskName])

    const handleClick = () => {
        saveName();
    }

    const setNameTask = async () => {
        if (route.params) {
            const { idTask } = route.params;
            setID(idTask);
            const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
            setTaskName(existingTaksJSON[idTask].taskName);
        }
    }

    const saveName = async () => {

        if (!route.params) {
            const newTask = {
                taskName: taskName,
                itens: [],
                date: new Date().toLocaleString()
            };
            try {
                const jsonData = (newTask);
                let existingTaks = await AsyncStorage.getItem(metadata.TASK.TASK);
                let existingTaksJSON = existingTaks ? JSON.parse(existingTaks) : [];
                const updatedTaks = [...existingTaksJSON, jsonData];
                await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(updatedTaks));
                voltar();

            } catch (e) {
                console.log(e)
            }

        } else {
            let existingTaks = await AsyncStorage.getItem(metadata.TASK.TASK);
            let existingTaksJSON = existingTaks ? JSON.parse(existingTaks) : [];
            existingTaksJSON[ID].taskName = taskName;
            const updatedTaks = [...existingTaksJSON];
            await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(updatedTaks));
            voltar();
        }

    }

    const voltar = () => {
        navigation.navigate("Home")
    }

    return (
        <View>
            <Text>
                Add/Edit TaskScreen
            </Text>
            <TextInput placeholder="Name from My new list" value={taskName} onChangeText={setTaskName} />
            <Button title="Add Task" onPress={handleClick} />
        </View>
    )
}

export default AddTaskScreen;