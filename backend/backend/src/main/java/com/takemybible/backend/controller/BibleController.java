package com.takemybible.backend.controller;

import com.takemybible.backend.entity.BibleBook;
import com.takemybible.backend.entity.BibleChapter;
import com.takemybible.backend.entity.BibleVerse;
import com.takemybible.backend.repository.BibleBookRepository;
import com.takemybible.backend.repository.BibleChapterRepository;
import com.takemybible.backend.repository.BibleVerseRepository;
import com.takemybible.backend.repository.CommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bible")
public class BibleController {

    private final BibleBookRepository bookRepository;
    private final BibleChapterRepository chapterRepository;
    private final BibleVerseRepository verseRepository;
    private final CommentRepository commentRepository;

    public BibleController(BibleBookRepository bookRepository,
                           BibleChapterRepository chapterRepository,
                           BibleVerseRepository verseRepository,
                           CommentRepository commentRepository) {
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.verseRepository = verseRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/books")
    public ResponseEntity<List<Map<String, Object>>> getBooks() {
        List<BibleBook> books = bookRepository.findAllByOrderByPositionAsc();

        List<Map<String, Object>> response = books.stream().map(book -> Map.<String, Object>of(
                "id", book.getId(),
                "name", book.getName(),
                "abbreviation", book.getAbbreviation(),
                "testament", book.getTestament().name(),
                "position", book.getPosition(),
                "chapterCount", book.getChapters().size()
        )).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/books/{bookId}/chapters/{chapterNumber}/verses")
    public ResponseEntity<?> getVerses(@PathVariable Long bookId,
                                       @PathVariable Integer chapterNumber) {

        var chapterOpt = chapterRepository.findByBookIdAndChapterNumber(bookId, chapterNumber);

        if (chapterOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BibleChapter chapter = chapterOpt.get();
        List<BibleVerse> verses = verseRepository.findByChapterIdOrderByVerseNumberAsc(chapter.getId());

        List<Map<String, Object>> response = verses.stream().map(verse -> Map.<String, Object>of(
                "id", verse.getId(),
                "verseNumber", verse.getVerseNumber(),
                "text", verse.getText(),
                "commentCount", commentRepository.countByVerseIdAndDeletedAtIsNull(verse.getId())
        )).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/books/{bookId}/chapters")
    public ResponseEntity<List<Map<String, Object>>> getChapters(@PathVariable Long bookId) {
        List<BibleChapter> chapters = chapterRepository.findByBookIdOrderByChapterNumberAsc(bookId);

        List<Map<String, Object>> response = chapters.stream().map(ch -> Map.<String, Object>of(
                "id", ch.getId(),
                "chapterNumber", ch.getChapterNumber(),
                "verseCount", ch.getVerses().size()
        )).toList();

        return ResponseEntity.ok(response);
    }
}
