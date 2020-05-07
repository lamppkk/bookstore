import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

import '../css/UserProfile.css';
import { AuthContext } from '../contexts/AuthContext';
import UserInfo from '../components/UserInfo';
import Alert from '../components/Alert';
import UserSideBar from '../components/UserSideBar';

const  UserProfile = () => {
  const { user, userLogin } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [isSave, setSave] = useState(false);

  useEffect(() => {
    document.title = 'Profile - PickBazar'
    setData(user);
    return () => {
      setData({});
    }
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault();
    if (JSON.stringify(data) === JSON.stringify(user)) {
      return;
    }
    const token = localStorage.getItem('token');
    axios.patch('http://localhost:5000/user/update', data, { headers: {"Authorization" : `Bearer ${token}`}})
         .then(res => {
           setSave(true);
           userLogin(token);
         })
         .then(() => {
           setTimeout(() => {
            setSave(false)
           }, 2000)
         })
  }

  const handleInput = (event) => {
    setData({...data, [event.target.name]: event.target.value })
  }

  return(
    <div className="UserProfile user-container">
      <Alert option="edit" isOpen={isSave} />
      <div>
        <UserSideBar page="profile" />
      </div>
      <div className="user-wrapper">
        <div className="profile mb-5">
          <h3 className="bt-header">Your Profile</h3>
          <Form className="AuthForm" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">NAME</Label>
              <Input 
                id="name" 
                type="text" 
                name="name" 
                value={data.name || ''}
                onChange={handleInput}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">EMAIL</Label>
              <Input 
                id="email"
                type="email"
                name="email"
                value={data.email || ''}
                onChange={handleInput}
                required
              />
            </FormGroup>
            <Button type="submit">Save</Button>
          </Form>
        </div>
        <div className="contact mb-5">
          <h3 className="bt-header">Contact Number</h3>
          <UserInfo isPhone handleInput={handleInput} handleSubmit={handleSubmit} data={data}/>
        </div>
        <div className="address">
          <h3 className="bt-header">Delivery Address</h3>
          <UserInfo handleInput={handleInput} handleSubmit={handleSubmit} data={data}/>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;