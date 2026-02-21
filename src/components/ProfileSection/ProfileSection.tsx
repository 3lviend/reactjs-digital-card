import React from 'react';
import styles from './ProfileSection.module.css';

interface ProfileSectionProps {
  name: string;
  backgroundImage: string;
  profileImage: string;
  description: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ name, backgroundImage, profileImage, description }) => {
  return (<div className={styles.profileSection}>
    <img src={backgroundImage} alt={name} className={styles.backgroundImage} />
    <div className={styles.profileContainer}>
      <img src={profileImage} alt={name} className={styles.profileImage} />
    </div>
    <h1 className={styles.profileName}>{name}</h1>
    <p className={styles.profileDescription}>{description}</p>
  </div>);
};

export default ProfileSection;
