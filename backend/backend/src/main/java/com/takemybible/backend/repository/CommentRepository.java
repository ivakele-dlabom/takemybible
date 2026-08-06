package com.takemybible.backend.repository;

import com.takemybible.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByVerseIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long verseId);

    long countByVerseIdAndDeletedAtIsNull(Long verseId);
}
