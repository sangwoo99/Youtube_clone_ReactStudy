import React, { useEffect, useState } from 'react'
import { Typography, Card, Icon, Avatar, Col, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment'
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {

    const [Video, setVideo] = useState([]);
    //dom실행되자마자 한번 실행할 것을 정의
    useEffect(() => {
        // 로그인한 유저가 구독하는 모든 채널들을 가져옴
        const subscriptionParams = {
            userFrom: localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subscriptionParams)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    setVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다.')
                }
            })
    }, [])

    const renderCards = Video.map((video, index) => {
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor((video.duration - minutes * 60));

        // 반응형 사이즈 lg가장 클때, md 중간, xs 가장 작을때 
        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt=""></img>
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br/>
            <Meta 
                avatar={ <Avatar src={video.writer.image}/> }
                title={video.title} 
                description=""
            />
            <span>{video.writer.name}</span> <br/>
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}> 
            <Title level={2}> Recommend </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage;