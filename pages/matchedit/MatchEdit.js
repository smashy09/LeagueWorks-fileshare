import React, {useState, useReducer, useEffect} from "react";


import {View, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView} from "react-native";

import {Redirect, useLocation, useHistory} from 'react-router-native';

import MyProgressBar from "../../comps/progress_bar";
import MyHeader from "../../comps/header";
import MyLargeButton from "../../comps/buttonlarge";
import Input from "../../comps/input";
import PlayerAdminInput from "../../comps/playeradmininput";
import Addbutton from "../../comps/addbutton";
import NavBar from "../../comps/navbar"
import DatePicker from '../../comps/datepicker/DatePicker'
import CheckBox from '@react-native-community/checkbox'
import {Picker} from '@react-native-picker/picker';
import * as axios from 'react-native-axios'
import { globals } from '../../globals';
import Text from '../../comps/Text';


const styles = StyleSheet.create({
    container:{
        // position: "relative",
        // height: "100%",
        width:  380,
        // justifyContent:"center",
        alignItems: "center"
        
    },
    edits:{
        fontFamily:"Ubuntu-Light",
        marginBottom:5,
        textAlign:"center"
    },
    selectdate_cont:{
        // justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    header:{
        marginTop:50,
        width:"80%",
        height:50,
        flexDirection:"row",
        alignItems:"center",
    },
    headerspace:{
        marginRight:"25%"
    },
    set_home:{
        alignItems: "center",
        margin: 10
    },
    spacer:{
        height:120
    },
    picker:{
        // position:"relative"
        width:300,
        backgroundColor:"#ececec",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,    },
    navigation:{
        position:"absolute",
        bottom:0
    }
})

export default function MatchEdit(){
    const data = useLocation()
    const history = useHistory()
    const thisEvent = data.state.event

    const [page, updatePage] = useState({redirect: false})
    const [arenas, updateArenas] = useState({loading: true, data: []})
    const [matchArena, updateMatchArena] = useState("")
    const [user, update] = useState("")


    const initialState = {
        season_id: thisEvent.season_id,
        arena: thisEvent.arena,
        start_date: thisEvent.start_date,
        match_result: {
            home_team: thisEvent.home_team,
            away_team: thisEvent.away_team,
            home_team_win: false,
            away_team_win: false,
        }
        
    }

    const [event, dispatch] = useReducer(reducer, initialState)

    const getUser = async () => {
        const rawToken = await AsyncStorage.getItem('access_token')  
        const rawID = await AsyncStorage.getItem('user_id')
        return {access_token: rawToken, user_id: rawID}
    }

    async function getArenas(user) {
        try {
            //${globals.webserverURL}
            const access_token = user.access_token
            const result = await axios.post(`${globals.webserverURL}/database/read/arenas`, {
                access_token: access_token
            })
            if(result.data.error) {
                console.log(result.data.error)
                alert(result.data.error)
            } else {
                return result.data
            }
        } catch (err) {
            console.log(err)
        }
    }


    function reducer(event, action) {
        switch(action.type) {
            case 'match_day_arena':
                event.arena = action.value
                // console.log(user.first_name)
                return event
            case 'match_start':
                updateMatchArena(action.value)
                event.start_date = action.value
                return event
            case 'home_team_win':
                event.match_result.home_team_win = !event.match_result.home_team_win;
                return event
            case 'away_team_win':
                event.match_result.away_team_win = !event.match_result.away_team_win;
                return event;
            default:
                throw new Error('Issue with reducer in match edit.')
        }
    }


    async function updateMatch(user, match_id) {
        try {

            const result = await axios.post(`${globals.webserverURL}/database/update/match`, {
                match: {
                    match_id: match_id,
                    update: event
                },
                access_token: user.access_token
            })

            if(result.data.error) {
                console.log(result.data.error)
                alert(result.data.error)
            } else {
                console.log(result.data)
                //then 
                redirectSchedules()
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function loadPage() {

        console.log(data.state)
        updateMatchArena(thisEvent.arena)
        const user = await getUser()
        for (let player in thisEvent.home_team_players) {
            if (player.user_id == user.user_id) {
                user.home_team = true;
                user.team_id = thisEvent.home_team;
            } else {
                user.home_team = false;
                user.team_id = thisEvent.away_team;
            }
            break;
        }
        update(user)
        const arenas = await getArenas(user)
        updateArenas({loading: false, data: arenas})

    }

    const redirectSchedules = () => {
        updatePage({redirect: !page.redirect, path: "/schedule"})
    }

    useEffect(() => {
        try {
            loadPage()
        } catch (err) {
            console.log(err)
        }
    }, [])

return page.redirect ? <Redirect to={{pathname: page.path, state: page}}></Redirect> : <View style={styles.container}>

    <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
            <TouchableOpacity onPress={() => {
                    history.push("/schedule");
                    }} style={styles.headerspace}>
            <Image
            source={require ("../../public/backarrow.png")} />  
            </TouchableOpacity>
            <MyHeader 
            head="Match Edit"
            />
        </View>

        <View style={{margin:25}}>
            <MyHeader
            head={thisEvent.summary}
            />
        </View>

    <View style={{ marginBottom:15}}>
        {/* need reference to winning team/losing team, home team/away team */}
        <View style={styles.set_home}>
            <Text style={styles.edits}>Set Winner</Text>
            <Text style={styles.edits}> Home Team: {(thisEvent.summary.split(" vs. "))[0]}</Text>
            <CheckBox
                disabled={false}
                value={event.match_result.home_team_win}
                onValueChange={() => dispatch({type: "home_team_win", value: thisEvent.home_team})}
            />
        </View>
        <View style={styles.set_home}>
            <Text style={styles.edits}>Away Team: {(thisEvent.summary.split(" vs. "))[1]}</Text>
            <CheckBox
                disabled={false}
                value={event.match_result.away_team_win}
                onValueChange={() => dispatch({type: "away_team_win", value: thisEvent.away_team})}
            />
        </View>
    </View>

    <View style={{ marginBottom:15}}>
        <View style={styles.selectdate_cont}>
    <Text>Current Start Date: {thisEvent.start_date}</Text>
                <DatePicker title={"Change Start Date?"} style={styles.datePicker} defaultDate={event.start_date} setValue={(date) => dispatch({type: "match_start", value: date})}/>
        </View>
    </View>

    <View style={{ marginBottom:15}}>
        <Text style={styles.edits}>Change Event Location</Text>
        <Picker style={styles.picker}
                        selectedValue={matchArena}
                        onValueChange={((arena, index) => {
                            updateMatchArena(arena)
                            dispatch({type: "match_day_arena", value: arena})
                        })}                    >
                <Picker.Item label="Pick Arena" value={""}></Picker.Item>
                {!arenas.loading && Array.isArray(arenas.data) && arenas.data.map(arena =>
                <Picker.Item key={arena._id} label={arena.name} value={arena.name} />
                )}
        </Picker>
    </View>

    <View>
        {/* Switches */}
    </View>

    <View style={{justifyContent:"center"}}>
        
    </View>

    <View style={{
        // position:"absolute",
        // top:"75%"
    }}>
        <TouchableOpacity>
        <MyLargeButton 
        text="Update Match"
        onPress={() => updateMatch(user, thisEvent.match_id)}
        />
        </TouchableOpacity>
    </View>  

  <View style={styles.spacer} />

    </ScrollView>



    <View style={styles.navigation}>
        <NavBar active={2} />
    </View>
</View>
}



        {/* <Input 
        text="Phone Number"
        placeholder="Phone Number"
        setValue={(text) => dispatch({type: "phone_number", value: text})}
        /> */}