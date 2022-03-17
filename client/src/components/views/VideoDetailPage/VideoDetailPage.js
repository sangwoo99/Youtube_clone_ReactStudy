import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscriber';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId; // app.js에서 route안에 videoId를 넣도록해서 가져올 수 있음
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]); // useEffect안에 쓰면 안됨
    const [Comments, setComments] = useState([]);

    useEffect(() => {  // useEffect는 해당 페이지가 켜지자마자 동작 시키고 싶을때 씀
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    console.log('response.data', response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져올 수 없습니다.');
                }
            });

        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments);
                    console.log('[API-getComments]: ', response.data)
                } else {
                    alert('코멘트 정보를 가져오는 것을 실패하였습니다.');
                }
            })

    }, [])
    
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment)); // Array함수 concat: 두 배열 합치기
    };

    if(VideoDetail.writer) {
        // &&는 앞이 참이면 뒤에 것 리턴, 거짓이면 null 리턴?
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={ VideoDetail.writer._id } userFrom={ localStorage.getItem('userId') }/> ;

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '80%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        {/* VideoDetail.filePath를 가져오기 전에 화면이 렌더링되면 undefined 에러 뜸  */}
                        <List.Item actions={ [ <LikeDislikes userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton ] }>
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            /> 
                        </List.Item>

                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
                    </div>
                </Col>
    
                <Col lg={6} xs={24} >
                    <SideVideo/>
                </Col>
            </Row>
        )
    } else {
        return(
            <div>Loading...</div>
        )
    }
}

export default VideoDetailPage