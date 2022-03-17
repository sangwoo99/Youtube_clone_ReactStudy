import React,{ useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) { //댓글 컴포넌트 함수
    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState('');

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    };

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const params = {
            content: CommentValue,
            writer: user.userData._id, // 작성자 번호
            postId: props.postId, // 게시글(영상) 번호
            responseTo: props.comment._id // 대댓글 대상의 댓글 번호
        };

        Axios.post('/api/comment/saveComment', params) 
        .then(response => {
            if(response.data.success) {
                console.log(response.data);
                setCommentValue('');
                setOpenReply(false);
                props.refreshFunction(response.data.result);
            } else {
                alert('커텐트를 저장하지 못했습니다.')
            }
        });
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ];

  return (
    <div>
        <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar={<Avatar src={props.comment.writer.image} alt/>}
            content={<p>{props.comment.content}</p>}
        />

        {
            OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요"
                    />
                    <br/>
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </form>
        }
    </div>
  )
}

export default SingleComment