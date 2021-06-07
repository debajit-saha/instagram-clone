import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from "../firebase";
import firebase from "firebase";
import "./WritePost.css";

const WritePost = ({ username }) => {
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        // upload image to firebase storage
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                // once upload is completed, get the download url for the image
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // add new post in firebase database
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )
    };

    return (
        <div className="postUpload">
            <progress className="postUpload-progress" value={progress} max="100" />
            <Input type="text" placeholder="Enter a caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default WritePost;
