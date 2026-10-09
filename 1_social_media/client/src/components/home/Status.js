import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../Avatar'
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Status = () => {
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()

  return (
    <div className="status my-3 d-flex align-items-center bg-white p-3 rounded-lg shadow-sm border">
      <Avatar src={auth.user?.avatar} size="big-avatar" />

      <button
        className="statusBtn flex-fill ms-3 border-0 px-3 py-2 text-start rounded-pill text-secondary bg-light"
        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
        style={{ fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease" }}
      >
        What's on your mind, {auth.user?.username}?
      </button>
    </div>
  )
}

export default Status