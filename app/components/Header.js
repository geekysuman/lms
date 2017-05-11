import React from 'react'
import OwnerDetails from './OwnerDetails'
import GoogleLogin from 'react-google-login'
import { NavLink } from 'react-router-dom'

const Header = ({ loginSuccess, loginFailure, session, logout }) => (
  <nav className='navbar'>
    <div className='container-fluid'>
      <div className='navbar-header'>
        <a href='http://www.pramati.com/' className='navbar-brand'>
          <img className = 'logo logo-light'
          alt = 'Pramati Technologies'
          src = 'http://www.pramati.com/wp-content/uploads/2016/11/logo_pramati_trans_152.png' />
        </a>
        <span className='navbar-brand' style={{ lineHeight: '55px', verticalAlign: 'bottom' }}>
          LMS ( Alpha Version )
        </span>
      </div>
      <div id='navbar' className='navbar-collapse collapse navbar-right'>
        <ul className='nav navbar-nav'>
          <li>
            <NavLink exact to='/' activeClassName='active'>Home</NavLink>
          </li>
          <li className={(session.authenticated ? '' : 'hide')}>
            <NavLink exact to='/books' activeClassName='active'>Dashboard</NavLink>
          </li>
        </ul>
        {
          session.authenticated
            ? <OwnerDetails data={session.user} logout={() => logout()} />
            : <GoogleLogin
                clientId='672617539191-jqtmbeeu1gc1nvpm2obr2n3m3gtkn8sk.apps.googleusercontent.com'
                buttonText='Login'
                style={{ verticalAlign: 'bottom' }}
                className='btn btn-default'
                onSuccess={(response) => loginSuccess(response)}
                onFailure={(response) => loginFailure(response)}>
                  <span className='glyphicon glyphicon glyphicon-user'></span>&nbsp;&nbsp;
                  <strong>Login</strong>
                </GoogleLogin>
        }
      </div>
    </div>
  </nav>
)

export default Header
