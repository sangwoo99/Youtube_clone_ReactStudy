import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        // 1. 해당 동영상의 구독자수를 조회해옴
        let params = { userTo: props.userTo };
        Axios.post('/api/subscribe/subscribeNumber', params)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.');
                }
            })

        // 2. 내가 해당 동영상을 조회하는지
        let subscribedParams = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }; //로그인할때 localStorage에 저장했던 userId정보를 가져옴
        Axios.post('/api/subscribe/subscribed', subscribedParams)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('정보를 받아오지 못했습니다.');
                }
            })
    }, [])
    
    const onSubscribe = () => {
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom // 접속한 나의 정보
        };

        // 이미 구독 중이라면
        if(Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('구독 취소하는 데 실패했습니다.');
                    }
                })
        // 아직 구독 중이 아니라면
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('구독하는 데 실패했습니다.');
                }
            })
        }
    }

    return (
        <div>
            <button
                style={{ 
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}` , borderRadius: '4px',
                    color: 'white', padding: '10px 16px', fontWeight: '500',
                    fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}

            >
                { SubscribeNumber } { Subscribed ? 'Subsrcibed' : 'Subscribe' }   
            </button>
        </div>
    )
}

export default Subscribe;