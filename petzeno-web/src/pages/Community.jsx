import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, getCommunityPosts, createCommunityPost } from '../lib/api';
import styles from './Community.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Community() {
  const user = getCurrentUser() || {};
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState('Global Feed');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const spaces = [
    { name: 'Global Feed', icon: '🌐', category: null },
    { name: 'Med-Space', icon: '🩺', category: 'Health' },
    { name: 'Adoption-Hub', icon: '🏠', category: 'Adoption' },
    { name: 'Market-Feed', icon: '🛒', category: 'Marketplace' },
    { name: 'Pet-Life', icon: '🐾', category: 'Life' }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getCommunityPosts(selectedCategory);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPostText.trim()) return;
    try {
      // Role-aware posting logic
      const postCategory = user.role === 'vet' ? 'Health' : 
                         user.role === 'shelter' ? 'Adoption' : 
                         user.role === 'store' ? 'Marketplace' : 'Life';
      
      await createCommunityPost({
        authorId: user.id || 'anon',
        author: user.businessName || user.name || 'Anonymous User',
        userType: user.role || 'user',
        category: postCategory,
        text: newPostText,
        authorAvatar: user.avatar || (user.role === 'vet' ? '👩‍⚕️' : user.role === 'shelter' ? '🐕' : user.role === 'store' ? '🛒' : '👩‍💼')
      });
      setNewPostText('');
      loadPosts();
    } catch (err) {
      alert('Failed to post');
    }
  };

  const IdentityBadge = ({ type }) => {
    const configs = {
      vet: { label: 'Professional Vet', color: '#4A90E2', icon: '🩺' },
      shelter: { label: 'Platinum Shelter', color: '#FF7B54', icon: '🏠' },
      store: { label: 'Verified Partner', color: '#10B981', icon: '🛒' },
      user: { label: 'Pet Owner', color: '#64748B', icon: '🐾' }
    };
    const config = configs[type] || configs.user;
    return (
      <span className={styles.identityBadge} style={{ '--badge-color': config.color }}>
        {config.icon} {config.label}
      </span>
    );
  };

  const [particles, setParticles] = useState([]);

  const triggerExplosion = (id) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${id}-${Date.now()}-${i}`,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  return (
    <div className={styles.communityContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Petzeno Social</h1>
          <p className={styles.pageSubtext}>Evolutionary Social Network for the Pet Ecosystem.</p>
        </div>
      </header>

      {/* Spaces Tab Bar */}
      <div className={styles.spacesBar}>
        {spaces.map(space => (
          <button 
            key={space.name}
            className={`${styles.spaceTab} ${activeSpace === space.name ? styles.activeSpace : ''}`}
            onClick={() => {
              setActiveSpace(space.name);
              setSelectedCategory(space.category);
            }}
          >
            <span className={styles.spaceIcon}>{space.icon}</span>
            {space.name}
          </button>
        ))}
      </div>

      <div className={styles.feedLayout}>
        <div className={styles.mainFeed}>
          <motion.div variants={item} className={`${styles.createPostBox} glass-effect ${styles[user.role || 'user']}`}>
            <div className={styles.postInputWrapper}>
              <div className={styles.userAvatar}>
                {user.role === 'vet' ? '👩‍⚕️' : user.role === 'shelter' ? '🐕' : user.role === 'store' ? '🛒' : '👩‍💼'}
              </div>
              <textarea 
                placeholder={
                  user.role === 'vet' ? "Share Professional Medical Advice..." :
                  user.role === 'shelter' ? "Post an Urgent Adoption Update..." :
                  user.role === 'store' ? "Announce a New Deal or Product..." :
                  "What's on your pet's mind today?"
                } 
                className={styles.postInput} 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows="3"
              />
            </div>
            <div className={styles.postActionsBox}>
              <div className={styles.postTemplates}>
                {user.role === 'vet' && <span className={styles.templateTag}>Expert Tip Template</span>}
                {user.role === 'store' && <span className={styles.templateTag}>Mega Deal Template</span>}
              </div>
              <button className={styles.primaryPostBtn} onClick={handlePost}>
                <Send size={16} />
                Authorize Post
              </button>
            </div>
          </motion.div>

          <motion.div 
            className={styles.postsList}
            variants={container}
            initial="hidden"
            animate="show"
            key={activeSpace}
          >
            {loading ? (
              <div className={styles.feedLoading}>
                <div className="radar-pulse"></div>
                Syncing {activeSpace}...
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.emptyFeed}>
                <p>No activity in {activeSpace} yet. <br/>Be the first to authorize a post!</p>
              </div>
            ) : posts.map(post => (
              <motion.div 
                key={post._id || post.author + post.createdAt} 
                variants={item}
                className={`${styles.postCard} glass-effect ${styles[post.userType]}`}
              >
                <div className={styles.postHeader}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.authorAvatar}>
                      {post.authorAvatar?.startsWith('data:image') ? (
                        <img src={post.authorAvatar} alt={post.author} className={styles.feedAvatarImg} />
                      ) : (
                        post.authorAvatar || '👤'
                      )}
                    </div>
                    <div className={styles.activePulse}></div>
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorNameRow}>
                      <h4 className={styles.authorName}>{post.author}</h4>
                      <IdentityBadge type={post.userType} />
                    </div>
                    <span className={styles.authorMeta}>
                      {post.category} Space • {new Date(post.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div className={styles.postContent}>
                  <p>{post.text || post.content}</p>
                  {post.category === 'Marketplace' && (
                    <div className={styles.marketTag}>Direct Purchase Available</div>
                  )}
                </div>

                <div className={styles.postFooter}>
                  <div className={styles.interactionGroup}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      className={`${styles.interactionBtn} ${post.isLiked ? styles.heartActive : ''}`}
                      onClick={(e) => {
                        triggerExplosion(post._id);
                      }}
                    >
                      <Heart size={18} fill={post.isLiked ? "#ff4757" : "none"} />
                      {post.likes?.length || 0}
                      {particles.map(p => (
                        <span 
                          key={p.id} 
                          className={styles.particle} 
                          style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animation: `${styles.explode} 0.6s ease-out forwards` }}
                        />
                      ))}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.interactionBtn}>
                      <MessageCircle size={18} />
                      {post.comments?.length || 0}
                    </motion.button>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.interactionBtn}>
                    <Share2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
