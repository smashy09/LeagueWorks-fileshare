import React, { useState, useReducer, useEffect } from "react";
import {View, StyleSheet, Image, AsyncStorage, ScrollView, TouchableOpacity} from "react-native";
import { Redirect, useLocation, history, useHistory } from 'react-router-native'
import * as axios from 'react-native-axios'

import { globals } from '../../globals'


import MyProgressBar from "../../comps/progress_bar";
import MyHeader from "../../comps/header";
import Avatar from "../../comps/Avatar";
import Input from "../../comps/input";
import MyLargeButton from "../../comps/buttonlarge";
import NavBar from "../../comps/navbar"


const styles = StyleSheet.create({
    container: {
        height: "100%",
        marginTop: 50

    },
    topCont: {
        justifyContent: "center",
        alignItems: "center",
    },
    bottomCont: {
        alignItems: "center",
        // marginTop: 30
    },
    inputMargin: {
        // marginBottom: 20
    },
    buttonMargin: {
        // marginTop: 20
    },
    name: {
        // marginBottom: 20,
        flexDirection: "row"
    },
    spacer: {
        height: 30
    }
    
})

export default function LeagueReg ({}) {
    const [user, update] = useState("")
    const [page, updatePage] = useState({redirect: false})

    const redirect = () => {
        updatePage({redirect: !page.redirect, path: "/leagues"})
    }

    const getUser = async () => {
        const rawToken = await AsyncStorage.getItem('access_token')  
        const rawID = await AsyncStorage.getItem('user_id')
        return {access_token: rawToken, user_id: rawID}
    }
    
    useEffect(() => {
        try {
            update(getUser)
        } catch (err) {
            console.log(err)
        }
    }, [])

    const initialState = {
        league_name: "",
        phone_number: "",
        email: "",
        sport_type: "",
        thumbnail_link: ""
    }

    function reducer(league, action) {
        switch(action.type) {
            case 'league_name':
                league.league_name = action.value
                // console.log(user.first_name)
                return league
            case 'phone_number':
                league.phone_number = action.value
                return league
            case 'sport_type': 
                league.sport_type = action.value
                return league
            case 'email':
                league.email = action.value
                return league
            case 'headline':
                league.headline = action.value
                return league
            case 'thumbnail_link':
                league.thumbnail_link = action.value
                return league
            default:
                throw new Error('Issue with reducer in league registration.')
        }
    }

    const [league, dispatch] = useReducer(reducer, initialState);

    const history = useHistory();

    async function createLeague() {
        try {
            const access_token = (user._W.access_token)
            const user_id = user._W.user_id

            const result = await axios.post(`${globals.webserverURL}/database/create/league`, {
                league: league,
                access_token: access_token
            })

            console.log(result.data)

            if(result.data.error) {
                console.log(result.data.error)
                alert(result.data.error)
            } else {
                //alert("league created!")
                //now take the _id (ie. 5fb9cf9965f84d0017928887) and do something with it

                //automatically add the user to the league
                await axios.post(`${globals.webserverURL}/database/add/userleague`, {
                    user: {
                        user_id: user_id,
                        league_id: result.data[0]._id
                    },
                    access_token: access_token
                })
                //and then finally redirect
                redirect()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return page.redirect ? <Redirect to={page.path}></Redirect> : <View>
        <ScrollView style={styles.container}>
        <View style={styles.topCont}>
        {/* add a spacer here */}
            <View style={{flexDirection:"row", alignItems:"center",
        width:"75%", justifyContent:"space-between", marginBottom:15}}>
            <TouchableOpacity 
                    onPress={() => {
                    history.push("/leagues");
                    }}>
                    <Image source={require("../../public/backarrow.png")} />
                </TouchableOpacity>
                <MyHeader head={`League Registration`} />
            </View>
            <Avatar img={require("../../public/girl2.png")}></Avatar>
        </View>
        <View style={styles.bottomCont}>
            <View style={styles.inputMargin}>
            <Input 
            text="League Name"
            setValue={(text) => dispatch({type: "league_name", value: text})}
            />  
            </View>
            <View style={styles.inputMargin}>
                <Input text="Email"
                    setValue={(text) => dispatch({type: "email", value: text})}
                ></Input>
            </View>
            <View style={styles.inputMargin}>
            <Input
            text="Phone Number"
            placeholder="Phone Number"
            setValue={(text) => dispatch({type: "phone_number", value: text})}

            />
            </View>  
            <View style={styles.inputMargin}>
                <Input text="Sport Type"
                    setValue={(text) => dispatch({type: "sport_type", value: text})}
                ></Input>
            </View>
            <View style={styles.inputMargin}>
                <Input text="Headline"
                    setValue={(text) => dispatch({type: "headline", value: text})}
                ></Input>
            </View>
            <View style={styles.inputMargin}>
                <Input text="Photo Link"
                    setValue={(text) => dispatch({type: "thumbnail_link", value: text})}
                ></Input>
            </View>
            <View style={styles.buttonMargin}>
                <MyLargeButton text="Create League" onPress={createLeague}></MyLargeButton>
            </View>

        </View>

        <View style={styles.spacer} />

        </ScrollView>
        <View style={styles.navigation}><NavBar active={1} /></View>
    </View>
}
