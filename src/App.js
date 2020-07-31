import React, { Component } from 'react';
import { 
  Dialog,
  Button,
  Snackbar,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
 } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

 // constante CSS
const style={
  addPlayer:{
    display:"flex",
    flexDirection:"column",
    height:"50vh",
  },
  titre:{
    marginTop:"2vh",
    marginLeft:"1em",
    marginBottom:"2vh",
    fontFamily:"roboto",
  },
  textFields:{
    width:"80%",
    margin:"auto",
    marginTop:"2vh",
    marginBottom:"2vh",
  }
}
class App extends Component {

  constructor(props){
    super(props)
    this.state={
      open:false,
      nombreDeJoueur:[""],
      numeroDuJoueurActuel:0,
      nombreDeTour:[0],
      tableauDesScores:[0],
      snackText:"Tout est oklm dans le binks",
      severity:"success",
      gameLaunched:false,
      aQuiLeTour:"",
      valeurDuDes:0,
    }
  }

  componentDidMount = () => {
    var listeDesJoueursTuCoco = localStorage.getItem("players")
    listeDesJoueursTuCoco = listeDesJoueursTuCoco.split(",")
    this.setState({
      nombreDeJoueur:listeDesJoueursTuCoco,
    })
  }

  open = () => {
    var listeDesJoueursTuCoco = localStorage.getItem("players")
    listeDesJoueursTuCoco = listeDesJoueursTuCoco.split(",")
    console.log(listeDesJoueursTuCoco[1])
    console.log("opening")
    this.setState({
      open:true,
      nombreDeJoueur:listeDesJoueursTuCoco,
    })
  }

  morePlayers = () => {
    var state = this.state
    state.nombreDeJoueur.push("")
    this.setState(state)
  }

  checkLaunchability = () => {
    if(this.state.nombreDeJoueur.length<2){
      this.handleSnack("warning", "Faut etre au moins deux pour jouer sinon c'est triste zbi")
    }else{
      this.launchGame()
      this.setState({gameLaunched:true})
    }
  }

  saveGamerTags = () => {
    var listeTmp = this.state.nombreDeJoueur 
    for (let i = 0; i < listeTmp.length; i++) {
      if(listeTmp[i]===""||listeTmp[i]===undefined||listeTmp[i]===null){
        listeTmp.splice(i,1)
      }
    }
    localStorage.setItem("players",listeTmp)
    console.log("Saved")
    this.setState({
      open:false,
      nombreDeJoueur:listeTmp,
    })
    this.handleSnack("success","les pseudos sont bien enregistred")
  }

  handleChangeNewPlayer = e => {
    console.log("e.target.value="+e.target.value)
    console.log(e.target.id)
    var state=this.state
    state.nombreDeJoueur[e.target.id]=e.target.value
    this.setState(state)
  }

  getRandomInt = max => Math.floor(Math.random() * Math.floor(max))  

  jetDesDesMdrrrCDrolPskYaDeuxFoisDes = () => {
    this.setState({valeurDuDes:this.getRandomInt(6)+1})
  }

  handleClose = () => {
    this.setState({openSnackBar:false})
  }

  handleSnack = (severity, text) => {
    this.setState({
      openSnackBar:true,
      severity:severity,
      snackText:text,
    })
  }

  // ici cest les methodes pour le jeuzer

  joueurSuivant = () => {
    var playerActive = this.state.aQuiLeTour
    var playerFound = false
    var numeroDuJoueur = 0
    for (let i = 0; i < this.state.nombreDeJoueur.length; i++) {
      if(this.state.nombreDeJoueur[i]===this.state.aQuiLeTour){
        playerFound=true
        if(i===this.state.nombreDeJoueur.length-1){
          playerActive=this.state.nombreDeJoueur[0]  
          numeroDuJoueur = 0
        }else{
          numeroDuJoueur = i+1
          playerActive=this.state.nombreDeJoueur[i+1]
        }
      }
    }
    if(!playerFound){
      playerActive=this.state.nombreDeJoueur[0]
      numeroDuJoueur = 0
    }
    this.setState({
      aQuiLeTour:playerActive,
      numeroDuJoueurActuel:numeroDuJoueur,
    })
    // on lance les des
    this.jetDesDesMdrrrCDrolPskYaDeuxFoisDes()
    this.ajusteLeTableauDesCases()
  }

  ajusteLeTableauDesCases = () => {
    var arrayTmp = this.state.tableauDesScores
    arrayTmp[this.state.numeroDuJoueurActuel]+=this.state.valeurDuDes
    this.setState({tableauDesScores:arrayTmp})
  }

  launchGame = () => {
    this.joueurSuivant()
    var arrayTmp = [0]
    for (let i = 0; i < this.state.nombreDeJoueur.length -1 ; i++) {
      arrayTmp.push(0)      
    }
    this.setState({tableauDesScores:arrayTmp})
  }

  render() {
    return (
      <div>

        {/* Button vers la boite de dialog pour ajouter des joueurs */}
        <Button variant="outlined" onClick={this.open} color="primary">
          <PersonAdd />
        </Button>
        {/* Dialog pour ajouter des joueurs */}
        <Dialog 
          open={this.state.open} 
          onClose={()=>this.setState({open:false})} >
          <div style={style.addPlayer} >
            <div style={style.titre} >Nom des joueurs</div>
            {this.state.nombreDeJoueur.map((value, id)=>
              <TextField 
                id={`${id}`}
                key={id} 
                value={value} 
                onChange={this.handleChangeNewPlayer} 
                style={style.textFields} 
                variant="outlined"
                label={`joueur nᵒ${id+1}`} />
            )}
            <div style={{
              position:"fixed",
              bottom:0,
              }}>
              <Button variant="contained" onClick={this.morePlayers} color="primary" >
                +1 Player
              </Button>
              <Button variant="contained" onClick={this.saveGamerTags} color="secondary" >
                Save GamerTags
              </Button>
            </div>
          </div>
        </Dialog>
        <Snackbar open={this.state.openSnackBar} autoHideDuration={2000} onClose={this.handleClose}>
          <Alert severity={this.state.severity} variant="filled" >
            {this.state.snackText}
          </Alert>
        </Snackbar>
        {!this.state.gameLaunched?(
          <Button variant="contained" onClick={this.checkLaunchability} color="primary">
            Launch the game
          </Button>
        ):(
          <div>
            <div>C'est au tour de : {this.state.aQuiLeTour} </div>
            <div>Lancer de des : {this.state.valeurDuDes}</div>
            <Button variant="contained" onClick={this.joueurSuivant} color="primary">
              joueur suivant
            </Button>
          </div>
        )}
        <Paper elevation={3} style={{
          width:"20vw",
          height:"100vh",
          position:"fixed",
          right:"0",
          }}>
            <div style={style.titre}>Les buveurs</div>
          {this.state.nombreDeJoueur.map((value, id)=>
            <Accordion key={id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <div>{value}</div>
            </AccordionSummary>
            <AccordionDetails>
              case numero : {this.state.tableauDesScores[id]}
            </AccordionDetails>
          </Accordion>
          )}
        </Paper>
      </div>
    );
  }

}

export default App;
