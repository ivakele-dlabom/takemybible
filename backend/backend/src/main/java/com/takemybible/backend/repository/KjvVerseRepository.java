package com.takemybible.backend.repository;

import com.takemybible.backend.entity.kjv.Verse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KjvVerseRepository extends JpaRepository<Verse, Long> {

    List<Verse> findByBookIdAndChapterOrderByVerseAsc(Long bookId, int chapter);

    List<Verse> findByBookIdOrderByChapterAscVerseAsc(Long bookId);
}
