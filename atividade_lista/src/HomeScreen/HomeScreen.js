import { useEffect, useState, useMemo } from "react";
import { StyleSheet, Pressable, Text, View, Image } from "react-native";
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import metadata from './../storage.medata.json';
// await AsyncStorage.removeItem(metadata.TASK.TASK);

const HomeScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const focus = useIsFocused();
    useEffect(() => { getTasks() }, [focus]);

    const getTasks = async () => {
        const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
        setTasks([...sortTasksByDateDescending(existingTaksJSON)]);
    }

    const deleteTask = async (i) => {
        tasks.splice(i, 1);
        await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
        getTasks();
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
        if (tasks) {
            return (
                <View style={styles.containerArray}>
                    {
                        tasks.map((index, i) => {
                            return (
                                <View style={styles.ArryItens}>
                                    <View
                                        onTouchStart={() => {
                                            setAsyncStorage(),
                                                navigation.navigate("Task", { idTask: i })
                                        }}
                                    >
                                        <Text style={styles.textName}>
                                            {tasks[i].taskName}
                                        </Text>

                                        <Text style={styles.textDate}>
                                            {TransformDate(tasks[i].date)}
                                        </Text>

                                    </View>


                                    <View style={styles.buttonsEdit}>
                                        <Pressable onPress={() => {
                                            setAsyncStorage()
                                            navigation.navigate("Add/Edit Task", { idTask: i })
                                        }}
                                        >
                                            <Icon
                                                name='edit' color='#FFFFFF'
                                            />
                                        </Pressable>

                                        <Pressable onPress={() => { deleteTask(i) }} >
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
                <View>

                </View>
            )
        }

    }, [tasks]);

    return (
        <View style={styles.container}>

            <Pressable style={styles.button} onPress={() => { navigation.navigate("Add/Edit Task") }}>
                <Text style={styles.buttonText}>Add Task</Text>
            </Pressable>

            {array}

        </View>
    );

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
    containerArray: {
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

export default HomeScreen;