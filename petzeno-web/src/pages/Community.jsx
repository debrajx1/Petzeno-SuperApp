import React from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send } from 'lucide-react';
import styles from './Community.module.css';

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Sarah Jenkins',
    authorRole: 'Pet Parent',
    avatar: '👩',
    time: '2 hours ago',
    content: 'Max had his first successful swimming lesson today! He was a bit hesitant at first but ended up loving the water. 🌊🐾',
    likes: 45,
    comments: 12,
    image: true
  },
  {
    id: 2,
    author: 'City Center Shelter',
    authorRole: 'Shelter Manager',
    avatar: '🏥',
    time: '5 hours ago',
    content: '🚨 Urgent Adoptions Needed! 🚨 We currently have 5 senior dogs looking for their forever homes. Check our available pets page to meet them.',
    likes: 128,
    comments: 34,
    image: false
  },
  {
    id: 3,
    author: 'Dr. Alan Grant',
    authorRole: 'Veterinarian',
    avatar: '👨‍⚕️',
    time: '1 day ago',
    content: 'As the weather gets warmer, please remember to check your pets for ticks after walks in long grass! #PetHealth #VetTips',
    likes: 245,
    comments: 18,
    image: false
  }
];

export default function Community() {
  return (
    <div className={styles.communityContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Petzeno Community</h1>
          <p className={styles.pageSubtext}>Connect, share, and learn with other pet owners and service providers.</p>
        </div>
      </header>

      <div className={styles.feedLayout}>
        <div className={styles.mainFeed}>
          <div className={`${styles.createPostBox} glass-effect`}>
            <div className={styles.postInputWrapper}>
              <div className={styles.userAvatar}>👨</div>
              <input type="text" placeholder="Share an update about your pet..." className={styles.postInput} />
            </div>
            <div className={styles.postActionsBox}>
              <button className={styles.iconActionBtn}>
                <ImageIcon size={20} />
                Photo
              </button>
              <button className={styles.primaryPostBtn}>
                <Send size={16} />
                Post
              </button>
            </div>
          </div>

          <div className={styles.postsList}>
            {COMMUNITY_POSTS.map(post => (
              <div key={post.id} className={`${styles.postCard} glass-effect`}>
                <div className={styles.postHeader}>
                  <div className={styles.authorAvatar}>{post.avatar}</div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{post.author}</h4>
                    <span className={styles.authorMeta}>{post.authorRole} • {post.time}</span>
                  </div>
                </div>
                
                <div className={styles.postContent}>
                  <p>{post.content}</p>
                  {post.image && (
                    <div className={styles.postImagePlaceholder}>
                       Photo of Max swimming
                    </div>
                  )}
                </div>

                <div className={styles.postFooter}>
                  <button className={styles.interactionBtn}>
                    <Heart size={18} />
                    {post.likes}
                  </button>
                  <button className={styles.interactionBtn}>
                    <MessageCircle size={18} />
                    {post.comments}
                  </button>
                  <button className={styles.interactionBtn}>
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <div className={`${styles.sideCard} glass-effect`}>
            <h3 className={styles.sideCardTitle}>Trending Topics</h3>
            <ul className={styles.trendingList}>
              <li>#SummerPetCare</li>
              <li>#AdoptionStories</li>
              <li>#PetNutrition</li>
              <li>#TrainingTips</li>
            </ul>
          </div>
          
          <div className={`${styles.sideCard} glass-effect`}>
            <h3 className={styles.sideCardTitle}>Upcoming Events</h3>
            <div className={styles.eventItem}>
              <div className={styles.eventDate}>
                <span className={styles.month}>Oct</span>
                <span className={styles.day}>14</span>
              </div>
              <div className={styles.eventDetails}>
                <h4>Local Adoption Drive</h4>
                <p>City Center Park</p>
              </div>
            </div>
            <div className={styles.eventItem}>
              <div className={styles.eventDate}>
                <span className={styles.month}>Oct</span>
                <span className={styles.day}>20</span>
              </div>
              <div className={styles.eventDetails}>
                <h4>Free Vaccination Camp</h4>
                <p>Northside Clinic</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
