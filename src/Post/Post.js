import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import { Button, Input } from '@material-ui/core';
import firebase from "firebase";

const Post = ({ postId, username, caption, imageUrl, user }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        if (user) {
            db.collection("posts").doc(postId).collection("comments").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                text: comment,
                username: user.displayName
            });

            setComment("");
        } else {
            alert("Please Sign In to add a comment");
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <Avatar
                    className="post-avatar"
                    alt="debojit"
                    src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img
                className="post-image"
                src={imageUrl}
                alt="" />
            <h4 className="post-text"><strong>{username}</strong> {caption}</h4>

            <div className="post-comments">
                {
                    comments.map(cmt =>
                        <p><strong>{cmt.username}</strong> {cmt.text}</p>)
                }
            </div>

            {user && 
                <form className="post-comment-box">
                    <Input
                        className="post-input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} />
                    <Button
                        className="post-button"
                        disabled={!comment}
                        onClick={postComment}>Post</Button>
                </form>
            }
        </div>
    );
}

export default Post;
