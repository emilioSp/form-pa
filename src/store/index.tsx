import { Actions, jsonformsReducer } from "@jsonforms/core";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { combineReducers, createStore } from "redux";
import MarkdownControl from "../renderers/MarkdownControl";
import markdownControlTester from "../renderers/markdownControlTester";


const store = createStore(combineReducers({ jsonforms: jsonformsReducer() }), {
  jsonforms: {
    cells: materialCells,
    renderers: materialRenderers,
  },
});



// Register custom renderer for the Redux tab
// store.dispatch(Actions.registerRenderer(ratingControlTester, RatingControl));
store.dispatch(Actions.registerRenderer(markdownControlTester, MarkdownControl));

export default store;