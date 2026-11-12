package com.takemybible.backend.repository;

import com.takemybible.backend.entity.kjv.Verse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface KjvVerseRepository extends JpaRepository<Verse, Integer> {

    List<Verse> findByBookIdAndChapterOrderByVerseAsc(Integer bookId, int chapter);

    List<Verse> findByBookIdOrderByChapterAscVerseAsc(Integer bookId);
    List<Verse> findByBookIdAndChapterAndVerseBetweenOrderByVerseAsc(Integer bookId, Integer chapter, Integer verseStart, Integer verseEnd);
    Optional<Verse> findByBookIdAndChapterAndVerse(Integer bookId, Integer chapter, Integer verse);
}
