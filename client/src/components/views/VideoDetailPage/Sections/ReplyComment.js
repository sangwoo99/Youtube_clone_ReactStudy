import React, {useState, useEffect} from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) { // 대댓글 컴포넌트 함수

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
      
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) { // 현재댓글의 아이디와 응답댓글번호를 가진 대댓글이 같으면
                commentNumber ++
            }
        })

        setChildCommentNumber(commentNumber);
    }, [props.commentLists]) // 빈 []이면 처음 한번 로드될때만 실행됨, []안에 값이 바뀔때마다 다시 실행
    
    const renderReplyComment = (parentCommentId) =>  // 중괄호 쓰면 왜 안되지? RSX를 리턴할땐 중괄호 쓰면 안되는듯
        props.commentLists.map((comment, index) => (
            <React.Fragment>
            {
                comment.responseTo === parentCommentId &&
                <div style={{ width: '80%', marginLeft:'40px' }}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} key={index} />
                    <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} parentCommentId= {comment._id} videoId={props.videoId}/>
                </div>
            }
            </React.Fragment>
        ))
    

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    };

  return (
    <div>
        {
            ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comments(s)
                </p>
        }

        {
            OpenReplyComments && renderReplyComment(props.parentCommentId)
        }
    </div>
  )
}

export default ReplyComment