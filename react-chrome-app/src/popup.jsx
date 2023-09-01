import React from "react";
import { render } from "react-dom";
import './popup.css';

function Popup() {
    return (
        <main>
            <div>
                <h1>Hello, world!</h1>
                <p>This is a simple popup.</p>
            </div>
        </main>
    );
}

render(<Popup />, document.getElementById('react-target'));