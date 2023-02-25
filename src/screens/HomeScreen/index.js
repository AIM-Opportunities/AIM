import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  createRef,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { observer } from "mobx-react";
import { interestsStore } from "../../store/firebase/interests";
import { opportunitiesStore } from "../../store/firebase/opportunities";
import { profileStore } from "../../store/firebase/profile";
import { toJS } from "mobx";
import Moment from "moment";
const HomeScreen = observer(() => {
  const navigation = useNavigation();
  const flatListRef = createRef();
  const [docs, setDocs] = useState([]);
  const [interestDocs, setInterestDocs] = useState({});
  const [birthday, setBirthday] = useState();
  const [startTime, setStartTime] = useState(0.0);
  const [endTime, setEndTime] = useState(0.0);
  const [stickingTime, setStickingTime] = useState(0.0);
  const [flatlistIndex, setFlatlistIndex] = useState(0);
  const [flatlistLastIndex, setFlatlistLastIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // this will be called every time the screen becomes focused
      interestsStore.getInterests().then((interests) => {
        // wait until Promise resolves
        setInterestDocs(toJS(interests));
      });
      profileStore.getBirthday().then((birthday) => {
        // wait until Promise resolves
        setBirthday(birthday);
      });

      return () => {
        // this will be called when the screen becomes unfocused
        // you can do any cleanup here (e.g. cancel async tasks)
      };
    }, [])
  );

  useEffect(() => {
    opportunitiesStore.getOpportunities().then((opportunities) => {
      // wait until Promise resolves and set the initial 3 opportunities
      setDocs(toJS(opportunities));
      setEndTime(Moment().valueOf());
      // setStartTime(Moment().valueOf());
      setStartTime(Moment().valueOf());
    });
  }, []);

  useEffect(() => {
    // Update the start time to the current time
    setStartTime(Moment().valueOf());
  }, [flatlistIndex]);

  const removeCurrentScreen = (type) => {
    // Make a copy of the current `docs` array
    const updatedDocs = [...docs];
    // Remove the current item from the array
    updatedDocs.splice(flatlistIndex, 1);
    // Update the state with the new array
    setDocs(updatedDocs);
    // remove the
    if (type === "birthday") {
      setBirthday(true);
    }
  };

  const scrollHandler = () => {
    // Calculate the time spent between the start and end times in milliseconds
    setEndTime(Moment().valueOf());
    // Set the stickingTime variable to the time spent between startTime and endTime
    setStickingTime(Moment(startTime).diff(Moment(endTime), "seconds"));

    // Split the lookingFor string into an array of individual interests
    let lookingForArray = (docs[flatlistIndex].lookingFor ?? "").split(",");
    for (let interest of lookingForArray) {
      // Check if the current interest is already in the interests object
      if (interestDocs[interest]) {
        // If it is, add the stickingTime to the total stickingTime for that interest
        interestDocs[interest] += parseFloat(stickingTime);
      } else {
        // If it is not, add the interest to the object with the current stickingTime
        interestDocs[interest] = parseFloat(stickingTime);
      }
    }

    // Update the interestStore variable with the updated interests object
    const combinedObject = {
      ...interestsStore.getInterests(),
      ...interestDocs,
    };
    interestsStore.setInterests(combinedObject);
  };

  const onEndReached = () => {
    opportunitiesStore.getMoreOpportunities().then((opportunities) => {
      // wait until Promise resolves and set the next 3 opportunities
      setDocs(toJS(opportunities));
    });
  };

  const FloatingComponent = () => {
    return (
      <View>
        <Text>
          {interestsStore.totalStickingTime}
          
          </Text>
      </View>
    );
  };

  const likePress = () => {
    alert("Saved!");
  };

  // Custom button
  const LikeButton = ({ title }) => (
    <TouchableOpacity onPress={likePress} style={styles.likeButton}>
      <Text style={styles.likeButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  // Lazy-load the screen components
  const TestScreen = lazy(() => import("../../screens/TestScreen"));
  const BirthdayScreen = lazy(() => import("../../screens/BirthdayScreen"));
  // Render the screen
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
    if (item.type === "birthday" && !birthday) {
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <BirthdayScreen
            removeCurrentScreen={removeCurrentScreen}
            style={styles.itemWrapper}
          />
        </Suspense>
      );
    } else if (item.type === "birthday" && birthday) {
      return;
    }

    // Return the default rendering for the other items
    const dateAdded = new Date(item.DateAdded?.seconds * 1000).toDateString();
    return (
      <View style={styles.itemWrapper}>
        <Text style={styles.title}>{item.Company}</Text>
        <Text style={styles.info}>
          <Text style={styles.infoTitle}>Job Title: </Text> {item.Title}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.infoTitle}>Description: </Text>"Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
          odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt."
        </Text>
        {/* <Text style={styles.info}><Text style={styles.infoTitle}>Looking For: </Text>{item.lookingFor}</Text> */}
        <Text style={styles.info}>
          <Text style={styles.infoTitle}>Added on: </Text>
          {dateAdded}
        </Text>
        {/* <CustomButton style={styles.button} text="Like" onPress={likePress} /> */}
        <View style={styles.paddingTop}>
          <LikeButton title="SAVE" size="sm"></LikeButton>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        <FloatingComponent />
      </View>

      <FlatList
        ref={flatListRef}
        onScroll={(e) => {
          let offset = e.nativeEvent.contentOffset.y + 30;
          setFlatlistIndex(parseInt(offset / Dimensions.get("window").height)); // your cell height
          if (flatlistIndex !== flatlistLastIndex) {
            setFlatlistLastIndex(flatlistIndex);
            scrollHandler();
          } else {
          }
        }}
        data={docs}
        renderItem={renderItem}
        // onTouchStart={onTouchStart}
        // onTouchEnd={onTouchEnd}
        // onTouchMove={() => console.log("onTouchMove")}
        // onTouchEnd={() => console.log("onTouchEnd")}
        // onScrollBeginDrag={() => console.log("onScrollBeginDrag")}
        // onScrollEndDrag={() => console.log("onScrollEndDrag")}
        //onMomentumScrollBegin={() => console.log("onMomentumScrollBegin")}
        //onMomentumScrollEnd={() => console.log("onMomentumScrollEnd")}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        pagingEnabled={true}
        snapToAlignment="start"
        scrollEnabled={true}
        decelerationRate={"fast"}
        snapToInterval={Dimensions.get("window").height}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  itemWrapper: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#495057",
    borderColor: "#000",
    borderWidth: 2,
    // alignSelf: "center",
  },
  container: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    padding: 7,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    zIndex: 999,
  },
  title: {
    // fontFamily: "MontserratRoman-Regular",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 70,
    marginBottom: 30,
    marginLeft: 10,
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 2,
    width: "88%",
    // borderBottomRightRadius: 50,
  },
  info: {
    color: "white",
    // fontFamily: "Quicksand-Regular",
    fontSize: 18,
    marginLeft: 25,
    marginRight: 25,
    paddingBottom: 5,
  },
  infoTitle: {
    color: "white",
    // fontFamily: "Quicksand-Regular",
    fontSize: 18,
    fontWeight: "bold",
  },
  likeButton: {
    padding: 15,
    backgroundColor: "#0382FF",
    color: "white",
    borderRadius: 5,
    width: "80%",
    alignSelf: "center",
  },
  likeButtonText: {
    color: "white",
    // fontFamily: "Quicksand-Regular",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  paddingTop: {
    paddingTop: 10,
  },
});
export default HomeScreen;
