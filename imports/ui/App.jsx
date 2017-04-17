import React, { Component } from 'react';
import { connect } from 'react-redux';

import SubscribeComponent from '../../client/helpers/SubscribeComponent';
import { createPost } from '../../client/actions';

class Post extends Component {
    render() {
        const { timestamp, emotion } = this.props;

        return (
            <div className="post">
                <div>Time: {timestamp.toString()}</div>
                <div>Emotion: {emotion}</div>
            </div>
        );
    }
}

class App extends Component {
    componentWillMount() {
        this.props.subscribe('posts');
    }

    render() {
        const yearString = `Copyright © ${(new Date()).getFullYear()} by `;

        const { posts, createNewPost } = this.props;

        return (
            <div className="app">
                <div className="header">Welcome to the Feelings Cloud</div>
                <button onClick={() => createNewPost(5)}>Create a post</button>
                {posts.map(post =>
                    <Post key={post._id} {...post}/>
                )}
                <div className="footer">
                    <div className="copyright">
                        {yearString}
                        <a href="http://8byt.com">8byt Software</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts
});

const mapDispatchToProps = dispatch => ({
    createNewPost: emotion => dispatch(createPost(emotion))
});

export default connect(mapStateToProps, mapDispatchToProps)
(SubscribeComponent(App));
