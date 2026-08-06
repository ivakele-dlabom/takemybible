package com.takemybible.backend.repository;

import com.takemybible.backend.entity.BibleVerse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BibleVerseRepository extends JpaRepository<BibleVerse, Long> {

    List<BibleVerse> findByChapterIdOrderByVerseNumberAsc(Long chapterId);

    Optional<BibleVerse> findByChapterIdAndVerseNumber(Long chapterId, Integer verseNumber);
}
