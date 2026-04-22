import React, { useState } from 'react'

function Comment({ comment, depth = 0 }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [localReplies, setLocalReplies] = useState(comment.replies || [])

  function handleLike() {
    if (liked) return
    setLiked(true)
    setLikeCount(c => c + 1)
  }

  function handleSubmitReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    const newReply = {
      id: `local-${Date.now()}`,
      authorName: 'You',
      authorInitials: 'Y',
      content: replyText.trim(),
      likeCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    }
    setLocalReplies(r => [...r, newReply])
    setReplyText('')
    setShowReply(false)
  }

  function formatTime(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-sm font-semibold">
          {comment.authorInitials}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-navy text-sm">{comment.authorName}</span>
            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-gold font-semibold' : 'text-gray-400 hover:text-gold'}`}
            >
              <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount}
            </button>
            {depth < 2 && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-gray-400 hover:text-navy transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReply && (
            <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
              <button type="submit" className="text-sm bg-navy text-white px-4 py-2 rounded-lg hover:bg-gold transition-colors">
                Post
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {localReplies.length > 0 && (
        <div>
          {localReplies.map(reply => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentThread({ comments = [], sermonId, isAuthenticated }) {
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(comments)

  function handleSubmit(e) {
    e.preventDefault()
    if (!newComment.trim()) return
    const comment = {
      id: `local-${Date.now()}`,
      sermonId,
      authorName: 'You',
      authorInitials: 'Y',
      content: newComment.trim(),
      likeCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    }
    setLocalComments(c => [comment, ...c])
    setNewComment('')
  }

  return (
    <div>
      <h3 className="font-serif text-navy text-xl font-semibold mb-5">
        Discussion <span className="text-gray-400 font-sans font-normal text-base">({localComments.length})</span>
      </h3>

      {/* Comment input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share a reflection, question, or encouragement..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-cream-dark border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-500 text-center">
          <a href="/login" className="text-gold hover:text-gold-dark font-semibold">Sign in</a> to join the discussion.
        </div>
      )}

      {/* Comments list */}
      <div className="divide-y divide-gray-100">
        {localComments.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-6 text-center">No comments yet. Be the first to reflect.</p>
        ) : (
          localComments.map(comment => (
            <Comment key={comment.id} comment={comment} depth={0} />
          ))
        )}
      </div>
    </div>
  )
}
