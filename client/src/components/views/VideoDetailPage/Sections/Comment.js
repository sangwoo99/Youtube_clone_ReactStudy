import Axios from 'axios';
import React , { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector(state => state.user); //리덕스안에 있는 state에서 state.user를 가져옴
  const [commentValue, setCommentValue] = useState('');

  const handleClick = (event) => {
    setCommentValue(event.currentTarget.value);
  }

  const onSubmit = (event) => {
    event.preventDefault(); // 폼 전송눌렀을때 새로고침되는 것을 막아줌

    const params = {
        content: commentValue,
        writer: user.userData._id,
        postId: videoId
    };

    Axios.post('/api/comment/saveComment', params)
      .then(response => {
        if(response.data.success) {
          console.log(response.data);
          setCommentValue('');
          props.refreshFunction(response.data.result);
        } else {
            alert('커텐트를 저장하지 못했습니다.')
        }
      })

  }
  return (
    <div>
        <br/>
        <p> Replies</p>
        <hr/>

        {/* Comment Lists */}

        { // && 앞에가 존재하면 뒤에것 리턴, 태그를 리턴할땐 ()로 감싸져야
          // responseTo(~댓글의 대댓글인지)가 없을때 그냥 댓글들 노출
         props.commentLists && props.commentLists.map((comment, index) => (
           (!comment.responseTo && 
              <React.Fragment>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} key={index} />
                <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} parentCommentId= {comment._id} videoId={videoId}/>
              </React.Fragment>
            )
         )) 
        }

        {/* Root Comment Form */}
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
            <textarea
              style={{ width: '100%', borderRadius: '5px' }}
              onChange={handleClick}
              value={commentValue}
              placeholder="코멘트를 작성해 주세요"
            />
            <br/>
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
        </form>
    </div>
  )
}

export default Comment


//rfce로 함수형 컴포넌트 기본틀 자동생성