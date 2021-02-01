import React, { useState} from 'react';
import { useHistory } from 'react-router-dom';
import { FiAirplay } from 'react-icons/fi';

import api from '../services/api'

import '../../assets/stylesheets/home.scss';

const Home= () => {
    const [name, setName] = useState('');
    const history = useHistory();

    async function handleToRoom() {
        //criar url aleatoria ou com nome da pessoa, salvar nome da pessoa e ir para sala
        //passar nome da pessoa pelas props de room pra já estar logado no chat

        //console.log(inputUsername.value);
        localStorage.setItem('videoSynChatUserName', name);
        const response = await api.post('api/room', {name: name});

        //console.log(localStorage.getItem('videoSynChatUserName'));
        
        history.push(`/room/${name}`);
    }

    return (
        <div className="main">
            <h1 className="header">
                VideoSynChat
            </h1>
            <div className="sub-header">
                Welcome, put a name and create your room
            </div>
            <div className="input-group">
                
                <input type="text" id="inputUsername" className="form-control" placeholder="Your Name" onChange={event => setName(event.target.value)}/>
                
                <button id="createRoomButton" className="botton" onClick={handleToRoom}><FiAirplay/></button>   
            </div>
        </div>
    )
}

export default Home;