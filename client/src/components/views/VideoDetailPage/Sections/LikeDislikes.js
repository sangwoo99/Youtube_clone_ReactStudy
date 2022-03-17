import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let params = {};
  
  if(props.video) {
    params = { videoId: props.videoId , userId: props.userId };
  } else { // SingleComment일때
    params = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    //좋아요
    Axios.post('/api/like/getLikes', params)
      .then(response => {
        if(response.data.success) {
          // 얼마나 많은 좋아요를 받았는지
          setLikes(response.data.likes.length);

          // 내가 이미 그 좋아요를 눌렀는지
          response.data.likes.map(like => {
            if(like.userId === props.userId) { // 비디오나 댓글에 대한 모든 좋아요중에 내가 누른 좋아요가 있으면
              setLikeAction('liked')
            }
          })
        } else {
          alert('Likes에 정보를 가져오지 못했습니다.')
        }
      });

    //싫어요
    Axios.post('/api/like/getDislikes', params)
    .then(response => {
      if(response.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);

        // 내가 이미 그 싫어요를 눌렀는지
        response.data.dislikes.map(dislike => {
          if(dislike.userId === props.userId) { // 비디오나 댓글에 대한 모든 좋아요중에 내가 누른 좋아요가 있으면
            setDislikeAction('disliked');
          }
        })
      } else {
        alert('Dislikes에 정보를 가져오지 못했습니다.');
      }
    });

  }, []);

  const onLike = () => { // 좋아요 누름
      if(LikeAction === null) { // 기존에 내가 좋아요를 안눌렀으면
        Axios.post('/api/like/upLike', params)
          .then(response => {
            if (response.data.success) {
              setLikes(Likes + 1);
              setLikeAction('liked');

              // 기존에 내가 싫어요를 누른상태, 좋아요 누를시 싫어요 해제, 싫어요 수 감소
              if(DislikeAction !== null) { 
                setDislikes(Dislikes - 1);
                setDislikeAction(null);
              }

            } else {
              alert('Like를 올리지 못하였습니다.');
            }
          })
      } else { // 기존에 내가 좋아요를 눌렀으면
        Axios.post('/api/like/unLike', params)
        .then(response => {
          if (response.data.success) {
            setLikes(Likes - 1);
            setLikeAction(null);

          } else {
            alert('Like를 내리지 못하였습니다.');
          }

        })
      }
  };

  const onDislike = () => {
    //이미 싫어요 누른 상태
    if(DislikeAction !== null) {

      Axios.post('/api/like/unDislike', params)
        .then(response => {
          if(response.data.success) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          } else {
            alert('dislike를 지우지 못했습니다.');
          }
        });

    } else { // 싫어요 안누른 상태

      Axios.post('/api/like/upDislike', params)
      .then(response => {
        if(response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked');

          // 좋아요 누른 상태
          if(setLikeAction !== null) {
            setLikes(Likes - 1);
            setLikeAction(null);
          }
        } else {
          alert('dislike를 지우지 못했습니다.');
        }
      });
      
    } 
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon type="like"
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto'}}> {Likes} </span>
      </span>&nbsp;&nbsp;

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon type="dislike"
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto'}}> {Dislikes} </span>
      </span>&nbsp;&nbsp;
    </div>
  )
}

export default LikeDislikes