import { useEffect, useState, useMemo } from "react";
import { Button, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import metadata from './../storage.medata.json';
// await AsyncStorage.removeItem(metadata.TASK.TASK);

const HomeScreen = ({ navigation }) =>{
    const [tasks, setTasks] = useState([]);
    const focus = useIsFocused();
    useEffect(() => { getTasks() }, [focus]);

    const getTasks = async () =>{
        // await AsyncStorage.removeItem(metadata.TASK.TASK);
        const existingTaksJSON = JSON.parse(await AsyncStorage.getItem(metadata.TASK.TASK));
        console.log(existingTaksJSON);
        setTasks(existingTaksJSON);
    }

    const deleteTask = async (i) =>{
        tasks.splice(i, 1);
        await AsyncStorage.setItem(metadata.TASK.TASK, JSON.stringify(tasks));
        getTasks();
    }

    const array = useMemo(()=>{
        if(tasks){
            return(
                <View>
                    {
                        tasks.map((index, i)=> {
                            return(
                                <View>
                                    <Text onPress={() => navigation.navigate("Task", {idTask: i})}>
                                        TASK {i + 1}º: {tasks[i].taskName} - {tasks[i].date}
                                    </Text>
                                    <Button  title="Editar" onPress={() => navigation.navigate("Add Task", {idTask: i})}/>
                                    <Button  title="Remover" onPress={() => deleteTask(i)}/>
                                </View>
                            )
                        })
                    }
                </View>
            )
        }else{
            return(
                <View>
                    
                </View>
            )
        }
       
    }, [tasks]);

    return(
        <View>
            <Button 
                title="Add Task"
                onPress={() => navigation.navigate("Add Task")}
            />

            {array}

        </View>
    );

}

export default HomeScreen;