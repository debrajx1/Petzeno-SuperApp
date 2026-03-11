import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send } from 'lucide-react';
import { getCommunityPosts, createCommunityPost } from '../lib/mockDb';
import styles from './Community.module.css';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getCommunityPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPostText.trim()) return;
    try {
      await createCommunityPost({
        author: 'Dr. Ajay (Verified)',
        text: newPostText,
        authorAvatar: '👨'
      });
      setNewPostText('');
      loadPosts();
    } catch (err) {
      alert('Failed to post');
    }
  };
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
              <input 
                type="text" 
                placeholder="Share an update about your pet..." 
                className={styles.postInput} 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </div>
            <div className={styles.postActionsBox}>
              <button className={styles.iconActionBtn}>
                <ImageIcon size={20} />
                Photo
              </button>
              <button className={styles.primaryPostBtn} onClick={handlePost}>
                <Send size={16} />
                Post
              </button>
            </div>
          </div>

          <div className={styles.postsList}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading feed...</div>
            ) : posts.map(post => (
              <div key={post._id || post.author} className={`${styles.postCard} glass-effect`}>
                <div className={styles.postHeader}>
                  <div className={styles.authorAvatar}>{post.authorAvatar || '👤'}</div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{post.author}</h4>
                    <span className={styles.authorMeta}>Verified User • Just now</span>
                  </div>
                </div>
                
                <div className={styles.postContent}>
                  <p>{post.text || post.content}</p>
                  {post.image && (
                    <div className={styles.postImagePlaceholder}>
                       Photo of {post.author}'s pet
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
