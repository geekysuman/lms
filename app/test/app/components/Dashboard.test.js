import React from 'react'
import { render } from 'react-dom'
import { mount, shallow } from 'enzyme'
import { Dashboard } from '../../../components/Dashboard'
import { Loader } from '../../../components/Loader'

describe('Dashboard', () => {
  describe('render', () => {
    //  Test : Component gets rendered individually
    it('should render the Dashboard', () => {
      const props = {
        allBooks: [],
        ownerDetails: {},
        loading : {
          allbooksloading  : true,
          addBooksLoading  : false,
          returnBooksLoading   : false,
          rateBookLoading : false
        },
        getAllBooks: jest.fn()
      }
      const actual = mount(<Dashboard {...props}/>)
      const expected = <div>Loading Books</div>
      expect(actual.contains(expected)).toEqual(true)
    })
  })
})
