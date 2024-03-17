import { FlatList, Switch, View, Button, ScrollView, Text } from "react-native";

export const Todolists = ({ tasks, toggleSwitch, deleteTask }) => {
  const renderItem = ({ item }) => {
    // console.log(item);
    return (
      <View
        key={item.key}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Switch
          value={item.isDone}
          onValueChange={() => toggleSwitch(item.isDone, item.key)}
        />
        <ScrollView horizontal snapToOffsets={[1]}>
          <Text
            style={{
              fontSize: 20,
              padding: 10,
              height: 50,
              textDecorationLine: item.isDone ? "line-through" : "none",
            }}
          >
            {" "}
            {item.task}
          </Text>
        </ScrollView>
        <Button title="delete" onPress={() => deleteTask(item.key)} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={tasks} renderItem={renderItem} />
    </View>
  );
};
