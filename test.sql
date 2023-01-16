SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count 
FROM reviews 
JOIN comments 
ON reviews.review_id = comments.review_id
GROUP BY reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes
ORDER BY reviews.created_at;

-- reviews.owner
-- title
-- review_id
-- category
-- review_img_url
-- created_at
-- votes
-- designer
-- comment_count