import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'react-redux';
import * as Actions from '../actions';

class App extends React.Component {
  constructor () {
    super();
  }

  setInitialState () {
    var board = [];
    var rows = 9;
    var columns = 9;
    eachSquare(board, rows, column, function () {
      return 0;
    }, function () {
      return [];
    });)
    return board;
  }

  eachSquare (board, rows, column, callback, initialize) {
    for (var i = 0; i < rows; i++) {
      if (initialize) {
        board[i] = initialize(i);
      }
      for (var j = 0; j < columns; j++) {
        board[i][j] = callback(i, j);
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.map(function(value, index) {
          return (
            <div class={index}></div>
          )
        })}
      </div>
    );
  }
}

function mapStateToProps (state) {

}

function mapDispatchToProps (dispatch) {

}

export default connect(mapStateToProps, mapDispatchToProps)(App);