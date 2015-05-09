import React from 'react';
import {fromJS} from 'immutable';
import {ListGroup, ListGroupItem, Grid, Button, Input} from 'react-bootstrap';

function randInt(max) {
    return Math.floor((Math.random() * max) + 1);
}

function genExample() {
    return {a: randInt(20), b: randInt(35), type: 'add'};
}

class Add extends React.Component {
    constructor() {
        super();
        this.key = this.key.bind(this);
    }
    key(evt) {
        if (evt.key === 'Enter') {
            this.solved(Number(evt.target.value));
            evt.preventDefault();
        }
    }

    solved(result) {
        let {a, b} = this.props;
        let correct = (a + b) === result;
        this.props.onSolve(result, correct);
    }

    render() {
        let {a, b, result, correct, value, onChange} = this.props;
        let input;
        let check = correct ? 'Yes!' : 'Kwa-kwa';
        let text = `${a} + ${b} = `
        if (!this.props.noinput) {
            return <Input type="text"
                        label={text}
                        onKeyPress={this.key} 
                        onChange={onChange}
                        value={value}
                        labelClassName='col-xs-2'
                        wrapperClassName='col-xs-10' />
        }
        return (<div>
            {text} {result} {check}
        </div>);
    }
}

class Current extends React.Component {
    render() {
        if (this.props.type === 'add') {
            return <Add {...this.props} />
        }
        return <span>CCCC</span>
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = fromJS({
            current: null,
            history: [],
            score: 0,
            solved: 0,
            value: '',
        });
        this.tick = this.tick.bind(this);
        this.start = this.start.bind(this);
        this.solved = this.solved.bind(this);
    }

    timer() {
        window.clearTimeout(this.tm);
        this.tm = window.setTimeout(this.tick, 15000);
    }

    start() {
        let current = fromJS(genExample());
        this.state = this.state.set('current', current);
        this.renderHistory = this.renderHistory.bind(this);
        this.changeInput = this.changeInput.bind(this);

        this.forceUpdate();
    }

    tick() {
        this.solved(null, false);
    }

    solved(result, correct) {
        var history = this.state.get('history');
        var score = this.state.get('score');
        var solved = this.state.get('solved');

        let current = this.state.get('current');
        if (correct) score ++;
        history = history.unshift(
            current.set('result', result)
                    .set('correct', correct)
                    .set('idx', solved)
        );
        let next = fromJS(genExample());
        this.state = this.state.set('current', next)
                                .set('history', history)
                                .set('score', score)
                                .set('solved', solved + 1)
                                .set('value', '');
        this.forceUpdate();
        this.timer();
    }

    changeInput(evt) {
        let text = evt.target.value;
        this.state = this.state.set('value', text);
        this.forceUpdate();
    }

    renderHistory(ex) {
        var bs;
        if (ex.correct) {
            bs = 'success';
        }
        else if (ex.result === null) {
            bs = 'danger';
        }
        else {
            bs = 'warning';
        }
        return (<ListGroupItem key={ex.idx}
                    bsStyle={bs}>
                    <Current {...ex} noinput />
                </ListGroupItem>);
    }

    render() {
        let current = this.state.get('current');
        let currentEl;
        let startBtn;
        let score = this.state.get('score');
        let solved = this.state.get('solved');
        let value = this.state.get('value');

        let history = this.state.get('history');
        if (current) {
            currentEl = <Current {...current.toJS()}
                                 onSolve={this.solved}
                                 onChange={this.changeInput}
                                 value={value} /> 
        } else {
            startBtn = <Button onClick={this.start}>Start</Button>
        }
        return (<Grid>
            <h1>{this.props.text}</h1>
            Score: {score}/{solved}
            <form className='form-horizontal'>
                {currentEl}
            </form>
            {startBtn}
            <ListGroup>
                {history.toJS().map(this.renderHistory)}
            </ListGroup>
        </Grid>);
    }
};

function render() {
    var el = React.createFactory(App);
    var data = {
        text: "Math!",
    };
    React.render(el(data), document.body);
}

window.renderApp = render;
