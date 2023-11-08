import { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native"
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import metadata from './../storage.medata.json';
const AddItemScreen = ({ route, navigation }) => {

    const [itemName, setItemName] = useState('');
    const [IDItem, setIDItem] = useState(0);
    const [IDTask, setIDTask] = useState(0);
    const [task, setTask] = useState({});
    const [tasks, setTasks] = useState([]);

    useEffect(()=>{
        console.log(itemName)
    },[itemName])

    const focus = useIsFocused();
    useEffect(() => { setNameTask() }, [focus]);

    const handleClick = () => {
        saveName();
    }

    const setNameTask = async () => {
        if (route.params) {
            const { idTask, idItem } = route.params;
            setIDTask(idTask);
            const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
            setTasks(existingTaksJSON);
            setIDItem(idItem);
            console.log("ID Item: " + IDItem);
            if(idItem){
                setItemName(existingTaksJSON[idTask].itens[idItem].itemName);
                console.log("ITENS NAME: "+itemName);
            }
            setTask[existingTaksJSON[idTask]];
            console.log("TASK: " + task);
            
        }
    }

    const saveName = async () => {

        if (!itemName) {
            const newItem = {
                itemName: itemName,
                date: new Date().toLocaleString()
            };
            try {
                const jsonData = (newItem);
                tasks[IDTask].itens = [...tasks[IDTask].itens, jsonData] 
                await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
                voltar();

            } catch (e) {
                console.log(e)
            }

        }
        else {
            tasks[IDTask].itens[IDItem].itemName = itemName;
            await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
            voltar();
        }
    }
    const voltar = () => {
        navigation.navigate("Task", { idTask: IDTask });
    }

    return (
        <View>
            <Text>
                Add/Edit ItemScreen
            </Text>
            <TextInput placeholder="Name from My new Item" value={itemName} onChangeText={setItemName} />
            <Button title="Add Task" onPress={handleClick} />
        </View>
    )
}

export default AddItemScreen;