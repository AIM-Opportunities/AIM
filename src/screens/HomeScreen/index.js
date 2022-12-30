import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { includes } from "lodash";
import CustomButton from "../../components/CustomButton";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { authentication } from "../../../firebase/firebase-config";
import { db } from "../../../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import { observer } from "mobx-react";
import { interestsStore } from "../../store/interests";

const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const [docs, setDocs] = useState([]);
  const [allDocIds, setAllDocIds] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [stickingTime, setStickingTime] = useState(0);
  const [lookingFor, setLookingFor] = useState();
  const [touchCount, setTouchCount] = useState(1);
  const [flatlistIndex, setFlatlistIndex] = useState(0);
  const [flatlistLastIndex, setFlatlistLastIndex] = useState(0);

  useEffect(() => {
    // Get the opportunities docs and filter them based on the userProfile docs
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      // Create a new array to store the filtered opportunities docs
      try {
        const newDocs = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (count < 3) {
            newDocs.push({ ...doc.data(), id: doc.id });
            count++;
            setAllDocIds((prevAllDocIds) => [...prevAllDocIds, doc.id]); // add the doc id to the allDocIds array
          }
        });
        // Randomize the array of docs
        newDocs.sort(() => Math.random() - 0.5);
        // Set the state with the newDocs array
        setDocs(newDocs);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  }, []);

  const onEndReached = () => {
    // Get the opportunities docs and filter them based on the userProfile docs
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      try {
        // Create a new array to store the remaining opportunities docs that have not been loaded
        let remainingDocs = [];
        querySnapshot.forEach((doc) => {
          if (!includes(allDocIds, doc.id)) {
            remainingDocs.push({ ...doc.data(), id: doc.id });
          }
        });

        // Randomize the remaining docs array
        remainingDocs.sort(() => Math.random() - 0.5);

        // Retrieve 3 documents or the remaining number of documents if it is less than 3
        const threeOrRest =
          remainingDocs.length >= 3 ? 3 : remainingDocs.length;
        const nextDocs = remainingDocs.slice(0, threeOrRest);

        // Update the state with the new documents
        setDocs([...docs, ...nextDocs]);

        // Add the doc ids to the allDocIds array
        setAllDocIds((prevAllDocIds) => [
          ...prevAllDocIds,
          ...nextDocs.map((doc) => doc.id),
        ]);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  };

  const buttonPress = () => {
    navigation.navigate("Profile");
  };

  // Lazy-load the screen component
  const TestScreen = lazy(() => import("../../screens/TestScreen"));

  const renderItem = ({ item }) => {
    // Check if the item is the screen you want to render
    if (item.type === "test") {
      // Render the screen component using the React.Suspense component
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <TestScreen style={styles.itemWrapper} />
        </Suspense>
      );
    }
    // Return the default rendering for the other items
    const dateAdded = new Date(item.DateAdded?.seconds * 1000).toDateString();
    return (
      <View style={styles.itemWrapper}>
        <Text>{item.Company}</Text>
        <Text>
          {item.Title}
          {`\n`}
        </Text>
        <Text>Added on: {dateAdded}</Text>
        <CustomButton text="Profile" onPress={buttonPress} />
        <Text style={{ opacity: 1 }}>{item.lookingFor}</Text>
      </View>
    );
  };

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 });
  const onViewCallBack = useCallback((viewableItems) => {
    console.log(viewableItems);
    // Use viewable items in state or as intended
    console.log("now index is " + flatlistIndex);
    let currentItem = [];

    if (
      typeof viewableItems.viewableItems[flatlistIndex] !==
        "undefined" ||
      viewableItems.viewableItems[flatlistIndex] !== null
    ) {
      currentItem = viewableItems.viewableItems[flatlistIndex];
    } else {
      setFlatlistIndex(0);
      currentItem = viewableItems.viewableItems[flatlistIndex];
    }

    setTouchCount((touchCount) => touchCount + 1);
    if (touchCount === 1) {
      // Get the current time in milliseconds
      setStartTime(parseFloat(Date.now() / 1000).toFixed(3));
      if (typeof currentItem !== "undefined" || currentItem !== null) {
        setLookingFor(currentItem);
      }
    } else if (touchCount === 2) {
      console.log(interestsStore.getInterests());
      setEndTime(parseFloat(Date.now() / 1000).toFixed(3));
      setTouchCount(0);

      if (isNaN(stickingTime)) {
        setStickingTime(0.0);
      } else {
        setStickingTime(parseFloat((endTime - startTime) * -1).toFixed(3));
      }

      if (
        typeof interestsStore.getInterests() !== "undefined" ||
        interestsStore.getInterests() !== null ||
        typeof stickingTime !== "undefined" ||
        stickingTime !== null
      ) {
        // Split the interestStore string into an array of individual interests
        const interests =
          typeof interestsStore.getInterests() === "string"
            ? interestsStore.getInterests().split(";")
            : "";
        // Split the lookingFor string into an array of individual interests
        let lookingForArray = (lookingFor ?? "").split(",");

        for (let interest of lookingForArray) {
          let found = false;
          for (let i = 0; i < interests.length; i++) {
            // Split the current interest in interestStore into name and stickingTime
            let [name, oldStickingTime] = interests[i] ?? "".split(",");
            if (isNaN(oldStickingTime) || oldStickingTime === "undefined") {
              console.log(oldStickingTime);
              break;
            } else {
              oldStickingTime = parseFloat(oldStickingTime).toFixed(3);
            }

            // Check if the current interest in lookingForArray is the same as the current interest in interestStore
            if (name === interest) {
              // If it is, add the stickingTime to the total stickingTime
              setStickingTime(
                parseFloat(oldStickingTime + stickingTime).toFixed(3)
              );
              found = true;
              interests[i] = `${name},${stickingTime}`;
              break;
            }
          }

          if (!found) {
            // If the interest was not found in interestStore, add it with the current stickingTime
            interests.push(`${interest},${stickingTime}`);
          }
        }

        // Update the interestStore variable with the updated interests array
        if (interests) {
          interestsStore.setInterests(interests.join(";"));
        } else {
        }
      }
    }
    // Use viewable items in state or as intended
  }, []); // any dependencies that require the function to be "redeclared"

  return (
    <View style={styles.container}>
      <FlatList
        onScroll={(e) => {
          let offset = e.nativeEvent.contentOffset.y + 30;
          setFlatlistIndex(parseInt(offset / Dimensions.get("window").height)); // your cell height
          if (flatlistIndex !== flatlistLastIndex) {
            setFlatlistLastIndex(flatlistIndex);
            console.log("now index is at initial ", flatlistIndex);
          } else {
          }
        }}
        data={docs}
        renderItem={renderItem}
        // onTouchStart={onTouchStart}
        // onTouchEnd={onTouchEnd}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewCallBack} // onTouchMove={() => console.log("onTouchMove")}
        // onTouchEnd={() => console.log("onTouchEnd")}
        // onScrollBeginDrag={() => console.log("onScrollBeginDrag")}
        // onScrollEndDrag={() => console.log("onScrollEndDrag")}
        // onMomentumScrollBegin={() => console.log("onMomentumScrollBegin")}
        // onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}r
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        pagingEnabled={true}
        snapToAlignment="start"
        scrollEnabled={true}
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  itemWrapper: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
});
export default HomeScreen;
