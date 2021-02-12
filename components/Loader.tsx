import React, { Component } from 'react';
import { TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native';
import { io } from "socket.io-client/build/index"

const socket = io("wss://tvtrivia.herokuapp.com")

export default class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      currentRoom: 'Connecting...',
      roomStatus: {}
    };
  }

  componentDidMount() {
    
    socket.emit('room', 'create');

     socket.on('room', (data: object) => {
        this.setState({currentRoom: data.roomName});
     })

    socket.on('roomStatus', (roomStatus) => {
        this.setState({roomStatus: roomStatus});
        console.log(roomStatus)
    })


  }

  componentDidUpdate() {
    if (this.state.roomStatus.status == 'answer') {
      console.log('picked up answer status in state firing off timer')
        setTimeout(
          function() {
            console.log('timer ended emitting next question')
              // this.setState({ position: 1 });
              socket.emit('nextQuestion', {
                roomName: this.state.currentRoom
              });
          }
          .bind(this),
          7000
      );
  
      }
  }

  componentWillUnmount() {
    // send removeHost message
    socket.emit('removeHost');
  }

    startGame = () => {
        socket.emit('startGame', {
          roomName: this.state.currentRoom
        });
    }




  render() {

      // users list
    const renderItem = ({ item }) => (
        <Item username={item.username} color={item.color} />
      );

      const Item = ({ username, color }) => (
        <View style={[styles.item, {backgroundColor: color}]}>
          <Text style={styles.title}>{username}</Text>
        </View>
        );

              // scores list
    const renderItemScores = ({ item }) => (
      <ItemScores username={item.username} score={item.score} color={item.color} />
    );

    const ItemScores = ({ username, color, score }) => (
      <View>
        <View style={[styles.item, {backgroundColor: color}]}>
          <Text style={styles.title}>{username}: </Text>
          <Text style={styles.title}>{score}</Text>
        </View>
      </View>
      );

    const { roomStatus, currentRoom } = this.state;

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          marginTop: StatusBar.currentHeight || 0,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 50
        },
        item: {
          // backgroundColor: '#f9c2ff',
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center'
        },
        title: {
          fontSize: 32,
        },
        roomTitle: {
          fontSize: 32,
          marginBottom: 12
        },
        button: {
          alignItems: 'center',
          backgroundColor: 'lightgray',
          color: 'black',
          padding: 10,
          margin: 20,
          borderColor: 'lightgray',
          shadowRadius: 5,
          shadowOpacity: .5,
          borderWidth: 2,
          borderRadius:5
        }
      });
      
    return (

      
      <SafeAreaView style={styles.container}>
        <Text style={styles.roomTitle}>Status: {roomStatus.status}</Text>
      
      {(() => {
        switch (roomStatus.status) {
          case 'lobby':
            return (
      
            <View style={{ flex: 1, padding: 24 }}>
              
              <Text style={styles.roomTitle}>Room Key: {currentRoom}</Text>

              <FlatList
                data={roomStatus.users}
                renderItem={renderItem}
                keyExtractor={item => item.username}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={this.startGame}
                disabled={roomStatus.userCount > 1 ? false : true}
              >
              <Text>{roomStatus.userCount > 1 ? 'Start Game!' : 'Waiting for players...'}</Text>
              </TouchableOpacity>

            </View>

              

          )

    


          case 'question':
            return (
            <View style={{ flex: 1, padding: 24 }}>

              <Text style={{ fontSize: 50, marginBottom:40 }}>{roomStatus.question}</Text>
              
              <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20}}>
                  <Text style={{ padding: 10, fontSize: 40, justifyContent:'center', textAlign:'center' }}>A</Text>
                  <Text style={{ padding: 10, fontSize: 40 }}>{roomStatus.answers[0]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center' }}>B</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[1]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center', width:'100%' }}>C</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[2]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center', width:'100%' }}>C</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[3]}</Text>
                </View>
                
              </View>

              <View style={{ width:200 , marginTop: 200 }}>
                <Text style={styles.roomTitle}>Scores:</Text>

                <FlatList
                  data={roomStatus.users}
                  renderItem={renderItemScores}
                  keyExtractor={item => item.username}
                />

              </View>
            </View>
          )


          case 'answer':
            return (
              

              <View style={{ flex: 1, padding: 24 }}>

              <Text style={{ fontSize: 50, marginBottom:40 }}>{roomStatus.question}</Text>
              
              <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20, backgroundColor: (roomStatus.answers[0] == roomStatus.correct) ? 'green' : 'skyblue'}}>
                  <Text style={{ padding: 10, fontSize: 40, justifyContent:'center', textAlign:'center' }}>A</Text>
                  <Text style={{ padding: 10, fontSize: 40 }}>{roomStatus.answers[0]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20, backgroundColor: (roomStatus.answers[1] == roomStatus.correct) ? 'green' : 'skyblue'}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center' }}>B</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[1]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20, backgroundColor: (roomStatus.answers[2] == roomStatus.correct) ? 'green' : 'skyblue'}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center', width:'100%' }}>C</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[2]}</Text>
                </View>

                <View style={{flexDirection:'column', flexWrap:'wrap', backgroundColor: 'lightgray',  borderColor: 'darkgray',shadowRadius: 5,shadowOpacity: .5,borderWidth: 2,borderRadius:5, margin: 20, backgroundColor: (roomStatus.answers[3] == roomStatus.correct) ? 'green' : 'skyblue'}}>
                  <Text style={{ padding: 10, fontSize: 40, textAlign:'center', width:'100%' }}>C</Text>
                  <Text style={{ padding: 10, fontSize: 40  }}>{roomStatus.answers[3]}</Text>
                </View>

                
              </View>

              <View style={{ width:200 , marginTop: 200 }}>
                <Text style={styles.roomTitle}>Scores:</Text>

                <FlatList
                  data={roomStatus.users}
                  renderItem={renderItemScores}
                  keyExtractor={item => item.username}
                />

              </View>
            </View>


          )


          default:
            return (
      
              <View style={{ flex: 1, padding: 24 }}>
                
                <Text style={styles.roomTitle}>Room Key: {currentRoom}</Text>
                {/* <Text style={styles.roomTitle}>Status: {roomStatus.status}</Text> */}
  
                <FlatList
                  data={roomStatus.users}
                  renderItem={renderItem}
                  keyExtractor={item => item.username}
                />
  
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.startGame}
                  disabled={roomStatus.users && roomStatus.users.length > 1 ? false : true}
                >
                <Text>{roomStatus.users && roomStatus.users.length > 1 ? 'Start Game!' : 'Waiting for players...'}</Text>
                </TouchableOpacity>
  
              </View>
  
            )
        }
      })()}

    
    </SafeAreaView>
    );
  }

  
};