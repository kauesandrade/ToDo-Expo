import { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, Pressable, Button } from "react-native"
import { Icon } from '@rneui/themed';
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
        if (route.params) {
            setIDTask(idTask);
            const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
            setTasks([...existingTaksJSON]);
            setTaskName(existingTaksJSON[idTask].taskName);
            setItens([...sortTasksByDateDescending(existingTaksJSON[idTask].itens)]);
        }
    }

    const deleteItem = async (type, id) => {

        if (type == "item") {
            itens.splice(id, 1);
        } else if (type == "all") {
            itens.splice(0, itens.length);
        }
        tasks[IDTask].itens = itens
        setAsyncStorage();
        getItens();
    }

    const TransformDate = (date) => {
        return new Date(date).toLocaleString();
    }

    function sortTasksByDateDescending(tasks) {
        return tasks.sort((a, b) => {
            if (new Date(a.date) >= new Date(b.date)) {
                return -1
            } else {
                return 1
            }
        });
    }

    const setAsyncStorage = async () => {
        await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
    }

    const array = useMemo(() => {
        if (itens) {
            return (
                <View style={styles.container}>
                    {
                        itens.map((item, id) => {
                            return (
                                <View key={id} style={styles.ArryItens}>
                                    <View>
                                        <Text style={styles.textName}>
                                            {item.itemName}
                                        </Text>

                                        <Text style={styles.textDate}>
                                            {TransformDate(item.date)}
                                        </Text>

                                    </View>

                                    <View style={styles.buttonsEdit}>
                                        <Pressable onPress={() => {
                                            setAsyncStorage()
                                            navigation.navigate("Add/Edit Item", { idTask: IDTask, idItem: id })
                                        }}
                                        >
                                            <Icon
                                                name='edit' color='#FFFFFF'
                                            />
                                        </Pressable>

                                        <Pressable onPress={() => { deleteItem("item", id) }} >
                                            <Icon
                                                name="delete" color='#FFFFFF'
                                            />
                                        </Pressable>
                                    </View>

                                </View>
                            )
                        })
                    }
                </View>
            )
        } else {
            return (
                <View></View>
            )
        }

    }, [itens]);

    return (
        <View style={styles.container}>

            <Text style={styles.textTittle}>
                {taskName}
            </Text>

            <Pressable style={styles.button} onPress={() => { navigation.navigate("Add/Edit Item", { idTask: IDTask }) }}>
                <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>

            <Pressable style={styles.buttonDeleteAll} onPress={() => { deleteItem("all", 0) }}>
                <Text style={styles.buttonText}>Remove All</Text>
            </Pressable>


            {array}

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
    ArryItens: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        borderWidth: 3,
        borderColor: 'transparent',
        borderStyle: 'solid',
        padding: 5,
        overflow: 'hidden',
        backgroundColor: '#6b9080',
        borderRadius: 10
    },
    textDate: {
        fontSize: 14,
        textAlign: 'center',
        color: '#fff'
    },
    textName: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    textTittle: {
        color: '#0f0f0f',
        fontSize: 30,
        fontWeight: 'bold'
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
    buttonDeleteAll: {
        width: '35%',
        borderWidth: 1,
        borderColor: 'transparent',
        borderStyle: 'solid',
        padding: 3,
        overflow: 'hidden',
        backgroundColor: '#6b9080',
        borderRadius: 10
    },
    buttonsEdit: {
        flexDirection: 'row'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
    }
});

export default TaskScreen;