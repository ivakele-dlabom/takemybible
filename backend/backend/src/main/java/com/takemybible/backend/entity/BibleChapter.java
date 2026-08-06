package com.takemybible.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "bible_chapters")
public class BibleChapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BibleBook book;

    @Column(name = "chapter_number", nullable = false)
    private Integer chapterNumber;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY)
    @OrderBy("verseNumber ASC")
    private List<BibleVerse> verses;

    public BibleChapter() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BibleBook getBook() {
        return book;
    }

    public void setBook(BibleBook book) {
        this.book = book;
    }

    public Integer getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(Integer chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public List<BibleVerse> getVerses() {
        return verses;
    }

    public void setVerses(List<BibleVerse> verses) {
        this.verses = verses;
    }
}
