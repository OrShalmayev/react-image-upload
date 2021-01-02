import React from 'react';

// Packages
import axios  from 'axios'
// CSS
import './App.css';

// Components

// Context
import {AppContextPorivder, AppContext} from './context';

// Material UI
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// Images
import image from './assets/images/image.svg';


const useStyles = makeStyles({
  container: {
    maxWidth: '30%',
    minHeight: '50%',
    padding: '2rem',
    background: '#fff',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  },
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: '2rem auto',
    padding: '2rem',
    width: '85%',
    minHeight: '20rem',
    border: '2px dashed #929292',
    borderRadius: '13px',
    backgroundColor: '#e6e6e6',
    transition: "all 0.3s ease-in-out",
    "&.active": {
      border: '3px dashed green',
      opacity: '0.8',
    },
    "& > *:not(:last-child)": {
      marginBottom: '3rem'
    },
    "&-img": {
      maxWidth: '10rem',
    }
  },

  // upload btn
  choose_file: {
    width: '50%',
    alignSelf: 'center',
    fontSize: '1.5rem',
    textTransform: 'none'
  },
  // Typography
  h: {
    "&--1": {
      fontSize: '3rem',
      color: '#000',
      textAlign: 'center'
    }
  },//END headlines
  p: {
    "&--1": {
      color: '#000',
      fontSize: '1.5rem'
    },
    "&--2": {
      color: '#929292',
      fontSize: '1.3rem'
    }
  }//END paragraphs
});

function App() {
  const appState = React.useContext(AppContext)

  React.useEffect(()=>{
    console.log('App State', appState)
  },[appState])

  return (
    <AppContextPorivder>
      <App.Main/>
    </AppContextPorivder>
  );
}

function Loading (){
  const main = useStyles();
  return (
    <Box className="App">
      <Container className={main.container}>
        <Typography className={`${main.p}--1`} paragraph="true">Uploading...</Typography>
        <CircularProgress disableShrink />
      </Container>
    </Box>
  )
}

function Main(){
  const appState = React.useContext(AppContext)
  React.useEffect(()=>{
    console.log('Main State', appState)
  },[appState])

  return (
    <React.Fragment>
      {
        appState.uploading===true
          ?
            <App.Loading></App.Loading>
          :
          appState.isUploaded ?
            <App.UploadedSuccessfully/>
            :
            <App.Upload></App.Upload>
      }
    </React.Fragment>
  );
}

function Upload (){
  const appState = React.useContext(AppContext)
  
    // REF
    const dropRef = React.useRef();
    let dragCounter = React.useRef(0);
    const config = React.useRef({
      headers: {
          'content-type': 'multipart/form-data'
      }
    });
  
    // Component LifeCycle
    React.useEffect(()=>{
      console.log('appState updated', appState)
    }, [appState])
    React.useEffect(()=>{
      dropRef.current.addEventListener('dragenter', handleDragEnter);
      dropRef.current.addEventListener('dragleave', handleDragOut);
      dropRef.current.addEventListener('dragover', handleDragOver);
      dropRef.current.addEventListener('drop', handleDrop);
      // Component will unmount
      return () => {
        // remove listeners
        // dropRef.removeEventListener('dragenter', handleDragEnter);
        // dropRef.removeEventListener('dragleave', handleDragOut);
        // dropRef.removeEventListener('dragover', handleDragOver);
        // dropRef.removeEventListener('drop', handleDrop);
      }
    },[]);
    
  
    React.useEffect(()=>{
      console.log('files updated', appState.file)
    },[appState.file])
  
      // Styles
      const main = useStyles();
  
    // Axios
    const client = axios.create({
      baseURL: 'http://localhost:8000',
      timeout: 20000
    })
    /**
     * Helpers
     */
    const handleDragOver = (e)=> {
      e.preventDefault();
      e.stopPropagation();
    }
  
    const handleDragEnter = (e)=> {
      e.preventDefault();
      e.stopPropagation();
      // console.log('dragenter',e)
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        // console.log(e.dataTransfer.items)
        dragCounter++;
        appState.setContextState(({
            dragging: true,
            file: e.dataTransfer.files[0],
            error: null
          })
        );//END setState
      }
    }
    
    const handleDragOut = (e)=> {
      e.preventDefault();
      e.stopPropagation();
      // console.log('leave',e)
      dragCounter--;
  
      if (dragCounter>0) return;
  
      appState.setContextState(({
          dragging: false
      }));//END setState
    }
  
    const handleDrop = (e)=> {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const formData = new FormData();
        formData.append('myImage', e.dataTransfer.files[0]);
        appState.setContextState(({
          uploading: true
        }));
        // send to the server the img file
        client.post('/upload', formData, {
          config,
          onUploadProgress: function(progressEvent) {
            console.log('progressEvent', progressEvent);
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log('percentCompleted', percentCompleted);
          }
        }).then(res=>{
          console.log('response:****', res.data)
          setTimeout(()=>{
            appState.setContextState(({
                uploading: false,
                isUploaded: true,
                uploadedFileName: `${window.location.origin}/assets/images/${res.data}`,
                error: null
            }));
          }, 1000);
        }).catch(err=> {
            appState.setContextState(({
                uploading: false,
                error: true
            }));
            console.log(new Error(err));
        });
        e.dataTransfer.clearData()
        dragCounter = 0
        appState.setContextState(({
            dragging: false,
            uploading: true,
            file: e.dataTransfer.files[0],
            error: null
        }));//END setState
      }
    }
  return (
    <React.Fragment>
      <Box className="App">
        <Container className={main.container}>
          <Typography className={`${main.p}--1`} paragraph="true">Upload your image</Typography>
          <Box className={`${main.upload} ${appState.dragging ? 'active' : ''}`} ref={dropRef}>
            <img className={`${main.upload}-img`} src={image} alt="mountains"/>
            <Typography className={`${main.p}--2`} paragraph="true">File should be Jpeg, Png</Typography>
          </Box>
          <Button className={main.choose_file} variant="contained" color="primary">
            Choose a file
          </Button>
        </Container>
      </Box>
    </React.Fragment>
  )
}

function UploadedSuccessfully(){
  const appState = React.useContext(AppContext)

  const main = useStyles();

  return (
    <React.Fragment>
      <Box className="App">
        <Container className={main.container}>
          <Typography className={`${main.p}--1`} paragraph="true">Uploaded Successfully</Typography>
          <Box className={`${main.upload}`}>
            <img className={`${main.upload}-img`} src={`${appState.uploadedFileName}`} alt="mountains"/>
            <Typography className={`${main.p}--2`} paragraph="true">File should be Jpeg, Png</Typography>
          </Box>
          <Button className={main.choose_file} variant="contained" color="primary">
            Choose a file
          </Button>
        </Container>
      </Box>
    </React.Fragment>
  )
}

function Error() {
  const main = useStyles();
  return (
    <Typography className={`${main.p}--1`} paragraph="true">Error</Typography>
  )
}
App.Main = Main;
App.Upload = Upload;
App.UploadedSuccessfully = UploadedSuccessfully;
App.Loading = Loading;
App.Error = Upload;

export default App;
