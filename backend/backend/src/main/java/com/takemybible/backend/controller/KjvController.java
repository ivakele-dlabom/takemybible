package com.takemybible.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.takemybible.backend.entity.kjv.Book;
import com.takemybible.backend.entity.kjv.Verse;
import com.takemybible.backend.repository.KjvRepository;
import com.takemybible.backend.repository.KjvVerseRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kjv")
public class KjvController {

    private final KjvRepository kjvRepository;
    private final KjvVerseRepository verseRepository;

    public KjvController(KjvRepository kjvRepository, KjvVerseRepository verseRepository) {
        this.kjvRepository = kjvRepository;
        this.verseRepository = verseRepository;
    }

    /**
     * Returns all books in the KJV Bible.
     */
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getBooks() {
        List<Book> books = kjvRepository.findAllByOrderByIdAsc();
        return ResponseEntity.ok(books);
    }

    /**
     * Returns a single book by ID.
     */
    @GetMapping("/books/{bookId}")
    public ResponseEntity<Book> getBook(@PathVariable Long bookId) {
        return kjvRepository.findById(bookId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all chapters for a given book (as a list of chapter numbers).
     */
    @GetMapping("/books/{bookId}/chapters")
    public ResponseEntity<List<Integer>> getChapters(@PathVariable Long bookId) {
        if (kjvRepository.findById(bookId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Verse> verses = verseRepository.findByBookIdOrderByChapterAscVerseAsc(bookId);

        List<Integer> chapters = verses.stream()
                .map(Verse::getChapter)
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(chapters);
    }

    /**
     * Returns all verses for a given book and chapter.
     */
    @GetMapping("/books/{bookId}/chapters/{chapter}/verses")
    public ResponseEntity<List<Map<String, Object>>> getVerses(
            @PathVariable Long bookId,
            @PathVariable int chapter) {

        if (kjvRepository.findById(bookId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Verse> verses = verseRepository.findByBookIdAndChapterOrderByVerseAsc(bookId, chapter);

        List<Map<String, Object>> response = verses.stream().map(v -> Map.<String, Object>of(
                "id", v.getId(),
                "verse", v.getVerse(),
                "text", v.getText(),
                "chapter", v.getChapter()
        )).toList();

        return ResponseEntity.ok(response);
    }
}
