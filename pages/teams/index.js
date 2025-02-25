import React,{ useState, useEffect } from "react";
import {View, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage} from "react-native";
import {Redirect, useLocation} from 'react-router-native'
import MyHeader from "../../comps/header";
import NavBar from "../../comps/navbar";
import MyPill from "../../comps/Teampill";
import * as axios from 'react-native-axios'

import { globals } from '../../globals';
import Text from '../../comps/Text';

const styles = StyleSheet.create({
    container: {
        position: "relative",
        height: "100%",
        alignItems: "center"
    },
    header:{
        flexDirection: "row",
        width: "100%",
        height: 45,
        marginTop: 50,
        marginBottom: 15,
        paddingLeft: "5%"
    },
    editIcon: {
        position: "relative",
        left: -25
    },
    pillcont: {
        alignItems: "center"
    },
    pillMargin: {
        marginBottom: 30
    },
    pageName:{
        fontSize: 36,
        fontWeight: "bold",
        color: "#333333",
        width: "90%",
        fontFamily:"Ubuntu-Bold"
        
    },
    navigation:{
        zIndex:1,
        position:"absolute",
        bottom:0
      },
      edit:{
        position:"relative",
        right: 12
    },
    spacer: {
        // Adds space to the bottom so you can see the content on the bottom of the scroll view without it being cutoff
        height: 120
    },
});



export default function Teams(){

    const data = useLocation()
    const league_id = data.state
    const [teams, updateTeams] = useState({loading: true, data: []})
    const [user, updateUser] = useState("")
    const [fullUser, updateFullUser] = useState({loading: true, data: {}})
    const [season, updateSeason] = useState({loading: true, data: []})
    const [page, reload] = useState({redirect: false})

    const redirectTeamReg = () => {
        //pass on the league_id to the team registration view
        reload({redirect: !page.redirect, path: "/team-registration", leagueID: data.state})
    }

    //need to add jerseyNumber functionality
    async function joinTeam({teamID, players, fullUser, jerseyNumber}) {
        try {
            //${globals.webserverURL}
            const updatedPlayers = [...players, {captain: false, jersey_number: null, user_id: user.user_id, first_name: fullUser.first_name, last_name: fullUser.last_name, thumbnail_link: fullUser.thumbnail_link}]
            const result = await axios.post(`${globals.webserverURL}/database/update/team`, {
                team: {
                    team_id: teamID,
                    updates: {
                        players: updatedPlayers
                    }
                },
                access_token: user.access_token
            })

            if(result.data.error) {
                console.log(result.data.error)
                alert(result.data.error)
            } else {
                console.log(result)
                alert("Team Joined!")
            }
        } catch (err) {
            console.log(err)
        } finally {
            loadPage()
        }
    }

    const getUser = async () => {
        const rawToken = await AsyncStorage.getItem('access_token')  
        const rawID = await AsyncStorage.getItem('user_id')
        return {access_token: rawToken, user_id: rawID}
    }

    
    //${globals.webserverURL}
    const getLatestLeagueSchedule = async (user, league_id) => {
        const result = await axios.post(`${globals.webserverURL}/database/read/latestLeagueSchedule`, {
            league: {
                league_id: league_id
            },
            access_token: user.access_token
        })
        if(result.data.error) {
            console.log(result.data.error)
            //alert(result.data.error)
            return false
        } else {
            return result.data
        }
    }

    const getFullUser = async (user) => {
        const result = await axios.post(`${globals.webserverURL}/database/read/user`, {
            user: {
                user_id: user.user_id
            },
            access_token: user.access_token
        })
        if(result.data.error) {
            console.log(result.data.error)
            alert(result.data.error)
        } else {
            return result.data
        }
    }

    async function getTeamsByLeague(user) {
        const result = await axios.post(`${globals.webserverURL}/database/read/leagueteams`, {
            league: {
                league_id: league_id
            },
            access_token: user.access_token
        })
        //console.log(result.data)

        if(result.data.error) {
            console.log(result.data.error)
            alert(result.data.error)
        } else {
            //sort the array so that the logged-in user's team is at top
            const teams = result.data
            const userTeams = []
            const otherTeams = []

            for(let team of teams) {
                let userTeam = false
                for(let player of team.players) {

                    if(player.user_id == user.user_id) {
                        //signed in user's team
                        team.user_team = true
                        userTeams.push(team)
                        userTeam = true
                    }
                }
                if(!userTeam) {
                    otherTeams.push(team)
                }

            }


            const sortedTeams = userTeams.concat(otherTeams)

            return sortedTeams
        }
    }

    //one last thing, get roster for each team
    async function loadPage() {
        const user = await getUser()
        updateUser(user)
        const leagueSchedule = await getLatestLeagueSchedule(user, league_id)
        if (leagueSchedule) updateSeason({loading: false, data: leagueSchedule})
        const leagueTeams = await getTeamsByLeague(user)

        if (leagueSchedule) {
            for (let team of leagueTeams) {
                let teamTies = 0;
                let teamHomeWins = 0;
                let teamHomeLosses = 0;
                let teamAwayWins = 0;
                let teamAwayLosses = 0;
                for (let match of leagueSchedule.events) {
                    if (team._id == match.home_team && match.match_tied || team._id == match.away_team && match.match_tied) {
                        teamTies++;
                    } else if (team._id == match.home_team && team._id == match.winner_id) {
                        teamHomeWins++;
                    } else if (team._id == match.away_team && team._id == match.winner_id) {
                        teamAwayWins++;
                    } else if (team._id == match.home_team && team._id == match.loser_id) {
                        teamHomeLosses++;
                    } else if (team._id == match.away_team && team._id == match.loser_id) {
                        teamAwayLosses++;
                    }
                }
                const teamSeasonResults = {
                    home_wins: teamHomeWins,
                    home_losses: teamHomeLosses,
                    away_wins: teamAwayWins,
                    away_losses: teamAwayLosses,
                    ties: teamTies
                }
                team.match_results = teamSeasonResults
                console.log(team)
            }
    
        }
        
        updateTeams({loading: false, data: leagueTeams})

        const fullUser = await getFullUser(user)
        updateFullUser(fullUser)
        
        //console.log(leagueSchedule.events)

    }

    useEffect(()=> {
        try {
            loadPage()
        } catch (err) {
            console.log(err)
        }
    }, [])

return page.redirect ? <Redirect to={{pathname: page.path, state: page.leagueID}}></Redirect> : <View>
    <ScrollView contentContainerStyles={styles.container}>
    <View style={styles.header}>
        <Text style={styles.pageName}>Teams</Text>
        <TouchableOpacity onPress={redirectTeamReg} style={styles.edit}>
                <Image  source={require("../../public/edit.png")} style={styles.editIcon}/>
        </TouchableOpacity>   
    </View>
    <View style={styles.pillcont}>

    {!teams.loading && Array.isArray(teams.data) ? 
        teams.data.map(team => 
            <View key={team._id} style={styles.pillMargin}>
                <MyPill matchResults={team.match_results} user={{first_name: fullUser.first_name, last_name: fullUser.last_name, thumbnail_link: fullUser.thumbnail_link}} thumbnail_link={team.thumbnail_link} onPress={joinTeam} joined={team.user_team} teamID={team._id} TeamName={team.team_name} email={team.email} phoneNumber={team.phone_number} team_captain={team.team_captain} players={team.players} userTeam={team.user_team} img={require("../../public/girl.jpg")}></MyPill>
            </View>   
        ) 
        : <Text>Loading</Text>}

    </View>

    <View style={styles.spacer} />
    
    </ScrollView>
    <View style={styles.navigation}><NavBar active={1}/></View>
</View>

}