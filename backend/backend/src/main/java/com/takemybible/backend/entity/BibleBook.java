package com.takemybible.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "bible_books")
public class BibleBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 10)
    private String abbreviation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Testament testament;

    @Column(nullable = false)
    private Integer position;

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    @OrderBy("chapterNumber ASC")
    private List<BibleChapter> chapters;

    public enum Testament {
        OT, NT
    }

    public BibleBook() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public Testament getTestament() {
        return testament;
    }

    public void setTestament(Testament testament) {
        this.testament = testament;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public List<BibleChapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<BibleChapter> chapters) {
        this.chapters = chapters;
    }
}
