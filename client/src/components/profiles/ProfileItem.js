import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({  profile:  profile2  }) => {

  try{
    const {
      user: { _id, name, avatar },
      status,
      company,
      location,
      skills
    } = profile2;

    return (
      <div className='profile bg-light'>
        <img src={avatar} alt='' className='round-img' />
        <div>
          <h2>{name}</h2>
          <p>
            {status} {company && <span> at {company}</span>}
          </p>
          <p className='my-1'>{location && <span>{location}</span>}</p>
          <Link to={`/profile/${_id}`} className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <ul>
          {skills.slice(0, 4).map((skill, index) => (
            <li key={index} className='text-primary'>
              <i className='fas fa-check' /> {skill}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  catch(err){
    console.error(err);
    return (
      <div>
        <h2>Error while fetching data</h2>
      </div>
    )
  }
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
