import {
  combineReducers
} from 'redux'
import {
  libraryReducer,
  loadingReducer,
  errorReducer,
  allBooksReducers,
  myBooksReducers,
  addBookReducer,
  returnBookReducer,
  borrowBookReducer,
  rateBookReducer
} from './libraryReducer'
import { sessionReducer } from 'redux-react-session'
import {reducer as notifications} from 'react-notification-system-redux';

const rootReducer = combineReducers({
  accounts: libraryReducer,
  loading: loadingReducer,
  error: errorReducer,
  books: allBooksReducers,
  myBooks: myBooksReducers,
  isBookAdded: addBookReducer,
  isBookReturned: returnBookReducer,
  isBookBorrowed: borrowBookReducer,
  ratings: rateBookReducer,
  session: sessionReducer,
  notifications
})

export default rootReducer
