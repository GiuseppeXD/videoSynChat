import React, { useState, useEffect, useContext} from 'react';
import {useParams} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import startChannel from '../channels/room_channel'

import '../../assets/stylesheets/room.scss';
import api from '../services/api';

const Room = props => {
    const [urlVideo, setUrlVideo] = useState('');
    const [urlIFrame, setUrlIFrame] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [roomChannel, setRoomChannel] = useState(null);
    const [data, setData] = useState({});
    const { id } = useParams();
    const history = useHistory();

    useEffect(async () => {
        setUserName(localStorage.getItem('videoSynChatUserName'));
        try{
            let apiResponse = await api.get(`api/room/${id}`).then(response=>{
                //console.log(response)
                //console.log(response.data.messages)
                //console.log(response.data.room)
                setUrlIFrame(response.data.room.url_video);
                setMessages(response.data.messages);
                setRoomChannel(startChannel(id, (someData) => { setData(someData)}));
            });
        }catch(err){
            console.log(err)
            alert('Not Found Room');
            history.push('');
        }
        //then websocket sequencial
    },[]);

    useEffect(()=>{
        //console.log('recebeu data')
        //console.log(data)

        switch (data.type){
            case "video_change" :
                setUrlIFrame(data.video);
                break;
            case "message":
                console.log('nova mensagem')
                console.log(data.message)
                let m_id= messages.length != 0 ? messages[messages.length - 1].id + 1 : 1;
                setMessages([...messages,{id: m_id, user: data.name, message: data.message}]);
                break;
        }
    },[data]);

    useEffect(()=>{
        var scrollingElement = (document.getElementById('messages') || document.body); /* you could provide your scrolling element with react ref */
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }, [messages]);
    
    function embedUrl(url){
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11)
            ? match[2]
            : null;
    }

    function handlePlay () {
        //console.log(messages)
        if(id !== userName){
            alert('Only the owner can change the video');
            return;
        }
        if(urlVideo=='' || urlVideo==null){
            alert('Put some url')
            return;
        };
        //console.log(userName)
        let video = `//www.youtube.com/embed/${embedUrl(urlVideo)}`;
        let video_json = { type: 'video_change', video }


        roomChannel.send(video_json)
        //api.post(`api/room/${id}`, {name: id})

        //custom hook
        setUrlIFrame(video)
        scrollToBottom();


    }
    function handleMessage(){
        let name = userName;
        if(name==null || name==''){
            name = prompt("Text a name to you in chat")
            if (name==null || name=='') return
            setUserName(name)
        }
        if(currentMessage=='' || currentMessage==null) return;
        let message_json = { type: "message",name , message: currentMessage}

        roomChannel.send(message_json)
        setCurrentMessage('')
        //console.log(userName)
        //console.log(currentMessage)
    }
    const handleKeyUp = (event) => {
        if (event.keyCode === 13) {
            handleMessage();
        }
    }
    

    return (
        <div className="main-room">
            <div className="video-chat">
                <div className="video-insert">
                    <div className="video-iframe">
                        <iframe src={urlIFrame} className="video" frameBorder="1" allowFullScreen sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
                    </div>
                    <div className="insert">
                        <input type="text"  id="inputUsername" className="form-control" placeholder="video url" onChange={event => setUrlVideo(event.target.value)}/>
                        <button id="playVideo" className="play" onClick={handlePlay}><FiPlay/></button>
                    </div>
                </div>
                <div id="main" className="chat-space">
                    <div className="room-title">
                        <h2 className="room-name">room of {id}</h2>
                    </div>
                    
                    <div className="chat-field">
                        <div id="messages" className="messages-field">
                            <div className="messages">
                            {messages.map(message => (
                                <p key={message.id} 
                                    className={message.user == userName ? 'sent' : 'received'}
                                    >
                                    <span className="user">{message.user == userName ? '' : message.user } </span>
                                    <p className="message-field">
                                        {message.message}
                                    </p>
                                </p>
                            ))}
                            </div>
                            <div id="send_message" className="send-field" onSubmit={handleMessage}>
                                <input type="text" value={currentMessage } onKeyUp={handleKeyUp} onSubmit={handleMessage} id="message" maxLength = "40" name="message" onChange={event => {setCurrentMessage(event.target.value)}}/>
                                <button onClick={handleMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room;