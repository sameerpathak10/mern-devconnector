import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import { getPost } from '../../actions/postAction';

const Post = ({ getPost, post: { post, loading }, match }) => {
  try{
    useEffect(() => {
      getPost(match.params.id);
    }, [getPost, match.params.id]);
    console.log(post);
    return (
      /*loading || post === null ? ( <Spinner /> ) : */
      (
        <Fragment>
          <Link to="/posts" className="btn">
            Back To Posts
          </Link>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <div className="comments">
            {post.comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
          </div>
        </Fragment>
      )
    );
  }
  catch(err){
    console.error(err);
    return( <div><h2>Error while fetching comment</h2></div>);
  }
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
