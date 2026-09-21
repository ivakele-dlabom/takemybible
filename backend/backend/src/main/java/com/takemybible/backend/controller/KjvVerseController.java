package com.takemybible.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.takemybible.backend.entity.kjv.Verse;
import com.takemybible.backend.repository.KjvVerseRepository;

import java.util.List;

@RestController
@RequestMapping("/api/kjv/verses")
public class KjvVerseController {

    private final KjvVerseRepository verseRepository;

    public KjvVerseController ( KjvVerseRepository verseRepository) {
        this.verseRepository = verseRepository;
    }

    @GetMapping("/{toBookId}/{toChapter}/{toVerseStart}/{toVerseEnd}")
    public ResponseEntity<List<Verse>> getVerse(
            @PathVariable Integer toBookId,
            @PathVariable Integer toChapter,
            @PathVariable Integer toVerseStart,
            @PathVariable Integer toVerseEnd) {

            if (toVerseStart > toVerseEnd) {
                return ResponseEntity.badRequest().build();
            }

            List<Verse> verses = verseRepository
                .findByBookIdAndChapterAndVerseBetweenOrderByVerseAsc(
                        toBookId, toChapter, toVerseStart, toVerseEnd);

            if (verses.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(verses);
            }
}
