import { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput, Button } from "react-native"
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import metadata from './../storage.medata.json';

const TaskScreen = ({ route, navigation }) => {

    const [IDTask, setIDTask] = useState(0);
    const [itens, setItens] = useState([])
    const [tasks, setTasks] = useState([])
    const [taskName, setTaskName] = useState("");

    const focus = useIsFocused();
    useEffect(() => { getItens() }, [focus]);


    const getItens = async () => {
        const { idTask } = route.params;
        if(route.params){
            setIDTask(idTask);
            const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
            setTasks(existingTaksJSON);
            setTaskName(existingTaksJSON[idTask].taskName);
            setItens(existingTaksJSON[idTask].itens);
        }
    }

    const deleteItem = async (i) => {
        itens.splice(i, 1);
        tasks[IDTask].itens = itens
        await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
        getItens();
    }

    const array = useMemo(() => {
        if (itens) {
            return (
                <View>
                    {
                        itens.map((index, i) => {
                            return (
                                <View>
                                    <Text>
                                        TASK {i + 1}º: {itens[i].itemName} - {itens[i].date}
                                    </Text>
                                    <Button title="Editar" onPress={() => navigation.navigate("Add Item", { idTask: IDTask, idItem: i  })} />
                                    <Button title="Remover" onPress={() => deleteItem(i)} />
                                </View>
                            )
                        })
                    }
                </View>
            )
        } else {
            return (
                <View>

                </View>
            )
        }

    }, [itens]);

    return (
        <View>
            <Text>
                TaskScreen: {taskName}
            </Text>
            <Button
                title="Add Item"
                onPress={() => navigation.navigate("Add Item", { idTask: IDTask })}
            />
            {array}
        </View>
    )
}

export default TaskScreen;