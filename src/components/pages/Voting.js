import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { vote } from "../web3/Web3";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
	db,
	doc,
	getDoc,
	query,
	where,
	collection,
	getDocs,
} from "../../firebase/config";
// import { candidate1 , candidate2, candidate3 } from '../images/Voting';

let voterCollectionID = "";
export const fetchVoterLogin = (VoterID) => {
	if (VoterID === "HTU6548521") {
		voterCollectionID = "432yNM9WwVRhYOg10PlY";
	} else if (VoterID === "KLE9852145") {
		voterCollectionID = "EdgWaYGGSdupIKxleYSe";
	} else if (VoterID === "SEW6521432") {
		voterCollectionID = "Ouv1YADgMobbNO1Gxxx3";
	} else if (VoterID === "DGU8524763") {
		voterCollectionID = "urqEOntG6IlkBccG53YN";
	}
};

const Voting = () => {
	let navigate = useNavigate();

	//voter details
	const [name, setName] = useState("");
	const [constituency, setConstituency] = useState("");
	const [state, setState] = useState("");
	const [wardnum, setWardnum] = useState("");

	//candidate details
	const [candidateDetails, setCandidateDetails] = useState([]);
	const [party, setParty] = useState([]);
	const [candidateID, setCandidateID] = useState(0);
	const [voterIndex, setvoterIndex] = useState(0);

	//fetching voter details
	const fetchVoterData = async () => {
		const docRef = doc(db, "voter-details", "432yNM9WwVRhYOg10PlY");
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
		setName(docSnap.data().Name);
		setConstituency(docSnap.data().Constituency);
		setState(docSnap.data().State);
		setWardnum(docSnap.data().Wardnum);
	};
	fetchVoterData();

	//fetching candidate details
	const fetchCandidateData = async () => {
		const q = query(
			collection(db, "candidate-details"),
			where("wardnum", "==", wardnum.toString()),
		);

		const querySnapshot = await getDocs(q);

		querySnapshot.docs.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			//console.log( doc.id, " => ", doc.data() );
			setCandidateDetails((prev) => {
				return [...prev, doc.data()];
			});
		});
	};

	useEffect(() => {
		fetchCandidateData();
	}, []);
	console.log(candidateDetails);

	const castVote = (event, _candidateID) => {
		event.preventDefault();
		setvoterIndex((voterIndex) => voterIndex + 1);
		setCandidateID(_candidateID)(candidateID === 1)
			? setParty("REP")
			: candidateID === 2
			? setParty("DEM")
			: candidateID === 3
			? setParty("KW")
			: alert("There is an error");

		window.confirm(
			"Press 'OK' to vote for Candidate" +
				{ candidateID } +
				"of" +
				{ party } +
				"?",
		);

		try {
			vote(voterIndex, candidateID);
			alert("Your vote has successfully been cast");
			navigate(`/`);
		} catch (error) {
			alert(" There was an error " + { error });
		}
	};

	const paperstyle = {
		padding: 30,
		height: "50vh",
		width: "40vh",
		margin: "60px auto",
	};
	const votepaperstyle = {
		padding: 30,
		height: "70vh",
		width: "120vh",
		margin: "40px auto",
		overflow: "auto",
	};
	const useStyles = makeStyles((theme) => ({
		paper: {
			padding: theme.spacing(1),
			textAlign: "center",
			color: theme.palette.text.secondary,
			margin: "80px auto",
			maxHeight: 200,
			maxWidth: 900,
		},
		image: {
			width: 128,
			height: 128,
		},
		img: {
			margin: "left",
			display: "block",
			maxWidth: "100%",
			maxHeight: "100%",
		},
		inline: {
			display: "inline",
		},
	}));

	return (
		<Grid
			container
			/*spacing={2}*/ style={{
				backgroundColor: "rgb(255, 194, 0, 25%)",
				height: "89vh",
			}}>
			{/* Displaying the voter details */}
			<Paper elevation={10} style={paperstyle}>
				<Grid align='center'>
					<Avatar src='/broken-image.jpg' />
					<br />
					<Typography component='h2' variant='h5'>
						Voter Details
					</Typography>
					<Grid align='left'>
						<br />
						<br />
						<Typography variant='body1'>
							<b>Name: </b>
							{name}
						</Typography>
						<br />
						<Typography variant='body1'>
							<b>Constituency: </b>
							{constituency}
						</Typography>
						<br />
						<Typography variant='body1'>
							<b>State: </b>
							{state}
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			{/* Displaying the candidate details */}
			<Paper elevation={10} style={votepaperstyle}>
				{candidateDetails.map((doc) => {
					return (
						<List>
							<ListItem alignItems='flex-start'>
								<ListItemAvatar>
									<Avatar
										style={{
											background: "rgb(255, 209, 3)",
										}}
										alt={doc.partyname}
										src='/static/images/avatar/1.jpg'
									/>
								</ListItemAvatar>
								<ListItemText
									primary={doc.partyname}
									secondary={
										<React.Fragment>
											<Typography
												component='span'
												variant='body2'
												color='textPrimary'></Typography>
											{doc.firstname} {doc.lastname}
										</React.Fragment>
									}
								/>
								<br />
								<br />
								<Button
									style={{
										backgroundColor: "rgb(255, 194, 0)",
										maxWidth: "50%",
									}}
									variant='contained'
									onClick={(e) => {
										castVote(e, 3);
									}}>
									Vote
								</Button>
							</ListItem>
							<Divider variant='inset' component='li' />
						</List>
					);
				})}
			</Paper>
		</Grid>
	);
};

export default Voting;
