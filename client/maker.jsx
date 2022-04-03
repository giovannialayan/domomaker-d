const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector("#domoAge").value;
    const level = e.target.querySelector("#domoLevel").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!name || !age || !level) {
        helper.handleError('all fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, level, _csrf}, loadDomosFromServer);

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">name: </label>
            <input id="domoName" type="text" name="name" placeholder="domo name" />
            <label htmlFor="age">age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="level">level: </label>
            <input id="domoLevel" type="number" min="0" name="level" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="make domo" />
        </form>
    );
};

const DomoList = (props) => {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo"> no domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> name: {domo.name} </h3>
                <h3 className="domoAge"> age: {domo.age} </h3>
                <h3 className="domoLevel"> level: {domo.level} </h3>
                <button id="killDomo" className="deleteDomoButton" type="button" onClick={() => deleteDomo(domo._id)}>
                    kill {domo.name}
                </button>
                <input id="_csrfDelete" type="hidden" name="_csrf" value={props.csrf} />
            </div>
        );
    });

    const deleteDomo = (id) => {
        const _csrf = document.getElementById('_csrf').value;
        helper.sendPost('/deleteDomo', {id, _csrf}, loadDomosFromServer);
    };

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
};

window.onload = init;