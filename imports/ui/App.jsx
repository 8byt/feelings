import React, { Component } from 'react';

export default class App extends Component {
    render() {
        const yearString = `Copyright © ${(new Date()).getFullYear()} by `;

        return (
            <div className="app">
                <div className="header">Welcome to the Feelings Cloud</div>
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
