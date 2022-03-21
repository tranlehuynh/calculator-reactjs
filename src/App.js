import './App.css';
import { useReducer } from 'react';
import DitgitButton from './DigitButton.js';
import OperationButton from './OperationButton.js';

export const ACTIONS = {
  ADD_DIGIT: 'add',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUTION: 'evalution'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) {return state}

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUTION:
      if (state.currentOperand == null || state.previousOperand == null
        || state.operation == null) {
        return state
      }
      
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null
      }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(curr)) {
    return ''
  }

  let computatioin = ""
  switch(operation) {
    case "+":
      computatioin = prev + curr
      break
    case "-":
      computatioin = prev - curr
    case "*":
      computatioin = prev * curr
    case "/":
      computatioin = prev / curr
  }
  return computatioin.toString()
}

const INTERGER_FORMATTER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) {
    return 
  }
  const [integer, deciamal] = operand.split('.')
  if (deciamal == null) {
    return INTERGER_FORMATTER.format(integer)
  }
  return `${INTERGER_FORMATTER.format(integer)}.${deciamal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
      <div className="container">
        <div className="result">
          <div className="prev-result">{ formatOperand(previousOperand) } { operation }</div>
          <div className="next-result">{ formatOperand(currentOperand) }</div>
        </div>

        <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>

        <OperationButton dispatch={dispatch} operation="/" />

        <DitgitButton dispatch={dispatch} digit="1" />
        <DitgitButton dispatch={dispatch} digit="2" />
        <DitgitButton dispatch={dispatch} digit="3" />

        <OperationButton dispatch={dispatch} operation="*" />

        <DitgitButton dispatch={dispatch} digit="4" />
        <DitgitButton dispatch={dispatch} digit="5" />
        <DitgitButton dispatch={dispatch} digit="6" />

        <OperationButton dispatch={dispatch} operation="+" />

        <DitgitButton dispatch={dispatch} digit="7" />
        <DitgitButton dispatch={dispatch} digit="8" />
        <DitgitButton dispatch={dispatch} digit="9" />

        <OperationButton dispatch={dispatch} operation="-" />

        <DitgitButton dispatch={dispatch} digit="." />

        <DitgitButton dispatch={dispatch} digit="0" />
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUTION})}>=</button>
      </div>
  );
}

export default App;
