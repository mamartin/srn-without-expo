// @flow
import React from "react"
import { StyleSheet, Platform, Animated, View, Text } from "react-native"
import { connect } from "react-redux"

// data
import moviesData from "../../mock/movies"

// components
import { RoundedButton, ListItem } from "../components"
import { Colors } from "../themes"

// redux
import { onGetMovies } from "../redux/MoviesRedux"

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = 60
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  bar: {
    backgroundColor: "transparent",
    marginTop: Platform.OS === "ios" ? 28 : 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: Platform.OS !== "ios" ? HEADER_MAX_HEIGHT : 0,
  },
})

type Props = {
  movies: Array<*>,
  onGetMovies: typeof onGetMovies,
  navigation: any,
}

class RootContainer extends React.PureComponent<Props> {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props)

    this.state = {
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0,
      ),
    }
  }

  renderScrollViewContent = () => {
    const { movies } = this.props
    return (
      <View style={styles.scrollViewContent}>
        {movies.map((movie, index) => (
          <ListItem
            onPress={() => this.navigate(movie.id)}
            testID={`movieLink${index}`}
            key={movie.id}
          >
            {movie.title}
          </ListItem>
        ))}
      </View>
    )
  }

  navigate = movieId => {
    const { navigation } = this.props
    navigation.navigate("Detail", { movieId })
  }

  render() {
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0,
    )

    return (
      <View style={styles.fill}>
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
        >
          {this.renderScrollViewContent()}
        </Animated.ScrollView>
        <Animated.View pointerEvents="none" style={[styles.header]}>
          <Animated.Image
            style={[styles.backgroundImage]}
            source={{ uri: "https://placekitten.com/500/300" }}
          />
        </Animated.View>
        <Animated.View style={[styles.bar]}>
          <Text style={styles.title}>Title</Text>
        </Animated.View>
        <RoundedButton onPress={() => this.props.onGetMovies(moviesData)}>
          Download Movies
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  movies: state.movies.items,
})

const mapDispatchToProps = {
  onGetMovies,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootContainer)
