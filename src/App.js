import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post/Post';
import { db, auth } from './firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import WritePost from './WritePost/WritePost';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    });
    return () => {
      // if this useEffect fires up again, then perform the cleanup function first
      unsubscribe();
    }
  }, [username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => (
          { id: doc.id, ...doc.data() }
        )))
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  }

  const handleSignup = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch(error => alert(error.message));

    setOpen(false);
  }

  const handleSignIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
  }

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
              <img
                className="app-header-image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram" />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={handleSignup}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={handleCloseSignIn}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signin">
            <center>
              <img
                className="app-header-image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram" />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={handleSignIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app-header">
        <img
          className="app-header-image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram" />
        {
          user ?
            <Button onClick={() => auth.signOut()}>Logout</Button> :
            (
              <div className="app-login-container">
                <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
              </div>
            )
        }
      </div>

      <div className="app_posts">

        <div>
          {
            posts.map(post => <Post
              key={post.id}
              postId={post.id}
              imageUrl={post.imageUrl}
              username={post.username}
              caption={post.caption}
              user={user} />)
          }
        </div>

        <div className="app-ig-embed">
          <InstagramEmbed
            url='https://www.instagram.com/p/CNN8CzEH5U1/'
            clientAccessToken='4214184891935806|93d5bfdea5104f33ab8a728ce541c236'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {
        user?.displayName ?
          <WritePost username={user.displayName} /> :
          <h3 style={{"textAlign":"center"}}>Please Sign In to upload post</h3>
      }
    </div >
  );
}

export default App;
