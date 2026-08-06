package com.takemybible.backend.repository;

import com.takemybible.backend.entity.BibleChapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface BibleChapterRepository extends JpaRepository<BibleChapter, Long> {

    List<BibleChapter> findByBookIdOrderByChapterNumberAsc(Long bookId);

    Optional<BibleChapter> findByBookIdAndChapterNumber(Long bookId, Integer chapterNumber);
}
