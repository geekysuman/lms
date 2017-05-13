export const libraryReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export const loadingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_LOADING':
      return {
        ...state,
        accountsLoading : action.payload
      }
    case 'GET_OWNERDETAILS_LOADING':
      return {
        ...state,
        ownerDetailsLoading : action.payload
      }
    case 'GET_ALL_BOOKS_LOADING':
      return {
        ...state,
        allbooksloading : action.payload
      }
    case 'GET_MY_BOOKS_LOADING':
      return {
        ...state,
        myBooksLoading : action.payload
      }
    case 'GET_ADD_BOOKS_LOADING':
      return {
        ...state,
        addBooksLoading : action.payload
      }
    case 'GET_RETURN_BOOKS_LOADING':
      return {
        ...state,
        returnBooksLoading : action.payload
      }
    case 'GET_BORROW_BOOKS_LOADING':
      return {
        ...state,
        borrowBooksLoading : action.payload
      }
    case 'RATE_BOOK_LOADING':
      return {
        ...state,
        rateBookLoading : action.payload
      }
    case 'GET_MEMBER_DETAILS_EMAIL_LOADING':
      return {
        ...state,
        loginLoader : action.payload
      }
    case 'CREATE_ACCOUNT_LOADING':
      return {
        ...state,
        createAccountLoader : action.payload
      }
    case 'ADD_MEMBER_LOADING':
      return {
        ...state,
        addMemberLoader : action.payload
      }
    default:
      return state
  }
}

export const errorReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_OWNERDETAILS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_ALL_BOOKS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_MY_BOOKS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_ADD_BOOKS_ERROR':
     return {
        ...state,
        message : action.payload
      }
    case 'RATE_BOOK_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_RETURN_BOOKS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_BORROW_BOOKS_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_MEMBER_DETAILS_EMAIL_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'GET_RATE_BOOK_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'CREATE_ACCOUNT_ERROR':
      return {
        ...state,
        message : action.payload
      }
    case 'ADD_MEMBER_ERROR':
      return {
        ...state,
        message : action.payload
      }
    default:
      return state
  }
}

export const ownerDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_OWNERDETAILS_SUCCESS': {
      let ownerDetails = {
        'name' : action.payload[0],
        'account' : action.payload[1],
        'status' : action.payload[2],
        'dateAdded' : action.payload[3]
      }
      return ownerDetails
    }
    default:
      return state
  }
}

export const allBooksReducers = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL_BOOKS_SUCCESS': {
      let books = action.payload[0]
      let myBooks = books.split('|').map((book) => {
        book = book.split(';')
        return {
          'id' : book[0],
          'title' : book[1],
          'author' : book[2],
          'publisher' : book[3],
          'owner' : '0x' + book[4],
          'borrower' : '0x' + book[5],
          'state' : book[6],
          'dateAdded' : book[7],
          'dateIssued' : book[8],
          'imageUrl' : book[9],
          'description' : book[10],
          'genre' : book[11]
        }
      })
      return {
        ...state,
        allBooks : myBooks
      }
    }
    case 'SEARCH_BOOK': {
      const filteredBooks = state.allBooks.filter((book) => {
        return (
          book.title.toLowerCase().includes(action.payload.toLowerCase())
          || book.author.toLowerCase().includes(action.payload.toLowerCase())
          || book.publisher.toLowerCase().includes(action.payload.toLowerCase()))
      })
      return {
        ...state,
        filteredBooks : filteredBooks,
        value: action.payload
      }
    }
    case 'GET_RATE_BOOK_SUCCESS': {
      const booksRating = action.payload
      booksRating.bookId = booksRating.bookId.valueOf()
      booksRating.rating = parseInt(booksRating.rating.valueOf())
      let books = [...state.allBooks]
      let allBooks = books.map(book => {
        book.reviewers = book.reviewers || []
        book.ratings = book.ratings || []
        let rating = 0
        let totalRating = book.totalRating || 0
        if(book.id === booksRating.bookId) {
          const index = book.reviewers.indexOf(booksRating.reviewer)
          if(index !== -1) {
            rating = booksRating.rating - book.ratings[index];
            book.ratings[index] = booksRating.rating
          } else {
            rating = booksRating.rating
            book.ratings.push(booksRating.rating);
            book.reviewers.push(booksRating.reviewer);
          }
          book.totalRating = totalRating + rating
          book.rating = book.totalRating / book.reviewers.length
        }
        return book;
      })
      return {
        ...state,
        allBooks
      }
    }
    case 'GET_ADD_BOOKS_SUCCESS': {
      const id = parseInt(state.allBooks[state.allBooks.length-1].id)
      const books = [
        ...state.allBooks,
        {
          'id' : id+1,
          'title' : action.payload.title,
          'author' : action.payload.author,
          'publisher' : action.payload.publisher,
          'owner' : action.payload.owner.account,
          'borrower' : '0x0',
          'state' : '0',
          'dateAdded' : Date.now(),
          'dateIssued' : '0',
          'imageUrl' : action.payload.imageUrl,
          'description' : action.payload.description,
          'genre' : action.payload.genre
        }
      ]
      return {
        ...state,
        allBooks : books
      }
    }
    case 'GET_BORROW_BOOKS_SUCCESS': {
      const id = parseInt(action.payload.book.id) - 1
      action.payload.book.borrower = action.payload.owner
      action.payload.book.dateIssued = Date.now()
      const books = [
        ...state.allBooks.slice(0,id),
        action.payload.book,
        ...state.allBooks.slice(id+1)
      ]
      return {
        ...state,
        allBooks : books
      }
    }
    case 'GET_RETURN_BOOKS_SUCCESS': {
      const id = parseInt(action.payload.id) - 1
      action.payload.borrower = '0x0'
      action.payload.dateIssued = '0'
      const books = [
        ...state.allBooks.slice(0,id),
        action.payload,
        ...state.allBooks.slice(id+1)
      ]
      return {
        ...state,
        allBooks : books
      }
    }
    default:
      return state
  }
}

export const myBooksReducers = (state = [], action) => {
  switch (action.type) {
    case 'GET_MY_BOOKS_SUCCESS': {
      let books = action.payload[0]
      let myBooks = books.split('|').map((book) => {
        book = book.split(';')
        return {
          'id' : book[0],
          'title' : book[1],
          'author' : book[2],
          'publisher' : book[3],
          'owner' : '0x' + book[4],
          'borrower' : '0x' + book[5],
          'state' : book[6],
          'dateAdded' : book[7],
          'dateIssued' : book[8],
          'imageUrl' : book[9],
          'description' : book[10],
          'genre' : book[11]
        }
      })
      return myBooks
    }
    default:
      return state
  }
}

export const addBookReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_ADD_BOOKS_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export const returnBookReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_RETURN_BOOKS_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export const borrowBookReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_BORROW_BOOKS_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export const rateBookReducer = (state = false, action) => {
  switch (action.type) {
    case 'RATE_BOOK_SUCCESS':
      return action.payload
    default:
      return state
  }
}
